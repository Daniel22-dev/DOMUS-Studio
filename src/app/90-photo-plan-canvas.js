/* Image handling, photo annotations and 2D plan canvas. Source fragment; assembled by scripts/build.mjs. */
  async function importPhoto() {
    const file = photoInput.files?.[0];
    photoInput.value = '';
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 1800, 1300, 0.86);
      const project = currentProject();
      const photo = currentVariant(project).photo;
      photo.dataUrl = dataUrl;
      photo.annotations = [];
      photo.calibration = null;
      await saveProject(project);
      toast('Fotografie byla vložena do projektu.');
      render();
    } catch (error) {
      console.error(error);
      toast('Fotografii se nepodařilo načíst.', 'error');
    }
  }

  async function importComparisonImage(event, kind) {
    const input = event.target;
    const file = input.files?.[0];
    input.value = '';
    if (!file) return;
    try {
      const dataUrl = await resizeImage(file, 1800, 1300, 0.88);
      const project = currentProject();
      const comparison = currentVariant(project).comparison;
      if (kind === 'before') comparison.beforeDataUrl = dataUrl;
      else comparison.afterDataUrl = dataUrl;
      await saveProject(project);
      toast(kind === 'before' ? 'Fotografie „před“ byla vložena.' : 'Vizualizace „po“ byla vložena.');
      render();
    } catch (error) {
      console.error(error);
      toast('Obrázek se nepodařilo načíst.', 'error');
    }
  }

  function resizeImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(reader.error);
      reader.onload = () => {
        const image = new Image();
        image.onerror = reject;
        image.onload = () => {
          const ratio = Math.min(maxWidth / image.width, maxHeight / image.height, 1);
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(image.width * ratio);
          canvas.height = Math.round(image.height * ratio);
          canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  function setupPhotoCanvas() {
    const canvas = document.getElementById('photoCanvas');
    const project = currentProject();
    const variant = currentVariant(project);
    if (!canvas || !variant?.photo?.dataUrl) return;
    const image = new Image();
    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      const draw = (preview = null) => drawPhotoCanvas(canvas, image, variant.photo, preview);
      draw();
      let start = null;
      canvas.style.cursor = state.photoTool === 'note' ? 'text' : 'crosshair';

      canvas.onpointerdown = async (event) => {
        const point = pointerPoint(canvas, event);
        if (state.photoTool === 'note') {
          const text = await askValue({ title: 'Poznámka do fotografie', label: 'Text poznámky', required: true });
          if (!text) return;
          variant.photo.annotations.push({ id: uid('annotation'), type: 'note', x: point.x, y: point.y, text });
          saveProject(project);
          draw();
          return;
        }
        start = point;
        canvas.setPointerCapture(event.pointerId);
      };

      canvas.onpointermove = (event) => {
        if (!start) return;
        const point = pointerPoint(canvas, event);
        draw({ x1: start.x, y1: start.y, x2: point.x, y2: point.y, type: state.photoTool });
      };

      canvas.onpointerup = async (event) => {
        if (!start) return;
        const end = pointerPoint(canvas, event);
        const distance = Math.hypot(end.x - start.x, end.y - start.y);
        if (distance < 8) {
          start = null;
          draw();
          return;
        }
        if (state.photoTool === 'calibrate') {
          const mm = Number(await askValue({ title: 'Kalibrace fotografie', label: 'Skutečná vzdálenost v milimetrech', value: '1000', type: 'number', min: 1, required: true }));
          if (mm > 0) {
            variant.photo.calibration = { pixels: distance, mm };
            variant.photo.annotations.push({ id: uid('annotation'), type: 'calibration', x1: start.x, y1: start.y, x2: end.x, y2: end.y, label: `${Math.round(mm)} mm · kalibrační rozměr` });
            toast('Měřítko fotografie bylo nastaveno.');
          }
        } else {
          let computed = null;
          if (variant.photo.calibration) {
            computed = distance * (variant.photo.calibration.mm / variant.photo.calibration.pixels);
          }
          const defaultLabel = computed ? `${Math.round(computed)} mm` : '';
          const label = await askValue({ title: 'Kóta ve fotografii', label: 'Popisek nebo ověřená hodnota', value: defaultLabel, help: computed ? 'Hodnota byla odvozena z kalibrace. Před realizací ji ověřte.' : 'Bez kalibrace zadejte hodnotu ručně.' });
          if (label !== null) {
            variant.photo.annotations.push({ id: uid('annotation'), type: 'measure', x1: start.x, y1: start.y, x2: end.x, y2: end.y, label: label || 'Rozměr neuveden', derived: Boolean(computed) });
          }
        }
        start = null;
        await saveProject(project);
        draw();
        if (state.photoTool === 'calibrate') render();
      };
    };
    image.src = variant.photo.dataUrl;
  }

  function drawPhotoCanvas(canvas, image, photo, preview = null) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const overlay = ctx.createLinearGradient(0, 0, 0, canvas.height);
    overlay.addColorStop(0, 'rgba(6,12,17,.02)');
    overlay.addColorStop(1, 'rgba(6,12,17,.12)');
    ctx.fillStyle = overlay;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    photo.annotations.forEach((annotation) => drawPhotoAnnotation(ctx, annotation));
    if (preview) drawPhotoAnnotation(ctx, { ...preview, label: preview.type === 'calibrate' ? 'Kalibrační rozměr' : 'Nová kóta' }, true);
  }

  function drawPhotoAnnotation(ctx, item, preview = false) {
    ctx.save();
    ctx.lineWidth = Math.max(2, ctx.canvas.width / 650);
    ctx.font = `700 ${Math.max(15, ctx.canvas.width / 70)}px system-ui`;
    ctx.textBaseline = 'middle';
    if (item.type === 'note') {
      const padding = 10;
      const metrics = ctx.measureText(item.text);
      const width = metrics.width + padding * 2;
      ctx.fillStyle = 'rgba(9,17,22,.86)';
      roundRect(ctx, item.x, item.y - 19, width, 38, 8);
      ctx.fill();
      ctx.fillStyle = '#f3d09b';
      ctx.fillText(item.text, item.x + padding, item.y);
      ctx.restore();
      return;
    }
    const color = item.type === 'calibration' ? '#6fd1a5' : (preview ? '#f1ce95' : '#f5bd6b');
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.setLineDash(item.derived ? [12, 7] : []);
    ctx.beginPath();
    ctx.moveTo(item.x1, item.y1);
    ctx.lineTo(item.x2, item.y2);
    ctx.stroke();
    drawArrowHead(ctx, item.x2, item.y2, item.x1, item.y1, color);
    drawArrowHead(ctx, item.x1, item.y1, item.x2, item.y2, color);
    const midX = (item.x1 + item.x2) / 2;
    const midY = (item.y1 + item.y2) / 2;
    const label = item.label || '';
    const metrics = ctx.measureText(label);
    const boxWidth = metrics.width + 22;
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(8,15,20,.88)';
    roundRect(ctx, midX - boxWidth / 2, midY - 18, boxWidth, 36, 8);
    ctx.fill();
    ctx.fillStyle = color;
    ctx.fillText(label, midX - metrics.width / 2, midY);
    ctx.restore();
  }

  function drawArrowHead(ctx, x, y, fromX, fromY, color) {
    const angle = Math.atan2(y - fromY, x - fromX);
    const size = Math.max(11, ctx.canvas.width / 90);
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - size * Math.cos(angle - Math.PI / 7), y - size * Math.sin(angle - Math.PI / 7));
    ctx.lineTo(x - size * Math.cos(angle + Math.PI / 7), y - size * Math.sin(angle + Math.PI / 7));
    ctx.closePath();
    ctx.fill();
  }

  function pointerPoint(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }
  // selectedElementDefinition is implemented by the premium fragment loaded later in the build.
  // setupPlanCanvas is implemented by the premium fragment loaded later in the build.

  function drawPlanCanvas(canvas, variantOrPlan, preview = null) {
    const variant = variantOrPlan?.plan ? variantOrPlan : { plan: variantOrPlan, section: null, materials: [] };
    const plan = variant.plan;
    const ctx = canvas.getContext('2d'); const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height); ctx.fillStyle = '#111b22'; ctx.fillRect(0, 0, width, height); drawGrid(ctx, plan.scale);

    if (plan.layerVisibility?.architecture !== false) plan.walls.forEach((wall, index) => drawWall2D(ctx, wall, plan, index + 1));
    plan.objects.filter((object) => plan.layerVisibility?.[object.layer] !== false).forEach((object) => drawObject2D(ctx, object, plan, variant));
    if (variant.section) drawSectionLineOnPlan(ctx, variant);

    if (preview) {
      ctx.save(); ctx.globalAlpha = 0.75;
      if (preview.tool === 'wall') drawWall2D(ctx, { id: 'preview', x1: preview.start.x, y1: preview.start.y, x2: preview.end.x, y2: preview.end.y }, plan, null, true);
      if (preview.tool === 'object') {
        const def = preview.definition; const draggedWidth = Math.abs(preview.end.x - preview.start.x); const draggedDepth = Math.abs(preview.end.y - preview.start.y);
        const w = draggedWidth > 15 ? draggedWidth : def.width / 1000 * plan.scale; const d = draggedDepth > 15 ? draggedDepth : def.depth / 1000 * plan.scale;
        drawObject2D(ctx, { type:def.name, layer:def.layer, shape:def.shape, x:draggedWidth>15?Math.min(preview.start.x,preview.end.x):preview.start.x-w/2, y:draggedDepth>15?Math.min(preview.start.y,preview.end.y):preview.start.y-d/2, width:w, depth:d, color:def.color, height:def.height }, plan, variant, true);
      }
      ctx.restore();
    }

    ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.font = '12px system-ui';
    ctx.fillText(`Měřítko: ${plan.scale} px = 1 m · Shift drží směr · aktivní vrstva: ${LAYERS[state.activeLayer]?.label || ''}`, 18, height - 18);
  }

  function drawGrid(ctx, scale) {
    const small = scale / 5;
    for (let x = 0; x <= ctx.canvas.width; x += small) { ctx.strokeStyle = x % scale === 0 ? 'rgba(255,255,255,.085)' : 'rgba(255,255,255,.03)'; ctx.lineWidth = x % scale === 0 ? 1.2 : 1; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ctx.canvas.height); ctx.stroke(); }
    for (let y = 0; y <= ctx.canvas.height; y += small) { ctx.strokeStyle = y % scale === 0 ? 'rgba(255,255,255,.085)' : 'rgba(255,255,255,.03)'; ctx.lineWidth = y % scale === 0 ? 1.2 : 1; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.canvas.width, y); ctx.stroke(); }
  }

  function drawWall2D(ctx, wall, plan, index, preview = false) {
    const thickness = Math.max(8, plan.wallThickness * plan.scale);
    ctx.save(); ctx.strokeStyle = preview ? '#e9c38c' : LAYERS.architecture.color; ctx.lineWidth = thickness; ctx.lineCap = 'square'; ctx.beginPath(); ctx.moveTo(wall.x1, wall.y1); ctx.lineTo(wall.x2, wall.y2); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(wall.x1, wall.y1); ctx.lineTo(wall.x2, wall.y2); ctx.stroke();
    const lengthM = Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) / plan.scale; const midX = (wall.x1 + wall.x2) / 2; const midY = (wall.y1 + wall.y2) / 2; const label = `${lengthM.toFixed(2)} m${index ? ` · S${index}` : ''}`;
    if(plan.showDimensions!==false){ctx.font = '700 12px system-ui'; const metrics = ctx.measureText(label); ctx.fillStyle = 'rgba(7,13,18,.9)'; roundRect(ctx, midX - metrics.width / 2 - 7, midY - 25, metrics.width + 14, 21, 6); ctx.fill(); ctx.fillStyle = preview ? '#f1ce95' : '#f4dfbf'; ctx.fillText(label, midX - metrics.width / 2, midY - 14);} ctx.restore();
  }

  function drawObject2D(ctx, object, plan, variant = currentVariant(), preview = false) {
    const linked = variant?.materials?.find((item) => item.id === object.materialId);
    const color = linked?.swatch || object.color || LAYERS[object.layer]?.color || '#71838f';
    ctx.save(); const objectCx=object.x+object.width/2,objectCy=object.y+object.depth/2; if(object.rotation){ctx.translate(objectCx,objectCy);ctx.rotate((Number(object.rotation)||0)*Math.PI/180);ctx.translate(-objectCx,-objectCy);} ctx.globalAlpha = preview ? .55 : .86; ctx.fillStyle = color; ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.5;
    const shape = object.shape || 'box';
    if (shape === 'circle' || shape === 'oval') { ctx.beginPath(); ctx.ellipse(object.x + object.width/2, object.y + object.depth/2, Math.max(4,object.width/2), Math.max(4,object.depth/2), 0, 0, Math.PI*2); ctx.fill(); ctx.stroke(); }
    else { roundRect(ctx, object.x, object.y, Math.max(4,object.width), Math.max(4,object.depth), shape === 'line' ? Math.min(8,object.depth/2) : 4); ctx.fill(); ctx.stroke(); }
    if (shape === 'door') { ctx.strokeStyle='rgba(255,255,255,.65)'; ctx.beginPath(); ctx.arc(object.x, object.y + object.depth, Math.max(object.width, object.depth), -Math.PI/2, 0); ctx.stroke(); }
    if (shape === 'area') { ctx.strokeStyle='rgba(255,255,255,.25)'; for(let x=object.x;x<object.x+object.width;x+=12){ctx.beginPath();ctx.moveTo(x,object.y);ctx.lineTo(x+object.depth,object.y+object.depth);ctx.stroke();} }
    ctx.globalAlpha = 1; const labelY = object.y + Math.min(16, Math.max(12, object.depth/2)); ctx.fillStyle = '#eef4f6'; ctx.font = '700 10px system-ui'; ctx.fillText(object.type, object.x + 6, labelY);
    if (plan.showDimensions!==false && object.width > 45 && object.depth > 24) { ctx.font = '9px system-ui'; ctx.fillStyle = 'rgba(238,244,246,.78)'; ctx.fillText(`${(object.width/plan.scale).toFixed(2)} × ${(object.depth/plan.scale).toFixed(2)} m`, object.x + 6, labelY + 13); }
    const layer = LAYERS[object.layer]; if (layer) { ctx.fillStyle = layer.color; ctx.font = '800 9px system-ui'; ctx.fillText(layer.short, object.x + Math.max(4,object.width) - ctx.measureText(layer.short).width - 4, object.y + Math.min(12, Math.max(10,object.depth-3))); }
    ctx.restore();
  }

  function drawSectionLineOnPlan(ctx, variant) {
    const points = [];
    variant.plan.walls.forEach((wall) => points.push([wall.x1,wall.y1],[wall.x2,wall.y2]));
    if (!points.length) return;
    const bounds = computeBounds(points); const ratio = clamp(parseNum(variant.section.position,50)/100,0,1); const vertical = variant.section.orientation === 'x';
    const value = vertical ? bounds.minX + bounds.width * ratio : bounds.minY + bounds.height * ratio;
    ctx.save(); ctx.strokeStyle='#ef8e7a'; ctx.lineWidth=2; ctx.setLineDash([10,7]); ctx.beginPath(); if(vertical){ctx.moveTo(value,bounds.minY-50);ctx.lineTo(value,bounds.maxY+50);}else{ctx.moveTo(bounds.minX-50,value);ctx.lineTo(bounds.maxX+50,value);} ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle='#ef8e7a'; ctx.font='800 12px system-ui'; if(vertical){ctx.fillText('A',value-4,bounds.minY-58);ctx.fillText('A',value-4,bounds.maxY+70);}else{ctx.fillText('A',bounds.minX-68,value+4);ctx.fillText('A',bounds.maxX+58,value+4);} ctx.restore();
  }

  function findPlanTarget(plan, point, variant = currentVariant()) {
    const object = [...plan.objects].reverse().find((item) => plan.layerVisibility?.[item.layer] !== false && point.x >= item.x && point.x <= item.x + item.width && point.y >= item.y && point.y <= item.y + item.depth);
    if (object) return { kind: 'object', id: object.id };
    if (plan.layerVisibility?.architecture === false) return null;
    let closest = null;
    plan.walls.forEach((wall) => { const distance = pointToSegmentDistance(point.x, point.y, wall.x1, wall.y1, wall.x2, wall.y2); if (distance < 18 && (!closest || distance < closest.distance)) closest = { kind: 'wall', id: wall.id, distance }; });
    return closest;
  }

  function pointToSegmentDistance(px, py, x1, y1, x2, y2) {
    const dx = x2 - x1; const dy = y2 - y1;
    if (!dx && !dy) return Math.hypot(px - x1, py - y1);
    const t = clamp(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy), 0, 1);
    return Math.hypot(px - (x1 + t * dx), py - (y1 + t * dy));
  }

  function objectColor(type) {
    return ELEMENT_LIBRARY.find((item) => item.name === type)?.color || LAYERS[inferLayer(type)]?.color || '#71838f';
  }


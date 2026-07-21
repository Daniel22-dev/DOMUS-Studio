/* Section renderer, 3D model, walkthrough and WebXR. Source fragment; assembled by scripts/build.mjs. */
  function setupSectionCanvas() {
    const canvas = document.getElementById('sectionCanvas');
    const variant = currentVariant();
    if (!canvas || !variant) return;
    drawSectionCanvas(canvas, variant);
  }

  function drawSectionCanvas(canvas, variant) {
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height; const plan = variant.plan;
    ctx.clearRect(0,0,w,h);
    const bg = ctx.createLinearGradient(0,0,0,h); bg.addColorStop(0,'#182630'); bg.addColorStop(1,'#0c151b'); ctx.fillStyle=bg; ctx.fillRect(0,0,w,h);
    const sourcePoints=[]; plan.walls.forEach((wall)=>sourcePoints.push([wall.x1,wall.y1],[wall.x2,wall.y2]));
    if (!sourcePoints.length) {
      ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='700 25px system-ui';ctx.textAlign='center';ctx.fillText('Řez zatím nemá z čeho vzniknout',w/2,h/2-10);ctx.font='14px system-ui';ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillText('Nejdříve vytvořte stěny v části 2D výkres.',w/2,h/2+24);ctx.textAlign='left';return;
    }
    const bounds=computeBounds(sourcePoints); const vertical=variant.section.orientation==='x'; const ratio=clamp(parseNum(variant.section.position,50)/100,0,1);
    const cut=vertical?bounds.minX+bounds.width*ratio:bounds.minY+bounds.height*ratio;
    const axisMin=(vertical?bounds.minY:bounds.minX)/plan.scale; const axisMax=(vertical?bounds.maxY:bounds.maxX)/plan.scale; const span=Math.max(1,axisMax-axisMin);
    const sectionScale=Math.min(145,(w-180)/(span+0.8)); const sectionWidth=span*sectionScale; const left=Math.max(90,(w-sectionWidth)/2); const baseline=Math.round(h*0.73); const axisX=(world)=>left+(world-axisMin)*sectionScale;
    const wallHeightPx=plan.wallHeight*sectionScale; const top=baseline-wallHeightPx;

    // subtle meter grid
    ctx.save();ctx.strokeStyle='rgba(255,255,255,.045)';ctx.lineWidth=1;
    for(let m=Math.floor(axisMin);m<=Math.ceil(axisMax);m++){const x=axisX(m);ctx.beginPath();ctx.moveTo(x,55);ctx.lineTo(x,h-55);ctx.stroke();}
    for(let z=0;z<=Math.ceil(plan.wallHeight+1);z++){const y=baseline-z*sectionScale;ctx.beginPath();ctx.moveTo(50,y);ctx.lineTo(w-50,y);ctx.stroke();}
    ctx.restore();

    const floorLayers=variant.assemblies.floor||[]; let floorY=baseline;
    floorLayers.forEach((layer)=>{const thickness=Math.max(1,parseNum(layer.thicknessMm)/1000*sectionScale);ctx.fillStyle=layer.color||'#777';ctx.fillRect(left-35,floorY,span*sectionScale+70,thickness);ctx.strokeStyle='rgba(255,255,255,.16)';ctx.strokeRect(left-35,floorY,span*sectionScale+70,thickness);floorY+=thickness;});
    ctx.fillStyle='#273239';ctx.fillRect(left-35,floorY,span*sectionScale+70,Math.max(24,h-floorY-55));

    const ceilingLayers=variant.assemblies.ceiling||[]; let ceilingY=top;
    ceilingLayers.forEach((layer)=>{const thickness=Math.max(1,parseNum(layer.thicknessMm)/1000*sectionScale);ceilingY-=thickness;ctx.fillStyle=layer.color||'#888';ctx.fillRect(left-35,ceilingY,span*sectionScale+70,thickness);ctx.strokeStyle='rgba(255,255,255,.14)';ctx.strokeRect(left-35,ceilingY,span*sectionScale+70,thickness);});

    const wallColor=variant.materials.find((item)=>item.id===variant.appearance.wallMaterialId)?.swatch||'#b88852';
    const intersections=[];
    plan.walls.forEach((wall,index)=>{
      const a=vertical?wall.x1:wall.y1;const b=vertical?wall.x2:wall.y2;
      const min=Math.min(a,b)-plan.wallThickness*plan.scale/2;const max=Math.max(a,b)+plan.wallThickness*plan.scale/2;
      if(cut<min||cut>max)return;
      const denom=b-a;let t=Math.abs(denom)<0.0001?0.5:(cut-a)/denom;t=clamp(t,0,1);
      const cross=vertical?wall.y1+(wall.y2-wall.y1)*t:wall.x1+(wall.x2-wall.x1)*t;
      intersections.push({position:cross/plan.scale,index:index+1});
    });
    intersections.forEach((hit)=>{const x=axisX(hit.position);const thickness=Math.max(8,plan.wallThickness*sectionScale);ctx.fillStyle=wallColor;ctx.fillRect(x-thickness/2,top,thickness,wallHeightPx);ctx.strokeStyle='rgba(255,255,255,.45)';ctx.strokeRect(x-thickness/2,top,thickness,wallHeightPx);ctx.fillStyle='#f4dfbf';ctx.font='700 11px system-ui';ctx.fillText(`S${hit.index}`,x-7,top+18);});

    plan.objects.filter((object)=>plan.layerVisibility?.[object.layer]!==false).forEach((object)=>{
      const start=vertical?object.x:object.y;const sizeCut=vertical?object.width:object.depth;
      if(cut<start||cut>start+sizeCut)return;
      const horizontalStart=(vertical?object.y:object.x)/plan.scale;const horizontalSize=(vertical?object.depth:object.width)/plan.scale;
      const x=axisX(horizontalStart);const ww=Math.max(5,horizontalSize*sectionScale);const hh=Math.max(5,parseNum(object.height,10)/100*sectionScale);const color=variant.materials.find((item)=>item.id===object.materialId)?.swatch||object.color||LAYERS[object.layer]?.color||'#71838f';
      ctx.fillStyle=color;ctx.globalAlpha=.9;ctx.fillRect(x,baseline-hh,ww,hh);ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,.55)';ctx.strokeRect(x,baseline-hh,ww,hh);ctx.fillStyle='#eef4f6';ctx.font='700 10px system-ui';ctx.fillText(object.type,x+5,baseline-hh+15);
    });

    ctx.strokeStyle='#e9c38c';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(left-45,baseline);ctx.lineTo(left+span*sectionScale+45,baseline);ctx.stroke();
    ctx.fillStyle='#f0d6ad';ctx.font='800 17px system-ui';ctx.fillText(variant.section.name||'Řez A–A',55,38);
    ctx.fillStyle='rgba(255,255,255,.55)';ctx.font='12px system-ui';ctx.fillText(`Poloha řezu ${Math.round(ratio*100)} % · ${vertical?'svislá':'vodorovná'} řezná čára · skutečné měřítko vrstev`,55,60);

    if(variant.section.showDimensions){
      drawSectionDimension(ctx,left-62,baseline,top,`${planNumber(plan.wallHeight)} m`);
      const floorTotal=(variant.assemblies.floor||[]).reduce((sum,layer)=>sum+parseNum(layer.thicknessMm),0);drawSectionDimension(ctx,Math.min(w-66,left+sectionWidth+62),baseline,floorY,`${floorTotal} mm`);
      ctx.strokeStyle='rgba(255,255,255,.45)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,baseline+38);ctx.lineTo(left+span*sectionScale,baseline+38);ctx.stroke();ctx.beginPath();ctx.moveTo(left,baseline+30);ctx.lineTo(left,baseline+46);ctx.moveTo(left+span*sectionScale,baseline+30);ctx.lineTo(left+span*sectionScale,baseline+46);ctx.stroke();ctx.fillStyle='#dce6ea';ctx.font='700 12px system-ui';ctx.textAlign='center';ctx.fillText(`${planNumber(span)} m`,left+span*sectionScale/2,baseline+57);ctx.textAlign='left';
    }
    ctx.fillStyle='rgba(255,255,255,.48)';ctx.font='11px system-ui';ctx.fillText(`Průsečíky stěn: ${intersections.length} · zobrazené objekty: ${plan.objects.filter((object)=>plan.layerVisibility?.[object.layer]!==false).length}`,55,h-25);
  }

  function drawSectionDimension(ctx,x,y1,y2,label){
    ctx.save();ctx.strokeStyle='#ef8e7a';ctx.fillStyle='#ef8e7a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y1);ctx.lineTo(x,y2);ctx.stroke();
    [[y1,-1],[y2,1]].forEach(([y,dir])=>{ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-5,y+dir*8);ctx.lineTo(x+5,y+dir*8);ctx.closePath();ctx.fill();});
    ctx.translate(x-10,(y1+y2)/2);ctx.rotate(-Math.PI/2);ctx.font='700 12px system-ui';const m=ctx.measureText(label);ctx.fillStyle='rgba(8,15,20,.9)';roundRect(ctx,-m.width/2-6,-15,m.width+12,22,5);ctx.fill();ctx.fillStyle='#f4b3a7';ctx.fillText(label,-m.width/2,1);ctx.restore();
  }
  // setupModelCanvas is implemented by the premium fragment loaded later in the build.

  function drawModelCanvas(canvas, plan, variant = currentVariant(), mode = state.modelMode) {
    const ctx = canvas.getContext('2d'); const w = canvas.width; const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const bg = ctx.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, mode === 'material' ? '#20313a' : '#17242d'); bg.addColorStop(1, '#0d151b'); ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

    const visibleObjects = plan.objects.filter((object) => plan.layerVisibility?.[object.layer] !== false);
    const visibleWalls = plan.layerVisibility?.architecture !== false ? plan.walls : [];
    const points = [];
    visibleWalls.forEach((wall) => points.push([wall.x1 / plan.scale, wall.y1 / plan.scale], [wall.x2 / plan.scale, wall.y2 / plan.scale]));
    visibleObjects.forEach((object) => points.push([object.x / plan.scale, object.y / plan.scale], [(object.x + object.width) / plan.scale, (object.y + object.depth) / plan.scale]));
    const bounds = computeBounds(points.length ? points : [[0,0],[8,6]]); const center = { x: (bounds.minX + bounds.maxX) / 2, y: (bounds.minY + bounds.maxY) / 2 };
    const angle = state.threeD.angle * Math.PI / 180; const tilt = state.threeD.tilt * Math.PI / 180; const baseScale = Math.min(78, 570 / Math.max(bounds.width, bounds.height, 6)) * state.threeD.zoom;
    const projectPoint = (x, y, z) => { const rx = (x-center.x)*Math.cos(angle)-(y-center.y)*Math.sin(angle); const ry=(x-center.x)*Math.sin(angle)+(y-center.y)*Math.cos(angle); return {x:w/2+rx*baseScale,y:h*.72+ry*baseScale*Math.sin(tilt)-z*baseScale*Math.cos(tilt),depth:ry+z*.1}; };

    ctx.save(); ctx.strokeStyle='rgba(255,255,255,.05)'; ctx.lineWidth=1; const gridPad=2; const minGX=Math.floor(bounds.minX-gridPad),maxGX=Math.ceil(bounds.maxX+gridPad),minGY=Math.floor(bounds.minY-gridPad),maxGY=Math.ceil(bounds.maxY+gridPad);
    for(let gx=minGX;gx<=maxGX;gx++){const a=projectPoint(gx,minGY,0),b=projectPoint(gx,maxGY,0);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
    for(let gy=minGY;gy<=maxGY;gy++){const a=projectPoint(minGX,gy,0),b=projectPoint(maxGX,gy,0);ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();} ctx.restore();

    const floorPolygon = orderedPlanPolygon(plan);
    if (floorPolygon) {
      const floorColor = mode === 'material' ? (variant?.materials?.find((item)=>item.id===variant?.appearance?.floorMaterialId)?.swatch || '#747a7d') : '#38464e';
      const projected=floorPolygon.map(([x,y])=>projectPoint(x/plan.scale,y/plan.scale,0.005));ctx.beginPath();projected.forEach((point,index)=>index?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.fillStyle=floorColor;ctx.globalAlpha=mode==='material'?.72:.38;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle='rgba(255,255,255,.2)';ctx.stroke();
      if(mode==='material'){ctx.save();ctx.clip();ctx.strokeStyle='rgba(255,255,255,.12)';for(let x=-w;x<w*2;x+=34){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x+h,h);ctx.stroke();}ctx.restore();}
    }

    const faces=[];
    const wallBase = mode === 'material' ? (variant?.materials?.find((item)=>item.id===variant?.appearance?.wallMaterialId)?.swatch || '#b88852') : '#b88852';
    visibleWalls.forEach((wall) => {
      const x1=wall.x1/plan.scale,y1=wall.y1/plan.scale,x2=wall.x2/plan.scale,y2=wall.y2/plan.scale,thickness=plan.wallThickness,dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy)||1,nx=-dy/len*thickness/2,ny=dx/len*thickness/2,z=plan.wallHeight;
      const corners=[[x1+nx,y1+ny,0],[x2+nx,y2+ny,0],[x2-nx,y2-ny,0],[x1-nx,y1-ny,0],[x1+nx,y1+ny,z],[x2+nx,y2+ny,z],[x2-nx,y2-ny,z],[x1-nx,y1-ny,z]];
      const defs=[{ids:[4,5,6,7],fill:lighten(wallBase,.18)},{ids:[0,1,5,4],fill:darken(wallBase,.08)},{ids:[1,2,6,5],fill:darken(wallBase,.18)},{ids:[2,3,7,6],fill:wallBase},{ids:[3,0,4,7],fill:darken(wallBase,.1)}];
      defs.forEach((face)=>{const projected=face.ids.map((id)=>projectPoint(...corners[id]));faces.push({points:projected,depth:projected.reduce((sum,p)=>sum+p.depth,0)/projected.length,fill:face.fill,stroke:'rgba(255,255,255,.18)'});});
    });

    visibleObjects.forEach((object) => {
      const x=object.x/plan.scale,y=object.y/plan.scale,ww=Math.max(.04,object.width/plan.scale),dd=Math.max(.04,object.depth/plan.scale),hh=Math.max(.06,parseNum(object.height,10)/100);
      const corners=[[x,y,0],[x+ww,y,0],[x+ww,y+dd,0],[x,y+dd,0],[x,y,hh],[x+ww,y,hh],[x+ww,y+dd,hh],[x,y+dd,hh]];
      const linked=variant?.materials?.find((item)=>item.id===object.materialId); const color=mode==='material'?(linked?.swatch||object.color||LAYERS[object.layer]?.color||'#71838f'):(LAYERS[object.layer]?.color||object.color||'#71838f');
      const defs=[{ids:[4,5,6,7],fill:lighten(color,.18)},{ids:[0,1,5,4],fill:darken(color,.08)},{ids:[1,2,6,5],fill:darken(color,.16)},{ids:[2,3,7,6],fill:color},{ids:[3,0,4,7],fill:darken(color,.04)}];
      defs.forEach((face)=>{const projected=face.ids.map((id)=>projectPoint(...corners[id]));faces.push({points:projected,depth:projected.reduce((sum,p)=>sum+p.depth,0)/projected.length,fill:face.fill,stroke:'rgba(255,255,255,.24)'});});
    });

    faces.sort((a,b)=>a.depth-b.depth); faces.forEach((face)=>{ctx.beginPath();face.points.forEach((point,index)=>index?ctx.lineTo(point.x,point.y):ctx.moveTo(point.x,point.y));ctx.closePath();ctx.fillStyle=face.fill;ctx.fill();ctx.strokeStyle=face.stroke;ctx.lineWidth=1;ctx.stroke();});

    if (!visibleWalls.length && !visibleObjects.length) { ctx.fillStyle='rgba(255,255,255,.75)';ctx.font='700 24px system-ui';ctx.textAlign='center';ctx.fillText('3D model zatím nemá žádné viditelné prvky',w/2,h/2-10);ctx.font='14px system-ui';ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillText('Nakreslete prvky nebo zapněte příslušné vrstvy.',w/2,h/2+24);ctx.textAlign='left'; }
    ctx.fillStyle='rgba(255,255,255,.52)';ctx.font='12px system-ui';ctx.fillText(`${mode==='material'?'Materiálový':'Technický'} režim · výška ${plan.wallHeight.toFixed(2)} m · ${visibleWalls.length} stěn · ${visibleObjects.length} viditelných prvků`,18,h-18);
  }

  function computeBounds(points) {
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
    return { minX, maxX, minY, maxY, width: Math.max(1,maxX-minX), height: Math.max(1,maxY-minY) };
  }

  function colorToRgb(hex) {
    const value = String(hex || '#777777').replace('#','');
    const normalized = value.length === 3 ? value.split('').map((c) => c+c).join('') : value.padEnd(6,'7').slice(0,6);
    return { r: parseInt(normalized.slice(0,2),16), g: parseInt(normalized.slice(2,4),16), b: parseInt(normalized.slice(4,6),16) };
  }
  function rgbToHex({r,g,b}) { return `#${[r,g,b].map((v) => clamp(Math.round(v),0,255).toString(16).padStart(2,'0')).join('')}`; }
  function mixColor(hex, amount) {
    const rgb = colorToRgb(hex);
    const target = amount >= 0 ? 255 : 0;
    const ratio = Math.abs(amount);
    return rgbToHex({ r: rgb.r + (target-rgb.r)*ratio, g: rgb.g + (target-rgb.g)*ratio, b: rgb.b + (target-rgb.b)*ratio });
  }
  const lighten = (hex, amount) => mixColor(hex, amount);
  const darken = (hex, amount) => mixColor(hex, -amount);

  function resetWalkthroughCamera() {
    const variant = currentVariant(); const bounds = planGeometryBounds(variant.plan); const depth = Math.max(1, bounds.maxY - bounds.minY); variant.presentation.cameraX = (bounds.minX + bounds.maxX) / 2; variant.presentation.cameraY = bounds.maxY - Math.min(variant.plan.scale * 0.45, depth * 0.18); variant.presentation.yaw = 0;
  }

  function setupWalkthrough() {
    const canvas = document.getElementById('walkthroughCanvas'); if (!canvas) return; const variant = currentVariant(); if (!Number.isFinite(variant.presentation.cameraX) || !Number.isFinite(variant.presentation.cameraY)) resetWalkthroughCamera();
    let dragging = false, lastX = 0;
    canvas.addEventListener('pointerdown', (event) => { dragging = true; lastX = event.clientX; canvas.setPointerCapture(event.pointerId); });
    canvas.addEventListener('pointermove', (event) => { if (!dragging) return; variant.presentation.yaw += (event.clientX - lastX) * 0.006; lastX = event.clientX; drawWalkthrough(); });
    canvas.addEventListener('pointerup', () => { dragging = false; saveProject(currentProject(), true, true); });
    window.onkeydown = (event) => { if (state.currentTab !== 'presentation') return; const key = ({ ArrowUp: 'forward', w: 'forward', W: 'forward', ArrowDown: 'back', s: 'back', S: 'back', ArrowLeft: 'left', a: 'left', A: 'left', ArrowRight: 'right', d: 'right', D: 'right' })[event.key]; if (key) { event.preventDefault(); moveWalkthrough(key); } };
    drawWalkthrough(); checkXRSupport(false);
  }

  function moveWalkthrough(direction) {
    const variant = currentVariant(); const camera = variant.presentation; const step = Math.max(10, variant.plan.scale * 0.18); const forwardX = Math.sin(camera.yaw), forwardY = -Math.cos(camera.yaw); const rightX = Math.cos(camera.yaw), rightY = Math.sin(camera.yaw);
    if (direction === 'forward') { camera.cameraX += forwardX * step; camera.cameraY += forwardY * step; }
    if (direction === 'back') { camera.cameraX -= forwardX * step; camera.cameraY -= forwardY * step; }
    if (direction === 'left') { camera.cameraX -= rightX * step; camera.cameraY -= rightY * step; }
    if (direction === 'right') { camera.cameraX += rightX * step; camera.cameraY += rightY * step; }
    saveProject(currentProject(), true, true); drawWalkthrough();
  }

  function drawWalkthrough() {
    const canvas = document.getElementById('walkthroughCanvas'); if (!canvas) return; const rect = canvas.getBoundingClientRect(); const dpr = Math.min(window.devicePixelRatio || 1, 2); const width = Math.max(320, rect.width || 1280), height = Math.max(260, rect.height || 760); const pixelWidth = Math.round(width * dpr), pixelHeight = Math.round(height * dpr); if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) { canvas.width = pixelWidth; canvas.height = pixelHeight; } const ctx = canvas.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const variant = currentVariant(); const plan = variant.plan; const camera = variant.presentation; const horizon = height * 0.5; const focal = width / (2 * Math.tan((camera.fov || 72) * Math.PI / 360)); const camHeight = 1.65 * plan.scale; const wallHeight = plan.wallHeight * plan.scale; const near = 8;
    const sky = ctx.createLinearGradient(0, 0, 0, horizon); sky.addColorStop(0, '#14232d'); sky.addColorStop(1, '#263844'); ctx.fillStyle = sky; ctx.fillRect(0, 0, width, horizon); const floor = ctx.createLinearGradient(0, horizon, 0, height); floor.addColorStop(0, '#4a4a45'); floor.addColorStop(1, '#191c1d'); ctx.fillStyle = floor; ctx.fillRect(0, horizon, width, height - horizon);
    const transform = (x, y) => { const dx = x - camera.cameraX, dy = y - camera.cameraY; const sin = Math.sin(camera.yaw), cos = Math.cos(camera.yaw); return { side: dx * cos + dy * sin, forward: dx * sin - dy * cos }; };
    const project = (side, forward, vertical) => ({ x: width / 2 + side / forward * focal, y: horizon - (vertical - camHeight) / forward * focal });
    const segments = [];
    plan.walls.forEach((wall, index) => { let a = transform(wall.x1, wall.y1), b = transform(wall.x2, wall.y2); if (a.forward <= near && b.forward <= near) return; if (a.forward <= near || b.forward <= near) { const t = (near - a.forward) / (b.forward - a.forward); const side = a.side + (b.side - a.side) * t; if (a.forward <= near) a = { side, forward: near }; else b = { side, forward: near }; } const p1f = project(a.side, a.forward, 0), p2f = project(b.side, b.forward, 0), p1c = project(a.side, a.forward, wallHeight), p2c = project(b.side, b.forward, wallHeight); segments.push({ depth: (a.forward + b.forward) / 2, points: [p1c, p2c, p2f, p1f], color: index % 2 ? '#a5937a' : '#b3a28b' }); });
    segments.sort((a, b) => b.depth - a.depth).forEach((segment) => { ctx.beginPath(); ctx.moveTo(segment.points[0].x, segment.points[0].y); segment.points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y)); ctx.closePath(); ctx.fillStyle = segment.color; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 2; ctx.stroke(); });
    if (variant.presentation.showObjects) plan.objects.map((object) => { const center = transform(object.x + object.width / 2, object.y + object.depth / 2); return { object, center }; }).filter((item) => item.center.forward > near).sort((a, b) => b.center.forward - a.center.forward).forEach(({ object, center }) => { const w = Math.max(8, object.width / center.forward * focal), h = Math.max(8, (object.height / 100 * plan.scale) / center.forward * focal); const base = project(center.side, center.forward, 0); ctx.fillStyle = object.color || '#7eb3aa'; ctx.fillRect(base.x - w / 2, base.y - h, w, h); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.strokeRect(base.x - w / 2, base.y - h, w, h); if (variant.presentation.showLabels && w > 24) { ctx.fillStyle = '#fff'; ctx.font = '15px system-ui'; ctx.textAlign = 'center'; ctx.fillText(object.type, base.x, base.y - h - 8); } });
    // Compact live minimap: keeps the walkthrough understandable even when the camera faces a nearby wall.
    const bounds = planGeometryBounds(plan); const mapW = 194, mapH = 132, mapX = 18, mapY = 18, mapPad = 16; const mapScale = Math.min((mapW - mapPad * 2) / Math.max(1, bounds.maxX - bounds.minX), (mapH - mapPad * 2) / Math.max(1, bounds.maxY - bounds.minY));
    ctx.save(); ctx.globalAlpha = .96; ctx.fillStyle = 'rgba(9,18,24,.86)'; roundRect(ctx, mapX, mapY, mapW, mapH, 14); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.17)'; ctx.lineWidth = 1; ctx.stroke();
    const mapPoint = (x, y) => ({ x: mapX + mapPad + (x - bounds.minX) * mapScale, y: mapY + mapPad + (y - bounds.minY) * mapScale });
    ctx.strokeStyle = 'rgba(235,226,211,.92)'; ctx.lineWidth = 3; ctx.lineCap = 'round'; plan.walls.forEach((wall) => { const a = mapPoint(wall.x1, wall.y1), b = mapPoint(wall.x2, wall.y2); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); });
    if (variant.presentation.showObjects) { ctx.fillStyle = 'rgba(92,189,169,.72)'; plan.objects.forEach((object) => { const p = mapPoint(object.x, object.y); const w = Math.max(3, object.width * mapScale), h = Math.max(3, object.depth * mapScale); ctx.fillRect(p.x, p.y, w, h); }); }
    const cam = mapPoint(camera.cameraX, camera.cameraY); ctx.fillStyle = '#f5b764'; ctx.beginPath(); ctx.arc(cam.x, cam.y, 5.5, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#f5b764'; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(cam.x, cam.y); ctx.lineTo(cam.x + Math.sin(camera.yaw) * 22, cam.y - Math.cos(camera.yaw) * 22); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.78)'; ctx.font = '600 11px system-ui'; ctx.textAlign = 'left'; ctx.fillText('PŮDORYS', mapX + 12, mapY + mapH - 9); ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(width / 2 - 10, horizon); ctx.lineTo(width / 2 + 10, horizon); ctx.moveTo(width / 2, horizon - 10); ctx.lineTo(width / 2, horizon + 10); ctx.stroke(); const pos = document.getElementById('walkthroughPosition'); if (pos) pos.textContent = `x ${Math.round(camera.cameraX)} · y ${Math.round(camera.cameraY)} · ${Math.round(camera.yaw * 180 / Math.PI)}°`;
  }

  async function openPresentationFullscreen() { const wrap = document.getElementById('walkthroughWrap'); if (!wrap) return; try { await wrap.requestFullscreen(); setTimeout(drawWalkthrough, 100); } catch (error) { toast('Celou obrazovku se nepodařilo otevřít.', 'error'); } }

  async function toggleGyroscope() {
    if (state.presentation.gyro) { state.presentation.gyro = false; window.removeEventListener('deviceorientation', handleDeviceOrientation); toast('Gyroskop byl vypnut.'); return render(); }
    try { if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') { const permission = await DeviceOrientationEvent.requestPermission(); if (permission !== 'granted') throw new Error('Přístup k orientaci zařízení nebyl povolen.'); } window.addEventListener('deviceorientation', handleDeviceOrientation); state.presentation.gyro = true; toast('Pohled nyní sleduje otáčení telefonu.'); render(); } catch (error) { toast(error.message || 'Gyroskop není dostupný.', 'error'); }
  }

  function handleDeviceOrientation(event) { if (!state.presentation.gyro || state.currentTab !== 'presentation') return; const variant = currentVariant(); if (Number.isFinite(event.alpha)) variant.presentation.yaw = event.alpha * Math.PI / 180; drawWalkthrough(); }

  async function checkXRSupport(showToast = false) { const before = JSON.stringify(state.xrSupport || {}); const support = { checked: true, vr: false, ar: false, secure: window.isSecureContext }; try { if (navigator.xr) { support.vr = await navigator.xr.isSessionSupported('immersive-vr'); support.ar = await navigator.xr.isSessionSupported('immersive-ar'); } } catch {} state.xrSupport = support; if (showToast) toast(support.vr ? 'Zařízení podporuje imerzivní VR.' : 'Imerzivní VR zde není dostupné.', support.vr ? '' : 'error'); if (state.currentTab === 'presentation' && before !== JSON.stringify(support)) render(); return support; }

  function xrSceneGeometry(variant) {
    const plan = variant.plan, bounds = planGeometryBounds(plan), cx = (bounds.minX + bounds.maxX) / 2, cy = (bounds.minY + bounds.maxY) / 2, vertices = [], colors = [];
    const addTri = (a, b, c, color) => { [a, b, c].forEach((v) => vertices.push(...v)); for (let i = 0; i < 3; i++) colors.push(...color); };
    const wallColor = [0.68, 0.58, 0.46, 1]; plan.walls.forEach((wall) => { const x1 = (wall.x1 - cx) / plan.scale, z1 = (wall.y1 - cy) / plan.scale, x2 = (wall.x2 - cx) / plan.scale, z2 = (wall.y2 - cy) / plan.scale, h = plan.wallHeight; addTri([x1,0,z1],[x2,0,z2],[x2,h,z2],wallColor); addTri([x1,0,z1],[x2,h,z2],[x1,h,z1],wallColor); });
    const floorColor = [0.26,0.27,0.25,1]; addTri([-20,0,-20],[20,0,-20],[20,0,20],floorColor); addTri([-20,0,-20],[20,0,20],[-20,0,20],floorColor); return { vertices: new Float32Array(vertices), colors: new Float32Array(colors) };
  }

  function multiply4(a, b) { const out = new Float32Array(16); for (let row=0; row<4; row++) for (let col=0; col<4; col++) out[col*4+row] = a[0*4+row]*b[col*4+0]+a[1*4+row]*b[col*4+1]+a[2*4+row]*b[col*4+2]+a[3*4+row]*b[col*4+3]; return out; }

  async function startWebXRPresentation() {
    const support = await checkXRSupport(false); if (!support.vr || !navigator.xr) return toast('Kompatibilní WebXR headset nebyl nalezen.', 'error');
    try { const session = await navigator.xr.requestSession('immersive-vr', { optionalFeatures: ['local-floor', 'bounded-floor'] }); const canvas = document.createElement('canvas'); canvas.className = 'xr-canvas'; document.body.appendChild(canvas); const gl = canvas.getContext('webgl', { xrCompatible: true, antialias: true }); if (gl.makeXRCompatible) await gl.makeXRCompatible(); session.updateRenderState({ baseLayer: new XRWebGLLayer(session, gl) }); const refSpace = await session.requestReferenceSpace('local-floor').catch(() => session.requestReferenceSpace('local'));
      const vertex = gl.createShader(gl.VERTEX_SHADER); gl.shaderSource(vertex, 'attribute vec3 p;attribute vec4 c;uniform mat4 mvp;varying vec4 vc;void main(){gl_Position=mvp*vec4(p,1.0);vc=c;}'); gl.compileShader(vertex); const fragment = gl.createShader(gl.FRAGMENT_SHADER); gl.shaderSource(fragment, 'precision mediump float;varying vec4 vc;void main(){gl_FragColor=vc;}'); gl.compileShader(fragment); const program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program); const geo = xrSceneGeometry(currentVariant()); const pos = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, pos); gl.bufferData(gl.ARRAY_BUFFER, geo.vertices, gl.STATIC_DRAW); const col = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, col); gl.bufferData(gl.ARRAY_BUFFER, geo.colors, gl.STATIC_DRAW); const pLoc = gl.getAttribLocation(program, 'p'), cLoc = gl.getAttribLocation(program, 'c'), mvpLoc = gl.getUniformLocation(program, 'mvp'); gl.enable(gl.DEPTH_TEST);
      const frame = (time, xrFrame) => { const pose = xrFrame.getViewerPose(refSpace); const layer = session.renderState.baseLayer; gl.bindFramebuffer(gl.FRAMEBUFFER, layer.framebuffer); gl.clearColor(0.05,0.08,0.1,1); gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT); if (pose) for (const view of pose.views) { const viewport = layer.getViewport(view); gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height); gl.useProgram(program); gl.bindBuffer(gl.ARRAY_BUFFER, pos); gl.enableVertexAttribArray(pLoc); gl.vertexAttribPointer(pLoc,3,gl.FLOAT,false,0,0); gl.bindBuffer(gl.ARRAY_BUFFER,col); gl.enableVertexAttribArray(cLoc); gl.vertexAttribPointer(cLoc,4,gl.FLOAT,false,0,0); gl.uniformMatrix4fv(mvpLoc,false,multiply4(view.projectionMatrix,view.transform.inverse.matrix)); gl.drawArrays(gl.TRIANGLES,0,geo.vertices.length/3); } session.requestAnimationFrame(frame); }; session.requestAnimationFrame(frame); session.addEventListener('end', () => canvas.remove());
    } catch (error) { console.error(error); toast(error.message || 'VR relaci se nepodařilo spustit.', 'error'); }
  }


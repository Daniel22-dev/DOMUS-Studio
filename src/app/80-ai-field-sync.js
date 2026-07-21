/* AI photo workspace, product extraction and proposal generation. Source fragment; bundled by esbuild. */


  async function updateRoomPhotoField(id, key, value) {
    const project = currentProject();
    const photo = currentVariant(project)?.ai?.photoSet?.find((item) => item.id === id);
    if (!photo) return;
    photo[key] = value;
    await saveProject(project);
  }

  async function importRoomPhotos() {
    const files = Array.from(roomPhotosInput.files || []).slice(0, 8);
    roomPhotosInput.value = '';
    if (!files.length) return;
    const project = currentProject(); const variant = currentVariant(project);
    toast(`Zpracovávám ${files.length} snímků…`);
    for (const file of files) {
      try {
        const dataUrl = await resizeImage(file, 1600, 1200, 0.82);
        const item = { id: uid('roomphoto'), name: file.name.replace(/\.[^.]+$/, '') || `Snímek ${variant.ai.photoSet.length + 1}`, view: 'detail', note: '', dataUrl, createdAt: new Date().toISOString() };
        variant.ai.photoSet.push(item);
        if (!variant.ai.activePhotoId) variant.ai.activePhotoId = item.id;
      } catch (error) { console.warn('Room photo:', error); }
    }
    await saveProject(project); toast('Sada fotografií byla doplněna.'); render();
  }

  async function addMainPhotoToSet() {
    const project = currentProject(); const variant = currentVariant(project);
    if (!variant.photo.dataUrl) return toast('Hlavní projektová fotografie zatím není vložena.', 'error');
    const existing = variant.ai.photoSet.find((photo) => photo.dataUrl === variant.photo.dataUrl);
    if (existing) { variant.ai.activePhotoId = existing.id; await saveProject(project); return render(); }
    const item = { id: uid('roomphoto'), name: 'Hlavní projektová fotografie', view: 'front', note: 'Převzato z karty Fotografie.', dataUrl: variant.photo.dataUrl, createdAt: new Date().toISOString() };
    variant.ai.photoSet.unshift(item); variant.ai.activePhotoId = item.id; await saveProject(project); toast('Hlavní fotografie byla přidána do sady.'); render();
  }

  function setupAiWorkspace() {
    setupPhotoMosaic();
    if (!state.aiStatus.checked) checkAiStatus(false);
  }

  function setupPhotoMosaic() {
    const canvas = document.getElementById('photoMosaicCanvas'); const variant = currentVariant();
    if (!canvas || !variant) return;
    drawPhotoMosaic(canvas, variant.ai.photoSet).catch(console.warn);
  }

  async function drawPhotoMosaic(canvas, photos) {
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#101a20'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const selected = (photos || []).slice(0, 6);
    if (!selected.length) { ctx.fillStyle = '#7f919b'; ctx.font = '600 30px system-ui'; ctx.textAlign = 'center'; ctx.fillText('Nahrajte fotografie prostoru', canvas.width / 2, canvas.height / 2); return; }
    const cols = selected.length === 1 ? 1 : 2; const rows = Math.ceil(selected.length / cols); const gap = 18;
    const cellW = (canvas.width - gap * (cols + 1)) / cols; const cellH = (canvas.height - gap * (rows + 1)) / rows;
    const loaded = await Promise.all(selected.map((photo) => loadImage(photo.dataUrl).then((image) => ({ photo, image })).catch(() => null)));
    loaded.filter(Boolean).forEach(({ photo, image }, index) => {
      const col = index % cols, row = Math.floor(index / cols); const x = gap + col * (cellW + gap), y = gap + row * (cellH + gap);
      const ratio = Math.max(cellW / image.width, cellH / image.height); const w = image.width * ratio, h = image.height * ratio;
      ctx.save(); roundRect(ctx, x, y, cellW, cellH, 16); ctx.clip(); ctx.drawImage(image, x + (cellW - w) / 2, y + (cellH - h) / 2, w, h); ctx.fillStyle = 'rgba(7,13,17,.66)'; ctx.fillRect(x, y + cellH - 48, cellW, 48); ctx.fillStyle = '#fff'; ctx.font = '600 20px system-ui'; ctx.textAlign = 'left'; ctx.fillText(photo.name.slice(0, 42), x + 16, y + cellH - 17); ctx.restore();
    });
  }

  function loadImage(src) { return new Promise((resolve, reject) => { const image = new Image(); image.onload = () => resolve(image); image.onerror = reject; image.src = src; }); }

  async function exportPhotoMosaic() {
    const variant = currentVariant(); if (!variant?.ai.photoSet.length) return toast('Sada fotografií je prázdná.', 'error');
    const canvas = document.createElement('canvas'); canvas.width = 1600; canvas.height = 1100; await drawPhotoMosaic(canvas, variant.ai.photoSet);
    canvas.toBlob((blob) => blob && downloadBlob(blob, `DOMUS-fotoprehled-${Date.now()}.png`), 'image/png');
  }

  async function checkAiStatus(showToast = false) {
    try {
      const response = await fetch('/api/status', { cache: 'no-store' });
      if (!response.ok) throw new Error('Lokální server nevrátil stav AI.');
      const data = await response.json();
      state.aiStatus = { checked: true, configured: Boolean(data.configured), model: data.model || '', imageModel: data.imageModel || '', message: data.message || '' };
      if (showToast) toast(data.configured ? 'Cloudová AI je připravena.' : 'AI klíč zatím není nastaven.', data.configured ? '' : 'error');
    } catch (error) {
      state.aiStatus = { checked: true, configured: false, model: '', imageModel: '', message: 'Aplikace běží bez lokálního AI proxy. Spusťte ji přes hlavní BAT soubor.' };
      if (showToast) toast(state.aiStatus.message, 'error');
    }
    if (state.currentTab === 'ai') render();
  }

  async function analyzeImageLocally(dataUrl) {
    const image = await loadImage(dataUrl); const canvas = document.createElement('canvas');
    const max = 520; const ratio = Math.min(max / image.width, max / image.height, 1); canvas.width = Math.max(1, Math.round(image.width * ratio)); canvas.height = Math.max(1, Math.round(image.height * ratio));
    const ctx = canvas.getContext('2d', { willReadFrequently: true }); ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height); const gray = new Float32Array(canvas.width * canvas.height);
    let brightness = 0, saturation = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p++) { const r=data[i],g=data[i+1],b=data[i+2]; gray[p]=0.299*r+0.587*g+0.114*b; brightness += gray[p]; saturation += Math.max(r,g,b)-Math.min(r,g,b); }
    brightness /= gray.length; saturation /= gray.length;
    let vertical=0,horizontal=0,edge=0;
    for (let y=1;y<canvas.height-1;y+=2) for (let x=1;x<canvas.width-1;x+=2) { const p=y*canvas.width+x; const gx=Math.abs(gray[p+1]-gray[p-1]); const gy=Math.abs(gray[p+canvas.width]-gray[p-canvas.width]); vertical += gx; horizontal += gy; edge += Math.hypot(gx,gy); }
    const samples=Math.max(1,Math.floor((canvas.width-2)/2)*Math.floor((canvas.height-2)/2)); vertical/=samples; horizontal/=samples; edge/=samples;
    const quality = clamp((edge / 42) * 0.45 + (1 - Math.abs(brightness - 135) / 180) * 0.4 + Math.min(1, image.width / 1200) * 0.15, 0.15, 0.88);
    const variant=currentVariant(); const currentMetrics=computeProjectMetrics(variant); const bounds=planBounds(variant.plan);
    const widthMm = bounds ? Math.max(1000, Math.round(bounds.width / variant.plan.scale * 1000)) : variant.ai.proposedPlan.widthMm;
    const depthMm = bounds ? Math.max(1000, Math.round(bounds.height / variant.plan.scale * 1000)) : variant.ai.proposedPlan.depthMm;
    const lineDiagnostics = [
      vertical > 10 ? `Výrazné svislé linie: ${Math.round(vertical)}` : '',
      horizontal > 10 ? `Výrazné vodorovné linie: ${Math.round(horizontal)}` : '',
    ].filter(Boolean);
    return { summary:`Kontrola snímku ${image.width} × ${image.height} px nalezla ${edge > 14 ? 'dobře čitelné' : 'spíše slabé'} linie. Jas ${Math.round(brightness)}/255, barevná členitost ${Math.round(saturation)}/255.${lineDiagnostics.length ? ` ${lineDiagnostics.join('. ')}.` : ''}`, confidence:quality, roomType:currentProject()?.category || 'Neurčeno', proposedPlan:{shape:'rectangle',widthMm,depthMm,wallHeightM:variant.plan.wallHeight}, elements:[], risks:[brightness<55?'Snímek je velmi tmavý; linie mohou splývat.':'Perspektiva jediné fotografie může významně zkreslit vzdálenosti.',edge<10?'Snímek má málo výrazných linií; pořiďte rovnější a ostřejší záběr.':'Detekovaná linie sama o sobě nedokazuje přítomnost konkrétní konstrukce.'], measurementsToVerify:['Celková šířka a hloubka prostoru','Výška stropu','Poloha a rozměry otvorů','Vzdálenosti instalačních bodů od pevných rohů'], diagnostics:{brightness, saturation, edge, vertical, horizontal, width:image.width, height:image.height} };
  }

  function planBounds(plan) {
    const points=[]; (plan.walls||[]).forEach((wall)=>points.push([wall.x1,wall.y1],[wall.x2,wall.y2])); (plan.objects||[]).forEach((object)=>points.push([object.x,object.y],[object.x+object.width,object.y+object.depth]));
    if (!points.length) return null; const xs=points.map((p)=>p[0]), ys=points.map((p)=>p[1]); return {minX:Math.min(...xs),maxX:Math.max(...xs),minY:Math.min(...ys),maxY:Math.max(...ys),width:Math.max(...xs)-Math.min(...xs),height:Math.max(...ys)-Math.min(...ys)};
  }

  async function runLocalAnalysis() {
    const project=currentProject(), variant=currentVariant(project), photo=activeRoomPhoto(variant); const dataUrl=photo?.dataUrl || variant.photo.dataUrl;
    if (!dataUrl) return toast('Nejdříve vložte fotografii.', 'error');
    try { state.aiBusy=true; toast('Probíhá kontrola kvality fotografie a detekce linií…'); const result=await analyzeImageLocally(dataUrl); variant.ai.localAnalysis=result; variant.ai.analysis=null; variant.ai.proposedPlan={...variant.ai.proposedPlan,...result.proposedPlan}; variant.ai.lastSource='local'; variant.ai.lastRunAt=new Date().toISOString(); await saveProject(project); toast('Kontrola fotografie byla dokončena.'); }
    catch(error){console.error(error);toast('Kontrolu fotografie se nepodařilo dokončit.','error');} finally {state.aiBusy=false;render();}
  }

  function extractJsonText(text) {
    const clean=String(text||'').replace(/^```(?:json)?\s*/i,'').replace(/\s*```$/,'').trim();
    try{return JSON.parse(clean);}catch{}
    const start=clean.indexOf('{'), end=clean.lastIndexOf('}'); if(start>=0&&end>start) return JSON.parse(clean.slice(start,end+1));
    throw new Error('AI nevrátila čitelný strukturovaný výsledek.');
  }

  async function runCloudAnalysis(task='space') {
    const project=currentProject(), variant=currentVariant(project), photo=activeRoomPhoto(variant); const dataUrl=photo?.dataUrl || variant.photo.dataUrl;
    if (task==='space' && !dataUrl) return toast('Nejdříve vložte fotografii.', 'error');
    if (!state.aiStatus.checked) await checkAiStatus(false);
    if (!state.aiStatus.configured) return toast('Nejdříve spusťte „Nastavit-AI-pripojeni.bat“ v adresáři aplikace.', 'error');
    state.aiBusy=true; render();
    try {
      state.aiShare.location = Boolean(document.getElementById('aiShareLocation')?.checked);
      state.aiShare.materials = Boolean(document.getElementById('aiShareMaterials')?.checked);
      state.aiShare.notes = Boolean(document.getElementById('aiShareNotes')?.checked);
      const orderedPhotos = task === 'space' ? [photo, ...variant.ai.photoSet.filter((item) => item.id !== photo?.id)].filter(Boolean).slice(0, 4) : [];
      const categories = [`${orderedPhotos.length} fotografie`, 'název a kategorie projektu'];
      if (state.aiShare.location && project.location) categories.push('lokalita');
      if (state.aiShare.materials) categories.push('materiály a orientační ceny');
      if (state.aiShare.notes && variant.notes) categories.push('poznámky');
      if (!(await confirmAction({ eyebrow: 'Ochrana soukromí', title: 'Odeslat vybraná data do cloudové AI?', message: `Budou odeslány: ${categories.join(', ')}. API klíč zůstává na lokálním serveru.`, acceptLabel: 'Odeslat a analyzovat' }))) return;
      const payload={task, imageDataUrl:task==='space'?dataUrl:null, imageDataUrls:orderedPhotos.map((item)=>item.dataUrl), project:{name:project.name,category:project.category,summary:project.summary,location:state.aiShare.location?project.location:''}, current:{plan:variant.ai.proposedPlan,materials:state.aiShare.materials?variant.materials.map((item)=>({name:item.name,category:item.category,color:item.color,price:item.unitPrice})):[],notes:state.aiShare.notes?variant.notes:''}, photoViews:variant.ai.photoSet.map((item)=>({name:item.name,view:item.view,note:item.note})).slice(0,8)};
      const response=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); const data=await response.json(); if(!response.ok||!data.ok) throw new Error(data.error||'AI služba odpověděla chybou.');
      const rawResult=extractJsonText(data.text);
      if(task==='variants'){ variant.ai.variantIdeas=DomusCore.validateAiVariants(rawResult); toast('AI připravila tři validované návrhové varianty.'); }
      else { const result=DomusCore.validateAiAnalysis(rawResult); variant.ai.analysis=result; variant.ai.proposedPlan={...variant.ai.proposedPlan,...(result.proposedPlan||{})}; variant.ai.lastSource='cloud'; variant.ai.lastRunAt=new Date().toISOString(); toast('Obrazová AI dokončila validovanou analýzu.'); }
      await saveProject(project);
    } catch(error){console.error(error);toast(error.message||'AI analýza se nezdařila.','error');} finally {state.aiBusy=false;render();}
  }

  function buildPlanWalls(plan, shape, widthMm, depthMm) {
    const scale=plan.scale; const w=widthMm/1000*scale, d=depthMm/1000*scale; const x=500-w/2, y=360-d/2; const pts=shape==='l-shape' ? [[x,y],[x+w,y],[x+w,y+d*.58],[x+w*.64,y+d*.58],[x+w*.64,y+d],[x,y+d]] : [[x,y],[x+w,y],[x+w,y+d],[x,y+d]];
    return pts.map((point,index)=>{const next=pts[(index+1)%pts.length];return{id:uid('wall'),x1:point[0],y1:point[1],x2:next[0],y2:next[1]};});
  }

  async function applyProposedPlan() {
    const width=parseNum(document.getElementById('aiPlanWidth')?.value,0), depth=parseNum(document.getElementById('aiPlanDepth')?.value,0), height=parseNum(document.getElementById('aiPlanHeight')?.value,2.6), shape=document.getElementById('aiPlanShape')?.value||'rectangle';
    if(width<500||depth<500) return toast('Zadejte potvrzenou šířku a hloubku alespoň 500 mm.','error');
    const project=currentProject(), variant=currentVariant(project); if((variant.plan.walls.length||variant.plan.objects.length)&&!(await confirmAction({ title: 'Nahradit geometrii půdorysu?', message: 'Stávající stěny a prvky budou nahrazeny navrženým tvarem. Materiály a rozpočet zůstanou zachovány.', acceptLabel: 'Nahradit geometrii', destructive: true }))) return;
    pushPlanHistory(project, variant); variant.plan.walls=buildPlanWalls(variant.plan,shape,width,depth); variant.plan.objects=[]; variant.plan.wallHeight=height; variant.ai.proposedPlan={shape,widthMm:width,depthMm:depth,wallHeightM:height,verifiedByUser:true}; fitPlanToCanvas(variant.plan); await saveProject(project); state.currentTab='plan'; toast('Základní půdorys byl vytvořen. Doplňte skutečné otvory a instalační body.'); render();
  }

  async function addDetectedElement(index) {
    const project=currentProject(), variant=currentVariant(project), analysis=variant.ai.analysis||variant.ai.localAnalysis, item=analysis?.elements?.[index]; if(!item)return;
    const template=ELEMENT_LIBRARY.find((element)=>element.key===(item.typeKey||item.libraryKey))||ELEMENT_LIBRARY.find((element)=>element.layer===(item.layer||'architecture'))||ELEMENT_LIBRARY[0]; const plan=variant.plan;
    pushPlanHistory(project, variant); plan.objects.push({id:uid('object'),type:item.name||template.name,libraryKey:template.key,layer:item.layer||template.layer,shape:template.shape,x:550+plan.objects.length*12,y:350+plan.objects.length*12,width:template.width/1000*plan.scale,depth:template.depth/1000*plan.scale,height:template.height,color:template.color,note:`Rozpoznáno z fotografie (${confidenceLabel(item.confidence||0)}). Polohu a rozměr ověřit. ${item.notes||''}`,materialId:''}); await saveProject(project); toast('Prvek byl vložen do středu 2D výkresu. Upravte jeho polohu a rozměry.');
  }

  function buildLocalVariantIdeas(project, variant) {
    const category=project.category||'projekt';
    return [
      {name:'Varianta A · účelná',style:'Úsporné a jednoduše realizovatelné řešení',description:`Minimalizuje počet atypických detailů a drží se standardních prvků pro oblast ${category.toLowerCase()}.`,budgetFactor:.82,contingencyPercent:12,changes:['Standardizované rozměry a dostupné materiály','Minimum zakázkových prvků','Priorita snadné údržby','Rezerva na skryté práce 12 %']},
      {name:'Varianta B · vyvážená',style:'Poměr vzhledu, životnosti a ceny',description:'Zachovává praktickou realizaci, ale dovoluje kvalitnější povrchy a promyšlenější detaily.',budgetFactor:1,contingencyPercent:10,changes:['Kvalitnější hlavní viditelné materiály','Standardní technické řešení','Vyvážená životnost a servisovatelnost','Rezerva 10 %']},
      {name:'Varianta C · prémiová',style:'Důraz na vzhled, komfort a dlouhodobou hodnotu',description:'Počítá s prémiovými povrchy, přesnějšími detaily a větším podílem zakázkového řešení.',budgetFactor:1.32,contingencyPercent:15,changes:['Prémiové povrchy a designové prvky','Vyšší důraz na skryté detaily','Příprava na budoucí rozšíření','Rezerva 15 %']},
    ];
  }

  async function createVariantFromIdea(index) {
    const project=currentProject(), source=currentVariant(project), idea=source.ai.variantIdeas[index]; if(!idea)return;
    const variant=deepClone(source); variant.id=uid('variant'); variant.name=idea.name; variant.createdAt=new Date().toISOString(); variant.costs.contingencyPercent=parseNum(idea.contingencyPercent,10); variant.materials.forEach((item)=>{item.unitPrice=round(parseNum(item.unitPrice)*parseNum(idea.budgetFactor,1),0);}); variant.costs.lines.forEach((item)=>{item.unitPrice=round(parseNum(item.unitPrice)*parseNum(idea.budgetFactor,1),0);}); variant.notes=`${variant.notes ? variant.notes+'\n\n':''}Návrhový směr: ${idea.description}\n${(idea.changes||[]).map((item)=>'• '+item).join('\n')}\nCeny byly pro scénář orientačně přepočteny koeficientem ${idea.budgetFactor || 1}× a musí být nahrazeny konkrétními nabídkami.`; variant.ai.variantIdeas=[]; project.variants.push(variant); project.activeVariantId=variant.id; await saveProject(project); toast('Byla vytvořena samostatná projektová varianta.'); render();
  }

  async function importProductFromUrl() {
    const urlField=materialForm.elements.url, button=document.getElementById('parseUrlBtn'); if(!urlField.value)return toast('Nejdříve vložte odkaz.','error');
    let url; try{url=new URL(urlField.value);}catch{return toast('Odkaz nemá platný formát.','error');}
    button.disabled=true; button.textContent='Načítám…';
    try{
      const response=await fetch('/api/product',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:url.href})}); const payload=await response.json(); if(!response.ok||!payload.ok)throw new Error(payload.error||'Stránku se nepodařilo načíst.'); const product=extractProductData(payload.html||'',payload.url||url.href);
      if(product.name) materialForm.elements.name.value=product.name; if(product.manufacturer)materialForm.elements.manufacturer.value=product.manufacturer; if(product.sku)materialForm.elements.sku.value=product.sku; if(product.width)materialForm.elements.width.value=product.width; if(product.depth)materialForm.elements.depth.value=product.depth; if(product.height)materialForm.elements.height.value=product.height; if(product.price)materialForm.elements.unitPrice.value=product.price; if(product.color)materialForm.elements.color.value=product.color;
      materialForm.elements.note.value=[materialForm.elements.note.value,`Automaticky načteno z ${url.hostname}. ${product.evidence||'Údaje před objednávkou ověřte na stránce výrobce.'}`].filter(Boolean).join('\n'); toast(`Načteno: ${product.name||url.hostname}. Zkontrolujte rozměry a cenu.`);
    }catch(error){console.warn(error); const slug=decodeURIComponent(url.pathname.split('/').filter(Boolean).pop()||url.hostname).replace(/[-_]+/g,' ').replace(/\.(html?|php)$/i,'').replace(/\b\w/g,(char)=>char.toUpperCase()); if(!materialForm.elements.name.value)materialForm.elements.name.value=slug; materialForm.elements.note.value=materialForm.elements.note.value||`Zdroj: ${url.hostname}. Automatické načtení selhalo; údaje doplňte ručně.`; toast(error.message||'Automatický import se nezdařil.','error'); }
    finally{button.disabled=false;button.textContent='Načíst parametry z odkazu';}
  }

  function extractProductData(html, sourceUrl) {
    const doc=new DOMParser().parseFromString(html,'text/html'); let product={};
    const jsonScripts=Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
    function findProduct(value){if(!value)return null;if(Array.isArray(value)){for(const item of value){const found=findProduct(item);if(found)return found;}}else if(typeof value==='object'){const type=value['@type'];if(type==='Product'||(Array.isArray(type)&&type.includes('Product')))return value;for(const key of ['@graph','mainEntity','itemListElement']){const found=findProduct(value[key]);if(found)return found;}}return null;}
    for(const script of jsonScripts){try{const found=findProduct(JSON.parse(script.textContent));if(found){product=found;break;}}catch{}}
    const meta=(...names)=>{for(const name of names){const el=doc.querySelector(`meta[property="${name}"],meta[name="${name}"]`);if(el?.content)return el.content.trim();}return'';};
    const text=(doc.body?.innerText||'').replace(/\s+/g,' ').slice(0,500000); const name=product.name||meta('og:title','twitter:title')||doc.title||''; const manufacturer=typeof product.brand==='string'?product.brand:product.brand?.name||product.manufacturer?.name||''; const sku=product.sku||product.mpn||'';
    const offers=Array.isArray(product.offers)?product.offers[0]:product.offers||{}; let price=parseNum(offers.price||meta('product:price:amount'),0); if(!price){const match=text.match(/(?:Cena\s*)?([1-9]\d{0,2}(?:[ .]\d{3})+|[1-9]\d{2,5})\s*Kč/i);if(match)price=parseNum(match[1].replace(/[ .]/g,''),0);}
    const normalizeDimension=(value)=>{if(value==null)return 0;if(typeof value==='number')return value;const raw=typeof value==='object'?`${value.value||''} ${value.unitCode||value.unitText||''}`:String(value);const m=raw.match(/([\d.,]+)\s*(mm|cm|m)?/i);if(!m)return 0;let v=parseNum(m[1]);const unit=(m[2]||'mm').toLowerCase();if(unit==='cm')v*=10;if(unit==='m')v*=1000;return Math.round(v);};
    let width=normalizeDimension(product.width),depth=normalizeDimension(product.depth),height=normalizeDimension(product.height); const props=[...(product.additionalProperty||[])]; for(const prop of props){const key=String(prop.name||'').toLowerCase(),value=normalizeDimension(prop.value);if(/šíř|width/.test(key)&&!width)width=value;if(/hloub|depth|délk|length/.test(key)&&!depth)depth=value;if(/výšk|height|tloušť|thick/.test(key)&&!height)height=value;}
    if(!width||!depth){const dim=text.match(/(?:rozměr[^\d]{0,30})?(\d{2,4})\s*[x×]\s*(\d{2,4})(?:\s*[x×]\s*(\d{1,4}))?\s*(mm|cm)?/i);if(dim){const factor=(dim[4]||'mm').toLowerCase()==='cm'?10:1;width=width||parseNum(dim[1])*factor;depth=depth||parseNum(dim[2])*factor;height=height||(dim[3]?parseNum(dim[3])*factor:0);}}
    const color=product.color||''; return {name:String(name).replace(/\s*[|–-].*$/,'').trim(),manufacturer,sku,width,depth,height,price,color,evidence:`Zdroj ${new URL(sourceUrl).hostname}; nalezené hodnoty: ${[width&&`šířka ${width} mm`,depth&&`hloubka ${depth} mm`,height&&`výška ${height} mm`,price&&`cena ${price} Kč`].filter(Boolean).join(', ')||'jen název produktu'}.`};
  }

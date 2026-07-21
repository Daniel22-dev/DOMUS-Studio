import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let target=null;
for(let i=0;i<40;i+=1){
  try { target=await (await fetch(`http://127.0.0.1:${process.env.DOMUS_CDP_PORT || '9222'}/json/new?about:blank`,{method:'PUT'})).json(); if(target?.webSocketDebuggerUrl) break; } catch {}
  await sleep(250);
}
if(!target?.webSocketDebuggerUrl) throw new Error('Chromium CDP není dostupné.');
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
let id=0; const waiting=new Map(); const errors=[];
socket.addEventListener('message',(event)=>{
  const msg=JSON.parse(event.data);
  if(msg.id&&waiting.has(msg.id)){const {resolve,reject}=waiting.get(msg.id);waiting.delete(msg.id);msg.error?reject(new Error(msg.error.message)):resolve(msg.result);return;}
  if(msg.method==='Runtime.exceptionThrown') errors.push(msg.params.exceptionDetails?.exception?.description||msg.params.exceptionDetails?.text||'Runtime exception');
  if(msg.method==='Log.entryAdded'&&msg.params.entry.level==='error') errors.push(`error: ${msg.params.entry.text}`);
});
function send(method,params={}){const current=++id;socket.send(JSON.stringify({id:current,method,params}));return new Promise((resolve,reject)=>waiting.set(current,{resolve,reject}));}
async function evaluate(expression,awaitPromise=true){const result=await send('Runtime.evaluate',{expression,awaitPromise,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;}
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
let html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8')
  .replace(/<meta[^>]+http-equiv=["']Content-Security-Policy["'][^>]*>/gi,'')
  .replace(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi,'')
  .replace(/<script\b[^>]*src=["'][^"']+["'][^>]*><\/script>/gi,'');
const frame=(await send('Page.getFrameTree')).frameTree.frame.id;
await send('Page.setDocumentContent',{frameId:frame,html});
await evaluate(`(()=>{const s=document.createElement('style');s.textContent=${JSON.stringify(fs.readFileSync(path.join(ROOT,'styles.css'),'utf8'))};document.head.appendChild(s);})()`);
for(const file of ['domus-core.js','domus-audit.js','domus-backup.js','domus-premium.js','domus-performance.js','domus-diagnostics.js']) await evaluate(fs.readFileSync(path.join(ROOT,file),'utf8'));
await evaluate(`(()=>{let projects=[],snapshots=[],trash=[];const clone=v=>structuredClone(v);window.DomusDB=Object.freeze({
  getAll:async()=>clone(projects),get:async(id)=>clone(projects.find(p=>p.id===id)||null),put:async(p)=>{const i=projects.findIndex(x=>x.id===p.id);if(i>=0)projects[i]=clone(p);else projects.push(clone(p));},
  delete:async(id)=>{const p=projects.find(x=>x.id===id);if(p)trash.push({id,project:clone(p),deletedAt:new Date().toISOString()});projects=projects.filter(x=>x.id!==id);},
  replaceProjects:async(p)=>{projects=clone(p)},clear:async()=>{projects=[]},listTrash:async()=>clone(trash),restoreTrash:async(id)=>{const e=trash.find(x=>x.id===id);if(e)projects.push(clone(e.project));trash=trash.filter(x=>x.id!==id)},emptyTrash:async()=>{trash=[]},
  createSnapshot:async(p,label)=>{snapshots.push({id:'s'+Date.now(),projects:clone(p),label,createdAt:new Date().toISOString()})},listSnapshots:async()=>snapshots.map(x=>({id:x.id,label:x.label,createdAt:x.createdAt,projectCount:x.projects.length})),restoreSnapshot:async(id)=>clone(snapshots.find(x=>x.id===id)?.projects||[]),
  estimate:async()=>({usage:1000,quota:1000000,projectBytes:1000,persistent:true}),requestPersistence:async()=>true
});})()`);
await evaluate(fs.readFileSync(path.join(ROOT,'app.js'),'utf8'));
await sleep(1200);
await evaluate(`document.getElementById('onboardingDialog')?.close()`);

// Vestavěný Test Lab musí být dostupný a bezpečně spustitelný.
assert.ok(await evaluate(`!!window.DomusDiagnostics && !!document.getElementById('diagnosticsBtn') && !!document.getElementById('diagnosticsDialog')`),'Test Lab musí být načtený');
const diagnostics=await evaluate(`DomusDiagnostics.runAll({includeServices:false})`);
assert.equal(diagnostics.counts.fail,0,`Vestavěný Test Lab hlásí FAIL: ${JSON.stringify(diagnostics)}`);
assert.ok(diagnostics.counts.pass>=8,'Test Lab musí obsahovat alespoň 8 úspěšných kontrol i v izolovaném testovacím režimu');
const dashboard=await evaluate(`({title:document.title, cards:document.querySelectorAll('[data-action="open-project"]').length, text:document.body.innerText.slice(0,500)})`);
if(dashboard.cards<1) console.error('DASHBOARD DEBUG',dashboard,'ERRORS',errors);
assert.ok(dashboard.cards>=1,'Dashboard musí obsahovat projekt');
assert.match(dashboard.text,/DOMUS/i);
await evaluate(`document.querySelector('[data-action="open-project"]').click()`);
for (let attempt = 0; attempt < 50; attempt += 1) {
  if (await evaluate(`!!document.querySelector('[data-action="back-dashboard"]')`)) break;
  await sleep(50);
}
assert.equal(await evaluate(`!!document.querySelector('[data-action="back-dashboard"]')`), true, 'Projekt se v izolovaném browser testu neotevřel.');
const openedProjectDiagnostics = await evaluate(`DomusDiagnostics.runAll({includeServices:false})`);
const openedProjectSmoke = openedProjectDiagnostics.results.find((item) => item.id === 'project-smoke');
assert.equal(openedProjectSmoke?.status, 'pass', `Test Lab nevidí otevřený projekt: ${JSON.stringify(openedProjectSmoke)}`);
const tabs=['overview','field','photo','ai','plan','library','section','model','presentation','comparison','materials','budget','audit','rfq','diary','pdf','manual'];
const results={};
for(const tab of tabs){
  results[tab]=await evaluate(`(()=>{const b=document.querySelector('[data-tab="${tab}"]');if(!b)return {ok:false,reason:'missing button'};b.click();return {ok:!!document.querySelector('.workspace-content'),text:document.querySelector('.workspace-content')?.innerText.slice(0,140)||'',active:document.querySelector('[data-tab="${tab}"]')?.classList.contains('active')}})()`);
  await sleep(80);
  assert.ok(results[tab].ok,`Záložka ${tab} se nevykreslila`);
  assert.ok(results[tab].text.length>0,`Záložka ${tab} je prázdná`);
}
// AI Studio musí obsahovat tři režimy a potvrzovaný návrh bez automatické změny.
await evaluate(`document.querySelector('[data-tab="ai"]').click()`); await sleep(100);
assert.equal(await evaluate(`document.querySelectorAll('[data-action="set-ai-workspace"]').length`),3,'AI Studio musí mít tři režimy');
await evaluate(`document.querySelector('[data-action="set-ai-workspace"][data-mode="visualizer"]').click()`); await sleep(80);
assert.ok(await evaluate(`!!document.getElementById('visualizerBrief')`),'Vizualizátor musí mít strukturované zadání');
await evaluate(`document.querySelector('[data-action="set-ai-workspace"][data-mode="assistant"]').click()`); await sleep(80);
assert.ok(await evaluate(`!!document.getElementById('aiAssistantInput') && !!document.querySelector('[data-action="apply-ai-assistant-proposal"]') === false`),'Asistent musí mít chat a bez návrhu nesmí zobrazit provedení');
await evaluate(`document.querySelector('[data-tab="manual"]').click()`); await sleep(80);
assert.ok(await evaluate(`document.querySelectorAll('.manual-section').length >= 15`),'Manuál musí obsahovat detailní kapitoly');

// Ověření filtrů a skutečného vrácení změny výkresu.
await evaluate(`document.querySelector('[data-tab="materials"]').click()`); await sleep(80);
const filterIdentityBefore=await evaluate(`(()=>{window.__domusAppRef=document.getElementById('app');window.__domusFilterRef=document.getElementById('materialsSearch');window.__domusRegionRef=document.getElementById('materialsResults');return {cards:document.querySelectorAll('#materialsResults .material-card').length};})()`);
await evaluate(`(()=>{const i=document.getElementById('materialsSearch');i.focus();i.value='dlažba';i.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`); await sleep(240);
assert.equal(await evaluate(`document.getElementById('materialsSearch')?.value`),'dlažba','Filtr musí zachovat hodnotu');
assert.equal(await evaluate(`document.activeElement?.id`),'materialsSearch','Cílený filtr musí zachovat fokus bez jeho obnovování');
assert.equal(await evaluate(`window.__domusAppRef===document.getElementById('app')`),true,'Filtr nesmí nahradit kořen aplikace');
assert.equal(await evaluate(`window.__domusFilterRef===document.getElementById('materialsSearch')`),true,'Filtr nesmí nahradit aktivní vstup');
assert.equal(await evaluate(`window.__domusRegionRef!==document.getElementById('materialsResults')`),true,'Filtr musí aktualizovat pouze výsledkový region');
assert.ok(await evaluate(`document.querySelectorAll('#materialsResults .material-card').length`)<=filterIdentityBefore.cards,'Filtr musí zúžit nebo zachovat výsledky');
assert.equal(await evaluate(`(()=>{const b=document.querySelector('#materialsResults [data-action="edit-material"]');b?.click();return !!b;})()`),true,'Filtrovaný region musí obsahovat delegovanou akci'); await sleep(80);
assert.equal(await evaluate(`document.getElementById('materialDialog')?.open`),true,'Delegovaná akce musí fungovat i po výměně regionu');
await evaluate(`document.getElementById('materialDialog')?.close()`);
await evaluate(`document.querySelector('[data-tab="audit"]').click()`); await sleep(80);
await evaluate(`(()=>{const s=document.getElementById('auditSeverity');s.value='critical';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`); await sleep(80);
assert.equal(await evaluate(`document.getElementById('auditSeverity')?.value`),'critical');
await evaluate(`document.querySelector('[data-tab="diary"]').click()`); await sleep(80);
assert.ok(await evaluate(`!!document.getElementById('diarySearch')`),'BuildLog musí mít společné vyhledávání');
await evaluate(`document.querySelector('[data-tab="plan"]').click()`); await sleep(100);
const planBefore=await evaluate(`document.querySelectorAll('[data-action="edit-plan-wall"]').length+document.querySelectorAll('[data-action="edit-plan-object"]').length`);
assert.ok(planBefore>0,'Pilotní výkres musí obsahovat prvky');
await evaluate(`document.querySelector('[data-action="clear-plan"]').click()`); await sleep(80);
assert.equal(await evaluate(`document.getElementById('confirmDialog')?.open`),true,'Destruktivní akce musí otevřít dialog DOMUS');
await evaluate(`document.getElementById('confirmAcceptBtn').click()`); await sleep(140);
const planCleared=await evaluate(`document.querySelectorAll('[data-action="edit-plan-wall"]').length+document.querySelectorAll('[data-action="edit-plan-object"]').length`);
assert.equal(planCleared,0,'Vymazání výkresu musí odstranit prvky');
await evaluate(`document.querySelector('[data-action="undo-plan"]').click()`); await sleep(120);
const planRestored=await evaluate(`document.querySelectorAll('[data-action="edit-plan-wall"]').length+document.querySelectorAll('[data-action="edit-plan-object"]').length`);
assert.equal(planRestored,planBefore,'Zpět musí obnovit celý předchozí stav výkresu');
await send('Emulation.setDeviceMetricsOverride',{width:1440,height:900,deviceScaleFactor:1,mobile:false}); await sleep(160);
assert.equal(await evaluate(`document.querySelector('.nav-btn.active')?.getAttribute('aria-current')`),'page','Aktivní záložka musí mít aria-current=page');
assert.equal(await evaluate(`getComputedStyle(document.getElementById('mobileMenuBtn')).display`),'none','Mobilní menu nesmí být viditelné na širokém desktopu');

await send('Emulation.setDeviceMetricsOverride',{width:1024,height:768,deviceScaleFactor:1,mobile:false});
await sleep(250);
const tablet=await evaluate(`(()=>{const top=document.querySelector('.topbar'),side=document.querySelector('.sidebar'),nav=document.querySelector('.nav-stack-compact'),menu=document.getElementById('mobileMenuBtn');return{scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,topScroll:top.scrollWidth,topClient:top.clientWidth,sidebarHeight:side.getBoundingClientRect().height,navHeight:nav.getBoundingClientRect().height,menuDisplay:getComputedStyle(menu).display,newProjectDisplay:getComputedStyle(document.getElementById('newProjectBtn')).display}})()`);
assert.ok(tablet.scrollWidth<=tablet.clientWidth+2,`Rozložení při 1024 px přetéká: ${tablet.scrollWidth}/${tablet.clientWidth}`);
assert.ok(tablet.topScroll<=tablet.topClient+2,`Horní lišta při 1024 px přetéká: ${tablet.topScroll}/${tablet.topClient}`);
assert.ok(tablet.sidebarHeight<90&&tablet.navHeight<70,`Tabletová navigace je zbytečně vysoká: ${tablet.sidebarHeight}/${tablet.navHeight}`);
assert.notEqual(tablet.menuDisplay,'none','Mobilní nabídka musí být na tabletu viditelná');
assert.equal(tablet.newProjectDisplay,'none','Hlavní tlačítko Nový projekt se na tabletu nesmí tlačit mimo lištu');

await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await sleep(250);
const mobile=await evaluate(`(()=>{const top=document.querySelector('.topbar'),side=document.querySelector('.sidebar');return{scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,topScroll:top.scrollWidth,topClient:top.clientWidth,sidebarHeight:side.getBoundingClientRect().height,menu:!!document.getElementById('mobileMenuBtn'),exportButton:!!document.getElementById('mobileExportBtn'),newProject:!!document.getElementById('mobileNewProjectBtn')}})()`);
assert.ok(mobile.scrollWidth<=mobile.clientWidth+2,`Mobilní rozložení přetéká: ${mobile.scrollWidth}/${mobile.clientWidth}`);
assert.ok(mobile.topScroll<=mobile.topClient+2,`Mobilní horní lišta přetéká: ${mobile.topScroll}/${mobile.topClient}`);
assert.ok(mobile.sidebarHeight<90,`Mobilní navigace je příliš vysoká: ${mobile.sidebarHeight}`);
assert.ok(mobile.menu&&mobile.exportButton&&mobile.newProject,'Mobilní menu musí obsahovat export i nový projekt');
await evaluate(`document.getElementById('mobileMenuBtn').click()`); await sleep(60);
assert.equal(await evaluate(`!document.getElementById('mobileActions').hidden`),true,'Mobilní nabídka se musí otevřít');
assert.equal(await evaluate(`document.getElementById('mobileMenuBtn').getAttribute('aria-expanded')`),'true');
await evaluate(`document.body.click()`); await sleep(30);
assert.equal(await evaluate(`document.getElementById('mobileActions').hidden`),true,'Kliknutí mimo musí mobilní nabídku zavřít');

await evaluate(`document.documentElement.dataset.theme='light';document.getElementById('homeBtn').click()`); await sleep(100);
const lightContrast=await evaluate(`(()=>{const parse=c=>{const m=c.match(/[0-9.]+/g)?.map(Number)||[0,0,0];return m.slice(0,3)},lum=rgb=>{const v=rgb.map(x=>{x/=255;return x<=.03928?x/12.92:((x+.055)/1.055)**2.4});return .2126*v[0]+.7152*v[1]+.0722*v[2]},ratio=(a,b)=>{const x=lum(parse(a)),y=lum(parse(b));return(Math.max(x,y)+.05)/(Math.min(x,y)+.05)};const lead=document.querySelector('.lead'),secondary=document.querySelector('.btn-secondary');return{lead:ratio(getComputedStyle(lead).color,'rgb(247, 249, 250)'),secondary:ratio(getComputedStyle(secondary).color,getComputedStyle(secondary).backgroundColor),leadColor:getComputedStyle(lead).color,secondaryColor:getComputedStyle(secondary).color,secondaryBg:getComputedStyle(secondary).backgroundColor}})()`);
assert.ok(lightContrast.lead>=4.5,`Světlý motiv: úvodní text nemá dostatečný kontrast ${JSON.stringify(lightContrast)}`);
assert.ok(lightContrast.secondary>=4.5,`Světlý motiv: sekundární tlačítko nemá dostatečný kontrast ${JSON.stringify(lightContrast)}`);
const xss=await evaluate(`(()=>{const p={id:'x',name:'<img src=x onerror=window.__xss=1>',activeVariantId:'v',variants:[{id:'v',name:'V',photo:{dataUrl:'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='}}]};const s=DomusCore.secureProject(p);return {svg:s.variants[0].photo.dataUrl,xss:window.__xss||0};})()`);
assert.equal(xss.svg,null); assert.equal(xss.xss,0);
await sleep(200);
const relevantErrors=errors.filter((item)=>!/favicon|service worker|Failed to fetch/i.test(item));
if(relevantErrors.length) throw new Error(`Chyby prohlížeče:\n${relevantErrors.join('\n')}`);
console.log(JSON.stringify({status:'OK',tabs:Object.keys(results).length,tablet,mobile},null,2));
socket.close();
await fetch(`http://127.0.0.1:${process.env.DOMUS_CDP_PORT || '9222'}/json/close/${target.id}`,{method:'PUT'}).catch(()=>{});

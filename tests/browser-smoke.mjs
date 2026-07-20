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
const tabs=['overview','field','photo','ai','plan','library','section','model','presentation','comparison','materials','budget','audit','rfq','diary','pdf'];
const results={};
for(const tab of tabs){
  results[tab]=await evaluate(`(()=>{const b=document.querySelector('[data-tab="${tab}"]');if(!b)return {ok:false,reason:'missing button'};b.click();return {ok:!!document.querySelector('.workspace-content'),text:document.querySelector('.workspace-content')?.innerText.slice(0,140)||'',active:document.querySelector('[data-tab="${tab}"]')?.classList.contains('active')}})()`);
  await sleep(80);
  assert.ok(results[tab].ok,`Záložka ${tab} se nevykreslila`);
  assert.ok(results[tab].text.length>0,`Záložka ${tab} je prázdná`);
}
// Ověření filtrů a skutečného vrácení změny výkresu.
await evaluate(`document.querySelector('[data-tab="materials"]').click()`); await sleep(80);
await evaluate(`(()=>{const i=document.getElementById('materialsSearch');i.value='dlažba';i.dispatchEvent(new Event('input',{bubbles:true}));return true;})()`); await sleep(80);
assert.ok(await evaluate(`!!document.getElementById('materialsSearch')`),'Filtr materiálů musí zůstat dostupný');
await evaluate(`document.querySelector('[data-tab="audit"]').click()`); await sleep(80);
await evaluate(`(()=>{const s=document.getElementById('auditSeverity');s.value='critical';s.dispatchEvent(new Event('change',{bubbles:true}));return true;})()`); await sleep(80);
assert.equal(await evaluate(`document.getElementById('auditSeverity')?.value`),'critical');
await evaluate(`document.querySelector('[data-tab="diary"]').click()`); await sleep(80);
assert.ok(await evaluate(`!!document.getElementById('diarySearch')`),'BuildLog musí mít společné vyhledávání');
await evaluate(`window.confirm=()=>true;document.querySelector('[data-tab="plan"]').click()`); await sleep(100);
const planBefore=await evaluate(`document.querySelectorAll('[data-action="edit-plan-wall"]').length+document.querySelectorAll('[data-action="edit-plan-object"]').length`);
assert.ok(planBefore>0,'Pilotní výkres musí obsahovat prvky');
await evaluate(`document.querySelector('[data-action="clear-plan"]').click()`); await sleep(120);
const planCleared=await evaluate(`document.querySelectorAll('[data-action="edit-plan-wall"]').length+document.querySelectorAll('[data-action="edit-plan-object"]').length`);
assert.equal(planCleared,0,'Vymazání výkresu musí odstranit prvky');
await evaluate(`document.querySelector('[data-action="undo-plan"]').click()`); await sleep(120);
const planRestored=await evaluate(`document.querySelectorAll('[data-action="edit-plan-wall"]').length+document.querySelectorAll('[data-action="edit-plan-object"]').length`);
assert.equal(planRestored,planBefore,'Zpět musí obnovit celý předchozí stav výkresu');

await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});
await sleep(250);
const mobile=await evaluate(`({scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,menu:!!document.getElementById('mobileMenuBtn'),exportButton:!!document.getElementById('mobileExportBtn')})`);
assert.ok(mobile.scrollWidth<=mobile.clientWidth+2,`Mobilní rozložení přetéká: ${mobile.scrollWidth}/${mobile.clientWidth}`);
assert.ok(mobile.menu&&mobile.exportButton,'Mobilní menu musí obsahovat export');
const xss=await evaluate(`(()=>{const p={id:'x',name:'<img src=x onerror=window.__xss=1>',activeVariantId:'v',variants:[{id:'v',name:'V',photo:{dataUrl:'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='}}]};const s=DomusCore.secureProject(p);return {svg:s.variants[0].photo.dataUrl,xss:window.__xss||0};})()`);
assert.equal(xss.svg,null); assert.equal(xss.xss,0);
await sleep(200);
const relevantErrors=errors.filter((item)=>!/favicon|service worker|Failed to fetch/i.test(item));
if(relevantErrors.length) throw new Error(`Chyby prohlížeče:\n${relevantErrors.join('\n')}`);
console.log(JSON.stringify({status:'OK',tabs:Object.keys(results).length,mobile},null,2));
socket.close();
await fetch(`http://127.0.0.1:${process.env.DOMUS_CDP_PORT || '9222'}/json/close/${target.id}`,{method:'PUT'}).catch(()=>{});

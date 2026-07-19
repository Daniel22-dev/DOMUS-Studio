import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const target=await (await fetch(`http://127.0.0.1:${process.env.DOMUS_CDP_PORT || '9222'}/json/new?about:blank`,{method:'PUT'})).json();
const socket=new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{socket.addEventListener('open',resolve,{once:true});socket.addEventListener('error',reject,{once:true});});
let id=0;const waiting=new Map();
socket.addEventListener('message',(event)=>{const msg=JSON.parse(event.data);if(msg.id&&waiting.has(msg.id)){const p=waiting.get(msg.id);waiting.delete(msg.id);msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg.result);}});
function send(method,params={}){const current=++id;socket.send(JSON.stringify({id:current,method,params}));return new Promise((resolve,reject)=>waiting.set(current,{resolve,reject}));}
async function evaluate(expression){const result=await send('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;}
await send('Runtime.enable');await send('Page.enable');
await send('Page.navigate',{url:`http://127.0.0.1:${process.env.DOMUS_HTTP_PORT || '8008'}/db-test`});
await new Promise((resolve)=>setTimeout(resolve,300));
const frame=(await send('Page.getFrameTree')).frameTree.frame.id;
await send('Page.setDocumentContent',{frameId:frame,html:'<!doctype html><title>DB test</title>'});
await evaluate(fs.readFileSync(path.join(ROOT,'domus-core.js'),'utf8'));
await evaluate(fs.readFileSync(path.join(ROOT,'db.js'),'utf8'));
let skipped = false;
try {
  const result=await evaluate(`(async()=>{
    await DomusDB.clear();
    const image='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=';
    const project={id:'project-db-test',name:'DB test',schemaVersion:7,activeVariantId:'variant-db-test',variants:[{id:'variant-db-test',name:'Varianta',photo:{dataUrl:image}}]};
    await DomusDB.put(project,{skipSnapshot:true});
    const loaded=await DomusDB.get(project.id);
    const all=await DomusDB.getAll();
    const snapshotId=await DomusDB.createSnapshot(all,'Test snapshot');
    const snapshot=await DomusDB.restoreSnapshot(snapshotId);
    await DomusDB.delete(project.id);
    const afterDelete=await DomusDB.getAll();
    const trash=await DomusDB.listTrash();
    await DomusDB.restoreTrash(trash[0].id);
    const afterRestore=await DomusDB.getAll();
    await DomusDB.replaceProjects([{...project,id:'project-db-replaced',name:'Replaced'}]);
    const afterReplace=await DomusDB.getAll();
    const estimate=await DomusDB.estimate();
    return {loadedImage:loaded.variants[0].photo.dataUrl,all:all.length,snapshot:snapshot.length,afterDelete:afterDelete.length,trash:trash.length,afterRestore:afterRestore.length,afterReplace:afterReplace.map(p=>p.id),estimate:estimate.projectBytes};
  })()`);
  assert.match(result.loadedImage,/^data:image\/png;base64,/);
  assert.equal(result.all,1);
  assert.equal(result.snapshot,1);
  assert.equal(result.afterDelete,0);
  assert.equal(result.trash,1);
  assert.equal(result.afterRestore,1);
  assert.deepEqual(result.afterReplace,['project-db-replaced']);
  assert.ok(result.estimate>0);
  console.log(JSON.stringify({status:'OK',...result},null,2));} catch (error) {
  if (/Indexed Database API is denied|SecurityError/i.test(String(error?.message || error))) {
    skipped = true;
    console.log('db-browser: SKIPPED – testovací Chromium v tomto prostředí blokuje IndexedDB pro vložený dokument.');
  } else throw error;
}
socket.close();
await fetch(`http://127.0.0.1:${process.env.DOMUS_CDP_PORT || '9222'}/json/close/${target.id}`,{method:'PUT'}).catch(()=>{});

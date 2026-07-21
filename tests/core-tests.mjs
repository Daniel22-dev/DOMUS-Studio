import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
globalThis.window = globalThis;
if (!globalThis.atob) globalThis.atob = (value) => Buffer.from(value, 'base64').toString('binary');
if (!globalThis.btoa) globalThis.btoa = (value) => Buffer.from(value, 'binary').toString('base64');
for (const file of ['domus-core.js', 'domus-audit.js', 'domus-backup.js', 'domus-premium.js']) {
  vm.runInThisContext(fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8'), { filename: file });
}

assert.equal(DomusCore.cleanDataUrl('data:image/svg+xml;base64,PHN2Zz48L3N2Zz4='), null, 'SVG Data URL musí být odmítnuta');
assert.equal(DomusCore.cleanHttpUrl('javascript:alert(1)'), '', 'javascript URL musí být odmítnuta');
assert.equal(DomusCore.cleanHttpUrl('https://example.com/a'), 'https://example.com/a', 'HTTPS URL musí projít');
assert.match(DomusCore.csvCell('=HYPERLINK("bad")'), /^"'/, 'CSV vzorec musí být neutralizován');
assert.equal(DomusCore.sanitize({ verified: 'false' }).verified, false, 'Řetězec false nesmí být true');
assert.equal(DomusCore.sanitize({ verified: 'true' }).verified, true, 'Řetězec true se má převést na true');

const malicious = {
  id: 'project bad', name: '<img src=x onerror=alert(1)>', schemaVersion: 7,
  activeVariantId: 'v1', variants: [{
    id: 'v1', name: 'Test', photo: { dataUrl: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=' },
    materials: [{ id: 'm1', name: 'X', url: 'javascript:alert(1)' }],
    plan: { scale: 100, walls: [], objects: [] }, field: { sessions: [] }, diary: { entries: [], warranties: [], passport: [] },
  }],
};
const safe = DomusCore.secureProject(malicious);
assert.equal(safe.id, 'project-bad');
assert.equal(safe.variants[0].photo.dataUrl, null);
assert.equal(safe.variants[0].materials[0].url, '');
assert.equal({}.polluted, undefined);


const noteOnlyDocuments = DomusCore.secureProject({
  id: 'project-note-docs', name: 'Poznámkové dokumenty', schemaVersion: 7,
  activeVariantId: 'v-note', variants: [{
    id: 'v-note', name: 'Varianta',
    plan: { scale: 100, walls: [], objects: [] },
    field: { sessions: [] },
    diary: {
      entries: [{ id: 'entry-1', documents: [{ id: 'doc-1', dataUrl: null, note: 'Doklad bude doplněn později.' }], photos: [] }],
      warranties: [{ id: 'warranty-1', documents: [{ id: 'doc-2', dataUrl: null, note: 'Papírový záruční list.' }] }],
      passport: [],
    },
  }],
});
assert.equal(noteOnlyDocuments.variants[0].diary.entries[0].documents.length, 1, 'Poznámka bez souboru se při importu deníku nesmí ztratit');
assert.equal(noteOnlyDocuments.variants[0].diary.warranties[0].documents.length, 1, 'Poznámka bez souboru se při importu záruky nesmí ztratit');

const plan = {
  scale: 100,
  walls: [
    { id: 'w1', x1: 0, y1: 0, x2: 400, y2: 0 },
    { id: 'w2', x1: 400, y1: 0, x2: 400, y2: 300 },
    { id: 'w3', x1: 400, y1: 300, x2: 0, y2: 300 },
    { id: 'w4', x1: 0, y1: 300, x2: 0, y2: 0 },
  ],
  objects: [
    { id: 'shower', type: 'Sprchová vanička', libraryKey: 'shower-tray', shape: 'box', layer: 'architecture', x: 20, y: 20, width: 120, depth: 90 },
    { id: 'drain', type: 'Podlahová vpusť', libraryKey: 'floor-drain', shape: 'circle', layer: 'sewer', x: 60, y: 50, width: 15, depth: 15 },
    { id: 'socket', type: 'Zásuvka', libraryKey: 'socket', shape: 'circle', layer: 'electricity', x: 250, y: 100, width: 9, depth: 9 },
    { id: 'pipe', type: 'Vodovodní potrubí', libraryKey: 'water-pipe', shape: 'line', layer: 'water', x: 245, y: 95, width: 100, depth: 4 },
  ],
};
const variant = {
  plan, materials: [{ id: 'm', name: 'Materiál' }], audit: { overrides: {} },
  field: { sessions: [{ measurements: [{ id: 'mm', source: 'measured', verified: true, targetId: 'w1' }] }] },
};
const metrics = { polygon: DomusAudit.orderedPolygon(plan) };
let report = DomusAudit.buildReport(variant, metrics, 10000);
assert.ok(metrics.polygon?.length === 4, 'Uzavřený půdorys musí vytvořit polygon');
assert.ok(!report.issues.some((issue) => issue.id.includes('shower') && issue.id.startsWith('collision-')), 'Vpusť a vanička nemají být falešná kolize');
assert.ok(report.issues.some((issue) => issue.id.startsWith('service-gap-')), 'Liniové vedení musí být zahrnuto do kontroly odstupů');
const risk = report.issues.find((issue) => issue.severity === 'warning');
assert.ok(risk, 'Testovací projekt musí obsahovat varování');
variant.audit.overrides[risk.id] = { status: 'ignored', note: 'Přijato odborníkem', fingerprint: risk.fingerprint, updatedAt: new Date().toISOString() };
const accepted = DomusAudit.buildReport(variant, metrics, 10000);
assert.equal(accepted.technicalScore, report.technicalScore, 'Přijetí rizika nesmí změnit technické skóre');
assert.ok(accepted.acceptedScore >= accepted.technicalScore, 'Skóre po přijetí rizika může být vyšší');

const analysis = DomusCore.validateAiAnalysis({ summary: '<b>text</b>', confidence: 9, proposedPlan: { widthMm: 999999, depthMm: -1 }, elements: [], risks: [], recommendations: [] });
assert.equal(analysis.confidence, 1);
assert.ok(analysis.proposedPlan.widthMm <= 50000 && analysis.proposedPlan.depthMm >= 500);

const assistant = DomusCore.validateAiAssistantResponse({ reply: 'Připravil jsem návrh.', proposal: { title: 'Doplnění žlabu', summary: 'Přidá jeden prvek.', risk: 'medium', assumptions: ['Poloha musí být změřena.'], actions: [{ type: 'add_object', label: 'Přidat podlahovou vpusť', params: { libraryKey: 'floor-drain', xMm: 1200, yMm: 800, widthMm: 150, depthMm: 150 } }] } });
assert.equal(assistant.proposal.actions[0].type, 'add_object');
assert.throws(() => DomusCore.validateAiAssistantResponse({ reply: '', proposal: { actions: [{ type: 'execute_code', params: {} }] } }), /nepovolenou akci/, 'AI asistent nesmí přijmout libovolnou akci');
const securedVisuals = DomusCore.secureProject({ id: 'project-ai-images', name: 'AI', activeVariantId: 'v', variants: [{ id: 'v', name: 'V', plan: { scale: 100, walls: [], objects: [] }, ai: { visualizer: { generations: [{ id: 'g', name: 'N', dataUrl: 'data:image/webp;base64,UklGRg==' }] }, assistant: { messages: [{ id: 'm', role: 'user', text: '<b>Ahoj</b>' }] } }, field: { sessions: [] }, diary: { entries: [], warranties: [], passport: [] } }] });
assert.equal(securedVisuals.variants[0].ai.visualizer.generations.length, 1);
assert.equal(securedVisuals.variants[0].ai.assistant.messages[0].role, 'user');

const zip = DomusBackup.createZip([{ name: 'a.txt', bytes: new TextEncoder().encode('ok') }]);
assert.ok(zip instanceof Blob && zip.size > 20, 'ZIP builder musí vytvořit data');
console.log('core-tests: OK');

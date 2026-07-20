import assert from 'node:assert/strict';
import fs from 'node:fs';

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const expectedRevision = String(pkg.dependencies.three).match(/(\d{3})/)?.[1];
const THREE = await import('../vendor/three.module.min.js');
const { OrbitControls } = await import('../vendor/OrbitControls.js');
const { GLTFExporter } = await import('../vendor/GLTFExporter.js');

assert.equal(typeof THREE.Scene, 'function', 'Three.js Scene chybí.');
assert.equal(typeof THREE.WebGLRenderer, 'function', 'Three.js WebGLRenderer chybí.');
assert.equal(typeof OrbitControls, 'function', 'OrbitControls se nepodařilo importovat.');
assert.equal(typeof GLTFExporter, 'function', 'GLTFExporter se nepodařilo importovat.');
if (expectedRevision) assert.equal(String(THREE.REVISION), expectedRevision, 'Vendored Three.js neodpovídá verzi v package.json.');
console.log(`vendor-module-tests: OK (Three.js r${THREE.REVISION})`);

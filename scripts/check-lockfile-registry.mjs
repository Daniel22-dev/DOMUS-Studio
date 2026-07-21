import { readFile } from 'node:fs/promises';
import { URL } from 'node:url';

const lockPath = new URL('../package-lock.json', import.meta.url);
const raw = await readFile(lockPath, 'utf8');
const forbiddenPatterns = [
  /\.internal(?:[./:]|$)/iu,
  /artifactory/iu,
  /applied-caas/iu,
  /localhost/iu,
  /127\.0\.0\.1/u,
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(raw)) {
    console.error(`package-lock.json contains a forbidden private registry reference: ${pattern}`);
    process.exit(1);
  }
}

const lock = JSON.parse(raw);
const allowedHosts = new Set(['registry.npmjs.org']);
const invalid = [];

for (const [packagePath, metadata] of Object.entries(lock.packages ?? {})) {
  const resolved = metadata?.resolved;
  if (!resolved || !/^https?:\/\//iu.test(resolved)) continue;

  let host;
  try {
    host = new URL(resolved).hostname.toLowerCase();
  } catch {
    invalid.push(`${packagePath || '<root>'}: invalid URL ${resolved}`);
    continue;
  }

  if (!allowedHosts.has(host)) {
    invalid.push(`${packagePath || '<root>'}: ${resolved}`);
  }
}

if (invalid.length) {
  console.error('package-lock.json contains package URLs outside the public npm registry:');
  for (const item of invalid) console.error(`- ${item}`);
  process.exit(1);
}

console.log('Lockfile registry check: OK (only registry.npmjs.org).');

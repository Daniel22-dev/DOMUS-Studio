import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const candidates = [process.env.CHROME_PATH, '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const chrome = candidates.find((candidate) => fs.existsSync(candidate));
if (!chrome) throw new Error('Chromium/Chrome nebyl nalezen. Nastavte CHROME_PATH.');
const freePort = () => new Promise((resolve, reject) => {
  const server = net.createServer();
  server.unref();
  server.on('error', reject);
  server.listen(0, '127.0.0.1', () => { const { port } = server.address(); server.close(() => resolve(port)); });
});
const httpPort = await freePort();
const cdpPort = await freePort();
const httpHost = process.env.DOMUS_HTTP_HOST || '127.0.0.1';
const httpBind = process.env.DOMUS_HTTP_BIND || (httpHost === '127.0.0.1' ? '127.0.0.1' : '0.0.0.0');
const env = { ...process.env, DOMUS_HTTP_PORT: String(httpPort), DOMUS_CDP_PORT: String(cdpPort), DOMUS_HTTP_HOST: httpHost };
const children = [];
const start = (command, args, options = {}) => { const child = spawn(command, args, { cwd: ROOT, env, stdio: options.stdio || ['ignore', 'ignore', 'inherit'] }); children.push(child); return child; };
const stop = () => children.reverse().forEach((child) => { try { child.kill('SIGTERM'); } catch {} });
process.on('exit', stop); process.on('SIGINT', () => { stop(); process.exit(130); });
start('python3', ['-m', 'http.server', String(httpPort), '--bind', httpBind]);
for (let attempt = 0; attempt < 40; attempt += 1) {
  try { const response = await fetch(`http://${httpHost}:${httpPort}/index.html`); if (response.ok) break; } catch {}
  if (attempt === 39) throw new Error('Testovací HTTP server se nespustil.');
  await new Promise((resolve) => setTimeout(resolve, 100));
}
start(chrome, ['--headless=new', '--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', `--remote-debugging-port=${cdpPort}`, `--user-data-dir=/tmp/domus-chromium-test-${cdpPort}`, 'about:blank']);
await new Promise((resolve) => setTimeout(resolve, 1600));
for (const test of ['browser-smoke.mjs', 'http-app-smoke.mjs', 'db-browser.mjs']) {
  const child = spawn(process.execPath, [path.join(ROOT, 'tests', test)], { cwd: ROOT, env, stdio: 'inherit' });
  const code = await new Promise((resolve) => child.on('exit', resolve));
  if (code !== 0) { stop(); process.exit(code || 1); }
}
stop();
console.log(`browser-tests: OK (HTTP ${httpPort}, CDP ${cdpPort})`);

(() => {
  'use strict';

  const textEncoder = new TextEncoder();
  const textDecoder = new TextDecoder('utf-8');
  const MAX_ENTRY_BYTES = 250 * 1024 * 1024;
  const MAX_TOTAL_BYTES = 1024 * 1024 * 1024;

  const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n += 1) {
      let c = n;
      for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
      table[n] = c >>> 0;
    }
    return table;
  })();

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  function u16(value) {
    const out = new Uint8Array(2);
    new DataView(out.buffer).setUint16(0, value, true);
    return out;
  }

  function u32(value) {
    const out = new Uint8Array(4);
    new DataView(out.buffer).setUint32(0, value >>> 0, true);
    return out;
  }

  function concat(parts) {
    const size = parts.reduce((sum, part) => sum + part.length, 0);
    const out = new Uint8Array(size);
    let offset = 0;
    for (const part of parts) {
      out.set(part, offset);
      offset += part.length;
    }
    return out;
  }

  function dosDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    const day = (year - 1980) << 9 | (date.getMonth() + 1) << 5 | date.getDate();
    return { time, date: day };
  }

  function createZip(entries) {
    const localParts = [];
    const centralParts = [];
    let offset = 0;
    const stamp = dosDateTime();
    for (const entry of entries) {
      const name = textEncoder.encode(entry.name.replace(/^\/+/, ''));
      const bytes = entry.bytes instanceof Uint8Array ? entry.bytes : textEncoder.encode(String(entry.bytes ?? ''));
      if (!name.length || bytes.length > MAX_ENTRY_BYTES) throw new Error(`Soubor ${entry.name || '(bez názvu)'} je příliš velký.`);
      const crc = crc32(bytes);
      const local = concat([
        u32(0x04034b50), u16(20), u16(0x0800), u16(0), u16(stamp.time), u16(stamp.date),
        u32(crc), u32(bytes.length), u32(bytes.length), u16(name.length), u16(0), name, bytes,
      ]);
      const central = concat([
        u32(0x02014b50), u16(20), u16(20), u16(0x0800), u16(0), u16(stamp.time), u16(stamp.date),
        u32(crc), u32(bytes.length), u32(bytes.length), u16(name.length), u16(0), u16(0), u16(0), u16(0),
        u32(0), u32(offset), name,
      ]);
      localParts.push(local);
      centralParts.push(central);
      offset += local.length;
    }
    const central = concat(centralParts);
    const end = concat([
      u32(0x06054b50), u16(0), u16(0), u16(entries.length), u16(entries.length), u32(central.length), u32(offset), u16(0),
    ]);
    return new Blob([...localParts, central, end], { type: 'application/zip' });
  }

  function findEnd(bytes) {
    for (let i = bytes.length - 22; i >= Math.max(0, bytes.length - 65557); i -= 1) {
      if (new DataView(bytes.buffer, bytes.byteOffset + i, 4).getUint32(0, true) === 0x06054b50) return i;
    }
    return -1;
  }

  function readZip(bytes) {
    if (bytes.length > MAX_TOTAL_BYTES) throw new Error('Záloha je větší než povolený limit 1 GB.');
    const endOffset = findEnd(bytes);
    if (endOffset < 0) throw new Error('Soubor není platný ZIP balíček DOMUS Studio.');
    const end = new DataView(bytes.buffer, bytes.byteOffset + endOffset, 22);
    const count = end.getUint16(10, true);
    let cursor = end.getUint32(16, true);
    const files = new Map();
    let total = 0;
    for (let index = 0; index < count; index += 1) {
      const view = new DataView(bytes.buffer, bytes.byteOffset + cursor);
      if (view.getUint32(0, true) !== 0x02014b50) throw new Error('ZIP balíček má poškozený adresář.');
      const method = view.getUint16(10, true);
      const crc = view.getUint32(16, true);
      const compressedSize = view.getUint32(20, true);
      const size = view.getUint32(24, true);
      const nameLength = view.getUint16(28, true);
      const extraLength = view.getUint16(30, true);
      const commentLength = view.getUint16(32, true);
      const localOffset = view.getUint32(42, true);
      const name = textDecoder.decode(bytes.subarray(cursor + 46, cursor + 46 + nameLength));
      if (method !== 0 || compressedSize !== size) throw new Error(`Soubor ${name} používá nepodporovanou kompresi.`);
      if (size > MAX_ENTRY_BYTES || total + size > MAX_TOTAL_BYTES) throw new Error('ZIP balíček překračuje bezpečnostní limity.');
      if (name.includes('..') || name.startsWith('/') || name.includes('\\')) throw new Error('ZIP balíček obsahuje nebezpečnou cestu.');
      const local = new DataView(bytes.buffer, bytes.byteOffset + localOffset);
      if (local.getUint32(0, true) !== 0x04034b50) throw new Error(`Soubor ${name} má poškozenou hlavičku.`);
      const localNameLength = local.getUint16(26, true);
      const localExtraLength = local.getUint16(28, true);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const content = bytes.slice(start, start + size);
      if (crc32(content) !== crc) throw new Error(`Kontrolní součet souboru ${name} nesouhlasí.`);
      files.set(name, content);
      total += size;
      cursor += 46 + nameLength + extraLength + commentLength;
    }
    return files;
  }

  function dataUrlToBytes(dataUrl) {
    const match = /^data:([^;,]+);base64,([a-z0-9+/=]+)$/i.exec(dataUrl);
    if (!match) return null;
    const binary = atob(match[2]);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
    return { mime: match[1].toLowerCase(), bytes };
  }

  function bytesToDataUrl(bytes, mime) {
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    return `data:${mime};base64,${btoa(binary)}`;
  }

  function extensionForMime(mime) {
    const map = {
      'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif',
      'application/pdf': 'pdf', 'text/plain': 'txt', 'text/csv': 'csv',
      'application/json': 'json', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    };
    return map[mime] || 'bin';
  }

  async function sha256(bytes) {
    if (!crypto?.subtle) return '';
    const digest = await crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  async function externalize(value, assets, path = 'root') {
    if (typeof value === 'string' && value.startsWith('data:')) {
      const parsed = dataUrlToBytes(value);
      if (!parsed) return value;
      const hash = await sha256(parsed.bytes);
      const safeBase = `${String(path).replace(/[^a-z0-9_-]+/gi, '-').slice(-70) || 'asset'}-${hash.slice(0, 16) || Math.random().toString(36).slice(2)}`;
      const name = `assets/${safeBase}.${extensionForMime(parsed.mime)}`;
      if (!assets.has(name)) assets.set(name, { name, mime: parsed.mime, bytes: parsed.bytes, sha256: hash });
      return { $asset: name, mime: parsed.mime, sha256: hash, size: parsed.bytes.length };
    }
    if (Array.isArray(value)) {
      const out = [];
      for (let i = 0; i < value.length; i += 1) out.push(await externalize(value[i], assets, `${path}-${i}`));
      return out;
    }
    if (value && typeof value === 'object') {
      const out = {};
      for (const [key, item] of Object.entries(value)) out[key] = await externalize(item, assets, `${path}-${key}`);
      return out;
    }
    return value;
  }

  async function hydrate(value, files) {
    if (Array.isArray(value)) return Promise.all(value.map((item) => hydrate(item, files)));
    if (value && typeof value === 'object') {
      if (typeof value.$asset === 'string') {
        const bytes = files.get(value.$asset);
        if (!bytes) throw new Error(`V záloze chybí příloha ${value.$asset}.`);
        const hash = await sha256(bytes);
        if (value.sha256 && hash && value.sha256 !== hash) throw new Error(`Příloha ${value.$asset} neprošla kontrolou integrity.`);
        return bytesToDataUrl(bytes, value.mime || 'application/octet-stream');
      }
      const out = {};
      for (const [key, item] of Object.entries(value)) out[key] = await hydrate(item, files);
      return out;
    }
    return value;
  }

  async function createProjectBackup(projects) {
    const assets = new Map();
    const secured = projects.map((project, index) => window.DomusCore.secureProject(project, index));
    const externalized = await externalize(secured, assets, 'projects');
    const manifest = {
      app: 'DOMUS Studio', appVersion: '7.0.0', schemaVersion: 7, format: 'domus-backup-zip-v1',
      exportedAt: new Date().toISOString(), projectCount: secured.length,
      assets: Array.from(assets.values(), ({ name, mime, sha256: hash, bytes }) => ({ name, mime, sha256: hash, size: bytes.length })),
      projects: externalized,
    };
    const manifestBytes = textEncoder.encode(JSON.stringify(manifest, null, 2));
    const entries = [{ name: 'manifest.json', bytes: manifestBytes }, ...Array.from(assets.values(), ({ name, bytes }) => ({ name, bytes }))];
    return createZip(entries);
  }

  async function readProjectBackup(file) {
    if (!file || file.size > MAX_TOTAL_BYTES) throw new Error('Záloha je příliš velká.');
    if (/\.json$/i.test(file.name) || file.type === 'application/json') {
      const payload = JSON.parse(await file.text());
      return { ...payload, projects: window.DomusCore.validateBackup(payload) };
    }
    const files = readZip(new Uint8Array(await file.arrayBuffer()));
    const manifestBytes = files.get('manifest.json');
    if (!manifestBytes) throw new Error('ZIP záloha neobsahuje manifest.json.');
    const manifest = JSON.parse(textDecoder.decode(manifestBytes));
    if (manifest.format !== 'domus-backup-zip-v1') throw new Error('Nepodporovaný formát ZIP zálohy.');
    const hydrated = await hydrate(manifest.projects, files);
    return { ...manifest, projects: window.DomusCore.validateBackup({ ...manifest, projects: hydrated }) };
  }

  async function createRfqPackage({ html, files = [], metadata = {} }) {
    const entries = [{ name: 'poptavka.html', bytes: textEncoder.encode(html) }];
    for (const file of files) {
      const parsed = dataUrlToBytes(file.dataUrl || '');
      if (!parsed) continue;
      entries.push({ name: `prilohy/${String(file.name || file.id || 'soubor').replace(/[^a-z0-9._-]+/gi, '-').slice(0, 80)}.${extensionForMime(parsed.mime)}`, bytes: parsed.bytes });
    }
    entries.push({ name: 'revize.json', bytes: textEncoder.encode(JSON.stringify(metadata, null, 2)) });
    return createZip(entries);
  }

  window.DomusBackup = { createProjectBackup, readProjectBackup, createRfqPackage, createZip };
})();

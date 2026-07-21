/* DOMUS Studio core security, validation and geometry helpers */
(() => {
  'use strict';

  const LIMITS = Object.freeze({
    backupBytes: 220 * 1024 * 1024,
    projectBytes: 180 * 1024 * 1024,
    text: 20000,
    shortText: 500,
    id: 120,
    array: 5000,
    depth: 30,
    imageBytes: 18 * 1024 * 1024,
    documentBytes: 24 * 1024 * 1024,
  });

  const FORBIDDEN_KEYS = new Set(['__proto__', 'prototype', 'constructor']);
  const ID_KEYS = /(^id$|Id$|^active.*Id$|^entryId$|^materialId$|^projectId$|^libraryKey$|^typeKey$|^docId$)/;
  const COLOR_KEYS = /(^color$|swatch$)/i;
  const URL_KEYS = /(^url$|Url$)/;
  const DATA_URL_KEYS = /(dataUrl$|DataUrl$|imageDataUrl$)/;
  const DATE_KEYS = /(At$|^date$|Date$|deadline$|purchaseDate$)/;
  const NUMBER_KEYS = /(^x[12]?$|^y[12]?$|width|height|depth|scale|angle|tilt|zoom|fov|pitch|yaw|quantity|price|cost|percent|confidence|accuracy|latitude|longitude|position|slider|thickness|coverage|months|area|perimeter|vat|contingency)/i;
  const BOOLEAN_KEYS = /^(is|has|show|include|remove|anonymize|verified|closed|auto|gyro|enabled)/i;

  function cleanText(value, maxLength = LIMITS.text) {
    return String(value ?? '')
      .replace(/\u0000/g, '')
      .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
      .slice(0, maxLength);
  }

  function cleanId(value, fallback = '') {
    const id = cleanText(value, LIMITS.id).trim().replace(/[^a-zA-Z0-9._:-]/g, '-').replace(/-+/g, '-');
    return id || fallback;
  }

  function cleanColor(value, fallback = '#647580') {
    const color = cleanText(value, 32).trim();
    return /^#[0-9a-f]{6}$/i.test(color) || /^#[0-9a-f]{3}$/i.test(color) ? color : fallback;
  }

  function cleanHttpUrl(value) {
    const input = cleanText(value, 2048).trim();
    if (!input) return '';
    try {
      const url = new URL(input);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function decodedDataSize(value) {
    const comma = String(value).indexOf(',');
    if (comma < 0) return Infinity;
    const meta = String(value).slice(0, comma);
    const payload = String(value).slice(comma + 1);
    if (/;base64/i.test(meta)) return Math.ceil(payload.length * 3 / 4);
    try { return new TextEncoder().encode(decodeURIComponent(payload)).length; } catch { return Infinity; }
  }

  function cleanDataUrl(value, kind = 'image') {
    const input = String(value ?? '').trim();
    if (!input) return null;
    const imagePattern = /^data:image\/(?:jpeg|png|webp);base64,[a-z0-9+/=\r\n]+$/i;
    const documentPattern = /^data:(?:application\/pdf|text\/plain|application\/(?:msword|vnd\.openxmlformats-officedocument\.(?:wordprocessingml\.document|spreadsheetml\.sheet|presentationml\.presentation)));base64,[a-z0-9+/=\r\n]+$/i;
    const allowed = kind === 'document' ? (imagePattern.test(input) || documentPattern.test(input)) : imagePattern.test(input);
    const limit = kind === 'document' ? LIMITS.documentBytes : LIMITS.imageBytes;
    return allowed && decodedDataSize(input) <= limit ? input : null;
  }

  function safeBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value !== 0;
    const text = String(value ?? '').trim().toLowerCase();
    if (['true', '1', 'yes', 'ano'].includes(text)) return true;
    if (['false', '0', 'no', 'ne', ''].includes(text)) return false;
    return false;
  }

  function finiteNumber(value, fallback = 0, min = -1000000000, max = 1000000000) {
    const parsed = typeof value === 'number' ? value : Number(String(value ?? '').replace(',', '.'));
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
  }

  function cleanDate(value) {
    const text = cleanText(value, 64).trim();
    if (!text) return '';
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? '' : text;
  }

  function sanitize(value, key = '', depth = 0, seen = new WeakSet()) {
    if (depth > LIMITS.depth) return null;
    if (value === null || value === undefined) return value === undefined ? null : value;
    if (typeof value === 'string') {
      if (DATA_URL_KEYS.test(key)) return cleanDataUrl(value, 'document');
      if (ID_KEYS.test(key)) return cleanId(value);
      if (COLOR_KEYS.test(key)) return cleanColor(value);
      if (URL_KEYS.test(key)) return cleanHttpUrl(value);
      if (DATE_KEYS.test(key)) return cleanDate(value);
      return cleanText(value, /name|title|label|category|status|type|unit|supplier|contractor|manufacturer|sku/i.test(key) ? LIMITS.shortText : LIMITS.text);
    }
    if (typeof value === 'number') return finiteNumber(value);
    if (typeof value === 'boolean') return value;
    if (typeof value !== 'object') return null;
    if (seen.has(value)) return null;
    seen.add(value);
    if (Array.isArray(value)) return value.slice(0, LIMITS.array).map((item) => sanitize(item, key, depth + 1, seen)).filter((item) => item !== undefined);
    const result = Object.create(null);
    for (const [rawKey, rawValue] of Object.entries(value)) {
      if (FORBIDDEN_KEYS.has(rawKey)) continue;
      const safeKey = cleanText(rawKey, 100).replace(/[^a-zA-Z0-9_$-]/g, '');
      if (!safeKey) continue;
      if (BOOLEAN_KEYS.test(safeKey)) result[safeKey] = safeBoolean(rawValue);
      else if (NUMBER_KEYS.test(safeKey) && typeof rawValue !== 'object' && rawValue !== '') result[safeKey] = finiteNumber(rawValue);
      else result[safeKey] = sanitize(rawValue, safeKey, depth + 1, seen);
    }
    return result;
  }

  function ensureProjectShape(project, index = 0) {
    if (!project || typeof project !== 'object' || Array.isArray(project)) throw new Error(`Projekt ${index + 1} nemá platnou strukturu.`);
    const safe = sanitize(project, 'project');
    safe.id = cleanId(safe.id, `project-import-${Date.now().toString(36)}-${index}`);
    safe.name = cleanText(safe.name || `Importovaný projekt ${index + 1}`, 120);
    safe.schemaVersion = Math.max(1, Math.min(7, Math.round(finiteNumber(safe.schemaVersion, 1, 1, 100))));
    safe.variants = Array.isArray(safe.variants) ? safe.variants.slice(0, 100) : [];
    if (!safe.variants.length) throw new Error(`Projekt „${safe.name}“ neobsahuje žádnou variantu.`);
    if (safe.survey?.photo) safe.survey.photo.dataUrl = cleanDataUrl(safe.survey.photo.dataUrl, 'image');
    for (const session of safe.survey?.field?.sessions || []) {
      session.photos = (session.photos || []).filter((photo) => { photo.dataUrl = cleanDataUrl(photo.dataUrl, 'image'); return Boolean(photo.dataUrl); });
    }
    if (safe.lifecycle) {
      for (const entry of safe.lifecycle.entries || []) {
        entry.photos = (entry.photos || []).filter((photo) => { photo.dataUrl = cleanDataUrl(photo.dataUrl, 'image'); return Boolean(photo.dataUrl); });
        entry.documents = (entry.documents || []).filter((document) => { document.dataUrl = cleanDataUrl(document.dataUrl, 'document'); return Boolean(document.dataUrl) || document.note; });
      }
      for (const warranty of safe.lifecycle.warranties || []) {
        warranty.documents = (warranty.documents || []).filter((document) => { document.dataUrl = cleanDataUrl(document.dataUrl, 'document'); return Boolean(document.dataUrl) || document.note; });
      }
    }

    safe.variants.forEach((variant, variantIndex) => {
      variant.id = cleanId(variant.id, `variant-${Date.now().toString(36)}-${index}-${variantIndex}`);
      variant.name = cleanText(variant.name || `Varianta ${variantIndex + 1}`, 120);
      if (variant.photo) variant.photo.dataUrl = cleanDataUrl(variant.photo.dataUrl, 'image');
      if (variant.comparison) {
        variant.comparison.beforeDataUrl = cleanDataUrl(variant.comparison.beforeDataUrl, 'image');
        variant.comparison.afterDataUrl = cleanDataUrl(variant.comparison.afterDataUrl, 'image');
      }
      for (const session of variant.field?.sessions || []) {
        session.photos = (session.photos || []).filter((photo) => {
          photo.dataUrl = cleanDataUrl(photo.dataUrl, 'image');
          return Boolean(photo.dataUrl);
        });
      }
      if (variant.ai) {
        variant.ai.photoSet = (variant.ai.photoSet || []).filter((photo) => {
          photo.dataUrl = cleanDataUrl(photo.dataUrl, 'image');
          return Boolean(photo.dataUrl);
        });
        if (variant.ai.visualizer) {
          variant.ai.visualizer.generations = (variant.ai.visualizer.generations || []).slice(0, 8).filter((item) => {
            item.dataUrl = cleanDataUrl(item.dataUrl, 'image');
            item.name = cleanText(item.name, 160);
            item.prompt = cleanText(item.prompt, 12000);
            item.sourcePhotoId = cleanId(item.sourcePhotoId);
            return Boolean(item.dataUrl);
          });
        }
        if (variant.ai.assistant) {
          variant.ai.assistant.messages = (variant.ai.assistant.messages || []).slice(-40).map((message) => ({ id: cleanId(message.id), role: message.role === 'user' ? 'user' : 'assistant', text: cleanText(message.text, 12000), createdAt: cleanText(message.createdAt, 80) }));
          variant.ai.assistant.pendingProposal = variant.ai.assistant.pendingProposal ? validateAiAssistantResponse({ reply: '', proposal: variant.ai.assistant.pendingProposal }).proposal : null;
        }
      }
      if (variant.diary) {
        for (const entry of variant.diary.entries || []) {
          entry.photos = (entry.photos || []).filter((photo) => {
            photo.dataUrl = cleanDataUrl(photo.dataUrl, 'image');
            return Boolean(photo.dataUrl);
          });
          entry.documents = (entry.documents || []).filter((document) => {
            document.dataUrl = cleanDataUrl(document.dataUrl, 'document');
            return Boolean(document.dataUrl) || Boolean(document.note);
          });
        }
        for (const warranty of variant.diary.warranties || []) {
          warranty.documents = (warranty.documents || []).filter((document) => {
            document.dataUrl = cleanDataUrl(document.dataUrl, 'document');
            return Boolean(document.dataUrl) || Boolean(document.note);
          });
        }
      }
    });
    safe.activeVariantId = cleanId(safe.activeVariantId, safe.variants[0].id);
    if (!safe.variants.some((variant) => variant.id === safe.activeVariantId)) safe.activeVariantId = safe.variants[0].id;
    const encodedSize = new TextEncoder().encode(JSON.stringify(safe)).length;
    if (encodedSize > LIMITS.projectBytes) throw new Error(`Projekt „${safe.name}“ překračuje bezpečný limit velikosti.`);
    return safe;
  }

  function validateBackup(payload) {
    const projects = Array.isArray(payload?.projects) ? payload.projects : (Array.isArray(payload) ? payload : []);
    if (!projects.length) throw new Error('Záloha neobsahuje žádné projekty.');
    if (projects.length > 500) throw new Error('Záloha obsahuje příliš mnoho projektů.');
    return projects.map(ensureProjectShape);
  }

  function validateAiAnalysis(input) {
    const value = sanitize(input, 'analysis');
    if (!value || typeof value !== 'object') throw new Error('AI výstup nemá platnou strukturu.');
    return {
      summary: cleanText(value.summary, 5000),
      confidence: finiteNumber(value.confidence, 0, 0, 1),
      roomType: cleanText(value.roomType, 120),
      proposedPlan: value.proposedPlan && typeof value.proposedPlan === 'object' ? {
        shape: ['rectangle', 'polygon'].includes(value.proposedPlan.shape) ? value.proposedPlan.shape : 'rectangle',
        widthMm: value.proposedPlan.widthMm == null ? null : finiteNumber(value.proposedPlan.widthMm, 3000, 500, 50000),
        depthMm: value.proposedPlan.depthMm == null ? null : finiteNumber(value.proposedPlan.depthMm, 2400, 500, 50000),
        wallHeightM: value.proposedPlan.wallHeightM == null ? null : finiteNumber(value.proposedPlan.wallHeightM, 0, 0.5, 20),
        reasoning: cleanText(value.proposedPlan.reasoning, 3000),
      } : null,
      elements: (Array.isArray(value.elements) ? value.elements : []).slice(0, 20).map((item) => ({
        name: cleanText(item?.name, 160), typeKey: cleanId(item?.typeKey), layer: cleanId(item?.layer),
        confidence: finiteNumber(item?.confidence, 0, 0, 1), notes: cleanText(item?.notes, 1000),
      })),
      utilities: (Array.isArray(value.utilities) ? value.utilities : []).slice(0, 30).map((item) => cleanText(item, 500)),
      risks: (Array.isArray(value.risks) ? value.risks : []).slice(0, 30).map((item) => cleanText(item, 1000)),
      measurementsToVerify: (Array.isArray(value.measurementsToVerify) ? value.measurementsToVerify : []).slice(0, 30).map((item) => cleanText(item, 1000)),
    };
  }

  function validateAiVariants(input) {
    const value = sanitize(input, 'variants');
    const variants = Array.isArray(value?.variants) ? value.variants.slice(0, 3) : [];
    if (!variants.length) throw new Error('AI nevrátila žádné použitelné varianty.');
    return variants.map((item, index) => ({
      name: cleanText(item.name || `Varianta ${index + 1}`, 120),
      style: cleanText(item.style, 120),
      description: cleanText(item.description, 3000),
      budgetFactor: finiteNumber(item.budgetFactor, 1, 0.7, 1.6),
      contingencyPercent: finiteNumber(item.contingencyPercent, 10, 0, 100),
      changes: (Array.isArray(item.changes) ? item.changes : []).slice(0, 8).map((change) => cleanText(change, 1000)),
    }));
  }

  const AI_ASSISTANT_ACTIONS = new Set(['add_object','move_object','resize_object','remove_object','add_material','add_cost','set_contingency','append_notes','set_wall_height','set_surface_material','create_variant']);

  function validateAiAssistantResponse(input) {
    const value = sanitize(input, 'assistant');
    if (!value || typeof value !== 'object') throw new Error('AI asistent nevrátil platnou strukturu.');
    const reply = cleanText(value.reply, 12000);
    const rawProposal = value.proposal && typeof value.proposal === 'object' ? value.proposal : null;
    let proposal = null;
    if (rawProposal) {
      const actions = (Array.isArray(rawProposal.actions) ? rawProposal.actions : []).slice(0, 12).map((item) => {
        const type = cleanId(item?.type);
        if (!AI_ASSISTANT_ACTIONS.has(type)) throw new Error(`AI navrhla nepovolenou akci: ${type || 'bez názvu'}.`);
        const params = sanitize(item?.params && typeof item.params === 'object' ? item.params : {}, `assistant.${type}`);
        const cleanParams = {};
        const textKeys = ['objectId','libraryKey','type','layer','name','category','manufacturer','sku','unit','color','swatch','note','text','surface','materialId'];
        const numberKeys = ['xMm','yMm','widthMm','depthMm','heightMm','heightCm','heightM','rotation','quantity','unitPrice','wastePercent','percent'];
        for (const key of textKeys) if (params[key] != null) cleanParams[key] = cleanText(params[key], key === 'text' || key === 'note' ? 6000 : 240);
        for (const key of numberKeys) if (params[key] != null) cleanParams[key] = finiteNumber(params[key], 0, -100000000, 100000000);
        if (['move_object','resize_object','remove_object'].includes(type) && !cleanParams.objectId) throw new Error(`Akce ${type} nemá identifikátor prvku.`);
        if (type === 'add_object' && !cleanParams.libraryKey && !cleanParams.type) throw new Error('Přidávaný prvek nemá typ knihovny.');
        if (type === 'append_notes' && !cleanParams.text) throw new Error('Doplnění poznámek je prázdné.');
        if (type === 'set_surface_material' && (!['wall','floor','ceiling'].includes(cleanParams.surface) || !cleanParams.materialId)) throw new Error('Přiřazení povrchu není úplné.');
        return { type, label: cleanText(item?.label || type, 500), params: cleanParams };
      });
      if (actions.length) proposal = {
        title: cleanText(rawProposal.title || 'Návrh změn', 240),
        summary: cleanText(rawProposal.summary, 3000),
        risk: ['low','medium','high'].includes(rawProposal.risk) ? rawProposal.risk : 'medium',
        assumptions: (Array.isArray(rawProposal.assumptions) ? rawProposal.assumptions : []).slice(0, 12).map((item) => cleanText(item, 1000)),
        actions,
      };
    }
    if (!reply && !proposal) throw new Error('AI asistent nevrátil odpověď ani návrh změn.');
    return { reply: reply || 'Připravil jsem návrh změn ke kontrole.', proposal };
  }

  function csvCell(value) {
    let text = cleanText(value, 10000);
    if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replace(/"/g, '""')}"`;
  }

  function pointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1], xj = polygon[j][0], yj = polygon[j][1];
      const intersect = ((yi > point[1]) !== (yj > point[1])) && (point[0] < (xj - xi) * (point[1] - yi) / ((yj - yi) || Number.EPSILON) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function rectCorners(rect) {
    return [[rect.left, rect.top], [rect.right, rect.top], [rect.right, rect.bottom], [rect.left, rect.bottom]];
  }

  function rectInsidePolygon(rect, polygon) {
    return Boolean(polygon?.length) && rectCorners(rect).every((point) => pointInPolygon(point, polygon) || distancePointToPolygon(point, polygon) < 0.5);
  }

  function distancePointToSegment(point, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const lengthSquared = dx * dx + dy * dy;
    if (!lengthSquared) return Math.hypot(point[0] - a[0], point[1] - a[1]);
    const t = Math.max(0, Math.min(1, ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / lengthSquared));
    return Math.hypot(point[0] - (a[0] + t * dx), point[1] - (a[1] + t * dy));
  }

  function distancePointToPolygon(point, polygon) {
    let minimum = Infinity;
    for (let index = 0; index < polygon.length; index += 1) minimum = Math.min(minimum, distancePointToSegment(point, polygon[index], polygon[(index + 1) % polygon.length]));
    return minimum;
  }

  function rectDistance(a, b) {
    const dx = Math.max(a.left - b.right, b.left - a.right, 0);
    const dy = Math.max(a.top - b.bottom, b.top - a.bottom, 0);
    return Math.hypot(dx, dy);
  }

  function objectRect(object) {
    return { left: finiteNumber(object.x), top: finiteNumber(object.y), right: finiteNumber(object.x) + Math.max(1, finiteNumber(object.width, 1)), bottom: finiteNumber(object.y) + Math.max(1, finiteNumber(object.depth, 1)) };
  }

  function lineEndpoints(object) {
    const rect = objectRect(object);
    return [[rect.left, (rect.top + rect.bottom) / 2], [rect.right, (rect.top + rect.bottom) / 2]];
  }

  function segmentDistance(a1, a2, b1, b2) {
    return Math.min(distancePointToSegment(a1, b1, b2), distancePointToSegment(a2, b1, b2), distancePointToSegment(b1, a1, a2), distancePointToSegment(b2, a1, a2));
  }

  function orientation(a, b, c) {
    const value = (b[1] - a[1]) * (c[0] - b[0]) - (b[0] - a[0]) * (c[1] - b[1]);
    return Math.abs(value) < 1e-9 ? 0 : (value > 0 ? 1 : 2);
  }

  function segmentsIntersect(a1, a2, b1, b2) {
    const o1 = orientation(a1, a2, b1), o2 = orientation(a1, a2, b2);
    const o3 = orientation(b1, b2, a1), o4 = orientation(b1, b2, a2);
    if (o1 !== o2 && o3 !== o4) return true;
    const onSegment = (p, q, r) => q[0] <= Math.max(p[0], r[0]) + 1e-9 && q[0] + 1e-9 >= Math.min(p[0], r[0]) && q[1] <= Math.max(p[1], r[1]) + 1e-9 && q[1] + 1e-9 >= Math.min(p[1], r[1]);
    return (o1 === 0 && onSegment(a1, b1, a2)) || (o2 === 0 && onSegment(a1, b2, a2)) || (o3 === 0 && onSegment(b1, a1, b2)) || (o4 === 0 && onSegment(b1, a2, b2));
  }

  function pointInRect(point, rect) {
    return point[0] >= rect.left && point[0] <= rect.right && point[1] >= rect.top && point[1] <= rect.bottom;
  }

  function segmentRectDistance(a, b, rect) {
    if (pointInRect(a, rect) || pointInRect(b, rect)) return 0;
    const corners = rectCorners(rect);
    for (let index = 0; index < corners.length; index += 1) if (segmentsIntersect(a, b, corners[index], corners[(index + 1) % corners.length])) return 0;
    return Math.min(
      ...corners.map((point) => distancePointToSegment(point, a, b)),
      ...[a, b].flatMap((point) => corners.map((corner, index) => distancePointToSegment(point, corner, corners[(index + 1) % corners.length]))),
    );
  }

  function geometryDistance(a, b) {
    if (a.shape === 'line' && b.shape === 'line') {
      const raw = segmentsIntersect(...lineEndpoints(a), ...lineEndpoints(b)) ? 0 : segmentDistance(...lineEndpoints(a), ...lineEndpoints(b));
      return Math.max(0, raw - Math.max(Number(a.depth || 0), Number(b.depth || 0)) / 2);
    }
    if (a.shape === 'line') return Math.max(0, segmentRectDistance(...lineEndpoints(a), objectRect(b)) - Number(a.depth || 0) / 2);
    if (b.shape === 'line') return geometryDistance(b, a);
    return rectDistance(objectRect(a), objectRect(b));
  }

  window.DomusCore = Object.freeze({
    LIMITS, cleanText, cleanId, cleanColor, cleanHttpUrl, cleanDataUrl, finiteNumber,
    sanitize, secureProject: ensureProjectShape, validateBackup, validateAiAnalysis,
    validateAiVariants, validateAiAssistantResponse, csvCell, pointInPolygon, rectInsidePolygon, rectDistance,
    objectRect, geometryDistance,
  });
})();

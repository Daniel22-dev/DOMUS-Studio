/* DOMUS Verify v6 – deterministic preliminary checks with accepted-risk separation */
(() => {
  'use strict';

  const SEVERITY = Object.freeze({
    critical: { label: 'Kritická chyba', weight: 25 },
    warning: { label: 'Varování', weight: 10 },
    info: { label: 'Doporučení', weight: 3 },
  });

  const COMPATIBLE_OVERLAPS = new Set([
    'floor-drain|shower-tray',
    'drain|shower-tray',
    'drain|sink',
    'sink|water-pipe',
    'floor-drain|floor-heating',
    'floor-heating|shower-tray',
    'irrigation-pipe|sprinkler',
    'irrigation-pipe|valve-box',
    'valve|water-pipe',
  ]);

  function pairKey(a, b) {
    return [a.libraryKey || a.type || '', b.libraryKey || b.type || ''].sort().join('|').toLowerCase();
  }

  function distance(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }

  function orderedPolygon(plan) {
    const walls = [...(plan.walls || [])];
    if (walls.length < 3) return null;
    const tolerance = Math.max(2, Number(plan.scale || 50) * 0.03); // 30 mm regardless of zoom
    const first = walls.shift();
    const points = [[first.x1, first.y1], [first.x2, first.y2]];
    let current = points[1];
    while (walls.length) {
      let found = -1;
      let next = null;
      for (let index = 0; index < walls.length; index += 1) {
        const wall = walls[index];
        const a = [wall.x1, wall.y1], b = [wall.x2, wall.y2];
        if (distance(current, a) <= tolerance) { found = index; next = b; break; }
        if (distance(current, b) <= tolerance) { found = index; next = a; break; }
      }
      if (found < 0) return null;
      walls.splice(found, 1);
      points.push(next);
      current = next;
    }
    if (distance(points.at(-1), points[0]) > tolerance) return null;
    points.pop();
    return points.length >= 3 ? points : null;
  }

  function overlapArea(a, b) {
    return Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  }

  function doorClearance(object) {
    const rect = DomusCore.objectRect(object);
    const width = Math.max(1, Number(object.width || 1));
    const hinge = object.hingeSide || 'left';
    const opens = object.opensTo || 'inside';
    const direction = opens === 'outside' ? -1 : 1;
    if (hinge === 'right') return { left: rect.right - width, right: rect.right + width, top: direction > 0 ? rect.top : rect.top - width, bottom: direction > 0 ? rect.bottom + width : rect.bottom };
    return { left: rect.left - width, right: rect.left + width, top: direction > 0 ? rect.top : rect.top - width, bottom: direction > 0 ? rect.bottom + width : rect.bottom };
  }

  function fingerprint(issue) {
    const source = `${issue.id}|${issue.severity}|${issue.title}|${issue.detail}`;
    let hash = 2166136261;
    for (let index = 0; index < source.length; index += 1) { hash ^= source.charCodeAt(index); hash = Math.imul(hash, 16777619); }
    return (hash >>> 0).toString(36);
  }

  function measurementSummary(variant) {
    const list = (variant.field?.sessions || []).flatMap((session) => session.measurements || []);
    const result = { total: list.length, measured: 0, derived: 0, estimate: 0, ai: 0, unverified: 0, linked: 0 };
    for (const item of list) {
      const source = item.source || (item.verified ? 'measured' : 'estimate');
      result[source] = (result[source] || 0) + 1;
      if (!item.verified) result.unverified += 1;
      if (item.targetId) result.linked += 1;
    }
    return result;
  }

  function buildReport(variant, metrics, budgetTotal = 0) {
    const issues = [];
    const add = (id, severity, title, detail, tab = 'plan', domain = 'coordination') => {
      const issue = { id, severity, title, detail, tab, domain };
      issue.fingerprint = fingerprint(issue);
      issues.push(issue);
    };
    const plan = variant.plan || { walls: [], objects: [], scale: 50 };
    const objects = plan.objects || [];
    const polygon = metrics?.polygon || orderedPolygon(plan);

    if (!(plan.walls || []).length) add('missing-walls', 'critical', 'Půdorys neobsahuje stěny', 'Bez základní geometrie nelze ověřit plochu, hranice místnosti ani umístění prvků.', 'plan', 'geometry');
    else if (!polygon) add('open-plan', 'warning', 'Půdorys není spolehlivě uzavřený', 'Koncové body stěn musí navazovat s tolerancí 30 mm. Výpočet plochy může být neúplný.', 'plan', 'geometry');

    objects.forEach((object, index) => {
      const rect = DomusCore.objectRect(object);
      if (polygon && !DomusCore.rectInsidePolygon(rect, polygon)) add(`outside-${object.id}`, 'warning', `${object.type} zasahuje mimo skutečný obrys`, 'Alespoň část půdorysné obálky leží mimo polygon místnosti. Ověřte polohu, rozměry nebo výklenek.', 'plan', 'geometry');
      if (/ověřit|rozpoznáno|odhad/i.test(object.note || '')) add(`unverified-object-${object.id}`, 'info', `${object.type} je veden jako neověřený`, object.note || 'Zkontrolujte polohu a rozměr prvku.', 'plan', 'measurements');
      if (object.libraryKey === 'door' && (!object.hingeSide || !object.opensTo)) add(`door-direction-${object.id}`, 'info', `U dveří „${object.type}“ chybí směr otevírání`, 'Doplňte stranu pantů a otevírání dovnitř nebo ven, jinak je kontrola manipulačního prostoru pouze orientační.', 'plan', 'coordination');

      for (let otherIndex = index + 1; otherIndex < objects.length; otherIndex += 1) {
        const other = objects[otherIndex];
        const key = pairKey(object, other);
        const overlap = overlapArea(rect, DomusCore.objectRect(other));
        if (overlap > Math.max(20, Number(plan.scale || 50) * 0.01) && !COMPATIBLE_OVERLAPS.has(key) && object.shape !== 'area' && other.shape !== 'area') {
          add(`collision-${[object.id, other.id].sort().join('-')}`, 'critical', `Kolize: ${object.type} × ${other.type}`, 'Skutečné geometrie prvků se překrývají a tato dvojice není vedena jako kompatibilní souběh. Ověřte výškovou úroveň a polohu.', 'plan', 'coordination');
        }
        const layers = new Set([object.layer, other.layer]);
        if (layers.has('electricity') && (layers.has('water') || layers.has('sewer'))) {
          const gapMeters = DomusCore.geometryDistance(object, other) / Math.max(1, Number(plan.scale || 50));
          if (gapMeters < 0.3) add(`service-gap-${[object.id, other.id].sort().join('-')}`, 'warning', 'Elektro je blízko vody nebo odpadu', `${object.type} a ${other.type} mají nejkratší půdorysný odstup přibližně ${Math.round(gapMeters * 1000)} mm. Požadovanou vzdálenost a výškové vedení musí potvrdit odborník.`, 'plan', 'coordination');
        }
      }

      if (object.libraryKey === 'door') {
        const clearance = doorClearance(object);
        const hit = objects.find((other) => other.id !== object.id && other.shape !== 'line' && other.shape !== 'area' && overlapArea(clearance, DomusCore.objectRect(other)) > 20 && !COMPATIBLE_OVERLAPS.has(pairKey(object, other)));
        if (hit) add(`door-clearance-${object.id}-${hit.id}`, 'warning', `Otevírání dveří může blokovat ${hit.type}`, 'Kontrola používá zadanou stranu pantů, směr otevírání a šířku křídla. Ověřte také výškovou úroveň a skutečný typ dveří.', 'plan', 'coordination');
      }
    });

    const source = measurementSummary(variant);
    if (!source.total) add('no-measurements', 'critical', 'Chybí fyzicky zapsané rozměry', 'Před objednávkou nebo realizací doplňte základní rozměry prostoru.', 'field', 'measurements');
    else {
      if (!source.measured) add('no-verified-measurements', 'critical', 'Žádný rozměr není označen jako fyzicky změřený', 'Projekt stojí pouze na odhadech, AI nebo odvozených údajích.', 'field', 'measurements');
      if (source.unverified) add('unverified-measurements', 'warning', `${source.unverified} rozměrů není ověřeno`, 'Před poptávkou zkontrolujte všechny rozhodující výšky, otvory a napojení.', 'field', 'measurements');
      if (source.linked < source.measured) add('unlinked-measurements', 'info', `${source.measured - source.linked} fyzických měření není navázáno na konkrétní prvek`, 'Pro dohledatelnost přiřaďte rozhodující měření ke stěně, dveřím, objektu nebo instalačnímu bodu.', 'field', 'measurements');
      if (source.ai) add('ai-measurements', 'info', `${source.ai} údajů pochází z AI návrhu`, 'AI údaje mají nejnižší důvěryhodnost a nesmí být použity pro objednávku bez měření.', 'field', 'measurements');
    }
    if (!(variant.materials || []).length) add('no-materials', 'info', 'Nejsou vybrány konkrétní výrobky nebo materiály', 'Dodavatel nebude mít jednoznačný podklad pro vzhled a cenovou nabídku.', 'materials', 'materials');
    if (!budgetTotal) add('no-budget', 'info', 'Projekt nemá orientační rozpočet', 'Doplňte alespoň hlavní materiály, práci a rezervu.', 'budget', 'budget');

    const overrides = variant.audit?.overrides || {};
    const visible = issues.map((issue) => {
      const override = overrides[issue.id];
      const validOverride = override && override.fingerprint === issue.fingerprint;
      return { ...issue, status: validOverride ? override.status : 'open', overrideNote: validOverride ? (override.note || '') : '', overrideAt: validOverride ? override.updatedAt : '' };
    });
    const technicalOpen = visible;
    const acceptedOpen = visible.filter((issue) => issue.status === 'open');
    const technicalScore = Math.max(0, 100 - technicalOpen.reduce((sum, issue) => sum + (SEVERITY[issue.severity]?.weight || 0), 0));
    const acceptedScore = Math.max(0, 100 - acceptedOpen.reduce((sum, issue) => sum + (SEVERITY[issue.severity]?.weight || 0), 0));
    const domainNames = { geometry: 'Geometrie', measurements: 'Ověřenost údajů', coordination: 'Koordinace profesí', materials: 'Specifikace', budget: 'Rozpočet' };
    const domains = Object.entries(domainNames).map(([id, label]) => {
      const domainIssues = visible.filter((issue) => issue.domain === id);
      return { id, label, open: domainIssues.filter((issue) => issue.status === 'open').length, critical: domainIssues.filter((issue) => issue.status === 'open' && issue.severity === 'critical').length };
    });
    return { issues: visible, open: acceptedOpen, technicalOpen, score: acceptedScore, technicalScore, acceptedScore, source, metrics, domains, ranAt: new Date().toISOString() };
  }

  window.DomusAudit = Object.freeze({ SEVERITY, buildReport, orderedPolygon });
})();

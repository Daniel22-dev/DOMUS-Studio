/* Backup import/export, RFQ/PDF preparation and report images. Source fragment; assembled by scripts/build.mjs. */
  async function exportBackup() {
    try {
      setSaveState('saving');
      const blob = await DomusBackup.createProjectBackup(state.projects);
      downloadBlob(blob, `DOMUS-Studio-v7-zaloha-${new Date().toISOString().slice(0,10)}.domus.zip`);
      setSaveState('saved');
      toast('ZIP záloha v7 byla vytvořena včetně příloh a kontrolních součtů.');
    } catch (error) {
      setSaveState('error', error.message);
      toast(error.message || 'Zálohu se nepodařilo vytvořit.', 'error');
    }
  }

  function assignImportedIdentity(project, usedIds) {
    const copy = deepClone(project);
    let nextId = DomusCore.safeId(copy.id, 'project');
    while (usedIds.has(nextId)) nextId = uid('project');
    copy.id = nextId;
    copy.name = `${copy.name} (importovaná kopie)`;
    copy.variants = (copy.variants || []).map((variant) => ({ ...variant, id: uid('variant') }));
    copy.activeVariantId = copy.variants[0]?.id || '';
    usedIds.add(nextId);
    return ensureProjectV6(copy);
  }

  async function importBackup(event) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const validated = await DomusBackup.readProjectBackup(file);
      const raw = validated.projects || [];
      if (!raw.length) throw new Error('Záloha neobsahuje žádné projekty.');
      const incoming = raw.map((project, index) => ensureProjectV6(DomusCore.secureProject(project, index)));
      const collisions = incoming.filter((project) => state.projects.some((existing) => existing.id === project.id)).length;
      const replace = collisions ? confirm(`Záloha obsahuje ${incoming.length} projektů a ${collisions} shodných identifikátorů.\n\nOK = nahradit shodné projekty\nZrušit = importovat je jako nové kopie`) : true;
      if (!collisions && !confirm(`Importovat ${incoming.length} projektů? Před importem bude vytvořen bod obnovy.`)) return;
      await DomusDB.createSnapshot(state.projects, `Před importem ${file.name}`);
      const map = new Map(state.projects.map((project) => [project.id, project]));
      const usedIds = new Set(map.keys());
      const prepared = incoming.map((project) => (!replace && usedIds.has(project.id) ? assignImportedIdentity(project, usedIds) : project));
      for (const project of prepared) map.set(project.id, project);
      const nextProjects = Array.from(map.values()).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      for (const project of prepared) await DomusDB.put(project, { skipSnapshot: true });
      state.projects = nextProjects;
      state.currentProjectId = null;
      toast(`Import dokončen: ${prepared.length} projektů. Původní stav lze obnovit v Úložišti.`);
      render();
    } catch (error) {
      console.error(error);
      toast(error.message || 'Soubor zálohy se nepodařilo bezpečně načíst.', 'error');
    }
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function printAssemblyTable(variant) {
    const labels={floor:'Podlaha',wall:'Stěna',ceiling:'Strop / podhled'};
    return Object.entries(labels).map(([type,label])=>`<h3>${label}</h3><table class="print-table compact"><thead><tr><th>Vrstva</th><th>Materiál</th><th>Tloušťka</th><th>Poznámka</th></tr></thead><tbody>${(variant.assemblies[type]||[]).map((layer)=>`<tr><td><span class="print-swatch" style="background:${escapeHtml(layer.color)}"></span>${escapeHtml(layer.name)}</td><td>${escapeHtml(layer.material||'—')}</td><td>${parseNum(layer.thicknessMm)} mm</td><td>${escapeHtml(layer.note||'—')}</td></tr>`).join('')}</tbody></table>`).join('');
  }

  async function prepareAndPrint(options = {}) {
    const project = currentProject(); const variant = currentVariant(project); if (!project || !variant) return;
    const summary = budgetSummary(variant); const metrics = summary.metrics;
    const photoImage = state.pdfOptions.photo && variant.photo.dataUrl ? await photoReportImage(variant.photo) : '';
    const planCanvas = document.createElement('canvas'); planCanvas.width=1400;planCanvas.height=900;if(state.pdfOptions.plan)drawPlanCanvas(planCanvas,variant);const planImage=state.pdfOptions.plan?planCanvas.toDataURL('image/png'):'';
    const sectionCanvas = document.createElement('canvas'); sectionCanvas.width=1400;sectionCanvas.height=850;if(state.pdfOptions.section)drawSectionCanvas(sectionCanvas,variant);const sectionImage=state.pdfOptions.section?sectionCanvas.toDataURL('image/png'):'';
    const modelCanvas = document.createElement('canvas'); modelCanvas.width=1400;modelCanvas.height=900;if(state.pdfOptions.model)drawModelCanvas(modelCanvas,variant.plan,variant,'material');const modelImage=state.pdfOptions.model?modelCanvas.toDataURL('image/png'):'';
    const comparisonBefore=variant.comparison.beforeDataUrl||variant.photo.dataUrl||'';const comparisonAfter=variant.comparison.afterDataUrl||'';

    printArea.innerHTML = `
      <div class="print-cover">
        <div><div class="print-brand">${escapeHtml(state.branding?.company || 'DOMUS Studio')} · projektová dokumentace</div><h1>${escapeHtml(project.name)}</h1><p class="subtitle">${escapeHtml(project.summary || '')}</p></div>
        <div><div class="print-meta"><div><small>Varianta</small><strong>${escapeHtml(variant.name)}</strong></div><div><small>Stav</small><strong>${escapeHtml(project.status)}</strong></div><div><small>Datum</small><strong>${formatDate(new Date())}</strong></div><div><small>Umístění</small><strong>${escapeHtml(project.location || 'neuvedeno')}</strong></div><div><small>Plocha podlahy</small><strong>${measure(metrics.floorArea)}</strong></div><div><small>Orientační rozpočet</small><strong>${money(summary.total)}</strong></div></div><p class="print-footer">${escapeHtml(state.branding?.footer || 'Vytvořeno v DOMUS Studio v7. Dokument slouží ke komunikaci záměru, nikoli jako autorizovaná projektová dokumentace.')} Revize ${escapeHtml(project.reportRevisionLabel || `R${project.reportRevision || 1}`)}.</p></div>
      </div>
      ${state.pdfOptions.field ? (() => { const session = currentFieldSession(variant); return `<section class="print-section"><h2>Mobilní zaměření</h2><p><strong>${escapeHtml(session?.name || 'Bez zaměření')}</strong> · ${session?.measurements?.length || 0} údajů · ${session?.photos?.length || 0} fotografií · ${session?.scans?.length || 0} prostorových podkladů</p>${session?.location ? `<p>Poloha: ${session.location.latitude.toFixed(5)}, ${session.location.longitude.toFixed(5)} · přesnost přibližně ${Math.round(session.location.accuracy || 0)} m</p>` : ''}${session?.measurements?.length ? `<table class="print-table"><thead><tr><th>Údaj</th><th>Kategorie</th><th>Hodnota</th><th>Ověřeno</th></tr></thead><tbody>${session.measurements.map((item) => `<tr><td>${escapeHtml(item.label)}</td><td>${escapeHtml(item.category)}</td><td><strong>${escapeHtml(String(item.value))} ${escapeHtml(item.unit)}</strong></td><td>${item.verified ? 'ano' : 'ne'}</td></tr>`).join('')}</tbody></table>` : '<p>Bez zaznamenaných rozměrů.</p>'}<p class="print-note">Údaje označené jako neověřené jsou pracovní poznámky z terénu a nesmí být použity k objednávce bez kontroly.</p></section>`; })() : ''}
      ${state.pdfOptions.ai && (variant.ai.analysis || variant.ai.localAnalysis) ? (() => { const analysis = variant.ai.analysis || variant.ai.localAnalysis; return `<section class="print-section"><h2>Asistovaná analýza prostoru</h2><p><strong>Zdroj:</strong> ${variant.ai.analysis ? 'cloudová obrazová AI' : 'kontrola fotografie a detekce linií'} · jistota ${confidenceLabel(analysis.confidence || 0)}</p><p>${escapeHtml(analysis.summary || '')}</p><h3>Identifikované prvky</h3>${renderAnalysisList(analysis.elements?.map((item) => `${item.name}${item.notes ? ` – ${item.notes}` : ''}`), 'Bez identifikovaných prvků.')}<h3>Rizika a nejistoty</h3>${renderAnalysisList(analysis.risks, 'Bez záznamu.')}<h3>Rozměry k fyzickému ověření</h3>${renderAnalysisList(analysis.measurementsToVerify || analysis.recommendations, 'Bez záznamu.')}<p class="print-note">Výsledek obrazové analýzy není měřením ani autorizovaným posouzením. Každý rozměr a konstrukční závěr musí být ověřen na místě.</p></section>`; })() : ''}
      ${photoImage ? `<section class="print-section"><h2>Fotografie skutečného stavu a kóty</h2><img src="${photoImage}" alt="Fotografie s kótami"><p class="print-note">Rozměry odvozené z fotografie jsou orientační. Ručně naměřené údaje mají přednost.</p></section>` : ''}
      ${planImage ? `<section class="print-section"><h2>2D výkres, instalační vrstvy a řezná čára</h2><img src="${planImage}" alt="2D výkres"><p class="print-note">Měřítko pracovní plochy: ${variant.plan.scale} px = 1 m. Zobrazení vrstev odpovídá nastavení aktuální varianty.</p></section>` : ''}
      ${sectionImage ? `<section class="print-section"><h2>${escapeHtml(variant.section.name)} a konstrukční skladby</h2><img src="${sectionImage}" alt="Schematický řez">${printAssemblyTable(variant)}<p class="print-note">Řez je schematický a vychází ze zadané výšky, polohy řezné čáry a tlouštěk vrstev.</p></section>` : ''}
      ${modelImage ? `<section class="print-section"><h2>Materiálový prostorový náhled</h2><img src="${modelImage}" alt="3D náhled"><p class="print-note">Barevné povrchy vycházejí z materiálů přiřazených v knihovně projektu.</p></section>` : ''}
      ${state.pdfOptions.calculations ? `<section class="print-section"><h2>Výpočet rozměrů a ploch</h2><table class="print-table"><tbody><tr><th>Plocha podlahy</th><td>${measure(metrics.floorArea)}</td><th>Plocha stropu</th><td>${measure(metrics.ceilingArea)}</td></tr><tr><th>Obvod</th><td>${measure(metrics.perimeter,'m')}</td><th>Hrubá plocha stěn</th><td>${measure(metrics.grossWallArea)}</td></tr><tr><th>Plocha otvorů</th><td>${measure(metrics.openingsArea)}</td><th>Čistá plocha stěn</th><td>${measure(metrics.wallArea)}</td></tr><tr><th>Skladba podlahy</th><td>${metrics.floorBuildUp} mm</td><th>Skladba stěny</th><td>${metrics.wallBuildUp} mm</td></tr></tbody></table><p class="print-note">${metrics.closed?'Půdorys je uzavřený a plocha byla vypočtena geometricky.':'Půdorys není uzavřený; plocha může být ručně zadaná nebo neúplná.'}</p></section>` : ''}
      ${state.pdfOptions.materials ? `<section class="print-section"><h2>Výrobky, materiály a spotřeba</h2>${variant.materials.length ? `<table class="print-table"><thead><tr><th>Položka</th><th>Výpočet</th><th>Množství</th><th>Jedn. cena</th><th>Celkem</th><th>Poznámka</th></tr></thead><tbody>${variant.materials.map((item)=>{const qty=materialQuantity(item,metrics);return `<tr><td><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.manufacturer||item.category||'')}</td><td>${calculationLabel(item.calculation)}${item.calculation!=='manual'?`<br>rezerva ${parseNum(item.wastePercent)} %`:''}</td><td>${planNumber(qty)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td><strong>${money(materialTotal(item,metrics))}</strong></td><td>${escapeHtml(item.note||item.url||'—')}</td></tr>`;}).join('')}</tbody><tfoot><tr><th colspan="4">Materiály celkem</th><th>${money(summary.materials)}</th><th></th></tr></tfoot></table>` : '<p>Nejsou evidovány žádné položky.</p>'}</section>` : ''}
      ${state.pdfOptions.budget ? `<section class="print-section"><h2>Orientační rozpočet</h2><table class="print-table"><thead><tr><th>Práce / služba</th><th>Kategorie</th><th>Množství</th><th>Jedn. cena</th><th>Celkem</th></tr></thead><tbody>${variant.costs.lines.map((item)=>`<tr><td><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.note||'')}</td><td>${escapeHtml(item.category)}</td><td>${planNumber(item.quantity)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td>${money(parseNum(item.quantity)*parseNum(item.unitPrice))}</td></tr>`).join('')}</tbody></table><div class="print-budget-summary"><span>Materiály <strong>${money(summary.materials)}</strong></span><span>Práce a služby <strong>${money(summary.services)}</strong></span><span>Rezerva ${variant.costs.contingencyPercent} % <strong>${money(summary.contingency)}</strong></span>${variant.costs.vatPercent?`<span>DPH ${variant.costs.vatPercent} % <strong>${money(summary.vat)}</strong></span>`:''}<span class="total">Celkem <strong>${money(summary.total)}</strong></span></div><p class="print-note">Rozpočet je orientační a musí být porovnán s konkrétní nabídkou dodavatele.</p></section>` : ''}
      ${state.pdfOptions.comparison && (comparisonBefore||comparisonAfter) ? `<section class="print-section"><h2>Porovnání před / po</h2><div class="print-comparison"><div><h3>${escapeHtml(variant.comparison.beforeLabel)}</h3>${comparisonBefore?`<img src="${comparisonBefore}" alt="Před">`:'<p>Obrázek není vložen.</p>'}</div><div><h3>${escapeHtml(variant.comparison.afterLabel)}</h3>${comparisonAfter?`<img src="${comparisonAfter}" alt="Po">`:'<p>Obrázek není vložen.</p>'}</div></div>${variant.comparison.notes?`<p>${escapeHtml(variant.comparison.notes)}</p>`:''}</section>` : ''}
      ${state.pdfOptions.audit ? (()=>{const report=buildAuditReport(variant);return `<section class="print-section"><h2>Kontrola projektu</h2><p><strong>Technické skóre: ${report.technicalScore}/100</strong> · ${auditBadge(report.technicalScore)}<br><strong>Po přijetí rizik: ${report.acceptedScore}/100</strong></p>${report.open.length?report.open.map((item)=>`<div class="print-note"><strong>${AUDIT_SEVERITY[item.severity].label}: ${escapeHtml(item.title)}</strong><br>${escapeHtml(item.detail)}</div>`).join(''):'<p>Automatická kontrola nenalezla otevřené problémy.</p>'}<p class="print-note">Automatická kontrola nenahrazuje posouzení odborníka.</p></section>`;})() : ''}
      ${state.pdfOptions.rfq && variant.rfq.scope ? `<section class="print-section"><h2>Zadání pro dodavatele</h2><p>${escapeHtml(variant.rfq.scope).replace(/\n/g,'<br>')}</p><h3>Výjimky z rozsahu</h3><p>${escapeHtml(variant.rfq.exclusions||'Nejsou uvedeny.').replace(/\n/g,'<br>')}</p><h3>Otázky k nabídce</h3>${renderAnalysisList((variant.rfq.questions||'').split(/\n+/).filter(Boolean),'Bez zvláštních otázek.')}</section>` : ''}
      ${state.pdfOptions.diary && variant.diary.entries.length ? `<section class="print-section"><h2>Stavební deník a technický pas</h2><table class="print-table"><thead><tr><th>Datum</th><th>Záznam</th><th>Dodavatel</th><th>Stav</th><th>Skutečný náklad</th></tr></thead><tbody>${[...variant.diary.entries].sort((a,b)=>String(a.date).localeCompare(String(b.date))).map((entry)=>`<tr><td>${escapeHtml(entry.date||'')}</td><td><strong>${escapeHtml(entry.title)}</strong><br>${escapeHtml(entry.note||'')}</td><td>${escapeHtml(entry.contractor||'')}</td><td>${escapeHtml(entry.status||'')}</td><td>${money(entry.actualCost)}</td></tr>`).join('')}</tbody></table>${variant.diary.passport.length?`<h3>Skryté prvky</h3><table class="print-table"><tbody>${variant.diary.passport.map((item)=>`<tr><th>${escapeHtml(item.name)}</th><td>${escapeHtml(item.location||'')} ${escapeHtml(item.depth||'')}<br>${escapeHtml(item.description||'')}</td></tr>`).join('')}</tbody></table>`:''}</section>` : ''}
      ${state.pdfOptions.notes ? `<section class="print-section"><h2>Poznámky, nejasnosti a body k ověření</h2><div class="print-note">${escapeHtml(variant.notes || 'Bez pracovních poznámek.').replace(/\n/g,'<br>')}</div><h2>Technické upozornění</h2><p>Veškeré rozměry, skladby konstrukcí, napojení instalací, únosnost, hydroizolace, elektroinstalace, spotřeby a cenové údaje musí před realizací ověřit příslušný odborník nebo dodavatel na místě.</p></section>` : ''}
    `;
    const html = printArea.innerHTML;
    if (options.skipPrint) return html;
    printArea.setAttribute('aria-hidden','false');
    document.body.classList.add('printing');
    setTimeout(() => window.print(), 300);
    return html;
  }

  async function photoReportImage(photo) {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        drawPhotoCanvas(canvas, image, photo);
        resolve(canvas.toDataURL('image/jpeg', 0.92));
      };
      image.onerror = () => resolve('');
      image.src = photo.dataUrl;
    });
  }


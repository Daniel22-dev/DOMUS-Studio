/* Initialization, dashboard, workspace and shared calculations. Source fragment; assembled by scripts/build.mjs. */
  async function init() {
    try {
      premiumBootstrap();
      state.projects = (await DomusDB.getAll()).map((project, index) => ensureProjectV6(DomusCore.secureProject(project, index)));
      state.projects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      if (!state.projects.length) {
        const pilot = seedProject();
        state.projects = [pilot];
        await DomusDB.put(pilot, { skipSnapshot: true });
      } else {
        for (const project of state.projects) await DomusDB.put(project, { skipSnapshot: true });
      }
      const todayKey = new Date().toISOString().slice(0, 10);
      if (safeStorageGet('domusLastDailySnapshot') !== todayKey) {
        try { await DomusDB.createSnapshot(state.projects, 'Automatický denní bod obnovy'); safeStorageSet('domusLastDailySnapshot', todayKey); }
        catch (snapshotError) { console.warn('Automatický bod obnovy:', snapshotError); }
      }
      bindGlobalEvents();
      DomusDiagnostics.mount({
        getProjects: () => state.projects,
        getCurrentProject: currentProject,
        getState: () => state,
        normalizeProject: (project) => ensureProjectV6(DomusCore.secureProject(project)),
        computeMetrics: computeProjectMetrics,
        budgetTotal: (variant) => budgetSummary(variant).total,
        toast,
      });
      setSaveState('ready');
      render();
    } catch (error) {
      console.error(error);
      app.innerHTML = `<div class="dashboard"><div class="empty-state"><strong>Nepodařilo se otevřít lokální úložiště</strong><p>${escapeHtml(error.message || 'Neznámá chyba')}</p></div></div>`;
    }
  }

  function render() {
    if (state.currentTab !== 'model' && state.threeRuntime) disposeThreeRuntime();
    const project = currentProject();
    projectCrumb.innerHTML = project ? `<strong>${escapeHtml(project.name)}</strong> &nbsp;/&nbsp; ${escapeHtml(currentVariant(project)?.name || '')}` : 'Lokální projektové centrum';
    document.getElementById('exportBtn').disabled = !state.projects.length;
    app.innerHTML = project ? renderWorkspace(project) : renderDashboard();
    bindRenderedEvents();
    if(project) scheduleProjectPerformance(project);
    queueMicrotask(setupActiveView);
  }

  function renderDashboard() {
    const filtered = state.projects.filter((project) => {
      const haystack = `${project.name} ${project.category} ${project.location} ${project.status}`.toLowerCase();
      return haystack.includes(state.search.toLowerCase());
    });
    const totalVariants = state.projects.reduce((sum, project) => sum + project.variants.length, 0);
    const activeCount = state.projects.filter((project) => !['Dokončeno'].includes(project.status)).length;
    return `
      <section class="dashboard app-shell">
        <div class="dashboard-hero">
          <div>
            <p class="eyebrow">DOMUS Studio Premium</p>
            <h1>Od reálného stavu k přesnému záměru.</h1>
            <p class="lead">Od zaměření přes Precision 2D a RealSpace 3D až po profesionální report, poptávku, realizaci a technický pas.</p>
          </div>
          <div class="hero-stats">
            <div class="stat"><strong>${state.projects.length}</strong><span>projektů</span></div>
            <div class="stat"><strong>${activeCount}</strong><span>aktivních</span></div>
            <div class="stat"><strong>${totalVariants}</strong><span>variant</span></div>
          </div>
        </div>
        <div class="toolbar-row">
          <div class="search-wrap"><input id="projectSearch" value="${escapeHtml(state.search)}" placeholder="Hledat projekt, kategorii nebo umístění…" /></div>
          <div class="toolbar-actions"><button class="btn btn-ghost" data-action="open-onboarding">Průvodce</button><button class="btn btn-secondary" data-action="sync-import-projects">Načíst projekty z notebooku</button><button class="btn btn-primary" data-action="new-project">+ Založit nový projekt</button></div>
        </div>
        <div class="project-grid">
          ${filtered.length ? filtered.map(renderProjectCard).join('') : `
            <div class="empty-state">
              <strong>Žádný projekt neodpovídá hledání</strong>
              <p>Změňte hledaný výraz nebo založte nový projekt.</p>
            </div>`}
        </div>
      </section>`;
  }

  function renderProjectCard(project) {
    const variant = currentVariant(project);
    const cover = variant?.photo?.dataUrl;
    return `
      <article class="project-card">
        <div class="project-cover">
          ${cover ? `<img src="${cover}" alt="" />` : `<div class="project-cover-placeholder">D</div>`}
          <span class="status-pill">${escapeHtml(project.status)}</span>
        </div>
        <div class="card-actions">
          <button data-action="delete-project" data-id="${project.id}" title="Odstranit projekt">×</button>
        </div>
        <div class="card-body">
          <p class="eyebrow">${escapeHtml(project.category)}</p>
          <h3>${escapeHtml(project.name)}</h3>
          <p>${escapeHtml(project.summary || 'Bez popisu projektu.')}</p>
          <div class="card-meta"><span>${escapeHtml(project.location || 'Umístění neuvedeno')}</span><span>${project.variants.length} var.</span></div>
        </div>
        <button class="card-open" data-action="open-project" data-id="${project.id}" aria-label="Otevřít projekt ${escapeHtml(project.name)}"></button>
      </article>`;
  }

  function orderedPlanPolygon(plan) {
    return DomusAudit.orderedPolygon(plan);
  }

  function polygonArea(points) {
    if (!points?.length) return 0;
    let sum = 0;
    points.forEach((point, index) => {
      const next = points[(index + 1) % points.length];
      sum += point[0] * next[1] - next[0] * point[1];
    });
    return Math.abs(sum) / 2;
  }

  function planGeometryBounds(plan) {
    const points = [];
    (plan.walls || []).forEach((wall) => points.push([wall.x1, wall.y1], [wall.x2, wall.y2]));
    (plan.objects || []).forEach((object) => points.push([object.x, object.y], [object.x + object.width, object.y + object.depth]));
    return points.length ? computeBounds(points) : null;
  }

  function transformPlanGeometry(plan, ratio, centerX, centerY, targetCenterX = centerX, targetCenterY = centerY) {
    const point = (x, y) => ({ x: targetCenterX + (x - centerX) * ratio, y: targetCenterY + (y - centerY) * ratio });
    plan.walls.forEach((wall) => {
      const a = point(wall.x1, wall.y1); const b = point(wall.x2, wall.y2);
      wall.x1 = a.x; wall.y1 = a.y; wall.x2 = b.x; wall.y2 = b.y;
    });
    plan.objects.forEach((object) => {
      const p = point(object.x, object.y); object.x = p.x; object.y = p.y; object.width *= ratio; object.depth *= ratio;
    });
  }

  function rescalePlan(plan, newScale) {
    const oldScale = Math.max(1, parseNum(plan.scale, 50));
    const targetScale = clamp(parseNum(newScale, oldScale), 20, 160);
    if (Math.abs(targetScale - oldScale) < 0.001) return;
    const bounds = planGeometryBounds(plan);
    if (bounds) transformPlanGeometry(plan, targetScale / oldScale, bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2);
    plan.scale = targetScale;
  }

  function fitPlanToCanvas(plan, width = 1100, height = 700) {
    const bounds = planGeometryBounds(plan);
    if (!bounds) return;
    const physicalWidth = Math.max(0.2, bounds.width / plan.scale);
    const physicalHeight = Math.max(0.2, bounds.height / plan.scale);
    const targetScale = clamp(Math.floor(Math.min((width - 240) / physicalWidth, (height - 190) / physicalHeight) / 10) * 10, 20, 140);
    const ratio = targetScale / plan.scale;
    transformPlanGeometry(plan, ratio, bounds.minX + bounds.width / 2, bounds.minY + bounds.height / 2, width / 2, height / 2);
    plan.scale = targetScale;
  }

  function computeProjectMetrics(variant) {
    const plan = variant.plan;
    const polygon = orderedPlanPolygon(plan);
    const computedFloorArea = polygon ? polygonArea(polygon) / (plan.scale * plan.scale) : 0;
    const floorArea = parseNum(variant.metricsOverrides?.floorArea, computedFloorArea);
    const perimeter = plan.walls.reduce((sum, wall) => sum + Math.hypot(wall.x2 - wall.x1, wall.y2 - wall.y1) / plan.scale, 0);
    const grossWallArea = perimeter * plan.wallHeight;
    const openingsArea = plan.objects
      .filter((object) => object.layer === 'architecture' && ['door', 'window'].includes(object.libraryKey))
      .reduce((sum, object) => sum + (object.width / plan.scale) * (Number(object.height || 0) / 100), 0);
    const computedWallArea = Math.max(0, grossWallArea - openingsArea);
    const wallArea = parseNum(variant.metricsOverrides?.wallArea, computedWallArea);
    return {
      polygon,
      closed: Boolean(polygon),
      floorArea: round(floorArea),
      computedFloorArea: round(computedFloorArea),
      ceilingArea: round(floorArea),
      perimeter: round(perimeter),
      grossWallArea: round(grossWallArea),
      openingsArea: round(openingsArea),
      wallArea: round(wallArea),
      objectFootprint: round(plan.objects.reduce((sum, object) => sum + object.width * object.depth / (plan.scale * plan.scale), 0)),
      floorBuildUp: round((variant.assemblies?.floor || []).reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0), 0),
      wallBuildUp: round((variant.assemblies?.wall || []).reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0), 0),
      ceilingBuildUp: round((variant.assemblies?.ceiling || []).reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0), 0),
    };
  }

  function calculationLabel(value) {
    return ({ manual: 'Ručně', floor: 'Plocha podlahy', walls: 'Plocha stěn', ceiling: 'Plocha stropu', perimeter: 'Obvod' })[value] || 'Ručně';
  }

  function materialTarget(item, metrics) {
    if (item.calculation === 'floor') return metrics.floorArea;
    if (item.calculation === 'walls') return metrics.wallArea;
    if (item.calculation === 'ceiling') return metrics.ceilingArea;
    if (item.calculation === 'perimeter') return metrics.perimeter;
    return 0;
  }

  function materialQuantity(item, metrics) {
    if (!item || item.calculation === 'manual') return Math.max(0, parseNum(item?.quantity, 0));
    const target = materialTarget(item, metrics);
    const coverage = Math.max(0.0001, parseNum(item.coverage, 1));
    const raw = target * (1 + parseNum(item.wastePercent, 0) / 100) / coverage;
    return ['ks', 'balení'].includes(item.unit) ? Math.ceil(raw) : round(raw);
  }

  function materialTotal(item, metrics) {
    return materialQuantity(item, metrics) * parseNum(item.unitPrice, 0);
  }

  function budgetSummary(variant) {
    const metrics = computeProjectMetrics(variant);
    const materials = variant.materials.reduce((sum, item) => sum + materialTotal(item, metrics), 0);
    const services = variant.costs.lines.reduce((sum, item) => sum + parseNum(item.quantity, 0) * parseNum(item.unitPrice, 0), 0);
    const base = materials + services;
    const contingency = base * parseNum(variant.costs.contingencyPercent, 0) / 100;
    const subtotal = base + contingency;
    const vat = subtotal * parseNum(variant.costs.vatPercent, 0) / 100;
    return { metrics, materials, services, base, contingency, subtotal, vat, total: subtotal + vat };
  }

  function renderWorkspace(project) {
    const variant = currentVariant(project);
    const tabGroups = [
      { label: 'Projekt', tabs: [['overview', '01', 'Přehled'], ['field', '02', 'Zaměření'], ['photo', '03', 'Fotografie'], ['ai', '04', 'Analýza snímků']] },
      { label: 'Návrh', tabs: [['plan', '05', 'Precision 2D'], ['library', '06', 'Knihovna'], ['section', '07', 'Řezy a skladby'], ['model', '08', 'RealSpace 3D'], ['presentation', '09', 'Prezentace a VR'], ['comparison', '10', 'Před / po']] },
      { label: 'Příprava', tabs: [['materials', '11', 'Materiály'], ['budget', '12', 'Rozpočet'], ['audit', '13', 'Kontrola'], ['rfq', '14', 'Poptávka']] },
      { label: 'Realizace', tabs: [['diary', '15', 'Deník a pasport'], ['pdf', '16', 'Report Studio']] },
    ];
    return `
      <section class="workspace app-shell">
        <aside class="sidebar">
          <div class="project-mini">
            <p class="eyebrow">${escapeHtml(project.category)}</p>
            <h2>${escapeHtml(project.name)}</h2>
            <p>${escapeHtml(project.location || 'Umístění neuvedeno')} · ${escapeHtml(project.status)}</p>
            <span class="version-chip">DOMUS v7.0 Premium · Precision 2D + RealSpace 3D</span>
          </div>
          <nav class="nav-stack nav-stack-compact">
            ${tabGroups.map((group) => `<div class="nav-group"><small>${group.label}</small>${group.tabs.map(([id, index, label]) => `<button class="nav-btn ${state.currentTab === id ? 'active' : ''}" data-tab="${id}"><span class="nav-index">${index}</span>${label}</button>`).join('')}</div>`).join('')}
          </nav>
          <div class="sidebar-footer">
            <button class="btn btn-ghost" data-action="storage-info">Úložiště a obnova</button>
            <button class="btn btn-ghost" data-action="save-project">Uložit projekt</button>
            <button class="btn btn-ghost" data-action="back-dashboard">Zpět na projekty</button>
          </div>
        </aside>
        <div class="workspace-main">
          <header class="workspace-head">
            <div class="workspace-head-left"><h1>${escapeHtml(project.name)}</h1><p>Poslední změna ${formatDate(project.updatedAt)} · local-first data · schéma projektu v7</p></div>
            <div class="variant-controls">
              <select id="variantSelect" aria-label="Aktivní varianta">${project.variants.map((item) => `<option value="${item.id}" ${item.id === project.activeVariantId ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select>
              <button class="btn btn-secondary" data-action="new-variant">+ Varianta</button>
            </div>
          </header>
          <div class="workspace-content">${renderActiveTab(project, variant)}</div>
        </div>
      </section>`;
  }

  function renderActiveTab(project, variant) {
    if (state.currentTab === 'field') return renderFieldTab(project, variant);
    if (state.currentTab === 'ai') return renderAiTab(project, variant);
    if (state.currentTab === 'photo') return renderPhotoTab(project, variant);
    if (state.currentTab === 'plan') return renderPlanTab(project, variant);
    if (state.currentTab === 'library') return renderLibraryTab(project, variant);
    if (state.currentTab === 'section') return renderSectionTab(project, variant);
    if (state.currentTab === 'model') return renderModelTab(project, variant);
    if (state.currentTab === 'presentation') return renderPresentationTab(project, variant);
    if (state.currentTab === 'materials') return renderMaterialsTab(project, variant);
    if (state.currentTab === 'budget') return renderBudgetTab(project, variant);
    if (state.currentTab === 'comparison') return renderComparisonTab(project, variant);
    if (state.currentTab === 'audit') return renderAuditTab(project, variant);
    if (state.currentTab === 'rfq') return renderRfqTab(project, variant);
    if (state.currentTab === 'diary') return renderDiaryTab(project, variant);
    if (state.currentTab === 'pdf') return renderPdfTab(project, variant);
    return renderOverviewTab(project, variant);
  }

  function projectWorkflow(variant) {
    const summary = budgetSummary(variant);
    const report = DomusAudit.buildReport(variant, summary.metrics, summary.total);
    const measured = variant.field.sessions.flatMap((session) => session.measurements || []).some((item) => item.verified && item.source === 'measured');
    const hasPhoto = Boolean(variant.photo.dataUrl || variant.field.sessions.some((session) => session.photos?.length));
    return [
      { tab: 'field', label: 'Zaměřit skutečný stav', done: measured, detail: measured ? 'Je evidován fyzicky ověřený rozměr.' : 'Doplňte alespoň jeden fyzicky změřený a navázaný rozměr.' },
      { tab: 'photo', label: 'Doplnit fotodokumentaci', done: hasPhoto, detail: hasPhoto ? 'Projekt obsahuje fotografický podklad.' : 'Přidejte celkový pohled a kritické detaily.' },
      { tab: 'plan', label: 'Uzavřít 2D půdorys', done: summary.metrics.closed, detail: summary.metrics.closed ? 'Plocha je geometricky vypočitatelná.' : 'Propojte stěny do skutečného polygonu.' },
      { tab: 'materials', label: 'Specifikovat výrobky', done: variant.materials.length > 0, detail: variant.materials.length ? `${variant.materials.length} položek je specifikováno.` : 'Vyberte hlavní materiály a výrobky.' },
      { tab: 'budget', label: 'Sestavit orientační rozpočet', done: summary.total > 0, detail: summary.total > 0 ? `Aktuální součet je ${money(summary.total)}.` : 'Doplňte materiály, práci a rezervu.' },
      { tab: 'audit', label: 'Vyřešit kritické nálezy', done: !report.technicalOpen.some((item) => item.severity === 'critical'), detail: report.technicalOpen.some((item) => item.severity === 'critical') ? `${report.technicalOpen.filter((item) => item.severity === 'critical').length} kritických nálezů vyžaduje technickou změnu.` : 'Kontrola nemá otevřenou technickou kritickou chybu.' },
      { tab: 'rfq', label: 'Připravit poptávku', done: Boolean(variant.rfq.scope?.trim()), detail: variant.rfq.scope?.trim() ? 'Rozsah poptávky je popsán.' : 'Vymezte rozsah, výjimky a otázky pro dodavatele.' },
      { tab: 'diary', label: 'Dokumentovat realizaci', done: variant.diary.entries.length > 0, detail: variant.diary.entries.length ? `${variant.diary.entries.length} záznamů v realizačním deníku.` : 'Při zahájení prací založte první záznam.' },
    ];
  }


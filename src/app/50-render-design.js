/* Plan, section, 3D, presentation, materials and budget views. Source fragment; assembled by scripts/build.mjs. */
  // renderPlanTab is implemented by the premium fragment loaded later in the build.

  function renderAssemblyList(variant, type, label) {
    const layers = variant.assemblies[type] || [];
    const total = layers.reduce((sum, layer) => sum + parseNum(layer.thicknessMm), 0);
    return `<div class="assembly-card"><div class="assembly-head"><div><strong>${label}</strong><span>Celkem ${total} mm</span></div><button class="icon-add" data-action="add-assembly" data-type="${type}" title="Přidat vrstvu" aria-label="Přidat vrstvu">+</button></div><div class="assembly-list">${layers.map((layer) => `<div class="assembly-layer"><span class="assembly-color" style="background:${escapeHtml(layer.color)}"></span><div><strong>${escapeHtml(layer.name)}</strong><small>${escapeHtml(layer.material || '')} · ${parseNum(layer.thicknessMm)} mm</small></div><button data-action="remove-assembly" data-type="${type}" data-id="${layer.id}" title="Odstranit" aria-label="Odstranit vrstvu">×</button></div>`).join('') || '<p class="muted">Bez vrstev.</p>'}</div></div>`;
  }

  function renderSectionTab(project, variant) {
    const metrics = computeProjectMetrics(variant);
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Řezy a konstrukční skladby</h2><p>Automatický schematický řez přes půdorys a evidence vrstev podlahy, stěny a stropu.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="reset-assemblies">Obnovit výchozí skladby</button></div></div>
        <div class="section-layout">
          <div class="section-main">
            <div class="section-controls">
              <label>Název řezu<input id="sectionName" value="${escapeHtml(variant.section.name)}" /></label>
              <label>Směr řezu<select id="sectionOrientation"><option value="x" ${variant.section.orientation === 'x' ? 'selected' : ''}>Svislá čára v půdorysu</option><option value="y" ${variant.section.orientation === 'y' ? 'selected' : ''}>Vodorovná čára v půdorysu</option></select></label>
              <label>Poloha řezu <span id="sectionPositionValue">${variant.section.position} %</span><input id="sectionPosition" type="range" min="0" max="100" value="${variant.section.position}" /></label>
              <label class="check-row"><input id="sectionDimensions" type="checkbox" ${variant.section.showDimensions ? 'checked' : ''} /> Zobrazit hlavní kóty</label>
            </div>
            <div class="canvas-wrap section-canvas-wrap"><canvas id="sectionCanvas" width="1200" height="700"></canvas></div>
            <div class="info-box"><strong>Výpočet:</strong> výška stěn ${planNumber(variant.plan.wallHeight)} m · skladba podlahy ${metrics.floorBuildUp} mm · skladba stěny ${metrics.wallBuildUp} mm · strop ${metrics.ceilingBuildUp} mm.</div>
          </div>
          <aside class="assembly-panel">
            ${renderAssemblyList(variant, 'floor', 'Podlaha')}
            ${renderAssemblyList(variant, 'wall', 'Stěna')}
            ${renderAssemblyList(variant, 'ceiling', 'Strop / podhled')}
            <div class="info-box warning"><strong>Řez je schematický.</strong><br>Výšky a tloušťky vycházejí z vašich vstupů. Statické, hydroizolační a instalační detaily musí ověřit odborník.</div>
          </aside>
        </div>
      </div>`;
  }

  function planNumber(value) { return Number(value || 0).toLocaleString('cs-CZ', { maximumFractionDigits: 2 }); }

  function materialOptions(variant, selected = '') {
    return `<option value="">Bez přiřazeného materiálu</option>${variant.materials.map((item) => `<option value="${item.id}" ${selected === item.id ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}`;
  }
  // renderModelTab is implemented by the premium fragment loaded later in the build.

  function renderPresentationTab(project, variant) {
    const support = state.xrSupport || { checked: false, vr: false, ar: false, secure: window.isSecureContext };
    return `<div class="presentation-layout"><section class="panel presentation-stage"><div class="panel-head"><div><p class="eyebrow">Prezentační režim v6</p><h2>Průchod návrhem a virtuální prostor</h2><p>Pohybuj se návrhem jako v jednoduché 3D prohlídce; na telefonu lze použít orientaci zařízení.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="fullscreen-presentation">Celá obrazovka</button><button class="btn btn-primary" data-action="start-webxr" ${support.vr ? '' : 'disabled'}>Spustit ve VR</button></div></div><div class="walkthrough-wrap" id="walkthroughWrap"><canvas id="walkthroughCanvas" width="1280" height="760"></canvas><div class="walkthrough-hud"><span>WASD / šipky · tažením rozhlížení</span><strong id="walkthroughPosition">—</strong></div></div></section><aside class="panel presentation-controls"><div class="panel-body"><p class="eyebrow">Ovládání</p><div class="move-pad"><button data-walk="forward" aria-label="Pohyb vpřed">▲</button><button data-walk="left" aria-label="Pohyb vlevo">◀</button><button data-walk="back" aria-label="Pohyb vzad">▼</button><button data-walk="right" aria-label="Pohyb vpravo">▶</button></div><label>Úhel pohledu<input id="presentationFov" type="range" min="45" max="105" value="${variant.presentation.fov}" /></label><label class="check-row"><input id="presentationObjects" type="checkbox" ${variant.presentation.showObjects ? 'checked' : ''}/> zobrazit vybavení</label><label class="check-row"><input id="presentationLabels" type="checkbox" ${variant.presentation.showLabels ? 'checked' : ''}/> zobrazit názvy prvků</label><button class="btn btn-secondary" style="width:100%" data-action="reset-walkthrough">Vrátit kameru doprostřed</button><button class="btn btn-secondary" style="width:100%" data-action="toggle-gyro">${state.presentation.gyro ? 'Vypnout gyroskop' : 'Zapnout gyroskop telefonu'}</button><button class="btn btn-ghost" style="width:100%" data-action="check-xr">Ověřit VR/AR podporu</button><div class="xr-status"><strong>${support.checked ? (support.vr ? 'VR režim je dostupný' : 'VR režim není v tomto prohlížeči dostupný') : 'Podpora XR nebyla ověřena'}</strong><span>${support.secure ? 'Zabezpečený kontext: ano' : 'Zabezpečený kontext: ne – WebXR může být blokován'}</span><span>AR: ${support.ar ? 'podporováno' : 'nezjištěno / nepodporováno'}</span></div><div class="info-box"><strong>Bez headsetu:</strong><br>Režim průchodu, celá obrazovka a gyroskop fungují jako prezentační náhled. Skutečné VR se zobrazí jen na kompatibilním zařízení a prohlížeči.</div></div></aside></div>`;
  }

  function renderMaterialsTab(project, variant) {
    const metrics = computeProjectMetrics(variant);
    const total = variant.materials.reduce((sum, item) => sum + materialTotal(item, metrics), 0);
    const query = state.filters.materials.trim().toLowerCase();
    const filtered = variant.materials.filter((item) => !query || `${item.name} ${item.category} ${item.manufacturer} ${item.sku} ${item.note}`.toLowerCase().includes(query));
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Výrobky, materiály a spotřeba</h2><p>Konkrétní položky, automatický výpočet množství, prořez a cena za jednotku.</p></div><div class="panel-actions"><span class="btn btn-ghost">Materiály: ${money(total)}</span><button class="btn btn-primary" data-action="add-material">+ Přidat položku</button></div></div>
        <div class="panel-body">
          <div class="calculation-strip"><span><strong>${measure(metrics.floorArea)}</strong> podlaha</span><span><strong>${measure(metrics.wallArea)}</strong> stěny</span><span><strong>${measure(metrics.ceilingArea)}</strong> strop</span><span><strong>${measure(metrics.perimeter, 'm')}</strong> obvod</span></div>
          <div class="list-filter"><label>Hledat v materiálech<input id="materialsSearch" value="${escapeHtml(state.filters.materials)}" placeholder="název, výrobce, kategorie, kód…"></label><span id="materialsFilterCount">${filtered.length} / ${variant.materials.length}</span></div>
          <div class="material-grid" id="materialsResults" data-render-region="materials">${filtered.length ? filtered.map((item) => renderMaterialCard(item, metrics)).join('') : variant.materials.length ? '<div class="empty-mini">Žádná položka neodpovídá filtru.</div>' : `<div class="empty-state"><strong>Zatím zde nejsou žádné položky</strong><p>Přidejte konkrétní výrobek nebo materiál a určete způsob výpočtu spotřeby.</p><button class="btn btn-primary" data-action="add-material">Přidat první položku</button></div>`}</div>
        </div>
      </div>`;
  }

  function renderMaterialCard(item, metrics) {
    const dims = [item.width, item.depth, item.height].filter(Boolean).join(' × ');
    const quantity = materialQuantity(item, metrics);
    const total = materialTotal(item, metrics);
    const target = materialTarget(item, metrics);
    return `
      <article class="material-card">
        <div class="card-icon-actions"><button data-action="edit-material" data-id="${item.id}" title="Upravit" aria-label="Upravit materiál ${escapeHtml(item.name)}">✎</button><button data-action="remove-material" data-id="${item.id}" title="Odstranit" aria-label="Odstranit materiál ${escapeHtml(item.name)}">×</button></div>
        <div class="material-top"><div class="swatch" style="background:${escapeHtml(item.swatch || '#647580')}"></div><div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.manufacturer || item.category || 'Položka')}${item.sku ? ` · ${escapeHtml(item.sku)}` : ''}</p></div></div>
        <div class="material-details">
          <span>Rozměry <b>${dims ? `${escapeHtml(dims)} mm` : 'neuvedeny'}</b></span>
          <span>Výpočet <b>${calculationLabel(item.calculation)}</b></span>
          ${item.calculation !== 'manual' ? `<span>Výpočtový základ <b>${measure(target, item.calculation === 'perimeter' ? 'm' : 'm²')}</b></span><span>Vydatnost / rezerva <b>${parseNum(item.coverage)} / ${parseNum(item.wastePercent)} %</b></span>` : ''}
          <span>Množství <b>${planNumber(quantity)} ${escapeHtml(item.unit)}</b></span>
          <span>Jednotková cena <b>${money(item.unitPrice)}</b></span>
          <span class="material-total">Celkem <b>${money(total)}</b></span>
          ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ''}
        </div>
        ${item.url ? `<a class="material-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Otevřít zdrojový odkaz ↗</a>` : ''}
      </article>`;
  }

  function renderBudgetTab(project, variant) {
    const summary = budgetSummary(variant);
    const query = state.filters.budget.trim().toLowerCase();
    const materials = variant.materials.filter((item) => !query || `${item.name} ${item.category} ${item.manufacturer} ${item.sku} ${item.note}`.toLowerCase().includes(query));
    const costLines = variant.costs.lines.filter((item) => !query || `${item.name} ${item.category} ${item.unit} ${item.note}`.toLowerCase().includes(query));
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Orientační rozpočet</h2><p>Materiály se přebírají z výpočtu spotřeby. Samostatně lze evidovat práci, dopravu, pronájem a další náklady.</p></div><div class="panel-actions"><button class="btn btn-primary" data-action="add-cost">+ Přidat náklad</button></div></div>
        <div class="panel-body budget-body">
          <div class="budget-kpis"><div><span>Materiály</span><strong>${money(summary.materials)}</strong></div><div><span>Práce a služby</span><strong>${money(summary.services)}</strong></div><div><span>Rezerva</span><strong>${money(summary.contingency)}</strong></div><div class="budget-total"><span>Celkem</span><strong>${money(summary.total)}</strong></div></div>
          <div class="budget-settings"><label>Rezerva (%)<input id="contingencyPercent" type="number" min="0" max="100" step="1" value="${variant.costs.contingencyPercent}" /></label><label>DPH (%)<input id="vatPercent" type="number" min="0" max="30" step="1" value="${variant.costs.vatPercent}" /></label><div class="info-box">DPH je ve výchozím nastavení 0 %, protože u nabídek se může lišit způsob uvedení ceny. Zadejte ji pouze tehdy, když ji chcete do součtu zahrnout.</div></div>
          <div class="list-filter"><label>Hledat v rozpočtu<input id="budgetSearch" value="${escapeHtml(state.filters.budget)}" placeholder="položka, kategorie, poznámka…"></label><span id="budgetFilterCount">${materials.length + costLines.length} / ${variant.materials.length + variant.costs.lines.length}</span></div>
          <div class="budget-table-wrap" id="budgetResults" data-render-region="budget"><table class="budget-table"><thead><tr><th>Položka</th><th>Typ</th><th>Množství</th><th>Jedn. cena</th><th>Celkem</th><th></th></tr></thead><tbody>
            ${materials.map((item) => { const qty = materialQuantity(item, summary.metrics); return `<tr><td><span class="table-swatch" style="background:${escapeHtml(item.swatch)}"></span><strong>${escapeHtml(item.name)}</strong></td><td>Materiál</td><td>${planNumber(qty)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td><strong>${money(materialTotal(item, summary.metrics))}</strong></td><td><button class="table-action" data-action="edit-material" data-id="${item.id}">Upravit</button></td></tr>`; }).join('')}
            ${costLines.map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</td><td>${escapeHtml(item.category)}</td><td>${planNumber(item.quantity)} ${escapeHtml(item.unit)}</td><td>${money(item.unitPrice)}</td><td><strong>${money(parseNum(item.quantity) * parseNum(item.unitPrice))}</strong></td><td><button class="table-action" data-action="edit-cost" data-id="${item.id}">Upravit</button><button class="table-action danger" data-action="remove-cost" data-id="${item.id}">Smazat</button></td></tr>`).join('')}
            ${!materials.length && !costLines.length ? '<tr><td colspan="6"><div class="empty-mini">Žádná položka neodpovídá filtru.</div></td></tr>' : ''}
          </tbody><tfoot><tr><td colspan="4">Mezisoučet</td><td>${money(summary.base)}</td><td></td></tr><tr><td colspan="4">Rezerva ${variant.costs.contingencyPercent} %</td><td>${money(summary.contingency)}</td><td></td></tr>${variant.costs.vatPercent ? `<tr><td colspan="4">DPH ${variant.costs.vatPercent} %</td><td>${money(summary.vat)}</td><td></td></tr>` : ''}<tr class="grand-total"><td colspan="4">Orientační celek</td><td>${money(summary.total)}</td><td></td></tr></tfoot></table></div>
          <div class="info-box warning"><strong>Rozpočet je orientační.</strong><br>Nezahrnuje automaticky skryté práce, technické návaznosti, dopravu ani cenové změny. Pro objednávku jej porovnejte s konkrétní nabídkou.</div>
        </div>
      </div>`;
  }

  function renderComparisonTab(project, variant) {
    const comparison = variant.comparison;
    const before = comparison.beforeDataUrl || variant.photo.dataUrl;
    const after = comparison.afterDataUrl;
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Porovnání před / po</h2><p>Fotografie původního stavu a plánovaná vizualizace v jednom interaktivním pohledu.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="use-project-photo-before">Použít projektovou fotografii</button><button class="btn btn-secondary" data-action="generate-model-after">Vytvořit „po“ z 3D modelu</button></div></div>
        <div class="comparison-layout">
          <div class="comparison-main">
            <div class="comparison-frame" id="comparisonFrame">
              ${after ? `<div class="compare-image compare-after"><img src="${after}" alt="Navrhovaný stav" /></div>` : '<div class="compare-placeholder after"><strong>Chybí plánovaný stav</strong><span>Nahrajte vizualizaci nebo ji vytvořte z 3D modelu.</span></div>'}
              ${before ? `<div class="compare-image compare-before" id="compareBeforeLayer" style="clip-path:inset(0 ${100-comparison.slider}% 0 0)"><img src="${before}" alt="Původní stav" /></div>` : '<div class="compare-placeholder before"><strong>Chybí původní stav</strong><span>Nahrajte fotografii nebo použijte projektovou fotografii.</span></div>'}
              <div class="compare-divider" id="compareDivider" style="left:${comparison.slider}%"><span>↔</span></div>
              <span class="compare-label left">${escapeHtml(comparison.beforeLabel)}</span><span class="compare-label right">${escapeHtml(comparison.afterLabel)}</span>
            </div>
            <label class="comparison-slider">Poměr zobrazení<input id="comparisonSlider" type="range" min="0" max="100" value="${comparison.slider}" /></label>
          </div>
          <aside class="comparison-panel">
            <button class="btn btn-primary" data-action="upload-compare-before">Nahrát fotografii „před“</button><button class="btn btn-primary" data-action="upload-compare-after">Nahrát vizualizaci „po“</button><button class="btn btn-ghost" data-action="swap-comparison">Prohodit obrázky</button>
            <label>Popisek vlevo<input id="comparisonBeforeLabel" value="${escapeHtml(comparison.beforeLabel)}" /></label><label>Popisek vpravo<input id="comparisonAfterLabel" value="${escapeHtml(comparison.afterLabel)}" /></label><label>Poznámka k porovnání<textarea id="comparisonNotes" rows="6">${escapeHtml(comparison.notes || '')}</textarea></label>
            <div class="info-box"><strong>Tip:</strong> pro nejlepší porovnání použijte shodný úhel pohledu a podobný poměr stran obou obrázků.</div>
          </aside>
        </div>
      </div>`;
  }



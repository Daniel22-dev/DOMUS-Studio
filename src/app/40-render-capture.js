/* Overview, field capture, image analysis and photo editor views. Source fragment; assembled by scripts/build.mjs. */
  function renderOverviewTab(project, variant) {
    const summary = budgetSummary(variant);
    const metrics = summary.metrics;
    const workflow = projectWorkflow(variant);
    const nextStep = workflow.find((item) => !item.done) || workflow.at(-1);
    const performance = state.projectPerformance?.[project.id] || DomusPremium.complexity(project);
    const performanceLabel = ({small:'Lehký projekt',medium:'Střední projekt',large:'Velký projekt',extreme:'Velmi velký projekt'})[performance.level] || 'Projekt';
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Projektový přehled</h2><p>Záměr, automatické výpočty a stav aktuální varianty.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="edit-project">Upravit údaje</button></div></div>
        <div class="panel-body overview-grid overview-grid-v2">
          <div class="overview-card">
            <p class="eyebrow">Záměr projektu</p><h3>${escapeHtml(project.name)}</h3>
            <p class="summary-text">${escapeHtml(project.summary || 'Doplňte stručný popis zamýšleného výsledku.')}</p>
            <label>Pracovní poznámky varianty<textarea id="variantNotes" rows="10" placeholder="Co je třeba doměřit, ověřit nebo rozhodnout?">${escapeHtml(variant.notes || '')}</textarea></label>
          </div>
          <div class="overview-card">
            <p class="eyebrow">Rozměry a plochy</p><h3>${escapeHtml(variant.name)}</h3>
            <div class="kpi-grid">
              <div class="kpi"><strong>${measure(metrics.floorArea)}</strong><span>plocha podlahy</span></div>
              <div class="kpi"><strong>${measure(metrics.wallArea)}</strong><span>čistá plocha stěn</span></div>
              <div class="kpi"><strong>${measure(metrics.perimeter, 'm')}</strong><span>obvod / délka stěn</span></div>
              <div class="kpi"><strong>${metrics.closed ? 'UZAVŘENÝ' : 'NEUZAVŘENÝ'}</strong><span>stav půdorysu</span></div>
            </div>
            <div class="info-box ${metrics.closed ? 'success' : 'warning'}" style="margin-top:18px"><strong>${metrics.closed ? 'Plocha je vypočtena z uzavřeného půdorysu.' : 'Půdorys není uzavřený.'}</strong><br>${metrics.closed ? 'Výpočty spotřeby lze použít jako orientační podklad.' : 'Plochu podlahy zadejte ručně nebo propojte stěny do uzavřeného obvodu.'}</div>
          </div>
          <div class="overview-card overview-wide workflow-card">
            <div class="workflow-head"><div><p class="eyebrow">Průvodce projektem</p><h3>Další doporučený krok: ${escapeHtml(nextStep.label)}</h3><p>${escapeHtml(nextStep.detail)}</p></div><button class="btn btn-primary" data-tab-jump="${nextStep.tab}">Pokračovat</button></div>
            <div class="workflow-steps">${workflow.map((item, index) => `<button class="workflow-step ${item.done ? 'done' : item === nextStep ? 'current' : ''}" data-tab-jump="${item.tab}"><span>${item.done ? '✓' : String(index + 1).padStart(2, '0')}</span><strong>${escapeHtml(item.label)}</strong><small>${escapeHtml(item.detail)}</small></button>`).join('')}</div>
          </div>
          <div class="overview-card overview-wide">
            <div class="overview-split">
              <div><p class="eyebrow">Orientační rozpočet</p><h3>${money(summary.total)}</h3><p>Materiály ${money(summary.materials)} · práce a služby ${money(summary.services)} · rezerva ${money(summary.contingency)}.</p></div>
              <div class="mini-progress"><span style="width:${summary.total ? Math.min(100, summary.materials / summary.total * 100) : 0}%"></span></div>
              <button class="btn btn-secondary" data-tab-jump="budget">Otevřít rozpočet</button>
            </div>
            <div class="timeline">
              <div class="timeline-item"><time>Vytvořeno</time><span>${formatDate(project.createdAt)}</span></div>
              <div class="timeline-item"><time>Aktualizace</time><span>${formatDate(project.updatedAt)}</span></div>
              <div class="timeline-item"><time>Materiály</time><span>${variant.materials.length} položek</span></div>
              <div class="timeline-item"><time>Vrstvy instalací</time><span>${Object.values(variant.plan.layerVisibility).filter(Boolean).length}/${Object.keys(LAYERS).length} viditelných</span></div><div class="timeline-item"><time>Výkon</time><span>${performanceLabel} · skóre ${performance.score}</span></div>
            </div>
          </div>
        </div>
      </div>`;
  }


  function activeRoomPhoto(variant) {
    return variant.ai.photoSet.find((photo) => photo.id === variant.ai.activePhotoId) || variant.ai.photoSet[0] || null;
  }

  function confidenceLabel(value) {
    const percent = Math.round(clamp(parseNum(value, 0), 0, 1) * 100);
    return `${percent} %`;
  }

  function renderAnalysisList(items, emptyText) {
    if (!Array.isArray(items) || !items.length) return `<p class="muted">${escapeHtml(emptyText)}</p>`;
    return `<ul class="ai-result-list">${items.map((item) => `<li>${escapeHtml(typeof item === 'string' ? item : item.name || item.label || item.notes || JSON.stringify(item))}</li>`).join('')}</ul>`;
  }

  function renderDetectedElements(analysis) {
    const elements = analysis?.elements || [];
    if (!elements.length) return '<div class="empty-mini">Zatím nebyly identifikovány žádné prvky.</div>';
    return elements.map((item, index) => {
      const confidence = item.confidence == null ? '' : `<span class="confidence-chip">${confidenceLabel(item.confidence)}</span>`;
      return `<article class="detected-card"><div><span class="layer-dot" style="background:${LAYERS[item.layer]?.color || '#8ea0aa'}"></span><strong>${escapeHtml(item.name || 'Neurčený prvek')}</strong>${confidence}</div><p>${escapeHtml(item.notes || item.reason || 'Bez doplňujícího popisu.')}</p><button class="btn btn-ghost btn-small" data-action="add-detected-element" data-index="${index}">Vložit do 2D výkresu</button></article>`;
    }).join('');
  }

  function renderVariantIdeas(variant) {
    const ideas = variant.ai.variantIdeas || [];
    if (!ideas.length) return '<div class="empty-mini">Vygenerujte tři návrhové směry. Nejdříve vzniknou jako návrhy, nikoli jako automaticky přepsaný projekt.</div>';
    return ideas.map((idea, index) => `<article class="idea-card"><div class="idea-card-top"><span>${String(index + 1).padStart(2, '0')}</span><div><strong>${escapeHtml(idea.name)}</strong><small>${escapeHtml(idea.style || '')}</small></div></div><p>${escapeHtml(idea.description || '')}</p><ul>${(idea.changes || []).slice(0, 4).map((change) => `<li>${escapeHtml(change)}</li>`).join('')}</ul><div class="idea-budget">Rozpočtový koeficient <strong>${planNumber(idea.budgetFactor || 1)}×</strong></div><button class="btn btn-secondary" data-action="create-idea-variant" data-index="${index}">Vytvořit projektovou variantu</button></article>`).join('');
  }

  function currentFieldSession(variant = currentVariant()) {
    const field = variant?.field;
    return field?.sessions?.find((item) => item.id === field.activeSessionId) || field?.sessions?.[0] || null;
  }

  function formatDateTime(value) {
    if (!value) return '—';
    return new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
  }

  function renderFieldPhoto(photo) {
    return `<article class="field-photo-card"><img src="${photo.dataUrl}" alt="${escapeHtml(photo.name || 'Terénní fotografie')}" /><div><input value="${escapeHtml(photo.name || '')}" data-field-photo-name="${photo.id}" aria-label="Název fotografie" /><textarea rows="2" data-field-photo-note="${photo.id}" aria-label="Poznámka k fotografii ${escapeHtml(photo.name || '')}" placeholder="Poznámka k fotografii">${escapeHtml(photo.note || '')}</textarea><small>${formatDateTime(photo.capturedAt)}</small><button class="table-action danger" data-action="remove-field-photo" data-id="${photo.id}">Odstranit</button></div></article>`;
  }

  function renderFieldTab(project, variant) {
    const field = variant.field;
    const session = currentFieldSession(variant);
    const sync = state.syncStatus;
    const mobileUrl = sync.serverUrl ? `${sync.serverUrl.replace(/\/$/, '')}/?mobile=1` : '';
    const targetOptions = [
      ...variant.plan.walls.map((wall, index) => ({ id: wall.id, label: `Stěna ${index + 1}` })),
      ...variant.plan.objects.map((object) => ({ id: object.id, label: object.type || object.libraryKey || 'Prvek' })),
    ];
    const targetSelect = (selected = '') => `<option value="">Bez vazby</option>${targetOptions.map((target) => `<option value="${escapeHtml(target.id)}" ${target.id === selected ? 'selected' : ''}>${escapeHtml(target.label)}</option>`).join('')}`;
    return `<div class="field-workspace">
      <section class="panel field-main-panel">
        <div class="panel-head"><div><p class="eyebrow">Terénní režim v6</p><h2>Mobilní zaměření a fotodokumentace</h2><p>Na telefonu lze zapisovat rozměry, fotografovat, ukládat polohu a importovat prostorové skeny.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="new-field-session">+ Nové zaměření</button><button class="btn btn-ghost" data-action="capture-field-photo">Vyfotit / nahrát</button></div></div>
        <div class="field-session-bar"><label>Aktivní zaměření<select id="fieldSessionSelect">${field.sessions.map((item) => `<option value="${item.id}" ${item.id === field.activeSessionId ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('')}</select></label><label>Stav<select id="fieldSessionStatus"><option ${session.status === 'Rozpracováno' ? 'selected' : ''}>Rozpracováno</option><option ${session.status === 'Připraveno k přenosu' ? 'selected' : ''}>Připraveno k přenosu</option><option ${session.status === 'Ověřeno' ? 'selected' : ''}>Ověřeno</option></select></label><button class="btn btn-ghost danger-soft" data-action="delete-field-session">Odstranit zaměření</button></div>
        <div class="field-grid">
          <article class="overview-card field-entry-card"><p class="eyebrow">Rychlý zápis rozměru</p><div class="field-measure-form"><input id="fieldMeasureLabel" aria-label="Název měřeného údaje" placeholder="Např. šířka niky" /><input id="fieldMeasureValue" aria-label="Naměřená hodnota" inputmode="decimal" placeholder="1200" /><select id="fieldMeasureUnit" aria-label="Jednotka měření"><option>mm</option><option>cm</option><option>m</option><option>m²</option><option>ks</option></select><select id="fieldMeasureCategory" aria-label="Kategorie měření"><option>Rozměr</option><option>Výška</option><option>Vzdálenost</option><option>Průměr</option><option>Plocha</option><option>Technická poznámka</option></select><select id="fieldMeasureTarget" aria-label="Navázat na prvek">${targetSelect()}</select><button class="btn btn-primary" data-action="add-field-measurement">Uložit</button></div><div class="preset-row">${['šířka prostoru','výška prostoru','vzdálenost od rohu','výška vývodu','průměr potrubí','rozměr otvoru'].map((item) => `<button data-measure-preset="${item}">${item}</button>`).join('')}</div></article>
          <article class="overview-card field-entry-card"><p class="eyebrow">Místo a poznámky</p><div class="field-location">${session.location ? `<strong>${session.location.latitude.toFixed(5)}, ${session.location.longitude.toFixed(5)}</strong><span>Přesnost přibližně ${Math.round(session.location.accuracy || 0)} m</span>` : '<span>Poloha není uložena. U interiéru obvykle není nutná.</span>'}<button class="btn btn-secondary" data-action="save-field-location">Uložit aktuální polohu</button></div><textarea id="fieldSessionNotes" aria-label="Pracovní poznámky k zaměření" rows="5" placeholder="Co ještě doměřit, odkud byla fotografie pořízena, přístupová omezení…">${escapeHtml(session.notes || '')}</textarea></article>
        </div>
        <div class="subsection-head"><div><h3>Naměřené údaje</h3><p>${session.measurements.length} položek · hodnoty označ jako ověřené až po kontrole.</p></div></div>
        <div class="table-wrap"><table><thead><tr><th>Údaj</th><th>Kategorie</th><th>Hodnota</th><th>Vazba</th><th>Zdroj a jistota</th><th>Ověřeno</th><th></th></tr></thead><tbody>${session.measurements.length ? session.measurements.map((item) => `<tr><td><strong>${escapeHtml(item.label)}</strong>${item.note ? `<small>${escapeHtml(item.note)}</small>` : ''}</td><td>${escapeHtml(item.category)}</td><td><strong>${escapeHtml(String(item.value))} ${escapeHtml(item.unit)}</strong></td><td><select class="compact-select" data-field-measure-target="${item.id}" aria-label="Vazba měření ${escapeHtml(item.label)} na prvek">${targetSelect(item.targetId || '')}</select></td><td><select class="compact-select confidence-${escapeHtml(item.source || 'estimate')}" data-field-measure-source="${item.id}" aria-label="Zdroj a jistota měření ${escapeHtml(item.label)}"><option value="measured" ${(item.source||'')==='measured'?'selected':''}>Fyzicky změřeno</option><option value="derived" ${(item.source||'')==='derived'?'selected':''}>Odvozeno</option><option value="estimate" ${(item.source||'estimate')==='estimate'?'selected':''}>Odhad</option><option value="ai" ${(item.source||'')==='ai'?'selected':''}>AI návrh</option></select><small>${Math.round(parseNum(item.confidence, item.verified ? 100 : 40))} %</small></td><td><label class="mini-check"><input type="checkbox" data-field-measure-verified="${item.id}" aria-label="Měření ${escapeHtml(item.label)} je ověřeno" ${item.verified ? 'checked' : ''}/> ano</label></td><td><button class="table-action danger" data-action="remove-field-measurement" data-id="${item.id}">Smazat</button></td></tr>`).join('') : '<tr><td colspan="7"><div class="empty-mini">Zatím nebyl zapsán žádný rozměr.</div></td></tr>'}</tbody></table></div>
        <div class="subsection-head"><div><h3>Fotografie z terénu</h3><p>Na mobilu se otevře fotoaparát. Snímky se zmenší a uloží přímo do projektu.</p></div><button class="btn btn-secondary" data-action="capture-field-photo">+ Přidat fotografie</button></div>
        <div class="field-photo-grid">${session.photos.length ? session.photos.map(renderFieldPhoto).join('') : '<div class="empty-mini">Žádná terénní fotografie.</div>'}</div>
        <div class="subsection-head"><div><h3>LiDAR a prostorové skeny</h3><p>Import metadat USDZ/OBJ/GLB/PLY nebo datového JSON. U RoomPlan JSON lze vytvořit pracovní obrys stěn.</p></div><button class="btn btn-secondary" data-action="import-lidar">Importovat sken</button></div>
        <div class="scan-list">${session.scans.length ? session.scans.map((scan) => `<article class="scan-card"><div><strong>${escapeHtml(scan.name)}</strong><span>${escapeHtml(scan.format.toUpperCase())} · ${(scan.size / 1024 / 1024).toFixed(2)} MB · ${formatDateTime(scan.importedAt)}</span><p>${escapeHtml(scan.summary || 'Soubor je evidován jako externí podklad.')}</p></div><div>${scan.roomPlan?.walls?.length ? `<button class="btn btn-secondary btn-small" data-action="apply-roomplan" data-id="${scan.id}">Převést stěny do 2D</button>` : ''}<button class="table-action danger" data-action="remove-scan" data-id="${scan.id}">Odstranit</button></div></article>`).join('') : '<div class="empty-mini">Nebyl přidán žádný prostorový sken.</div>'}</div>
        <div class="info-box warning"><strong>LiDAR není automaticky stavební zaměření.</strong><br>Importované geometrie jsou pracovní podklad. Rozměry a polohu konstrukcí před realizací fyzicky ověř.</div>
      </section>
      <aside class="panel sync-panel"><div class="panel-head"><div><p class="eyebrow">Notebook ↔ telefon</p><h2>Lokální synchronizace</h2></div></div><div class="panel-body">
        <div class="sync-state ${sync.enabled ? 'ready' : 'offline'}"><span></span><strong>${sync.enabled ? 'Mobilní přístup je aktivní' : 'Mobilní přístup není povolen'}</strong><p>${escapeHtml(sync.message || '')}</p></div>
        ${sync.enabled ? (sync.localClient ? `<div class="pair-code"><small>Jednorázový párovací kód pro telefon</small><strong>${escapeHtml(sync.pairingCode || '------')}</strong><span>Platnost do ${formatDateTime(sync.pairingExpiresAt)}</span></div><label>Adresa pro telefon<div class="copy-field"><input readonly aria-label="Adresa pro otevření v telefonu" value="${escapeHtml(mobileUrl)}" /><button class="btn btn-ghost" data-action="copy-mobile-url">Kopírovat</button></div></label><ol class="sync-steps"><li>Telefon i notebook připoj ke stejné důvěryhodné Wi-Fi.</li><li>Adresu otevři v telefonu.</li><li>Zadej jednorázový kód. Aplikace uloží dlouhý token, nikoliv párovací kód.</li></ol>${sync.devices?.length ? `<div class="paired-devices"><strong>Spárovaná zařízení</strong>${sync.devices.map((device)=>`<div><span>${escapeHtml(device.name||'Zařízení')}<small>naposledy ${formatDateTime(device.lastSeenAt)} · platnost do ${formatDateTime(device.expiresAt)}</small></span><button class="table-action danger" data-action="revoke-sync-device" data-id="${escapeHtml(device.id)}">Zrušit</button></div>`).join('')}</div>` : `<div class="info-box">Zatím není spárováno žádné mobilní zařízení.</div>`}` : (sync.paired ? `<div class="info-box success"><strong>Telefon je bezpečně spárován.</strong><br>Přístupový token je uložen pouze v tomto prohlížeči a lze jej kdykoliv zrušit na notebooku.</div>` : `<label>Jednorázový kód z notebooku<div class="copy-field"><input id="syncPairCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" value="" placeholder="000000" /><button class="btn btn-primary" data-action="pair-sync-device">Spárovat</button></div></label><div class="info-box"><strong>Mobilní zařízení:</strong><br>Kód platí pouze deset minut a po úspěšném spárování se automaticky znehodnotí.</div>`)) : '<div class="info-box"><strong>První aktivace:</strong><br>V kořenové složce spusť jako správce soubor <b>Povolit-mobilni-pristup.bat</b> a poté DOMUS Studio restartuj.</div>'}
        ${sync.enabled ? '<div class="info-box warning"><strong>Síťový přenos není šifrován jako HTTPS.</strong><br>Používej pouze vlastní důvěryhodnou Wi-Fi. Mobilní přístup nezapínej na veřejné, hotelové, školní ani cizí síti.</div>' : ''}
        <button class="btn btn-secondary" style="width:100%" data-action="refresh-sync-status">Ověřit stav</button><button class="btn btn-primary" style="width:100%" data-action="sync-push" ${sync.enabled && (sync.localClient || sync.paired) ? '' : 'disabled'}>Odeslat aktuální projekt</button><button class="btn btn-secondary" style="width:100%" data-action="sync-pull" ${sync.enabled && (sync.localClient || sync.paired) ? '' : 'disabled'}>Načíst poslední verzi projektu</button>
        <label class="check-row"><input id="autoSyncToggle" type="checkbox" ${field.sync.autoSync ? 'checked' : ''} ${sync.enabled ? '' : 'disabled'}/> Automaticky odeslat po uložení</label><div class="sync-times"><span>Odesláno: ${formatDateTime(field.sync.lastPushAt)}</span><span>Načteno: ${formatDateTime(field.sync.lastPullAt)}</span></div>
      </div></aside>
    </div>`;
  }

  function renderAiTab(project, variant) {
    return renderAiStudioTab(project, variant);
  }

  function renderPhotoTab(project, variant) {
    const calibrated = Boolean(variant.photo.calibration);
    return `
      <div class="panel">
        <div class="panel-head"><div><h2>Fotografie skutečného stavu</h2><p>Nahrajte fotografii, určete měřítko a zakreslete kóty nebo poznámky.</p></div><div class="panel-actions"><button class="btn btn-secondary" data-action="upload-photo">${variant.photo.dataUrl ? 'Nahradit fotografii' : 'Nahrát fotografii'}</button><button class="btn btn-ghost" data-action="undo-photo">Zpět</button><button class="btn btn-ghost btn-danger" data-action="clear-photo">Vymazat značky</button></div></div>
        <div class="editor-layout">
          <div class="editor-tools"><div class="tool-group"><div class="tool-title">Nástroje</div><button class="tool-btn ${state.photoTool === 'measure' ? 'active' : ''}" data-photo-tool="measure">Kóta / vzdálenost</button><button class="tool-btn ${state.photoTool === 'calibrate' ? 'active' : ''}" data-photo-tool="calibrate">Kalibrace měřítka</button><button class="tool-btn ${state.photoTool === 'note' ? 'active' : ''}" data-photo-tool="note">Textová poznámka</button></div><div class="tool-group"><div class="tool-title">Stav</div><div class="info-box ${calibrated ? 'success' : 'warning'}">${calibrated ? `<strong>Měřítko nastaveno.</strong><br>${Math.round(variant.photo.calibration.mm)} mm odpovídá ${Math.round(variant.photo.calibration.pixels)} px.` : '<strong>Měřítko není nastaveno.</strong><br>Nejdříve označte známou vzdálenost.'}</div></div></div>
          <div class="editor-stage"><div class="canvas-wrap" id="photoCanvasWrap">${variant.photo.dataUrl ? '<canvas id="photoCanvas"></canvas>' : `<div class="empty-canvas"><strong>Začněte fotografií skutečného stavu</strong><p>Ideální je co nejrovnější záběr bez výrazné perspektivy.</p><button class="btn btn-primary" data-action="upload-photo">Nahrát fotografii</button></div>`}</div></div>
          <div class="editor-properties"><div class="tool-title">Jak postupovat</div><div class="property-list"><div class="info-box"><strong>1. Fotografie</strong><br>Vyfoťte prostor pokud možno kolmo.</div><div class="info-box"><strong>2. Kalibrace</strong><br>Táhněte přes známý rozměr a zadejte hodnotu v milimetrech.</div><div class="info-box"><strong>3. Kóty</strong><br>Další čáry se dopočítají podle kalibrace.</div><div class="info-box warning"><strong>Upozornění:</strong> měření z jediné fotografie je orientační.</div></div></div>
        </div>
      </div>`;
  }


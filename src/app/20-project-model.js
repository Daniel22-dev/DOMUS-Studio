/* Project factories, migration and persistence orchestration. Source fragment; assembled by scripts/build.mjs. */
  const LEGACY_ALIAS_OWNER = Symbol('domusLegacyAliasOwner');
  function defaultLayerVisibility() {
    return Object.fromEntries(Object.keys(LAYERS).map((key) => [key, true]));
  }

  function blankFieldSession(name = 'První zaměření') {
    const now = new Date().toISOString();
    return {
      id: uid('field'), name, status: 'Rozpracováno', createdAt: now, updatedAt: now,
      notes: '', device: navigator.userAgent.includes('Mobile') ? 'Telefon' : 'Notebook',
      location: null, measurements: [], photos: [], scans: [],
    };
  }

  function blankVariant(name = 'Varianta A · základní návrh') {
    const fieldSession = blankFieldSession();
    return {
      id: uid('variant'),
      name,
      createdAt: new Date().toISOString(),
      photo: { dataUrl: null, annotations: [], calibration: null },
      plan: { scale: 50, wallHeight: 2.6, wallThickness: 0.15, walls: [], objects: [], layerVisibility: defaultLayerVisibility(), layerLocks: {}, showDimensions: true },
      materials: [],
      costs: { lines: [], contingencyPercent: 10, vatPercent: 0 },
      section: { name: 'Řez A–A', orientation: 'x', position: 50, showDimensions: true },
      assemblies: deepClone(DEFAULT_ASSEMBLIES),
      comparison: { beforeDataUrl: null, afterDataUrl: null, slider: 50, beforeLabel: 'Původní stav', afterLabel: 'Navrhovaný stav', notes: '' },
      appearance: { wallMaterialId: '', floorMaterialId: '', ceilingMaterialId: '' },
      metricsOverrides: { floorArea: '', wallArea: '' },
      field: { sessions: [fieldSession], activeSessionId: fieldSession.id, sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } },
      presentation: { cameraX: null, cameraY: null, yaw: 0, pitch: 0, fov: 72, showObjects: true, showLabels: true },
      ai: {
        photoSet: [], activePhotoId: '',
        analysis: null, localAnalysis: null,
        proposedPlan: { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: 2.6 },
        variantIdeas: [], lastSource: '', lastRunAt: '',
        visualizer: { sourcePhotoId: '', brief: '', preserve: '', remove: '', add: '', style: 'balanced', quality: 'medium', size: 'auto', count: 2, lockedElements: [], generations: [], activeGenerationId: '', compareSlider: 50, lastPrompt: '', lastRunAt: '' },
        assistant: { messages: [], pendingProposal: null, lastResponseId: '', lastRunAt: '' },
      },
      audit: { overrides: {}, manualChecks: [], lastRunAt: '' },
      rfq: { mode: 'technical', title: '', recipient: '', contact: '', deadline: '', scope: '', exclusions: '', questions: '', responseInstructions: '', includePhotos: true, includePrices: false, anonymizeLocation: true, removeGps: true, revision: 0, lastExportAt: '', lastExportHash: '', exportedVariantId: '', projectUpdatedAt: '' },
      diary: { entries: [], warranties: [], passport: [] },
      notes: '',
    };
  }

  function createProject(data) {
    const variant = blankVariant();
    const project = ensureProjectV7({
      id: uid('project'),
      schemaVersion: 7,
      name: data.name,
      category: data.category || 'Ostatní',
      status: data.status || 'Nápad',
      location: data.location || '',
      summary: data.summary || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activeVariantId: variant.id,
      variants: [variant],
      survey: { photo: variant.photo, field: variant.field },
      lifecycle: variant.diary,
      reportRevision: 1, reportRevisionLabel: 'R1', templateId: data.template || 'blank',
    });
    return applyProjectTemplate(project, data.template || 'blank');
  }

  function inferLayer(type = '') {
    const value = String(type).toLowerCase();
    if (/voda|umyvad|ventil/.test(value)) return 'water';
    if (/odpad|vpusť|kanal|šacht/.test(value)) return 'sewer';
    if (/zásuv|svět|rozvad|elektr/.test(value)) return 'electricity';
    if (/radiátor|topen|kotel/.test(value)) return 'heating';
    if (/klimat|rekuper|vzduch/.test(value)) return 'ventilation';
    if (/postřik|závlah|trávník/.test(value)) return 'garden';
    return 'architecture';
  }

  function ensureProjectV7(project) {
    project.schemaVersion = 7;
    project.reportRevision = Math.max(1, parseNum(project.reportRevision, 1));
    project.reportRevisionLabel ||= `R${project.reportRevision}`;
    project.variants = Array.isArray(project.variants) && project.variants.length ? project.variants : [blankVariant()];
    const firstVariant = project.variants[0];
    project.survey ||= {
      photo: firstVariant.photo || { dataUrl: null, annotations: [], calibration: null },
      field: firstVariant.field || { sessions: [blankFieldSession()], activeSessionId: '', sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } },
    };
    project.survey.photo ||= { dataUrl: null, annotations: [], calibration: null };
    project.survey.field ||= { sessions: [blankFieldSession()], activeSessionId: '', sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } };
    project.lifecycle ||= firstVariant.diary || { entries: [], warranties: [], passport: [] };
    project.lifecycle.entries = Array.isArray(project.lifecycle.entries) ? project.lifecycle.entries : [];
    project.lifecycle.warranties = Array.isArray(project.lifecycle.warranties) ? project.lifecycle.warranties : [];
    project.lifecycle.passport = Array.isArray(project.lifecycle.passport) ? project.lifecycle.passport : [];
    project.variants.forEach((variant) => {
      if (variant[LEGACY_ALIAS_OWNER] !== project) {
        const legacyPhoto = variant.photo; const legacyField = variant.field; const legacyDiary = variant.diary;
        if (!project.survey.photo && legacyPhoto) project.survey.photo = legacyPhoto;
        if (!project.survey.field && legacyField) project.survey.field = legacyField;
        if (!project.lifecycle && legacyDiary) project.lifecycle = legacyDiary;
        try { delete variant.photo; delete variant.field; delete variant.diary; } catch { }
        Object.defineProperty(variant, 'photo', { configurable: true, enumerable: false, get: () => project.survey.photo, set: (value) => { project.survey.photo = value; } });
        Object.defineProperty(variant, 'field', { configurable: true, enumerable: false, get: () => project.survey.field, set: (value) => { project.survey.field = value; } });
        Object.defineProperty(variant, 'diary', { configurable: true, enumerable: false, get: () => project.lifecycle, set: (value) => { project.lifecycle = value; } });
        Object.defineProperty(variant, LEGACY_ALIAS_OWNER, { configurable: true, enumerable: false, writable: true, value: project });
      }
      variant.photo ||= { dataUrl: null, annotations: [], calibration: null };
      variant.photo.annotations ||= [];
      variant.plan ||= { scale: 50, wallHeight: 2.6, wallThickness: 0.15, walls: [], objects: [] };
      variant.plan.scale = Number(variant.plan.scale || 50);
      variant.plan.wallHeight = Number(variant.plan.wallHeight || 2.6);
      variant.plan.wallThickness = Number(variant.plan.wallThickness || 0.15);
      variant.plan.walls ||= [];
      variant.plan.objects ||= [];
      variant.plan.layerVisibility = { ...defaultLayerVisibility(), ...(variant.plan.layerVisibility || {}) };
      variant.plan.layerLocks = { ...(variant.plan.layerLocks || {}) };
      variant.plan.showDimensions = variant.plan.showDimensions !== false;
      variant.plan.objects.forEach((object) => {
        object.layer ||= inferLayer(object.type);
        object.shape ||= ELEMENT_LIBRARY.find((item) => item.name === object.type)?.shape || 'box';
        object.libraryKey ||= ELEMENT_LIBRARY.find((item) => item.name === object.type)?.key || '';
        object.note ||= '';
        object.materialId ||= '';
        object.rotation = parseNum(object.rotation, 0);
        object.updatedAt ||= project.updatedAt || new Date().toISOString();
      });
      variant.materials ||= [];
      variant.materials.forEach((item, index) => {
        item.manufacturer ||= '';
        item.sku ||= '';
        item.unit ||= 'ks';
        item.quantity = parseNum(item.quantity, 1);
        item.unitPrice = parseNum(item.unitPrice, parseNum(item.price, 0));
        item.calculation ||= 'manual';
        item.coverage = parseNum(item.coverage, 1);
        item.wastePercent = parseNum(item.wastePercent, item.calculation === 'manual' ? 0 : 10);
        item.swatch ||= ['#e4e2dc','#8a7760','#6e8291','#a79a85','#9aafa5','#b18268','#6d7075'][index % 7];
        item.updatedAt ||= project.updatedAt || new Date().toISOString();
        delete item.price;
      });
      variant.costs ||= { lines: [], contingencyPercent: 10, vatPercent: 0 };
      variant.costs.lines ||= [];
      variant.costs.lines.forEach((item) => { item.updatedAt ||= project.updatedAt || new Date().toISOString(); });
      variant.costs.contingencyPercent = parseNum(variant.costs.contingencyPercent, 10);
      variant.costs.vatPercent = parseNum(variant.costs.vatPercent, 0);
      variant.section = { name: 'Řez A–A', orientation: 'x', position: 50, showDimensions: true, ...(variant.section || {}) };
      variant.assemblies ||= deepClone(DEFAULT_ASSEMBLIES);
      ['floor','wall','ceiling'].forEach((type) => { variant.assemblies[type] ||= deepClone(DEFAULT_ASSEMBLIES[type]); });
      variant.comparison = { beforeDataUrl: null, afterDataUrl: null, slider: 50, beforeLabel: 'Původní stav', afterLabel: 'Navrhovaný stav', notes: '', ...(variant.comparison || {}) };
      variant.appearance = { wallMaterialId: '', floorMaterialId: '', ceilingMaterialId: '', ...(variant.appearance || {}) };
      variant.metricsOverrides = { floorArea: '', wallArea: '', ...(variant.metricsOverrides || {}) };
      variant.ai = {
        photoSet: [], activePhotoId: '', analysis: null, localAnalysis: null,
        proposedPlan: { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: variant.plan.wallHeight || 2.6 },
        variantIdeas: [], lastSource: '', lastRunAt: '', ...(variant.ai || {})
      };
      variant.ai.visualizer = { sourcePhotoId: '', brief: '', preserve: '', remove: '', add: '', style: 'balanced', quality: 'medium', size: 'auto', count: 2, lockedElements: [], generations: [], activeGenerationId: '', compareSlider: 50, lastPrompt: '', lastRunAt: '', ...(variant.ai.visualizer || {}) };
      variant.ai.visualizer.lockedElements = Array.isArray(variant.ai.visualizer.lockedElements) ? variant.ai.visualizer.lockedElements.slice(0, 30) : [];
      variant.ai.visualizer.generations = Array.isArray(variant.ai.visualizer.generations) ? variant.ai.visualizer.generations.slice(0, 8) : [];
      variant.ai.visualizer.generations.forEach((item, index) => { item.id ||= uid('visual'); item.name ||= `Vizualizace ${index + 1}`; item.createdAt ||= new Date().toISOString(); });
      if (!variant.ai.visualizer.activeGenerationId || !variant.ai.visualizer.generations.some((item) => item.id === variant.ai.visualizer.activeGenerationId)) variant.ai.visualizer.activeGenerationId = variant.ai.visualizer.generations[0]?.id || '';
      variant.ai.visualizer.compareSlider = clamp(parseNum(variant.ai.visualizer.compareSlider, 50), 0, 100);
      variant.ai.visualizer.count = clamp(parseNum(variant.ai.visualizer.count, 2), 1, 3);
      variant.ai.assistant = { messages: [], pendingProposal: null, lastResponseId: '', lastRunAt: '', ...(variant.ai.assistant || {}) };
      variant.ai.assistant.messages = Array.isArray(variant.ai.assistant.messages) ? variant.ai.assistant.messages.slice(-40) : [];
      variant.ai.photoSet = Array.isArray(variant.ai.photoSet) ? variant.ai.photoSet : [];
      variant.ai.photoSet.forEach((photo, index) => { photo.id ||= uid('roomphoto'); photo.name ||= `Snímek ${index + 1}`; photo.view ||= 'detail'; photo.note ||= ''; });
      if (!variant.ai.activePhotoId || !variant.ai.photoSet.some((photo) => photo.id === variant.ai.activePhotoId)) variant.ai.activePhotoId = variant.ai.photoSet[0]?.id || '';
      variant.ai.proposedPlan = { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: variant.plan.wallHeight || 2.6, ...(variant.ai.proposedPlan || {}) };
      variant.field ||= { sessions: [], activeSessionId: '', sync: { autoSync: false, lastPushAt: '', lastPullAt: '' } };
      variant.field.sessions = Array.isArray(variant.field.sessions) ? variant.field.sessions : [];
      if (!variant.field.sessions.length) variant.field.sessions.push(blankFieldSession());
      variant.field.sessions.forEach((session, index) => {
        session.id ||= uid('field'); session.name ||= `Zaměření ${index + 1}`; session.status ||= 'Rozpracováno';
        session.createdAt ||= new Date().toISOString(); session.updatedAt ||= session.createdAt; session.notes ||= '';
        session.device ||= 'Neurčené zařízení'; session.location ||= null;
        session.measurements = Array.isArray(session.measurements) ? session.measurements : [];
        session.photos = Array.isArray(session.photos) ? session.photos : [];
        session.scans = Array.isArray(session.scans) ? session.scans : [];
      });
      if (!variant.field.activeSessionId || !variant.field.sessions.some((item) => item.id === variant.field.activeSessionId)) variant.field.activeSessionId = variant.field.sessions[0].id;
      variant.field.sync = { autoSync: false, lastPushAt: '', lastPullAt: '', ...(variant.field.sync || {}) };
      variant.presentation = { cameraX: null, cameraY: null, yaw: 0, pitch: 0, fov: 72, showObjects: true, showLabels: true, ...(variant.presentation || {}) };
      variant.audit = { overrides: {}, manualChecks: [], lastRunAt: '', ...(variant.audit || {}) };
      variant.audit.overrides ||= {}; variant.audit.manualChecks = Array.isArray(variant.audit.manualChecks) ? variant.audit.manualChecks : [];
      variant.rfq = { mode: 'technical', title: '', recipient: '', contact: '', deadline: '', scope: '', exclusions: '', questions: '', responseInstructions: '', includePhotos: true, includePrices: false, anonymizeLocation: true, removeGps: true, lastExportAt: '', ...(variant.rfq || {}) };
      variant.diary = { entries: [], warranties: [], passport: [], ...(variant.diary || {}) };
      variant.diary.entries = Array.isArray(variant.diary.entries) ? variant.diary.entries : [];
      variant.diary.warranties = Array.isArray(variant.diary.warranties) ? variant.diary.warranties : [];
      variant.diary.passport = Array.isArray(variant.diary.passport) ? variant.diary.passport : [];
      variant.diary.entries.forEach((entry) => { entry.photos = Array.isArray(entry.photos) ? entry.photos : []; entry.documents = Array.isArray(entry.documents) ? entry.documents : []; entry.plannedCost = parseNum(entry.plannedCost); entry.actualCost = parseNum(entry.actualCost); });
      variant.diary.warranties.forEach((item) => { item.documents = Array.isArray(item.documents) ? item.documents : []; item.warrantyMonths = parseNum(item.warrantyMonths, 24); });
      variant.field.sessions.forEach((session) => session.measurements.forEach((item) => { item.source ||= item.verified ? 'measured' : 'estimate'; item.confidence = parseNum(item.confidence, item.verified ? 100 : 40); }));
      variant.notes ||= '';
    });
    if (!project.activeVariantId || !project.variants.some((variant) => variant.id === project.activeVariantId)) project.activeVariantId = project.variants[0].id;
    return project;
  }

  function seedProject() {
    const project = createProject({
      name: 'Sprchový kout · pilotní projekt',
      category: 'Koupelna',
      status: 'Rozpracováno',
      location: 'Bravantice · přízemí',
      summary: 'Referenční projekt pro ověření fotografií, asistované analýzy, návrhu půdorysu, variant, vrstev instalací, rozpočtu, 3D materiálů a dokumentace pro dodavatele.',
    });
    const variant = project.variants[0];
    variant.plan.scale = 100;
    variant.plan.walls = [
      { id: uid('wall'), x1: 380, y1: 210, x2: 680, y2: 210 },
      { id: uid('wall'), x1: 680, y1: 210, x2: 680, y2: 450 },
      { id: uid('wall'), x1: 680, y1: 450, x2: 380, y2: 450 },
      { id: uid('wall'), x1: 380, y1: 450, x2: 380, y2: 210 },
    ];
    variant.plan.objects = [
      { id: uid('object'), type: 'Sprchová vanička', libraryKey: 'shower-tray', layer: 'architecture', shape: 'box', x: 540, y: 345, width: 120, depth: 90, height: 12, color: '#d6d6d0', note: '', materialId: '' },
      { id: uid('object'), type: 'Dveře', libraryKey: 'door', layer: 'architecture', shape: 'door', x: 372, y: 265, width: 15, depth: 90, height: 205, color: '#9b774d', note: '', materialId: '' },
      { id: uid('object'), type: 'Podlahová vpusť', libraryKey: 'floor-drain', layer: 'sewer', shape: 'circle', x: 600, y: 382, width: 15, depth: 15, height: 8, color: '#8a5aa8', note: 'Polohu přesně doměřit.', materialId: '' },
      { id: uid('object'), type: 'Vodovodní potrubí', libraryKey: 'water-pipe', layer: 'water', shape: 'line', x: 430, y: 258, width: 200, depth: 4, height: 10, color: '#55a9cf', note: '', materialId: '' },
    ];
    variant.materials.push(
      { id: uid('material'), name: 'Sprchová vanička 1200 × 900 mm', category: 'Výrobek', manufacturer: '', sku: '', url: '', width: 1200, depth: 900, height: 40, unit: 'ks', quantity: 1, unitPrice: 8500, calculation: 'manual', coverage: 1, wastePercent: 0, color: 'Bílá, matná', swatch: '#e4e2dc', note: 'Ukázková položka. Nahraďte ji konkrétním výrobkem z odkazu.' },
      { id: uid('material'), name: 'Dlažba 60 × 60 cm', category: 'Materiál', manufacturer: '', sku: '', url: '', width: 600, depth: 600, height: 10, unit: 'balení', quantity: 1, unitPrice: 799, calculation: 'floor', coverage: 1.44, wastePercent: 10, color: 'Šedá, matná', swatch: '#777b7d', note: 'Množství se dopočítává z plochy podlahy.' },
      { id: uid('material'), name: 'Obklad stěn', category: 'Materiál', manufacturer: '', sku: '', url: '', width: 600, depth: 300, height: 9, unit: 'balení', quantity: 1, unitPrice: 899, calculation: 'walls', coverage: 1.26, wastePercent: 12, color: 'Světlý kámen', swatch: '#c8b08a', note: 'Výpočet z čisté plochy stěn po odečtení otvorů.' }
    );
    variant.costs.lines = [
      { id: uid('cost'), name: 'Montáž sprchového koutu', category: 'Práce', quantity: 1, unit: 'paušál', unitPrice: 8500, note: 'Orientační položka.' },
      { id: uid('cost'), name: 'Doprava materiálu', category: 'Doprava', quantity: 1, unit: 'paušál', unitPrice: 1500, note: '' },
    ];
    variant.appearance.floorMaterialId = variant.materials[1].id;
    variant.appearance.wallMaterialId = variant.materials[2].id;
    variant.ai.proposedPlan = { shape: 'rectangle', widthMm: 3000, depthMm: 2400, wallHeightM: 2.6 };
    variant.ai.variantIdeas = buildLocalVariantIdeas(project, variant);
    variant.notes = 'Doměřit přesnou polohu odpadu a výšku napojení. Ověřit skladbu podlahy před objednávkou vaničky.';
    const field = currentFieldSession(variant);
    field.name = 'První zaměření sprchového koutu';
    field.measurements = [
      { id: uid('measure'), label: 'šířka prostoru', value: '1640', unit: 'mm', category: 'Rozměr', verified: true, source: 'measured', confidence: 100, note: '', createdAt: new Date().toISOString() },
      { id: uid('measure'), label: 'výška vývodu vody', value: '1100', unit: 'mm', category: 'Výška', verified: false, source: 'estimate', confidence: 40, note: 'Před montáží znovu ověřit.', createdAt: new Date().toISOString() },
    ];
    variant.rfq.scope = 'Dodání a montáž sprchového koutu podle přiloženého půdorysu, ověření napojení vody a odpadu a utěsnění všech kritických detailů.';
    variant.rfq.questions = 'Je navržená vanička kompatibilní se skutečnou polohou odpadu?\nJaké stavební úpravy a hydroizolační vrstvy budou nutné?\nJaká je délka záruky na montáž a těsnost?';
    variant.diary.entries.push({id:uid('diary'),date:new Date().toISOString().slice(0,10),type:'Příprava',title:'Založení realizačního deníku',contractor:'',status:'Rozpracováno',plannedCost:0,actualCost:0,note:'Před zakrytím vody, odpadu a elektroinstalace pořídit fotografie s měřítkem.',photos:[],documents:[],createdAt:new Date().toISOString()});
    return project;
  }

  function currentProject() {
    return state.projects.find((item) => item.id === state.currentProjectId) || null;
  }

  function currentVariant(project = currentProject()) {
    if (!project) return null;
    return project.variants.find((item) => item.id === project.activeVariantId) || project.variants[0];
  }

  async function checkStoragePressure(force = false) {
    const now = Date.now();
    if (!force && now - state.storageLastCheck < 5 * 60 * 1000) return;
    state.storageLastCheck = now;
    try {
      const estimate = await DomusDB.estimate();
      if (estimate.quota && estimate.usage / estimate.quota >= 0.8) toast('Úložiště je zaplněno z více než 80 %. Vytvořte zálohu a zkontrolujte koš.', 'error');
    } catch (error) { console.warn('Kontrola kapacity:', error); }
  }

  async function saveProject(project, quiet = true, skipAutoSync = false) {
    if (!project) return;
    setSaveState('saving');
    try {
      ensureProjectV7(project);
      project.updatedAt = new Date().toISOString();
      await DomusDB.put(project, { skipSnapshot: true });
      setSaveState('saved');
      checkStoragePressure();
      if (!quiet) toast('Projekt byl uložen do zařízení.');
      const variant = currentVariant(project);
      if (!skipAutoSync && variant?.field?.sync?.autoSync && state.syncStatus.enabled && state.syncStatus.paired) setTimeout(() => pushCurrentProjectToSync(true), 120);
    } catch (error) {
      setSaveState('error', error.message || 'Neznámá chyba ukládání');
      throw error;
    }
  }


/* Global/rendered event binding, action router and dialogs. Source fragment; assembled by scripts/build.mjs. */
  function bindGlobalEvents() {
    document.getElementById('homeBtn').addEventListener('click', () => { state.currentProjectId = null; state.currentTab = 'overview'; render(); });
    document.getElementById('newProjectBtn').addEventListener('click', () => openProjectDialog());
    document.getElementById('exportBtn').addEventListener('click', exportBackup);
    document.getElementById('importBtn').addEventListener('click', () => backupInput.click());
    document.getElementById('mobileImportBtn')?.addEventListener('click', () => { mobileActions.hidden = true; backupInput.click(); });
    document.getElementById('mobileExportBtn')?.addEventListener('click', () => { mobileActions.hidden = true; exportBackup(); });
    document.getElementById('storageInfoBtn')?.addEventListener('click', () => { mobileActions.hidden = true; showStorageDialog(); });
    document.getElementById('createSnapshotBtn')?.addEventListener('click', async () => { await DomusDB.createSnapshot(state.projects, 'Ruční bod obnovy'); toast('Bod obnovy byl vytvořen.'); showStorageDialog(); });
    mobileMenuBtn?.addEventListener('click', () => { mobileActions.hidden = !mobileActions.hidden; mobileMenuBtn.setAttribute('aria-expanded', String(!mobileActions.hidden)); });
    undoBtn?.addEventListener('click', undoLastChange);
    document.addEventListener('keydown', (event) => {
      const key=event.key.toLowerCase(); if((event.ctrlKey||event.metaKey)&&key==='z'&&state.currentTab==='plan'){event.preventDefault();return event.shiftKey?redoPlanChange():undoPlanChange();}
      if((event.ctrlKey||event.metaKey)&&key==='z'&&state.undo){event.preventDefault();undoLastChange();}
      if((event.key==='Delete'||event.key==='Backspace')&&state.currentTab==='plan'&&state.selectedPlanIds?.size&&!/input|textarea|select/i.test(event.target.tagName)){event.preventDefault();deletePlanSelection();}
    });
    document.getElementById('settingsBtn')?.addEventListener('click',openSettingsDialog);
    document.getElementById('mobileSettingsBtn')?.addEventListener('click',()=>{mobileActions.hidden=true;openSettingsDialog();});
    document.getElementById('onboardingStartBtn')?.addEventListener('click',()=>{const template=document.getElementById('onboardingTemplateSelect')?.value||'blank';finishOnboarding();openProjectDialog();if(projectForm.elements.template)projectForm.elements.template.value=template;});
    document.getElementById('onboardingCloseBtn')?.addEventListener('click',finishOnboarding);
    document.getElementById('onboardingCloseBtnSecondary')?.addEventListener('click',finishOnboarding);
    document.getElementById('settingsForm')?.addEventListener('submit',(event)=>{event.preventDefault();if(event.submitter?.value==='cancel')return document.getElementById('settingsDialog').close();savePremiumSettings(event.currentTarget);document.getElementById('settingsDialog').close();render();});
    document.getElementById('brandingLogoInput')?.addEventListener('change',async(event)=>{const file=event.target.files?.[0];if(!file)return;try{state.branding.logoDataUrl=await imageFileToDataUrl(file,800,400,.88);saveJsonStorage('domusBranding',state.branding);openSettingsDialog();}catch(error){toast(error.message,'error');}});
    document.getElementById('checkDesktopUpdateBtn')?.addEventListener('click',()=>checkDesktopUpdates(true));
    document.addEventListener('click',(event)=>{const card=event.target.closest('[data-template-choice]');if(!card)return;document.querySelectorAll('[data-template-choice]').forEach(x=>x.classList.remove('active'));card.classList.add('active');const select=document.getElementById('onboardingTemplateSelect');if(select)select.value=card.dataset.templateChoice;});
    backupInput.addEventListener('change', importBackup);
    photoInput.addEventListener('change', importPhoto);
    compareBeforeInput.addEventListener('change', (event) => importComparisonImage(event, 'before'));
    compareAfterInput.addEventListener('change', (event) => importComparisonImage(event, 'after'));
    roomPhotosInput.addEventListener('change', importRoomPhotos);
    fieldPhotoInput.addEventListener('change', importFieldPhotos);
    scanInput.addEventListener('change', importScanFile);
    diaryPhotoInput.addEventListener('change', importDiaryPhotos);
    warrantyDocumentInput.addEventListener('change', importWarrantyDocument);

    diaryForm.addEventListener('submit', async (event) => {
      event.preventDefault(); if (event.submitter?.value === 'cancel') return diaryDialog.close();
      const project=currentProject(),variant=currentVariant(project),data=Object.fromEntries(new FormData(diaryForm).entries());
      const payload={date:data.date,type:data.type,title:data.title,contractor:data.contractor||'',responsible:data.responsible||'',workers:parseNum(data.workers),weather:data.weather||'',status:data.status,plannedCost:parseNum(data.plannedCost),actualCost:parseNum(data.actualCost),note:data.note||'',updatedAt:new Date().toISOString()};
      const editingId=diaryForm.dataset.editingId; let entry;
      if(editingId){entry=variant.diary.entries.find((item)=>item.id===editingId);entry.history=entry.history||[];entry.history.push({changedAt:new Date().toISOString(),snapshot:{date:entry.date,type:entry.type,title:entry.title,contractor:entry.contractor,responsible:entry.responsible,workers:entry.workers,weather:entry.weather,status:entry.status,plannedCost:entry.plannedCost,actualCost:entry.actualCost,note:entry.note}});entry.history=entry.history.slice(-20);Object.assign(entry,payload);}else{entry={id:uid('diary'),...payload,photos:[],documents:[],history:[],createdAt:new Date().toISOString()};variant.diary.entries.push(entry);}
      if(data.hiddenName){const passportPayload={entryId:entry.id,name:data.hiddenName,category:data.hiddenCategory||'Skrytý prvek',location:data.hiddenLocation||'',depth:data.hiddenDepth||'',description:data.hiddenDescription||'',updatedAt:new Date().toISOString()};const existingPassport=variant.diary.passport.find((item)=>item.entryId===entry.id);if(existingPassport)Object.assign(existingPassport,passportPayload);else variant.diary.passport.push({id:uid('passport'),...passportPayload,createdAt:new Date().toISOString()});}
      await saveProject(project);diaryDialog.close();diaryForm.reset();delete diaryForm.dataset.editingId;toast(editingId?'Záznam byl upraven.':'Záznam byl přidán do deníku.');render();
    });
    warrantyForm.addEventListener('submit', async (event) => {
      event.preventDefault(); if (event.submitter?.value === 'cancel') return warrantyDialog.close();
      const project=currentProject(),variant=currentVariant(project),data=Object.fromEntries(new FormData(warrantyForm).entries());
      const payload={item:data.item,supplier:data.supplier||'',purchaseDate:data.purchaseDate||'',warrantyMonths:parseNum(data.warrantyMonths,24),serial:data.serial||'',note:data.note||'',updatedAt:new Date().toISOString()};
      const editingId=warrantyForm.dataset.editingId;if(editingId)Object.assign(variant.diary.warranties.find((item)=>item.id===editingId),payload);else variant.diary.warranties.push({id:uid('warranty'),...payload,documents:[],createdAt:new Date().toISOString()});
      await saveProject(project);warrantyDialog.close();warrantyForm.reset();delete warrantyForm.dataset.editingId;toast('Záruka nebo doklad byl uložen.');render();
    });

    projectForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return projectDialog.close();
      const formData = Object.fromEntries(new FormData(projectForm).entries());
      formData.template ||= 'blank';
      const editingId = projectForm.dataset.editingId;
      if (editingId) {
        const project = state.projects.find((item) => item.id === editingId);
        if (project) { Object.assign(project, formData); await saveProject(project); toast('Údaje projektu byly upraveny.'); }
      } else {
        const project = createProject(formData);
        state.projects.unshift(project);
        await DomusDB.put(project);
        state.currentProjectId = project.id;
        state.currentTab = 'overview';
        toast('Nový projekt byl vytvořen.');
      }
      projectDialog.close(); projectForm.reset(); delete projectForm.dataset.editingId; render();
    });

    document.getElementById('parseUrlBtn').addEventListener('click', importProductFromUrl);

    materialForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return materialDialog.close();
      const project = currentProject(); const variant = currentVariant(project);
      const data = Object.fromEntries(new FormData(materialForm).entries());
      const payload = {
        name: data.name, category: data.category, manufacturer: data.manufacturer || '', sku: data.sku || '', url: DomusCore.cleanHttpUrl(data.url || ''),
        width: parseNum(data.width), depth: parseNum(data.depth), height: parseNum(data.height),
        calculation: data.calculation || 'manual', unit: data.unit || 'ks', quantity: parseNum(data.quantity, 1), coverage: Math.max(0.0001, parseNum(data.coverage, 1)),
        wastePercent: parseNum(data.wastePercent), unitPrice: parseNum(data.unitPrice), color: data.color || '', swatch: data.swatch || '#d6d6d0', note: data.note || '', updatedAt: new Date().toISOString(),
      };
      const editingId = materialForm.dataset.editingId;
      if (editingId) Object.assign(variant.materials.find((item) => item.id === editingId), payload);
      else variant.materials.push({ id: uid('material'), ...payload });
      await saveProject(project);
      materialDialog.close(); materialForm.reset(); delete materialForm.dataset.editingId;
      toast(editingId ? 'Položka byla upravena.' : 'Položka byla přidána do projektu.'); render();
    });

    costForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return costDialog.close();
      const project = currentProject(); const variant = currentVariant(project);
      const data = Object.fromEntries(new FormData(costForm).entries());
      const payload = { name: data.name, category: data.category, quantity: parseNum(data.quantity, 1), unit: data.unit, unitPrice: parseNum(data.unitPrice), note: data.note || '', updatedAt: new Date().toISOString() };
      const editingId = costForm.dataset.editingId;
      if (editingId) Object.assign(variant.costs.lines.find((item) => item.id === editingId), payload);
      else variant.costs.lines.push({ id: uid('cost'), ...payload });
      await saveProject(project); costDialog.close(); costForm.reset(); delete costForm.dataset.editingId;
      toast(editingId ? 'Náklad byl upraven.' : 'Náklad byl přidán.'); render();
    });

    assemblyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return assemblyDialog.close();
      const project = currentProject(); const variant = currentVariant(project);
      const data = Object.fromEntries(new FormData(assemblyForm).entries());
      const type = assemblyForm.dataset.type || 'floor';
      variant.assemblies[type].push({ id: uid('layer'), name: data.name, thicknessMm: parseNum(data.thicknessMm), material: data.material || '', color: data.color || '#999999', note: data.note || '' });
      await saveProject(project); assemblyDialog.close(); assemblyForm.reset(); toast('Vrstva byla přidána do skladby.'); render();
    });

    objectForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return objectDialog.close();
      const project = currentProject(); const variant = currentVariant(project); const plan = variant.plan;
      const object = plan.objects.find((item) => item.id === objectForm.dataset.editingId);
      if (!object) return objectDialog.close();
      pushPlanHistory(project, variant);
      const data = Object.fromEntries(new FormData(objectForm).entries());
      object.type = data.type; object.width = parseNum(data.widthMm) / 1000 * plan.scale; object.depth = parseNum(data.depthMm) / 1000 * plan.scale;
      object.height = parseNum(data.heightCm); object.rotation = parseNum(data.rotation); object.layer = data.layer; object.materialId = data.materialId || ''; object.note = data.note || ''; object.updatedAt = new Date().toISOString(); object.hingeSide = data.hingeSide || 'left'; object.opensTo = data.opensTo || 'inside';
      object.color = variant.materials.find((item) => item.id === object.materialId)?.swatch || LAYERS[object.layer]?.color || object.color;
      await saveProject(project); objectDialog.close(); delete objectForm.dataset.editingId; toast('Objekt byl upraven.'); render();
    });

    variantForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (event.submitter?.value === 'cancel') return variantDialog.close();
      const project = currentProject(); const formData = new FormData(variantForm); const name = String(formData.get('name') || '').trim();
      if (!name) return;
      const duplicate = formData.get('duplicate') === 'on'; const source = currentVariant(project); const variant = duplicate ? deepClone(source) : blankVariant(name);
      variant.id = uid('variant'); variant.name = name; variant.createdAt = new Date().toISOString(); ensureProjectV6({ variants: [variant], activeVariantId: variant.id });
      project.variants.push(variant); project.activeVariantId = variant.id; await saveProject(project);
      variantDialog.close(); variantForm.reset(); toast('Nová varianta byla vytvořena.'); render();
    });
  }

  function bindRenderedEvents() {
    document.querySelectorAll('[data-layer-lock]').forEach((input)=>input.addEventListener('change',()=>{const p=currentProject(),v=currentVariant(p);v.plan.layerLocks[input.dataset.layerLock]=input.checked;saveProject(p,true,true);render();}));
    document.querySelectorAll('[data-plan-select]').forEach((input)=>input.addEventListener('change',()=>{input.checked?state.selectedPlanIds.add(input.dataset.planSelect):state.selectedPlanIds.delete(input.dataset.planSelect);render();}));
    document.getElementById('snapGrid')?.addEventListener('change',(e)=>{state.planSnap.grid=e.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapEndpoints')?.addEventListener('change',(e)=>{state.planSnap.endpoints=e.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapOrthogonal')?.addEventListener('change',(e)=>{state.planSnap.orthogonal=e.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapGridMm')?.addEventListener('change',(e)=>{state.planSnap.gridMm=clamp(parseNum(e.target.value,100),10,2000);saveJsonStorage('domusPlanSnap',state.planSnap);render();});
    document.getElementById('showPlanDimensions')?.addEventListener('change',async(e)=>{const p=currentProject();currentVariant(p).plan.showDimensions=e.target.checked;await saveProject(p);render();});
    document.getElementById('librarySearch')?.addEventListener('input',(e)=>{state.librarySearch=e.target.value;render();});
    document.getElementById('libraryCategory')?.addEventListener('change',(e)=>{state.libraryCategory=e.target.value;render();});
    document.getElementById('reportRevision')?.addEventListener('change',async(e)=>{const p=currentProject();p.reportRevision=Math.max(1,parseNum(e.target.value,1));if(!p.reportRevisionLabel)p.reportRevisionLabel=`R${p.reportRevision}`;await saveProject(p,true,true);render();});
    document.getElementById('reportRevisionLabel')?.addEventListener('change',async(e)=>{const p=currentProject();p.reportRevisionLabel=e.target.value.trim()||`R${p.reportRevision||1}`;await saveProject(p,true,true);render();});
    [['threeCameraMode','cameraMode'],['threeCutaway','cutaway'],['threeShadows','shadows'],['threeCeiling','ceiling'],['threeLabels','labels']].forEach(([id,key])=>document.getElementById(id)?.addEventListener('change',(e)=>{state.threeD[key]=e.target.type==='checkbox'?e.target.checked:(e.target.type==='range'?parseNum(e.target.value):e.target.value);setupModelCanvas();}));
    app.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', handleAction));
    app.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => { state.currentTab = button.dataset.tab; render(); }));
    app.querySelectorAll('[data-tab-jump]').forEach((button) => button.addEventListener('click', () => { state.currentTab = button.dataset.tabJump; render(); }));
    app.querySelectorAll('[data-photo-tool]').forEach((button) => button.addEventListener('click', () => { state.photoTool = button.dataset.photoTool; render(); }));
    app.querySelectorAll('[data-plan-tool]').forEach((button) => button.addEventListener('click', () => { state.planTool = button.dataset.planTool; render(); }));
    app.querySelectorAll('[data-library-element]').forEach((button) => button.addEventListener('click', () => {
      state.planElementKey = button.dataset.libraryElement; state.activeLayer = allElementLibrary().find((item) => item.key === state.planElementKey)?.layer || state.activeLayer; state.planTool = 'object'; render();
    }));
    app.querySelectorAll('[data-active-layer]').forEach((button) => button.addEventListener('click', () => {
      state.activeLayer = button.dataset.activeLayer;
      const first = allElementLibrary().find((item) => item.layer === state.activeLayer); if (first) state.planElementKey = first.key;
      render();
    }));
    app.querySelectorAll('[data-layer-toggle]').forEach((checkbox) => checkbox.addEventListener('change', async () => {
      const project = currentProject(); currentVariant(project).plan.layerVisibility[checkbox.dataset.layerToggle] = checkbox.checked; await saveProject(project); setupPlanCanvas();
    }));
    app.querySelectorAll('[data-model-mode]').forEach((button) => button.addEventListener('click', () => { state.modelMode = button.dataset.modelMode; render(); }));
    app.querySelectorAll('[data-pdf-option]').forEach((checkbox) => checkbox.addEventListener('change', () => { state.pdfOptions[checkbox.dataset.pdfOption] = checkbox.checked; render(); }));

    const diarySearch = document.getElementById('diarySearch');
    if (diarySearch) diarySearch.addEventListener('input', (event) => { state.diaryFilter = event.target.value; render(); requestAnimationFrame(() => { const input = document.getElementById('diarySearch'); input?.focus(); input?.setSelectionRange(state.diaryFilter.length, state.diaryFilter.length); }); });

    const bindLiveFilter = (id, key) => { const input = document.getElementById(id); if (!input) return; input.addEventListener('input', (event) => { state.filters[key] = event.target.value; render(); requestAnimationFrame(() => { const fresh = document.getElementById(id); fresh?.focus(); fresh?.setSelectionRange?.(state.filters[key].length, state.filters[key].length); }); }); };
    bindLiveFilter('materialsSearch', 'materials');
    bindLiveFilter('budgetSearch', 'budget');
    bindLiveFilter('auditSearch', 'auditText');
    const auditSeverity = document.getElementById('auditSeverity');
    if (auditSeverity) auditSeverity.addEventListener('change', () => { state.filters.auditSeverity = auditSeverity.value; render(); });
    const auditStatus = document.getElementById('auditStatus');
    if (auditStatus) auditStatus.addEventListener('change', () => { state.filters.auditStatus = auditStatus.value; render(); });

    const projectSearch = document.getElementById('projectSearch');
    if (projectSearch) projectSearch.addEventListener('input', (event) => { state.search = event.target.value; render(); requestAnimationFrame(() => { const input = document.getElementById('projectSearch'); input?.focus(); input?.setSelectionRange(state.search.length, state.search.length); }); });

    const variantSelect = document.getElementById('variantSelect');
    if (variantSelect) variantSelect.addEventListener('change', async () => { const project = currentProject(); project.activeVariantId = variantSelect.value; await saveProject(project); render(); });

    const notes = document.getElementById('variantNotes');
    if (notes) notes.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).notes = notes.value; await saveProject(project); toast('Poznámky byly uloženy.'); });

    const planInputs = [
      ['planScale', (variant, input) => { rescalePlan(variant.plan, Number(input.value)); }],
      ['wallHeight', (variant, input) => { variant.plan.wallHeight = parseNum(input.value, 2.6); }],
      ['wallThickness', (variant, input) => { variant.plan.wallThickness = parseNum(input.value, 0.15); }],
      ['floorAreaOverride', (variant, input) => { variant.metricsOverrides.floorArea = input.value; }],
      ['wallAreaOverride', (variant, input) => { variant.metricsOverrides.wallArea = input.value; }],
    ];
    planInputs.forEach(([id, setter]) => { const input = document.getElementById(id); if (input) input.addEventListener('change', async () => { const project = currentProject(); setter(currentVariant(project), input); await saveProject(project); render(); }); });

    const sectionName = document.getElementById('sectionName');
    const sectionOrientation = document.getElementById('sectionOrientation');
    const sectionPosition = document.getElementById('sectionPosition');
    const sectionDimensions = document.getElementById('sectionDimensions');
    if (sectionName) sectionName.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).section.name = sectionName.value; await saveProject(project); });
    if (sectionOrientation) sectionOrientation.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).section.orientation = sectionOrientation.value; await saveProject(project); setupSectionCanvas(); });
    if (sectionPosition) {
      sectionPosition.addEventListener('input', () => { const variant = currentVariant(); variant.section.position = Number(sectionPosition.value); const value = document.getElementById('sectionPositionValue'); if (value) value.textContent = `${sectionPosition.value} %`; setupSectionCanvas(); });
      sectionPosition.addEventListener('change', () => saveProject(currentProject()));
    }
    if (sectionDimensions) sectionDimensions.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).section.showDimensions = sectionDimensions.checked; await saveProject(project); setupSectionCanvas(); });

    ['cameraAngle','cameraTilt','cameraZoom'].forEach((id) => { const input = document.getElementById(id); if (!input) return; input.addEventListener('input', () => { if (id === 'cameraAngle') state.threeD.angle = Number(input.value); if (id === 'cameraTilt') state.threeD.tilt = Number(input.value); if (id === 'cameraZoom') state.threeD.zoom = Number(input.value); setupModelCanvas(); }); });
    [['wallMaterialSelect','wallMaterialId'],['floorMaterialSelect','floorMaterialId'],['ceilingMaterialSelect','ceilingMaterialId']].forEach(([id,key]) => { const input = document.getElementById(id); if (input) input.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).appearance[key] = input.value; await saveProject(project); setupModelCanvas(); }); });

    const contingency = document.getElementById('contingencyPercent'); const vat = document.getElementById('vatPercent');
    if (contingency) contingency.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).costs.contingencyPercent = parseNum(contingency.value); await saveProject(project); render(); });
    if (vat) vat.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).costs.vatPercent = parseNum(vat.value); await saveProject(project); render(); });

    const comparisonSlider = document.getElementById('comparisonSlider');
    if (comparisonSlider) {
      comparisonSlider.addEventListener('input', () => { const value = Number(comparisonSlider.value); currentVariant().comparison.slider = value; const layer = document.getElementById('compareBeforeLayer'); const divider = document.getElementById('compareDivider'); if (layer) layer.style.clipPath = `inset(0 ${100-value}% 0 0)`; if (divider) divider.style.left = `${value}%`; });
      comparisonSlider.addEventListener('change', () => saveProject(currentProject()));
    }
    [['comparisonBeforeLabel','beforeLabel'],['comparisonAfterLabel','afterLabel'],['comparisonNotes','notes']].forEach(([id,key]) => { const input = document.getElementById(id); if (input) input.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).comparison[key] = input.value; await saveProject(project); render(); }); });

    app.querySelectorAll('[data-room-photo-name]').forEach((input) => input.addEventListener('change', () => updateRoomPhotoField(input.dataset.roomPhotoName, 'name', input.value)));
    app.querySelectorAll('[data-room-photo-view]').forEach((input) => input.addEventListener('change', () => updateRoomPhotoField(input.dataset.roomPhotoView, 'view', input.value)));
    app.querySelectorAll('[data-room-photo-note]').forEach((input) => input.addEventListener('change', () => updateRoomPhotoField(input.dataset.roomPhotoNote, 'note', input.value)));
    const fieldSessionSelect = document.getElementById('fieldSessionSelect');
    if (fieldSessionSelect) fieldSessionSelect.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).field.activeSessionId = fieldSessionSelect.value; await saveProject(project); render(); });
    const fieldSessionStatus = document.getElementById('fieldSessionStatus');
    if (fieldSessionStatus) fieldSessionStatus.addEventListener('change', async () => { const project = currentProject(); const session = currentFieldSession(currentVariant(project)); session.status = fieldSessionStatus.value; session.updatedAt = new Date().toISOString(); await saveProject(project); });
    const fieldSessionNotes = document.getElementById('fieldSessionNotes');
    if (fieldSessionNotes) fieldSessionNotes.addEventListener('change', async () => { const project = currentProject(); const session = currentFieldSession(currentVariant(project)); session.notes = fieldSessionNotes.value; session.updatedAt = new Date().toISOString(); await saveProject(project); });
    app.querySelectorAll('[data-measure-preset]').forEach((button) => button.addEventListener('click', () => { const input = document.getElementById('fieldMeasureLabel'); if (input) { input.value = button.dataset.measurePreset; input.focus(); } }));
    app.querySelectorAll('[data-field-measure-verified]').forEach((input) => input.addEventListener('change', async () => { const project = currentProject(); const item = currentFieldSession(currentVariant(project)).measurements.find((entry) => entry.id === input.dataset.fieldMeasureVerified); if (item) { item.verified = input.checked; if(input.checked){item.source='measured';item.confidence=100;} } await saveProject(project); render(); }));
    app.querySelectorAll('[data-field-measure-source]').forEach((input) => input.addEventListener('change', async () => { const project=currentProject(); const item=currentFieldSession(currentVariant(project)).measurements.find((entry)=>entry.id===input.dataset.fieldMeasureSource); if(item){item.source=input.value;item.confidence=SOURCE_META[input.value]?.confidence||40;item.verified=input.value==='measured';} await saveProject(project);render(); }));
    app.querySelectorAll('[data-field-measure-target]').forEach((input) => input.addEventListener('change', async () => { const project=currentProject(); const item=currentFieldSession(currentVariant(project)).measurements.find((entry)=>entry.id===input.dataset.fieldMeasureTarget); if(item)item.targetId=input.value; await saveProject(project); render(); }));
    app.querySelectorAll('[data-field-photo-name]').forEach((input) => input.addEventListener('change', () => updateFieldPhoto(input.dataset.fieldPhotoName, 'name', input.value)));
    app.querySelectorAll('[data-field-photo-note]').forEach((input) => input.addEventListener('change', () => updateFieldPhoto(input.dataset.fieldPhotoNote, 'note', input.value)));
    const autoSyncToggle = document.getElementById('autoSyncToggle');
    if (autoSyncToggle) autoSyncToggle.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).field.sync.autoSync = autoSyncToggle.checked; await saveProject(project, true, true); });
    const presentationFov = document.getElementById('presentationFov');
    if (presentationFov) presentationFov.addEventListener('input', async () => { const project = currentProject(); currentVariant(project).presentation.fov = Number(presentationFov.value); drawWalkthrough(); });
    const presentationObjects = document.getElementById('presentationObjects');
    if (presentationObjects) presentationObjects.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).presentation.showObjects = presentationObjects.checked; await saveProject(project); drawWalkthrough(); });
    const presentationLabels = document.getElementById('presentationLabels');
    if (presentationLabels) presentationLabels.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).presentation.showLabels = presentationLabels.checked; await saveProject(project); drawWalkthrough(); });
    app.querySelectorAll('[data-walk]').forEach((button) => button.addEventListener('click', () => moveWalkthrough(button.dataset.walk)));
  }

  async function handleAction(event) {
    const action = event.currentTarget.dataset.action; const id = event.currentTarget.dataset.id; const type = event.currentTarget.dataset.type;
    if (action === 'new-project') return openProjectDialog();
    if (action === 'open-project') { state.currentProjectId = id; state.currentTab = 'overview'; return render(); }
    if (action === 'storage-info') return showStorageDialog();
    if (action === 'delete-project') { event.stopPropagation(); const project = state.projects.find((item) => item.id === id); if (!project || !confirm(`Opravdu přesunout projekt „${project.name}“ do koše?`)) return; const index=state.projects.indexOf(project); const trashId=await DomusDB.delete(id); state.projects = state.projects.filter((item) => item.id !== id); setUndo(`projekt ${project.name}`, async()=>{await DomusDB.restoreTrash(trashId);state.projects.splice(index,0,ensureProjectV6(project));render();}); toast('Projekt byl přesunut do koše.'); return render(); }
    if (action === 'back-dashboard') { state.currentProjectId = null; state.currentTab = 'overview'; return render(); }
    if (action === 'save-project') return saveProject(currentProject(), false);
    if (action === 'edit-project') return openProjectDialog(currentProject());
    if (action === 'new-variant') { variantForm.reset(); variantDialog.showModal(); return; }
    if (action === 'upload-photo') return photoInput.click();
    if (action === 'undo-photo') { const project = currentProject(); currentVariant(project).photo.annotations.pop(); await saveProject(project); return render(); }
    if (action === 'clear-photo') { const project = currentProject(); if (!confirm('Odstranit všechny kóty a poznámky z fotografie?')) return; const photo=currentVariant(project).photo, before={annotations:deepClone(photo.annotations),calibration:deepClone(photo.calibration)}; photo.annotations = []; photo.calibration = null; await saveProject(project); setUndo('kóty fotografie',async()=>{photo.annotations=before.annotations;photo.calibration=before.calibration;await saveProject(project);render();}); return render(); }
    if (action === 'fit-plan') { const project = currentProject(); const plan = currentVariant(project).plan; if (!plan.walls.length && !plan.objects.length) return toast('Výkres zatím neobsahuje žádné prvky.', 'error'); pushPlanHistory(project); fitPlanToCanvas(plan); await saveProject(project); toast('Výkres byl vystředěn a přizpůsoben plátnu.'); return render(); }
    if (action === 'undo-plan') return undoPlanChange();
    if (action === 'clear-plan') { const project = currentProject(); if (!confirm('Odstranit celý 2D výkres aktuální varianty?')) return; pushPlanHistory(project); const plan = currentVariant(project).plan, before={walls:deepClone(plan.walls),objects:deepClone(plan.objects)}; plan.walls = []; plan.objects = []; await saveProject(project); setUndo('celý 2D výkres',async()=>{plan.walls=before.walls;plan.objects=before.objects;await saveProject(project);render();}); return render(); }
    if (action === 'reset-camera') { state.threeD = { angle: 42, tilt: 28, zoom: 1 }; return render(); }
    if (action === 'add-material') return openMaterialDialog();
    if (action === 'edit-material') return openMaterialDialog(currentVariant().materials.find((item) => item.id === id));
    if (action === 'remove-material') { const project = currentProject(); const variant = currentVariant(project); const item = variant.materials.find((entry) => entry.id === id); if (!item || !confirm(`Odstranit položku „${item.name}“?`)) return; const index=variant.materials.indexOf(item), links=variant.plan.objects.filter((object)=>object.materialId===id).map((object)=>object.id); variant.materials = variant.materials.filter((entry) => entry.id !== id); variant.plan.objects.forEach((object) => { if (object.materialId === id) object.materialId = ''; }); await saveProject(project); setUndo(`materiál ${item.name}`,async()=>{variant.materials.splice(index,0,item);variant.plan.objects.forEach((object)=>{if(links.includes(object.id))object.materialId=item.id;});await saveProject(project);render();}); toast('Položka byla odstraněna.'); return render(); }
    if (action === 'add-cost') return openCostDialog();
    if (action === 'edit-cost') return openCostDialog(currentVariant().costs.lines.find((item) => item.id === id));
    if (action === 'remove-cost') { const project = currentProject(); const variant = currentVariant(project); const item=variant.costs.lines.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit náklad „${item.name}“?`))return;const index=variant.costs.lines.indexOf(item);variant.costs.lines = variant.costs.lines.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`náklad ${item.name}`,async()=>{variant.costs.lines.splice(index,0,item);await saveProject(project);render();}); toast('Náklad byl odstraněn.'); return render(); }
    if (action === 'add-assembly') return openAssemblyDialog(type);
    if (action === 'remove-assembly') { const project = currentProject(); const variant = currentVariant(project);const item=variant.assemblies[type].find((layer)=>layer.id===id);if(!item||!confirm(`Odstranit vrstvu „${item.name}“?`))return;const index=variant.assemblies[type].indexOf(item); variant.assemblies[type] = variant.assemblies[type].filter((layer) => layer.id !== id); await saveProject(project);setUndo(`vrstvu ${item.name}`,async()=>{variant.assemblies[type].splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'reset-assemblies') { if (!confirm('Nahradit všechny konstrukční skladby výchozími hodnotami?')) return; const project = currentProject(),variant=currentVariant(project),before=deepClone(variant.assemblies); variant.assemblies = deepClone(DEFAULT_ASSEMBLIES); await saveProject(project); setUndo('konstrukční skladby',async()=>{variant.assemblies=before;await saveProject(project);render();}); toast('Výchozí skladby byly obnoveny.'); return render(); }
    if (action === 'upload-compare-before') return compareBeforeInput.click();
    if (action === 'upload-compare-after') return compareAfterInput.click();
    if (action === 'use-project-photo-before') { const project = currentProject(); const variant = currentVariant(project); if (!variant.photo.dataUrl) return toast('Projekt zatím nemá fotografii.', 'error'); variant.comparison.beforeDataUrl = null; await saveProject(project); toast('Jako stav „před“ se používá projektová fotografie.'); return render(); }
    if (action === 'generate-model-after') { const project = currentProject(); const variant = currentVariant(project); const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = 900; drawModelCanvas(canvas, variant.plan, variant, 'material'); variant.comparison.afterDataUrl = canvas.toDataURL('image/jpeg', 0.9); await saveProject(project); toast('Vizualizace „po“ byla vytvořena z 3D modelu.'); return render(); }
    if (action === 'swap-comparison') { const project = currentProject(); const comparison = currentVariant(project).comparison; const before = comparison.beforeDataUrl || currentVariant(project).photo.dataUrl; const after = comparison.afterDataUrl; comparison.beforeDataUrl = after || null; comparison.afterDataUrl = before || null; [comparison.beforeLabel, comparison.afterLabel] = [comparison.afterLabel, comparison.beforeLabel]; await saveProject(project); return render(); }
    if (action === 'upload-room-photos') return roomPhotosInput.click();
    if (action === 'add-main-photo-to-set') return addMainPhotoToSet();
    if (action === 'select-room-photo') { const project = currentProject(); currentVariant(project).ai.activePhotoId = id; await saveProject(project); return render(); }
    if (action === 'remove-room-photo') { const project = currentProject(); const ai = currentVariant(project).ai;const item=ai.photoSet.find((photo)=>photo.id===id);if(!item||!confirm(`Odstranit fotografii „${item.name}“?`))return;const index=ai.photoSet.indexOf(item),wasActive=ai.activePhotoId===id; ai.photoSet = ai.photoSet.filter((photo) => photo.id !== id); if (wasActive) ai.activePhotoId = ai.photoSet[0]?.id || ''; await saveProject(project);setUndo(`fotografii ${item.name}`,async()=>{ai.photoSet.splice(index,0,item);if(wasActive)ai.activePhotoId=item.id;await saveProject(project);render();}); return render(); }
    if (action === 'export-photo-mosaic') return exportPhotoMosaic();
    if (action === 'refresh-ai-status') return checkAiStatus(true);
    if (action === 'run-local-analysis') return runLocalAnalysis();
    if (action === 'run-cloud-analysis') return runCloudAnalysis('space');
    if (action === 'apply-proposed-plan') return applyProposedPlan();
    if (action === 'add-detected-element') return addDetectedElement(Number(event.currentTarget.dataset.index));
    if (action === 'generate-local-variants') { const project = currentProject(); const variant = currentVariant(project); variant.ai.variantIdeas = buildLocalVariantIdeas(project, variant); await saveProject(project); toast('Byly připraveny tři návrhové směry.'); return render(); }
    if (action === 'generate-cloud-variants') return runCloudAnalysis('variants');
    if (action === 'create-idea-variant') return createVariantFromIdea(Number(event.currentTarget.dataset.index));
    if (action === 'new-field-session') { const project = currentProject(); const name = await askValue({ title: 'Nové zaměření', label: 'Název zaměření', value: `Zaměření ${currentVariant(project).field.sessions.length + 1}`, required: true }); if (!name) return; const session = blankFieldSession(name); currentVariant(project).field.sessions.push(session); currentVariant(project).field.activeSessionId = session.id; await saveProject(project); return render(); }
    if (action === 'delete-field-session') { const project = currentProject(); const field = currentVariant(project).field; if (field.sessions.length <= 1) return toast('Projekt musí obsahovat alespoň jedno zaměření.', 'error'); const session = currentFieldSession(currentVariant(project)); if (!confirm(`Odstranit zaměření „${session.name}“?`)) return; const index=field.sessions.indexOf(session),previousActive=field.activeSessionId; field.sessions = field.sessions.filter((item) => item.id !== session.id); field.activeSessionId = field.sessions[0].id; await saveProject(project); setUndo(`zaměření ${session.name}`,async()=>{field.sessions.splice(index,0,session);field.activeSessionId=previousActive;await saveProject(project);render();}); return render(); }
    if (action === 'add-field-measurement') return addFieldMeasurement();
    if (action === 'remove-field-measurement') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.measurements.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit měření „${item.label}“?`))return;const index=session.measurements.indexOf(item); session.measurements = session.measurements.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`měření ${item.label}`,async()=>{session.measurements.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'capture-field-photo') return fieldPhotoInput.click();
    if (action === 'remove-field-photo') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.photos.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit fotografii „${item.name}“?`))return;const index=session.photos.indexOf(item); session.photos = session.photos.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`fotografii ${item.name}`,async()=>{session.photos.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'save-field-location') return saveFieldLocation();
    if (action === 'import-lidar') return scanInput.click();
    if (action === 'remove-scan') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.scans.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit sken „${item.name}“?`))return;const index=session.scans.indexOf(item); session.scans = session.scans.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`sken ${item.name}`,async()=>{session.scans.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'apply-roomplan') return applyRoomPlanScan(id);
    if (action === 'refresh-sync-status') return checkSyncStatus(true);
    if (action === 'copy-mobile-url') { const url = `${state.syncStatus.serverUrl.replace(/\/$/, '')}/?mobile=1`; try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url); else throw new Error('Clipboard není dostupný'); toast('Adresa pro telefon byla zkopírována.'); } catch { await askValue({ title: 'Adresa pro telefon', label: 'Zkopírujte adresu ručně', value: url }); } return; }
    if (action === 'pair-sync-device') { const input = document.getElementById('syncPairCode'); return pairSyncDevice(String(input?.value || '')); }
    if (action === 'revoke-sync-device') { if(!confirm('Zrušit přístup tomuto zařízení?'))return;const response=await fetch('/api/sync/revoke',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});const payload=await response.json();if(!response.ok||!payload.ok)return toast(payload.error||'Přístup se nepodařilo zrušit.','error');toast('Přístup zařízení byl zrušen.');await checkSyncStatus(false);return render(); }
    if (action === 'sync-push') return pushCurrentProjectToSync();
    if (action === 'sync-pull') return pullCurrentProjectFromSync();
    if (action === 'sync-import-projects') return importProjectsFromSync();
    if (action === 'edit-plan-object') return openObjectDialog(currentVariant().plan.objects.find((object)=>object.id===id));
    if (action === 'edit-plan-wall') { const project=currentProject(),plan=currentVariant(project).plan,wall=plan.walls.find((item)=>item.id===id);if(!wall)return;const pixels=Math.hypot(wall.x2-wall.x1,wall.y2-wall.y1),currentLength=pixels/plan.scale;const entered=await askValue({title:'Upravit stěnu',label:'Přesná délka v metrech',value:currentLength.toFixed(2),type:'number',min:.01,required:true});const exact=parseNum(entered,currentLength);if(entered!==null&&exact>0){pushPlanHistory(project);const ux=(wall.x2-wall.x1)/pixels,uy=(wall.y2-wall.y1)/pixels;wall.x2=wall.x1+ux*exact*plan.scale;wall.y2=wall.y1+uy*exact*plan.scale;wall.updatedAt=new Date().toISOString();await saveProject(project);render();}return; }
    if (action === 'fullscreen-presentation') return openPresentationFullscreen();
    if (action === 'reset-walkthrough') { resetWalkthroughCamera(); return drawWalkthrough(); }
    if (action === 'toggle-gyro') return toggleGyroscope();
    if (action === 'check-xr') return checkXRSupport(true);
    if (action === 'start-webxr') return startWebXRPresentation();
    if (action === 'set-audit-status') {
      const project = currentProject(), audit = currentVariant(project).audit;
      const status = event.currentTarget.dataset.status || 'open';
      if (status === 'open') delete audit.overrides[id];
      else {
        const note = await askValue({ title: status === 'ignored' ? 'Přijmout technické riziko' : 'Potvrdit vyřešení nálezu', label: 'Zdůvodnění nebo důkaz', help: status === 'ignored' ? 'U kritického rizika uveďte, kdo a proč jej přijal. Technické skóre se tím nezmění.' : 'Uveďte provedenou změnu, nové měření nebo kontrolní dokument.', required: true });
        if (!note?.trim()) return;
        audit.overrides[id] = { status, note: note.trim(), fingerprint: event.currentTarget.dataset.fingerprint || '', updatedAt: new Date().toISOString() };
      }
      await saveProject(project); return render();
    }
    if (action === 'reset-audit-overrides') { const project=currentProject();currentVariant(project).audit.overrides={};await saveProject(project);toast('Všechny automatické nálezy jsou znovu aktivní.');return render(); }
    if (action === 'print-audit') return printAuditProtocol();
    if (action === 'save-rfq') { const project=currentProject();collectRfqForm(currentVariant(project));await saveProject(project);toast('Nastavení poptávky bylo uloženo.');return render(); }
    if (action === 'print-rfq') return printRfq();
    if (action === 'download-rfq-html') return downloadRfqHtml();
    if (action === 'download-rfq-csv') return downloadRfqCsv();
    if (action === 'new-diary-entry') return openDiaryDialog();
    if (action === 'edit-diary-entry') return openDiaryDialog(currentVariant().diary.entries.find((item)=>item.id===id));
    if (action === 'remove-diary-entry') { const project=currentProject(),diary=currentVariant(project).diary;const item=diary.entries.find((entry)=>entry.id===id);if(!item||!confirm('Odstranit tento záznam včetně připojených fotografií?'))return;const index=diary.entries.indexOf(item),passport=diary.passport.filter((entry)=>entry.entryId===id);diary.entries=diary.entries.filter((entry)=>entry.id!==id);diary.passport=diary.passport.filter((entry)=>entry.entryId!==id);await saveProject(project);setUndo(`záznam ${item.title}`,async()=>{diary.entries.splice(index,0,item);diary.passport.push(...passport);await saveProject(project);render();});return render(); }
    if (action === 'upload-diary-photo') { diaryPhotoInput.dataset.entryId=id;return diaryPhotoInput.click(); }
    if (action === 'new-warranty') return openWarrantyDialog();
    if (action === 'edit-warranty') return openWarrantyDialog(currentVariant().diary.warranties.find((item)=>item.id===id));
    if (action === 'remove-warranty') { const project=currentProject(),items=currentVariant(project).diary.warranties,item=items.find((entry)=>entry.id===id);if(!item||!confirm(`Smazat záruku nebo doklad „${item.item}“?`))return;const index=items.indexOf(item);currentVariant(project).diary.warranties=items.filter((entry)=>entry.id!==id);await saveProject(project);setUndo(`záruku ${item.item}`,async()=>{currentVariant(project).diary.warranties.splice(index,0,item);await saveProject(project);render();});return render(); }
    if (action === 'upload-warranty-document') { warrantyDocumentInput.dataset.warrantyId=id;return warrantyDocumentInput.click(); }
    if (action === 'download-warranty-document') { const item=currentVariant().diary.warranties.find((w)=>w.id===id),doc=item?.documents?.find((d)=>d.id===event.currentTarget.dataset.docId);if(!doc?.dataUrl)return toast(doc?.note||'Soubor není uložen v aplikaci.','error');const link=document.createElement('a');link.href=doc.dataUrl;link.download=doc.name;link.click();return; }
    if (action === 'edit-passport-item') return editPassportItem(currentVariant().diary.passport.find((item)=>item.id===id));
    if (action === 'remove-passport-item') { const project=currentProject(),items=currentVariant(project).diary.passport,item=items.find((entry)=>entry.id===id);if(!item||!confirm(`Odstranit položku technického pasu „${item.name}“?`))return;const index=items.indexOf(item);currentVariant(project).diary.passport=items.filter((entry)=>entry.id!==id);await saveProject(project);setUndo(`položku pasu ${item.name}`,async()=>{currentVariant(project).diary.passport.splice(index,0,item);await saveProject(project);render();});return render(); }
    if (action === 'open-settings') return openSettingsDialog();
    if (action === 'open-onboarding') return showOnboardingIfNeeded(true);
    if (action === 'open-plan-from-library') { state.currentTab='plan'; return render(); }
    if (action === 'insert-library-item') return insertLibraryItem(id);
    if (action === 'remove-custom-library') return removeCustomLibrary(id);
    if (action === 'redo-plan') return redoPlanChange();
    if (action === 'export-dxf') return exportCurrentDxf();
    if (action === 'duplicate-selection') return duplicatePlanSelection();
    if (action === 'mirror-selection-x') return transformSelection('mirror-x');
    if (action === 'mirror-selection-y') return transformSelection('mirror-y');
    if (action === 'align-selection-left') return transformSelection('align-left');
    if (action === 'align-selection-top') return transformSelection('align-top');
    if (action === 'save-selection-library') return saveSelectionToLibrary();
    if (action === 'delete-selection') return deletePlanSelection();
    if (action === 'export-report-html') return exportPremiumReportHtml();
    if (action === 'export-warranty-calendar') return exportWarrantyCalendar();
    if (action === 'export-glb') return exportCurrentGlb();
    if (action === 'fullscreen-3d') return fullscreenThree();
    if (action === 'capture-3d') return captureThreeImage();
    if (action === 'retry-3d') return setupModelCanvas();
    if (action === 'print-pdf') return prepareAndPrint();
  }

  function openMaterialDialog(item = null) {
    materialForm.reset(); delete materialForm.dataset.editingId;
    materialForm.elements.quantity.value = '1'; materialForm.elements.coverage.value = '1'; materialForm.elements.wastePercent.value = '10'; materialForm.elements.swatch.value = '#d6d6d0';
    if (item) {
      materialForm.dataset.editingId = item.id;
      ['url','name','category','manufacturer','sku','width','depth','height','calculation','unit','quantity','coverage','wastePercent','unitPrice','color','swatch','note'].forEach((key) => { if (materialForm.elements[key]) materialForm.elements[key].value = item[key] ?? ''; });
    }
    materialDialog.showModal();
  }

  function openCostDialog(item = null) {
    costForm.reset(); delete costForm.dataset.editingId; costForm.elements.quantity.value = '1';
    if (item) { costForm.dataset.editingId = item.id; ['name','category','quantity','unit','unitPrice','note'].forEach((key) => { costForm.elements[key].value = item[key] ?? ''; }); }
    costDialog.showModal();
  }

  function openAssemblyDialog(type = 'floor') {
    assemblyForm.reset(); assemblyForm.dataset.type = type; assemblyForm.elements.color.value = type === 'floor' ? '#c8b08a' : type === 'wall' ? '#a67f62' : '#dedbd2'; assemblyDialog.showModal();
  }

  function openObjectDialog(object) {
    if (!object) return;
    const variant = currentVariant(); const plan = variant.plan;
    objectForm.reset(); objectForm.dataset.editingId = object.id;
    objectForm.elements.type.value = object.type;
    objectForm.elements.widthMm.value = Math.round(object.width / plan.scale * 1000);
    objectForm.elements.depthMm.value = Math.round(object.depth / plan.scale * 1000);
    objectForm.elements.heightCm.value = object.height;
    objectForm.elements.rotation.value = object.rotation || 0;
    objectForm.elements.layer.innerHTML = Object.entries(LAYERS).map(([key, layer]) => `<option value="${key}" ${object.layer === key ? 'selected' : ''}>${escapeHtml(layer.label)}</option>`).join('');
    objectForm.elements.materialId.innerHTML = materialOptions(variant, object.materialId);
    objectForm.elements.hingeSide.value = object.hingeSide || 'left';
    objectForm.elements.opensTo.value = object.opensTo || 'inside';
    objectForm.elements.note.value = object.note || '';
    objectDialog.showModal();
  }

  function openProjectDialog(project = null) {
    projectForm.reset();
    if (project) {
      projectForm.dataset.editingId = project.id;
      projectForm.elements.name.value = project.name;
      projectForm.elements.category.value = project.category;
      projectForm.elements.status.value = project.status;
      projectForm.elements.location.value = project.location;
      projectForm.elements.summary.value = project.summary;
    } else {
      delete projectForm.dataset.editingId;
      if(projectForm.elements.template) projectForm.elements.template.value='blank';
    }
    projectDialog.showModal();
  }

  function setupActiveView() {
    if (state.currentTab === 'field') { checkSyncStatus(false); }
    if (state.currentTab === 'ai') setupAiWorkspace();
    if (state.currentTab === 'photo') setupPhotoCanvas();
    if (state.currentTab === 'plan') setupPlanCanvas();
    if (state.currentTab === 'section') setupSectionCanvas();
    if (state.currentTab === 'model') setupModelCanvas();
    if (state.currentTab === 'presentation') setupWalkthrough();
  }

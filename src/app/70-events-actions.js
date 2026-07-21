/* Global event binding and permanent DOM controls. Source fragment; bundled by esbuild. */
  function setMobileActionsOpen(open) {
    if (!mobileActions || !mobileMenuBtn) return;
    mobileActions.hidden = !open;
    mobileMenuBtn.setAttribute('aria-expanded', String(open));
  }

  function closeMobileActions() {
    setMobileActionsOpen(false);
  }

  function bindGlobalEvents() {
    document.getElementById('homeBtn').addEventListener('click', () => { state.currentProjectId = null; state.currentTab = 'overview'; render(); });
    document.getElementById('newProjectBtn').addEventListener('click', () => { closeMobileActions(); openProjectDialog(); });
    document.getElementById('mobileNewProjectBtn')?.addEventListener('click', () => { closeMobileActions(); openProjectDialog(); });
    document.getElementById('exportBtn').addEventListener('click', exportBackup);
    document.getElementById('importBtn').addEventListener('click', () => backupInput.click());
    document.getElementById('mobileImportBtn')?.addEventListener('click', () => { closeMobileActions(); backupInput.click(); });
    document.getElementById('mobileExportBtn')?.addEventListener('click', () => { closeMobileActions(); exportBackup(); });
    document.getElementById('storageInfoBtn')?.addEventListener('click', () => { closeMobileActions(); showStorageDialog(); });
    document.getElementById('createSnapshotBtn')?.addEventListener('click', async () => { await DomusDB.createSnapshot(state.projects, 'Ruční bod obnovy'); toast('Bod obnovy byl vytvořen.'); showStorageDialog(); });
    mobileMenuBtn?.addEventListener('click', (event) => { event.stopPropagation(); setMobileActionsOpen(mobileActions.hidden); });
    mobileActions?.addEventListener('click', (event) => event.stopPropagation());
    app.addEventListener('click', handleDelegatedAppClick);
    app.addEventListener('change', handleDelegatedAppChange);
    app.addEventListener('input', handleDelegatedAppInput);
    app.addEventListener('compositionstart', (event) => { if (FILTER_INPUTS[event.target.id]) state.composingFilterId = event.target.id; });
    app.addEventListener('compositionend', (event) => { if (FILTER_INPUTS[event.target.id]) { state.composingFilterId = ''; applyFilterInput(event.target); } });
    document.addEventListener('click', closeMobileActions);
    undoBtn?.addEventListener('click', undoLastChange);
    document.addEventListener('keydown', (event) => {
      const key=event.key.toLowerCase(); if((event.ctrlKey||event.metaKey)&&key==='z'&&state.currentTab==='plan'){event.preventDefault();return event.shiftKey?redoPlanChange():undoPlanChange();}
      if((event.ctrlKey||event.metaKey)&&key==='z'&&state.undo){event.preventDefault();undoLastChange();}
      if (event.key === 'Escape' && !mobileActions?.hidden) closeMobileActions();
      if((event.key==='Delete'||event.key==='Backspace')&&state.currentTab==='plan'&&state.selectedPlanIds?.size&&!/input|textarea|select/i.test(event.target.tagName)){event.preventDefault();deletePlanSelection();}
    });
    document.getElementById('settingsBtn')?.addEventListener('click',openSettingsDialog);
    document.getElementById('mobileSettingsBtn')?.addEventListener('click',()=>{closeMobileActions();openSettingsDialog();});
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
      variant.id = uid('variant'); variant.name = name; variant.createdAt = new Date().toISOString(); ensureProjectV7({ variants: [variant], activeVariantId: variant.id });
      project.variants.push(variant); project.activeVariantId = variant.id; await saveProject(project);
      variantDialog.close(); variantForm.reset(); toast('Nová varianta byla vytvořena.'); render();
    });
  }

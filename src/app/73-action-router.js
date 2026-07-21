/* Central data-action router. Source fragment; bundled by esbuild. */
  async function handleAction(event, control = event.target.closest('[data-action]')) {
    if (!control) return;
    const action = control.dataset.action; const id = control.dataset.id; const type = control.dataset.type;
    if (action === 'new-project') return openProjectDialog();
    if (action === 'open-project') { state.currentProjectId = id; state.currentTab = 'overview'; return render(); }
    if (action === 'storage-info') return showStorageDialog();
    if (action === 'delete-project') { event.stopPropagation(); const project = state.projects.find((item) => item.id === id); if (!project || !(await confirmAction({ title: 'Přesunout projekt do koše?', message: `Projekt „${project.name}“ bude možné obnovit v části Úložiště a obnova.`, acceptLabel: 'Přesunout do koše', destructive: true }))) return; const index=state.projects.indexOf(project); const trashId=await DomusDB.delete(id); state.projects = state.projects.filter((item) => item.id !== id); setUndo(`projekt ${project.name}`, async()=>{await DomusDB.restoreTrash(trashId);state.projects.splice(index,0,ensureProjectV7(project));render();}); toast('Projekt byl přesunut do koše.'); return render(); }
    if (action === 'back-dashboard') { state.currentProjectId = null; state.currentTab = 'overview'; return render(); }
    if (action === 'save-project') return saveProject(currentProject(), false);
    if (action === 'edit-project') return openProjectDialog(currentProject());
    if (action === 'new-variant') { variantForm.reset(); variantDialog.showModal(); return; }
    if (action === 'upload-photo') return photoInput.click();
    if (action === 'undo-photo') { const project = currentProject(); currentVariant(project).photo.annotations.pop(); await saveProject(project); return render(); }
    if (action === 'clear-photo') { const project = currentProject(); if (!(await confirmAction({ title: 'Vymazat anotace fotografie?', message: 'Odstraní se všechny kóty, poznámky i kalibrace fotografie. Samotný snímek zůstane zachován.', acceptLabel: 'Vymazat anotace', destructive: true }))) return; const photo=currentVariant(project).photo, before={annotations:deepClone(photo.annotations),calibration:deepClone(photo.calibration)}; photo.annotations = []; photo.calibration = null; await saveProject(project); setUndo('kóty fotografie',async()=>{photo.annotations=before.annotations;photo.calibration=before.calibration;await saveProject(project);render();}); return render(); }
    if (action === 'fit-plan') { const project = currentProject(); const plan = currentVariant(project).plan; if (!plan.walls.length && !plan.objects.length) return toast('Výkres zatím neobsahuje žádné prvky.', 'error'); pushPlanHistory(project); fitPlanToCanvas(plan); await saveProject(project); toast('Výkres byl vystředěn a přizpůsoben plátnu.'); return render(); }
    if (action === 'undo-plan') return undoPlanChange();
    if (action === 'clear-plan') { const project = currentProject(); if (!(await confirmAction({ title: 'Vymazat celý 2D výkres?', message: 'Stěny a všechny vložené prvky aktuální varianty budou odstraněny. Akci lze bezprostředně vrátit.', acceptLabel: 'Vymazat výkres', destructive: true }))) return; pushPlanHistory(project); const plan = currentVariant(project).plan, before={walls:deepClone(plan.walls),objects:deepClone(plan.objects)}; plan.walls = []; plan.objects = []; await saveProject(project); setUndo('celý 2D výkres',async()=>{plan.walls=before.walls;plan.objects=before.objects;await saveProject(project);render();}); return render(); }
    if (action === 'reset-camera') { state.threeD = { angle: 42, tilt: 28, zoom: 1 }; return render(); }
    if (action === 'add-material') return openMaterialDialog();
    if (action === 'edit-material') return openMaterialDialog(currentVariant().materials.find((item) => item.id === id));
    if (action === 'remove-material') { const project = currentProject(); const variant = currentVariant(project); const item = variant.materials.find((entry) => entry.id === id); if (!item || !(await confirmAction({ title: 'Odstranit materiál?', message: `Položka „${item.name}“ bude odebrána také z vazeb ve 2D výkresu.`, acceptLabel: 'Odstranit položku', destructive: true }))) return; const index=variant.materials.indexOf(item), links=variant.plan.objects.filter((object)=>object.materialId===id).map((object)=>object.id); variant.materials = variant.materials.filter((entry) => entry.id !== id); variant.plan.objects.forEach((object) => { if (object.materialId === id) object.materialId = ''; }); await saveProject(project); setUndo(`materiál ${item.name}`,async()=>{variant.materials.splice(index,0,item);variant.plan.objects.forEach((object)=>{if(links.includes(object.id))object.materialId=item.id;});await saveProject(project);render();}); toast('Položka byla odstraněna.'); return render(); }
    if (action === 'add-cost') return openCostDialog();
    if (action === 'edit-cost') return openCostDialog(currentVariant().costs.lines.find((item) => item.id === id));
    if (action === 'remove-cost') { const project = currentProject(); const variant = currentVariant(project); const item=variant.costs.lines.find((entry)=>entry.id===id);if(!item||!(await confirmAction({ title: 'Odstranit náklad?', message: `Náklad „${item.name}“ bude odebrán z rozpočtu.`, acceptLabel: 'Odstranit náklad', destructive: true })))return;const index=variant.costs.lines.indexOf(item);variant.costs.lines = variant.costs.lines.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`náklad ${item.name}`,async()=>{variant.costs.lines.splice(index,0,item);await saveProject(project);render();}); toast('Náklad byl odstraněn.'); return render(); }
    if (action === 'add-assembly') return openAssemblyDialog(type);
    if (action === 'remove-assembly') { const project = currentProject(); const variant = currentVariant(project);const item=variant.assemblies[type].find((layer)=>layer.id===id);if(!item||!(await confirmAction({ title: 'Odstranit vrstvu skladby?', message: `Vrstva „${item.name}“ bude odebrána z aktuální konstrukční skladby.`, acceptLabel: 'Odstranit vrstvu', destructive: true })))return;const index=variant.assemblies[type].indexOf(item); variant.assemblies[type] = variant.assemblies[type].filter((layer) => layer.id !== id); await saveProject(project);setUndo(`vrstvu ${item.name}`,async()=>{variant.assemblies[type].splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'reset-assemblies') { if (!(await confirmAction({ title: 'Obnovit výchozí skladby?', message: 'Všechny vlastní vrstvy podlahy, stěn a stropu budou nahrazeny výchozími hodnotami.', acceptLabel: 'Obnovit skladby', destructive: true }))) return; const project = currentProject(),variant=currentVariant(project),before=deepClone(variant.assemblies); variant.assemblies = deepClone(DEFAULT_ASSEMBLIES); await saveProject(project); setUndo('konstrukční skladby',async()=>{variant.assemblies=before;await saveProject(project);render();}); toast('Výchozí skladby byly obnoveny.'); return render(); }
    if (action === 'upload-compare-before') return compareBeforeInput.click();
    if (action === 'upload-compare-after') return compareAfterInput.click();
    if (action === 'use-project-photo-before') { const project = currentProject(); const variant = currentVariant(project); if (!variant.photo.dataUrl) return toast('Projekt zatím nemá fotografii.', 'error'); variant.comparison.beforeDataUrl = null; await saveProject(project); toast('Jako stav „před“ se používá projektová fotografie.'); return render(); }
    if (action === 'generate-model-after') { const project = currentProject(); const variant = currentVariant(project); const canvas = document.createElement('canvas'); canvas.width = 1400; canvas.height = 900; drawModelCanvas(canvas, variant.plan, variant, 'material'); variant.comparison.afterDataUrl = canvas.toDataURL('image/jpeg', 0.9); await saveProject(project); toast('Vizualizace „po“ byla vytvořena z 3D modelu.'); return render(); }
    if (action === 'swap-comparison') { const project = currentProject(); const comparison = currentVariant(project).comparison; const before = comparison.beforeDataUrl || currentVariant(project).photo.dataUrl; const after = comparison.afterDataUrl; comparison.beforeDataUrl = after || null; comparison.afterDataUrl = before || null; [comparison.beforeLabel, comparison.afterLabel] = [comparison.afterLabel, comparison.beforeLabel]; await saveProject(project); return render(); }
    if (action === 'upload-room-photos') return roomPhotosInput.click();
    if (action === 'add-main-photo-to-set') return addMainPhotoToSet();
    if (action === 'select-room-photo') { const project = currentProject(); currentVariant(project).ai.activePhotoId = id; await saveProject(project); return render(); }
    if (action === 'remove-room-photo') { const project = currentProject(); const ai = currentVariant(project).ai;const item=ai.photoSet.find((photo)=>photo.id===id);if(!item||!(await confirmAction({ title: 'Odstranit fotografii?', message: `Fotografie „${item.name}“ bude odstraněna z této sady.`, acceptLabel: 'Odstranit fotografii', destructive: true })))return;const index=ai.photoSet.indexOf(item),wasActive=ai.activePhotoId===id; ai.photoSet = ai.photoSet.filter((photo) => photo.id !== id); if (wasActive) ai.activePhotoId = ai.photoSet[0]?.id || ''; await saveProject(project);setUndo(`fotografii ${item.name}`,async()=>{ai.photoSet.splice(index,0,item);if(wasActive)ai.activePhotoId=item.id;await saveProject(project);render();}); return render(); }
    if (action === 'export-photo-mosaic') return exportPhotoMosaic();
    if (action === 'refresh-ai-status') return checkAiStatus(true);
    if (action === 'set-ai-workspace') return setAiWorkspaceMode(control.dataset.mode);
    if (action === 'generate-ai-visualizations') return generateAiVisualizations();
    if (action === 'select-ai-visualization') return selectAiVisualization(id);
    if (action === 'remove-ai-visualization') return removeAiVisualization(id);
    if (action === 'download-ai-visualization') return downloadAiVisualization(id);
    if (action === 'use-ai-visualization-comparison') return useAiVisualizationForComparison(id);
    if (action === 'send-ai-assistant') return sendAiAssistantMessage();
    if (action === 'assistant-quick-prompt') return sendAiAssistantMessage(control.dataset.prompt || '');
    if (action === 'apply-ai-assistant-proposal') return applyAiAssistantProposal();
    if (action === 'discard-ai-assistant-proposal') return discardAiAssistantProposal();
    if (action === 'clear-ai-assistant') return clearAiAssistant();
    if (action === 'open-manual-section') return openManualSection(control.dataset.section || 'start');
    if (action === 'open-manual-document') return openManualDocument();
    if (action === 'run-local-analysis') return runLocalAnalysis();
    if (action === 'run-cloud-analysis') return runCloudAnalysis('space');
    if (action === 'apply-proposed-plan') return applyProposedPlan();
    if (action === 'add-detected-element') return addDetectedElement(Number(control.dataset.index));
    if (action === 'generate-local-variants') { const project = currentProject(); const variant = currentVariant(project); variant.ai.variantIdeas = buildLocalVariantIdeas(project, variant); await saveProject(project); toast('Byly připraveny tři návrhové směry.'); return render(); }
    if (action === 'generate-cloud-variants') return runCloudAnalysis('variants');
    if (action === 'create-idea-variant') return createVariantFromIdea(Number(control.dataset.index));
    if (action === 'new-field-session') { const project = currentProject(); const name = await askValue({ title: 'Nové zaměření', label: 'Název zaměření', value: `Zaměření ${currentVariant(project).field.sessions.length + 1}`, required: true }); if (!name) return; const session = blankFieldSession(name); currentVariant(project).field.sessions.push(session); currentVariant(project).field.activeSessionId = session.id; await saveProject(project); return render(); }
    if (action === 'delete-field-session') { const project = currentProject(); const field = currentVariant(project).field; if (field.sessions.length <= 1) return toast('Projekt musí obsahovat alespoň jedno zaměření.', 'error'); const session = currentFieldSession(currentVariant(project)); if (!(await confirmAction({ title: 'Odstranit zaměření?', message: `Zaměření „${session.name}“ včetně měření, fotografií a skenů bude odstraněno.`, acceptLabel: 'Odstranit zaměření', destructive: true }))) return; const index=field.sessions.indexOf(session),previousActive=field.activeSessionId; field.sessions = field.sessions.filter((item) => item.id !== session.id); field.activeSessionId = field.sessions[0].id; await saveProject(project); setUndo(`zaměření ${session.name}`,async()=>{field.sessions.splice(index,0,session);field.activeSessionId=previousActive;await saveProject(project);render();}); return render(); }
    if (action === 'add-field-measurement') return addFieldMeasurement();
    if (action === 'remove-field-measurement') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.measurements.find((entry)=>entry.id===id);if(!item||!(await confirmAction({ title: 'Odstranit měření?', message: `Měření „${item.label}“ bude odebráno ze zaměření.`, acceptLabel: 'Odstranit měření', destructive: true })))return;const index=session.measurements.indexOf(item); session.measurements = session.measurements.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`měření ${item.label}`,async()=>{session.measurements.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'capture-field-photo') return fieldPhotoInput.click();
    if (action === 'remove-field-photo') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.photos.find((entry)=>entry.id===id);if(!item||!(await confirmAction({ title: 'Odstranit fotografii?', message: `Fotografie „${item.name}“ bude odstraněna z této sady.`, acceptLabel: 'Odstranit fotografii', destructive: true })))return;const index=session.photos.indexOf(item); session.photos = session.photos.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`fotografii ${item.name}`,async()=>{session.photos.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'save-field-location') return saveFieldLocation();
    if (action === 'import-lidar') return scanInput.click();
    if (action === 'remove-scan') { const project = currentProject(); const session = currentFieldSession(currentVariant(project));const item=session.scans.find((entry)=>entry.id===id);if(!item||!(await confirmAction({ title: 'Odstranit prostorový sken?', message: `Sken „${item.name}“ bude odebrán z evidence projektu.`, acceptLabel: 'Odstranit sken', destructive: true })))return;const index=session.scans.indexOf(item); session.scans = session.scans.filter((entry) => entry.id !== id); await saveProject(project);setUndo(`sken ${item.name}`,async()=>{session.scans.splice(index,0,item);await saveProject(project);render();}); return render(); }
    if (action === 'apply-roomplan') return applyRoomPlanScan(id);
    if (action === 'refresh-sync-status') return checkSyncStatus(true);
    if (action === 'copy-mobile-url') { const url = `${state.syncStatus.serverUrl.replace(/\/$/, '')}/?mobile=1`; try { if (navigator.clipboard?.writeText) await navigator.clipboard.writeText(url); else throw new Error('Clipboard není dostupný'); toast('Adresa pro telefon byla zkopírována.'); } catch { await askValue({ title: 'Adresa pro telefon', label: 'Zkopírujte adresu ručně', value: url }); } return; }
    if (action === 'pair-sync-device') { const input = document.getElementById('syncPairCode'); return pairSyncDevice(String(input?.value || '')); }
    if (action === 'revoke-sync-device') { if(!(await confirmAction({ title: 'Zrušit přístup zařízení?', message: 'Zařízení ztratí přístup k lokální synchronizaci a bude je nutné znovu spárovat.', acceptLabel: 'Zrušit přístup', destructive: true })))return;const response=await fetch('/api/sync/revoke',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id})});const payload=await response.json();if(!response.ok||!payload.ok)return toast(payload.error||'Přístup se nepodařilo zrušit.','error');toast('Přístup zařízení byl zrušen.');await checkSyncStatus(false);return render(); }
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
      const status = control.dataset.status || 'open';
      if (status === 'open') delete audit.overrides[id];
      else {
        const note = await askValue({ title: status === 'ignored' ? 'Přijmout technické riziko' : 'Potvrdit vyřešení nálezu', label: 'Zdůvodnění nebo důkaz', help: status === 'ignored' ? 'U kritického rizika uveďte, kdo a proč jej přijal. Technické skóre se tím nezmění.' : 'Uveďte provedenou změnu, nové měření nebo kontrolní dokument.', required: true });
        if (!note?.trim()) return;
        audit.overrides[id] = { status, note: note.trim(), fingerprint: control.dataset.fingerprint || '', updatedAt: new Date().toISOString() };
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
    if (action === 'remove-diary-entry') { const project=currentProject(),diary=currentVariant(project).diary;const item=diary.entries.find((entry)=>entry.id===id);if(!item||!(await confirmAction({ title: 'Odstranit záznam deníku?', message: 'Záznam, připojené fotografie a související položky technického pasu budou odstraněny.', acceptLabel: 'Odstranit záznam', destructive: true })))return;const index=diary.entries.indexOf(item),passport=diary.passport.filter((entry)=>entry.entryId===id);diary.entries=diary.entries.filter((entry)=>entry.id!==id);diary.passport=diary.passport.filter((entry)=>entry.entryId!==id);await saveProject(project);setUndo(`záznam ${item.title}`,async()=>{diary.entries.splice(index,0,item);diary.passport.push(...passport);await saveProject(project);render();});return render(); }
    if (action === 'upload-diary-photo') { diaryPhotoInput.dataset.entryId=id;return diaryPhotoInput.click(); }
    if (action === 'new-warranty') return openWarrantyDialog();
    if (action === 'edit-warranty') return openWarrantyDialog(currentVariant().diary.warranties.find((item)=>item.id===id));
    if (action === 'remove-warranty') { const project=currentProject(),items=currentVariant(project).diary.warranties,item=items.find((entry)=>entry.id===id);if(!item||!(await confirmAction({ title: 'Odstranit záruku nebo doklad?', message: `Položka „${item.item}“ včetně uložených dokumentů bude odstraněna.`, acceptLabel: 'Odstranit položku', destructive: true })))return;const index=items.indexOf(item);currentVariant(project).diary.warranties=items.filter((entry)=>entry.id!==id);await saveProject(project);setUndo(`záruku ${item.item}`,async()=>{currentVariant(project).diary.warranties.splice(index,0,item);await saveProject(project);render();});return render(); }
    if (action === 'upload-warranty-document') { warrantyDocumentInput.dataset.warrantyId=id;return warrantyDocumentInput.click(); }
    if (action === 'download-warranty-document') { const item=currentVariant().diary.warranties.find((w)=>w.id===id),doc=item?.documents?.find((d)=>d.id===control.dataset.docId);if(!doc?.dataUrl)return toast(doc?.note||'Soubor není uložen v aplikaci.','error');const link=document.createElement('a');link.href=doc.dataUrl;link.download=doc.name;link.click();return; }
    if (action === 'edit-passport-item') return editPassportItem(currentVariant().diary.passport.find((item)=>item.id===id));
    if (action === 'remove-passport-item') { const project=currentProject(),items=currentVariant(project).diary.passport,item=items.find((entry)=>entry.id===id);if(!item||!(await confirmAction({ title: 'Odstranit položku technického pasu?', message: `Položka „${item.name}“ bude odstraněna z dokumentace skrytých prvků.`, acceptLabel: 'Odstranit položku', destructive: true })))return;const index=items.indexOf(item);currentVariant(project).diary.passport=items.filter((entry)=>entry.id!==id);await saveProject(project);setUndo(`položku pasu ${item.name}`,async()=>{currentVariant(project).diary.passport.splice(index,0,item);await saveProject(project);render();});return render(); }
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

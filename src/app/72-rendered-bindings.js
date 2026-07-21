/* View-specific controls that require canvas or local state wiring. Source fragment; bundled by esbuild. */
  function bindRenderedEvents() {
    document.getElementById('snapGrid')?.addEventListener('change',(event)=>{state.planSnap.grid=event.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapEndpoints')?.addEventListener('change',(event)=>{state.planSnap.endpoints=event.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapOrthogonal')?.addEventListener('change',(event)=>{state.planSnap.orthogonal=event.target.checked;saveJsonStorage('domusPlanSnap',state.planSnap);});
    document.getElementById('snapGridMm')?.addEventListener('change',(event)=>{state.planSnap.gridMm=clamp(parseNum(event.target.value,100),10,2000);saveJsonStorage('domusPlanSnap',state.planSnap);render();});
    document.getElementById('showPlanDimensions')?.addEventListener('change',async(event)=>{const project=currentProject();currentVariant(project).plan.showDimensions=event.target.checked;await saveProject(project);render();});
    document.getElementById('reportRevision')?.addEventListener('change',async(event)=>{const project=currentProject();project.reportRevision=Math.max(1,parseNum(event.target.value,1));if(!project.reportRevisionLabel)project.reportRevisionLabel=`R${project.reportRevision}`;await saveProject(project,true,true);render();});
    document.getElementById('reportRevisionLabel')?.addEventListener('change',async(event)=>{const project=currentProject();project.reportRevisionLabel=event.target.value.trim()||`R${project.reportRevision||1}`;await saveProject(project,true,true);render();});
    [['threeCameraMode','cameraMode'],['threeCutaway','cutaway'],['threeShadows','shadows'],['threeCeiling','ceiling'],['threeLabels','labels']].forEach(([id,key])=>document.getElementById(id)?.addEventListener('change',(event)=>{state.threeD[key]=event.target.type==='checkbox'?event.target.checked:(event.target.type==='range'?parseNum(event.target.value):event.target.value);setupModelCanvas();}));
    const variantSelect = document.getElementById('variantSelect');
    if (variantSelect) variantSelect.addEventListener('change', async () => { const project = currentProject(); project.activeVariantId = variantSelect.value; await saveProject(project); render(); });

    const bindDebouncedProjectSave = (input, key, applyValue, { toastOnCommit = false } = {}) => {
      if (!input) return;
      state.inlineSaveTimers ||= {};
      const commit = async () => {
        clearTimeout(state.inlineSaveTimers[key]);
        const project = currentProject();
        if (!project) return;
        applyValue(project, input.value);
        await saveProject(project);
        if (toastOnCommit) toast('Poznámky byly uloženy.');
      };
      input.addEventListener('input', () => {
        const project = currentProject();
        if (!project) return;
        applyValue(project, input.value);
        clearTimeout(state.inlineSaveTimers[key]);
        state.inlineSaveTimers[key] = setTimeout(() => commit().catch((error) => { console.error(error); setSaveState('error', error.message); }), 550);
      });
      input.addEventListener('change', () => commit().catch((error) => { console.error(error); setSaveState('error', error.message); }));
    };

    const notes = document.getElementById('variantNotes');
    bindDebouncedProjectSave(notes, 'variantNotes', (project, value) => { currentVariant(project).notes = value; }, { toastOnCommit: true });

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

    const aiVisualizerSlider = document.getElementById('aiVisualizerSlider');
    if (aiVisualizerSlider) {
      aiVisualizerSlider.addEventListener('input', () => { const value=Number(aiVisualizerSlider.value);currentVariant().ai.visualizer.compareSlider=value;const layer=document.getElementById('aiVisualizerBeforeLayer'),divider=document.getElementById('aiVisualizerDivider');if(layer)layer.style.clipPath=`inset(0 ${100-value}% 0 0)`;if(divider)divider.style.left=`${value}%`; });
      aiVisualizerSlider.addEventListener('change', () => saveProject(currentProject(), true, true));
    }
    const aiAssistantInput = document.getElementById('aiAssistantInput');
    if (aiAssistantInput) aiAssistantInput.addEventListener('keydown', (event) => { if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) { event.preventDefault(); sendAiAssistantMessage(); } });

    const comparisonSlider = document.getElementById('comparisonSlider');
    if (comparisonSlider) {
      comparisonSlider.addEventListener('input', () => { const value = Number(comparisonSlider.value); currentVariant().comparison.slider = value; const layer = document.getElementById('compareBeforeLayer'); const divider = document.getElementById('compareDivider'); if (layer) layer.style.clipPath = `inset(0 ${100-value}% 0 0)`; if (divider) divider.style.left = `${value}%`; });
      comparisonSlider.addEventListener('change', () => saveProject(currentProject()));
    }
    [['comparisonBeforeLabel','beforeLabel'],['comparisonAfterLabel','afterLabel'],['comparisonNotes','notes']].forEach(([id,key]) => { const input = document.getElementById(id); if (input) input.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).comparison[key] = input.value; await saveProject(project); render(); }); });

    const fieldSessionSelect = document.getElementById('fieldSessionSelect');
    if (fieldSessionSelect) fieldSessionSelect.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).field.activeSessionId = fieldSessionSelect.value; await saveProject(project); render(); });
    const fieldSessionStatus = document.getElementById('fieldSessionStatus');
    if (fieldSessionStatus) fieldSessionStatus.addEventListener('change', async () => { const project = currentProject(); const session = currentFieldSession(currentVariant(project)); session.status = fieldSessionStatus.value; session.updatedAt = new Date().toISOString(); await saveProject(project); });
    const fieldSessionNotes = document.getElementById('fieldSessionNotes');
    bindDebouncedProjectSave(fieldSessionNotes, 'fieldSessionNotes', (project, value) => { const session = currentFieldSession(currentVariant(project)); session.notes = value; session.updatedAt = new Date().toISOString(); });
    const autoSyncToggle = document.getElementById('autoSyncToggle');
    if (autoSyncToggle) autoSyncToggle.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).field.sync.autoSync = autoSyncToggle.checked; await saveProject(project, true, true); });
    const presentationFov = document.getElementById('presentationFov');
    if (presentationFov) presentationFov.addEventListener('input', async () => { const project = currentProject(); currentVariant(project).presentation.fov = Number(presentationFov.value); drawWalkthrough(); });
    const presentationObjects = document.getElementById('presentationObjects');
    if (presentationObjects) presentationObjects.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).presentation.showObjects = presentationObjects.checked; await saveProject(project); drawWalkthrough(); });
    const presentationLabels = document.getElementById('presentationLabels');
    if (presentationLabels) presentationLabels.addEventListener('change', async () => { const project = currentProject(); currentVariant(project).presentation.showLabels = presentationLabels.checked; await saveProject(project); drawWalkthrough(); });
  }

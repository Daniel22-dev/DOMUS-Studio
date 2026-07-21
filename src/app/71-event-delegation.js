/* Delegated dynamic events and targeted filter-region updates. Source fragment; bundled by esbuild. */
  const FILTER_INPUTS = Object.freeze({
    projectSearch: { stateKey: 'search', region: 'projects' },
    materialsSearch: { filterKey: 'materials', region: 'materials' },
    budgetSearch: { filterKey: 'budget', region: 'budget' },
    auditSearch: { filterKey: 'auditText', region: 'audit' },
    diarySearch: { stateKey: 'diaryFilter', region: 'diary' },
    librarySearch: { stateKey: 'librarySearch', region: 'library' },
    manualSearch: { stateKey: 'manualSearch', region: 'manual' },
  });

  const FILTER_REGIONS = Object.freeze({
    projects: { render: () => renderDashboard(), regionId: 'projectGrid' },
    materials: { render: () => renderMaterialsTab(currentProject(), currentVariant()), regionId: 'materialsResults', countId: 'materialsFilterCount' },
    budget: { render: () => renderBudgetTab(currentProject(), currentVariant()), regionId: 'budgetResults', countId: 'budgetFilterCount' },
    audit: { render: () => renderAuditTab(currentProject(), currentVariant()), regionId: 'auditResults', countId: 'auditFilterCount' },
    diary: { render: () => renderDiaryTab(currentProject(), currentVariant()), regionId: 'diaryResults', countId: 'diaryFilterCount' },
    library: { render: () => renderLibraryTab(), regionId: 'libraryResults', countId: 'libraryFilterCount' },
    manual: { render: () => renderManualTab(currentProject(), currentVariant()), regionId: 'manualResults', countId: 'manualFilterCount' },
  });

  function refreshFilterRegion(regionName) {
    const config = FILTER_REGIONS[regionName];
    if (!config) return;
    const currentRegion = document.getElementById(config.regionId);
    if (!currentRegion) return;
    const template = document.createElement('template');
    template.innerHTML = config.render().trim();
    const nextRegion = template.content.querySelector(`#${config.regionId}`);
    if (!nextRegion) return;
    currentRegion.replaceWith(nextRegion);
    if (config.countId) {
      const currentCount = document.getElementById(config.countId);
      const nextCount = template.content.querySelector(`#${config.countId}`);
      if (currentCount && nextCount) currentCount.textContent = nextCount.textContent;
    }
  }

  function scheduleFilterRegion(regionName, delay = 90) {
    state.filterRegionTimers ||= {};
    clearTimeout(state.filterRegionTimers[regionName]);
    state.filterRegionTimers[regionName] = setTimeout(() => refreshFilterRegion(regionName), delay);
  }

  function applyFilterInput(input) {
    const config = FILTER_INPUTS[input.id];
    if (!config) return;
    if (config.filterKey) state.filters[config.filterKey] = input.value;
    else state[config.stateKey] = input.value;
    scheduleFilterRegion(config.region);
  }

  function handleDelegatedAppInput(event) {
    const input = event.target;
    if (FILTER_INPUTS[input.id] && state.composingFilterId !== input.id) applyFilterInput(input);
  }

  async function handleDelegatedAppChange(event) {
    const input = event.target;
    if (input.id === 'auditSeverity' || input.id === 'auditStatus') {
      state.filters[input.id === 'auditSeverity' ? 'auditSeverity' : 'auditStatus'] = input.value;
      return refreshFilterRegion('audit');
    }
    if (input.id === 'libraryCategory') { state.libraryCategory = input.value; return refreshFilterRegion('library'); }
    if (input.matches('[data-layer-lock]')) { const project=currentProject(),variant=currentVariant(project);variant.plan.layerLocks[input.dataset.layerLock]=input.checked;await saveProject(project,true,true);return render(); }
    if (input.matches('[data-plan-select]')) { input.checked?state.selectedPlanIds.add(input.dataset.planSelect):state.selectedPlanIds.delete(input.dataset.planSelect);return render(); }
    if (input.matches('[data-layer-toggle]')) { const project=currentProject();currentVariant(project).plan.layerVisibility[input.dataset.layerToggle]=input.checked;await saveProject(project);return setupPlanCanvas(); }
    if (input.matches('[data-pdf-option]')) { state.pdfOptions[input.dataset.pdfOption]=input.checked;return render(); }
    if (input.matches('[data-room-photo-name]')) return updateRoomPhotoField(input.dataset.roomPhotoName,'name',input.value);
    if (input.matches('[data-room-photo-view]')) return updateRoomPhotoField(input.dataset.roomPhotoView,'view',input.value);
    if (input.matches('[data-room-photo-note]')) return updateRoomPhotoField(input.dataset.roomPhotoNote,'note',input.value);
    if (input.id === 'visualizerSourcePhoto') { const project=currentProject(),visualizer=currentVariant(project).ai.visualizer;visualizer.sourcePhotoId=input.value;await saveProject(project,true,true);return render(); }
    if (['visualizerBrief','visualizerPreserve','visualizerRemove','visualizerAdd','visualizerStyle','visualizerQuality','visualizerSize','visualizerCount'].includes(input.id)) { const project=currentProject(),visualizer=currentVariant(project).ai.visualizer,map={visualizerBrief:'brief',visualizerPreserve:'preserve',visualizerRemove:'remove',visualizerAdd:'add',visualizerStyle:'style',visualizerQuality:'quality',visualizerSize:'size',visualizerCount:'count'};visualizer[map[input.id]]=input.id==='visualizerCount'?clamp(parseNum(input.value,2),1,3):input.value;await saveProject(project,true,true);return; }
    if (input.matches('[data-visualizer-lock]')) { const project=currentProject(),visualizer=currentVariant(project).ai.visualizer,key=input.dataset.visualizerLock,set=new Set(visualizer.lockedElements||[]);input.checked?set.add(key):set.delete(key);visualizer.lockedElements=[...set];await saveProject(project,true,true);return; }
    if (input.matches('[data-field-measure-verified]')) { const project=currentProject();const item=currentFieldSession(currentVariant(project)).measurements.find((entry)=>entry.id===input.dataset.fieldMeasureVerified);if(item){item.verified=input.checked;if(input.checked){item.source='measured';item.confidence=100;}}await saveProject(project);return render(); }
    if (input.matches('[data-field-measure-source]')) { const project=currentProject();const item=currentFieldSession(currentVariant(project)).measurements.find((entry)=>entry.id===input.dataset.fieldMeasureSource);if(item){item.source=input.value;item.confidence=SOURCE_META[input.value]?.confidence||40;item.verified=input.value==='measured';}await saveProject(project);return render(); }
    if (input.matches('[data-field-measure-target]')) { const project=currentProject();const item=currentFieldSession(currentVariant(project)).measurements.find((entry)=>entry.id===input.dataset.fieldMeasureTarget);if(item)item.targetId=input.value;await saveProject(project);return render(); }
    if (input.matches('[data-field-photo-name]')) return updateFieldPhoto(input.dataset.fieldPhotoName,'name',input.value);
    if (input.matches('[data-field-photo-note]')) return updateFieldPhoto(input.dataset.fieldPhotoNote,'note',input.value);
  }

  function handleDelegatedAppClick(event) {
    const actionControl = event.target.closest('[data-action]');
    if (actionControl) return handleAction(event, actionControl);
    const tab = event.target.closest('[data-tab]');
    if (tab) { state.currentTab = tab.dataset.tab; return render(); }
    const tabJump = event.target.closest('[data-tab-jump]');
    if (tabJump) { state.currentTab = tabJump.dataset.tabJump; return render(); }
    const photoTool = event.target.closest('[data-photo-tool]');
    if (photoTool) { state.photoTool = photoTool.dataset.photoTool; return render(); }
    const planTool = event.target.closest('[data-plan-tool]');
    if (planTool) { state.planTool = planTool.dataset.planTool; return render(); }
    const libraryElement = event.target.closest('[data-library-element]');
    if (libraryElement) { state.planElementKey=libraryElement.dataset.libraryElement;state.activeLayer=allElementLibrary().find((item)=>item.key===state.planElementKey)?.layer||state.activeLayer;state.planTool='object';return render(); }
    const activeLayer = event.target.closest('[data-active-layer]');
    if (activeLayer) { state.activeLayer=activeLayer.dataset.activeLayer;const first=allElementLibrary().find((item)=>item.layer===state.activeLayer);if(first)state.planElementKey=first.key;return render(); }
    const modelMode = event.target.closest('[data-model-mode]');
    if (modelMode) { state.modelMode=modelMode.dataset.modelMode;return render(); }
    const preset = event.target.closest('[data-measure-preset]');
    if (preset) { const input=document.getElementById('fieldMeasureLabel');if(input){input.value=preset.dataset.measurePreset;input.focus();}return; }
    const walk = event.target.closest('[data-walk]');
    if (walk) return moveWalkthrough(walk.dataset.walk);
  }

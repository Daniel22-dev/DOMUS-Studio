/* Dialog preparation and active-view bootstrap. Source fragment; bundled by esbuild. */
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
    if (window.matchMedia('(max-width: 1180px)').matches) {
      const activeTab = document.querySelector('.nav-btn.active');
      activeTab?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: state.uiPreferences?.reduceMotion ? 'auto' : 'smooth' });
    }
    if (state.currentTab === 'field') { checkSyncStatus(false); }
    if (state.currentTab === 'ai') { setupAiWorkspace(); setupAiStudioView(); }
    if (state.currentTab === 'photo') setupPhotoCanvas();
    if (state.currentTab === 'plan') setupPlanCanvas();
    if (state.currentTab === 'section') setupSectionCanvas();
    if (state.currentTab === 'model') setupModelCanvas();
    if (state.currentTab === 'presentation') setupWalkthrough();
  }

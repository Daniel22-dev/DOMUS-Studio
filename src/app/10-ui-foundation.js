/* Undo, notifications, validated dialogs and storage UI. Source fragment; assembled by scripts/build.mjs. */
  // pushPlanHistory is implemented by the premium fragment loaded later in the build.
  // undoPlanChange is implemented by the premium fragment loaded later in the build.
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const snap = (value, step = 10) => Math.round(value / step) * step;
  const parseNum = (value, fallback = 0) => {
    const normalized = String(value ?? '').trim().replace(/\s/g, '').replace(',', '.');
    if (!normalized) return fallback;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? parsed : fallback;
  };
  const round = (value, digits = 2) => Number(Number(value || 0).toFixed(digits));
  const money = (value) => `${Math.round(Number(value || 0)).toLocaleString('cs-CZ')} Kč`;
  const measure = (value, unit = 'm²') => `${Number(value || 0).toLocaleString('cs-CZ', { maximumFractionDigits: 2 })} ${unit}`;
  const formatDate = (value) => new Intl.DateTimeFormat('cs-CZ', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(value));
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[char]));

  function toast(message, type = '') {
    toastEl.textContent = message;
    toastEl.className = `toast show ${type}`;
    clearTimeout(toastEl._timer);
    toastEl._timer = setTimeout(() => { toastEl.className = 'toast'; }, 3200);
  }

  function setSaveState(status, error = '') {
    state.saveState = { status, error, at: status === 'saved' ? new Date().toISOString() : state.saveState.at };
    if (!saveStatusEl) return;
    saveStatusEl.className = `save-status ${status}`;
    if (status === 'saving') saveStatusEl.textContent = 'Ukládám…';
    else if (status === 'saved') saveStatusEl.textContent = `Uloženo ${new Intl.DateTimeFormat('cs-CZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date())}`;
    else if (status === 'error') saveStatusEl.textContent = 'Uložení selhalo';
    else saveStatusEl.textContent = 'Připraveno';
    saveStatusEl.title = error || 'Data se ukládají lokálně do tohoto zařízení.';
  }

  function setUndo(label, apply) {
    state.undo = { label, apply };
    if (undoBtn) { undoBtn.hidden = false; undoBtn.textContent = `Vrátit: ${label}`; }
  }

  async function undoLastChange() {
    const undo = state.undo;
    if (!undo) return;
    state.undo = null;
    if (undoBtn) undoBtn.hidden = true;
    try { await undo.apply(); toast(`Změna „${undo.label}“ byla vrácena.`); }
    catch (error) { console.error(error); toast('Poslední změnu se nepodařilo vrátit.', 'error'); }
  }

  function askValue({ title = 'Zadat hodnotu', label = 'Hodnota', value = '', help = '', inputMode = 'text', pattern = '', required = false, type = 'text', min = '', max = '', step = 'any' } = {}) {
    return new Promise((resolve) => {
      inputDialogTitle.textContent = title;
      inputDialogLabel.firstChild.textContent = label;
      inputDialogValue.value = value;
      inputDialogValue.type = type;
      inputDialogValue.inputMode = inputMode;
      inputDialogValue.pattern = pattern;
      inputDialogValue.min = min;
      inputDialogValue.max = max;
      inputDialogValue.step = step;
      inputDialogValue.required = required;
      inputDialogHelp.textContent = help;
      const onSubmit = (event) => {
        event.preventDefault();
        if (event.submitter?.value === 'cancel') { cleanup(); inputDialog.close('cancel'); resolve(null); return; }
        if (!inputForm.reportValidity()) return;
        const result = inputDialogValue.value;
        cleanup(); inputDialog.close('default'); resolve(result);
      };
      const onCancel = () => { cleanup(); resolve(null); };
      const cleanup = () => { inputForm.removeEventListener('submit', onSubmit); inputDialog.removeEventListener('cancel', onCancel); };
      inputForm.addEventListener('submit', onSubmit);
      inputDialog.addEventListener('cancel', onCancel, { once: true });
      inputDialog.showModal();
      queueMicrotask(() => { inputDialogValue.focus(); inputDialogValue.select(); });
    });
  }

  function askChoice({
    eyebrow = 'Potvrzení akce',
    title = 'Pokračovat?',
    message = '',
    acceptLabel = 'Potvrdit',
    cancelLabel = 'Zrušit',
    destructive = false,
  } = {}) {
    return new Promise((resolve) => {
      if (!confirmDialog || !confirmForm) { resolve(null); return; }
      if (confirmDialog.open) confirmDialog.close('dismiss');
      const previousFocus = document.activeElement;
      confirmDialogEyebrow.textContent = eyebrow;
      confirmDialogTitle.textContent = title;
      confirmDialogMessage.textContent = message;
      confirmAcceptBtn.textContent = acceptLabel;
      confirmCancelBtn.textContent = cancelLabel;
      confirmAcceptBtn.className = destructive ? 'btn btn-danger' : 'btn btn-primary';
      confirmDialog.dataset.tone = destructive ? 'danger' : 'default';
      const onClose = () => {
        const result = ['confirm', 'cancel'].includes(confirmDialog.returnValue) ? confirmDialog.returnValue : null;
        confirmDialog.removeEventListener('close', onClose);
        queueMicrotask(() => previousFocus?.focus?.());
        resolve(result);
      };
      confirmDialog.addEventListener('close', onClose, { once: true });
      confirmDialog.showModal();
      queueMicrotask(() => confirmAcceptBtn.focus());
    });
  }

  async function confirmAction(options = {}) {
    return (await askChoice(options)) === 'confirm';
  }

  const formatBytes = (bytes) => {
    const value = Number(bytes || 0);
    if (value < 1024) return `${value} B`;
    if (value < 1024 ** 2) return `${(value / 1024).toFixed(1)} kB`;
    if (value < 1024 ** 3) return `${(value / 1024 ** 2).toFixed(1)} MB`;
    return `${(value / 1024 ** 3).toFixed(2)} GB`;
  };

  async function showStorageDialog() {
    try {
      const [estimate, snapshots, trash] = await Promise.all([DomusDB.estimate(), DomusDB.listSnapshots(), DomusDB.listTrash()]);
      const quotaPercent = estimate.quota ? Math.round(estimate.usage / estimate.quota * 100) : 0;
      storageDialogContent.innerHTML = `
        <div class="storage-overview"><div><small>Využito prohlížečem</small><strong>${formatBytes(estimate.usage)}</strong></div><div><small>Dostupná kvóta</small><strong>${estimate.quota ? formatBytes(estimate.quota) : 'nezjištěna'}</strong></div><div><small>Velikost projektů po načtení</small><strong>${formatBytes(estimate.projectBytes)}</strong></div><div><small>Trvalé úložiště</small><strong>${estimate.persistent ? 'povoleno' : 'není potvrzeno'}</strong></div></div>
        ${estimate.quota ? `<div class="storage-meter"><span style="width:${Math.min(100, quotaPercent)}%"></span></div><p>Využití přibližně ${quotaPercent} % dostupné kvóty.</p>` : ''}
        <div class="storage-actions"><button type="button" class="btn btn-secondary" id="requestPersistenceBtn">Požádat o trvalé úložiště</button><button type="button" class="btn btn-secondary" id="storageExportBtn">Exportovat úplnou zálohu</button>${trash.length ? `<button type="button" class="btn btn-danger" id="emptyTrashBtn">Vysypat koš</button>` : ''}</div>
        <h3>Body obnovy</h3>${snapshots.length ? `<div class="storage-list">${snapshots.map((item) => `<article><div><strong>${escapeHtml(item.label)}</strong><small>${formatDateTime(item.createdAt)} · ${item.projectCount} projektů</small></div><button type="button" class="table-action" data-restore-snapshot="${escapeHtml(item.id)}">Obnovit</button></article>`).join('')}</div>` : '<div class="empty-mini">Zatím není vytvořen žádný bod obnovy.</div>'}
        <h3>Koš projektů</h3>${trash.length ? `<div class="storage-list">${trash.map((entry) => `<article><div><strong>${escapeHtml(entry.project?.name || 'Projekt')}</strong><small>Odstraněno ${formatDateTime(entry.deletedAt)}</small></div><button type="button" class="table-action" data-restore-trash="${escapeHtml(entry.id)}">Obnovit</button></article>`).join('')}</div>` : '<div class="empty-mini">Koš je prázdný.</div>'}
      `;
      storageDialogContent.querySelector('#requestPersistenceBtn')?.addEventListener('click', async () => { const granted = await DomusDB.requestPersistence(); toast(granted ? 'Trvalé úložiště bylo povoleno.' : 'Prohlížeč trvalé úložiště nepovolil.', granted ? '' : 'error'); showStorageDialog(); });
      storageDialogContent.querySelector('#storageExportBtn')?.addEventListener('click', exportBackup);
      storageDialogContent.querySelector('#emptyTrashBtn')?.addEventListener('click', async () => { if (!await confirmAction({ title: 'Trvale vyprázdnit koš?', message: 'Všechny projekty v koši budou nenávratně odstraněny.', acceptLabel: 'Vyprázdnit koš', destructive: true })) return; await DomusDB.emptyTrash(); toast('Koš byl vyprázdněn.'); showStorageDialog(); });
      storageDialogContent.querySelectorAll('[data-restore-snapshot]').forEach((button) => button.addEventListener('click', async () => {
        if (!await confirmAction({ title: 'Obnovit vybraný bod?', message: 'Současný stav bude před obnovou automaticky zazálohován.', acceptLabel: 'Obnovit bod' })) return;
        await DomusDB.createSnapshot(state.projects, 'Před obnovou staršího bodu');
        const projects = (await DomusDB.restoreSnapshot(button.dataset.restoreSnapshot)).map(ensureProjectV7);
        await DomusDB.replaceProjects(projects);
        state.projects = projects; state.currentProjectId = null; storageDialog.close(); render(); toast('Bod obnovy byl načten.');
      }));
      storageDialogContent.querySelectorAll('[data-restore-trash]').forEach((button) => button.addEventListener('click', async () => { await DomusDB.restoreTrash(button.dataset.restoreTrash); state.projects = (await DomusDB.getAll()).map(ensureProjectV7); storageDialog.close(); render(); toast('Projekt byl obnoven z koše.'); }));
      if (!storageDialog.open) storageDialog.showModal();
    } catch (error) { console.error(error); toast('Informace o úložišti nelze načíst.', 'error'); }
  }


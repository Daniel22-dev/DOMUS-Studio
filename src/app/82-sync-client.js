/* Authenticated LAN synchronization client. Source fragment; bundled by esbuild. */
  function syncAuthHeaders() {
    return state.syncStatus.token ? { Authorization: `Bearer ${state.syncStatus.token}` } : {};
  }

  function clearSyncToken() {
    state.syncStatus.token = '';
    state.syncStatus.tokenExpiresAt = '';
    state.syncStatus.paired = false;
    safeStorageRemove('domusSyncToken');
    safeStorageRemove('domusSyncTokenExpiresAt');
  }

  async function checkSyncStatus(showToast = false) {
    const before = JSON.stringify({ enabled: state.syncStatus.enabled, paired: state.syncStatus.paired, localClient: state.syncStatus.localClient, serverUrl: state.syncStatus.serverUrl, message: state.syncStatus.message });
    try {
      const response = await fetch('/api/sync/status', { cache: 'no-store', headers: syncAuthHeaders() });
      const payload = await response.json();
      state.syncStatus = {
        ...state.syncStatus,
        checked: true,
        enabled: !!payload.enabled,
        localClient: !!payload.localClient,
        paired: !!payload.paired || !!payload.localClient,
        pairingCode: payload.pairingCode || '',
        pairingExpiresAt: payload.pairingExpiresAt || '',
        serverUrl: payload.serverUrl || '',
        deviceName: payload.deviceName || '',
        message: payload.message || '',
      };
      if (payload.localClient && payload.enabled) {
        try { const devicesResponse = await fetch('/api/sync/devices', { cache: 'no-store' }); const devicesPayload = await devicesResponse.json(); state.syncStatus.devices = devicesPayload.devices || []; }
        catch { state.syncStatus.devices = []; }
      }
      if (!state.syncStatus.localClient && state.syncStatus.tokenExpiresAt && new Date(state.syncStatus.tokenExpiresAt) <= new Date()) clearSyncToken();
      if (showToast) toast(payload.enabled ? (state.syncStatus.paired ? 'Synchronizace je připravena.' : 'Server je dostupný; zařízení ještě spárujte.') : payload.message || 'Synchronizace není aktivní.', payload.enabled ? '' : 'error');
    } catch (error) {
      state.syncStatus = { ...state.syncStatus, checked: true, enabled: false, paired: false, message: 'Aplikace běží bez synchronizačního serveru.' };
      if (showToast) toast(state.syncStatus.message, 'error');
    }
    const after = JSON.stringify({ enabled: state.syncStatus.enabled, paired: state.syncStatus.paired, localClient: state.syncStatus.localClient, serverUrl: state.syncStatus.serverUrl, message: state.syncStatus.message });
    if (state.currentTab === 'field' && before !== after) render();
    return state.syncStatus;
  }

  async function pairSyncDevice(rawCode) {
    const code = String(rawCode || '').replace(/\D/g, '').slice(0, 6);
    if (!/^\d{6}$/.test(code)) return toast('Zadejte přesně šestimístný jednorázový kód.', 'error');
    try {
      const response = await fetch('/api/sync/pair', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, deviceName: `${navigator.platform || 'Zařízení'} · ${navigator.userAgentData?.platform || 'prohlížeč'}`.slice(0, 80) }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.ok || !payload.token) throw new Error(payload.error || 'Spárování se nezdařilo.');
      state.syncStatus.token = payload.token;
      state.syncStatus.tokenExpiresAt = payload.expiresAt || '';
      state.syncStatus.paired = true;
      safeStorageSet('domusSyncToken', payload.token);
      safeStorageSet('domusSyncTokenExpiresAt', payload.expiresAt || '');
      toast('Zařízení bylo bezpečně spárováno.');
      await checkSyncStatus(false);
      render();
    } catch (error) { toast(error.message || 'Spárování se nezdařilo.', 'error'); }
  }

  async function syncFetch(path, options = {}) {
    const response = await fetch(path, { ...options, headers: { ...syncAuthHeaders(), ...(options.headers || {}) } });
    let payload = {};
    try { payload = await response.json(); } catch { }
    if (response.status === 401) clearSyncToken();
    if (!response.ok || payload.ok === false) throw new Error(payload.error || 'Synchronizační požadavek selhal.');
    return payload;
  }

  async function pushCurrentProjectToSync(silent = false) {
    if (state.syncBusy) return;
    state.syncBusy = true;
    try {
      if (!state.syncStatus.checked) await checkSyncStatus(false);
      if (!state.syncStatus.enabled || (!state.syncStatus.localClient && !state.syncStatus.paired)) throw new Error('Zařízení není spárováno se synchronizačním serverem.');
      const project = DomusCore.secureProject(currentProject());
      await syncFetch('/api/sync/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ project }) });
      currentVariant(project).field.sync.lastPushAt = new Date().toISOString();
      await saveProject(project, true, true);
      if (!silent) toast('Projekt byl odeslán do lokální synchronizace.');
    } catch (error) { if (!silent) toast(error.message, 'error'); }
    finally { state.syncBusy = false; if (state.currentTab === 'field' && !silent) render(); }
  }

  async function pullSyncProject(projectId) {
    const payload = await syncFetch('/api/sync/pull', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ projectId }) });
    return ensureProjectV7(DomusCore.secureProject(payload.project));
  }
  // pullCurrentProjectFromSync is implemented by the premium fragment loaded later in the build.
  // importProjectsFromSync is implemented by the premium fragment loaded later in the build.

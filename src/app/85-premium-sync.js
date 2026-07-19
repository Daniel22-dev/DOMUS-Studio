/* Conflict-aware local-first synchronization. */
  async function mergeRemoteProject(local, remote, sourceLabel = 'synchronizace') {
    const result = DomusPremium.mergeProjects(local, remote);
    if (result.conflicts.length) {
      const approved = confirm(`Bylo nalezeno ${result.conflicts.length} souběžných změn. DOMUS je bezpečně sloučí po jednotlivých položkách a u každého konfliktu ponechá novější verzi. Pokračovat?`);
      if (!approved) return null;
    }
    const merged = ensureProjectV6(result.project);
    merged.syncMerge = { ...(merged.syncMerge||{}), source: sourceLabel, at: new Date().toISOString(), conflictCount: result.conflicts.length };
    return { project: merged, conflicts: result.conflicts };
  }

  async function pullCurrentProjectFromSync() {
    try {
      if (!state.syncStatus.checked) await checkSyncStatus(false);
      const local = currentProject(); const remote = await pullSyncProject(local.id);
      const result = await mergeRemoteProject(local, remote, 'ruční stažení'); if (!result) return;
      await DomusDB.createSnapshot(state.projects, `Před sloučením projektu ${local.name} ze synchronizace`);
      const index = state.projects.findIndex((item)=>item.id===result.project.id);
      if(index>=0) state.projects[index]=result.project; else state.projects.unshift(result.project);
      result.project.variants.forEach((variant)=>{variant.field.sync.lastPullAt=new Date().toISOString();});
      await DomusDB.put(result.project,{skipSnapshot:true}); state.currentProjectId=result.project.id;
      toast(result.conflicts.length?`Projekt sloučen. Vyřešeno ${result.conflicts.length} konfliktů.`:'Projekt byl bezpečně synchronizován.'); render();
    } catch(error){toast(error.message,'error');}
  }

  async function importProjectsFromSync() {
    try {
      await checkSyncStatus(false);
      if (!state.syncStatus.enabled || (!state.syncStatus.localClient && !state.syncStatus.paired)) throw new Error('Zařízení není spárováno se synchronizačním serverem.');
      const payload=await syncFetch('/api/sync/list',{cache:'no-store'}); if(!payload.projects?.length)return toast('Synchronizační úložiště je prázdné.','error');
      await DomusDB.createSnapshot(state.projects,'Před hromadným sloučením ze synchronizace'); let imported=0,conflicts=0;
      for(const meta of payload.projects){const remote=await pullSyncProject(meta.id),index=state.projects.findIndex(item=>item.id===remote.id);if(index<0){state.projects.unshift(remote);await DomusDB.put(remote,{skipSnapshot:true});imported++;continue;}const result=await mergeRemoteProject(state.projects[index],remote,'hromadná synchronizace');if(!result)continue;state.projects[index]=result.project;await DomusDB.put(result.project,{skipSnapshot:true});imported++;conflicts+=result.conflicts.length;}
      toast(`Synchronizováno ${imported} projektů${conflicts?` · vyřešeno ${conflicts} konfliktů`:''}.`);render();
    } catch(error){toast(error.message,'error');}
  }

/* Mobile field capture, measurements, photos and spatial scan import. Source fragment; bundled by esbuild. */
  async function addFieldMeasurement() {
    const label = document.getElementById('fieldMeasureLabel')?.value.trim();
    const value = document.getElementById('fieldMeasureValue')?.value.trim();
    if (!label || !value) return toast('Doplň název i hodnotu rozměru.', 'error');
    const project = currentProject(); const session = currentFieldSession(currentVariant(project));
    session.measurements.push({ id: uid('measure'), label, value: value.replace(',', '.'), unit: document.getElementById('fieldMeasureUnit').value, category: document.getElementById('fieldMeasureCategory').value, targetId: document.getElementById('fieldMeasureTarget')?.value || '', verified: false, source: 'estimate', confidence: 40, note: '', createdAt: new Date().toISOString() });
    session.updatedAt = new Date().toISOString(); await saveProject(project); toast('Rozměr byl uložen.'); render();
  }

  async function updateFieldPhoto(id, key, value) {
    const project = currentProject(); const photo = currentFieldSession(currentVariant(project)).photos.find((item) => item.id === id); if (!photo) return; photo[key] = value; await saveProject(project);
  }

  async function importFieldPhotos() {
    const files = Array.from(fieldPhotoInput.files || []); fieldPhotoInput.value = ''; if (!files.length) return;
    const project = currentProject(); const session = currentFieldSession(currentVariant(project));
    for (const file of files.slice(0, 12)) {
      try { const dataUrl = await resizeImage(file, 1800, 1400, 0.82); session.photos.push({ id: uid('fieldphoto'), name: file.name.replace(/\.[^.]+$/, ''), note: '', dataUrl, capturedAt: new Date().toISOString(), source: file.type || 'image' }); } catch (error) { console.warn(error); }
    }
    session.updatedAt = new Date().toISOString(); await saveProject(project); toast(`${Math.min(files.length, 12)} fotografií bylo uloženo do zaměření.`); render();
  }

  async function saveFieldLocation() {
    if (!navigator.geolocation) return toast('Zařízení neposkytuje geolokaci.', 'error');
    navigator.geolocation.getCurrentPosition(async (position) => { const project = currentProject(); const session = currentFieldSession(currentVariant(project)); session.location = { latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy, capturedAt: new Date().toISOString() }; await saveProject(project); toast('Poloha byla uložena pouze do projektu.'); render(); }, (error) => toast(error.message || 'Poloha nebyla povolena.', 'error'), { enableHighAccuracy: true, timeout: 12000 });
  }

  function parseRoomPlanJson(value) {
    const root = value?.capturedRoom || value?.room || value;
    const walls = Array.isArray(root?.walls) ? root.walls : [];
    const doors = Array.isArray(root?.doors) ? root.doors : [];
    const windows = Array.isArray(root?.windows) ? root.windows : [];
    const objects = Array.isArray(root?.objects) ? root.objects : [];
    const parsedWalls = [];
    const dimension = (item, index, fallback = 0) => { const d = item?.dimensions || item?.dimension || []; const v = Array.isArray(d) ? Number(d[index]) : Number(d?.[index === 0 ? 'x' : index === 1 ? 'y' : 'z']); return Number.isFinite(v) ? v : fallback; };
    const transform = (item) => { const raw = item?.transform; if (Array.isArray(raw) && raw.length === 16) return { x: Number(raw[12]) || 0, z: Number(raw[14]) || 0, yaw: Math.atan2(Number(raw[8]) || 0, Number(raw[0]) || 1) }; if (Array.isArray(raw) && Array.isArray(raw[0])) return { x: Number(raw[3]?.[0] ?? raw[0]?.[3]) || 0, z: Number(raw[3]?.[2] ?? raw[2]?.[3]) || 0, yaw: Math.atan2(Number(raw[2]?.[0]) || 0, Number(raw[0]?.[0]) || 1) }; const center = item?.center || item?.position || {}; return { x: Number(center.x ?? center[0]) || 0, z: Number(center.z ?? center[2]) || 0, yaw: Number(item?.yaw) || 0 }; };
    walls.forEach((item, index) => { const width = dimension(item, 0, 1); const height = dimension(item, 1, 2.5); const t = transform(item); const dx = Math.cos(t.yaw) * width / 2; const dz = Math.sin(t.yaw) * width / 2; parsedWalls.push({ id: item.identifier || `wall-${index}`, x1: t.x - dx, y1: t.z - dz, x2: t.x + dx, y2: t.z + dz, width, height }); });
    return { walls: parsedWalls, counts: { walls: walls.length, doors: doors.length, windows: windows.length, objects: objects.length } };
  }

  async function importScanFile() {
    const file = scanInput.files?.[0]; scanInput.value = ''; if (!file) return;
    const ext = (file.name.split('.').pop() || '').toLowerCase(); const project = currentProject(); const session = currentFieldSession(currentVariant(project));
    const scan = { id: uid('scan'), name: file.name, format: ext || 'soubor', size: file.size, importedAt: new Date().toISOString(), summary: 'Externí prostorový podklad; původní soubor zůstává mimo zálohu DOMUS.', roomPlan: null };
    if (ext === 'json' && file.size < 20 * 1024 * 1024) {
      try { const data = JSON.parse(await file.text()); scan.roomPlan = parseRoomPlanJson(data); const c = scan.roomPlan.counts; scan.summary = `Datový sken: ${c.walls} stěn, ${c.doors} dveří, ${c.windows} oken a ${c.objects} objektů. Geometrii je nutné ověřit.`; } catch (error) { scan.summary = `JSON se nepodařilo rozpoznat jako RoomPlan: ${error.message}`; }
    }
    session.scans.push(scan); session.updatedAt = new Date().toISOString(); await saveProject(project); toast('Prostorový sken byl zaevidován.'); render();
  }

  async function applyRoomPlanScan(id) {
    const project = currentProject(); const variant = currentVariant(project); const scan = currentFieldSession(variant).scans.find((item) => item.id === id); const walls = scan?.roomPlan?.walls || [];
    if (!walls.length) return toast('Sken neobsahuje převoditelné stěny.', 'error');
    if (variant.plan.walls.length && !(await confirmAction({ title: 'Použít pracovní obrys z RoomPlan?', message: 'Současné stěny budou nahrazeny neověřenou geometrií ze skenu. Rozměry je nutné před realizací fyzicky ověřit.', acceptLabel: 'Nahradit stěny', destructive: true }))) return;
    pushPlanHistory(project, variant);
    const xs = walls.flatMap((item) => [item.x1, item.x2]); const ys = walls.flatMap((item) => [item.y1, item.y2]); const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys); const width = Math.max(0.1, maxX - minX), depth = Math.max(0.1, maxY - minY); const scale = variant.plan.scale;
    const uniformScale = Math.min(scale, 760 / width, 500 / depth);
    const offsetX = 140 + (760 - width * uniformScale) / 2;
    const offsetY = 100 + (500 - depth * uniformScale) / 2;
    variant.plan.walls = walls.map((item) => ({ id: uid('wall'), x1: offsetX + (item.x1 - minX) * uniformScale, y1: offsetY + (item.y1 - minY) * uniformScale, x2: offsetX + (item.x2 - minX) * uniformScale, y2: offsetY + (item.y2 - minY) * uniformScale, layer: 'architecture', source: 'roomplan-unverified' }));
    variant.plan.scale = uniformScale;
    variant.plan.wallHeight = round(Math.max(...walls.map((item) => item.height || 2.5)), 2); fitPlanToCanvas(variant.plan); await saveProject(project); state.currentTab = 'plan'; toast('Pracovní stěny byly převedeny do 2D. Všechny rozměry ověř.'); render();
  }

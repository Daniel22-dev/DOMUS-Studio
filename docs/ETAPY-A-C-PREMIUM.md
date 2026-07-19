# Realizace prémiových etap A–C

## Etapa A – prémiový základ

### Dokončeno

- onboarding a projektové šablony,
- vlastní značka a logo,
- světlý/tmavý režim, kompaktní zobrazení a omezení animací,
- DOMUS Report Studio,
- revize výstupů,
- Test Lab rozšířený o prémiové funkce,
- CI pro Windows a Linux,
- Tauri desktopový projekt,
- automatizovaný release a updater workflow.

## Etapa B – návrhový editor

### Dokončeno

- Precision 2D,
- magnetické body a ortogonální kreslení,
- vrstvy a uzamykání,
- vícenásobný výběr,
- duplikování, zrcadlení a zarovnání,
- Undo/Redo,
- parametrická knihovna a vlastní šablony,
- automatické kóty,
- DXF export.

## Etapa C – prémiový produkt

### Dokončeno

- RealSpace 3D přes Three.js,
- perspektivní a ortografická kamera,
- stíny, řez, strop, popisky a fullscreen,
- PBR vlastnosti materiálů,
- PNG a GLB export,
- položkové slučování synchronizace,
- výkonnostní profil a Web Worker,
- Tauri aktualizační most,
- multiplatformní release workflow.

## Záměrná omezení

- DXF obsahuje základní 2D geometrii, nikoliv plný BIM model.
- 3D model je generován z půdorysu a není náhradou profesionálního statického nebo realizačního modelu.
- Automatický podpis instalačních souborů vyžaduje soukromé klíče a komerční certifikáty vlastníka repozitáře.
- Plný Tauri instalační balíček se sestavuje na GitHub runneru nebo na počítači s Rustem a systémovými závislostmi.

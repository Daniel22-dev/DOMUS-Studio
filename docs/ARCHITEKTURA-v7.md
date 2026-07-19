# Architektura DOMUS Studio Premium v7

## Princip

DOMUS používá architekturu **modulární zdroj + generovaný runtime + desktopový obal**. Zdroj je přehledný pro GitHub, zatímco runtime zůstává použitelný i bez Node.js.

## Vrstvy

### `src/core`

1. `domus-core.js` – validace, sanitace a datové invarianty,
2. `db.js` – IndexedDB, přílohy, snapshoty a koš,
3. `domus-audit.js` – geometrie a DOMUS Verify,
4. `domus-backup.js` – ZIP záloha a integrita,
5. `domus-diagnostics.js` – Test Lab,
6. `domus-premium.js` – DXF, slučování, kalendář záruk a metriky,
7. `domus-performance.js` – výkon, Web Worker a virtualizace.

### `src/app`

Aplikace je rozdělena do 21 modulů podle odpovědnosti: shell, UI, model projektu, onboarding, dashboard, zaměření, Precision 2D, Report Studio, akce, AI, synchronizace, canvas, RealSpace 3D, zálohy a desktopový updater.

### `workers`

`project-metrics-worker.js` počítá složitost větších projektů mimo hlavní vlákno.

### `vendor`

Lokální runtime závislosti Three.js a Tauri API. Aplikace není při běhu závislá na CDN.

### `src-tauri`

Rust/Tauri obal pro instalační balíčky, aktualizace a restart po aktualizaci. Oprávnění jsou omezená capability souborem.

## Build

`scripts/build.mjs`:

1. spojí aplikační fragmenty do `app.js`,
2. zkopíruje základní jádra,
3. vytvoří distribuční `dist/`,
4. vytvoří build manifest.

Generované soubory se commitují, aby zůstal zachován jednoduchý ZIP provoz.

## Datový model

- aktuální schéma: 7,
- společná data projektu a variantní návrhová data jsou oddělena,
- binární přílohy jsou uloženy samostatně,
- synchronizace slučuje kolekce po položkách,
- změny mají `updatedAt` pro rozhodování konfliktů,
- import starších dat probíhá přes verzované normalizační kroky.

## 2D a 3D

Precision 2D zůstává autoritativním geometrickým zdrojem. RealSpace 3D model z něj vytváří Three.js scénu. To zabraňuje rozcházení dvou samostatných modelů.

## Distribuce

- web/local-first ZIP,
- PWA,
- Tauri desktop,
- GitHub Release s updater artefakty.

## Testovací vrstvy

1. Test Lab v aplikaci,
2. unit testy doménových jader,
3. statické testy HTML, akcí a repozitáře,
4. PowerShell bezpečnostní testy,
5. browser smoke test 16 pracovních částí,
6. HTTP test service workeru a prémiových modulů,
7. IndexedDB round-trip,
8. Windows/Linux Rust validace v GitHub CI,
9. CodeQL a Dependabot.

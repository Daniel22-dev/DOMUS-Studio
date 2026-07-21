# Architektura DOMUS Studio Premium v7.2

## Princip

DOMUS používá architekturu **modulární zdroj + esbuild runtime + local-first data + desktopový obal**. Zdroj zůstává přehledný pro vývoj, zatímco uživatelský ZIP obsahuje hotový runtime použitelný bez Node.js.

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

Aplikace je rozdělena do 27 fragmentů podle odpovědnosti. Samostatné soubory mají zejména stav a shell, UI, projektový model, renderery, globální události, delegaci událostí, lokální vazby aktivního pohledu, action router, dialogy, prémiové akce, AI, terénní zaměření, synchronizaci, 2D canvas, 3D scénu, zálohy a desktopový updater.

Fragmenty sdílejí jednu uzavřenou aplikační oblast. Build při jejich spojení přidává hranice `BEGIN SOURCE` / `END SOURCE` a do manifestu zapisuje rozsahy řádků, aby byla chyba v generovaném runtime dohledatelná zpět ke zdroji.

### `src/styles`

CSS je rozděleno na:

- základní tokeny a layout,
- historické funkční vrstvy vzhledu,
- prémiové komponenty 7.1,
- výkonnostní pravidla 7.2.

`main.css` je jediný vstup. esbuild vytvoří čitelný `styles.css` a minifikovaný `dist/styles.css`, oba se source mapou.

### `workers`

`project-metrics-worker.js` počítá náročnější metriky mimo hlavní UI vlákno.

### `vendor`

Lokální runtime závislosti Three.js a Tauri API. 3D knihovna není součástí hlavního balíku a načítá se až při otevření 3D části. Aplikace není při běhu závislá na CDN.

### `src-tauri`

Rust/Tauri obal pro instalační balíčky, aktualizace a restart po aktualizaci. Oprávnění jsou omezená capability souborem.

## Build

`scripts/build.mjs` používá esbuild a podporuje tři režimy:

- `npm run build` – vývojový runtime i produkční distribuce,
- `npm run build:dev` – pouze čitelný runtime v kořeni,
- `npm run build:prod` – pouze minifikovaný `dist/`.

Build:

1. seřadí zdrojové fragmenty deterministicky,
2. vytvoří generovaný aplikační vstup s mapou fragmentů,
3. připojí sedm základních jader,
4. vytvoří jediný JavaScriptový runtime balík,
5. sestaví rozdělené CSS,
6. vytvoří externí source mapy,
7. vytvoří minifikovanou produkční distribuci,
8. zapíše reprodukovatelný manifest s SHA-256 otiskem zdroje.

Kořenový runtime i `dist/` jsou generované. `npm run check:generated` ověřuje, že odpovídají zdrojům.

## Události a renderování

- Statické ovládací prvky se navazují jednou při inicializaci.
- Dynamické akce používají delegaci přes `#app` a `closest('[data-action]')`.
- Action router je oddělený od navazování událostí.
- Filtry obnovují pouze označenou výsledkovou oblast.
- Při filtrování se zachová vstup, fokus, kurzor i kořen aplikace.
- Vazby, které skutečně závisí na canvasu nebo životním cyklu konkrétního pohledu, zůstávají lokální.

## Datový model

- aktuální schéma: 7,
- společná data projektu a variantní návrhová data jsou oddělena,
- binární přílohy jsou uloženy samostatně,
- synchronizace slučuje kolekce po položkách,
- změny mají `updatedAt` pro rozhodování konfliktů,
- import starších dat probíhá přes verzované normalizační kroky.

Technická verze 7.2 datový formát nemění.

## 2D a 3D

Precision 2D je autoritativním geometrickým zdrojem. RealSpace 3D z něj vytváří Three.js scénu, takže se nerozcházejí dva samostatné modely. Životní cyklus 3D uklízí geometrii, materiály, textury, ovládání, renderer i WebGL kontext.

## Distribuce

- web/local-first ZIP,
- PWA,
- Tauri desktop,
- GitHub Release s updater artefakty.

## Ochranné architektonické testy

1. kontrola duplicitních pojmenovaných funkcí,
2. kontrola jediného runtime balíku,
3. kontrola source map a produkční minifikace,
4. kontrola mapy fragmentů v build manifestu,
5. kontrola delegovaných akcí,
6. kontrola cílených výsledkových oblastí,
7. statická shoda `data-action` a handlerů,
8. browser ověření, že filtr nezahodí kořen aplikace ani vstup,
9. `check:generated` s deterministickým manifestem,
10. Windows/Linux Rust validace v GitHub CI.

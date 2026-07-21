# DOMUS Studio Premium v7.3.0

DOMUS Studio je local-first projektové centrum pro stavební, technické, interiérové a zahradní projekty. Verze 7.3 zachovává datové schéma 7 i technickou architekturu verze 7.2 a doplňuje tři propojené funkce: AI vizualizátor reálných fotografií, projektového asistenta s potvrzovanými změnami a úplný uživatelský manuál přímo v aplikaci i jako samostatný dokument.

## Co aplikace nabízí

### Prémiový produktový základ

- onboarding a projektové šablony,
- jednotný světlý a tmavý designový systém,
- responzivní desktopové, tabletové a mobilní rozhraní,
- vlastní značka a profesionální výstupy,
- DOMUS Report Studio,
- DOMUS AI Studio s analýzou, vizualizátorem a asistentem,
- vestavěný prohledávatelný manuál,
- vestavěný Test Lab,
- PWA a desktopový obal Tauri.

### DOMUS Precision 2D

- magnetická mřížka, koncové body a pravé úhly,
- přesné vrstvy, viditelnost a uzamykání,
- vícenásobný výběr, duplikování, zrcadlení a zarovnávání,
- Undo/Redo,
- parametrická a uživatelská knihovna,
- automatické kóty,
- export DXF.

### DOMUS RealSpace 3D

- skutečná Three.js WebGL scéna,
- perspektivní a ortografická kamera,
- stíny, řezy a popisky,
- PBR vlastnosti materiálů,
- režim celé obrazovky,
- export PNG a GLB.

### Projektová dokumentace

- fotografie a terénní zaměření,
- materiály, rozpočet a výměry,
- stavební deník, pasport a záruky,
- DOMUS Verify,
- nabídky dodavatelům,
- ZIP zálohy s kontrolou integrity,
- lokální a mobilní synchronizace.


### DOMUS AI Studio 7.3

- **Analýza fotografií** rozpoznává viditelné prvky, rizika a rozměry, které je nutné ověřit.
- **AI vizualizátor** upravuje reálnou fotografii podle zadání „zachovat / odstranit / přidat“ a vytváří 1–3 koncepční varianty.
- Vybraný výsledek lze porovnávat s původním snímkem pomocí posuvníku „před / po“ a uložit do galerie projektu.
- **Projektový asistent** vede chat nad strukturou projektu, ale změny pouze navrhne. Každý zásah se zobrazí v kontrolním seznamu a provede se až po výslovném potvrzení.
- Provedený balík změn lze bezprostředně vrátit.
- AI klíč zůstává v lokálním serveru a není součástí projektu ani zálohy.

### Vestavěný manuál

Nová karta **Nápověda → Manuál** obsahuje 17 prohledávatelných kapitol. Samostatné soubory `MANUAL-DOMUS-STUDIO-v7.3.html` a `MANUAL-DOMUS-STUDIO-v7.3.md` pokrývají celý pracovní postup od založení projektu přes zaměření, AI Studio, 2D/3D, materiály a rozpočet až po realizaci, pasport a zálohy.

## Technická modernizace 7.2

### Řízený build

Zdroj se sestavuje přes **esbuild**. Vývojová verze zůstává čitelná a produkční verze je minifikovaná. Obě mají source mapy.

```bash
npm run build       # vývojový runtime + produkční dist
npm run build:dev   # pouze čitelný vývojový runtime
npm run build:prod  # pouze minifikovaný dist
```

Aplikace v prohlížeči načítá pouze `theme-init.js` a jediný balík `app.js`. Three.js zůstává oddělený a načítá se dynamicky až při otevření 3D části.

### Zdrojová struktura

- `src/app/` – 29 aplikačních fragmentů rozdělených podle odpovědnosti,
- `src/core/` – 7 doménových a infrastrukturních jader,
- `src/styles/` – základ, etapy vzhledu, komponenty a výkonnostní pravidla,
- `src/generated/` – automaticky vytvořený vstup pro esbuild,
- `workers/` – výpočty mimo hlavní UI vlákno,
- `src-tauri/` – desktopová aplikace,
- `tests/` – unit, build, architektonické, statické, PowerShell a browser testy.

`build-manifest.json` obsahuje verzi, obsahový SHA-256 otisk a mapu řádků generovaného zdroje zpět na jednotlivé fragmenty. Build je díky tomu reprodukovatelný a diagnostika zůstává dohledatelná.

### Výkon rozhraní

- akce dynamického rozhraní používají jeden delegovaný listener na `#app`,
- filtry projektů, materiálů, rozpočtu, kontroly, deníku a knihovny mění pouze dotčený seznam,
- při psaní se nezahazuje celé DOM ani aktivní vstup,
- dlouhé sekce používají bezpečné CSS containment a `content-visibility`,
- produkční JavaScript je minifikovaný, zatímco source mapy zůstávají pro diagnostiku.

## Test Lab přímo v aplikaci

Test Lab je dostupný v horní liště a na mobilu v nabídce dalších akcí. Kontroluje mimo jiné:

- release metadata a povinné moduly,
- action router a dialogy,
- bezpečnost importu a exportu,
- migrace a datové invarianty,
- DOMUS Verify,
- ZIP zálohy a IndexedDB,
- DXF export a synchronizační slučování,
- výkonnostní profil,
- WebGL, PWA, manifest a ikony,
- volitelně AI a LAN synchronizaci.

Výsledek používá stavy `PASS`, `WARN`, `FAIL` a `SKIP`. Protokol lze stáhnout jako TXT.

## Běžné spuštění ve Windows

1. Rozbalte ZIP do nové složky.
2. Spusťte `Spustit-DOMUS-Studio.bat`.
3. Aplikace se otevře na lokální adrese.
4. Při prvním použití otevřete **Úložiště a obnova** a vytvořte DOMUS ZIP zálohu.

Nouzový soubor `Otevrit-bez-serveru.bat` spustí omezený režim bez lokálního serveru. V něm nejsou dostupné serverové funkce, LAN synchronizace ani plná PWA diagnostika.

## Přechod ze starší verze

1. Ve starší verzi vytvořte zálohu.
2. Verzi 7.3 rozbalte do nové složky; původní instalaci nemažte.
3. Spusťte verzi 7.3 a zvolte **Import zálohy**.
4. Import data ověří, vytvoří bod obnovy a teprve potom je uloží.
5. Po kontrole vytvořte novou `.domus.zip` zálohu.

Datové schéma zůstává `schemaVersion 7`, takže technická modernizace nevyžaduje migraci projektů.

## Bezpečnost a data

- projekty, přílohy, snapshoty a koš jsou oddělené v IndexedDB,
- import používá validaci, velikostní limity a ochranu proti aktivnímu obsahu,
- záloha obsahuje manifest, samostatné přílohy a kontrolní otisky,
- mobilní párování používá jednorázový kód a následný token,
- server poskytuje pouze povolené runtime soubory,
- AI klíče a synchronizační data nejsou součástí webového adresáře ani zálohy,
- obrazový endpoint je dostupný pouze lokálně a má samostatný limit požadavků,
- asistent přijímá jen uzavřený seznam povolených projektových akcí,
- desktopová konfigurace používá restriktivní Content Security Policy.

Záloha může obsahovat citlivé informace o objektu. Uchovávejte ji jako důvěrný soubor.

## Kontrola kvality

```bash
npm run analyze:architecture # kolize funkcí, runtime a architektonické invarianty
npm run test:unit            # doménová jádra + build výstupy
npm run test:static          # HTML, akce, soubory a PWA
npm run test:powershell      # whitelist a serverová bezpečnost
npm run test:browser         # 17 částí aplikace, AI Studio, manuál, tablet, mobil a cílené renderování
npm run test:all             # všechny dostupné testy
npm run check:generated      # reprodukovatelnost generovaných souborů
```

GitHub Actions navíc provádějí Rust/Tauri validaci na Windows a Linuxu, CodeQL a audit závislostí.

## Důležité dokumenty

- `NOVINKY-VERZE-7.3.html` – přehled AI Studia a nového manuálu,
- `MANUAL-DOMUS-STUDIO-v7.3.html` – kompletní manuál pro čtení a tisk,
- `MANUAL-DOMUS-STUDIO-v7.3.md` – textová verze manuálu,
- `docs/AI-STUDIO-A-MANUAL-v7.3.md` – technická dokumentace nové etapy,
- `NOVINKY-VERZE-7.2.html` – uživatelský přehled technické modernizace,
- `docs/TECHNICKA-ETAPA-v7.2.md` – podrobný technický audit a provedené změny,
- `docs/ARCHITEKTURA-v7.md` – aktuální architektura,
- `docs/TEST-LAB.md` – vestavěné testy,
- `docs/DESKTOP-RELEASE.md` – instalátory, aktualizace a podpis,
- `FINALNI-OVERENI-v7.txt` – výsledky závěrečné kontroly,
- `CONTRIBUTING.md` – pravidla bezpečného vývoje.

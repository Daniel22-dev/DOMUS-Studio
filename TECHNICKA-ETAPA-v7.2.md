# DOMUS Studio Premium 7.2 – technická modernizace

**Datum:** 21. 7. 2026  
**Výsledná verze:** 7.2.0  
**Datové schéma:** 7 beze změny

## Manažerský verdikt

Technická etapa měla smysl. Verze 7.1 už byla funkčně i vizuálně kvalitní, ale další rozšiřování by postupně zvyšovalo riziko kolizí, obtížné diagnostiky a pomalých reakcí u velkých projektů. Verze 7.2 nepřepisuje aplikaci ani nemění data. Zavádí ochrannou infrastrukturu, díky níž lze DOMUS bezpečněji rozvíjet jako dlouhodobý produkt.

Největší přínosy:

- jeden kontrolovaný runtime místo ručního pořadí desítek skriptů,
- reprodukovatelný vývojový a produkční build,
- přesnější dohledání chyb pomocí source map a mapy fragmentů,
- menší produkční balík,
- méně práce při každé interakci s filtrem,
- méně listenerů a méně opakovaného navazování,
- přehlednější zdrojové soubory,
- testy, které nové architektonické vlastnosti hlídají do budoucna.

## Nálezy před změnou

### 1. Křehké sestavení podle pořadí

Aplikační fragmenty sdílely společný scope a výsledný runtime vznikal prostým spojením. Fungovalo to, ale správnost závisela na pořadí a případná shoda názvů mohla jednu funkci tiše přepsat.

### 2. Dvojitý modul výkonu

`domus-performance.js` obsahoval identickou implementaci dvakrát. Aktivní chování se nezměnilo, protože druhá kopie přepsala první stejnými hodnotami, ale soubor byl zbytečně větší a hůře auditovatelný.

### 3. Příliš široké překreslování při filtrování

Vyhledávání v několika částech obnovovalo větší část aplikace, než bylo nutné. U malého projektu to nebylo zásadní, ale u velkých dat hrozilo sekání, zbytečná práce prohlížeče a složité obnovování fokusu.

### 4. Opakované navazování dynamických událostí

Po renderu se znovu procházely dynamické prvky a přidávaly se jednotlivé handlery. Nešlo o potvrzený únik posluchačů, ale o zbytečnou práci a rozptýlenou logiku.

### 5. Velké soubory s více odpovědnostmi

Globální události, action router, dialogy, AI, terénní vstupy a synchronizace byly soustředěné do příliš širokých fragmentů. Úprava jedné oblasti proto vyžadovala větší opatrnost.

### 6. Smíšený CSS zdroj

Výsledný stylesheet fungoval, ale zdroj nebyl rozdělený podle systému a komponent. To komplikovalo další údržbu a výkonnostní ladění.

## Provedené změny

### Esbuild a jeden runtime

- přidán esbuild,
- vytvořen generovaný vstup pro sedm jader a aplikační zdroj,
- `index.html` načítá pouze `theme-init.js` a `app.js`,
- Three.js zůstává externí a načítá se dynamicky,
- přidán čitelný vývojový build,
- přidán minifikovaný produkční build,
- přidány externí source mapy JavaScriptu i CSS.

Výsledek při závěrečné kontrole:

- vývojový JavaScript: přibližně 482 kB,
- produkční JavaScript: přibližně 309 kB,
- zmenšení přibližně o 36 %.

### Reprodukovatelný manifest

`build-manifest.json` už neobsahuje proměnlivý čas, který by při každém sestavení vytvářel rozdíl. Obsahuje:

- verzi,
- datové schéma,
- SHA-256 otisk zdrojů,
- seznam jader a fragmentů,
- rozsahy řádků fragmentů v generovaném zdroji,
- seznam výstupů.

`npm run check:generated` nyní hlídá také JavaScriptovou a CSS source mapu, stylesheet a manifest.

### Oddělené build režimy

- `npm run build` – oba výstupy,
- `npm run build:dev` – pouze vývojový runtime,
- `npm run build:prod` – pouze produkční distribuce.

### Delegace událostí

Dynamické akce používají jedinou delegovanou vrstvu na `#app`. Událost se směruje podle nejbližšího prvku s `data-action`. Globální ovládání, lokální vazby aktivního pohledu, action router a dialogy jsou oddělené do samostatných fragmentů.

### Cílené aktualizace výsledků

Samostatné výsledkové oblasti mají:

- projekty,
- materiály,
- rozpočet,
- kontrola,
- stavební deník,
- knihovna.

Při psaní do filtru se mění pouze daná oblast. Kořen aplikace ani vstupní pole se nezahazují. Browser test ověřuje identitu DOM uzlů i funkčnost delegovaných akcí po výměně výsledků.

### Rozdělení zdrojů

Události byly rozděleny na:

- globální ovládání,
- delegaci,
- lokální vazby vykresleného pohledu,
- action router,
- dialogy a aktivní pohled,
- prémiové akce.

AI, terénní zaměření a synchronizační klient jsou nyní také samostatné fragmenty. Celkem aplikace používá 27 aplikačních fragmentů a 7 jader.

### Rozdělení CSS

CSS má samostatný zdrojový strom a jeden vstup `main.css`. Přidána byla bezpečná pravidla `content-visibility` a containment pro dlouhé sekce. Build vytváří čitelnou i minifikovanou podobu se source mapou.

### Architektonický audit

Nový skript kontroluje:

- duplicitní pojmenované funkce,
- dvojité vložení výkonnostního modulu,
- jediný runtime balík,
- přítomnost source map,
- rozdělené CSS,
- delegované akce,
- cílené výsledkové oblasti,
- esbuild v manifestu.

## Co se nezměnilo

- datové schéma,
- formát záloh,
- IndexedDB struktura,
- výpočty,
- uživatelské projekty,
- vzhled a ovládací logika pracovních nástrojů,
- kompatibilita starších projektů.

## Závěrečné ověření

Úspěšně prošlo:

- esbuild vývojové i produkční sestavení,
- architektonický audit: 27 fragmentů, 233 pojmenovaných funkcí, jeden runtime,
- doménové a premium unit testy,
- Three.js r185 test,
- build output test,
- statická kontrola 105 akcí a 93 HTML ID,
- PowerShell bezpečnostní kontrola,
- browser test všech 16 částí,
- tablet 1024 px bez horizontálního přetékání,
- telefon 390 px bez horizontálního přetékání,
- cílené filtrování bez výměny kořene a vstupu,
- `npm audit --omit=dev`: 0 zranitelností,
- reprodukovatelnost generovaných souborů.

V místním izolovaném Chromiu byly přeskočeny dva doplňkové scénáře: loopback HTTP smoke a vložený IndexedDB test. Zůstávají aktivní v GitHub CI. Rust/Tauri `cargo check` nebylo možné místně spustit, protože prostředí neobsahuje Rust/Cargo; CI jej má připravený pro Windows i Linux.

## Hodnocení po etapě

| Oblast | Stav 7.1 | Stav 7.2 |
|---|---:|---:|
| Vzhled a UX | 9/10 | 9/10 |
| Funkční rozsah | 9/10 | 9/10 |
| Výkon běžných filtrů | 7,5/10 | 9/10 |
| Diagnostika chyb | 7/10 | 9/10 |
| Reprodukovatelnost buildu | 7/10 | 9,5/10 |
| Technická udržitelnost | 7,5/10 | 9/10 |
| Připravenost na další růst | 7/10 | 9/10 |

## Verdikt

DOMUS 7.2 je technicky výrazně profesionálnější produkt. Uživatel na první pohled neuvidí dramaticky jiné obrazovky, ale aplikace reaguje úsporněji, vývojové chyby se lépe dohledávají a budoucí rozšiřování je podstatně méně rizikové. Modernizace byla provedena bez nebezpečného kompletního přepisu.

# DOMUS Studio Premium v7.3 — AI Studio a uživatelský manuál

## Cíl etapy

Verze 7.3 propojuje fotografii skutečného stavu s návrhem projektu. Přidává obrazovou editaci reálného snímku, konverzační projektový asistent a úplný návod přímo v aplikaci. Datové schéma projektu zůstává ve verzi 7, takže stávající projekty nevyžadují migraci.

## 1. AI vizualizátor

Vizualizátor pracuje s vybranou reálnou fotografií projektu. Uživatel odděleně zadává:

- hlavní záměr,
- prvky, které se nesmějí změnit,
- prvky k odstranění,
- prvky nebo materiály k doplnění,
- styl, kvalitu, formát a počet variant.

Server odešle obrázek jako datovou URL na obrazový editační endpoint. Používá vysokou věrnost vstupnímu snímku a výchozí model `gpt-image-2`. Výsledek se vrací jako obrazová data a uloží se do galerie konkrétní varianty projektu.

### Bezpečnostní a produktová omezení

- endpoint `/api/image` je dostupný pouze z lokálního serveru;
- požadavky jsou omezené na 12 za hodinu;
- tělo požadavku má velikostní limit;
- API klíč zůstává mimo webový projekt;
- galerie má limit osmi uložených generací;
- vizualizace je koncepční návrh, nikoli přesné měření nebo projektová dokumentace;
- prvky označené jako zachované jsou součástí promptu, jejich absolutní geometrické zachování však nelze garantovat.

## 2. Projektový AI asistent

Asistent dostává strukturovaný kontext aktivního projektu, nikoli volný přístup ke kódu nebo databázi. Odpověď musí projít validátorem a může obsahovat nejvýše 12 akcí z uzavřeného seznamu:

- přidání, posun, změna rozměru nebo odstranění objektu;
- přidání materiálu nebo rozpočtové položky;
- nastavení rezervy;
- doplnění poznámky;
- změna výšky stěn nebo povrchového materiálu;
- vytvoření nové varianty.

Návrh se nejprve zobrazí v samostatném panelu. Aplikace ukáže shrnutí, riziko, předpoklady a jednotlivé akce. Ke změně dat dojde až po kliknutí na potvrzení. Bezprostředně potom lze celý balík změn vrátit.

### Ochranné vrstvy

1. Serverový prompt vyžaduje striktní JSON.
2. `DomusCore.validateAiAssistantResponse` povoluje pouze známé akce a čistí jejich parametry.
3. UI neprovádí odpověď automaticky.
4. Uživatel musí potvrdit konkrétní seznam změn.
5. Před aplikací se uloží stav pro funkci vrácení.
6. První cloudové použití asistenta v relaci vyžaduje souhlas.

## 3. Manuál

Manuál je dostupný třemi způsoby:

- karta **Nápověda → Manuál** přímo v aplikaci;
- `MANUAL-DOMUS-STUDIO-v7.3.html` pro pohodlné čtení a tisk;
- `MANUAL-DOMUS-STUDIO-v7.3.md` pro archivaci a další úpravy.

Vestavěná verze má 17 kapitol a fulltextové vyhledávání. Samostatná verze podrobně popisuje:

- první spuštění a ukládání dat;
- doporučený pracovní tok;
- zaměření a fotodokumentaci;
- AI analýzu, vizualizátor a asistenta;
- Precision 2D, řez a RealSpace 3D;
- materiály, výměry a rozpočet;
- DOMUS Verify, poptávky a reporty;
- stavební deník, pasport, synchronizaci a zálohy;
- řešení nejčastějších problémů.

## 4. Server a nastavení

Skript `Nastavit-AI-pripojeni.bat` spustí průvodce pro uložení:

- OpenAI API klíče;
- textového modelu;
- obrazového modelu, výchozí `gpt-image-2`.

`/api/status` vrací také stav obrazového modelu. Statický whitelist obsahuje samostatný HTML manuál, takže je dostupný z lokálního serveru bez zpřístupnění celé složky aplikace.

## 5. Testy

Verze 7.3 rozšiřuje automatické kontroly o:

- validaci bezpečného formátu odpovědi asistenta;
- sanitizaci vizualizačních a chatových dat při importu;
- přítomnost AI Studia, všech tří režimů a manuálu;
- serverový endpoint `/api/image`, lokální omezení a výchozí obrazový model;
- sestavení samostatných manuálů do produkčního adresáře;
- browser průchod 17 kartami aplikace;
- vykreslení vizualizátoru, asistenta a nejméně 15 kapitol manuálu.

## 6. Co nebylo možné ověřit bez účtu

Automatické testy ověřují UI, datový model, validaci, serverové routy a sestavení. Skutečný placený požadavek na OpenAI API nebyl proveden, protože v testovacím prostředí nebyl uživatelský API klíč. Po nastavení klíče je proto vhodné udělat jeden kontrolní textový požadavek a jednu obrazovou variantu ve standardní kvalitě.

## 7. Doporučený první test

1. Založit kopii malého projektu.
2. Vložit jednu fotografii bez osobních údajů.
3. Ve vizualizátoru ponechat jednu variantu a standardní kvalitu.
4. Výslovně uvést, co má zůstat beze změny.
5. Zkontrolovat výsledek pomocí posuvníku před/po.
6. V asistentovi požádat o jednu neškodnou akci, například doplnění poznámky.
7. Zkontrolovat návrh, potvrdit jej a vyzkoušet vrácení změn.
8. Vytvořit novou DOMUS ZIP zálohu.

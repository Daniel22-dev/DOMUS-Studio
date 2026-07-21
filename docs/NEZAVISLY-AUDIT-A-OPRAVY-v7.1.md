# DOMUS Studio Premium 7.1 — nezávislý audit a provedené opravy

**Datum:** 21. 7. 2026  
**Auditovaná větev:** DOMUS Studio Premium 7.0 po první sadě auditních oprav  
**Výsledná verze:** 7.1.0  
**Rozsah:** zdrojové moduly, sestavení, webové rozhraní, PWA, desktopová konfigurace, responzivita, přístupnost, ukládání vstupů, testy a vizuální rendery

---

## 1. Verdikt

DOMUS Studio má velmi silný technický základ. Datová integrita, lokální ukládání, zálohy, validace, výpočty, 2D/3D životní cyklus i bezpečnostní obrana jsou na úrovni, která přesahuje běžný prototyp vytvořený pomocí AI. Před verzí 7.1 však aplikace stále nepůsobila na všech zařízeních stejně profesionálně: největší rezervy byly v responzivním rozhraní, světlém motivu, systémových potvrzeních a přístupnosti dynamických pracovních ploch.

Po provedených opravách hodnotím webovou aplikaci takto:

| Oblast | Před opravami | Verze 7.1 | Komentář |
|---|---:|---:|---|
| Integrita dat a bezpečnost | 9/10 | 9/10 | Silná už před auditem; nebyla nalezena nová kritická slabina. |
| Oborová logika | 9/10 | 9/10 | Výpočty a kontrolní mechanismy zůstaly beze změny. |
| Vizuální systém | 7,5/10 | 9/10 | Sjednocený tmavý i světlý motiv, dialogy, stavy a mikrodetaily. |
| Responzivita | 6,5/10 | 9/10 | Opravena navigace a horní lišta na tabletu a telefonu. |
| Přístupnost | 7/10 | 8,8/10 | Doplněny názvy, fokus, aktivní stav, reduced motion a dialogová sémantika. |
| Odolnost při zadávání | 8/10 | 9/10 | Průběžné ukládání důležitých poznámek a bezpečnější dialogy. |
| Udržovatelnost | 7,5/10 | 7,8/10 | Testy posíleny, ale fragmentová konkatenace a velký CSS soubor zůstávají. |
| **Celkový dojem** | **cca 8/10** | **cca 9/10** | Nyní odpovídá profesionálnímu lokálnímu projektovému nástroji. |

Neznamená to, že v libovolně velké aplikaci lze prohlásit „neexistuje žádná další chyba“. Znamená to, že v auditovaném rozsahu nezůstal žádný potvrzený kritický nebo vysoce závažný nález a všechny níže popsané reprodukovatelné vady byly opraveny.

---

## 2. Nejzávažnější vlastní nálezy

### P1 — rozbitá tabletová a mobilní navigace

**Problém:** Pod šířkou 1180 px se postranní navigace přesunula nahoru, ale její skupiny si ponechaly mřížkové rozložení. Výsledkem byla vysoká navigační plocha, prázdná místa a nepřehledné ovládání. Horní lišta navíc na telefonu přetékala a tlačítko dalších akcí nemělo hotové chování ani odpovídající styly.

**Oprava:**
- navigační skupiny se na tabletu a mobilu skládají do jediné vodorovné řady;
- aktivní záložka se automaticky posune do viditelné části;
- horní lišta nepřetéká;
- desktopové akce se přesunou do vlastního mobilního menu;
- vytvoření nového projektu zůstává dostupné i na telefonu;
- dotykové cíle mají nejméně 44 px;
- menu se zavře po výběru, kliknutí mimo něj i klávese Escape.

**Výsledek testu:** při 1024 px i 390 px je šířka dokumentu shodná s šířkou viewportu; nevzniká horizontální posuvník.

### P1 — světlý motiv nebyl plnohodnotný

**Problém:** Několik důležitých komponent používalo natvrdo zadané barvy určené pro tmavé pozadí. Ve světlém motivu proto klesal kontrast textu, pracovních panelů, sekundárních tlačítek a některých editorových ploch.

**Oprava:**
- kompletní sada světlých povrchů pro horní lištu, navigaci, pracovní plochu, karty, formuláře, dialogy a editory;
- sjednocené barvy textu, rámečků, stavů a stínů;
- dynamická změna `theme-color` pro prohlížeč/PWA;
- reakce na změnu systémového motivu za běhu;
- regresní test kontrastu klíčových prvků.

### P1 — nativní systémová potvrzení

**Problém:** Destruktivní a rozhodovací operace používaly `window.confirm()`. Dialogy se vizuálně lišily podle operačního systému, nerespektovaly motiv DOMUS a u složitější volby při importu záloh nenabízely profesionální vysvětlení variant.

**Oprava:**
- všechna nativní potvrzení nahrazena vlastním přístupným dialogem DOMUS;
- dialog podporuje dvě významové akce, zrušení křížkem i Escape;
- po zavření se fokus vrací na původní ovládací prvek;
- import konfliktů jasně rozlišuje „nahradit“ a „importovat jako kopie“;
- statický test hlídá, že se nativní `confirm()` do aplikace nevrátí.

---

## 3. Další provedené opravy

### Přístupnost a ovládání klávesnicí

- Aktivní záložka používá `aria-current="page"`.
- Navigace a mobilní nabídka mají sémantické názvy a role.
- Vyhledávání projektů je skutečné pole typu `search` s popisem.
- Ikonová tlačítka, přepínače vrstev, výběry objektů a pole zaměření mají jednoznačné přístupné názvy.
- Plátno půdorysu má roli obrázku a popis svého účelu.
- Dialogy používají `aria-labelledby` a tam, kde je potřeba, také `aria-describedby`.
- `:focus-visible` dává jasný, konzistentní fokus bez rušivého obrysu při práci myší.
- Systémové nastavení „omezit pohyb“ vypne nepotřebné animace.
- Zakázané ovládací prvky mají jednotný viditelný stav.

### Odolnost uživatelských vstupů

- Poznámky varianty a poznámky ze zaměření se automaticky ukládají po krátké prodlevě.
- Při opuštění pole proběhne ještě závěrečné uložení.
- Tím se omezuje riziko ztráty delšího textu při přechodu mezi záložkami.

### Prémiové vizuální detaily

- konzistentnější hloubka panelů a stínů;
- jednotné destruktivní akce;
- kultivované otevření a zavření dialogu;
- vlastní nenápadné scrollbary;
- tabulární číslice u rozpočtů a výměr;
- upravené stavy hover, focus, active a disabled;
- lepší vertikální rytmus panelů a nadpisů;
- deklarovaný `color-scheme` pro správné vykreslení systémových formulářových prvků.

### Konzistence verze a distribuce

- verze zvýšena na **7.1.0** v aplikaci, balíčku npm, Tauri, manifestu, service workeru, diagnostice, zálohách a dokumentaci;
- aktualizována cache PWA, aby uživatel nezůstal na starém rozhraní;
- aktualizovány ukázky verze v šabloně hlášení chyby a desktopovém release návodu;
- vytvořena samostatná stránka novinek `NOVINKY-VERZE-7.1.html`.

---

## 4. Vizuální ověření

Byly vyrenderovány a ručně zkontrolovány hlavní stavy:

- dashboard v tmavém a světlém motivu;
- projektový přehled;
- Precision 2D;
- Report Studio;
- tablet 1024 px;
- mobil 390 px.

Náhledy jsou přiloženy v adresáři `docs/audit-v7.1/` výsledného balíčku.

---

## 5. Automatické ověření

Finální příkaz `npm run test:all` skončil úspěšně.

### Prošlo

- sestavení 21 aplikačních fragmentů a 7 základních modulů;
- unit testy jádra;
- premium testy;
- kontrola Three.js modulů (r185);
- statická kontrola 105 akcí a 93 HTML ID;
- statická kontrola PowerShell skriptů;
- hlavní browser smoke test všech 16 záložek;
- responzivní test 1024 px a 390 px;
- vlastní potvrzovací dialog;
- kontrast světlého motivu;
- označení aktivní navigace.

### Omezení testovacího prostředí

Dva doplňkové browser testy byly v tomto izolovaném prostředí korektně přeskočeny:

- HTTP smoke test, protože testovací Chromium blokovalo loopback;
- samostatný IndexedDB test pro vložený dokument.

Nejde o pád aplikace ani neúspěšný hlavní browser test. Tyto dva scénáře je vhodné ještě jednou spustit v běžném GitHub Actions runneru nebo na cílovém Windows počítači.

---

## 6. Co zůstává jako střednědobá technická práce

Tyto body nejsou aktuálními uživatelskými chybami, ale určují budoucí strop aplikace:

1. **Skutečný modulový build.** Aplikace stále sestavuje fragmenty konkatenací do sdíleného scope. Přechod na esbuild/Rollup by přinesl moduly, source mapy, tree-shaking a spolehlivější detekci kolizí.
2. **Cílené aktualizace DOM.** Filtrování je již odložené pomocí debounce, ale po prodlevě stále překreslí větší část aplikace. U extrémně velkých projektů bude lepší aktualizovat pouze dotčený seznam.
3. **Delegace událostí.** Jednotný router událostí na kořeni aplikace by dále zmenšil množství vazeb a zjednodušil údržbu.
4. **Rozdělení CSS.** Výsledný stylesheet funguje správně, ale historicky vznikal po etapách. Střednědobě je vhodné rozdělit jej na tokeny, layout, komponenty, pracovní plochy a utility; minifikaci nechat až buildu.
5. **Rozšířené E2E scénáře.** Doplnit automatické průchody pro import/export záloh, 3D export, kameru, instalační PWA tok a podepsaný Tauri updater.
6. **Manuální audit asistivní technologií.** Sémantika byla výrazně zlepšena, ale finální ověření pomocí NVDA/VoiceOver a skutečného telefonu nelze plně nahradit automatickým testem.
7. **Postupné odkrývání funkcí.** Šestnáct pracovních záložek odpovídá rozsahu profesionálního nástroje, ale pro nového uživatele je vysoká hustota funkcí. Průvodce už pomáhá; do budoucna lze nabídnout režim „Základní / Profesionální“ bez odebírání funkcí.

---

## 7. Závěr

DOMUS Studio 7.1 už nepůsobí jako soubor samostatně vzniklých funkcí. Navigace, pracovní plochy, dialogy, motivy a stavy ovládání nyní používají jeden vizuální a interakční jazyk. Největší praktický posun je na tabletu, telefonu a ve světlém motivu — tedy právě tam, kde předchozí technicky silná aplikace ztrácela prémiový dojem.

Výsledná verze je vhodná jako profesionální demonstrační a pracovní release. Před širší veřejnou distribucí doporučuji ještě ověřit podepsaný desktopový build, aktualizátor a plný import/export na cílovém Windows zařízení.

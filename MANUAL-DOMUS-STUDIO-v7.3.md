# DOMUS Studio Premium v7.3 – kompletní uživatelský manuál

## 1. Co DOMUS je a co není

DOMUS Studio je local-first projektové centrum pro rekonstrukce, technické úpravy domu, interiéry a zahradu. Spojuje zaměření, fotografie, AI analýzu, fotorealistické koncepční vizualizace, přesný 2D návrh, 3D kontrolu, materiály, rozpočet, poptávku, realizační deník a technický pas.

DOMUS není autorizovaná projektová dokumentace. Nenahrazuje statika, projektanta, požární specialisty, elektrikáře, revizního technika ani odborné zaměření. AI výstupy jsou pracovní návrhy a vždy se musí ověřit skutečným měřením a odborným posouzením.

## 2. První spuštění

1. Rozbalte aplikaci do vlastní složky.
2. Spusťte `Spustit-DOMUS-Studio.bat`. Tím se otevře lokální server a aplikace v prohlížeči.
3. Nevstupujte běžně přes samotný `index.html`; bez lokálního serveru nefungují cloudová AI, import výrobků ani synchronizace.
4. Založte první projekt nebo otevřete pilotní projekt.
5. Otevřete **Úložiště a obnova** a zkontrolujte, že je úložiště dostupné.
6. Vytvořte první úplnou zálohu a uložte ji mimo složku aplikace.

### Jak jsou uložena data

Projektová data se ukládají lokálně v prohlížeči tohoto zařízení. Fotografie, přílohy a AI vizualizace mohou zabírat výrazně více místa než samotné výkresy. Aplikace vytváří body obnovy, koš a úplné ZIP zálohy s kontrolou integrity. Záloha je jediný bezpečný způsob přenosu projektu mimo zařízení, pokud nepoužíváte lokální synchronizaci.

## 3. Doporučený pracovní postup

1. **Založení projektu:** název, kategorie, umístění, stručný cíl.
2. **Zaměření:** fyzicky změřené rozměry a instalační body.
3. **Fotodokumentace:** celkové pohledy a kritické detaily.
4. **DOMUS AI Studio:** analýza fotografií, koncepční obrazové varianty a konzultace s asistentem.
5. **Precision 2D:** přesný půdorys, vrstvy, dveře, okna, rozvody a vybavení.
6. **Řez a 3D:** kontrola výšek, skladeb a prostorových vztahů.
7. **Materiály:** konkrétní výrobky, rozměry, vydatnost, prořez a ceny.
8. **Rozpočet:** práce, doprava, vedlejší náklady, rezerva a DPH.
9. **DOMUS Verify:** vyřešení kolizí, neověřených hodnot a technických rizik.
10. **Poptávka a report:** podklad pro dodavatele nebo projektanta.
11. **Deník a pasport:** skutečný průběh, zakryté konstrukce, záruky a doklady.
12. **Záloha:** po každém zásadním milníku.

## 4. Projekty a varianty

Každý projekt může obsahovat více variant. Varianty sdílejí skutečný stav, fotodokumentaci a realizační životní cyklus projektu, ale mají vlastní návrh, materiály, rozpočet a AI pracovní prostor.

Novou variantu použijte, když chcete zachovat původní návrh a porovnat jiné řešení. Variantu pojmenujte podle jejího smyslu, například „Walk-in sprcha – vyvážená“ nebo „Pergola – prémiová krytina“.

## 5. Zaměření skutečného stavu

### Zásady měření

- Měřte od pevných a znovu dohledatelných bodů: rohů, os, hran otvorů a hotových podlah.
- Každý kritický rozměr doplňte poznámkou, odkud a kam byl měřen.
- Rozměr označte jako ověřený jen tehdy, pokud byl skutečně fyzicky změřen.
- Odhad, údaj z fotografie a údaj z LiDARu ponechte jako odhadovaný zdroj.
- U rozvodů evidujte také výšku nad referenční podlahou.
- Před zakrytím konstrukce pořiďte fotografii s metrem nebo jiným měřítkem.

### Telefon a LiDAR

Mobilní zaměření a RoomPlan/LiDAR slouží jako rychlý podklad. Přesnost závisí na zařízení, světle, povrchu a geometrii prostoru. Kritické rozměry vždy ověřte pásmem nebo laserovým dálkoměrem.

## 6. Fotografie skutečného stavu

V kartě **Fotografie** vložte hlavní snímek, který bude reprezentovat projekt. Pro kreslení skutečných kót:

1. Zvolte **Kalibrace měřítka**.
2. Klikněte na dva konce známé vzdálenosti.
3. Zadejte fyzicky změřenou hodnotu.
4. Teprve poté kreslete kóty.

Poznámky v obraze používejte pro rizika, požadované změny a body k doměření. Hlavní fotografie může být následně přidána do sady DOMUS Vision.

## 7. DOMUS AI Studio

AI Studio obsahuje tři samostatné pracovní režimy:

- **Analýza:** rozpoznání viditelných prvků, rizik a měření k ověření.
- **Vizualizátor:** fotorealistická koncepční úprava skutečného snímku.
- **Asistent:** chat nad strukturou projektu s potvrzovanými změnami.

Cloudové funkce vyžadují vlastní OpenAI API klíč a připojení k internetu. Klíč zůstává na lokálním serveru a nevkládá se do projektu ani zálohy.

## 8. Nastavení AI připojení

1. Zavřete DOMUS Studio.
2. Spusťte `Nastavit-AI-pripojeni.bat`.
3. Vložte svůj OpenAI API klíč.
4. Pro textovou analýzu a asistenta ponechte doporučený textový model, pokud nemáte konkrétní důvod ke změně.
5. Pro vizualizace ponechte `gpt-image-2`.
6. Znovu spusťte DOMUS Studio a v AI Studio klikněte na **Ověřit připojení**.

API spotřeba se účtuje na vašem API účtu. Obrazové generování je obvykle nákladnější než textová odpověď. Počet variant a vysokou kvalitu proto používejte cíleně.

## 9. AI analýza fotografií

### Příprava sady

Nahrajte 2–6 snímků stejného prostoru:

- čelní pohled,
- levý a pravý pohled,
- zadní pohled,
- podlahu nebo strop, pokud jsou důležité,
- detail rozvodů, poškození nebo konstrukčního uzlu.

Každý snímek pojmenujte, nastavte směr pohledu a přidejte krátkou poznámku.

### Lokální kontrola

Lokální kontrola neopouští zařízení. Hodnotí čitelnost snímku, světlo a dominantní linie. Neumí spolehlivě určit konkrétní stavební prvek.

### Cloudová analýza

Před spuštěním zkontrolujte, zda chcete sdílet lokalitu, materiály a projektové poznámky. Aplikace poté odešle vybrané fotografie a kontext. Výstup obsahuje:

- shrnutí viditelného stavu,
- míru jistoty,
- rozpoznané prvky,
- možná rizika,
- seznam rozměrů k ověření,
- pracovní návrh základního tvaru místnosti.

Rozpoznaný prvek lze vložit do 2D výkresu. Vloží se jako pracovní objekt a jeho polohu i rozměry musíte ručně ověřit.

## 10. AI vizualizátor reálné fotografie

### K čemu slouží

Vizualizátor vytvoří koncepční obraz budoucího stavu ze skutečné fotografie. Snaží se zachovat perspektivu, obálku prostoru a prvky, které označíte jako neměnné.

### Doporučené zadání

Zadání rozdělte do čtyř částí:

1. **Hlavní požadavek:** stručný popis výsledku.
2. **Zachovat:** okna, dveře, rozvody, perspektivu, konkrétní zařízení.
3. **Odstranit:** původní vaničku, skříňku, obklad nebo jiný prvek.
4. **Přidat nebo změnit:** nové vybavení, povrchy, osvětlení a barevnost.

Příklad:

> Odstraň sprchovou vaničku a vytvoř bezbariérový walk-in kout. Zachovej dveře, okno, pračku a stávající vodovodní vývody. Přidej liniový žlab u zadní stěny, nerezový sprchový panel na levou stěnu a hnědou velkoformátovou dlažbu. Zachovej skutečnou perspektivu a rozměrové vztahy místnosti.

### Zamknutí prvků

Pokud jste předtím spustili analýzu, zobrazí se rozpoznané prvky. Zaškrtněte dveře, okna, rozvody nebo jiné části, které se nesmějí měnit. Přesto výsledek vždy vizuálně zkontrolujte.

### Kvalita a počet variant

- **Střední kvalita:** rychlejší pracovní návrhy.
- **Vysoká kvalita:** finální prezentační návrh, vyšší spotřeba API.
- **1 varianta:** přesné zadání a úsporný provoz.
- **2–3 varianty:** hledání směru nebo porovnání stylů.

### Vyhodnocení výsledku

Posuvníkem porovnejte snímek před a po. Kontrolujte zejména:

- zda zůstala perspektiva,
- zda se neposunuly dveře a okna,
- zda nevznikly nemožné rozvody,
- zda materiály odpovídají zadání,
- zda AI nepřidala nepožadovaný objekt.

Vybranou variantu přeneste do karty **Před / po**. Vizualizace není technickým výkresem a nelze z ní odečítat přesné rozměry.

## 11. Projektový AI asistent

### Co asistent vidí

Asistent dostává strukturovaný kontext aktivní varianty:

- projekt a základní výměry,
- 2D prvky včetně identifikátorů a rozměrů,
- materiály,
- nákladové položky,
- rezervu a orientační součet,
- dostupné prvky knihovny,
- podle vašich přepínačů také lokalitu a poznámky.

Fotografie se do běžného chatu neposílají.

### Jak zadávat požadavky

Buďte konkrétní. U posunu nebo změny rozměru používejte přesnou hodnotu:

- „Posuň umyvadlo o 300 mm doprava.“
- „Přidej podlahovou vpusť 150 mm od zadní stěny a označ polohu jako neověřenou.“
- „Doplň materiál hydroizolace a orientační náklad na práci.“
- „Vytvoř novou prémiovou variantu, původní ponech beze změny.“

### Návrh změn a potvrzení

Asistent může odpovědět pouze textem, nebo připravit návrh akcí. Návrh se zobrazí v pravém panelu a obsahuje:

- název a shrnutí,
- míru rizika,
- předpoklady k ověření,
- jednotlivé akce.

Projekt se nezmění, dokud nestisknete **Potvrdit a provést** a nepotvrdíte dialog. Po provedení lze změny bezprostředně vrátit.

### Podporované změny

- přidání 2D prvku,
- posun prvku,
- změna jeho rozměru,
- odstranění prvku,
- přidání materiálu,
- přidání nákladové položky,
- změna rezervy,
- doplnění poznámek,
- změna výšky stěn,
- přiřazení materiálu povrchu,
- vytvoření nové varianty.

Pokud chybí přesný rozměr nebo identifikátor, správné chování asistenta je položit otázku, nikoli hodnotu vymyslet.

## 12. Precision 2D

1. Nakreslete uzavřený obrys stěn.
2. Nastavte přesné délky a měřítko.
3. Vkládejte dveře, okna, vybavení a rozvody.
4. Používejte vrstvy: stavba, voda, odpady, elektro, vytápění, vzduchotechnika a zahrada.
5. Hotové vrstvy uzamkněte.
6. U dveří nastavte stranu pantů a směr otevírání.
7. Každému důležitému prvku doplňte poznámku a případně materiál.
8. Spusťte DOMUS Verify.

AI vložený prvek se nepovažuje za ověřený. Upravte jeho polohu, rozměr a vrstvu podle skutečného měření.

## 13. Knihovna, materiály a výrobky

Knihovna obsahuje základní technické a stavební prvky. Vlastní položku lze uložit z vybraného objektu.

U materiálu evidujte:

- výrobce a označení,
- URL výrobku,
- rozměry,
- jednotku a cenu,
- způsob výpočtu,
- vydatnost nebo obsah balení,
- procento prořezu,
- barevnost a poznámky.

Automatické načtení z odkazu je pomocné. Cena, rozměry a dostupnost musí být před objednávkou zkontrolovány na stránce výrobce nebo v nabídce dodavatele.

## 14. Řez, skladby a RealSpace 3D

Řez kontroluje výšky a konstrukční vrstvy. U podlahy, stěny a stropu evidujte skutečné vrstvy a tloušťky.

3D model vychází z 2D geometrie a přiřazených materiálů. Použijte jej k:

- kontrole prostorových vztahů,
- hledání kolizí,
- prezentaci varianty,
- vytvoření obrázku pro porovnání před a po.

3D model není statický, výrobní ani BIM model.

## 15. Materiálové výpočty a rozpočet

Materiály lze počítat:

- ručně,
- z plochy podlahy,
- z plochy stěn,
- z plochy stropu,
- z obvodu.

Výpočet zohledňuje vydatnost a prořez. U kusových položek se množství zaokrouhluje nahoru.

Rozpočet se sestavuje v pořadí:

1. materiály,
2. práce a ostatní náklady,
3. rezerva,
4. mezisoučet,
5. DPH.

AI nebo katalogová cena je pouze orientační. Před rozhodnutím ji nahraďte konkrétní cenovou nabídkou.

## 16. DOMUS Verify

Kontrola sleduje například:

- uzavřenost půdorysu,
- kolize prvků,
- odstupy vody a elektroinstalace,
- prostor otevírání dveří,
- neověřená měření,
- prvky mimo půdorys.

Nález lze označit jako vyřešený po skutečné změně nebo doložené kontrole. Přijaté riziko vyžaduje písemné zdůvodnění. Změní-li se podstata nálezu, staré přijetí rizika se automaticky zneplatní.

## 17. Poptávka a Report Studio

Poptávka má obsahovat:

- přesný rozsah dodávky,
- co dodávka nezahrnuje,
- požadované termíny,
- otázky pro dodavatele,
- požadovaný rozpad ceny,
- informace o zaměření a nejistotách.

Report Studio sestavuje podklad z vybraných částí projektu. Před odesláním dodavateli zkontrolujte lokalitu, ceny, osobní údaje a fotografie.

## 18. Realizační deník, technický pas a záruky

Během realizace evidujte:

- datum a typ práce,
- dodavatele,
- plánované a skutečné náklady,
- změny proti návrhu,
- fotografie před zakrytím,
- předávací protokoly a doklady,
- záruky a datum jejich konce,
- polohu skrytých rozvodů a konstrukcí.

Technický pas je nejcennější ve chvíli, kdy obsahuje přesné fotografie a vazbu na skutečné místo.

## 19. Synchronizace notebooku a telefonu

Mobilní přístup povolujte jen v důvěryhodné soukromé Wi-Fi síti.

1. Na notebooku spusťte povolení mobilního přístupu jako správce.
2. Spusťte DOMUS Studio.
3. V telefonu otevřete zobrazenou místní adresu.
4. Zadejte jednorázový párovací kód.
5. Po spárování se používá dlouhý přístupový token.
6. Projekt vědomě odešlete nebo stáhněte.

Před nahrazením projektu z jiného zařízení vytvořte zálohu.

## 20. Zálohy a obnova

Doporučený režim:

- po založení projektu,
- po dokončení zaměření,
- po schválení varianty,
- před hromadnou AI změnou,
- před importem z jiného zařízení,
- po dokončení realizace.

Uchovávejte alespoň jednu kopii mimo počítač. Staré body obnovy a koš pravidelně kontrolujte, ale nemažte je před ověřením nové zálohy.

## 21. Řešení nejčastějších problémů

### AI není dostupná

- Spusťte aplikaci přes hlavní BAT soubor.
- Ověřte připojení k internetu.
- Znovu spusťte nastavení AI klíče.
- Zkontrolujte stav a limity API účtu.

### Vizualizace mění neměnné prvky

- Zapište je explicitně do pole **Zachovat**.
- Zaškrtněte je mezi zamknutými prvky.
- Použijte fotografii s menším perspektivním zkreslením.
- Snižte rozsah požadovaných změn a generujte po etapách.

### Asistent nenabídne změny

Pravděpodobně chybí přesný rozměr, poloha nebo identifikátor. Odpovězte na jeho otázku nebo požadavek formulujte konkrétněji.

### Projekt je velký

Odstraňte nepoužívané AI vizualizace, duplicitní fotografie a staré přílohy. Poté vytvořte novou úplnou zálohu.

### 3D model se nezobrazí

Obnovte kartu, ověřte WebGL a spusťte vestavěný Test Lab. Na velmi starém nebo omezeném zařízení může být 3D výkon nedostatečný.

## 22. Kontrolní seznam před realizací

- [ ] Kritické rozměry jsou fyzicky ověřené.
- [ ] Půdorys je uzavřený a ve správném měřítku.
- [ ] Dveře, okna a instalační body mají správnou polohu.
- [ ] Materiály mají konkrétní výrobek a aktuální cenu.
- [ ] Rozpočet obsahuje práci, dopravu, rezervu a případné DPH.
- [ ] DOMUS Verify nemá neřešený kritický nález.
- [ ] AI vizualizace nebyla zaměněna za technický výkres.
- [ ] Dodavatel dostal popsaný rozsah a seznam nejistot.
- [ ] Před zahájením existuje aktuální záloha.

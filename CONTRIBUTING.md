# Přispívání do DOMUS Studio

## Běžný postup

```bash
npm run build
npm run analyze:architecture
npm test
npm run test:browser
npm run check:generated
```

## Pravidla změn

1. Neupravujte ručně generovaný `app.js`; změny patří do `src/app`.
2. Neupravujte ručně kořenové core moduly, `styles.css`, source mapy ani `dist`; změny patří do `src/core`, `src/app` a `src/styles`.
3. Nová uživatelská akce musí mít `data-action` a odpovídající větev action routeru; dynamické prvky se nesmějí jednotlivě znovu navazovat, pokud je lze obsloužit delegací.
4. Filtry a lehké změny rozhraní mají aktualizovat pouze dotčenou oblast, ne celý `#app`.
5. Nová změna datového modelu musí mít migraci a test.
6. Nový export musí projít export guardem.
7. Citlivý údaj nesmí být uložen v repozitáři, localStorage ani v klientském JavaScriptu.
8. Před pull requestem musí projít `npm run check`.

## Definition of done

- build je reprodukovatelný,
- žádný statický nebo unit test nehlásí FAIL,
- browser smoke test projde,
- Test Lab nehlásí FAIL,
- dokumentace odpovídá změně,
- generované soubory jsou aktualizované.

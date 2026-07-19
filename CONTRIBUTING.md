# Přispívání do DOMUS Studio

## Běžný postup

```bash
npm run build
npm test
npm run test:browser
npm run check:generated
```

## Pravidla změn

1. Neupravujte ručně generovaný `app.js`; změny patří do `src/app`.
2. Neupravujte ručně kořenové core moduly; změny patří do `src/core`.
3. Nová uživatelská akce musí mít `data-action` a odpovídající větev action routeru.
4. Nová změna datového modelu musí mít migraci a test.
5. Nový export musí projít export guardem.
6. Citlivý údaj nesmí být uložen v repozitáři, localStorage ani v klientském JavaScriptu.
7. Před pull requestem musí projít `npm run check`.

## Definition of done

- build je reprodukovatelný,
- žádný statický nebo unit test nehlásí FAIL,
- browser smoke test projde,
- Test Lab nehlásí FAIL,
- dokumentace odpovídá změně,
- generované soubory jsou aktualizované.

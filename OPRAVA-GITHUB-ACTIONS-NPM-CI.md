# Oprava GitHub Actions – `npm ci` / `ETIMEDOUT`

## Co bylo špatně

Soubor `package-lock.json` obsahoval 27 absolutních odkazů na interní balíčkový server prostředí, ve kterém byl balík původně sestaven. GitHub runner tento neveřejný server nemůže kontaktovat, takže všechny joby skončily už v kroku `npm ci` chybou `ETIMEDOUT`.

Nešlo o chybu zdrojového kódu DOMUS ani o neúspěšné testy. Testy se vůbec nespustily.

## Provedená oprava

- všech 27 interních adres v `package-lock.json` bylo nahrazeno veřejným registrem `https://registry.npmjs.org/`;
- `.npmrc` nyní výslovně používá veřejný registr a má nastavené opakování při přechodném síťovém výpadku;
- CI před instalací spouští kontrolu `scripts/check-lockfile-registry.mjs`;
- kontrola odmítne interní registry, Artifactory, localhost i jiné nečekané hostitele;
- `npm ci` v CI používá veřejný registr, lokální cache a samostatný audit;
- stejná ochrana byla doplněna do quality, browser i release workflow.

## Ověření

V opraveném balíku proběhlo úspěšně:

- `npm ci --no-audit --prefer-offline`;
- `npm test`;
- `npm run test:browser`;
- `npm run check:generated`;
- `npm audit --omit=dev --audit-level=high`;
- kontrola, že všech 43 adres balíčků míří pouze na `registry.npmjs.org`.

## Co nahrát do GitHubu

Nejjednodušší je nahradit obsah repozitáře obsahem kompletního opraveného balíku. Pro minimální opravu stačí nahradit nebo přidat:

- `.npmrc`
- `package-lock.json`
- `package.json`
- `scripts/check-lockfile-registry.mjs`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`

Po commitu se GitHub Actions spustí znovu. Původní neúspěšný běh není nutné ručně opravovat.

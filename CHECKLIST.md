# WebStudio · kontrolní seznam úloh 1–6

Posuzovanou verzí je jeden místní web podle rámců **Mobile, Tablet a Desktop** v úloze 6.
Identifikátory v prvním sloupci spojují jednotlivé požadavky s testy v adresáři `tests`.
Příkaz `pnpm check` spouští kontrolu formátu, validátor HTML a testy v Chromium, Firefoxu a WebKitu.

| ID | Co vyžaduje zadání | Jak to ověřit |
| --- | --- | --- |
| M1.1 | Anglický dokument v kořenovém `index.html`, UTF-8, jeden hlavní nadpis, sémantické pořadí header, main, footer a předepsaná ID. Značka loga mimo jediný nav, obě loga vedou na `./index.html`. | Test struktury a HTML-Validate. |
| M1.2 | Funkční lokální kotvy, e-mail a telefon v address mimo navigaci, tlačítko Order Service. Výhody i tým ve výčtech, čtyři jména a role, portréty JPEG s velikostí a anglickým popisem. | Test obsahu, odkazů a fotografií. |
| M2.1 | Předepsaná struktura images a css, anglické názvy souborů a tříd, konfigurace Prettier. HTML načítá pouze main.css. Ten pouze importuje common, header, hero, features, team, portfolio, footer v tomto pořadí, následované moduly dialogu a menu. | Test struktury souborů, importů, platných cest a formátování. |
| M2.2 | Minifikovaný modern-normalize, jeden požadavek Google Fonts pro obě rodiny, Roboto se zálohou sans-serif na body, Raleway pro logo, zvýrazněné Web. Barvy, bezrozměrný řádkový proklad, velikosti a váhy podle návrhu, třídní selektory, bez !important. | Kontrola zdrojů a vypočtených stylů. Testy používají i lokální kopie písem. |
| M2.3 | Sekce Our Portfolio, šest pojmenovaných projektů s kategoriemi a obrázky. Aktivní barvy odkazů a tlačítek při hoveru a při ovládání klávesnicí. | Test obsahu, ukazatele a fokusu. |
| M3.1 | Vnitřní .container ve všech sekcích, hlavičce a patičce. Desktopový kontejner 1158 px s obsahem 1128 px. Flexbox, společný .section s odsazením 120 px na desktopu, výška obsahu a hlavičky určená obsahem a paddingem. Spodní okraj hlavičky, žádné kolabující vnější mezery sekcí. | Test geometrie, velikostí a rozložení. Hero má vlastní odsazení podle makety. |
| M3.2 | Přístupný skrytý nadpis Our Features přes .sr-only. Ohraničená spodní popisná část portfoliové karty. | Test přístupného stromu, skrytí nadpisu a rámečků. |
| M4.1 | Jediný SVG sprite v images/icons.svg. Každá instance má svg/use, vlastní width, height a fill. Ilustrace výhod na desktopu, sociální odkazy u všech členů a v patičce. | Test existence symbolů, rozměrů a počtu ikon. |
| M4.2 | Fotografické hero s překryvným gradientem, šířka nejvýše 1440 px. Trvalé stíny týmu, stín a modrý textový překryv vysouvající se zdola při hoveru kdekoliv na kartě. Pseudo-element aktivního odkazu, prázdný dekorativní obsah. Aktivní barvy ikon. | Test pozadí, stínů, transformace, pseudo-elementu a interakce. |
| M4.3 | Přechody jmenují animované vlastnosti, trvají 250 ms a používají cubic-bezier(0.4, 0, 0.2, 1). Blok loga a blok sociálních sítí v patičce odděluje horizontální margin. | Test CSS a geometrie patičky. |
| M5.1 | Backdrop a dialog až za patičkou, výchozí skrytí, aktivace přes .is-open, pevný překryv celého viewportu, vycentrovaný dialog a křížek vpravo nahoře. Styly v modal.css. | Test otevření, zavření křížkem, klávesou Escape a kliknutím na pozadí, držení a návratu fokusu. |
| M5.2 | Formulář žádosti a odběru, popisky, názvy polí, placeholdery, typy e-mail/telefon, submit. Ikony uprostřed polí, aktivní rámeček a ikona na fokusu, neměnná velikost textarea. | Test polí, zarovnání ikon, stavů a validace obou formulářů. |
| M5.3 | Skrytý nativní checkbox spojený s label, uvnitř span se SVG a span s odkazem na soukromí. Viditelnost fajfky přes opacity. | Test struktury, ovládání klávesnicí a povinného souhlasu. |
| M6.1 | Mobile-first a viewport, hranice 320 / 768 / 1158 px. Od 320 px žádné vodorovné přetékání. Týmové karty stále 264 px, portfolio a překryv ve všech rozloženích. | Test na hranicích i uvnitř rozsahů, včetně širokého desktopu. |
| M6.2 | Obsahové JPEG přes src a srcset bez picture. Samostatné mobilní, tabletové a desktopové pozadí hero s min-resolution. Skutečné verze obrázků pro 1× a 2×. | Test rozměrů JPEG, dostupnosti souborů a výběru zdroje při obou hustotách. |
| M6.3 | Samostatné mobilní menu za patičkou, vlastní mobile-menu.css, fullscreen a výchozí skrytí. Třída .is-open pro otevření. Výška mobilní hlavičky vychází z paddingu loga. | Test otevření, navigace, Escape, zavření, přechodu na tablet a výšky hlavičky. |

## Výsledek ověření

- [x] **M1.1–M1.2** · Sémantika, anglický obsah, kontakty a portréty. Odkaz Portfolio nyní vede na novou sekci se šesti projekty.
- [x] **M2.1–M2.3** · Struktura CSS, normalizace, typografie, portfolio a interaktivní stavy.
- [x] **M3.1–M3.2** · Flexbox, desktopová geometrie, rámečky a přístupný skrytý nadpis.
- [x] **M4.1–M4.3** · Sprite, hero, sociální sítě, stíny, animace a překryvy.
- [x] **M5.1–M5.3** · Oba formuláře, validace, fokus, návrat na spouštěcí tlačítko a vlastní checkbox.
- [x] **M6.1–M6.3** · Tři rozvržení, menu a obrázky pro různé hustoty. Ověřeny šířky 320, 375, 767, 768, 1024, 1157, 1158, 1440 a 1920 px.
- [x] **23. 11. 2026** · Prošlo 19 scénářů v každém ze tří prohlížečů (57/57). Prettier, HTML-Validate a samostatná kontrola HTML a CSS pomocí Nu HTML Checkeru prošly bez chyb. Desktopové hero, mobilní stránka, menu a dialog byly rovněž vizuálně porovnány s Figmou.

## Předlohy šesti modulů

Číslování odpovídá dodaným souborům `Домашнє завдання 1-1.pdf` až `Домашнє завдання 1-6.pdf`. Odkazy vedou na jednotlivé fáze téhož návrhu. Úlohy 2 a 3 sdílejí jeden rámec.

[1 · HTML](https://www.figma.com/design/folOvI69KUmwYN47Njpr0O/?node-id=0-1) ·
[2–3 · CSS a Flexbox](https://www.figma.com/design/folOvI69KUmwYN47Njpr0O/?node-id=296708-626) ·
[4 · dekorace](https://www.figma.com/design/folOvI69KUmwYN47Njpr0O/?node-id=297016-823) ·
[5 · formuláře](https://www.figma.com/design/folOvI69KUmwYN47Njpr0O/?node-id=297035-1582) ·
[6 · responzivní web](https://www.figma.com/design/folOvI69KUmwYN47Njpr0O/?node-id=297046-1554)

## Co se v průběhu úloh mění

- **Úlohy 1–2.** První odevzdání mělo být bez CSS a v obou úlohách měl být vidět nadpis Our Features. Od úlohy 3 je nadpis vizuálně skrytý. Pro finální stránku se testuje novější požadavek.
- **Úlohy 3–6.** Ve třetí úloze se řešila geometrie bez dekorativních efektů. Od čtvrté úlohy patří do návrhu stíny, ikony a přechody. Šestá úloha doplňuje mobilní a tabletové varianty.
- **Historie souborů.** Portréty, projekty, fotografie pozadí a většina ikon pocházejí z existujících exportů stejné školní předlohy. Kontrolovat lze soubory, rozměry a vykreslení. Samostatný vlastní export skupin přes Figma a IcoMoon v tomto projektu doložen není. Původ je uveden v README.

## Odevzdání

- [x] Kumulativní projekt se zdrojovými soubory, checklistem a testy.
- Finální odevzdání má [repozitář](https://github.com/pavelvladimir/goit-markup-hw-06) a [živou stránku na GitHub Pages](https://pavelvladimir.github.io/goit-markup-hw-06/).
- [ ] Šest samostatných repozitářů a jejich historická odevzdání. Tato pracovní složka obsahuje jednu finální verzi.
- [ ] Odevzdání odkazů a ZIPu do LMS.

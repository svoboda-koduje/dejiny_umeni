/* =====================================================================
   ČASOVÁ OSA DĚJIN UMĚNÍ – DATA: epochy a slohy
   ---------------------------------------------------------------------
   Každá epocha je jeden objekt. Pole:
     id        – jednoznačný klíč (bez diakritiky), používá se v odkazech
     obdobi    – id základního období (pravek, starovek, stredovek, novovek, stoleti19, moderna)
     vrstva    – "evropa" (hlavní osa) nebo "svet" (spodní řádek: umění mimo Evropu)
     od, do    – letopočty (záporné = př. n. l.)
     datace    – text zobrazený vpravo nahoře na kartě
     ikona     – soubor v img/thumb, který se zobrazí v kolečku (může být null)
     strucne   – jedna věta pro rychlý přehled
     text      – odstavce charakteristiky
     znaky     – hlavní znaky (odrážky)
     oblasti   – architektura / sochařství / malířství (+ užité umění)
     faze      – dělení tématu (chipsy pod názvem)
     osobnosti – klíčová jména
     cesko     – co z toho najdeme u nás
     pamatky   – obrazové ukázky {img, nazev, popis}; img: null = zobrazí se rámeček k doplnění
     jung      – postoj: -1 (krajní introverze) … +1 (krajní extraverze); funkce; výklad
     klima     – klimatické a dějinné souvislosti; udalosti = id z data-souvislosti.js
     pales     – duch času podle E. Páleše
   ===================================================================== */

const EPOCHY = [

/* ======================= PRAVĚK ======================= */
{
  id: "paleolit", obdobi: "pravek", vrstva: "evropa", od: -40000, do: -10000,
  nazev: "Paleolit", podtitul: "starší doba kamenná – lovci mamutů", datace: "cca 40 000 – 10 000 př. n. l.",
  ikona: "paleolit_altamira.jpg",
  strucne: "Nejstarší umění lidstva: jeskynní malby zvířat, drobné venuše a rytiny lovců doby ledové.",
  text: [
    "Umění se rodí uprostřed poslední doby ledové. Krátce po Laschampské geomagnetické události (před cca 41 000 lety) se v Evropě usazuje člověk dnešního typu a s ním se objevují první obrazy: malby lvů a nosorožců v jeskyni Chauvet, „lví muž“ vyřezaný z mamutoviny, kostěné flétny. Umění tedy není pozdním luxusem civilizace – vzniká spolu s moderním člověkem.",
    "Malby vznikaly hluboko v jeskyních, mimo obytné prostory, často na těžko přístupných místech. Nebyly určeny k prohlížení, ale k rituálu – loveckou magií, uctíváním zvířecích předků nebo šamanskými obřady. Malíři používali okr, uhel a manganovou čerň, foukali barvu přes ruku (negativní otisky) a využívali vypoukliny skály jako těla zvířat. Zobrazují se téměř výhradně zvířata; člověk je vzácný a schematický.",
    "Drobná plastika – tzv. venuše – zdůrazňuje plodnost: mohutné boky a prsa, potlačený obličej. Věstonická venuše (cca 29 000 let) je nejstarší keramikou světa. Na konci paleolitu (magdalénien) vznikají nejslavnější „galerie“ Lascaux a Altamira s polychromními stády býků, koní a jelenů."
  ],
  znaky: ["Zobrazení zvířat (býk, kůň, mamut, jelen) – téměř bez lidí", "Malba na skalní stěny hluboko v jeskyních, okr a uhel", "Drobné plastiky venuší z kamene, kosti a hlíny", "Rytiny na kostech, zdobené zbraně a nástroje", "Magický a rituální účel, nikoli dekorace"],
  oblasti: {
    architektura: "Přírodní úkryty a jeskyně; na Moravě (Dolní Věstonice, Předmostí) chaty z mamutích kostí a kůží.",
    socharstvi: "Venuše (Willendorf, Věstonice, Petřkovice), lví muž, zvířecí sošky z mamutoviny a pálené hlíny, reliéfy ve skále.",
    malirstvi: "Jeskynní malby a rytiny: Chauvet, Lascaux, Altamira, Niaux, Rouffignac; v Čechách Mladečské jeskyně bez maleb – malba je u nás vzácná."
  },
  faze: [{ nazev: "Aurignacien", kdy: "40–28 tis. let" }, { nazev: "Gravettien", kdy: "28–20 tis. let" }, { nazev: "Magdalénien", kdy: "17–12 tis. let" }],
  osobnosti: ["Anonymní šamani a malíři", "Karel Absolon (objevitel Věstonické venuše)", "Zdeněk Burian (rekonstrukce pravěku)"],
  cesko: "Dolní Věstonice a Pavlov – lovci mamutů, Věstonická venuše a nejstarší keramika; Petřkovická venuše; Předmostí u Přerova.",
  pamatky: [
    { img: "paleolit_chauvet.jpg", nazev: "Jeskyně Chauvet (Francie)", popis: "Koně kreslení uhlem se stínováním, cca 36 000 let – nejstarší velké figurální malby Evropy." },
    { img: "paleolit_lascaux.jpg", nazev: "Lascaux (Francie)", popis: "„Síň býků“, cca 17 000 let; přes 600 maleb objevených roku 1940 čtyřmi chlapci." },
    { img: "paleolit_altamira.jpg", nazev: "Altamira (Španělsko)", popis: "Polychromní bizoni na stropě, využívající vypoukliny skály. Objevena 1879 – pro Páleše rok nástupu Michaela." },
    { img: "paleolit_vestonicka_venuse.jpg", nazev: "Věstonická venuše", popis: "Pálená hlína, 11,5 cm, cca 29 000 let. Nejstarší keramická soška na světě (objev 1925)." },
    { img: "paleolit_willendorf.jpg", nazev: "Willendorfská venuše", popis: "Vápenec, 11 cm, cca 29 000 let. Symbol plodnosti bez obličeje." },
    { img: "paleolit_otisky_rukou.jpg", nazev: "Otisky rukou", popis: "Negativní otisky foukané barvou – „podpis“ pravěkých tvůrců (Cueva de las Manos, Argentina)." }
  ],
  jung: { postoj: -0.95, nazevPostoje: "Hluboká introverze", funkce: "Intuice & vnímání (iracionální osa)",
    text: "Stadium urobora podle Ericha Neumanna: subjekt splývá s objektem (participation mystique). Jeskyně je lůnem Velké Matky, v němž šaman zhmotňuje vnitřní obrazy. Umění kompenzuje bezmoc před ledovou přírodou vytvořením vnitřního magického bezpečí." },
  klima: "Vrchol poslední doby ledové (Würm): extrémní chlad, ledovce nad Skandinávií a Alpami, mamutí step. Nutnost fyzického i psychického úkrytu pod zemí. Umění vzniká krátce po Laschampské geomagnetické události, kdy zesláblo magnetické pole Země.",
  udalosti: ["laschamp", "lgm", "dryas"],
  pales: "Předchází dějinnému rytmu duchů času; Páleš vidí v paleolitu ještě nediferencované „snové“ vědomí lidstva (měsíční, gabrielský princip obraznosti)."
},

{
  id: "mezolit", obdobi: "pravek", vrstva: "evropa", od: -10000, do: -6000,
  nazev: "Mezolit", podtitul: "střední doba kamenná", datace: "cca 10 000 – 6 000 př. n. l.",
  ikona: "pravek_amazonie.jpg",
  strucne: "Po oteplení mizí mamuti i velké jeskynní galerie; lovci lesa tvoří drobné rytiny, geometrické znaky a skalní malby loveckých scén.",
  text: [
    "S koncem doby ledové (cca 11 700 let) se tundra mění v les. Mizí stáda mamutů a sobů a s nimi i důvod pro velké jeskynní svatyně. Menší, pohyblivé skupiny lovců, rybářů a sběračů žijí u řek a jezer.",
    "Umění se zmenšuje a schematizuje: na skalách východního Španělska (Valltorta, Alpera) se poprvé objevují živé scény lovců s luky a tanečníků – člověk vstupuje do obrazu jako hlavní hrdina. Rozvíjí se drobná mikrolitická industrie, rytiny na jantaru a kostech, první geometrické znaky. V Amazonii (Serranía de la Lindosa) vznikají ve stejné době tisíce červených maleb ledovcové fauny."
  ],
  znaky: ["Drobné, schematické figury v pohybu", "Lovecké a taneční scény – člověk jako hrdina", "Geometrické znaky, ornament na nástrojích", "Skalní přístřešky místo hlubokých jeskyní"],
  oblasti: { architektura: "Sezónní tábory, chaty z proutí a kůží, první dlouhodobější sídliště u vody.", socharstvi: "Drobné kostěné a jantarové přívěsky, zvířecí figurky.", malirstvi: "Levantské skalní umění Španělska; malby v Amazonii; rytiny na oblázcích (azilien)." },
  faze: [{ nazev: "Epipaleolit", kdy: "10–9 tis. př. n. l." }, { nazev: "Vlastní mezolit", kdy: "9–6 tis. př. n. l." }],
  osobnosti: ["Anonymní tvůrci"],
  cesko: "Mezolitická sídliště v Polabí a v pískovcových převisech Českého ráje (Kokořínsko).",
  pamatky: [
    { img: "pravek_amazonie.jpg", nazev: "Serranía de la Lindosa (Kolumbie)", popis: "Skalní malby staré cca 12 500 let s ledovcovou faunou – objeveny roku 2020." },
    { img: "mezolit_valltorta.jpg", nazev: "Lovci z Valltorty (Španělsko)", popis: "Schematičtí lučištníci v pohybu – levantské skalní umění." }
  ],
  jung: { postoj: -0.5, nazevPostoje: "Introverze s otevíráním se světu", funkce: "Vnímání & intuice",
    text: "Člověk vstupuje do obrazu: přechod od magického splynutí se zvířetem k vědomí vlastní role. Pohyblivá, schematická figura je prvním krokem k abstrakci znaku." },
  klima: "Prudké oteplení na začátku holocénu, vzestup hladiny moří (zaplavení Doggerlandu mezi Británií a Evropou), rozšíření lesa.",
  udalosti: ["dryas"],
  pales: "Podle rytmu 354 let spadá do velkých saturnsko-venušských cyklů; Páleš klade do neolitu vznik trvalých sídel jako projev saturnského (orifielského) principu."
},

{
  id: "neolit", obdobi: "pravek", vrstva: "evropa", od: -9500, do: -4300,
  nazev: "Neolit", podtitul: "mladší doba kamenná – první zemědělci", datace: "cca 9 500 – 4 300 př. n. l. (u nás od 5 500)",
  ikona: "neolit_gobekli.jpg",
  strucne: "Neolitická revoluce: zemědělství, trvalé vesnice, keramika s geometrickým ornamentem a první svatyně.",
  text: [
    "Zemědělství vzniká na Blízkém východě v „úrodném půlměsíci“ a šíří se do Evropy; do Čech a na Moravu přichází kolem roku 5 500 př. n. l. s kulturou s lineární keramikou. Člověk poprvé přetváří krajinu: kácí les, staví dlouhé kůlové domy a hliněné pece, chová dobytek.",
    "Umění se proměňuje od naturalistického zvířete k abstraktnímu znaku. Na keramice se objevuje rytý a malovaný geometrický ornament (spirály, meandry, vlnice) – podle Worringera výraz „pudu k abstrakci“, potřeby řádu tváří v tvář nevyzpytatelné úrodě a počasí. Vznikají ženské idoly (kult plodnosti a Velké Matky) a domácí kultovní předměty.",
    "Překvapením posledních desetiletí je Göbekli Tepe v Turecku: monumentální kruhové svatyně s pilíři ve tvaru T a reliéfy zvířat, postavené kolem 9 500 př. n. l. ještě lovci-sběrači. Chrám tedy možná předcházel vesnici. Çatalhöyük (7 500–5 700 př. n. l.) je první „město“ s nástěnnými malbami a sochami."
  ],
  znaky: ["Geometrický ornament na keramice (lineární, vypíchaná, moravská malovaná)", "Trvalé domy a vesnice, dlouhé domy", "Ženské idoly – kult plodnosti", "První monumentální svatyně (Göbekli Tepe)", "Broušené kamenné nástroje"],
  oblasti: { architektura: "Dlouhé kůlové domy (u nás Bylany u Kutné Hory), hliněné domy Çatalhöyüku, svatyně Göbekli Tepe, rondely – kruhové příkopové areály na Moravě.", socharstvi: "Hliněné venuše a idoly, zoomorfní nádoby, reliéfy na pilířích Göbekli Tepe.", malirstvi: "Malovaná keramika (moravská malovaná keramika, Cucuteni-Trypillia), nástěnné malby v Çatalhöyüku." },
  faze: [{ nazev: "Předkeramický neolit", kdy: "9 500–7 000 př. n. l." }, { nazev: "Lineární keramika", kdy: "5 500–5 000 př. n. l." }, { nazev: "Moravská malovaná", kdy: "4 700–4 000 př. n. l." }],
  osobnosti: ["Anonymní zemědělské komunity", "Klaus Schmidt (výzkum Göbekli Tepe)"],
  cesko: "Bylany u Kutné Hory (dlouhé domy), Vedrovice, moravská malovaná keramika, rondel v Kolíně – jedny z nejstarších monumentálních staveb Evropy.",
  pamatky: [
    { img: "neolit_gobekli.jpg", nazev: "Göbekli Tepe (Turecko)", popis: "Pilíře ve tvaru T s reliéfy lišek, hadů a jeřábů, cca 9 500 př. n. l. – nejstarší chrám světa." },
    { img: "neolit_catalhoyuk.jpg", nazev: "Çatalhöyük (Turecko)", popis: "Nástěnná malba a reliéfy v domech prvního „města“, 7. tisíciletí př. n. l." },
    { img: "neolit_moravska_malovana.jpg", nazev: "Moravská malovaná keramika", popis: "Lengyelská kultura, 5. tisíciletí př. n. l. – malovaný geometrický ornament." },
    { img: "neolit_newgrange.jpg", nazev: "Newgrange (Irsko)", popis: "Chodbová hrobka z 3 200 př. n. l., do níž o zimním slunovratu vniká slunce – přechod k eneolitu." }
  ],
  jung: { postoj: -0.3, nazevPostoje: "Vznikající extraverze", funkce: "Myšlení & vnímání",
    text: "Cyklus Velké Matky a zemědělství: úzkost z nepředvídatelnosti přírody (sucho, neúroda) je kompenzována vtištěním geometrického řádu do krajiny i na nádoby. Zrození vědomého řádu – první pokus oddělit nebe od země." },
  klima: "Holocénní oteplení, ústup ledovců; zemědělství vzniká po mladším dryasu. Ochlazení 8,2 tisíce let (6 200 př. n. l.) vyhání zemědělce z Anatolie do Evropy.",
  udalosti: ["dryas", "e8200", "sahara"],
  pales: "Göbekli Tepe a vznik trvalé architektury spadají do saturnského (orifielského) principu kamene a trvalosti; Páleš spojuje s neolitem první „patriarchální“ organizaci společnosti."
},

{
  id: "eneolit", obdobi: "pravek", vrstva: "evropa", od: -4300, do: -2200,
  nazev: "Eneolit", podtitul: "pozdní doba kamenná – doba měděná", datace: "cca 4 300 – 2 200 př. n. l.",
  ikona: "neolit_stonehenge.jpg",
  strucne: "Doba prvních kovů, oradla, kola a megalitů – Stonehenge, Carnac, muž z ledovce Ötzi.",
  text: [
    "Měď se začíná tavit a odlévat, objevuje se kolo, vůz a oradlo tažené dobytkem. Společnost se rozvrstvuje – bohaté hroby náčelníků, opevněná výšinná sídliště. V západní Evropě vrcholí megalitická architektura: menhiry, dolmeny, kromlechy (Stonehenge, Carnac), orientované podle Slunce a Měsíce.",
    "Ötzi, muž z alpského ledovce (cca 3 300 př. n. l.), nese měděnou sekeru, luk, tetování a oděv z kůží – ukazuje, jak vypadal každodenní život té doby. Na východě zatím vznikají první města v Mezopotámii a písmo; pravěk Evropy a starověk Blízkého východu běží souběžně.",
    "V českých zemích jde o kultury nálevkovitých pohárů, řivnáčskou, šňůrovou a zvoncovitých pohárů. Keramika je zdobena šňůrovými otisky, objevují se první měděné šperky a dýky."
  ],
  znaky: ["Měď a zlato – první kovy", "Megality: menhir, dolmen, kromlech", "Astronomická orientace staveb", "Kolo, vůz, oradlo; bohaté hroby elit", "Šňůrová keramika, zvoncovité poháry"],
  oblasti: { architektura: "Stonehenge (3 000–2 000 př. n. l.), Carnac, Newgrange; kolové stavby na jezerech v Alpách; výšinná hradiště.", socharstvi: "Menhiry-stély se schematickými postavami, měděné a zlaté šperky, idoly.", malirstvi: "Rytá a šňůrová výzdoba keramiky, skalní rytiny v Alpách (Val Camonica)." },
  faze: [{ nazev: "Časný eneolit", kdy: "4 300–3 500" }, { nazev: "Střední eneolit", kdy: "3 500–2 800" }, { nazev: "Pozdní eneolit", kdy: "2 800–2 200" }],
  osobnosti: ["Ötzi – muž z ledovce", "Stavitelé Stonehenge"],
  cesko: "Menhiry v Klobukách a Drahomyšli, hradiště Homolka u Stehelčevsi, řivnáčská kultura, hrob lukostřelce (zvoncovité poháry).",
  pamatky: [
    { img: "neolit_stonehenge.jpg", nazev: "Stonehenge (Anglie)", popis: "Kruh sarsenových trilitů orientovaný na letní slunovrat, 3 000–2 000 př. n. l." },
    { img: "neolit_otzi.jpg", nazev: "Ötzi – rekonstrukce", popis: "Muž z ledovce v Ötztalských Alpách, cca 3 300 př. n. l., s měděnou sekerou a tetováním." }
  ],
  jung: { postoj: -0.2, nazevPostoje: "Řád vtištěný do krajiny", funkce: "Myšlení & vnímání (Te-Se)",
    text: "Geometrické vyměřování a astronomická orientace megalitů – racionální organizace posvátného prostoru. Vědomí (ego) se vyděluje z přírody a začíná ji měřit." },
  klima: "Teplé a vlhké „atlantické“ období vrcholí a přechází v sušší subboreál; vysychání Sahary (3 900 př. n. l.) žene obyvatelstvo k Nilu. Na konci období megasucho 4,2 tisíce let.",
  udalosti: ["sahara", "otzi", "e4200"],
  pales: "Stonehenge a egyptské pyramidy (2 700–2 400 př. n. l.) spadají podle Páleše do saturnského období Orifiela (2 726–2 372 př. n. l.) – ducha kamene, trvalosti a monumentality."
},

{
  id: "bronz", obdobi: "pravek", vrstva: "evropa", od: -2200, do: -800,
  nazev: "Doba bronzová", podtitul: "únětická, mohylová, popelnicová pole", datace: "cca 2 200 – 800 př. n. l.",
  ikona: "bronz_slunecni_vuz.jpg",
  strucne: "Bronz (měď + cín) přináší nové zbraně, šperky a dálkový obchod; umění je abstraktní, sluneční a ornamentální.",
  text: [
    "Slitina mědi a cínu vyžaduje obchod na velké vzdálenosti (cín z Cornwallu a Krušných hor, jantar z Baltu) – Evropa se propojuje. Vznikají bohaté náčelnické hroby (mohyly), hradiště a depoty bronzových předmětů obětované bohům do vody a bažin.",
    "Umění doby bronzové je převážně užité a abstraktní: spirály, soustředné kruhy, sluneční kotouče. Sluneční vůz z Trundholmu (Dánsko) a disk z Nebry (nejstarší zobrazení oblohy, cca 1 600 př. n. l.) ukazují kult Slunce a znalost astronomie. Figurální umění je vzácné – skalní rytiny lodí a bojovníků ve Skandinávii.",
    "Ve Středomoří téže doby vrcholí mínojská a mykénská kultura a v Egyptě Nová říše; ve střední Evropě mluvíme o únětické kultuře (pojmenované podle Únětic u Prahy), mohylových kulturách a kulturách popelnicových polí (žárové pohřbívání)."
  ],
  znaky: ["Bronzové zbraně, šperky a nádoby, tepání a odlévání", "Sluneční symbolika, spirály, kruhy", "Depoty (obětiny) v bažinách a řekách", "Mohyly a hradiště; později žárové hroby v popelnicích", "Dálkový obchod: cín, jantar, sůl"],
  oblasti: { architektura: "Opevněná hradiště, mohylová pohřebiště, kolové osady.", socharstvi: "Bronzové figurky, sluneční vůz z Trundholmu, kultovní nádobky a vozíky.", malirstvi: "Rytý ornament na bronzu a keramice, skalní rytiny (Tanum, Val Camonica)." },
  faze: [{ nazev: "Starší (únětická)", kdy: "2 200–1 600" }, { nazev: "Střední (mohylová)", kdy: "1 600–1 300" }, { nazev: "Mladší (popelnicová pole)", kdy: "1 300–800" }],
  osobnosti: ["Únětická kultura", "Lužická kultura", "Knovízská kultura"],
  cesko: "Únětice u Prahy – eponymní naleziště; depoty bronzů; kultovní nádobka z Kolínska; hradiště Plešivec.",
  pamatky: [
    { img: "bronz_slunecni_vuz.jpg", nazev: "Sluneční vůz z Trundholmu (Dánsko)", popis: "Bronz a zlatý plech, cca 1 400 př. n. l. – kůň táhne Slunce po obloze." },
    { img: "bronz_nadobka.jpg", nazev: "Kultovní nádobka z Kolínska", popis: "Doba bronzová, české země." },
    { img: "bronz_nebra.jpg", nazev: "Disk z Nebry (Německo)", popis: "Bronz se zlatými intarziemi Slunce, Měsíce a Plejád, cca 1 600 př. n. l." }
  ],
  jung: { postoj: -0.4, nazevPostoje: "Abstraktní řád a sluneční kult", funkce: "Myšlení & intuice",
    text: "Ornament nahrazuje obraz: kompenzace nejistoty geometrickým řádem kosmu. Sluneční symbol = vznikající vědomí (ego) jako světlo oddělující se z temnoty nevědomí (Neumann)." },
  klima: "Období začíná megasuchem 4,2 tisíce let a končí kolapsem doby bronzové (sucho, nájezdy, zánik obchodu s cínem kolem 1 200 př. n. l.).",
  udalosti: ["e4200", "thera", "bronz_kolaps"],
  pales: "Kolaps doby bronzové a nástup železa se kryjí s marsovským obdobím Samaela (1 309–955 př. n. l.) – dobou válek, mořských národů a trojské války."
},

{
  id: "zelezo", obdobi: "pravek", vrstva: "evropa", od: -800, do: 0,
  nazev: "Doba železná", podtitul: "halštat a latén – Keltové", datace: "cca 800 př. n. l. – přelom letopočtu",
  ikona: "zelezo_keltsky_sperk.jpg",
  strucne: "Železo, keltská oppida, mince a dynamický spirálový ornament laténského umění.",
  text: [
    "Železo je dostupnější než bronz – zbraně a nástroje se rozšiřují mezi všechny vrstvy. Starší doba železná (halštat, 800–450 př. n. l.) je dobou knížecích mohyl s vozy a orientálními importy (Hochdorf, Vix). Mladší doba železná (latén, 450 př. n. l. – 0) patří Keltům, prvnímu etniku u nás známému jménem (Bójové).",
    "Keltské umění je abstraktní, dynamické a ornamentální: propletené spirály, trojlisty (triskely), stylizované masky a zvířata na sponách, náramcích a mečích. Keltové razí zlaté mince (duhovky), zakládají oppida – první městské útvary – a ovládají sklářství a hrnčířský kruh.",
    "Zatímco střední Evropa žije v „pravěku“, ve Středomoří vrcholí řecká klasika a rozmach Říma. Kolem přelomu letopočtu Kelty vytlačují Germáni a do Podunají přichází Řím – pro naše území začíná doba římská."
  ],
  znaky: ["Železné zbraně a nástroje", "Keltský ornament: spirála, triskel, maska", "Oppida (Závist, Stradonice, Staré Hradisko)", "Mince, sklo, hrnčířský kruh", "Knížecí mohyly halštatu s vozy"],
  oblasti: { architektura: "Oppida s hradbami (murus gallicus), dvorce, čtyřúhelníkové valy (viereckschanze).", socharstvi: "Kamenná hlava z Mšeckých Žehrovic, keltské stély, bronzové figurky, zdobené spony.", malirstvi: "Malovaná keramika, email a korál na kovu, mince s abstraktní stylizací." },
  faze: [{ nazev: "Halštat", kdy: "800–450 př. n. l." }, { nazev: "Latén", kdy: "450 př. n. l. – 0" }],
  osobnosti: ["Keltové (Bójové)", "Bylanská kultura", "Germáni (Markomani)"],
  cesko: "Hlava Kelta z Mšeckých Žehrovic, oppidum Závist u Prahy, Stradonice, duhovky; komorové hroby bylanské kultury (Plaňany).",
  pamatky: [
    { img: "zelezo_keltsky_sperk.jpg", nazev: "Keltský bronzový šperk (Cerhýnky)", popis: "Mladší doba železná, laténský styl." },
    { img: "zelezo_ozdoba.jpg", nazev: "Ozdoba doby železné", popis: "Užité umění halštatského období." },
    { img: "zelezo_msecke_zehrovice.jpg", nazev: "Hlava Kelta z Mšeckých Žehrovic", popis: "Opuka, 2. stol. př. n. l. – nejslavnější keltská plastika střední Evropy." }
  ],
  jung: { postoj: -0.3, nazevPostoje: "Introvertní ornament", funkce: "Intuice & cítění",
    text: "Keltský ornament rozpouští tvar v nekonečném pohybu linie – protiklad řecké extravertní míry. Worringerova abstrakce jako výraz sepětí s neviditelnými silami přírody (druidové)." },
  klima: "Kolem 800 př. n. l. vlhké a chladné období (tzv. „Homérovo minimum“ sluneční aktivity) – expanze Keltů; od 250 př. n. l. římské klimatické optimum.",
  udalosti: ["bronz_kolaps", "rim_optimum"],
  pales: "Halštat spadá do měsíčního období Gabriela (955–600), latén do slunečního Michaela (600–246 př. n. l.) – doby řecké filosofie, kdy i keltská kultura razí mince a zakládá města."
},

/* ======================= STAROVĚK ======================= */
{
  id: "mezopotamie", obdobi: "starovek", vrstva: "evropa", od: -3500, do: -539,
  nazev: "Mezopotámie", podtitul: "Sumer, Akkad, Babylon, Asýrie", datace: "cca 3 500 – 539 př. n. l.",
  ikona: "mezopotamie_istarina_brana.jpg",
  strucne: "Země mezi Eufratem a Tigridem: první města, klínové písmo, zikkuraty a reliéfy králů.",
  text: [
    "V úrodné nížině mezi Eufratem a Tigridem vznikají kolem roku 3 500 př. n. l. první města (Uruk, Ur, Lagaš) a s nimi klínové písmo, kalendář, právo a stát. Sumery vystřídali Akkadové, Babyloňané (Chammurapi, cca 1 750 př. n. l.), Asyřané a Novobabylonská říše (Nabukadnezar II.), kterou roku 539 př. n. l. dobyli Peršané.",
    "Architektura je z nepálených a pálených cihel – kámen chybí. Dominantou města je zikkurat, stupňovitá chrámová věž (biblická babylonská věž). Paláce zdobí glazované cihly (Ištařina brána s draky a býky) a asyrské kamenné reliéfy s loveckými a válečnými scénami – patos síly a moci.",
    "Sochařství vytváří strnulé modlící se postavy s obrovskýma očima (Tell Asmar), okřídlené býky lamassu hlídající brány a portréty vládců. Chammurapiho zákoník je vytesán do dioritové stély pod reliéfem krále přijímajícího zákony od boha Slunce Šamaše."
  ],
  znaky: ["Cihlová architektura, zikkurat", "Klínové písmo na hliněných tabulkách", "Reliéfy vládců a lovů, lamassu", "Glazované cihly, lapis lazuli, zlato", "Strnulá frontální figura s velkýma očima"],
  oblasti: { architektura: "Zikkurat v Uru (cca 2 100 př. n. l.), Ištařina brána a visuté zahrady v Babylonu, asyrské paláce v Ninive a Chorsábádu.", socharstvi: "Sošky modlících se z Tell Asmar, standarta z Uru, Chammurapiho stéla, lamassu, reliéf Lov lvů (Aššurbanipal).", malirstvi: "Mozaiky z mušlí a lapisu (standarta z Uru), glazované reliéfy, pečetní válečky." },
  faze: [{ nazev: "Sumer", kdy: "3 500–2 300" }, { nazev: "Akkad a Babylon", kdy: "2 300–1 100" }, { nazev: "Asýrie", kdy: "900–612" }, { nazev: "Nový Babylon", kdy: "626–539" }],
  osobnosti: ["Gilgameš (epos)", "Sargon Akkadský", "Chammurapi", "Aššurbanipal", "Nabukadnezar II."],
  cesko: "Přímé památky u nás nejsou; české expedice (Bedřich Hrozný rozluštil chetitštinu, 1915) patří k dějinám orientalistiky.",
  pamatky: [
    { img: "mezopotamie_zikkurat_ur.jpg", nazev: "Zikkurat v Uru (Irák)", popis: "Chrámová věž měsíčního boha Nanny, cca 2 100 př. n. l., rekonstruovaná ve 20. století." },
    { img: "mezopotamie_istarina_brana.jpg", nazev: "Ištařina brána (Babylon)", popis: "Glazované cihly s draky a býky, cca 575 př. n. l. Dnes v Pergamonském muzeu v Berlíně." },
    { img: "mezopotamie_chammurapi.jpg", nazev: "Chammurapiho stéla", popis: "Diorit, cca 1 750 př. n. l., Louvre – král přijímá zákony od boha Šamaše." }
  ],
  jung: { postoj: 0.5, nazevPostoje: "Rigidní extraverze", funkce: "Myšlení & cítění",
    text: "Umění opouští individuální duši a stává se nástrojem organizace sociálního davu: monumentální měřítko potlačuje jednotlivce a vštěpuje kolektivní řád. Vzestup patriarchálního vědomí (Logos) nad mateřskou přírodou." },
  klima: "Zavlažovací zemědělství závislé na řekách; megasucho 4,2 tisíce let (2 200 př. n. l.) zničilo Akkadskou říši. Zasolování půdy vedlo k úpadku Sumeru.",
  udalosti: ["otzi", "e4200"],
  pales: "Chammurapiho zákoník (cca 1 750 př. n. l.) spadá do jupiterského období Zachariela (2 017–1 663 př. n. l.) – ducha práva a králů; asyrské válečné reliéfy do marsovských a slunečních období."
},

{
  id: "egypt", obdobi: "starovek", vrstva: "evropa", od: -3100, do: -30,
  nazev: "Starověký Egypt", podtitul: "Stará, Střední a Nová říše", datace: "cca 3 100 – 30 př. n. l.",
  ikona: "egypt_tutanchamon.jpg",
  strucne: "Tři tisíce let neměnného kánonu: pyramidy, chrámy, hieroglyfy a umění pro věčnost.",
  text: [
    "Egyptská civilizace vznikla sjednocením Horního a Dolního Egypta kolem roku 3 100 př. n. l., když vysychající Sahara zahnala obyvatelstvo k Nilu. Každoroční záplavy dávaly zemi řád a jistotu, který se otiskl do umění: faraon je bůh, vše má své pevné místo (princip Maat).",
    "Stará říše (2 700–2 180) je dobou pyramid: Džoserova stupňovitá pyramida v Sakkáře (architekt Imhotep), Cheopsova v Gíze (146 m). Střední říše přináší skalní hrobky a literaturu, Nová říše (1 550–1 070) obrovské chrámy v Karnaku a Luxoru, Údolí králů, Abú Simbel. Krátká Achnatonova reforma (Amarna, cca 1 350) uvolnila kánon – busta Nefertiti, portréty královské rodiny. Tutanchamonova hrobka (objevena 1922) ukazuje bohatství pohřební výbavy.",
    "Kánon zobrazení: hlava a nohy z profilu, oko a ramena zepředu; velikost postavy podle významu; přísná symetrie a klid. Sochy jsou frontální, blokové, určené pro věčnost v hrobce (ka). Malba je plošná, bez perspektivy, doplněná hieroglyfy."
  ],
  znaky: ["Kánon: profil + čelní pohled, hierarchie velikostí", "Monumentální kamenná architektura (pyramida, pylon, hypostyl)", "Umění pro posmrtný život", "Frontální, blokové sochy", "Hieroglyfy, papyrus, malba na omítce"],
  oblasti: { architektura: "Mastaba → stupňovitá → pravá pyramida; chrámy s pylony a hypostylovými sály (Karnak), skalní chrámy (Abú Simbel), Údolí králů.", socharstvi: "Rachefova socha, písař, Nefertiti, kolosy Memnonovy, Tutanchamonova maska; reliéf zapuštěný i vystouplý.", malirstvi: "Hrobky v Údolí králů a šlechtické hrobky (Nebamon), Kniha mrtvých na papyru, fajjúmské portréty (římská doba)." },
  faze: [{ nazev: "Stará říše", kdy: "2 700–2 180" }, { nazev: "Střední říše", kdy: "2 055–1 650" }, { nazev: "Nová říše", kdy: "1 550–1 070" }, { nazev: "Pozdní a ptolemaiovská", kdy: "664–30" }],
  osobnosti: ["Imhotep", "Cheops", "Hatšepsut", "Achnaton a Nefertiti", "Tutanchamon", "Ramesse II.", "Kleopatra VII."],
  cesko: "Český egyptologický ústav UK zkoumá pohřebiště v Abúsíru (Zbyněk Žába, Miroslav Verner, Miroslav Bárta); Náprstkovo muzeum.",
  pamatky: [
    { img: "egypt_dzoser.jpg", nazev: "Džoserova pyramida v Sakkáře", popis: "Nejstarší kamenná monumentální stavba světa, architekt Imhotep, cca 2 650 př. n. l." },
    { img: "egypt_giza.jpg", nazev: "Pyramidy v Gíze", popis: "Cheops, Rachef a Menkaure, cca 2 560–2 500 př. n. l. Jediný dochovaný div světa." },
    { img: "egypt_karnak.jpg", nazev: "Hypostylový sál v Karnaku", popis: "134 sloupů jako zkamenělý rákosový háj – řád (Maat) nad vodami chaosu. Nová říše." },
    { img: "egypt_abu_simbel.jpg", nazev: "Abú Simbel", popis: "Skalní chrám Ramesse II., 13. stol. př. n. l.; v 60. letech 20. století přesunut kvůli Asuánské přehradě." },
    { img: "egypt_nefertiti.jpg", nazev: "Busta Nefertiti", popis: "Vápenec a sádra, cca 1 345 př. n. l., dílna sochaře Thutmose v Amarně." },
    { img: "egypt_tutanchamon.jpg", nazev: "Tutanchamonova maska", popis: "Zlato, lapis lazuli, 11 kg, cca 1 323 př. n. l. Objevil Howard Carter 1922." }
  ],
  jung: { postoj: 0.6, nazevPostoje: "Okázalá, rigidní extraverze", funkce: "Myšlení & cítění (racionální osa)",
    text: "Totální podřízení individuality státně-náboženskému řádu. Hypostylový sál v Karnaku jako zkamenělý les představuje stabilitu řádu (Maat) nad nevědomými vodami chaosu (Nun); faraon je archetypem hrdiny-slunce. Přísný kánon = kolektivní identita místo osobní vize." },
  klima: "Záplavové zemědělství Nilu dává jistotu a periodicitu – základ neměnného kánonu. Krize přicházejí se suchem: konec Staré říše (4,2 tisíce let), kolaps doby bronzové a nájezdy mořských národů.",
  udalosti: ["sahara", "e4200", "bronz_kolaps"],
  pales: "Pyramidy Staré říše (Gíza, cca 2 560 př. n. l.) spadají do saturnského období Orifiela (2 726–2 372 př. n. l.) – ducha kamene a věčnosti; Achnatonova sluneční reforma do merkurského období Rafaela."
},

{
  id: "egejske", obdobi: "starovek", vrstva: "evropa", od: -2000, do: -1100,
  nazev: "Egejské kultury", podtitul: "Kréta (mínojská) a Mykény", datace: "cca 2 000 – 1 100 př. n. l.",
  ikona: "egejske_lvi_brana.jpg",
  strucne: "Radostné fresky krétských paláců a kyklopské hradby Mykén – předehra řeckého umění.",
  text: [
    "Na Krétě vzkvétá od 2 000 př. n. l. mínojská kultura (podle bájného krále Mínóa): palácové komplexy bez hradeb (Knóssos, Faistos) s labyrintem místností, světlíky a kanalizací, zdobené freskami delfínů, lilií, tanečnic a skoků přes býka. Umění je hravé, pohyblivé, „extravertní“ – svět Středomoří je přátelský.",
    "Kolem 1 600 př. n. l. vybuchla sopka Théra (Santorini); tsunami a popel oslabily Krétu, kterou ovládli válečnější Mykéňané z pevniny. Mykénská kultura (Mykény, Tíryns, Pylos) staví kyklopské hradby, Lví bránu a kupolové hrobky (Átreova pokladnice); zlaté masky z šachtových hrobů („Agamemnonova maska“) objevil Heinrich Schliemann. Homérova Ilias odráží svět mykénských králů a trojské války.",
    "Kolem 1 200 př. n. l. mykénský svět zaniká (kolaps doby bronzové) – následují „temná staletí“ bez písma, z nichž se rodí Řecko."
  ],
  znaky: ["Palácová architektura bez hradeb (Kréta) × kyklopské hradby (Mykény)", "Fresky s přírodními motivy, pohyb, radost", "Keramika mořského stylu (chobotnice)", "Zlaté masky, kupolové hrobky", "Lineární písmo A a B"],
  oblasti: { architektura: "Palác v Knóssu, Lví brána v Mykénách, Átreova pokladnice (nepravá kupole), megaron – předchůdce řeckého chrámu.", socharstvi: "Bohyně s hady (fajáns), rhyton ve tvaru býčí hlavy, Lví brána – nejstarší monumentální plastika Evropy.", malirstvi: "Fresky v Knóssu a Akrotiri (Théra): Princ s liliemi, Delfíni, Skok přes býka; malovaná keramika." },
  faze: [{ nazev: "Mínojská Kréta", kdy: "2 000–1 450" }, { nazev: "Mykénské Řecko", kdy: "1 600–1 100" }],
  osobnosti: ["Mínós (legenda)", "Daidalos (legenda)", "Arthur Evans", "Heinrich Schliemann"],
  cesko: "Doba bronzová u nás (mohylové kultury) je současníkem Mykén; jantar z Baltu putoval přes naše území do Řecka.",
  pamatky: [
    { img: "egejske_lvi_brana.jpg", nazev: "Lví brána v Mykénách", popis: "Cca 1 250 př. n. l. – kyklopské zdivo a reliéf lvic nad překladem." },
    { img: "egejske_knossos_byk.jpg", nazev: "Skok přes býka (Knóssos)", popis: "Freska z paláce, cca 1 450 př. n. l., Archeologické muzeum Heraklion." },
    { img: "egejske_maska.jpg", nazev: "Agamemnonova maska", popis: "Zlato, cca 1 550 př. n. l., Národní muzeum Athény." }
  ],
  jung: { postoj: 0.7, nazevPostoje: "Radostná extraverze (Kréta) → vojenský řád (Mykény)", funkce: "Vnímání & cítění",
    text: "Mínojské umění je vzácným příkladem „naivního“ (Schiller) splynutí s přírodou bez úzkosti – teplé moře jako spolehlivý živitel. Mykény přinášejí patriarchální hrdinský archetyp (Ilias)." },
  klima: "Teplá doba bronzová ve Středomoří; výbuch Théry (cca 1 600 př. n. l.) a sucho kolem 1 200 př. n. l. ukončují obě kultury.",
  udalosti: ["thera", "bronz_kolaps"],
  pales: "Trojská válka a zánik Mykén spadají do marsovského období Samaela (1 309–955 př. n. l.); rozkvět Kréty do jupiterského Zachariela a merkurského Rafaela (obchodní námořní říše)."
},

{
  id: "recko", obdobi: "starovek", vrstva: "evropa", od: -800, do: -146,
  nazev: "Řecká antika", podtitul: "archaické, klasické a helénistické období", datace: "cca 800 – 146 př. n. l.",
  ikona: "recko_parthenon.jpg",
  strucne: "Kolébka evropského umění: chrám s řády sloupů, ideální lidské tělo, divadlo a filosofie – „člověk mírou všech věcí“.",
  text: [
    "Po temných staletích vzniká z městských států (polis) nová kultura. Geometrické období (900–700) zná jen abstraktní ornament na vázách; archaické období (700–480) přináší první chrámy a strnulé sochy mladíků (kúros) a dívek (koré) s „archaickým úsměvem“ – vliv Egypta. Vítězství nad Peršany (480) otevírá klasické období (480–323): Periklovy Athény, Parthenón (Iktinos, Kallikratés, sochař Feidiás), Myrónův Diskobolos, Polykleitův kánon proporcí, Práxitelés. Alexandrovy výboje přinášejí helénismus (323–146): patos, pohyb a emoce (Laokoón, Níké Samothrácká, Pergamský oltář).",
    "Řecký chrám je „sochou“ v krajině: sloupy dórského, iónského a korintského řádu, optické korekce, harmonie proporcí. Sochařství objevuje kontrapost, anatomii a ideál krásy (kalokagathia – jednota krásy a dobra). Malba se dochovala hlavně na vázách (černofigurové, červenofigurové). Divadlo v Epidauru, olympijské hry a filosofie (Sókratés, Platón, Aristotelés) tvoří základ evropského myšlení.",
    "Řekové poprvé zobrazují člověka jako svobodnou bytost a svět jako poznatelný kosmos – proto se k nim Evropa vrací v renesanci i klasicismu."
  ],
  znaky: ["Sloupové řády: dórský, iónský, korintský", "Ideální nahé tělo, kontrapost, kánon proporcí", "Míra, harmonie, symetrie – lidské měřítko", "Vázové malířství (černo- a červenofigurové)", "Helénistický patos a pohyb"],
  oblasti: { architektura: "Parthenón, Erechtheion s karyatidami, Propylaje, Diův chrám v Olympii, divadlo v Epidauru, Mauzoleum v Halikarnassu, Pergamský oltář.", socharstvi: "Kúros a koré; Myrón, Polykleitos, Feidiás, Práxitelés, Lýsippos; Venuše Mélská, Níké Samothrácká, Laokoón.", malirstvi: "Exekiás, Eufronios (vázy); nástěnná malba známa z římských kopií; mozaiky (Alexandrova bitva)." },
  faze: [{ nazev: "Geometrické", kdy: "900–700" }, { nazev: "Archaické", kdy: "700–480" }, { nazev: "Klasické", kdy: "480–323" }, { nazev: "Helénistické", kdy: "323–146" }],
  osobnosti: ["Feidiás", "Iktinos a Kallikratés", "Myrón", "Polykleitos", "Práxitelés", "Lýsippos", "Periklés", "Alexandr Veliký"],
  cesko: "Antické sbírky Národního muzea a Univerzity Karlovy (odlitky); Keltové u nás obchodovali s řeckým světem (Bójové).",
  pamatky: [
    { img: "recko_parthenon.jpg", nazev: "Parthenón (Athény)", popis: "447–432 př. n. l., dórský chrám Athény Parthenos; sochařská výzdoba Feidiás." },
    { img: "recko_akropolis.jpg", nazev: "Athénská Akropole", popis: "Posvátný okrsek nad městem – Parthenón, Erechtheion, Propylaje." },
    { img: "recko_erechtheion.jpg", nazev: "Erechtheion – síň karyatid", popis: "Iónský chrám, 421–406 př. n. l.; sloupy nahrazeny postavami dívek." },
    { img: "recko_rady.jpg", nazev: "Řecké sloupové řády", popis: "Dórský, iónský a korintský řád – základ evropské architektury až do 20. století." },
    { img: "recko_epidauros.jpg", nazev: "Divadlo v Epidauru", popis: "4. stol. př. n. l., architekt Polykleitos mladší; 14 000 diváků, dokonalá akustika." },
    { img: "recko_pergamon.jpg", nazev: "Pergamský oltář", popis: "Helénismus, cca 180 př. n. l.; gigantomachie – boj bohů s giganty, patos a pohyb." }
  ],
  jung: { postoj: 0.8, nazevPostoje: "Harmonická extraverze", funkce: "Myšlení & vnímání (Te-Se)",
    text: "Apollonský princip: triumf vědomého rozumu (Athéna) nad dionýským chaosem a animální nevědomostí (gigantomachie). Worringerovo vcítění v absolutní rovnováze s řádem; oslava svobodného občana a lidské míry." },
  klima: "Řecké klimatické optimum – stabilní teplé počasí, rozkvět mořeplavby a obchodu; „Homérovo minimum“ (cca 800 př. n. l.) na počátku.",
  udalosti: ["bronz_kolaps", "rim_optimum"],
  pales: "Sluneční období Michaela (600–246 př. n. l.): zrození filosofie, demokracie a klasického umění – přesně to, co Páleš přisuzuje duchu Slunce, rozumu a individuality. Helénismus přechází do saturnského Orifiela."
},

{
  id: "etruskove", obdobi: "starovek", vrstva: "evropa", od: -800, do: -200,
  nazev: "Umění Etrusků", podtitul: "předřímská Itálie", datace: "cca 800 – 200 př. n. l.",
  ikona: null,
  strucne: "Tajemný národ střední Itálie: malované hrobky, terakotové sarkofágy manželů, bronzová vlčice a oblouk, který převzal Řím.",
  text: [
    "Etruskové obývali Toskánsko a Lazio a vytvořili spolek dvanácti měst. Jejich jazyk dosud plně nerozumíme; umění známe hlavně z nekropolí – „měst mrtvých“ (Cerveteri, Tarquinia). Kruhové mohylové hrobky (tumuly) napodobují interiéry domů a jsou vymalovány veselými hostinami, tanečníky, hudebníky a hrami – smrt jako pokračování života.",
    "Sochařství pracuje s terakotou a bronzem: Apollón z Vejí, sarkofág manželů z Cerveteri (usmívající se pár na hostině), Kapitolská vlčice, Chiméra z Arezza. Etruskové znají klenbu a oblouk, kanalizaci (Cloaca Maxima) a chrám na vysokém podiu – vše převzal Řím, který je ve 3. století př. n. l. pohltil."
  ],
  znaky: ["Nekropole s malovanými hrobkami", "Terakotová plastika, sarkofágy", "Bronzové odlévání (vlčice, Chiméra)", "Oblouk a klenba", "Radostný vztah ke smrti"],
  oblasti: { architektura: "Tumuly v Cerveteri, městské hradby, chrám na podiu (Veje), oblouk.", socharstvi: "Sarkofág manželů, Apollón z Vejí, Kapitolská vlčice, Chiméra z Arezza, Řečník (Arringatore).", malirstvi: "Hrobky v Tarquinii (hrobka Leopardů, Býků, Augurů), zrcadla s rytinami." },
  faze: [{ nazev: "Villanovská", kdy: "900–700" }, { nazev: "Orientalizující", kdy: "700–600" }, { nazev: "Archaická a klasická", kdy: "600–300" }],
  osobnosti: ["Vulca z Vejí (sochař)", "Lars Porsenna"],
  cesko: "Etruské bronzy a zboží se dostávaly přes Alpy i k Keltům ve střední Evropě (situly).",
  pamatky: [
    { img: "etruskove_sarkofag.jpg", nazev: "Sarkofág manželů (Cerveteri)", popis: "Terakota, cca 520 př. n. l., Villa Giulia v Římě." },
    { img: "etruskove_tarquinia.jpg", nazev: "Hrobka Leopardů (Tarquinia)", popis: "Nástěnná malba hostiny, cca 470 př. n. l." }
  ],
  jung: { postoj: 0.5, nazevPostoje: "Extravertní radost ze života", funkce: "Cítění & vnímání",
    text: "Vítězství smyslového cítění nad strachem ze smrti: hrobka jako hostina. Etruské umění je „naivní“ a bezprostřední – před římským racionálním myšlením." },
  klima: "Železná doba a mírné klima střední Itálie; rozvoj obchodu s Řeky a Féničany.",
  udalosti: ["rim_optimum"],
  pales: "Rozkvět etruských měst spadá do měsíčního (Gabriel) a slunečního (Michael) období; pohlcení Římem do saturnského Orifiela – ducha říší a kamene."
},

{
  id: "rim", obdobi: "starovek", vrstva: "evropa", od: -500, do: 476,
  nazev: "Římská antika", podtitul: "republika a císařství", datace: "cca 500 př. n. l. – 476 n. l.",
  ikona: "rim_akvadukt.jpg",
  strucne: "Inženýrství a moc: beton, klenba, akvadukty, Koloseum, Pantheon a realistický portrét vládců světové říše.",
  text: [
    "Řím převzal od Etrusků oblouk a od Řeků řády a sochařský ideál, ale přidal praktický duch: beton (opus caementicium), klenbu a kupoli, silnice, akvadukty, lázně, baziliky a amfiteátry. Architektura slouží státu a masám: Koloseum (80 n. l.) pro 50 000 diváků, Pantheon (cca 125) s kupolí o průměru 43 m, Trajánův sloup a vítězné oblouky oslavující císaře.",
    "Sochařství vyniká portrétem – veristické busty republikánských politiků s každou vráskou (úcta k předkům, voskové masky) a idealizované sochy císařů (Augustus z Prima Porta). Malířství známe z Pompejí a Herculanea, které roku 79 zasypal Vesuv: čtyři pompejské styly, iluzivní architektury, krajiny, zátiší a mozaiky.",
    "Za římského klimatického optima se říše rozprostírá od Británie po Egypt; její rozdělení (395) a pád Západořímské říše (476) uzavírají starověk. Římské právo, latina a města však tvoří základ Evropy."
  ],
  znaky: ["Oblouk, klenba, kupole, beton", "Užitková a reprezentativní architektura (fórum, bazilika, lázně, amfiteátr)", "Realistický portrét", "Historický reliéf (Trajánův sloup)", "Nástěnná malba a mozaika (Pompeje)"],
  oblasti: { architektura: "Pantheon, Koloseum, Pont du Gard, Forum Romanum, Trajánovo fórum, Caracallovy lázně, Diokleciánův palác ve Splitu.", socharstvi: "Augustus z Prima Porta, jezdecká socha Marka Aurelia, busty, sarkofágy, Trajánův sloup.", malirstvi: "Pompejské styly, Villa dei Misteri, fajjúmské portréty, mozaiky." },
  faze: [{ nazev: "Republika", kdy: "509–27 př. n. l." }, { nazev: "Principát", kdy: "27 př. n. l. – 284" }, { nazev: "Pozdní císařství", kdy: "284–476" }],
  osobnosti: ["Vitruvius", "Augustus", "Apollodóros z Damašku", "Hadrián", "Konstantin Veliký"],
  cesko: "Římská pevnost v Mušově na Moravě (Markomanské války, Marcus Aurelius u Hronu), nálezy římských importů; Antické sbírky.",
  pamatky: [
    { img: "rim_akvadukt.jpg", nazev: "Pont du Gard (Francie)", popis: "Akvadukt z 1. stol. n. l., 49 m vysoký; voda pro Nîmes – inženýrství jako umění." },
    { img: "rim_tetrarchove.jpg", nazev: "Tetrarchové (Benátky)", popis: "Porfyr, cca 300 n. l. – pozdně antický přechod od realismu k strnulé symbolice." },
    { img: "rim_pantheon.jpg", nazev: "Pantheon (Řím)", popis: "Kupole o průměru 43,3 m s okulem, cca 125 n. l." },
    { img: "rim_koloseum.jpg", nazev: "Koloseum", popis: "Flaviovský amfiteátr, 72–80 n. l." }
  ],
  jung: { postoj: 0.7, nazevPostoje: "Praktická extraverze", funkce: "Myšlení & vnímání",
    text: "Extravertní myšlení: svět je materiál k organizaci. Portrét = úcta k reálné osobě, ne ideálu. V pozdní antice (Tetrarchové) začíná odhmotnění a obrat k introverzi – příchod křesťanství." },
  klima: "Římské klimatické optimum (250 př. n. l. – 400 n. l.) sytí říši; jeho konec, sucha a stěhování národů přispívají k pádu Říma. Výbuch Vesuvu 79 n. l. konzervuje Pompeje.",
  udalosti: ["rim_optimum", "vesuv"],
  pales: "Římské císařství (Augustus, Pantheon, akvadukty) spadá do saturnského období Orifiela (246 př. n. l. – 108 n. l.) – ducha kamene, řádu a císařů; Velká čínská zeď vzniká v témže cyklu."
},

{
  id: "krestanska_antika", obdobi: "starovek", vrstva: "evropa", od: 200, do: 550,
  nazev: "Křesťanská antika", podtitul: "raně křesťanské umění", datace: "cca 200 – 550 n. l.",
  ikona: "krestanska_dobry_pastyr.jpg",
  strucne: "Z katakomb do bazilik: symboly ryby a Dobrého pastýře, mozaiky se zlatým pozadím – umění nové víry.",
  text: [
    "První křesťané tvoří skrytě v římských katakombách: jednoduché symboly (ryba, kotva, Kristův monogram), Dobrý pastýř, orantky. Po Milánském ediktu (313) císař Konstantin staví první velké kostely – baziliky (podélné, se sloupy, s apsidou) a centrální stavby (Santa Costanza, baptisteria).",
    "Umění přebírá antické formy, ale mění jejich smysl: tělo se odhmotňuje, důležitý je pohled a gesto, zlaté pozadí ruší prostor. Vrcholem jsou mozaiky v Ravenně (mauzoleum Gally Placidie, Sant'Apollinare Nuovo, San Vitale) – most k Byzanci. Vznikají iluminované rukopisy (Rossanský kodex) a řezby ze slonoviny."
  ],
  znaky: ["Symbolika (ryba, beránek, pastýř, chí-ró)", "Bazilika a centrála", "Mozaika se zlatým pozadím", "Odhmotnění těla, frontálnost", "Sarkofágy s biblickými výjevy"],
  oblasti: { architektura: "Stará bazilika sv. Petra, Santa Maria Maggiore, Santa Costanza, Lateránské baptisterium, mauzoleum Gally Placidie.", socharstvi: "Sarkofág Junia Bassa, slonovinové diptychy, Dobrý pastýř (socha).", malirstvi: "Katakomby Priscilly a Kalixta, mozaiky Ravenny, Rossanský kodex." },
  faze: [{ nazev: "Katakombové", kdy: "200–313" }, { nazev: "Konstantinovské", kdy: "313–400" }, { nazev: "Ravennské", kdy: "400–550" }],
  osobnosti: ["Konstantin Veliký", "Galla Placidia", "sv. Ambrož", "Theodorich"],
  cesko: "Křesťanství přichází až v 9. století (Velká Morava); raně křesťanské formy (rotunda, bazilika) ovlivnily naše nejstarší kostely.",
  pamatky: [
    { img: "krestanska_dobry_pastyr.jpg", nazev: "Dobrý pastýř (Ravenna)", popis: "Mozaika v mauzoleu Gally Placidie, cca 425 – Kristus jako antický pastýř." },
    { img: "krestanska_sant_apollinare.jpg", nazev: "Sant'Apollinare Nuovo (Ravenna)", popis: "Průvod mučedníků, 6. století – rytmus, frontálnost, zlaté pozadí." },
    { img: "krestanska_santa_costanza.jpg", nazev: "Santa Costanza (Řím)", popis: "Mozaika klenby, 4. století – vinná réva, ptáci, antický dekor s novým smyslem." }
  ],
  jung: { postoj: -0.3, nazevPostoje: "Obrat k introverzi", funkce: "Cítění & intuice",
    text: "Krize antického světa vede k odvrácení od těla a pozemského světa k nebeskému řádu: obraz už není okno do světa, ale znamení neviditelného. Počátek transcendentního cyklu (Neumann: od hrdiny k duchovní transformaci)." },
  klima: "Konec římského klimatického optima, ochlazení a sucha ve 3.–5. století, stěhování národů; rok 536 a justiniánský mor uzavírají antiku.",
  udalosti: ["rim_optimum", "lalia"],
  pales: "Podle Páleše je 108–463 n. l. venušské období Anaela – ducha lásky a krásy: šíření křesťanství s poselstvím lásky k bližnímu a něžná symbolika katakomb tomu odpovídají."
},

];

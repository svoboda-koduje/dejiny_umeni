# =====================================================================
#  Časová osa dějin umění – doplnění obrazových ukázek z Wikimedia Commons (listopad 2026)
#  Spuštění: poklepejte na STAHNI-OBRAZKY-3.cmd ve stejné složce.
#  Skript stáhne chybějící ukázky (existující soubory v img/ nepřepisuje), zmenší je
#  na delší stranu 1200 px (náhled 500 px), uloží jako JPEG a zapíše protokol
#  commons-protokol-3.csv (soubor, zdroj, autor, licence). Na konci vypíše velikost webu.
# =====================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$imgDir = Join-Path $root "img"; $thDir = Join-Path $imgDir "thumb"
New-Item -ItemType Directory -Force -Path $imgDir, $thDir | Out-Null
$UA = "CasovaOsaDejinUmeni/1.0 (https://svoboda-koduje.github.io/dejiny_umeni/; svoboda@spse.cz)"
$log = @(); $missing = @()

$polozky = @(
  @{ f='mezolit_sigirsky_idol.jpg'; t='Shigir Idol (May 2024) - 1.jpg'; w=2451; h=7778 },
  @{ f='mezolit_lepenski_vir.jpg'; t='Lepenski Vir Head.JPG'; w=1536; h=2048 },
  @{ f='mezolit_star_carr.jpg'; t='Star Carr headdress.jpg'; w=4896; h=3672 },
  @{ f='mezolit_azil_oblazky.jpg'; t='Azilian painted pebbles from the cave of Le Mas d''Azil. Wellcome M0015173.jpg'; w=2717; h=3871 },
  @{ f='neolit_myslitel_hamangia.jpg'; t='Bucharest - The Thinker of Cernavoda - img.jpg'; w=3024; h=4032 },
  @{ f='neolit_skara_brae.jpg'; t='Skara Brae - geograph.org.uk - 3912232.jpg'; w=0; h=0 },
  @{ f='eneolit_varna_zlato.jpg'; t='Gold treasure, 4600-4200 BC, AM Varna, Varm24.jpg'; w=3231; h=2261 },
  @{ f='eneolit_carnac.jpg'; t='Alignement Menec Carnac.jpg'; w=3936; h=2615 },
  @{ f='eneolit_cucuteni.jpg'; t='Two painted pottery jar. Cucuteni-Tripolje culture. Neues Museum.jpg'; w=2709; h=2048 },
  @{ f='eneolit_zvoncovity_pohar.jpg'; t='020210828 Vessels, Corded Ware Culture 5, Bell Beaker Culture 6, early neolithic artifacts in Silesia, Opole.jpg'; w=3426; h=2374 },
  @{ f='bronz_zlaty_klobouk.jpg'; t='Neues Museum Berlin gold hat 0125.jpg'; w=5504; h=8256 },
  @{ f='bronz_tanum.jpg'; t='Tanumshede 2005 rock carvings 7.jpg'; w=1632; h=1232 },
  @{ f='bronz_lury.jpg'; t='Nationalmuseet - lur - 1020004.jpg'; w=2560; h=1920 },
  @{ f='zelezo_byci_skala.jpg'; t='Býčí skála Cave predsin.JPG'; w=0; h=0 },
  @{ f='zelezo_gundestrup.jpg'; t='Gundestrup cauldron 2005.jpg'; w=0; h=0 },
  @{ f='zelezo_vix_krater.jpg'; t='Châtillon-sur-Seine (21) Musée du Pays Châtillonnais - Cratère de Vix - 01.jpg'; w=0; h=0 },
  @{ f='mezopotamie_standarta_ur.jpg'; t='Standard of Ur - War.jpg'; w=2202; h=963 },
  @{ f='mezopotamie_lamassu.jpg'; t='Lamassu du palais de Khorsabad, Musée du Louvre.jpg'; w=1960; h=4032 },
  @{ f='mezopotamie_lov_lvu.jpg'; t='Ashurbanipal''s lion-hunt scene, wall relief, 7th century BC, from Nineveh, the British Museum.jpg'; w=6016; h=4016 },
  @{ f='egejske_kykladsky_idol.jpg'; t='Marble cycladic figurine N°5107, NAMAthens, Greece.jpg'; w=2727; h=4301 },
  @{ f='egejske_hadi_bohyne.jpg'; t='Snake Goddess Crete 1600BC.jpg'; w=802; h=1216 },
  @{ f='egejske_knossos_palac.jpg'; t='Knossos north entrance, Crete 001.JPG'; w=4288; h=2848 },
  @{ f='etruskove_apollon_veje.jpg'; t='Apollo di Veio - Museo di Villa Giulia 1.jpg'; w=1500; h=2000 },
  @{ f='etruskove_chimera.jpg'; t='Chimera of Arezzo Copy.JPG'; w=4000; h=2630 },
  @{ f='etruskove_vlcice.jpg'; t='Lupa Capitolina, Rome.jpg'; w=7489; h=4876 },
  @{ f='etruskove_banditaccia.jpg'; t='Banditaccia (Cerveteri)DSCF6681.jpg'; w=4000; h=3000 },
  @{ f='rim_augustus_prima_porta.jpg'; t='Augustus of Prima Porta (inv. 2290).jpg'; w=2813; h=4500 },
  @{ f='rim_villa_misteri.jpg'; t='Villa of the Mysteries (Pompeii) - Hall of the Mysteries-North east corner.jpg'; w=4032; h=1908 },
  @{ f='krestanska_galla_placidia.jpg'; t='Mausoleum of Galla Placidia ceiling mosaics.jpg'; w=3935; h=3135 },
  @{ f='krestanska_junius_bassus.jpg'; t='Sarcophagus of Junius Bassus - Cast in Rome.jpg'; w=1143; h=812 },
  @{ f='krestanska_katakomby.jpg'; t='Catacomb of Priscilla - Annunciation.jpg'; w=1339; h=1166 },
  @{ f='rany_sutton_hoo.jpg'; t='Replica of Sutton Hoo helmet - geograph.org.uk - 7020637.jpg'; w=1200; h=1600 },
  @{ f='rany_lindisfarne.jpg'; t='Meister des Book of Lindisfarne 002 2.jpg'; w=2024; h=2408 },
  @{ f='romansky_bayeux.jpg'; t='Bayeux Tapestry scene57 Harold death.jpg'; w=2948; h=2568 },
  @{ f='romansky_pisa.jpg'; t='Here it is, The Piazza dei Miracoli! Pisa, Italy.jpg'; w=3333; h=2339 },
  @{ f='romansky_rotunda_martin.jpg'; t='Praha, rotunda svatého Martina (2012).JPG'; w=2260; h=2708 },
  @{ f='romansky_vysehradsky_kodex.jpg'; t='Codex Vyssegradensis facsimile.jpg'; w=5184; h=3456 },
  @{ f='gotika_madona_veveri.jpg'; t='Madona z Veveří.JPG'; w=1645; h=2098 },
  @{ f='gotika_velislavova_bible.jpg'; t='Stvorenisveta velislav.jpg'; w=900; h=1180 },
  @{ f='renesance_veronese_kana.jpg'; t='Les Noces de Cana - Paolo Veronese - Musée du Louvre Peintures INV 142 ; MR 384.jpg'; w=10068; h=6742 },
  @{ f='renesance_bellini_svatek.jpg'; t='Giovanni Bellini and Titian - The Feast of the Gods - Google Art Project.jpg'; w=4034; h=3732 },
  @{ f='baroko_velazquez_meniny.jpg'; t='Las Meninas, by Diego Velázquez, from Prado in Google Earth.jpg'; w=26065; h=30000 },
  @{ f='baroko_zurbaran_agnus.jpg'; t='Agnus Dei Zurbarán.jpg'; w=3050; h=1822 },
  @{ f='rokoko_watteau_kythera.jpg'; t='L''Embarquement pour Cythère, by Antoine Watteau, from C2RMF retouched.jpg'; w=19842; h=13013 },
  @{ f='rokoko_boucher_pompadour.jpg'; t='François Boucher Madame de Pompadour Munich 26102016 5.jpg'; w=3628; h=2403 },
  @{ f='rokoko_wieskirche.jpg'; t='Wieskirche 12.jpg'; w=3155; h=5734 },
  @{ f='klasicismus_canova_amor.jpg'; t='Psyché ranimée par le baiser de l''Amour, Louvre.jpg'; w=8077; h=5993 },
  @{ f='klasicismus_ingres_odaliska.jpg'; t='Ingre, Grande Odalisque.jpg'; w=0; h=0 },
  @{ f='klasicismus_stavovske.jpg'; t='Praha Stavovské divadlo 1.jpg'; w=2000; h=1215 },
  @{ f='romantismus_gericault_vor.jpg'; t='Théodore Géricault "The raft of the Medusa".jpg'; w=1410; h=995 },
  @{ f='romantismus_goya_3kveten.jpg'; t='El Tres de Mayo, by Francisco de Goya, from Prado thin black margin.jpg'; w=29294; h=22626 },
  @{ f='romantismus_manes_josefina.jpg'; t='Josefina, Josef Mánes.jpg'; w=9677; h=12028 },
  @{ f='historismus_westminster.jpg'; t='Palace of Westminster, London - Feb 2007.jpg'; w=3200; h=1261 },
  @{ f='historismus_neuschwanstein.jpg'; t='Neuschwanstein Castle 2024-02.jpg'; w=15083; h=10270 },
  @{ f='historismus_narodni_muzeum.jpg'; t='Národní muzeum Nová budova 2.jpg'; w=2048; h=1322 },
  @{ f='historismus_myslbek_vaclav.jpg'; t='Pomník svatého Václava a Národní muzeum.jpg'; w=2272; h=1704 },
  @{ f='realismus_millet_sberacky.jpg'; t='Jean-François Millet - Gleaners - Google Art Project 2.jpg'; w=5354; h=4006 },
  @{ f='realismus_courbet_ornans.jpg'; t='Gustave Courbet - A Burial at Ornans - Google Art Project.jpg'; w=6045; h=2779 },
  @{ f='realismus_daumier_vagon.jpg'; t='Honoré Daumier (French, Marseilles 1808–1879 Valmondois) - The Third-Class Carriage - Google Art Project.jpg'; w=3812; h=2757 },
  @{ f='impresionismus_renoir_moulin.jpg'; t='Renoir, Pierre-Auguste - Dance at Le Moulin de la Galette, 1876.jpg'; w=40869; h=30379 },
  @{ f='impresionismus_degas_tridy.jpg'; t='Degas- La classe de danse 1874.jpg'; w=0; h=0 },
  @{ f='impresionismus_monet_lekniny.jpg'; t='Claude Monet - Water Lilies - Google Art Project.jpg'; w=5610; h=5269 },
  @{ f='impresionismus_slavicek.jpg'; t='Antonín Slavíček - Eliscin Bridge.JPG'; w=0; h=0 },
  @{ f='postimpresionismus_slunecnice.jpg'; t='Vincent van Gogh - Sunflowers (1888, National Gallery London).jpg'; w=4719; h=6000 },
  @{ f='postimpresionismus_gauguin.jpg'; t='Gauguin - Where Do We Come From? What Are We? Where Are We Going? (1897-98).jpg'; w=5400; h=1987 },
  @{ f='postimpresionismus_seurat.jpg'; t='A Sunday on La Grande Jatte, Georges Seurat, 1884.jpg'; w=20000; h=13313 },
  @{ f='postimpresionismus_lautrec.jpg'; t='(Albi) Moulin-rouge. La Goulue et Valentin le desossé - Toulouse-Lautrec 1891 - Inv.138.jpg'; w=3633; h=5120 },
  @{ f='secese_horta_tassel.jpg'; t='Tassel House stairway.JPG'; w=0; h=0 },
  @{ f='secese_wagner_majolika.jpg'; t='Majolikahaus, Wien, Otto Wagner.jpg'; w=3000; h=2867 },
  @{ f='secese_moreau_zjeveni.jpg'; t='Gustave Moreau - The Apparition - 1943.268 - Fogg Museum.jpg'; w=2011; h=2400 },
  @{ f='fauvismus_matisse_klobouk.jpg'; t='Henri Matisse, Woman with a Hat (Femme au chapeau), SFMOMA 01.jpg'; w=3000; h=4000 },
  @{ f='fauvismus_matisse_radost.jpg'; t='Le Bonheur de vivre Barnes (01c) - Flickr - rverc.jpg'; w=3622; h=2599 },
  @{ f='fauvismus_derain_collioure.jpg'; t='Montagnes à Collioure, par André Derain.jpg'; w=5544; h=4377 },
  @{ f='fauvismus_derain_londyn.jpg'; t='Charing Cross Bridge by Andre Derain (52259664204).jpg'; w=5472; h=3648 },
  @{ f='fauvismus_dufy.jpg'; t='La Rue pavoisée.jpg'; w=802; h=1000 },
  @{ f='expresionismus_marc_kun.jpg'; t='Marc, Franz - Blue Horse I - Google Art Project.jpg'; w=3881; h=5180 },
  @{ f='expresionismus_schiele.jpg'; t='Egon Schiele - Self-Portrait with Physalis - Google Art Project.jpg'; w=3781; h=3062 },
  @{ f='expresionismus_kirchner_zeny.jpg'; t='Kirchner - Fünf Frauen auf der Straße.jpg'; w=1200; h=1568 },
  @{ f='kubismus_gris_picasso.jpg'; t='Juan Gris - Portrait of Pablo Picasso - Google Art Project.jpg'; w=6221; h=7913 },
  @{ f='kubismus_chochol_dum.jpg'; t='Praha Cubist house Neklanova.jpg'; w=0; h=0 },
  @{ f='kubismus_lampa.jpg'; t='Praha, Nové Město, kubistická lampa II.jpg'; w=4722; h=3142 },
  @{ f='abstrakce_kandinsky_kompozice.jpg'; t='Composition VII - Wassily Kandinsky, GAC.jpg'; w=7015; h=4661 },
  @{ f='abstrakce_mondrian.jpg'; t='Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg'; w=0; h=0 },
  @{ f='abstrakce_klee.jpg'; t='Senecio (Baldgreis), Klee 1080998.jpg'; w=2925; h=3173 },
  @{ f='futurismus_boccioni_mesto.jpg'; t='The City Rises by Umberto Boccioni 1910.jpg'; w=2583; h=1715 },
  @{ f='futurismus_boccioni_stavy.jpg'; t='States of Mind- The Farewells by Umberto Boccioni, 1911.jpeg'; w=1072; h=807 },
  @{ f='futurismus_russolo_auto.jpg'; t='Luigi Russolo dynamism-of-a-car-1913.jpg'; w=0; h=0 },
  @{ f='futurismus_santelia.jpg'; t='Antonio sant''elia, la città nuova, via secondaria per pedoni, 1914 (coll. priv.).jpg'; w=2700; h=4854 },
  @{ f='futurismus_marinetti.jpg'; t='Zang Tumb Tumb, 1912, Filippo Tommaso Marinetti, Tate Modern, London 03.jpg'; w=991; h=1590 },
  @{ f='dada_hugo_ball.jpg'; t='Hugo Ball Cabaret Voltaire.jpg'; w=507; h=691 },
  @{ f='dada_cabaret_voltaire.jpg'; t='Zürich - Cabaret Voltaire (48687833078).jpg'; w=5184; h=3456 },
  @{ f='dada_picabia_oko.jpg'; t='Francis Picabia, 1921, L''oeil cacodylate, oil and collage on canvas, 148.6 x 117.4 cm, Musée National d''Art Moderne.jpg'; w=629; h=800 },
  @{ f='dada_taeuber_hlava.jpg'; t='Dada Head by Sophie Taeuber-Arp, 1920.jpg'; w=1386; h=3084 },
  @{ f='dada_soiree.jpg'; t='Theo van Doesburg and Kurt Schwitters, Kleine Dada Soirée (Small Dada Evening), 1922, NGA 154076.jpg'; w=3975; h=4000 },
  @{ f='konstruktivismus_bauhaus.jpg'; t='Dessau Bauhaus-Gebäude asv2024-06 img1.jpg'; w=6202; h=3876 },
  @{ f='konstruktivismus_lisickij.jpg'; t='Beat the Whites with the Red Wedge.jpg'; w=1920; h=1572 },
  @{ f='konstruktivismus_rietveld.jpg'; t='Rietveld-SchroderhuisUtrechttheNetherlands.jpg'; w=2420; h=1940 },
  @{ f='parizska_modigliani.jpg'; t='Jeanne Hébuterne (1918) by Amedeo Modigliani (Norton Simon Museum).jpg'; w=2995; h=4154 },
  @{ f='parizska_modigliani_akt.jpg'; t='Amedeo Modigliani Reclining Nude The Metropolitan Museum of Art.jpg'; w=3373; h=2172 },
  @{ f='parizska_soutine.jpg'; t='Chaim Soutine - Carcass of Beef - 57.12 - Minneapolis Institute of Arts.jpg'; w=4847; h=6862 },
  @{ f='parizska_rousseau_tygr.jpg'; t='Surprised-Rousseau.jpg'; w=3000; h=2397 },
  @{ f='surrealismus_cahun.jpg'; t='Claude Cahun - I Am in Training Don''t Kiss Me.jpg'; w=0; h=0 },
  @{ f='surrealismus_nash.jpg'; t='Totes Meer (Dead Sea) 1940-1 Paul Nash.jpg'; w=0; h=0 },
  @{ f='surrealismus_las_pozas.jpg'; t='Xilitla Las Pozas 0407 036.jpg'; w=2816; h=2112 },
  @{ f='abstraktni_rothko_kaple.jpg'; t='Broken Obelisk in front of the Rothko Chapel -- Houston, Texas.jpg'; w=1980; h=2646 },
  @{ f='abstraktni_pollock_dum.jpg'; t='Pollock-Krasner House studio floor 2.jpg'; w=3264; h=2448 },
  @{ f='abstraktni_tapies.jpg'; t='Fundació Antoni Tàpies, Barcelona.jpg'; w=4643; h=3807 },
  @{ f='popart_lichtenstein_hlava.jpg'; t='CAP de Barcelona - panoramio.jpg'; w=0; h=0 },
  @{ f='popart_oldenburg_kornout.jpg'; t='Neumarkt-Galerie, Köln mit Skulptur Dropped Cone - Claes Oldenburg und Coosje van Bruggen-8364.jpg'; w=3210; h=3224 },
  @{ f='popart_oldenburg_lahev.jpg'; t='Bottle of Notes sculpture, Middlesbrough - geograph.org.uk - 5469140.jpg'; w=5202; h=3465 },
  @{ f='kineticke_calder.jpg'; t='Alexandre Calder, L''Homme, 1967 (8925599924).jpg'; w=0; h=0 },
  @{ f='kineticke_tinguely.jpg'; t='Basel Fasnachtsbrunnen Jean Tinguely.JPG'; w=2560; h=1600 },
  @{ f='kineticke_tinguely_heureka.jpg'; t='Jean Tinguely - Heureka - Gesamtansicht - Zürich 2011.jpg'; w=0; h=0 },
  @{ f='kineticke_agam.jpg'; t='PikiWiki Israel 8440 water-fire by yaacov agam.jpg'; w=2048; h=1536 },
  @{ f='performance_abramovic.jpg'; t='Marina Abramović, The Artist Is Present, 2010Marina Abramović, The Artist Is Present, 2010 (4422516908).jpg'; w=2276; h=1795 },
  @{ f='performance_beuys_duby.jpg'; t='7000 Eichen - Joseph-Beuys-Straße 2019-03-23 c.JPG'; w=3264; h=2448 },
  @{ f='performance_fluxus.jpg'; t='Fluxus1964.jpg'; w=0; h=0 },
  @{ f='performance_paik.jpg'; t='The More, the Better (다다익선(多多益善)) 백남준 PAIK Namjune(1932~2006).jpg'; w=5206; h=3471 },
  @{ f='land_smithson_emmen.jpg'; t='Broken Circle - Spiral Hill, Robert Smithson - Q2867150 - 5.jpg'; w=3841; h=2881 },
  @{ f='land_goldsworthy.jpg'; t='Andy Goldsworthy-Fold2.jpg'; w=2272; h=1704 },
  @{ f='land_turrell_kielder.jpg'; t='Skyspace, Kielder Forest - geograph.org.uk - 599168.jpg'; w=640; h=480 },
  @{ f='land_christo_mastaba.jpg'; t='The Serpentine with "The Mastaba" massive temporary sculpture (geograph 5815020).jpg'; w=3648; h=2736 },
  @{ f='postmoderna_venturi.jpg'; t='Vanna Venturi House in Chestnut Hill, Philadelphia, Pennsylvania LCCN2011631388.jpg'; w=0; h=0 },
  @{ f='postmoderna_portland.jpg'; t='Portland Building 1982.jpg'; w=864; h=1030 },
  @{ f='postmoderna_bilbao.jpg'; t='Museo Guggenheim -- 2021 -- Bilbao, Euskadi, España.jpg'; w=5374; h=3359 },
  @{ f='postmoderna_att.jpg'; t='550 Madison Avenue July2015.JPG'; w=1510; h=1365 },
  @{ f='svet_capivara.jpg'; t='Serra da Capivara - Several Paintings 1.jpg'; w=0; h=0 },
  @{ f='svet_bhimbetka.jpg'; t='Rock painting, Bhimbetka, Raisen district, MP.jpg'; w=3888; h=2592 },
  @{ f='svet_apollo11.jpg'; t='Apollo 11 Cave painting 1.jpg'; w=4000; h=3000 },
  @{ f='svet_diepkloof.jpg'; t='Iziko engraving ostrich eggshell.JPG'; w=2690; h=1512 },
  @{ f='svet_gwion.jpg'; t='Bradshaw rock paintings.jpg'; w=1024; h=683 },
  @{ f='svet_murujuga.jpg'; t='Nganjarli Murujuga Rock Art 01.jpg'; w=0; h=0 },
  @{ f='svet_burrungkuy.jpg'; t='Aboriginal rock art, Nourlangie Rock, Kakadu - panoramio.jpg'; w=2816; h=1872 },
  @{ f='svet_laura.jpg'; t='Dingo painting, Split Rock, Australian Aboriginal Art site, Laura, North Queensland.jpg'; w=0; h=0 },
  @{ f='svet_kura.jpg'; t='Unknown ARTIST - Kunwinjku people - Wambiddyer anteater - Google Art Project.jpg'; w=0; h=0 },
  @{ f='svet_cina_zakazane_mesto.jpg'; t='Hall of Supreme Harmony 2010.jpg'; w=8811; h=1736 },
  @{ f='svet_cina_ding.jpg'; t='Shang Bronze Tripod Ding 03.jpg'; w=5184; h=3456 },
  @{ f='svet_cina_qingming.jpg'; t='Along the River During the Qingming Festival (Qing Court Version).jpg'; w=56531; h=1700 },
  @{ f='svet_cina_mogao.jpg'; t='Mural - Mogao Caves, Dunhuang.jpg'; w=1810; h=1446 },
  @{ f='svet_indie_knez.jpg'; t='Priest King (Sculpture) of Mohenjo-daro.jpg'; w=1756; h=4000 },
  @{ f='svet_indie_sanchi.jpg'; t='Stupa 1, Sanchi 02.jpg'; w=4953; h=3302 },
  @{ f='svet_indie_adzanta.jpg'; t='Bodhisattva Padmapani, cave 1, Ajanta, India.jpg'; w=1797; h=2104 },
  @{ f='svet_indie_khadzuraho.jpg'; t='The Kandariya Mahadeva Temple, Khajuraho, Madhya Pradesh.jpg'; w=0; h=0 },
  @{ f='svet_persie_behistun.jpg'; t='Behistun inscription reliefs.jpg'; w=0; h=0 },
  @{ f='svet_persie_pasargady.jpg'; t='Tomb of Cyrus the Great.jpg'; w=783; h=1175 },
  @{ f='svet_persie_naks_rostam.jpg'; t='20101229 Naqsh e Rostam Shiraz Iran more Panoramic.jpg'; w=9500; h=2641 },
  @{ f='svet_persie_lucistnici.jpg'; t='Archers frieze Darius 1st Palace Suse Louvre AOD 488 a.jpg'; w=2540; h=4098 },
  @{ f='svet_persie_ktesifon.jpg'; t='Ctesiphon, Iraq, 1932.jpg'; w=3873; h=2826 },
  @{ f='islam_skalni_dom.jpg'; t='Jerusalem-2013-Temple Mount-Dome of the Rock & Chain 02.jpg'; w=5000; h=7039 },
  @{ f='islam_sulejmanie.jpg'; t='Süleymaniye Mosque, Istanbul, 20260606 0805 1307.jpg'; w=3272; h=4907 },
  @{ f='islam_lotfollah.jpg'; t='Isfahan Lotfollah mosque ceiling symmetric.jpg'; w=2981; h=1996 },
  @{ f='islam_behzad.jpg'; t='Kamal-ud-din Bihzad - Construction of the fort of Kharnaq.jpg'; w=0; h=0 },
  @{ f='svet_japonsko_horjudzi.jpg'; t='Horyu-ji46n3990.jpg'; w=3990; h=2660 },
  @{ f='svet_japonsko_kinkakudzi.jpg'; t='Kinkaku-ji in November 2016 -02.jpg'; w=3343; h=4457 },
  @{ f='svet_japonsko_hirosige.jpg'; t='Hiroshige, Sudden shower over Shin-Ōhashi bridge and Atake, 1857.jpg'; w=5357; h=8117 },
  @{ f='svet_japonsko_utamaro.jpg'; t='Kitagawa Utamaro - Toji san bijin (Three Beauties of the Present Day)From Bijin-ga (Pictures of Beautiful Women), published by Tsutaya Juzaburo - Google Art Project.jpg'; w=5621; h=8231 },
  @{ f='svet_mezo_teotihuacan.jpg'; t='Pyramid of the Sun, Teotihuacan, from path to parking lot.jpg'; w=5424; h=3168 },
  @{ f='svet_mezo_palenque.jpg'; t='Temple of Inscriptions, Palenque (2088170629).jpg'; w=2592; h=1944 },
  @{ f='svet_mezo_kamen_slunce.jpg'; t='Monolito de la Piedra del Sol.jpg'; w=3648; h=2736 },
  @{ f='svet_mezo_bonampak.jpg'; t='Bonampak, Chiapas. 08.JPG'; w=4272; h=2848 },
  @{ f='svet_andy_brana_slunce.jpg'; t='Tiwanaku, Bolivia - Gate of the Sun, 2017.jpg'; w=3264; h=2448 },
  @{ f='svet_andy_moche.jpg'; t='Portrait Vessel of a Ruler, 100 BC - 500 AD, Moche, north coast of Peru, ceramic and pigment - Art Institute of Chicago - DSC00321.JPG'; w=2646; h=3923 },
  @{ f='svet_andy_paracas.jpg'; t='Paracas textile, British Museum.jpg'; w=2251; h=2371 },
  @{ f='svet_andy_sacsayhuaman.jpg'; t='Sacsayhuamán Décembre 2006 - Vue Panoramique - Pleine résolution.jpg'; w=20064; h=2068 },
  @{ f='svet_afrika_nok.jpg'; t='Head, Nok culture, terracotta, Honolulu Museum of Art, 8349.1.JPG'; w=1650; h=3264 },
  @{ f='svet_afrika_zimbabwe.jpg'; t='Western Entrance to the Great Enclosure - Great Zimbabwe II (46698655045).jpg'; w=5351; h=3362 },
  @{ f='svet_afrika_lalibela.jpg'; t='Lalibela, san giorgio, esterno 24.jpg'; w=6748; h=5848 },
  @{ f='svet_afrika_djenne.jpg'; t='MaliDjennéMosquée.JPG'; w=4521; h=2094 },
  @{ f='svet_asie_bayon.jpg'; t='20171127 Bayon Temple Angkor Thom 4754 DxO.jpg'; w=2504; h=3780 },
  @{ f='svet_asie_prambanan.jpg'; t='Yogyakarta Indonesia Prambanan-temple-complex-02.jpg'; w=5703; h=2658 },
  @{ f='svet_asie_bagan.jpg'; t='Old Bagan, Myanmar, Golden Buddhist spire over Bagan plains, Ancient pagodas and temples.jpg'; w=4000; h=3000 },
  @{ f='svet_asie_myson.jpg'; t='2024 - Mỹ Sơn Sanctuary Temple E7 - img 01.jpg'; w=4032; h=3024 },
  @{ f='svet_oceanie_nan_madol.jpg'; t='Nan madol.jpg'; w=1800; h=1180 },
  @{ f='svet_oceanie_wharenui.jpg'; t='Whare Runanga poupou and tukutuku 2.jpg'; w=3240; h=4320 },
  @{ f='svet_oceanie_malagan.jpg'; t='Malagan carvings.jpg'; w=2000; h=3008 },
  @{ f='svet_oceanie_bis.jpg'; t='Indonesia, jipimanam, pali di antenati bisj da papuasia occidentale, XX sec. 02.JPG'; w=3648; h=2736 },
  @{ f='svet_oceanie_ku.jpg'; t='Ku guardian statue (2).jpg'; w=3024; h=4032 }
)

function Get-Md5Hex([string]$s) {
  $md5 = [Security.Cryptography.MD5]::Create()
  return (($md5.ComputeHash([Text.Encoding]::UTF8.GetBytes($s)) | ForEach-Object { $_.ToString("x2") }) -join "")
}
function Get-Urls($t, $w, $h) {
  $n = $t.Replace(" ", "_"); $m = Get-Md5Hex $n; $e = [uri]::EscapeDataString($n)
  $base = "https://upload.wikimedia.org/wikipedia/commons"
  $ext = ""; if ($n -match '\.tiff?$') { $ext = ".jpg" }
  $u = @()
  foreach ($x in 1280, 960, 500) { if ($w -eq 0 -or $x -lt $w) { $u += "$base/thumb/$($m[0])/$($m.Substring(0,2))/$e/${x}px-$e$ext" } }
  if ($n -notmatch '\.tiff?$') { $u += "$base/$($m[0])/$($m.Substring(0,2))/$e" }
  return $u
}
function Get-File($url, $dest) {
  for ($p = 0; $p -lt 4; $p++) {
    try { Invoke-WebRequest -Uri $url -OutFile $dest -Headers @{ "User-Agent" = $UA } -UseBasicParsing -TimeoutSec 120; return $true }
    catch {
      $code = 0; try { $code = [int]$_.Exception.Response.StatusCode } catch {}
      if ($code -eq 429) { Start-Sleep -Seconds (4 + 4 * $p); continue }
      return $false
    }
  }
  return $false
}
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
function Save-Resized($src, $dest, [int]$max, [long]$q) {
  $bmp = [System.Drawing.Image]::FromFile($src)
  try {
    $r = [Math]::Min(1.0, [Math]::Min($max / $bmp.Width, $max / $bmp.Height))
    $w = [Math]::Max(1, [int][Math]::Round($bmp.Width * $r)); $h = [Math]::Max(1, [int][Math]::Round($bmp.Height * $r))
    $b2 = New-Object System.Drawing.Bitmap $w, $h
    $g = [System.Drawing.Graphics]::FromImage($b2)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.Clear([System.Drawing.Color]::White); $g.DrawImage($bmp, 0, 0, $w, $h); $g.Dispose()
    $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, $q)
    $b2.Save($dest, $codec, $ep); $b2.Dispose()
  } finally { $bmp.Dispose() }
}
function Get-Meta($t) {
  $page = "https://commons.wikimedia.org/wiki/" + [uri]::EscapeDataString("File:" + $t.Replace(" ", "_"))
  $lic = ""; $aut = ""
  try {
    $html = (Invoke-WebRequest -Uri $page -Headers @{ "User-Agent" = $UA } -UseBasicParsing -TimeoutSec 60).Content
    $lm = [regex]::Matches($html, 'licensetpl(?:_|&#95;)short[^>]*>([^<]*)<') | ForEach-Object { $_.Groups[1].Value.Trim() } | Where-Object { $_ } | Select-Object -Unique
    if ($lm) { $lic = ($lm -join " / ") }
    if ($html -match '(?s)id="fileinfotpl(?:_|&#95;)aut"[^>]*>.*?</td>\s*<td[^>]*>(.*?)</td>') { $aut = (($matches[1] -replace '<[^>]+>', ' ') -replace '\s+', ' ').Trim() }
  } catch {}
  return @{ lic = [System.Net.WebUtility]::HtmlDecode($lic); aut = [System.Net.WebUtility]::HtmlDecode($aut); url = $page }
}

$i = 0
foreach ($p in $polozky) {
  $i++; $cil = Join-Path $imgDir $p.f
  Write-Host ("[{0}/{1}] {2}" -f $i, $polozky.Count, $p.f) -NoNewline
  if (Test-Path $cil) { Write-Host "  – už existuje, přeskakuji"; continue }
  $tmp = [IO.Path]::GetTempFileName(); $ok = $false
  foreach ($u in (Get-Urls $p.t $p.w $p.h)) {
    if (Get-File $u $tmp) {
      try { Save-Resized $tmp $cil 1200 76; Save-Resized $tmp (Join-Path $thDir $p.f) 500 76; $ok = $true; break } catch { }
    }
    Start-Sleep -Milliseconds 300
  }
  Remove-Item $tmp -Force -ErrorAction SilentlyContinue
  if ($ok) {
    $m = Get-Meta $p.t
    $log += [pscustomobject]@{ soubor = $p.f; zdroj = "File:" + $p.t; autor = $m.aut; licence = $m.lic; url = $m.url }
    Write-Host ("  ✓ {0} kB" -f [int]((Get-Item $cil).Length / 1KB))
  } else {
    $missing += ("{0}  –  {1}" -f $p.f, $p.t)
    Write-Host "  ✗ nepodařilo se stáhnout" -ForegroundColor Yellow
  }
  Start-Sleep -Milliseconds 400
}
$log | Export-Csv -Path (Join-Path $root "commons-protokol-3.csv") -NoTypeInformation -Encoding UTF8
if ($missing.Count) { $missing | Set-Content -Path (Join-Path $root "chybi-3.txt") -Encoding UTF8 }
$vel = (Get-ChildItem -Path $root -Recurse -File | Where-Object { $_.FullName -notmatch '\\\.git\\' } | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host ""
Write-Host ("Hotovo: staženo {0}, nestaženo {1}." -f $log.Count, $missing.Count) -ForegroundColor Green
Write-Host ("Velikost webu (bez složky .git): {0:N1} MB" -f $vel) -ForegroundColor $(if ($vel -gt 100) { "Red" } else { "Green" })
if ($vel -gt 100) { Write-Host "POZOR: web je větší než 100 MB – napište Claudovi, obrázky se zmenší." -ForegroundColor Red }
Write-Host "Okno můžete zavřít (nebo stiskněte Enter)."
Read-Host | Out-Null

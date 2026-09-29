# =====================================================================
#  Časová osa dějin umění – stažení chybějících obrazových ukázek
#  z Wikimedia Commons (volná díla / otevřené licence).
#
#  Spuštění: poklepejte na soubor STAHNI-OBRAZKY.cmd (ve stejné složce).
#  Skript uloží obrázky do img/ (max. 1400 px) a náhledy do img/thumb/ (480 px)
#  a zapíše protokol commons-protokol.csv (zdroj, autor, licence) + chybi.txt.
#  Existující soubory v img/ nepřepisuje.
# =====================================================================
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$imgDir = Join-Path $root "img"; $thDir = Join-Path $imgDir "thumb"
New-Item -ItemType Directory -Force -Path $imgDir, $thDir | Out-Null
$api = "https://commons.wikimedia.org/w/api.php"
$UA = "CasovaOsaDejinUmeni/1.0 (SPSE Pardubice, vyukova aplikace; kontakt: svoboda@spse.cz)"
$log = @(); $missing = @()

# cíl | kandidáti na Commons (přesné názvy souborů, zkouší se popořadě) | záložní hledání
$polozky = @(
  @{ f="bronz_nebra.jpg"; c=@("Nebra Scheibe.jpg","Nebra disc.jpg","Nebra Sky Disc.jpg"); q="Nebra sky disc" },
  @{ f="zelezo_msecke_zehrovice.jpg"; c=@("Msecke Zehrovice Head.jpg","Hlava Kelta z Mšeckých Žehrovic.jpg","Mšecké Žehrovice head.jpg"); q="Mšecké Žehrovice head celtic" },
  @{ f="mezopotamie_chammurapi.jpg"; c=@("Code-de-Hammurabi-1.jpg","Code of Hammurabi.jpg","P1050763 Louvre code Hammurabi face rwk.JPG"); q="Code of Hammurabi stele Louvre" },
  @{ f="egejske_knossos_byk.jpg"; c=@("Bull-leaping fresco from the east wing of the palace of Knossos, Heraklion Archaeological Museum.jpg","Knossos bull.jpg","Bull leaping fresco Knossos.jpg"); q="Bull-leaping fresco Knossos" },
  @{ f="egejske_maska.jpg"; c=@("MaskeAgamemnon.JPG","Mask of Agamemnon.jpg","Agamemnon mask NAMA.jpg"); q="Mask of Agamemnon Mycenae gold" },
  @{ f="etruskove_sarkofag.jpg"; c=@("Sarcophagus of the Spouses (Rome).jpg","Sarcofago degli sposi.jpg","Etruscan Sarcophagus of the Spouses Villa Giulia.jpg"); q="Sarcophagus of the Spouses Villa Giulia" },
  @{ f="etruskove_tarquinia.jpg"; c=@("Tomb of the Leopards - Tarquinia.jpg","Tarquinia Tomb of the Leopards.jpg","Tomba dei Leopardi.jpg"); q="Tomb of the Leopards Tarquinia fresco" },
  @{ f="rany_cachy.jpg"; c=@("Aachen Cathedral - Palatine Chapel interior.jpg","Aachener Dom Oktogon.jpg","Aachen Dom Pfalzkapelle.jpg"); q="Aachen Palatine Chapel octagon interior" },
  @{ f="rany_gombik.jpg"; c=@("Gombíky z Mikulčic.jpg","Mikulčice gombíky.jpg","Gombik Mikulcice.jpg"); q="gombík Mikulčice" },
  @{ f="romansky_znojmo.jpg"; c=@("Znojmo rotunda sv Kateřiny.jpg","Znojmo, rotunda sv. Kateřiny.jpg","Rotunda svaté Kateřiny (Znojmo).jpg"); q="Rotunda sv. Kateřiny Znojmo" },
  @{ f="romansky_autun.jpg"; c=@("Autun St Lazare Tympanon.jpg","Autun Cathedral tympanum.jpg","Cathédrale Saint-Lazare d'Autun - Tympan.jpg"); q="Autun cathedral tympanum Last Judgement Gislebertus" },
  @{ f="romansky_trebic.jpg"; c=@("Třebíč, bazilika sv. Prokopa.jpg","Trebic Basilica of St Procopius.jpg","Bazilika svatého Prokopa (Třebíč).jpg"); q="Basilica of St. Procopius Třebíč" },
  @{ f="baroko_rembrandt.jpg"; c=@("The Night Watch - HD.jpg","Rembrandt - De Nachtwacht.jpg","The Nightwatch by Rembrandt.jpg"); q="Night Watch Rembrandt Nachtwacht" },
  @{ f="baroko_vermeer.jpg"; c=@("Girl with a Pearl Earring.jpg","Meisje met de parel.jpg","1665 Girl with a Pearl Earring.jpg"); q="Girl with a Pearl Earring Vermeer Mauritshuis" },
  @{ f="baroko_mikulas.jpg"; c=@("Praha, Malá Strana, kostel sv. Mikuláše.jpg","Kostel svatého Mikuláše (Malá Strana).jpg","Sv. Mikuláš Malá Strana.jpg"); q="St. Nicholas Church Malá Strana Prague" },
  @{ f="baroko_kuks.jpg"; c=@("Kuks, sochy ctností a neřestí.jpg","Kuks - Braun sochy.jpg","Kuks hospital statues Braun.jpg"); q="Kuks Braun Ctnosti Neřesti sochy" },
  @{ f="rokoko_fragonard.jpg"; c=@("Fragonard, The Swing.jpg","Jean-Honoré Fragonard - The Swing.jpg","The Swing (Fragonard).jpg"); q="Fragonard The Swing Wallace Collection" },
  @{ f="rokoko_nove_hrady.jpg"; c=@("Nové Hrady (Chrudim District), zámek.jpg","Zámek Nové Hrady u Litomyšle.jpg","Nove Hrady zamek.jpg"); q="zámek Nové Hrady okres Chrudim" },
  @{ f="klasicismus_david_horatiove.jpg"; c=@("Jacques-Louis David - Oath of the Horatii - Google Art Project.jpg","Jacques-Louis David, Le Serment des Horaces.jpg","Oath of the Horatii.jpg"); q="Oath of the Horatii David Louvre" },
  @{ f="romantismus_turner.jpg"; c=@("Rain Steam and Speed the Great Western Railway.jpg","Turner - Rain, Steam and Speed - National Gallery file.jpg","Joseph Mallord William Turner - Rain, Steam and Speed - The Great Western Railway.jpg"); q="Rain Steam and Speed Turner" },
  @{ f="historismus_narodni_divadlo.jpg"; c=@("Národní divadlo, Praha.jpg","Prague National Theatre.jpg","Narodni divadlo Praha.jpg"); q="Národní divadlo Praha" },
  @{ f="historismus_pardubice_radnice.jpg"; c=@("Pardubice, radnice.jpg","Pardubice radnice.jpg","Pardubice - Pernštýnské náměstí, radnice.jpg"); q="Pardubice radnice Pernštýnské náměstí" },
  @{ f="impresionismus_monet_imprese.jpg"; c=@("Monet - Impression, Sunrise.jpg","Claude Monet, Impression, soleil levant.jpg","Impression, soleil levant.jpg"); q="Impression Sunrise Monet soleil levant" },
  @{ f="postimpresionismus_van_gogh.jpg"; c=@("Van Gogh - Starry Night - Google Art Project.jpg","VanGogh-starry night.jpg","The Starry Night.jpg"); q="Starry Night Van Gogh MoMA" },
  @{ f="postimpresionismus_cezanne.jpg"; c=@("Paul Cézanne - Mont Sainte-Victoire - Google Art Project.jpg","Montagne Sainte-Victoire, par Paul Cézanne 108.jpg","Paul Cézanne, Mont Sainte-Victoire.jpg"); q="Mont Sainte-Victoire Cézanne" },
  @{ f="secese_klimt.jpg"; c=@("The Kiss - Gustav Klimt - Google Cultural Institute.jpg","Gustav Klimt 016.jpg","Klimt - Der Kuss.jpg"); q="The Kiss Klimt Belvedere" },
  @{ f="fauvismus_matisse_tanec.jpg"; c=@("Matissedance.jpg","La danse (I) by Matisse.jpg","Henri Matisse - La Danse.jpg"); q="Matisse Dance Hermitage 1910" },
  @{ f="expresionismus_kirchner.jpg"; c=@("Kirchner - Strassenszene Berlin.jpg","Ernst Ludwig Kirchner - Street, Berlin.jpg","Kirchner 1913 Street, Berlin.jpg"); q="Kirchner Street Berlin 1913" },
  @{ f="kubismus_picasso.jpg"; c=@("Les Demoiselles d'Avignon.jpg","Pablo Picasso, 1907, Les Demoiselles d'Avignon.jpg"); q="Les Demoiselles d'Avignon Picasso" },
  @{ f="kubismus_gocar.jpg"; c=@("Dům U Černé Matky Boží.jpg","Praha, Dům U Černé Matky Boží.jpg","House of the Black Madonna Prague.jpg"); q="Dům U Černé Matky Boží Praha" },
  @{ f="kubismus_bohdanec.jpg"; c=@("Lázně Bohdaneč, Gočárův pavilon.jpg","Bohdaneč Gočár lázeňský dům.jpg","Lázně Bohdaneč - Gočárův pavilon.jpg"); q="Lázně Bohdaneč Gočár pavilon" },
  @{ f="futurismus_boccioni.jpg"; c=@("'Unique Forms of Continuity in Space', 1913 bronze by Umberto Boccioni.jpg","Umberto Boccioni, 1913, Unique Forms of Continuity in Space.jpg","Boccioni Forme uniche.jpg"); q="Unique Forms of Continuity in Space Boccioni" },
  @{ f="abstrakce_malevic.jpg"; c=@("Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg","Malevich.black-square.jpg","Black Square.jpg"); q="Malevich Black Square 1915" },
  @{ f="dada_duchamp.jpg"; c=@("Duchamp Fountaine.jpg","Marcel Duchamp, 1917, Fountain, photograph by Alfred Stieglitz.jpg","Fountain Duchamp.jpg"); q="Duchamp Fountain Stieglitz 1917" },
  @{ f="funkcionalismus_grand_pardubice.jpg"; c=@("Pardubice, Grand hotel.jpg","Grandhotel Pardubice.jpg","Pardubice - Grand.jpg"); q="Grand hotel Pardubice Gočár" },
  @{ f="parizska_chagall.jpg"; c=@("Chagall IandTheVillage.jpg","Marc Chagall, 1911, I and the Village.jpg"); q="Chagall I and the Village" },
  @{ f="performance_beuys.jpg"; c=@("Joseph Beuys 1965.jpg"); q="Joseph Beuys performance 1965 hare" },
  @{ f="landart_smithson.jpg"; c=@("Spiral-jetty-from-rozel-point.png","Spiral Jetty.jpg","Spiral Jetty 2005.jpg"); q="Spiral Jetty Smithson" },
  @{ f="landart_christo.jpg"; c=@("Wrapped Reichstag 1995.jpg","Verhüllter Reichstag.jpg","Christo Reichstag 1995.jpg"); q="Wrapped Reichstag Christo 1995" },
  @{ f="postmoderna_tancici_dum.jpg"; c=@("Tančící dům, Praha.jpg","Prague Dancing House.jpg","Dancing House Prague.jpg"); q="Tančící dům Praha" },
  @{ f="svet_sulawesi.jpg"; c=@("Leang Tedongnge warty pig.jpg","Leang Tedongnge pig.jpg"); q="Leang Tedongnge pig cave painting Sulawesi" },
  @{ f="svet_kakadu.jpg"; c=@("Ubirr rock art fish.jpg","Ubirr Art Site.jpg","Ubirr rock art barramundi.jpg"); q="Ubirr rock art barramundi x-ray" },
  @{ f="svet_cina_terakota.jpg"; c=@("Terracotta Army, Xi'an.jpg","Terracotta Army Pit 1.jpg","Terrakottaarmee.jpg"); q="Terracotta Army pit 1 Xi'an" },
  @{ f="svet_cina_fankuan.jpg"; c=@("Fan Kuan - Travelers Among Mountains and Streams - Google Art Project.jpg","Fan Kuan Travelers.jpg","Fan Kuan - Travelers Among Mountains and Streams.jpg"); q="Fan Kuan Travelers Among Mountains and Streams" },
  @{ f="svet_indie_tadz.jpg"; c=@("Taj Mahal, Agra, India edit3.jpg","Taj Mahal (Edited).jpeg","Taj Mahal in March 2004.jpg"); q="Taj Mahal Agra" },
  @{ f="svet_indie_siva.jpg"; c=@("Shiva Nataraja Musée Guimet 25971.jpg","Shiva as the Lord of Dance LACMA edit.jpg","Nataraja Chola.jpg"); q="Shiva Nataraja Chola bronze" },
  @{ f="svet_persie_persepolis.jpg"; c=@("Persepolis Apadana relief.jpg","Apadana Persepolis eastern stairs.jpg","Persepolis, Apadana, eastern stairs.jpg"); q="Apadana Persepolis relief stairs tribute" },
  @{ f="svet_islam_alhambra.jpg"; c=@("Patio de los Leones. Alhambra.jpg","Alhambra Court of the Lions.jpg","Patio de los Leones.jpg"); q="Court of the Lions Alhambra Granada" },
  @{ f="svet_islam_cordoba.jpg"; c=@("Mezquita de Córdoba - Arcos.jpg","Mosque Cordoba.jpg","Mezquita de Córdoba.jpg"); q="Mezquita Córdoba arches columns" },
  @{ f="svet_japonsko_ryoanji.jpg"; c=@("Kyoto-Ryoan-Ji MG 4512.jpg","Ryoanji rock garden.jpg","RyoanJi-Dry garden.jpg"); q="Ryoan-ji rock garden Kyoto" },
  @{ f="svet_maya_chichen.jpg"; c=@("Chichen Itza 3.jpg","El Castillo, Chichén Itzá.jpg","Chichén Itzá - El Castillo.jpg"); q="El Castillo Chichen Itza Kukulcan" },
  @{ f="svet_olmek_hlava.jpg"; c=@("Olmec Head No. 1.jpg","Cabeza colosal olmeca.jpg","San Lorenzo Monument 1.jpg"); q="Olmec colossal head San Lorenzo" },
  @{ f="svet_andy_machupicchu.jpg"; c=@("Machu Picchu, Peru.jpg","Machu Picchu Peru.jpg","80 - Machu Picchu - Juin 2009 - edit.2.jpg"); q="Machu Picchu" },
  @{ f="svet_andy_nazca.jpg"; c=@("Líneas de Nazca, Nazca, Perú, 2015-07-29, DD 52.JPG","Nazca colibri.jpg","Nazca Lines Hummingbird.jpg"); q="Nazca lines hummingbird colibri" },
  @{ f="svet_afrika_ife.jpg"; c=@("Ife head British Museum.jpg","Ife Head.jpg","Bronze Head from Ife.jpg"); q="Ife head bronze British Museum" },
  @{ f="svet_afrika_benin.jpg"; c=@("Benin Bronzes, British Museum.jpg","Benin plaque British Museum.jpg","Benin bronze plaque.jpg"); q="Benin bronze plaque British Museum" },
  @{ f="svet_angkor.jpg"; c=@("Angkor Wat.jpg","Angkor Wat temple.jpg","Ankor Wat temple.jpg"); q="Angkor Wat temple Cambodia" },
  @{ f="svet_borobudur.jpg"; c=@("Borobudur-Nothwest-view.jpg","Borobudur Temple.jpg","Borobudur-Temple-Park Indonesia Stupas-of-Borobudur-04.jpg"); q="Borobudur temple Java" },
  @{ f="svet_oceanie_moai.jpg"; c=@("Moai Rano raraku.jpg","Ahu Tongariki.jpg","Moais at Rano Raraku.jpg"); q="moai Rano Raraku Easter Island" }
)

function Get-Json($url) {
  return Invoke-RestMethod -Uri $url -Headers @{ "User-Agent" = $UA } -TimeoutSec 60
}
function Get-ImageInfo($title, $width) {
  $t = [uri]::EscapeDataString("File:" + $title)
  $j = Get-Json "${api}?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata|mime&iiurlwidth=$width&titles=$t"
  $p = $j.query.pages.PSObject.Properties.Value | Select-Object -First 1
  if ($p.missing -ne $null -or -not $p.imageinfo) { return $null }
  return $p.imageinfo[0]
}
function Search-Commons($q) {
  $s = [uri]::EscapeDataString($q + " filetype:bitmap")
  $j = Get-Json "${api}?action=query&format=json&list=search&srnamespace=6&srlimit=5&srsearch=$s"
  foreach ($r in $j.query.search) {
    $t = $r.title -replace '^File:', ''
    if ($t -match '\.(jpe?g|png)$') { return $t }
  }
  return $null
}
function Save-Jpeg($url, $dest) {
  $tmp = [IO.Path]::GetTempFileName()
  Invoke-WebRequest -Uri $url -OutFile $tmp -Headers @{ "User-Agent" = $UA } -TimeoutSec 120
  if ($url -match '\.jpe?g$') { Move-Item -Force $tmp $dest; return }
  $bmp = [System.Drawing.Image]::FromFile($tmp)
  $b2 = New-Object System.Drawing.Bitmap $bmp.Width, $bmp.Height
  $g = [System.Drawing.Graphics]::FromImage($b2); $g.Clear([System.Drawing.Color]::White); $g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height); $g.Dispose()
  $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality, [long]86)
  $b2.Save($dest, $codec, $ep); $bmp.Dispose(); $b2.Dispose(); Remove-Item $tmp -Force
}

$i = 0
foreach ($p in $polozky) {
  $i++; $cil = Join-Path $imgDir $p.f
  Write-Host ("[{0}/{1}] {2}" -f $i, $polozky.Count, $p.f) -NoNewline
  if (Test-Path $cil) { Write-Host "  – už existuje, přeskakuji"; continue }
  $info = $null; $zdroj = $null
  try {
    foreach ($c in $p.c) { $info = Get-ImageInfo $c 1400; if ($info) { $zdroj = $c; break } }
    if (-not $info) { $s = Search-Commons $p.q; if ($s) { $info = Get-ImageInfo $s 1400; $zdroj = $s } }
    if (-not $info -or -not $info.thumburl) { throw "na Commons nenalezeno" }
    $lic = $info.extmetadata.LicenseShortName.value; $aut = ($info.extmetadata.Artist.value -replace '<[^>]+>', '') -replace '\s+', ' '
    Save-Jpeg $info.thumburl $cil
    $th = Get-ImageInfo $zdroj 480
    if ($th -and $th.thumburl) { Save-Jpeg $th.thumburl (Join-Path $thDir $p.f) }
    $log += [pscustomobject]@{ soubor = $p.f; zdroj = "File:" + $zdroj; autor = $aut; licence = $lic; url = $info.descriptionurl }
    Write-Host ("  ✓ {0}  [{1}]" -f $zdroj, $lic)
  } catch {
    $missing += ("{0}  –  {1}" -f $p.f, $_.Exception.Message)
    Write-Host ("  ✗ {0}" -f $_.Exception.Message) -ForegroundColor Yellow
  }
  Start-Sleep -Milliseconds 300
}
$log | Export-Csv -Path (Join-Path $root "commons-protokol.csv") -NoTypeInformation -Encoding UTF8
if ($missing.Count) { $missing | Set-Content -Path (Join-Path $root "chybi.txt") -Encoding UTF8 } elseif (Test-Path (Join-Path $root "chybi.txt")) { Remove-Item (Join-Path $root "chybi.txt") }
Write-Host ""
Write-Host ("Hotovo: staženo {0}, nenalezeno {1}. Protokol: commons-protokol.csv" -f $log.Count, $missing.Count) -ForegroundColor Green
Write-Host "Okno můžete zavřít (nebo stiskněte Enter)."
Read-Host | Out-Null

/* =====================================================================
   ČASOVÁ OSA DĚJIN UMĚNÍ – aplikační logika
   Data jsou v souborech data-souvislosti.js a data-epochy-*.js.
   ===================================================================== */
(function () {
"use strict";

/* ---------- pomocné funkce ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const nf = n => Math.abs(n).toLocaleString("cs-CZ");
const fmtRok = y => y < 0 ? nf(y) + " př. n. l." : (y === 0 ? "přelom letopočtu" : String(y));
const fmtRokKratky = y => y < 0 ? "−" + nf(y) : String(y);
const OBD = Object.fromEntries(OBDOBI.map(o => [o.id, o]));
const EP = Object.fromEntries(EPOCHY.map(e => [e.id, e]));
const UD = Object.fromEntries(UDALOSTI.map(u => [u.id, u]));
const EVROPA = EPOCHY.filter(e => e.vrstva === "evropa").sort((a, b) => a.od - b.od || a.do - b.do);
const SVET = EPOCHY.filter(e => e.vrstva === "svet").sort((a, b) => a.od - b.od);
const IKONY_TYP = { klima: "i-klima", astro: "i-astro", dejiny: "i-dejiny" };
const TYP_NAZEV = { klima: "klima", astro: "astronomie", dejiny: "dějiny" };
const zkratka = n => n.split(/[\s–-]+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();

function kolecko(e, cls = "circ") {
  const o = OBD[e.obdobi];
  // chybí-li náhled v img/thumb/, zkusí se plný obrázek v img/; když chybí i ten, zůstane zkratka
  if (e.ikona) return `<span class="${cls}" style="--c:${o.barva}"><img src="img/thumb/${esc(e.ikona)}" alt="" loading="lazy" onerror="if(!this.dataset.f){this.dataset.f=1;this.src='img/${esc(e.ikona)}'}else{this.parentNode.innerHTML='<span class=abbr>${esc(zkratka(e.nazev))}</span>'}"></span>`;
  return `<span class="${cls}" style="--c:${o.barva}"><span class="abbr">${esc(zkratka(e.nazev))}</span></span>`;
}
function doplnit(popis) {
  const m = /Soubor k doplnění:\s*([\w.\-]+)/.exec(popis || "");
  return { soubor: m ? m[1] : null, text: (popis || "").replace(/\s*Soubor k doplnění:\s*[\w.\-]+\.?/, "") };
}

/* ---------- měřítko osy (po částech lineární) ---------- */
const SEGS = [[-40000, -10000, 520], [-10000, -3000, 520], [-3000, 500, 980], [500, 1400, 720], [1400, 1800, 720], [1800, 2030, 1100]];
const TICKS = [[5000, 1000], [1000, 500], [500, 100], [100, 50], [50, 25], [25, 5]];
let zoom = 1;
function xRok(y) {
  y = Math.max(SEGS[0][0], Math.min(2030, y));
  let x = 0;
  for (const [a, b, w] of SEGS) {
    if (y <= b) return (x + (y - a) / (b - a) * w) * zoom;
    x += w;
  }
  return x * zoom;
}
const sirkaOsy = () => SEGS.reduce((s, g) => s + g[2], 0) * zoom;

/* ---------- úvod: statistiky a serpentina ---------- */
function renderHero() {
  const nObr = EPOCHY.reduce((n, e) => n + e.pamatky.filter(p => p.img).length, 0);
  $("#hero-stats").innerHTML = `
    <div><b>40 000</b>let na jedné ose</div>
    <div><b>${EVROPA.length}</b>evropských epoch a směrů</div>
    <div><b>${SVET.length}</b>kultur mimo Evropu</div>
    <div><b>${nObr}</b>obrazových ukázek</div>
    <div><b>${UDALOSTI.length}</b>klimatických a dějinných událostí</div>`;
  const svg = $("#serp");
  const rowH = 44, top = 18, x0 = 80, x1 = 360, h = 28;
  let out = "";
  OBDOBI.forEach((o, i) => {
    const y = top + i * rowH;
    const lr = i % 2 === 0;
    out += `<g class="band" data-era="${o.id}" tabindex="0" role="button" aria-label="${esc(o.nazev)}">`;
    out += `<rect x="${x0}" y="${y}" width="${x1 - x0}" height="${h}" rx="14" fill="${o.barva}"/>`;
    if (i < OBDOBI.length - 1) {
      const cx = lr ? x1 - 14 : x0 + 14;
      out += `<rect x="${cx - 9}" y="${y + h - 4}" width="18" height="${rowH - h + 8}" fill="${o.barva}"/>`;
    }
    out += `<text x="${lr ? x0 + 14 : x1 - 14}" y="${y + 19}" text-anchor="${lr ? "start" : "end"}">${esc(o.nazev)}</text>`;
    out += `<text class="lbl" x="${lr ? x1 + 10 : x0 - 10}" y="${y + 18}" text-anchor="${lr ? "start" : "end"}">${esc(fmtRokKratky(o.od))}</text>`;
    out += `</g>`;
  });
  svg.innerHTML = out;
  $$(".band", svg).forEach(g => {
    const go = () => { skokNaObdobi(g.dataset.era); $("#osa").scrollIntoView({ behavior: "smooth", block: "start" }); };
    g.addEventListener("click", go);
    g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } });
  });
}
function skokNaObdobi(id) {
  const o = OBD[id];
  $("#osa-scroll").scrollTo({ left: Math.max(0, xRok(o.od) - 24), behavior: "smooth" });
}

/* ---------- osa ---------- */
const vrstvy = { udalosti: true, pales: true, svet: true, krivka: true };
function pack(items, minW, gap) {
  const rows = [];
  items.forEach(it => {
    it.x0 = xRok(it.e.od); it.x1 = Math.max(xRok(it.e.do), it.x0 + minW); it.w = it.x1 - it.x0;
    let r = rows.findIndex(end => end + gap <= it.x0);
    if (r < 0) { r = rows.length; rows.push(0); }
    rows[r] = it.x1; it.row = r;
  });
  return rows.length;
}
function renderOsa() {
  const W = sirkaOsy();
  const can = $("#osa-canvas");
  let html = "";
  // 1. období
  OBDOBI.forEach(o => {
    const x0 = xRok(o.od), x1 = xRok(o.do);
    html += `<div class="era-band" style="left:${x0}px;width:${x1 - x0}px;background:${o.barva}" title="${esc(o.nazev)}: ${esc(fmtRok(o.od))} – ${esc(fmtRok(o.do))}"><span>${esc(o.nazev)}</span></div>`;
  });
  // 2. pravítko
  html += `<div class="ruler">`;
  SEGS.forEach(([a, b], i) => {
    const [maj, min] = TICKS[i];
    for (let y = a; y < b; y += min) {
      const major = (y - a) % maj === 0;
      if (major) html += `<div class="tick" style="left:${xRok(y)}px">${esc(fmtRokKratky(y))}</div>`;
      else if (zoom >= 1.4) html += `<div class="tick minor" style="left:${xRok(y)}px"></div>`;
    }
  });
  html += `<div class="tick" style="left:${xRok(2026)}px">dnes</div></div>`;
  let y = 60;
  // 3. duchové času
  if (vrstvy.pales) {
    html += `<div class="osa-layer" style="top:${y}px;height:30px"><span class="lane-label">Duchové času · Páleš</span>`;
    obdobiDuchu(-40000, 2030).forEach(p => {
      const x0 = xRok(Math.max(p.od, -40000)), x1 = xRok(Math.min(p.do, 2030));
      if (x1 - x0 < 1) return;
      const wide = x1 - x0 > 58;
      html += `<button type="button" class="pales-blk" data-duch="${p.duch.id}" style="left:${x0}px;width:${x1 - x0}px;top:4px;background:${p.duch.barva}" title="${esc(p.duch.jmeno)} (${esc(p.duch.planeta)}): ${esc(fmtRok(p.od))} – ${esc(fmtRok(p.do))}">${wide ? esc(p.duch.jmeno) : esc(p.duch.symbol)}</button>`;
    });
    html += `</div>`;
    y += 34;
  }
  // 4. evropské epochy
  const evItems = EVROPA.map(e => ({ e }));
  const nRows = pack(evItems, 30, 6);
  html += `<div class="osa-layer" style="top:${y}px;height:${nRows * 39 + 24}px"><span class="lane-label">Evropa</span>`;
  evItems.forEach(it => html += barHtml(it, y => 22 + it.row * 39));
  html += `</div>`;
  y += nRows * 39 + 26;
  // 5. svět
  if (vrstvy.svet) {
    const svItems = SVET.map(e => ({ e }));
    const nS = pack(svItems, 30, 6);
    html += `<div class="osa-layer" style="top:${y}px;height:${nS * 30 + 24}px"><span class="lane-label">Mimo Evropu</span>`;
    svItems.forEach(it => html += barHtml(it, () => 22 + it.row * 30, true));
    html += `</div>`;
    y += nS * 30 + 26;
  }
  // 6. události
  if (vrstvy.udalosti) {
    html += `<div class="osa-layer" style="top:${y}px;height:64px"><span class="lane-label">Události</span>`;
    let lastX = -99, lvl = 0;
    UDALOSTI.slice().sort((a, b) => a.rok - b.rok).forEach(u => {
      const x = xRok(u.rok);
      lvl = (x - lastX < 30) ? (lvl + 1) % 2 : 0; lastX = x;
      html += `<button type="button" class="ev ${u.typ}" data-ud="${u.id}" style="left:${x}px;top:${24 + lvl * 16}px" title="${esc(u.nazev)} (${esc(u.kdy)})"><svg><use href="#${IKONY_TYP[u.typ]}"/></svg></button>`;
    });
    html += `</div>`;
    y += 66;
  }
  // 7. křivka
  if (vrstvy.krivka) {
    const H = 96, mid = H / 2, amp = 34;
    const pts = EVROPA.filter(e => e.jung && typeof e.jung.postoj === "number").map(e => ({ x: (xRok(e.od) + xRok(e.do)) / 2, y: mid - e.jung.postoj * amp, e })).sort((a, b) => a.x - b.x);
    let d = "";
    pts.forEach((p, i) => {
      if (i === 0) { d += `M${p.x},${p.y}`; return; }
      const q = pts[i - 1]; const cx = (q.x + p.x) / 2;
      d += ` C${cx},${q.y} ${cx},${p.y} ${p.x},${p.y}`;
    });
    html += `<div class="osa-layer" style="top:${y}px;height:${H}px"><span class="lane-label" style="position:sticky">Postoj · Jung</span>`;
    html += `<svg class="curve" width="${W}" height="${H}" style="top:0"><line class="zero" x1="0" y1="${H / 2}" x2="${W}" y2="${H / 2}"/><path d="${d}"/>`;
    pts.forEach(p => html += `<circle cx="${p.x}" cy="${p.y}" r="4"><title>${esc(p.e.nazev)}: ${esc(p.e.jung.nazevPostoje)}</title></circle>`);
    html += `</svg><span class="curve-lbl" style="top:${H / 2 - 30}px">↑ extraverze · vcítění</span><span class="curve-lbl" style="top:${H / 2 + 18}px">↓ introverze · abstrakce</span></div>`;
    y += H + 6;
  }
  can.style.setProperty("--h", y + "px");
  can.style.width = W + "px";
  can.innerHTML = html;
  // mřížka podle období
  OBDOBI.forEach(o => can.insertAdjacentHTML("beforeend", `<div class="grid-line" style="left:${xRok(o.od)}px"></div>`));
  $$(".bar", can).forEach(b => b.addEventListener("click", () => otevriEpochu(b.dataset.ep)));
  posunPopisky();
  $$(".ev", can).forEach(b => b.addEventListener("click", ev => { ev.stopPropagation(); popUdalost(b); }));
  $$(".pales-blk", can).forEach(b => b.addEventListener("click", () => { vyberDucha(b.dataset.duch); $("#psychologie").scrollIntoView({ behavior: "smooth" }); setTimeout(() => $("#kolo-svg").scrollIntoView({ behavior: "smooth", block: "center" }), 350); }));
}
// Popisky dlouhých pruhů se drží u levého okraje viditelné části osy
function posunPopisky() {
  const sc = $("#osa-scroll"), sl = sc.scrollLeft;
  $$("#osa-canvas .bar:not(.tiny)").forEach(b => {
    const x0 = parseFloat(b.style.left), w = parseFloat(b.style.width), t = $(".t", b);
    if (!t) return;
    const off = sl > x0 + 8 && sl < x0 + w - 60 ? Math.min(sl - x0, w - 70) : 0;
    t.style.transform = off ? `translateX(${off}px)` : "";
    const ico = $(".ico", b); if (ico) ico.style.transform = t.style.transform;
  });
}
function barHtml(it, topFn, svet = false) {
  const e = it.e, o = OBD[e.obdobi];
  const tiny = it.w < 46, kratky = it.w < 120;
  const nazev = kratky && e.nazev.length > 14 ? e.nazev.split(/[ ,(–]/)[0] : e.nazev;
  const ico = e.ikona ? `<span class="ico"><img src="img/thumb/${esc(e.ikona)}" alt="" loading="lazy"></span>` : `<span class="ico"><svg><use href="#i-osa"/></svg></span>`;
  return `<button type="button" class="bar${svet ? " svet" : ""}${tiny ? " tiny" : ""}" data-ep="${e.id}" style="left:${it.x0}px;width:${it.w}px;top:${topFn()}px;background:${svet ? "" : o.barva};--c:${o.barva}" title="${esc(e.nazev)} · ${esc(e.datace)}">${svet ? "" : ico}<span class="t">${esc(nazev)}</span></button>`;
}
function popUdalost(btn) {
  zavriPop();
  const u = UD[btn.dataset.ud];
  const pop = document.createElement("div");
  pop.className = "pop";
  pop.innerHTML = `<button type="button" class="x" aria-label="Zavřít">×</button><h4>${esc(u.nazev)}</h4><div class="kdy">${esc(u.kdy)} · ${esc(TYP_NAZEV[u.typ])}</div><p>${esc(u.popis)}</p><p><b>Vliv na umění:</b> ${esc(u.umeni)}</p><div class="links">${u.epochy.map(id => EP[id] ? `<button type="button" class="lnk" data-ep="${id}" style="--c:${OBD[EP[id].obdobi].barva}"><i></i>${esc(EP[id].nazev)}</button>` : "").join("")}</div>`;
  const can = $("#osa-canvas");
  const left = Math.min(parseFloat(btn.style.left) + 16, sirkaOsy() - 372);
  pop.style.left = Math.max(4, left) + "px";
  pop.style.top = (btn.offsetParent === can ? btn.offsetTop : btn.parentElement.offsetTop + btn.offsetTop) - 8 + "px";
  can.appendChild(pop);
  pop.style.top = Math.max(60, Math.min(parseFloat(pop.style.top), can.clientHeight - pop.offsetHeight - 8)) + "px";
  $(".x", pop).addEventListener("click", zavriPop);
  $$(".lnk", pop).forEach(l => l.addEventListener("click", () => otevriEpochu(l.dataset.ep)));
}
function zavriPop() { $$(".pop").forEach(p => p.remove()); }
document.addEventListener("click", ev => { if (!ev.target.closest(".pop") && !ev.target.closest(".ev")) zavriPop(); });

function initOsa() {
  const jump = $("#era-jump");
  OBDOBI.forEach(o => {
    const b = document.createElement("button"); b.type = "button"; b.className = "chip"; b.style.setProperty("--c", o.barva);
    b.innerHTML = `<span class="dot"></span>${esc(o.nazev)}`;
    b.addEventListener("click", () => skokNaObdobi(o.id)); jump.appendChild(b);
  });
  ["udalosti", "pales", "svet", "krivka"].forEach(k => {
    const lab = $("#tg-" + k), inp = $("input", lab);
    inp.addEventListener("change", () => { vrstvy[k] = inp.checked; lab.classList.toggle("on", inp.checked); renderOsa(); });
  });
  $("#zoom-in").addEventListener("click", () => setZoom(zoom * 1.35));
  $("#zoom-out").addEventListener("click", () => setZoom(zoom / 1.35));
  const sc = $("#osa-scroll");
  let drag = null;
  sc.addEventListener("mousedown", ev => { if (ev.button !== 0 || ev.target.closest("button,.pop")) return; drag = { x: ev.clientX, s: sc.scrollLeft }; sc.classList.add("drag"); });
  window.addEventListener("mousemove", ev => { if (drag) sc.scrollLeft = drag.s - (ev.clientX - drag.x); });
  window.addEventListener("mouseup", () => { drag = null; sc.classList.remove("drag"); });
  let raf = 0; sc.addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; posunPopisky(); }); }, { passive: true });
  sc.addEventListener("wheel", ev => { if (ev.shiftKey || Math.abs(ev.deltaX) > Math.abs(ev.deltaY)) return; if (ev.ctrlKey) { ev.preventDefault(); setZoom(zoom * (ev.deltaY < 0 ? 1.15 : 1 / 1.15)); } }, { passive: false });
  $("#osa-legend").innerHTML = `<span><i style="background:var(--deep)"></i>klimatická událost</span><span><i style="background:#E0A020"></i>astronomická událost</span><span><i style="background:var(--clay)"></i>dějinná událost</span><span><i style="border:2px dashed var(--ink-soft);background:transparent"></i>umění mimo Evropu</span><span>− před letopočtem (př. n. l.)</span>`;
  renderOsa();
  sc.scrollLeft = xRok(1400) - 40;
}
function setZoom(z) {
  const sc = $("#osa-scroll"), mid = (sc.scrollLeft + sc.clientWidth / 2) / sirkaOsy();
  zoom = Math.max(0.55, Math.min(4, z));
  renderOsa();
  sc.scrollLeft = mid * sirkaOsy() - sc.clientWidth / 2;
}

/* ---------- seznam ---------- */
function renderSeznam() {
  const box = $("#seznam-groups");
  let html = "";
  OBDOBI.forEach(o => {
    const eps = EVROPA.filter(e => e.obdobi === o.id);
    html += `<div class="list-group"><h3><span class="pill" style="background:${o.svetla};color:${o.barva}">${esc(o.nazev)}</span><span class="rng">${esc(fmtRok(o.od))} – ${esc(fmtRok(o.do))}</span></h3><div class="icons">`;
    eps.forEach(e => html += iconBtn(e));
    html += `</div></div>`;
  });
  html += `<div class="list-group"><h3><span class="pill">Mimo Evropu</span><span class="rng">stručný přehled</span></h3><div class="icons">`;
  SVET.forEach(e => html += iconBtn(e));
  html += `</div></div>`;
  box.innerHTML = html;
  $$(".icon-btn", box).forEach(b => b.addEventListener("click", () => otevriEpochu(b.dataset.ep)));
}
const iconBtn = e => `<button type="button" class="icon-btn" data-ep="${e.id}">${kolecko(e)}<span class="n">${esc(e.nazev)}</span><span class="d">${esc(e.datace.replace(/^cca /, ""))}</span></button>`;

/* ---------- rychlý přehled ---------- */
function renderPrehled() {
  const box = $("#prehled-rows"), q = $("#q");
  const all = EVROPA.concat(SVET);
  const draw = () => {
    const t = q.value.trim().toLowerCase();
    const hit = all.filter(e => !t || JSON.stringify([e.nazev, e.podtitul, e.strucne, e.osobnosti, e.znaky, e.cesko, e.text]).toLowerCase().includes(t));
    $("#q-count").textContent = `${hit.length} z ${all.length}`;
    box.innerHTML = hit.map(e => {
      const o = OBD[e.obdobi]; const p = ((e.jung?.postoj ?? 0) + 1) / 2;
      return `<button type="button" class="row" data-ep="${e.id}">${kolecko(e)}<span class="n">${esc(e.nazev)}<small>${esc(o.nazev)}${e.vrstva === "svet" ? " · mimo Evropu" : ""}</small></span><span class="d">${esc(e.datace)}</span><span class="s">${esc(e.strucne)}</span><span class="j" title="${esc(e.jung?.nazevPostoje || "")}">${e.jung?.postoj < -0.15 ? "intro" : e.jung?.postoj > 0.15 ? "extra" : "střed"}<i style="--p:${p}"></i></span></button>`;
    }).join("") || `<p style="padding:20px 0;color:var(--ink-soft)">Nic nenalezeno.</p>`;
    $$(".row", box).forEach(b => b.addEventListener("click", () => otevriEpochu(b.dataset.ep)));
  };
  q.addEventListener("input", draw); draw();
}

/* ---------- mapa ---------- */
const MAPA_W = 1000, MAPA_H = 520, LAT_TOP = 84, LAT_BOT = -58;
const proj = (lon, lat) => [((lon + 180) / 360 * MAPA_W).toFixed(1), ((LAT_TOP - lat) / (LAT_TOP - LAT_BOT) * MAPA_H).toFixed(1)];
let mapaFiltr = null;
function renderMapa() {
  const svg = $("#mapa-svg");
  svg.innerHTML = `<rect class="sea" width="${MAPA_W}" height="${MAPA_H}"/><g class="land">${MAPA_SVG}</g><g id="mapa-body"></g>`;
  const f = $("#mapa-filters");
  f.innerHTML = `<button type="button" class="chip on" data-era="">Vše</button>` + OBDOBI.map(o => `<button type="button" class="chip" data-era="${o.id}" style="--c:${o.barva}"><span class="dot"></span>${esc(o.nazev)}</button>`).join("");
  $$(".chip", f).forEach(b => b.addEventListener("click", () => { mapaFiltr = b.dataset.era || null; $$(".chip", f).forEach(x => x.classList.toggle("on", x === b)); kresliBody(); }));
  kresliBody();
  ukazBod("athens", $('#mapa-body .pt[data-id="athens"]'));
}
function kresliBody() {
  const g = $("#mapa-body");
  g.innerHTML = MAPA_BODY.filter(b => !mapaFiltr || b.obdobi === mapaFiltr).map(b => {
    const [x, y] = proj(b.lon, b.lat); const o = OBD[b.obdobi];
    return `<g class="pt" data-id="${b.id}" tabindex="0" role="button" aria-label="${esc(b.nazev)}"><circle cx="${x}" cy="${y}" r="8" fill="${o.barva}"><title>${esc(b.nazev)} · ${esc(b.kdy)}</title></circle><text class="lb" x="${x}" y="${+y - 14}" text-anchor="middle">${esc(b.nazev.split(",")[0])}</text></g>`;
  }).join("");
  $$(".pt", g).forEach(p => {
    const go = () => ukazBod(p.dataset.id, p);
    p.addEventListener("click", go);
    p.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } });
  });
}
function ukazBod(id, el) {
  $$("#mapa-body .pt").forEach(p => p.classList.toggle("on", p === el));
  const b = MAPA_BODY.find(x => x.id === id), o = OBD[b.obdobi], e = b.epocha && EP[b.epocha];
  $("#mapa-card").innerHTML = `<span class="pill" style="background:${o.svetla};color:${o.barva}">${esc(o.nazev)}</span><h3 style="margin-top:8px">${esc(b.nazev)}</h3><div class="kdy">${esc(b.kdy)}</div><p>${esc(b.popis)}</p>${e ? `<button type="button" class="btn" data-ep="${e.id}">Otevřít kartu: ${esc(e.nazev)}</button>` : ""}`;
  const btn = $("#mapa-card button"); if (btn) btn.addEventListener("click", () => otevriEpochu(btn.dataset.ep));
}

/* ---------- psychologie ---------- */
const POLARITA = [
  { id: "intro", nazev: "Introverze & abstrakce", sub: "únik z chaosu do stálosti řádu", barva: "#0F5673",
    koren: "Pramení z existenciální úzkosti a pocitu ohrožení vnějším světem v krizových (klimatických, válečných) epochách. Energie se stahuje k subjektu.",
    forma: "Potlačení organické proměnlivosti a proměna věcí do pevných, geometrických, krystalických forem: neolitický ornament, Egypt, Byzanc, gotika, abstrakce.",
    vedomi: "Introvertní tvůrce vnímá vnější objekt jako cizí a zahlcující; všímá si mnoha detailů, které hluboce zpracovává, a může se tím vyčerpávat.",
    temp: [["Flegmatik", "stabilní · introvertní (hlen)", "klidný, spolehlivý, rozvážný, tichý, pečlivý"], ["Melancholik", "labilní · introvertní (černá žluč)", "úzkostný, náladový, pesimistický, přecitlivělý"]] },
  { id: "extra", nazev: "Extraverze & vcítění", sub: "harmonie a splynutí s objektem", barva: "#B5552F",
    koren: "Pozitivní, důvěřivý vztah k objektu, prožívaný v obdobích klimatické stability, úrodnosti a hojnosti přírody.",
    forma: "Realismus, naturalismus, organické linie, přirozené proporce těla a oslava pozemské smyslové reality: Kréta, klasické Řecko, renesance, impresionismus, pop art.",
    vedomi: "Extravertní tvůrce se orientuje na objekt a fakta; přijímá obrovské množství vjemů, ale méně intenzivně – hrozí povrchnost.",
    temp: [["Sangvinik", "stabilní · extravertní (krev)", "společenský, optimistický, aktivní, vůdčí"], ["Cholerik", "labilní · extravertní (žluč)", "vzrušivý, impulzivní, neklidný, vznětlivý"]] },
];
const FUNKCE = [
  { id: "mysleni", nazev: "Myšlení", osa: "racionální · hodnotící", barva: "#E0A020", def: "Říká, co věc JE. Analyzuje, definuje, vnáší do reality logický řád a strukturu.", umeni: "Geometrická přísnost, zlatý řez, matematická perspektiva, kánon forem, konstruktivismus. Renesance, klasicismus, kubismus, Bauhaus.", ext: "Extravertní myslivý typ řídí sebe i druhé podle pevných objektivních pravidel – technické výkresy, architektonický kánon, funkcionalismus.", int: "Introvertní myslivý typ se zabývá vlastními myšlenkami a otázkami bytí, diváka ignoruje – konceptuální umění redukované na esenci (analytický kubismus, Malevič)." },
  { id: "vnimani", nazev: "Vnímání", osa: "iracionální · percepční", barva: "#3E9E8F", def: "Konstatuje, že něco EXISTUJE. Sbírá čistá fakta a smyslové vjemy bez hodnocení.", umeni: "Citlivost na materiál, texturu, světlo, anatomickou přesnost. Realismus, naturalismus, impresionismus, pompejská malba.", ext: "Extravertní vnímavý typ přijímá svět bez filtru – mistrovství prchavého okamžiku světla (Monet); jednostrannost vede k honbě za stimulací (pop art).", int: "Introvertní vnímavý typ se sytí subjektivními dojmy, které v něm vjemy vyvolávají – proměňuje barvu a tvar podle vnitřního otisku (Bonnard, Hokusai)." },
  { id: "citeni", nazev: "Cítění", osa: "racionální · hodnotící", barva: "#C4547E", def: "Určuje subjektivní HODNOTU věcí: co je příjemné, cenné, etické, posvátné.", umeni: "Emocionální expresivita, dramatický patos, morální a náboženské poselství. Gotika, baroko, romantismus, expresionismus.", ext: "Extravertní citový typ je konvenční, výborně přizpůsobený době – vyjadřuje emoce, které jsou v kultuře žádoucí (rokoko, historismus, akademismus).", int: "Introvertní citový typ působí navenek chladně, ale cit je hluboký – intimní lyrika, poezie forem, posvátno, které není pro dav (Friedrich, Chagall)." },
  { id: "intuice", nazev: "Intuice", osa: "iracionální · percepční", barva: "#8E7CC3", def: "Vnímá skryté MOŽNOSTI, duchovní pozadí a budoucí směřování věcí.", umeni: "Symboly, metafory, snové vize, rozpad lineární kauzality. Symbolismus, surrealismus, vizionářské a abstraktní umění.", ext: "Extravertní intuitivní typ neustále hledá nové možnosti – charismatický inovátor, zakladatel směrů, který u ničeho dlouho nevydrží (Picasso, Marinetti).", int: "Introvertní intuitivní typ se nechává vést vnitřním zrakem a archetypy – „nepochopený génius“, tvůrce snových krajin (Bosch, af Klint, surrealisté)." },
];
const CYKLY = [
  { nazev: "Prvotní rituální cyklus", kdy: "40 000 – 10 000 př. n. l.", barva: "#8A5A34", smer: "Absolutní introverze – aktivita stažená do podzemních svatyní.", klima: "Poslední glaciální maximum, extrémní chlad.", arch: "Cyklus urobora: splynutí subjektu a objektu, umění jako posvátný rituál. Evropa, Indie, Austrálie." },
  { nazev: "Neolitická geometrizace a megality", kdy: "10 000 – 2 500 př. n. l.", barva: "#C69A5B", smer: "Vznikající extraverze – budování trvalých struktur.", klima: "Holocénní oteplení, vznik zemědělství.", arch: "Cyklus Velké Matky: úzkost z neúrody kompenzována geometrickým řádem vtištěným do krajiny. Çatalhöyük, Stonehenge, Čína." },
  { nazev: "Klasický harmonický cyklus", kdy: "500 př. n. l. – 400 · 1400 – 1600", barva: "#B5552F", smer: "Sebevědomá extraverze – důvěra ve svět a lidské tělo.", klima: "Klimatická optima, přebytky, mořeplavba.", arch: "Apollonský cyklus lidské míry: oslava rozumu, ega a krásy. Řecko, Řím, renesanční Itálie, klasičtí Mayové." },
  { nazev: "Transcendentní a krizový cyklus", kdy: "400 – 1400 · 1600 – 1750", barva: "#0F5673", smer: "Návrat k introverzi – odhmotnění, obrat k nebi.", klima: "Pozdně antická a malá doba ledová, mor, války.", arch: "Cyklus duchovního úniku: mandaly (rozety, kupole) jako nástroj integrace ohrožené psýché. Byzanc, gotika, islám, baroko." },
  { nazev: "Moderní rozštěpení a digitalizace", kdy: "1880 – současnost", barva: "#0F8FB5", smer: "Radikální polarizace – introvertní abstrakce vedle hyper-extravertní techniky.", klima: "Průmyslová a digitální revoluce, světové války, změna klimatu.", arch: "Cyklus alchymistické integrace: rozpad forem (nigredo) osvobozuje archetypy; centroverze – hledání nového Self." },
];
function renderPsych() {
  const pol = $("#polarita");
  pol.innerHTML = POLARITA.map(p => `<div class="card pol" style="--c:${p.barva}"><span class="tag">${esc(p.sub)}</span><h3>${esc(p.nazev)}</h3><h4>Psychologický kořen</h4><p>${esc(p.koren)}</p><h4>Formální vyjádření</h4><p>${esc(p.forma)}</p><h4>Charakteristika vědomí</h4><p>${esc(p.vedomi)}</p><h4>Temperament (Eysenck a antika)</h4><div class="temps">${p.temp.map(t => `<div><b>${esc(t[0])}</b><em>${esc(t[1])}</em><br>${esc(t[2])}</div>`).join("")}</div></div>`).join("");
  // kompas
  const ks = $("#kompas-svg");
  const pos = [[150, 42], [258, 150], [150, 258], [42, 150]];
  ks.innerHTML = `<circle class="ring" cx="150" cy="150" r="140"/><line class="axis" x1="150" y1="20" x2="150" y2="280"/><line class="axis" x1="20" y1="150" x2="280" y2="150"/><circle cx="150" cy="150" r="30" fill="var(--surface)" stroke="var(--line-strong)"/><text x="150" y="155" text-anchor="middle" style="font:700 13px var(--cond);fill:var(--ink-soft);letter-spacing:.1em">PSÝCHÉ</text>` +
    FUNKCE.map((f, i) => `<g class="node${i === 0 ? " on" : ""}" data-i="${i}" style="--c:${f.barva}" tabindex="0" role="button" aria-label="${esc(f.nazev)}"><circle cx="${pos[i][0]}" cy="${pos[i][1]}" r="38"/><text x="${pos[i][0]}" y="${pos[i][1] + 2}">${esc(f.nazev.toUpperCase())}</text><text class="sub" x="${pos[i][0]}" y="${pos[i][1] + 15}">${esc(f.osa.split(" ")[0])}</text></g>`).join("");
  let fnIdx = 0, fnSub = "ext";
  const drawFn = () => {
    const f = FUNKCE[fnIdx];
    $("#fn-panel").style.setProperty("--c", f.barva);
    $("#fn-panel").innerHTML = `<span class="pill" style="background:${f.barva};color:#fff">${esc(f.osa)} osa</span><h3 style="margin-top:8px">${esc(f.nazev)}</h3><p><b>Definice:</b> ${esc(f.def)}</p><p><b>Ve výtvarném umění:</b> ${esc(f.umeni)}</p><div class="seg"><button type="button" data-s="ext"${fnSub === "ext" ? ' class="on"' : ""}>Extravertní typ</button><button type="button" data-s="int"${fnSub === "int" ? ' class="on"' : ""}>Introvertní typ</button></div><p>${esc(fnSub === "ext" ? f.ext : f.int)}</p>`;
    $$(".seg button", $("#fn-panel")).forEach(b => b.addEventListener("click", () => { fnSub = b.dataset.s; drawFn(); }));
    $$(".node", ks).forEach((n, i) => n.classList.toggle("on", i === fnIdx));
  };
  $$(".node", ks).forEach(n => { const go = () => { fnIdx = +n.dataset.i; drawFn(); }; n.addEventListener("click", go); n.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } }); });
  drawFn();
  // cykly
  $("#cykly").innerHTML = CYKLY.map(c => `<div class="cyk" style="--c:${c.barva}"><b>${esc(c.nazev)}</b><span class="kdy">${esc(c.kdy)}</span><p><b>Směr energie:</b> ${esc(c.smer)}</p><p><b>Klima:</b> ${esc(c.klima)}</p><p>${esc(c.arch)}</p></div>`).join("");
  // kolo duchů
  const kolo = $("#kolo-svg"), cx = 170, cy = 170, R = 160, r = 92, n = DUCHOVE.length;
  const arc = (a0, a1) => {
    const p = (rad, a) => [cx + rad * Math.cos(a), cy + rad * Math.sin(a)];
    const [x0, y0] = p(R, a0), [x1, y1] = p(R, a1), [x2, y2] = p(r, a1), [x3, y3] = p(r, a0);
    return `M${x0},${y0} A${R},${R} 0 0 1 ${x1},${y1} L${x2},${y2} A${r},${r} 0 0 0 ${x3},${y3} Z`;
  };
  kolo.innerHTML = DUCHOVE.map((d, i) => {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n, am = (a0 + a1) / 2, rm = (R + r) / 2;
    return `<g class="seg7" data-id="${d.id}" tabindex="0" role="button" aria-label="${esc(d.jmeno)}"><path d="${arc(a0 + 0.01, a1 - 0.01)}" fill="${d.barva}"/><text class="sym" x="${cx + rm * Math.cos(am)}" y="${cy + rm * Math.sin(am) - 4}">${esc(d.symbol)}</text><text x="${cx + rm * Math.cos(am)}" y="${cy + rm * Math.sin(am) + 14}">${esc(d.jmeno.toUpperCase())}</text></g>`;
  }).join("") + `<text class="mid" x="${cx}" y="${cy - 6}">7 × 354 LET</text><text class="mid" x="${cx}" y="${cy + 12}">= 2 480 LET</text>`;
  $$(".seg7", kolo).forEach(g => { const go = () => vyberDucha(g.dataset.id); g.addEventListener("click", go); g.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); go(); } }); });
  vyberDucha("michael");
}
function vyberDucha(id) {
  const d = DUCHOVE.find(x => x.id === id);
  $$("#kolo-svg .seg7").forEach(g => g.classList.toggle("on", g.dataset.id === id));
  const per = obdobiDuchu(-7700, 2600).filter(p => p.duch.id === id);
  const pan = $("#duch-panel"); pan.style.setProperty("--c", d.barva);
  pan.innerHTML = `<span class="pill" style="background:${d.barva};color:#fff">${esc(d.symbol)} ${esc(d.planeta)}</span><h3 style="margin-top:8px">${esc(d.jmeno)}</h3><p><em>${esc(d.heslo)}</em></p><p>${esc(d.charakter)}</p><h4>V umění a kultuře</h4><p>${esc(d.umeni)}</p><h4>Období vlády (354 let)</h4><div class="per">${per.map(p => `<span>${esc(fmtRokKratky(p.od))} – ${esc(fmtRokKratky(p.do))}</span>`).join("")}</div>`;
}

/* ---------- klima a dějiny ---------- */
function renderKlima() {
  $("#evlist").innerHTML = UDALOSTI.slice().sort((a, b) => a.rok - b.rok).map(u => `<article class="evc" id="ud-${esc(u.id)}"><div class="yr">${esc(fmtRokKratky(u.rok))}<small>${esc(u.kdy)}</small></div><div><h3>${esc(u.nazev)}<span class="typ ${u.typ}"><svg><use href="#${IKONY_TYP[u.typ]}"/></svg>${esc(TYP_NAZEV[u.typ])}</span></h3><p>${esc(u.popis)}</p><p><b>Vliv na umění:</b> ${esc(u.umeni)}</p><div class="links">${u.epochy.map(id => EP[id] ? `<button type="button" class="lnk" data-ep="${id}" style="--c:${OBD[EP[id].obdobi].barva}"><i></i>${esc(EP[id].nazev)}</button>` : "").join("")}</div></div></article>`).join("");
  $$("#evlist .lnk").forEach(l => l.addEventListener("click", () => otevriEpochu(l.dataset.ep)));
}

/* ---------- detail epochy ---------- */
let aktualni = null;
function otevriEpochu(id) {
  const e = EP[id]; if (!e) return;
  aktualni = id;
  const o = OBD[e.obdobi];
  const seznam = e.vrstva === "svet" ? SVET : EVROPA;
  const i = seznam.findIndex(x => x.id === id);
  const prev = seznam[i - 1], next = seznam[i + 1];
  const duchove = obdobiDuchu(e.od, e.do).filter(p => p.do - p.od > 0);
  const p = ((e.jung?.postoj ?? 0) + 1) / 2;
  const det = $("#det");
  det.innerHTML = `
    <div class="det-top">
      <span class="tools"><button type="button" class="home" id="det-close"><svg><use href="#i-home"/></svg>Domů</button><button type="button" class="home" id="det-search" title="Hledat v celé aplikaci (Ctrl+K)"><svg><use href="#i-search"/></svg>Hledat</button></span>
      <span class="obd" style="--c:${o.barva}"><i></i>${esc(o.nazev)}${e.vrstva === "svet" ? " · mimo Evropu" : ""}</span>
      <span class="dat">${esc(e.datace)}</span>
    </div>
    <div class="det-head">
      ${kolecko(e)}
      <h2>${esc(e.nazev)}</h2>
      <p class="sub">${esc(e.podtitul || "")}</p>
      <div class="rule" style="background:${o.barva}"></div>
      ${e.faze && e.faze.length ? `<div class="faze" style="--c:${o.barva}">${e.faze.map(f => `<div>${esc(f.nazev)}<small>${esc(f.kdy)}</small></div>`).join("")}</div>` : ""}
    </div>
    <div class="det-body">
      <div>
        ${e.text.map(t => `<p>${esc(t)}</p>`).join("")}
        <h4>Hlavní znaky</h4><ul>${e.znaky.map(z => `<li>${esc(z)}</li>`).join("")}</ul>
      </div>
      <div>
        <h4>Architektura</h4><p>${esc(e.oblasti.architektura)}</p>
        <h4>Sochařství</h4><p>${esc(e.oblasti.socharstvi)}</p>
        <h4>Malířství</h4><p>${esc(e.oblasti.malirstvi)}</p>
        ${e.osobnosti && e.osobnosti.length ? `<h4>Osobnosti</h4><div class="chips">${e.osobnosti.map(x => `<span>${esc(x)}</span>`).join("")}</div>` : ""}
        ${e.cesko && e.cesko !== "—" ? `<h4>U nás</h4><p>${esc(e.cesko)}</p>` : ""}
      </div>
    </div>
    <div class="det-gal"><h3>Obrazové ukázky</h3><div class="gal">${e.pamatky.map((pm, pi) => {
      const d = doplnit(pm.popis);
      const soubor = pm.img || d.soubor;
      const ph = `<div class="ph"><svg><use href="#i-img"/></svg>Ukázka k doplnění${d.soubor ? `<code>img/${esc(d.soubor)}</code>` : ""}</div>`;
      return `<figure data-pm="${pi}">${soubor ? `<button type="button" class="im" data-img="${esc(soubor)}" data-cap="${esc(pm.nazev)} – ${esc(d.text)}"><img src="img/thumb/${esc(soubor)}" alt="${esc(pm.nazev)}" loading="lazy" data-full="img/${esc(soubor)}"></button>` : ph}<figcaption><b>${esc(pm.nazev)}</b>${esc(d.text)}</figcaption></figure>`;
    }).join("")}</div></div>
    <div class="det-links"><h3>Souvislosti</h3><div class="three">
      <div class="card" style="--c:var(--deep)"><h3>Hlubinná psychologie</h3><span class="pill">${esc(e.jung.nazevPostoje)}</span><div class="gauge" style="--p:${p}"></div><div class="gauge-lbl"><span>introverze</span><span>extraverze</span></div><p><b>Funkce:</b> ${esc(e.jung.funkce)}</p><p>${esc(e.jung.text)}</p></div>
      <div class="card" style="--c:var(--moss)"><h3>Klima a dějiny</h3><p>${esc(e.klima)}</p>${e.udalosti && e.udalosti.length ? `<div class="chips">${e.udalosti.map(u => UD[u] ? `<button type="button" class="lnk ud" data-ud="${u}" style="--c:${u && UD[u].typ === "astro" ? "#E0A020" : UD[u].typ === "klima" ? "var(--deep)" : "var(--clay)"}"><i></i>${esc(UD[u].nazev)}</button>` : "").join("")}</div>` : ""}</div>
      <div class="card" style="--c:${duchove[0] ? duchove[0].duch.barva : "var(--dry)"}"><h3>Duch času · Páleš</h3>${duchove.length ? `<div class="chips">${duchove.map(d => `<span style="border-color:${d.duch.barva}">${esc(d.duch.symbol)} ${esc(d.duch.jmeno)} · ${esc(fmtRokKratky(d.od))}–${esc(fmtRokKratky(d.do))}</span>`).join("")}</div>` : ""}<p style="margin-top:8px">${esc(e.pales === "—" ? "Období předchází rytmu duchů času, který Páleš sleduje od starověku." : e.pales)}</p></div>
    </div></div>
    <div class="det-nav">
      ${prev ? `<button type="button" data-ep="${prev.id}"><svg><use href="#i-left"/></svg><span><small>Předchozí</small>${esc(prev.nazev)}</span></button>` : "<span></span>"}
      ${next ? `<button type="button" data-ep="${next.id}"><span><small>Další</small>${esc(next.nazev)}</span><svg><use href="#i-right"/></svg></button>` : "<span></span>"}
    </div>`;
  const dlg = $("#detail");
  if (!dlg.open) dlg.showModal();
  det.scrollTop = 0;
  $("#det-close").addEventListener("click", () => dlg.close());
  $("#det-search").addEventListener("click", () => otevriHledani());
  $$(".det-nav button", det).forEach(b => b.addEventListener("click", () => otevriEpochu(b.dataset.ep)));
  $$(".im", det).forEach(b => b.addEventListener("click", () => lightbox(b.dataset.img, b.dataset.cap)));
  // chybějící soubor: nejdřív zkusit plnou velikost (bez náhledu), pak zobrazit rámeček k doplnění
  $$(".im img", det).forEach(im => im.addEventListener("error", () => {
    if (im.dataset.full && im.src.indexOf("/thumb/") > -1) { im.src = im.dataset.full; return; }
    const fig = im.closest("figure"), btn = im.closest(".im"), soubor = btn.dataset.img;
    btn.replaceWith(Object.assign(document.createElement("div"), { className: "ph", innerHTML: `<svg><use href="#i-img"/></svg>Ukázka k doplnění<code>img/${esc(soubor)}</code>` }));
  }));
  $$(".lnk.ud", det).forEach(b => b.addEventListener("click", () => { dlg.close(); $("#klima").scrollIntoView({ behavior: "smooth" }); }));
  try { history.replaceState(null, "", "#" + id); } catch (err) { /* nevadí */ }
}
function lightbox(img, cap) {
  const lb = $("#lb");
  $("#lb-in").innerHTML = `<img src="img/${esc(img)}" alt=""><p>${esc(cap)}</p>`;
  lb.showModal();
}
$("#lb-in").addEventListener("click", () => $("#lb").close());
$("#detail").addEventListener("click", ev => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });
$("#detail").addEventListener("close", () => { aktualni = null; try { history.replaceState(null, "", location.pathname + location.search); } catch (err) { /* nevadí */ } });

/* ---------- univerzální vyhledávání (Ctrl+K nebo /) ----------
   Prohledává epochy, obrazové ukázky, osobnosti, události, body na mapě,
   duchy času, období i sekce stránky. Funguje odkudkoli – i z otevřené karty. */
const norm = s => String(s ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const SEKCE = [
  { id: "osa", nazev: "Časová osa", popis: "Vodorovná osa 40 000 let: epochy, události, duchové času, Jungova křivka." },
  { id: "seznam", nazev: "Seznam epoch a směrů", popis: "Kolečka všech epoch seřazená podle období." },
  { id: "prehled", nazev: "Rychlý přehled", popis: "Tabulka epoch s jednou větou a Jungovým postojem." },
  { id: "mapa", nazev: "Mapa světa", popis: "Interaktivní body – památky a kultury na mapě." },
  { id: "psychologie", nazev: "Psychologie dějin umění", popis: "Jung: introverze a extraverze, funkce; Páleš: kolo duchů času." },
  { id: "klima", nazev: "Klima a dějiny", popis: "Klimatické, astronomické a dějinné události a jejich vliv na umění." },
  { id: "zdroje", nazev: "Zdroje a literatura", popis: "Použité knihy a odkazy." }
];
let INDEX = null;
function sestavIndex() {
  const ix = [];
  const push = o => { o.hay = norm(o.hayRaw); delete o.hayRaw; ix.push(o); };
  EPOCHY.forEach(e => {
    const o = OBD[e.obdobi];
    push({ typ: "epocha", skupina: "Epochy a směry", id: e.id, titul: e.nazev, sub: `${e.datace} · ${o.nazev}${e.vrstva === "svet" ? " · mimo Evropu" : ""} – ${e.strucne}`, barva: o.barva, ikona: e.ikona ? `img/thumb/${e.ikona}` : null, zkr: zkratka(e.nazev), vaha: 3,
      hayRaw: [e.nazev, e.podtitul, e.datace, o.nazev, e.strucne, e.text, e.znaky, e.oblasti && Object.values(e.oblasti), (e.faze || []).map(f => f.nazev + " " + f.kdy), e.osobnosti, e.cesko, e.jung && e.jung.text, e.jung && e.jung.nazevPostoje, e.klima, e.pales].flat(3).filter(Boolean).join(" | "), primar: norm([e.nazev, e.podtitul].join(" ")) });
    (e.pamatky || []).forEach((pm, i) => {
      const d = doplnit(pm.popis); const soubor = pm.img || d.soubor;
      push({ typ: "dilo", skupina: "Obrazové ukázky", id: e.id, pm: i, titul: pm.nazev, sub: `${e.nazev} · ${d.text}`, barva: o.barva, ikona: soubor ? `img/thumb/${soubor}` : null, zkr: "obr", vaha: 2, hayRaw: [pm.nazev, d.text].join(" | "), primar: norm(pm.nazev) });
    });
    (e.osobnosti || []).forEach(os => push({ typ: "osoba", skupina: "Osobnosti", id: e.id, titul: os, sub: `${e.nazev} · ${e.datace}`, barva: o.barva, ikona: null, zkr: "os", vaha: 2, hayRaw: os, primar: norm(os) }));
  });
  UDALOSTI.forEach(u => push({ typ: "udalost", skupina: "Klima, astronomie a dějiny", id: u.id, titul: u.nazev, sub: `${fmtRokKratky(u.rok)} · ${u.kdy} – ${u.popis}`, barva: u.typ === "astro" ? "#E0A020" : u.typ === "klima" ? "var(--deep)" : "var(--clay)", ikona: null, zkr: TYP_NAZEV[u.typ].slice(0, 3), vaha: 2, hayRaw: [u.nazev, u.kdy, u.popis, u.umeni, TYP_NAZEV[u.typ]].join(" | "), primar: norm(u.nazev) }));
  MAPA_BODY.forEach(b => push({ typ: "misto", skupina: "Místa na mapě světa", id: b.id, titul: b.nazev, sub: `${b.kdy} – ${b.popis}`, barva: OBD[b.obdobi] ? OBD[b.obdobi].barva : null, ikona: null, zkr: "map", vaha: 2, hayRaw: [b.nazev, b.kdy, b.popis].join(" | "), primar: norm(b.nazev) }));
  DUCHOVE.forEach(d => push({ typ: "duch", skupina: "Duchové času (Páleš)", id: d.id, titul: `${d.symbol} ${d.jmeno} – ${d.planeta}`, sub: `${d.heslo} · ${d.obdobi}`, barva: d.barva, ikona: null, zkr: d.symbol, vaha: 1.5, hayRaw: [d.jmeno, d.planeta, d.heslo, d.charakter, d.umeni, d.obdobi].join(" | "), primar: norm(d.jmeno + " " + d.planeta) }));
  OBDOBI.forEach(o => push({ typ: "obdobi", skupina: "Období", id: o.id, titul: o.nazev, sub: `${fmtRok(o.od)} – ${fmtRok(o.do)} · ${o.popis}`, barva: o.barva, ikona: null, zkr: zkratka(o.nazev), vaha: 1.5, hayRaw: [o.nazev, o.popis].join(" | "), primar: norm(o.nazev) }));
  SEKCE.forEach(s => push({ typ: "sekce", skupina: "Části aplikace", id: s.id, titul: s.nazev, sub: s.popis, barva: null, ikona: null, zkr: "§", vaha: 1, hayRaw: [s.nazev, s.popis].join(" | "), primar: norm(s.nazev) }));
  return ix;
}
// zjednodušené „skloňování“: krakatoa → krakato (najde i Krakatoy), katedrály → katedrál
const kmeny = w => { const k = [w]; if (w.length >= 5) k.push(w.slice(0, -1)); if (w.length >= 7) k.push(w.slice(0, -2)); return k; };
function hledej(q) {
  const slova = norm(q).split(/\s+/).filter(Boolean);
  if (!slova.length) return [];
  if (!INDEX) INDEX = sestavIndex();
  const out = [];
  for (const it of INDEX) {
    if (!slova.every(w => kmeny(w).some(k => it.hay.includes(k)))) continue;
    let sk = it.vaha;
    for (const w of slova) {
      if (it.primar.includes(w)) sk += 4;
      if (new RegExp("(^|[^a-z0-9])" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).test(it.primar)) sk += 2;
      if (it.primar.startsWith(w)) sk += 2;
    }
    out.push({ it, sk });
  }
  out.sort((a, b) => b.sk - a.sk || a.it.titul.localeCompare(b.it.titul, "cs"));
  return out.map(x => x.it);
}
function zvyrazni(text, q) {
  const slova = norm(q).split(/\s+/).filter(Boolean);
  const src = String(text ?? ""); const n = norm(src);
  if (!slova.length || n.length !== src.length) return esc(src); // při odlišné délce po normalizaci raději bez zvýraznění
  const mask = new Array(src.length).fill(false);
  for (const w of slova) { let i = 0; while ((i = n.indexOf(w, i)) > -1) { for (let k = i; k < i + w.length; k++) mask[k] = true; i += w.length; } }
  let out = "", open = false;
  for (let i = 0; i < src.length; i++) { if (mask[i] !== open) { out += mask[i] ? "<mark>" : "</mark>"; open = mask[i]; } out += esc(src[i]); }
  return out + (open ? "</mark>" : "");
}
function uryvek(text, q, delka = 150) {
  const src = String(text ?? ""); if (src.length <= delka) return src;
  const n = norm(src); const slova = norm(q).split(/\s+/).filter(Boolean);
  let pos = -1; for (const w of slova) { const i = n.indexOf(w); if (i > -1 && (pos < 0 || i < pos)) pos = i; }
  if (pos < 40) return src.slice(0, delka) + "…";
  const start = Math.max(0, src.lastIndexOf(" ", pos - 30));
  return "…" + src.slice(start + 1, start + 1 + delka) + "…";
}
const IKONA_TYP = { osoba: "#i-person", misto: "#i-pin", udalost: "#i-klima", sekce: "#i-osa" };
const TYP_KLIC = { epocha: "epocha", dilo: "ukázka", osoba: "osobnost", udalost: "událost", misto: "mapa", duch: "duch času", obdobi: "období", sekce: "sekce" };
let srchAct = 0, srchHits = [];
function vykresliHledani() {
  const q = $("#srch-q").value, box = $("#srch-res");
  srchHits = hledej(q); srchAct = 0;
  if (!q.trim()) {
    box.innerHTML = `<div class="srch-empty"><p>Prohledává se všechno najednou: <b>epochy a směry, obrazové ukázky, osobnosti, události (klima · astronomie · dějiny), místa na mapě, duchové času i části stránky</b>. Diakritika nerozhoduje – „parler“ najde Parléře.</p><p>Zkuste například:</p><div class="tips">${["gotika", "Parléř", "mozaika", "Krakatoa", "Michael", "Věstonice", "kubismus", "katedrála", "Pardubice"].map(t => `<button type="button" data-q="${esc(t)}">${esc(t)}</button>`).join("")}</div></div>`;
    $$(".tips button", box).forEach(b => b.addEventListener("click", () => { $("#srch-q").value = b.dataset.q; vykresliHledani(); $("#srch-q").focus(); }));
    return;
  }
  if (!srchHits.length) { box.innerHTML = `<div class="srch-empty"><p>Pro „${esc(q)}“ nebylo nic nalezeno. Zkuste kratší nebo jiné slovo (např. jen část jména).</p></div>`; return; }
  const MAX = 8; const skup = new Map();
  srchHits.forEach(it => { if (!skup.has(it.skupina)) skup.set(it.skupina, []); skup.get(it.skupina).push(it); });
  let html = "", n = 0; const zobr = [];
  for (const [nazev, items] of skup) {
    html += `<h4>${esc(nazev)}${items.length > MAX ? `<small>${items.length} výsledků, zobrazeno ${MAX}</small>` : ""}</h4>`;
    items.slice(0, MAX).forEach(it => {
      const ico = it.ikona ? `<span class="ico${it.typ === "dilo" ? " sq" : ""}" style="--c:${it.barva || "var(--line-strong)"}"><img src="${esc(it.ikona)}" alt="" loading="lazy" onerror="this.parentNode.textContent='${esc(it.zkr)}'"></span>`
        : IKONA_TYP[it.typ] ? `<span class="ico" style="--c:${it.barva || "var(--ink-soft)"}"><svg><use href="${IKONA_TYP[it.typ]}"/></svg></span>`
        : `<span class="ico" style="--c:${it.barva || "var(--ink-soft)"}">${esc(it.zkr)}</span>`;
      html += `<button type="button" class="srch-it${n === 0 ? " act" : ""}" role="option" aria-selected="${n === 0}" data-i="${n}" id="srch-it-${n}">${ico}<span><span class="t">${zvyrazni(it.titul, q)}</span><span class="s">${zvyrazni(uryvek(it.sub, q), q)}</span></span><span class="k">${esc(TYP_KLIC[it.typ])}</span></button>`;
      zobr.push(it); n++;
    });
  }
  srchHits = zobr;
  box.innerHTML = html;
  $$(".srch-it", box).forEach(b => { b.addEventListener("click", () => vyberVysledek(+b.dataset.i)); b.addEventListener("mousemove", () => nastavAkt(+b.dataset.i, false)); });
  box.scrollTop = 0;
}
function nastavAkt(i, scroll = true) {
  const items = $$("#srch-res .srch-it"); if (!items.length) return;
  srchAct = (i + items.length) % items.length;
  items.forEach((b, k) => { b.classList.toggle("act", k === srchAct); b.setAttribute("aria-selected", k === srchAct); });
  $("#srch-q").setAttribute("aria-activedescendant", "srch-it-" + srchAct);
  if (scroll) items[srchAct].scrollIntoView({ block: "nearest" });
}
function otevriHledani(predvyplnit) {
  const dlg = $("#hledat"), inp = $("#srch-q");
  if (typeof predvyplnit === "string") inp.value = predvyplnit;
  if (!dlg.open) dlg.showModal();
  vykresliHledani();
  inp.focus(); inp.select();
}
function zavriHledani() { const dlg = $("#hledat"); if (dlg.open) dlg.close(); }
function zavriDetail() { const d = $("#detail"); if (d.open) d.close(); }
function naSekci(id, fn) {
  zavriDetail(); zavriHledani();
  const el = document.getElementById(id); if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (fn) setTimeout(fn, 400);
}
function bliknout(el) { if (!el) return; el.classList.add("hl"); el.scrollIntoView({ behavior: "smooth", block: "center" }); setTimeout(() => el.classList.remove("hl"), 2600); }
function vyberVysledek(i) {
  const it = srchHits[i]; if (!it) return;
  switch (it.typ) {
    case "epocha": case "osoba": zavriHledani(); otevriEpochu(it.id); break;
    case "dilo": zavriHledani(); otevriEpochu(it.id); setTimeout(() => bliknout($(`#det figure[data-pm="${it.pm}"]`)), 120); break;
    case "udalost": naSekci("klima", () => bliknout($("#ud-" + it.id))); break;
    case "misto": naSekci("mapa", () => { mapaFiltr = null; $$("#mapa-filters .chip").forEach(x => x.classList.toggle("on", !x.dataset.era)); kresliBody(); ukazBod(it.id, $(`#mapa-body .pt[data-id="${it.id}"]`)); bliknout($("#mapa-card")); }); break;
    case "duch": naSekci("psychologie", () => { vyberDucha(it.id); const k = $("#kolo-svg"); if (k) k.scrollIntoView({ behavior: "smooth", block: "center" }); }); break;
    case "obdobi": naSekci("osa", () => skokNaObdobi(it.id)); break;
    case "sekce": naSekci(it.id); break;
  }
}
function initHledani() {
  const dlg = $("#hledat"), inp = $("#srch-q");
  $("#btn-hledat").addEventListener("click", () => otevriHledani());
  $("#srch-close").addEventListener("click", zavriHledani);
  inp.addEventListener("input", vykresliHledani);
  inp.addEventListener("keydown", ev => {
    if (ev.key === "ArrowDown") { ev.preventDefault(); nastavAkt(srchAct + 1); }
    else if (ev.key === "ArrowUp") { ev.preventDefault(); nastavAkt(srchAct - 1); }
    else if (ev.key === "Enter") { ev.preventDefault(); vyberVysledek(srchAct); }
    else if (ev.key === "Escape") { ev.preventDefault(); zavriHledani(); }
  });
  dlg.addEventListener("click", ev => { if (ev.target === dlg) zavriHledani(); });
  document.addEventListener("keydown", ev => {
    const tag = (ev.target.tagName || "").toLowerCase(), vTextu = tag === "input" || tag === "textarea" || ev.target.isContentEditable;
    if ((ev.ctrlKey || ev.metaKey) && !ev.altKey && ev.key.toLowerCase() === "k") { ev.preventDefault(); dlg.open ? zavriHledani() : otevriHledani(); return; }
    if (ev.key === "/" && !vTextu && !dlg.open && !ev.ctrlKey && !ev.metaKey && !ev.altKey) { ev.preventDefault(); otevriHledani(""); }
  });
}

/* ---------- inicializace ---------- */
function init() {
  initHledani();
  $("#rok").textContent = new Date().getFullYear();
  const tg = $(".nav-toggle"), nav = $("#menu");
  tg.addEventListener("click", () => { const o = nav.classList.toggle("open"); tg.setAttribute("aria-expanded", o); });
  $$("a", nav).forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
  renderHero(); initOsa(); renderSeznam(); renderPrehled(); renderMapa(); renderPsych(); renderKlima();
  const h = location.hash.replace("#", "");
  if (h && EP[h]) setTimeout(() => otevriEpochu(h), 200);
  let t; window.addEventListener("resize", () => { clearTimeout(t); t = setTimeout(renderOsa, 150); });
}
document.addEventListener("DOMContentLoaded", init);
})();

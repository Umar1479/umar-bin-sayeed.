/* Renders the career Gantt and the sample dashboard as inline SVG. No dependencies. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  function el(name, attrs, text) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) {
      var v = attrs[k];
      if ((k === "fill" || k === "stroke") && String(v).indexOf("var(") === 0) n.style.setProperty(k, v);
      else n.setAttribute(k, v);
    }
    if (text != null) n.textContent = text;
    return n;
  }

  /* ---------- Career programme (Gantt) ---------- */
  var gantt = document.getElementById("gantt");
  if (gantt) {
    // Source: CV. Dates are month starts/ends as written in the CV.
    var roles = [
      { id: "A1010", name: "Planning Engineer", org: "BCES, Hyderabad", s: [2019, 0], f: [2020, 11], when: "Jan 2019 to Dec 2020",
        det: ["Baseline schedules, cost analyses and resource quantities.", "Tracked critical activities to avoid liquidated damages.", "S-curves, manpower histograms and look-ahead schedules."] },
      { id: "A1020", name: "Planning Engineer", org: "Lakshmi Builders & Developers, Bangalore", s: [2021, 3], f: [2022, 11], when: "Apr 2021 to Dec 2022",
        det: ["Project plans and milestone schedules for on-time completion.", "Monitored KPIs such as weekly work-order closures and progress trends."] },
      { id: "A1030", name: "Planning Engineer", org: "Al-Fouzan Trading & General Contracting Co., Riyadh", s: [2023, 0], f: [2023, 11], when: "Jan 2023 to Dec 2023",
        det: ["Baseline and recovery schedules. Daily, weekly and monthly progress and delay reports.", "Tracked company- and subcontractor-caused delays and reported the impact on completion dates."] },
      { id: "A1040", name: "Lead Planning & Project Control", org: "Motive International Contracting Co., Riyadh", s: [2024, 0], f: null, now: true, when: "Jan 2024 to present",
        det: ["Leads planning and controls on up to 4 concurrent projects.", "Approved Primavera P6 baselines, cost- and resource-loaded programmes, recovery plans.", "Delay and early-warning notices, EOT claims, weekly and monthly reports with SPI and CPI.", "Tender programmes and technical proposal content."] }
    ];
    var RESULTS = ["185+ days of EOT secured across 5 claims.", "Delay exposure reduced by an estimated 15%.", "100% on-time record on tender programmes.", "Executive dashboards and KPI reporting introduced."];
    var detail = document.getElementById("gantt-detail");
    function showDetail(title, sub, lines) {
      if (!detail) return;
      detail.innerHTML = "";
      var b = document.createElement("b"); b.textContent = title; detail.appendChild(b);
      if (sub) { var sp = document.createElement("span"); sp.className = "dsub"; sp.textContent = sub; detail.appendChild(sp); }
      var ul = document.createElement("ul");
      lines.forEach(function (l) { var li = document.createElement("li"); li.textContent = l; ul.appendChild(li); });
      detail.appendChild(ul);
    }
    function hit(g, fn) {
      g.setAttribute("tabindex", "0"); g.setAttribute("role", "button"); g.setAttribute("class", "hit");
      g.addEventListener("click", fn);
      g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(); } });
      svg.appendChild(g);
      return g;
    }
    var rangeStart = new Date(2018, 9, 1), rangeEnd = new Date(2027, 3, 1);
    var today = new Date();
    var dd = today < rangeStart ? rangeStart : today > rangeEnd ? rangeEnd : today;
    var X0 = 270, X1 = 980, W = 1000, rowH = 50, top = 44;
    function x(d) { return X0 + (d - rangeStart) / (rangeEnd - rangeStart) * (X1 - X0); }
    function mStart(a) { return new Date(a[0], a[1], 1); }
    function mEnd(a) { return new Date(a[0], a[1] + 1, 0); }
    var rows = roles.length + 2;           // roles + milestone lane + achievements lane
    var H = top + rows * rowH + 34;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-labelledby": "gantt-t gantt-d" });
    svg.appendChild(el("title", { id: "gantt-t" }, "Career programme: roles from 2019 to today, with Motive as the current role"));
    svg.appendChild(el("desc", { id: "gantt-d" }, "Gantt chart. Planning Engineer at BCES 2019 to 2020, Lakshmi Builders 2021 to 2022, Al-Fouzan 2023, then Lead Planning and Project Control Engineer at Motive from January 2024 to the data date, shown as the current role."));

    // header + year grid
    svg.appendChild(el("rect", { x: 0, y: 0, width: W, height: top - 6, fill: "var(--ch-head)" }));
    svg.appendChild(el("text", { x: 12, y: 24, fill: "var(--ch-head-ink)", "font-size": 12, "font-weight": 700, "font-family": "inherit" }, "Activity"));
    for (var y = 2019; y <= 2027; y++) {
      var gx = x(new Date(y, 0, 1));
      svg.appendChild(el("line", { x1: gx, y1: top - 6, x2: gx, y2: H - 28, stroke: "var(--ch-grid)", "stroke-width": 1 }));
      svg.appendChild(el("text", { x: gx + 4, y: 24, fill: "var(--ch-head-ink)", "font-size": 12, "font-family": "inherit" }, String(y)));
    }
    // row stripes
    for (var r = 0; r < rows; r++) {
      if (r % 2 === 0) svg.insertBefore(el("rect", { x: 0, y: top + r * rowH, width: W, height: rowH, fill: "var(--ch-stripe)" }), svg.children[2]);
    }

    roles.forEach(function (ro, i) {
      var yy = top + i * rowH;
      var s = mStart(ro.s), f = ro.f ? mEnd(ro.f) : rangeEnd;
      var g = el("g", { "aria-label": ro.name + ", " + ro.org + ", " + ro.when + ". Show details." });
      g.appendChild(el("rect", { x: 0, y: yy, width: W, height: rowH, fill: "transparent" }));
      g.appendChild(el("text", { x: 12, y: yy + 22, class: "g-text", "font-weight": 700 }, ro.id + "  " + ro.name));
      g.appendChild(el("text", { x: 12, y: yy + 38, class: "g-small" }, ro.org.split(",")[0]));
      var bx = x(s), bw = x(ro.f ? f : dd) - bx;
      var col = ro.now ? "var(--gold)" : "var(--ch-teal)";
      var dark = ro.now ? "var(--ch-gold-d)" : "#12606f";
      // total bar (light) then progress (dark) like P6
      g.appendChild(el("rect", { x: bx, y: yy + 12, width: (x(f) - bx), height: 24, rx: 3, fill: col, opacity: ro.now ? 0.35 : 1 }));
      g.appendChild(el("rect", { x: bx, y: yy + 12, width: bw, height: 24, rx: 3, fill: col }));
      g.appendChild(el("rect", { x: bx, y: yy + 27, width: bw, height: 9, rx: 0, fill: dark, opacity: 0.55 }));
      if (ro.now) {
        g.appendChild(el("text", { x: bx + 8, y: yy + 29, fill: "#1B2A3B", "font-size": 11, "font-weight": 700, "font-family": "inherit" }, "Current role at Motive"));
      }
      hit(g, function () { showDetail(ro.name + ", " + ro.org.split(",")[0], ro.when, ro.det); });
    });

    // milestones lane
    var my = top + roles.length * rowH;
    svg.appendChild(el("text", { x: 12, y: my + 22, class: "g-text", "font-weight": 700 }, "Milestones"));
    svg.appendChild(el("text", { x: 12, y: my + 38, class: "g-small" }, "Dated from the CV"));
    [
      { d: new Date(2019, 0, 1), t: "Career starts", side: 1 },
      { d: new Date(2023, 0, 1), t: "Riyadh roles begin", side: -1 },
      { d: new Date(2024, 0, 1), t: "Joins Motive", side: 1 }
    ].forEach(function (m) {
      var mx = x(m.d), cy = my + 22;
      svg.appendChild(el("path", { d: "M" + mx + " " + (cy - 9) + " l9 9 l-9 9 l-9 -9 z", fill: "var(--gold)", stroke: "var(--ch-gold-d)" }));
      svg.appendChild(el("text", { x: mx + 14 * m.side, y: cy + 4, class: "g-small", "text-anchor": m.side < 0 ? "end" : "start" }, m.t));
    });

    // results lane (numbered; key is listed under the chart; not date-scaled)
    var ay = my + rowH;
    svg.appendChild(el("text", { x: 12, y: ay + 22, class: "g-text", "font-weight": 700 }, "Motive results"));
    svg.appendChild(el("text", { x: 12, y: ay + 38, class: "g-small" }, "Not date-scaled [dates TBC]"));
    var mS = x(new Date(2024, 0, 1)), mE = x(dd);
    RESULTS.forEach(function (txt, i) {
      var ax = mS + (mE - mS) * (i + 0.5) / 4, cy = ay + 24;
      var g = el("g", { "aria-label": "Result " + (i + 1) + ": " + txt });
      g.appendChild(el("title", {}, txt));
      g.appendChild(el("path", { d: "M" + ax + " " + (cy - 13) + " l13 13 l-13 13 l-13 -13 z", fill: "var(--ch-surface)", stroke: "var(--ch-ring)", "stroke-width": 2 }));
      g.appendChild(el("text", { x: ax, y: cy + 4, "text-anchor": "middle", "font-size": 12, "font-weight": 700, fill: "var(--ch-text)", "font-family": "inherit" }, String(i + 1)));
      hit(g, function () { showDetail("Result " + (i + 1) + " at Motive", "Date not stated in the CV", [txt]); });
    });

    // data date
    var dx = x(dd);
    svg.appendChild(el("line", { x1: dx, y1: top - 6, x2: dx, y2: H - 28, stroke: "var(--ch-line)", "stroke-width": 2, "stroke-dasharray": "5 4" }));
    var lbl = dd.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    svg.appendChild(el("rect", { x: dx - 62, y: H - 26, width: 124, height: 22, rx: 11, fill: "var(--ch-line)" }));
    svg.appendChild(el("text", { x: dx, y: H - 11, fill: "var(--ch-line-ink)", "font-size": 11, "font-weight": 700, "text-anchor": "middle", "font-family": "inherit" }, "Data date " + lbl));
    gantt.appendChild(svg);
  }

  /* ---------- Sample dashboard (ILLUSTRATIVE data only) ---------- */
  var sc = document.getElementById("scurve");
  if (sc) {
    var planned = [0, 1, 3, 5, 8, 12, 17, 23, 30, 37, 44, 51, 58, 65, 72, 78, 84, 89, 94, 98, 100];
    var actual = [0, 1, 2, 4, 7, 10, 14, 19, 25, 31, 37, 44, 50];
    var ddw = actual.length - 1;
    var P = planned[ddw], A = actual[ddw], spi = A / P;
    function set(id, v) { var n = document.getElementById(id); if (n) n.textContent = v; }
    set("k-plan", P + "%"); set("k-act", A + "%"); set("k-var", (A - P) + " pts"); set("k-spi", spi.toFixed(2));
    var WW = 640, HH = 300, L = 44, R = 16, T = 14, B = 36;
    function px(w) { return L + (w / 22) * (WW - L - R); }
    function py(v) { return T + (1 - v / 100) * (HH - T - B); }
    var s = el("svg", { viewBox: "0 0 " + WW + " " + HH, role: "img", "aria-labelledby": "sc-t sc-d" });
    s.appendChild(el("title", { id: "sc-t" }, "Sample S-curve: planned versus actual progress (illustrative data)"));
    s.appendChild(el("desc", { id: "sc-d" }, "Illustrative data only. Planned progress reaches 58 percent at the data date, actual progress is 50 percent, and the forecast finish is two weeks late."));
    [0, 25, 50, 75, 100].forEach(function (v) {
      s.appendChild(el("line", { x1: L, x2: WW - R, y1: py(v), y2: py(v), stroke: "var(--ch-grid)" }));
      s.appendChild(el("text", { x: L - 6, y: py(v) + 4, "text-anchor": "end", class: "g-small" }, v + "%"));
    });
    for (var w = 0; w <= 22; w += 2) s.appendChild(el("text", { x: px(w), y: HH - 16, "text-anchor": "middle", class: "g-small" }, "W" + w));
    function path(arr, from) { return arr.map(function (v, i) { return (i === 0 && !from ? "M" : (i === 0 ? "M" : "L")) + px(i + (from || 0)) + " " + py(v); }).join(" "); }
    s.appendChild(el("path", { d: path(planned), fill: "none", stroke: "var(--ch-teal)", "stroke-width": 3 }));
    s.appendChild(el("path", { d: path(actual), fill: "none", stroke: "var(--ch-red)", "stroke-width": 3 }));
    var fc = [50, 56, 63, 70, 77, 84, 90, 95, 98, 100];
    s.appendChild(el("path", { d: path(fc, ddw), fill: "none", stroke: "var(--ch-red)", "stroke-width": 2, "stroke-dasharray": "6 5" }));
    s.appendChild(el("line", { x1: px(ddw), x2: px(ddw), y1: T, y2: HH - B, stroke: "var(--ch-line)", "stroke-dasharray": "5 4", "stroke-width": 2 }));
    s.appendChild(el("text", { x: px(ddw) - 6, y: T + 12, "text-anchor": "end", class: "g-small", "font-weight": 700 }, "Data date"));
    // hover / touch / keyboard read-out (sample data)
    var cross = el("line", { y1: T, y2: HH - B, stroke: "var(--ch-line)", "stroke-width": 1.5, opacity: 0 });
    var dotP = el("circle", { r: 5, fill: "var(--ch-teal)", stroke: "var(--ch-surface)", "stroke-width": 2, opacity: 0 });
    var dotA = el("circle", { r: 5, fill: "var(--ch-red)", stroke: "var(--ch-surface)", "stroke-width": 2, opacity: 0 });
    s.appendChild(cross); s.appendChild(dotP); s.appendChild(dotA);
    var hitr = el("rect", { x: L, y: T, width: WW - L - R, height: HH - T - B, fill: "transparent" });
    s.appendChild(hitr);
    s.setAttribute("tabindex", "0");
    s.setAttribute("aria-describedby", "sc-read");
    var tip = document.createElement("div"); tip.className = "sc-tip"; tip.hidden = true;
    sc.appendChild(tip);
    var readEl = document.getElementById("sc-read"), curW = ddw;
    function at(w) {
      w = Math.max(0, Math.min(21, w)); curW = w;
      var pl = planned[Math.min(w, 20)], ac = w <= ddw ? actual[w] : null, fcv = w >= ddw ? fc[w - ddw] : null;
      var line = ac !== null ? ac : fcv;
      cross.setAttribute("x1", px(w)); cross.setAttribute("x2", px(w)); cross.setAttribute("opacity", 1);
      dotP.setAttribute("cx", px(w)); dotP.setAttribute("cy", py(pl)); dotP.setAttribute("opacity", 1);
      if (line !== null && line !== undefined) { dotA.setAttribute("cx", px(w)); dotA.setAttribute("cy", py(line)); dotA.setAttribute("opacity", 1); } else dotA.setAttribute("opacity", 0);
      var txt = "Week " + w + ": planned " + pl + "%";
      if (ac !== null) txt += ", actual " + ac + "%, gap " + (ac - pl) + " pts";
      else if (fcv !== null && fcv !== undefined) txt += ", forecast " + fcv + "%, gap " + (fcv - pl) + " pts";
      var short = txt + ". Sample data.";
      if (readEl) readEl.textContent = short;
      tip.hidden = false; tip.textContent = txt;
      tip.style.left = (px(w) / WW * 100) + "%";
    }
    function fromEvent(e) {
      var r = s.getBoundingClientRect();
      var vx = (e.clientX - r.left) / r.width * WW;
      at(Math.round((vx - L) / (WW - L - R) * 22));
    }
    hitr.addEventListener("pointermove", fromEvent);
    hitr.addEventListener("pointerdown", fromEvent);
    s.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { at(curW + 1); e.preventDefault(); }
      else if (e.key === "ArrowLeft") { at(curW - 1); e.preventDefault(); }
      else if (e.key === "Home") { at(0); e.preventDefault(); }
      else if (e.key === "End") { at(21); e.preventDefault(); }
    });
    s.addEventListener("focus", function () { at(curW); });
    sc.appendChild(s);
  }

  /* ---------- Project gallery, filter and popup ---------- */
  var dataEl = document.getElementById("project-data");
  var dlg = document.getElementById("pdlg");
  if (dataEl && dlg) {
    var projects = JSON.parse(dataEl.textContent), byId = {};
    projects.forEach(function (p) { byId[p.id] = p; });
    var $ = function (id) { return document.getElementById(id); };
    var img = $("pd-img"), thumbs = $("pd-thumbs"), count = $("pd-count");
    var cur = null, idx = 0, opener = null;

    // Method text is built from the project's stated scope plus my CV competencies. No project facts are added.
    var PLAN = {
      "civil": "civil works ahead of MEP and finishes",
      "mep": "MEP first fix to testing and commissioning",
      "fit-out": "the fit-out sequence, mock-ups and approvals",
      "design development": "design and shop-drawing approvals before site work",
      "data center": "rack, power, cooling and ELV installation",
      "bms (partial)": "BMS installation and testing",
      "electrical": "electrical installation and testing",
      "finishing": "finishing works",
      "finishing (partial)": "finishing works"
    };
    function steps(p) {
      var bits = p.scope.map(function (t) { return PLAN[t.toLowerCase()]; }).filter(Boolean);
      var list = bits.length > 1 ? bits.slice(0, -1).join(", ") + " and " + bits[bits.length - 1] : (bits[0] || "the contract scope");
      return [
        ["Plan", "A Primavera P6 baseline for the scope: " + list + ". Linked to the contract milestones."],
        ["Monitor", "Progress checked against the baseline every update. Critical path, procurement and submittals reviewed."],
        ["Report", "A weekly report and look-ahead, with KPIs, for the client, the consultant and Motive management."],
        ["Recover", "If a date is at risk: an early warning, a recovery plan and notices that protect the contract position."]
      ];
    }

    function show(i) {
      var n = cur.photos.length;
      idx = (i + n) % n;
      img.src = "assets/projects/" + cur.photos[idx];
      img.alt = cur.name + ", photo " + (idx + 1) + " of " + n;
      count.textContent = (idx + 1) + " / " + n;
      Array.prototype.forEach.call(thumbs.children, function (b, k) {
        b.setAttribute("aria-selected", k === idx ? "true" : "false");
        b.classList.toggle("on", k === idx);
      });
      var nxt = new Image(); nxt.src = "assets/projects/" + cur.photos[(idx + 1) % n];
      dlg.classList.toggle("single", n < 2);
    }
    function open(id, from) {
      var p = byId[id]; if (!p) return;
      cur = p; opener = from || null;
      $("pd-sector").textContent = p.sector;
      $("pd-title").textContent = p.name;
      $("pd-loc").textContent = p.location + ", Saudi Arabia";
      $("pd-scope").innerHTML = "";
      p.scope.forEach(function (t) { var s = document.createElement("span"); s.textContent = t; $("pd-scope").appendChild(s); });
      $("pd-me").hidden = !p.role;
      var ol = $("pd-steps"); ol.innerHTML = "";
      steps(p).forEach(function (st) {
        var li = document.createElement("li");
        var b = document.createElement("b"); b.textContent = st[0];
        li.appendChild(b); li.appendChild(document.createTextNode(" " + st[1])); ol.appendChild(li);
      });
      thumbs.innerHTML = "";
      p.photos.forEach(function (f, k) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-label", "Photo " + (k + 1));
        var t = new Image(); t.src = "assets/projects/" + f; t.alt = ""; t.loading = "lazy"; t.width = 96; t.height = 64;
        b.appendChild(t); b.addEventListener("click", function () { show(k); });
        thumbs.appendChild(b);
      });
      show(0);
      if (!dlg.open) dlg.showModal();
      document.body.classList.add("lock");
      try { history.replaceState(null, "", "#project-" + id); } catch (e) {}
    }
    function close() { if (dlg.open) dlg.close(); }
    dlg.addEventListener("close", function () {
      document.body.classList.remove("lock");
      try { history.replaceState(null, "", "#projects"); } catch (e) {}
      if (opener && document.contains(opener)) opener.focus();
    });
    dlg.querySelector(".pd-close").addEventListener("click", close);
    dlg.addEventListener("click", function (e) { if (e.target === dlg) close(); });
    dlg.querySelector(".prev").addEventListener("click", function () { show(idx - 1); });
    dlg.querySelector(".next").addEventListener("click", function () { show(idx + 1); });
    $("pd-cta").addEventListener("click", close);
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { show(idx - 1); e.preventDefault(); }
      else if (e.key === "ArrowRight") { show(idx + 1); e.preventDefault(); }
    });
    var tx = null, stage = dlg.querySelector(".pd-stage");
    stage.addEventListener("touchstart", function (e) { tx = e.touches[0].clientX; }, { passive: true });
    stage.addEventListener("touchend", function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 40) show(idx + (dx < 0 ? 1 : -1));
    });

    var gal = $("gallery");
    gal.addEventListener("click", function (e) {
      var c = e.target.closest(".proj"); if (c) open(c.getAttribute("data-id"), c);
    });
    var strip = $("strip-track");
    if (strip) strip.addEventListener("click", function (e) {
      var t = e.target.closest(".tile"); if (t) open(t.getAttribute("data-id"), t);
    });

    // filters: sector chips + city (map pins / city list)
    var chips = document.querySelectorAll(".chip");
    var chipBox = document.querySelector(".chips");
    var state = { sector: "all", city: null };
    var cityCount = {};
    projects.forEach(function (p) { cityCount[p.location] = (cityCount[p.location] || 0) + 1; });
    var cities = Object.keys(cityCount).sort(function (a, b) { return cityCount[b] - cityCount[a]; });
    var locChip = null;
    function apply() {
      Array.prototype.forEach.call(gal.children, function (c) {
        var p = byId[c.getAttribute("data-id")];
        c.hidden = !((state.sector === "all" || c.getAttribute("data-sector") === state.sector) && (!state.city || (p && p.location === state.city)));
      });
      Array.prototype.forEach.call(chips, function (o) {
        if (o.classList.contains("loc")) return;
        var on = o.getAttribute("data-filter") === state.sector;
        o.classList.toggle("is-on", on); o.setAttribute("aria-pressed", on ? "true" : "false");
      });
      Array.prototype.forEach.call(document.querySelectorAll(".pin, .city-btn"), function (n) {
        var on = n.getAttribute("data-city") === state.city;
        n.classList.toggle("is-on", on); n.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (locChip) { locChip.remove(); locChip = null; }
      if (state.city && chipBox) {
        locChip = document.createElement("button");
        locChip.type = "button"; locChip.className = "chip loc is-on";
        locChip.textContent = "Location: " + state.city + " \u00d7";
        locChip.setAttribute("aria-label", "Clear location filter: " + state.city);
        locChip.addEventListener("click", function () { state.city = null; apply(); });
        chipBox.appendChild(locChip);
      }
    }
    Array.prototype.forEach.call(chips, function (ch) {
      ch.addEventListener("click", function () { state.sector = ch.getAttribute("data-filter"); apply(); });
    });
    function pickCity(c) {
      state.city = state.city === c ? null : c; apply();
      if (state.city) {
        var r = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        gal.scrollIntoView({ behavior: r ? "auto" : "smooth", block: "start" });
      }
    }
    var cl = $("city-list");
    cities.forEach(function (c) {
      var b = document.createElement("button");
      b.type = "button"; b.className = "city-btn"; b.setAttribute("data-city", c); b.setAttribute("aria-pressed", "false");
      b.innerHTML = "<span></span><b></b>"; b.firstChild.textContent = c; b.lastChild.textContent = cityCount[c] + (cityCount[c] === 1 ? " project" : " projects");
      b.addEventListener("click", function () { pickCity(c); });
      if (cl) cl.appendChild(b);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".pin"), function (pin) {
      var c = pin.getAttribute("data-city"), n = cityCount[c] || 0;
      var cc = pin.querySelector("[data-count-for]"); if (cc) cc.textContent = n;
      pin.setAttribute("aria-label", "Show projects in " + c + ": " + n);
      pin.addEventListener("click", function () { pickCity(c); });
      pin.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pickCity(c); } });
    });
    var tt = document.querySelector("[data-count-total]"), tc = document.querySelector("[data-count-cities]");
    if (tt) tt.setAttribute("data-count", projects.length);
    if (tc) tc.setAttribute("data-count", cities.length);
    var m = /^#project-(\w+)$/.exec(location.hash);
    if (m) { var card = gal.querySelector('[data-id="' + m[1] + '"]'); open(m[1], card); }
  }

  /* ---------- Mobile menu ---------- */
  var navBtn = document.getElementById("nav-toggle"), navBox = document.getElementById("site-nav");
  if (navBtn && navBox) {
    var setNav = function (open) {
      navBox.classList.toggle("open", open);
      navBtn.setAttribute("aria-expanded", open ? "true" : "false");
      navBtn.textContent = open ? "Close" : "Menu";
    };
    navBtn.addEventListener("click", function () { setNav(!navBox.classList.contains("open")); });
    navBox.addEventListener("click", function (e) { if (e.target.closest("a")) setNav(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && navBox.classList.contains("open")) { setNav(false); navBtn.focus(); } });
  }

  /* ---------- Hero slideshow ---------- */
  var reduceM = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var slides = document.querySelectorAll("#slides img");
  if (slides.length > 1) {
    var dotBox = document.getElementById("slide-dots"), dots = dotBox ? dotBox.children : [];
    var sIdx = 0, timer = null, playing = !reduceM;
    var toggle = document.getElementById("slide-toggle");
    function goto(i) {
      var img = slides[i];
      if (img.getAttribute("data-src")) { img.src = img.getAttribute("data-src"); img.removeAttribute("data-src"); }
      Array.prototype.forEach.call(slides, function (n, k) { n.classList.toggle("on", k === i); });
      Array.prototype.forEach.call(dots, function (d, k) { d.classList.toggle("on", k === i); d.setAttribute("aria-current", k === i ? "true" : "false"); });
      sIdx = i;
    }
    function play() { clearInterval(timer); timer = setInterval(function () { goto((sIdx + 1) % slides.length); }, 6000); }
    function setPlaying(on) {
      playing = on; clearInterval(timer);
      if (on) play();
      if (toggle) { toggle.textContent = on ? "Pause" : "Play"; toggle.setAttribute("aria-label", on ? "Pause slideshow" : "Play slideshow"); toggle.setAttribute("aria-pressed", on ? "false" : "true"); }
    }
    Array.prototype.forEach.call(dots, function (d, k) { d.addEventListener("click", function () { goto(k); if (playing) play(); }); });
    if (toggle) toggle.addEventListener("click", function () { setPlaying(!playing); });
    goto(0);
    window.addEventListener("load", function () {
      // load the other photos once the page is ready, so the first paint stays fast
      Array.prototype.forEach.call(slides, function (n) { if (n.getAttribute("data-src")) { var im = new Image(); im.src = n.getAttribute("data-src"); } });
      setPlaying(playing);
    });
    document.addEventListener("visibilitychange", function () { if (document.hidden) clearInterval(timer); else if (playing) play(); });
  }

  /* ---------- Count-up numbers (final values are already in the HTML) ---------- */
  var counters = document.querySelectorAll("[data-count], [data-count-total], [data-count-cities]");
  function runCount(n) {
    var to = parseInt(n.getAttribute("data-count"), 10);
    if (isNaN(to)) return;
    if (reduceM) { n.textContent = to; return; }
    var t0 = null, dur = 1300;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      n.textContent = Math.round(to * e);
      if (k < 1) requestAnimationFrame(step); else n.textContent = to;
    }
    requestAnimationFrame(step);
  }
  var isPdf = /[?&]pdf\b/.test(location.search);
  function finalizeAll() { Array.prototype.forEach.call(counters, function (n) { var to = n.getAttribute("data-count"); if (to !== null) n.textContent = to; }); }
  window.addEventListener("beforeprint", finalizeAll);
  if (isPdf) {
    finalizeAll();
  } else if ("IntersectionObserver" in window) {
    var co = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { runCount(en.target); co.unobserve(en.target); } });
    }, { threshold: 0.6 });
    Array.prototype.forEach.call(counters, function (n) { if (n.getAttribute("data-count")) co.observe(n); });
  } else {
    Array.prototype.forEach.call(counters, runCount);
  }

  /* ---------- Reveal on scroll and active nav ---------- */
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reduce && !isPdf) {
    document.documentElement.classList.add("rv");
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".card, .proj, .fact, .dash, .gantt-box").forEach(function (n) { n.classList.add("rvi"); io.observe(n); });
    var links = document.querySelectorAll(".nav a");
    var so = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) Array.prototype.forEach.call(links, function (a) { a.classList.toggle("cur", a.getAttribute("href") === "#" + en.target.id); });
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (sec) { so.observe(sec); });
  }
})();

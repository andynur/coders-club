/* ==========================================================
   HSI-BS React Journey — App (docs layout, hash router)
   Data: data.js (HANDBOOK) · Demo: demos.js (createDemos)
   ========================================================== */
(() => {
  "use strict";
  const D = HANDBOOK;
  const CH = D.chapters;

  /* ---------- helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (s) => esc(s)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, "$1<em>$2</em>");
  const plain = (s) => String(s).replace(/[`*]/g, "");
  const slug = (s) => plain(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const pad = (n) => String(n).padStart(2, "0");
  const icons = () => { if (window.lucide) window.lucide.createIcons(); };
  const store = {
    get(k, d) { try { const v = localStorage.getItem("hsi-" + k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem("hsi-" + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };
  const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  const checkItem = (label, checked, attrs = "") =>
    `<li><label class="check"><input type="checkbox" ${attrs} ${checked ? "checked" : ""}><span class="box">${CHECK}</span><span>${label}</span></label></li>`;
  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2400);
  }
  const done = () => store.get("done", []);
  const isDone = (n) => done().includes(n);

  /* ---------- progress (%) ----------
     Tiap bab bernilai sama (1/12). Bab yang ditandai selesai = penuh.
     Bab yang belum selesai dihitung dari self-check yang tercentang,
     dengan satu "slot" tersisa untuk tombol Tandai selesai. */
  function progress() {
    const d = done();
    const sum = CH.reduce((acc, c) => {
      if (d.includes(c.num)) return acc + 1;
      const n = store.get("assess-" + c.num, []).filter(Boolean).length;
      return acc + Math.min(n, c.assess.length) / (c.assess.length + 1);
    }, 0);
    return Math.round((sum / CH.length) * 100);
  }
  const todayKey = () => { const t = new Date(); return `${t.getFullYear()}-${pad(t.getMonth() + 1)}-${pad(t.getDate())}`; };
  // Progres Awal = progres saat handbook pertama kali dibuka hari ini.
  function dayStart() {
    const day = store.get("day", null), key = todayKey();
    if (day && day.date === key) return day.start;
    const start = progress();
    store.set("day", { date: key, start });
    return start;
  }
  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      let ok = false;
      try { ok = document.execCommand("copy"); } catch { /* ignore */ }
      ta.remove();
      return ok;
    }
  }

  /* ---------- illustration ---------- */
  function avatar(i = 0) {
    const bg = ["#e3ecfd", "#fcefcf", "#dff1e5", "#fbe3df"][i % 4];
    const sk = ["#f1c19c", "#dca47e", "#f5cfae", "#c98f66"][i % 4];
    const hair = ["#2d2b33", "#4a3328", "#1f2430", "#5b3a29"][i % 4];
    return `<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" fill="${bg}"/>
      <path d="M13 64 Q15 46 32 45 Q49 46 51 64Z" fill="#fff"/><path d="M26 45.5 L32 52 L38 45.5" fill="none" stroke="#e3e0d8" stroke-width="1.6"/>
      <rect x="28" y="36" width="8" height="10" rx="3.5" fill="${sk}"/><circle cx="32" cy="28" r="12" fill="${sk}"/>
      <path d="M20 27 C18.5 16 25 13 32.5 13.3 C40 13.6 45 18 44 26 C41 22.5 37 21 32 21.4 C27 21.8 22.5 23.5 20 27Z" fill="${hair}"/></svg>`;
  }

  const SHAPES = {
    circle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="currentColor"/></svg>',
    ring: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="3"/></svg>',
    square: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="3.5" fill="currentColor"/></svg>',
    triangle: '<svg viewBox="0 0 24 24"><path d="M12 3.5 21.5 20h-19Z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/></svg>',
    plus: '<svg viewBox="0 0 24 24"><path d="M12 3.5v17M3.5 12h17" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>',
    dots: '<svg viewBox="0 0 40 12"><circle cx="6" cy="6" r="3.3" fill="currentColor"/><circle cx="20" cy="6" r="3.3" fill="currentColor"/><circle cx="34" cy="6" r="3.3" fill="currentColor"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 1.5Q12 12 22.5 12Q12 12 12 22.5Q12 12 1.5 12Q12 12 12 1.5Z" fill="currentColor"/></svg>',
  };
  function floaters(list) {
    return `<div class="floaters" aria-hidden="true">${list.map((f) => {
      const st = Object.entries(f.v).map(([k, v]) => `--${k}:${v}`).join(";");
      return f.chip
        ? `<span class="fl chip" style="${st}"><i data-lucide="${f.icon}"></i>${esc(f.chip)}</span>`
        : `<span class="fl" style="${st}">${SHAPES[f.shape]}</span>`;
    }).join("")}</div>`;
  }
  const PLANE = `<svg class="trail" viewBox="0 0 460 420" preserveAspectRatio="none" aria-hidden="true"><path d="M-10 330 C 110 310, 150 190, 230 160 S 400 60, 470 -10"/></svg>
    <span class="plane" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M22 2 15 22l-4-9-9-4Z" fill="var(--bg)"/><path d="M22 2 11 13"/></svg></span>`;

  const HEAD = `
    <g class="head-bob">
      <circle class="skin-2" cx="158" cy="156" r="8"/><circle class="skin-2" cx="242" cy="156" r="8"/>
      <circle class="skin" cx="200" cy="150" r="42"/>
      <path class="hair" d="M157 149 C151 111 177 97 204 99 C232 100 250 120 244 147 C236 134 222 125 204 127 C186 128 168 135 157 149Z"/>
    </g>`;

  function heroStage() {
    const scene = `<svg viewBox="0 0 400 360" role="img" aria-label="Ilustrasi siswa SMA sedang ngoding dengan laptop">
      <circle class="blob" cx="200" cy="190" r="150"/>
      <circle class="blob-2" cx="322" cy="86" r="30"/>
      <rect class="desk" x="40" y="302" width="320" height="10" rx="5"/>
      <path class="shirt" d="M118 304 C118 240 152 212 200 212 C248 212 282 240 282 304 Z"/>
      <path d="M182 214 L200 236 L218 214" fill="none" stroke="var(--shirt-line)" stroke-width="2" stroke-linejoin="round"/>
      <rect class="skin-2" x="188" y="184" width="24" height="32" rx="10"/>
      ${HEAD}
      <rect class="laptop-back" x="138" y="220" width="124" height="80" rx="9"/>
      <g class="logo-spin" fill="none" stroke="#fff" stroke-width="2.2" opacity=".95">
        <ellipse cx="200" cy="260" rx="16" ry="6.2"/>
        <ellipse cx="200" cy="260" rx="16" ry="6.2" transform="rotate(60 200 260)"/>
        <ellipse cx="200" cy="260" rx="16" ry="6.2" transform="rotate(120 200 260)"/>
        <circle cx="200" cy="260" r="2.8" fill="#fff" stroke="none"/>
      </g>
      <rect class="laptop-base" x="120" y="296" width="160" height="9" rx="4.5"/>
      <circle class="skin hand-l" cx="152" cy="297" r="10"/>
      <circle class="skin hand-r" cx="248" cy="297" r="10"/>
    </svg>`;
    return `<div class="stage">${PLANE}<div class="scene">${scene}</div>${floaters([
      { shape: "circle", v: { x: "6%", y: "20%", s: "14px", c: "var(--gold-strong)", d: "5s", tx: "6px", ty: "-16px" } },
      { shape: "ring", v: { x: "86%", y: "16%", s: "26px", c: "var(--blue)", d: "7s", rot: "60deg" } },
      { shape: "square", v: { x: "90%", y: "62%", s: "16px", c: "var(--gold-strong)", d: "6s", rot: "90deg", ty: "-18px" } },
      { shape: "triangle", v: { x: "3%", y: "66%", s: "22px", c: "var(--blue)", d: "8s", rot: "-50deg", tx: "8px" } },
      { shape: "plus", v: { x: "72%", y: "88%", s: "18px", c: "var(--green)", d: "5.5s", rot: "90deg" } },
      { shape: "dots", v: { x: "18%", y: "92%", s: "30px", c: "var(--border-2)", d: "9s", ty: "-8px", rot: "0deg" } },
      { shape: "spark", v: { x: "50%", y: "0%", s: "16px", c: "var(--gold-strong)", d: "4s", rot: "45deg", ty: "-10px" } },
      { chip: "JSX", icon: "code", v: { x: "0%", y: "38%", d: "6s", ty: "-12px" } },
      { chip: "useState()", icon: "zap", v: { x: "63%", y: "4%", d: "7s", ty: "12px", c: "var(--gold)" } },
      { chip: "props", icon: "arrow-right", v: { x: "75%", y: "42%", d: "6.5s", ty: "-12px" } },
      { chip: "<Route />", icon: "route", v: { x: "10%", y: "6%", d: "8s", ty: "10px", c: "var(--green)" } },
    ])}</div>`;
  }

  function cheerStage() {
    const scene = `<svg viewBox="0 0 400 360" role="img" aria-label="Ilustrasi siswa merayakan selesainya proyek">
      <circle class="blob-2" cx="200" cy="190" r="150"/>
      <circle class="blob" cx="84" cy="96" r="26"/>
      <g class="cheer-arms">
        <path d="M156 252 L122 176" stroke="var(--skin)" stroke-width="18" stroke-linecap="round"/>
        <path d="M244 252 L278 176" stroke="var(--skin)" stroke-width="18" stroke-linecap="round"/>
        <circle class="skin" cx="119" cy="167" r="12"/><circle class="skin" cx="281" cy="167" r="12"/>
      </g>
      <path class="shirt" d="M118 330 C118 258 152 230 200 230 C248 230 282 258 282 330 Z"/>
      <path d="M182 232 L200 254 L218 232" fill="none" stroke="var(--shirt-line)" stroke-width="2" stroke-linejoin="round"/>
      <rect x="236" y="262" width="22" height="7" rx="2" fill="var(--blue)"/>
      <g transform="translate(0 18)"><rect class="skin-2" x="188" y="184" width="24" height="32" rx="10"/>${HEAD}</g>
    </svg>`;
    return `<div class="stage">${`<div class="scene">${scene}</div>`}${floaters([
      { shape: "spark", v: { x: "14%", y: "10%", s: "20px", c: "var(--gold-strong)", d: "3.5s", rot: "45deg" } },
      { shape: "spark", v: { x: "82%", y: "20%", s: "16px", c: "var(--blue)", d: "4.5s", rot: "-45deg" } },
      { shape: "square", v: { x: "6%", y: "52%", s: "12px", c: "var(--blue)", d: "5s", rot: "120deg", ty: "-20px" } },
      { shape: "circle", v: { x: "90%", y: "58%", s: "12px", c: "var(--gold-strong)", d: "4s", ty: "-22px" } },
      { shape: "triangle", v: { x: "70%", y: "4%", s: "18px", c: "var(--green)", d: "6s", rot: "80deg" } },
      { shape: "plus", v: { x: "30%", y: "2%", s: "14px", c: "var(--red)", d: "5s", rot: "90deg" } },
      { shape: "ring", v: { x: "84%", y: "86%", s: "20px", c: "var(--blue)", d: "7s" } },
      { chip: "npm run build ✓", icon: "rocket", v: { x: "0%", y: "80%", d: "6s", ty: "-10px", c: "var(--green)" } },
    ])}</div>`;
  }

  /* ---------- block renderers ---------- */
  function codeBlock(code, lang = "javascript", title, bad, run) {
    const tree = lang === "plaintext" && /[├└│]/.test(code);
    const jsx = lang === "javascript" && /<\/?[A-Za-z>]/.test(code);
    const label = title || (jsx ? "JSX" : { javascript: "JavaScript", bash: "Terminal", css: "CSS", markdown: "Markdown", plaintext: "Text" }[lang] || lang);
    const icon = lang === "bash" ? "terminal" : tree ? "folder-tree" : lang === "markdown" ? "file-text" : "file-code";
    const hasRun = run && PREVIEWS[run];
    return `<div class="code${tree ? " tree" : ""}${bad ? " bad-code" : ""}${hasRun ? " has-out" : ""}">
      <div class="code-head"><span class="code-lang"><i data-lucide="${icon}"></i>${esc(label)}${bad ? ' <span class="bad-tag">Kurang tepat</span>' : ""}</span>
      <button class="copy-btn" data-copy><i data-lucide="copy"></i> Copy</button></div>
      <pre><code class="language-${lang}">${esc(code)}</code></pre>
      ${hasRun ? `<div class="code-out"><div class="out-head"><span><i data-lucide="monitor-play"></i> Hasil di browser</span><span class="out-live">Live</span></div><div class="out-body" data-preview="${run}"></div></div>` : ""}</div>`;
  }
  function mountRuns(root) {
    const fns = $$("[data-preview]", root).map((el) => { try { return PREVIEWS[el.dataset.preview](el); } catch (err) { console.error(err); return null; } });
    return () => fns.forEach((f) => typeof f === "function" && f());
  }

  /* ---------- motion helpers ---------- */
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  function confetti(from) {
    if (calm()) return;
    const r = from && from.getBoundingClientRect ? from.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0 };
    const box = document.createElement("div");
    box.className = "confetti";
    box.style.left = r.left + r.width / 2 + "px";
    box.style.top = r.top + r.height / 2 + "px";
    const colors = ["var(--blue)", "var(--gold-strong)", "var(--green)", "var(--red)"];
    for (let i = 0; i < 22; i++) {
      const s = document.createElement("i");
      const a = (Math.PI * 2 * i) / 22 + Math.random() * 0.4, d = 60 + Math.random() * 70;
      s.style.cssText = `--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 40}px;--r:${Math.random() * 540 - 270}deg;background:${colors[i % 4]};animation-delay:${Math.random() * 60}ms;${i % 3 ? "" : "border-radius:50%"}`;
      box.appendChild(s);
    }
    document.body.appendChild(box);
    setTimeout(() => box.remove(), 1100);
  }
  function tween(el, to, ms = 700, dec = 0) {
    const from = parseFloat(el.textContent) || 0, t0 = performance.now();
    if (calm()) { el.textContent = to.toFixed(dec); return; }
    const step = (t) => {
      const k = Math.min(1, (t - t0) / ms), v = from + (to - from) * (1 - Math.pow(1 - k, 3));
      el.textContent = v.toFixed(dec);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const h2 = (text, id) => `<h2 id="${id}">${fmt(text)}<a class="anchor" href="#" data-target="${id}" aria-label="Link ke bagian ini">#</a></h2>`;
  const callout = (emoji, color, body, title) =>
    `<div class="callout ${color}"><span class="c-ico">${emoji}</span><div class="c-body">${title ? `<span class="c-title">${title}</span>` : ""}${body}</div></div>`;

  function renderBlocks(blocks) {
    return blocks.map((b) => {
      if (b.h) return h2(b.h, slug(b.h));
      if (b.p) return `<p>${fmt(b.p)}</p>`;
      if (b.rule) return `<div class="rule">${fmt(b.rule)}</div>`;
      if (b.list) return `<ul class="${b.cols ? "cols" : ""}">${b.list.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul>`;
      if (b.olist) return `<ol>${b.olist.map((x) => `<li>${fmt(x)}</li>`).join("")}</ol>`;
      if (b.code !== undefined) return codeBlock(b.code, b.lang, b.title, b.bad, b.run);
      if (b.compare) return `<div class="compare">${b.compare.map((c) => `<div><span class="compare-label">${esc(c.label)}</span>${codeBlock(c.code, c.lang, c.label, false, c.run)}</div>`).join("")}</div>`;
      if (b.tip) {
        const [e, c] = { key: ["💡", "gold"], tip: ["📌", "blue"], warn: ["⚠️", "red"] }[b.kind || "tip"];
        return callout(e, c, `<p>${fmt(b.tip)}</p>`);
      }
      if (b.table) return `<div class="tbl"><table><thead><tr>${b.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${b.table.rows.map((r) => `<tr>${r.map((c) => `<td>${fmt(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
      if (b.tools) return `<div class="grid">${b.tools.map(([ic, n, d], i) => `<div class="tile"><span class="t-ico${i % 2 ? " gold" : ""}"><i data-lucide="${ic}"></i></span><div><b>${esc(n)}</b><span>${esc(d)}</span></div></div>`).join("")}</div>`;
      if (b.dos) return b.dos.map(([k, t]) => callout(k === "good" ? "✅" : "❌", k === "good" ? "green" : "red", `<p>${fmt(t)}</p>`)).join("");
      if (b.flow) return `<div class="flow">${b.flow.map((n, i) => `${i ? '<i data-lucide="arrow-right" class="flow-arrow"></i>' : ""}<span class="flow-node${i % 2 ? " edge" : ""}">${esc(n)}</span>`).join("")}</div>`;
      if (b.steps) return `<ol class="steps">${b.steps.map(([t, d], i) => `<li><b>Step ${i + 1} — ${esc(t)}</b><span>${esc(d)}</span></li>`).join("")}</ol>`;
      if (b.features) return `<div class="grid">${b.features.map(([ic, t, items], i) => `<div class="tile"><span class="t-ico${i % 2 ? " gold" : ""}"><i data-lucide="${ic}"></i></span><div><b>${esc(t)}</b><ul>${items.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul></div></div>`).join("")}</div>`;
      if (b.banner) return callout("🏆", "gold", `<p>${esc(b.text)}</p>`, esc(b.banner.replace(/^🏆\s*/, "")));
      if (b.checklist) {
        const saved = store.get("check-" + b.key, []);
        return `<ul class="checklist" data-checklist="${b.key}">${b.checklist.map((x, i) => checkItem(fmt(x), saved[i])).join("")}</ul>`;
      }
      return "";
    }).join("");
  }

  /* cover bergaya Notion, dengan shape & chip kode yang melayang pelan */
  const COVER_CHIPS = {
    1: [["npm create vite", "terminal"], ["<App />", "code"], ["UI = f(state)", "sparkles"]],
    2: [["<>…</>", "brackets"], ["className", "type"], ["{name}", "braces"]],
    3: [["props", "arrow-right"], ["map()", "repeat"], ["key={id}", "key"]],
    4: [["onClick", "mouse-pointer-click"], ["useState(0)", "zap"], ["setCount", "refresh-cw"]],
    5: [["onChange", "pencil"], ["onSubmit", "send"], ["value={name}", "text-cursor-input"]],
    6: [["filter()", "filter"], ["...spread", "copy-plus"], ["CRUD", "list-checks"]],
    7: [["fetch()", "cloud-download"], ["useEffect", "rotate-cw"], ["loading…", "loader"]],
    8: [["<Route />", "route"], ["<Link />", "link"], ["/students", "navigation"]],
    9: [["localStorage", "database"], ["JSON.stringify", "file-json"], ["useLocalStorage", "anchor"]],
    10: [["md:grid-cols-3", "layout-grid"], ["rounded-2xl", "square"], ["p-6", "move"]],
    11: [["Dashboard", "layout-dashboard"], ["README.md", "file-text"], ["Demo Day", "presentation"]],
    12: [["npm run build", "package"], ["dist/", "folder"], ["Live ✓", "globe"]],
  };
  function chapterCover(c) {
    const chips = COVER_CHIPS[c.num] || [];
    const pos = [{ x: "6%", y: "26%", d: "6s", ty: "-10px" }, { x: "40%", y: "52%", d: "7.5s", ty: "8px" }, { x: "70%", y: "18%", d: "6.8s", ty: "-12px" }];
    const shapes = [
      { shape: "circle", v: { x: "28%", y: "16%", s: "12px", c: "var(--gold-strong)", d: "5s", ty: "-12px" } },
      { shape: "ring", v: { x: "88%", y: "56%", s: "22px", c: "var(--blue)", d: "7s", rot: "60deg" } },
      { shape: "plus", v: { x: "62%", y: "66%", s: "14px", c: "var(--green)", d: "5.5s", rot: "90deg" } },
      { shape: "triangle", v: { x: "18%", y: "64%", s: "16px", c: "var(--blue)", d: "8s", rot: "-50deg" } },
      { shape: "spark", v: { x: "94%", y: "14%", s: "14px", c: "var(--gold-strong)", d: "4s", rot: "45deg" } },
      { shape: "square", v: { x: "52%", y: "12%", s: "11px", c: "var(--red)", d: "6s", rot: "90deg", ty: "10px" } },
    ];
    return `<div class="cover p${c.phase}">${floaters([
      ...shapes,
      ...chips.map(([t, ic], i) => ({ chip: t, icon: ic, v: { ...pos[i], c: ["var(--blue)", "var(--gold)", "var(--green)"][i] } })),
    ])}<span class="cover-num" aria-hidden="true">${pad(c.num)}</span></div>`;
  }

  const crumbs = (...parts) => `<nav class="crumbs">${parts.map((p, i) => (p[1] !== undefined ? `<a href="#/${p[1]}">${esc(p[0])}</a>` : `<span>${esc(p[0])}</span>`) + (i < parts.length - 1 ? '<i data-lucide="chevron-right"></i>' : "")).join("")}</nav>`;
  const pageHead = ({ crumb, icon, gold, title, lead, cover }) =>
    `${crumb || ""}${cover || ""}<div class="page-icon${gold ? " gold" : ""}${cover ? " on-cover" : ""}"><i data-lucide="${icon}"></i></div><h1>${esc(title)}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}`;
  const statusLabel = (d) => (d ? '<i data-lucide="circle-check"></i> Selesai' : '<i data-lucide="circle"></i> Tandai selesai');

  /* ---------- pages ---------- */
  function nextChapter() {
    const d = done();
    return CH.find((c) => !d.includes(c.num)) || CH[CH.length - 1];
  }
  const phaseOf = (c) => D.phases.find((p) => p.id === c.phase);
  const chRoute = (c) => "bab-" + pad(c.num);

  function pageHome() {
    const nx = nextChapter();
    const d = done();
    const html = `
      <section class="hero">
        <div>
          <span class="eyebrow"><span class="dot"><i data-lucide="graduation-cap"></i></span>HSI Boarding School Purworejo · Kelas IT</span>
          <h1>Belajar <span class="hl">React.js</span> dari nol sampai deploy.</h1>
          <p class="lead">Handbook kelas IT untuk semua siswa. Dalam 12 pertemuan kamu bikin aplikasi web beneran pakai React: dari komponen pertama, data dari API, sampai online di internet.</p>
          <div class="hero-cta">
            <a class="btn btn-primary btn-lg" href="#/mulai"><i data-lucide="play"></i> Mulai Belajar</a>
            <a class="btn btn-lg" href="#/${chRoute(nx)}"><i data-lucide="book-open"></i> ${d.length ? "Lanjut" : "Buka"} Bab ${pad(nx.num)}</a>
          </div>
          <div class="hero-meta">
            <span class="tag blue"><i data-lucide="users"></i> Untuk semua siswa</span>
            <span class="tag"><i data-lucide="timer"></i> 12 × 120 menit</span>
            <span class="tag"><i data-lucide="code"></i> Prerequisite: JS Fundamentals</span>
            <span class="tag gold"><i data-lucide="user"></i> Mentor: Kak Andy</span>
          </div>
        </div>
        ${heroStage()}
      </section>
      <div class="stats">
        <div class="stat"><b data-count="12">0</b><span>Chapters</span></div>
        <div class="stat"><b data-count="24">0</b><span>Class Hours</span></div>
        <div class="stat"><b data-count="4">0</b><span>Projects</span></div>
      </div>

      ${h2("Learning Journey", "learning-journey")}
      <p>Empat fase, dua belas pertemuan. Setiap fase ditutup dengan satu milestone project.</p>
      <div class="phase-row">${D.phases.map((p) => {
        const chs = CH.filter((c) => c.phase === p.id);
        const pct = (chs.filter((c) => d.includes(c.num)).length / chs.length) * 100;
        return `<a class="phase reveal" href="#/${chRoute(chs[0])}"><div class="ph-top"><span class="ph-ico"><i data-lucide="${p.icon}"></i></span><small>Meet ${p.meetings}</small></div>
          <b>${esc(p.name)}</b><p>${esc(p.topics)}</p><span class="ms"><i data-lucide="award"></i> ${esc(p.milestone)}</span>
          <div class="meter"><div class="meter-bar" style="width:${pct}%"></div></div></a>`;
      }).join("")}</div>

      ${h2("Semua Bab", "semua-bab")}
      <div class="gallery">${CH.map((c) => `
        <a class="g-card reveal" href="#/${chRoute(c)}">
          <div class="g-cover p${c.phase}"><span class="g-ico"><i data-lucide="${c.icon}"></i></span><span class="g-num">${pad(c.num)}</span></div>
          <div class="g-body"><span>Bab ${pad(c.num)} · ${esc(phaseOf(c).name)}</span><b>${esc(c.title)}</b>
          ${d.includes(c.num) ? '<span class="tag green"><i data-lucide="circle-check"></i> Selesai</span>' : `<span class="tag">${c.milestone ? "🏅 Milestone" : "Belum mulai"}</span>`}</div>
        </a>`).join("")}</div>

      ${h2("Cara Pakai Handbook Ini", "cara-pakai")}
      <div class="grid">
        <div class="tile reveal"><span class="t-ico"><i data-lucide="book-open"></i></span><div><b>Sebelum kelas</b><span>Baca materi bab berikutnya supaya live coding terasa lebih mudah.</span></div></div>
        <div class="tile reveal"><span class="t-ico gold"><i data-lucide="laptop"></i></span><div><b>Saat live coding</b><span>Ikuti contoh kode bersama mentor, lalu coba demo interaktifnya.</span></div></div>
        <div class="tile reveal"><span class="t-ico"><i data-lucide="rotate-ccw"></i></span><div><b>Belajar mandiri</b><span>Ulangi materi, kerjakan challenge, dan isi self-check di rumah.</span></div></div>
      </div>
      ${callout("💡", "gold", `<p>Don't just copy the code. Understand how it works, experiment with it, and build something of your own.</p>`, "Our Learning Philosophy")}`;
    return {
      html, wide: true,
      mount(root) {
        $$("[data-count]", root).forEach((el) => {
          const target = +el.dataset.count, t0 = performance.now();
          const step = (t) => {
            const k = Math.min(1, (t - t0) / 900);
            el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3)));
            if (k < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
    };
  }

  function roadmap() {
    const d = done(), cur = nextChapter().phase, allDone = d.length === CH.length;
    return `<div class="roadmap">
      <div class="rm-line" aria-hidden="true"><i></i><span class="rm-plane"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M22 2 15 22l-4-9-9-4Z" fill="var(--bg)"/><path d="M22 2 11 13"/></svg></span></div>
      ${D.phases.map((p) => {
        const chs = CH.filter((c) => c.phase === p.id), n = chs.filter((c) => d.includes(c.num)).length;
        const state = n === chs.length ? "done" : p.id === cur && !allDone ? "now" : "";
        return `<a class="rm-node reveal ${state}" href="#/${chRoute(chs[0])}">
          <span class="rm-dot"><i data-lucide="${state === "done" ? "check" : p.icon}"></i></span>
          <small>Meet ${p.meetings} · ${n}/${chs.length}</small><b>${esc(p.name)}</b><p>${esc(p.topics)}</p>
          <span class="tag gold"><i data-lucide="award"></i> ${esc(p.milestone)}</span></a>`;
      }).join("")}</div>`;
  }

  function pageStart() {
    const saved = store.get("prereq", []);
    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], ["Getting Started"]), icon: "flag", title: "Getting Started", lead: "Selamat datang di tahap berikutnya dalam perjalanan belajar coding!" }) }
      <div class="props">
        <div class="prop"><span class="prop-k"><i data-lucide="school"></i> Sekolah</span><span class="prop-v">HSI Boarding School Purworejo</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="users"></i> Program</span><span class="prop-v">Kelas IT — Web Development</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="calendar-check"></i> Academic Year</span><span class="prop-v">2026/2027</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="user"></i> Mentor</span><span class="prop-v">Kak Andy</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="timer"></i> Duration</span><span class="prop-v">12 Meetings × 120 Minutes</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="code"></i> Prerequisite</span><span class="prop-v">JavaScript Fundamentals</span></div>
      </div>

      ${h2("Welcome, Future React Developer!", "welcome")}
      <p>Sebelumnya, kalian telah mempelajari JavaScript Fundamental, mulai dari variables, functions, arrays, objects, DOM manipulation, hingga asynchronous JavaScript. Sekarang kita akan <strong>naik level!</strong> 🚀</p>
      <p>Kita akan menggunakan <strong>React.js</strong>, sebuah JavaScript library untuk membangun antarmuka aplikasi web yang modern dan interaktif. Di tahap ini, kalian tidak hanya belajar menulis kode, tetapi juga mulai belajar <strong>berpikir seperti seorang software developer</strong>.</p>
      <p>Kalian akan membangun aplikasi menggunakan komponen yang bisa digunakan kembali (<em>reusable components</em>), mengelola perubahan data, mengambil data dari API, hingga mempublikasikan aplikasi ke internet.</p>
      <p>Kurikulum ini menggunakan pendekatan React modern dengan functional components, JSX, Hooks dasar, Vite, dan praktik pengembangan aplikasi — diselaraskan dengan dokumentasi resmi React, Vite, React Router, dan Tailwind CSS.</p>
      <blockquote class="quote">Don't just copy the code. Understand how it works, experiment with it, and build something of your own.</blockquote>

      ${h2("Learning Outcomes", "learning-outcomes")}
      <p>Setelah menyelesaikan handbook ini, kalian diharapkan mampu:</p>
      <ul class="checklist plain">${D.outcomes.map((o) => checkItem(fmt(o), true, "disabled")).join("")}</ul>

      ${h2("Learning Journey", "learning-journey")}
      <p>Empat fase, dua belas pertemuan. Titik yang berdenyut adalah fase kamu sekarang.</p>
      ${roadmap()}

      ${h2("Prerequisite Knowledge", "prerequisite")}
      <p>Sebelum memulai React, pastikan kalian memahami materi berikut. Centang yang sudah kalian kuasai.</p>
      <div class="meter"><div class="meter-bar" id="prereqBar"></div></div>
      <p class="meter-label" id="prereqLabel"></p>
      <ul class="checklist" id="prereqList">${D.prerequisites.map((p, i) => checkItem(fmt(p), saved[i])).join("")}</ul>
      ${callout("📌", "blue", "<p>Tidak harus menghafal semua sintaks. Namun, kalian harus mampu membaca kode dan memahami alur logikanya.</p>")}
      ${callout("🧪", "green", "<p>Semua contoh kode di handbook ini sudah diuji di proyek Vite sungguhan: React 19, React Router, dan Tailwind CSS 4. Di bawah contoh kode ada panel <strong>Hasil di browser</strong> yang menampilkan output-nya, dan sebagian besar bisa kamu klik.</p>", "Kode sudah diuji")}`;
    return {
      html,
      mount(root) {
        const list = $("#prereqList", root);
        const update = (e) => {
          const vals = $$("input", list).map((x) => x.checked);
          store.set("prereq", vals);
          const pct = Math.round((vals.filter(Boolean).length / vals.length) * 100);
          if (e && pct === 100 && e.target.checked) confetti(e.target.closest(".check"));
          $("#prereqBar", root).style.width = pct + "%";
          $("#prereqLabel", root).textContent = `Kesiapan: ${pct}%` + (pct === 100 ? " — siap naik level! 🚀" : pct >= 60 ? " — hampir siap, ulangi sisanya." : "");
        };
        list.addEventListener("change", update);
        update(null);
      },
    };
  }

  function pageChapter(c) {
    const p = phaseOf(c);
    const savedA = store.get("assess-" + c.num, []);
    const nA = c.assess.filter((_, i) => savedA[i]).length;
    const pr = c.practice;
    let practice = `<p>${fmt(pr.intro)}</p>`;
    if (pr.items) practice += pr.ordered ? `<ol>${pr.items.map((x) => `<li>${fmt(x)}</li>`).join("")}</ol>` : `<ul>${pr.items.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul>`;
    if (pr.code) practice += codeBlock(pr.code, "javascript", pr.codeTitle, false, pr.run);

    let challenge = c.challengeIntro ? `<p>${fmt(c.challengeIntro)}</p>` : "";
    if (c.flipChallenge) {
      challenge += c.flipChallenge.map(([q, a]) => `<details class="toggle-block"><summary>${fmt(q)}</summary><div class="tg-body">${fmt(a)}</div></details>`).join("");
    } else {
      const tag = c.challengeUnordered ? "ul" : "ol";
      challenge += `<${tag}>${c.challenge.map((x) => `<li>${fmt(x)}</li>`).join("")}</${tag}>`;
    }

    const output = c.deliverable
      ? (/^[a-z-]+$/.test(c.deliverable) ? `<code>${esc(c.deliverable)}</code>` : esc(c.deliverable))
      : `<span class="tag gold">🏅 Milestone</span>`;

    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], [c.part.replace(/^Part \d+ — /, "")], [`Bab ${pad(c.num)}`]), cover: chapterCover(c), icon: c.icon, gold: c.phase % 2 === 0, title: c.title })}
      <div class="props">
        <div class="prop"><span class="prop-k"><i data-lucide="calendar-check"></i> Pertemuan</span><span class="prop-v">${esc(c.meeting)}</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="layers"></i> Fase</span><span class="prop-v"><span class="tag ${["blue", "gold", "green", "red"][c.phase - 1]}">${esc(p.name)}</span><span class="muted small">${esc(c.part)}</span></span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="package"></i> Output</span><span class="prop-v">${output}</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="list-checks"></i> Self-check</span><span class="prop-v" id="assessProp">${nA}/${c.assess.length} tercentang</span></div>
        <div class="prop"><span class="prop-k"><i data-lucide="circle-check"></i> Status</span><span class="prop-v"><button class="tag status-btn ${isDone(c.num) ? "green" : ""}" data-status="${c.num}">${statusLabel(isDone(c.num))}</button></span></div>
      </div>
      ${callout("🎯", "blue", `<p>${fmt(c.objective)}</p>`, "Learning Objectives")}
      ${renderBlocks(c.blocks)}
      ${h2("Coba Langsung", "coba-langsung")}
      <p>Mainkan demo ini untuk melihat konsep bab ini bekerja. Klik, ketik, lalu perhatikan panel <strong>state</strong> ikut berubah.</p>
      <div id="demoHost"></div>
      ${h2("Hands-On Practice", "hands-on-practice")}
      ${practice}
      ${h2(c.flipChallenge ? "Final Challenge" : "Student Challenge", "student-challenge")}
      ${challenge}
      ${h2("Self-Assessment", "self-assessment")}
      <p class="muted small">Jujur sama diri sendiri: centang yang benar-benar sudah kamu pahami, bukan yang sekadar pernah kamu baca.</p>
      <ul class="checklist" data-assess="${c.num}">${c.assess.map((x, i) => checkItem(fmt(x), savedA[i])).join("")}</ul>
      ${c.milestone ? `<div class="deliv milestone">🏅 ${esc(c.milestone)}</div>` : `<div class="deliv">📦 Deliverable: ${output}</div>`}
      ${finishCard(c)}`;
    return {
      html,
      mount(root) {
        const host = $("#demoHost", root);
        const fn = DEMOS[c.demo];
        return fn ? fn(host) || null : null;
      },
    };
  }

  function finishCard(c) {
    const next = CH[c.num];
    const d = isDone(c.num);
    return `<div class="finish${d ? " is-done" : ""}" id="finish">
      <div class="finish-ico" aria-hidden="true"><i data-lucide="${d ? "party-popper" : "flag"}"></i></div>
      <div class="finish-txt"><b>${d ? `Bab ${pad(c.num)} sudah selesai.` : `Sudah paham isi Bab ${pad(c.num)}?`}</b>
        <span>${d ? (next ? `Lanjut ke materi berikutnya: ${esc(next.short)}.` : "Semua bab selesai. Saatnya Demo Day! 🎤") : "Tandai selesai supaya progresmu tercatat di Learning Tracker."}</span></div>
      <div class="finish-act">
        ${d ? "" : `<button class="btn btn-primary" data-finish="${c.num}"><i data-lucide="check"></i> Tandai selesai${next ? " & lanjut" : ""}</button>`}
        ${d && next ? `<a class="btn btn-primary" href="#/${chRoute(next)}">Bab ${pad(next.num)} <i data-lucide="arrow-right"></i></a>` : ""}
        ${d && !next ? `<a class="btn btn-primary" href="#/penutup">Pesan Penutup <i data-lucide="arrow-right"></i></a>` : ""}
      </div></div>`;
  }

  function pageRef() {
    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], ["Referensi"]), icon: "book-marked", title: "Quick Reference", lead: "Ringkasan konsep penting React. Ketik untuk menyaring." })}
      <label class="ref-search"><i data-lucide="search"></i><input type="search" id="refQ" placeholder="Cari konsep… (mis. state)" aria-label="Cari konsep"></label>
      <div class="tbl"><table><thead><tr><th>Concept</th><th>Purpose</th></tr></thead><tbody id="refBody"></tbody></table></div>
      ${callout("🧭", "blue", `<p>Butuh contoh? Buka <a href="#/kesalahan">Common React Mistakes</a> untuk perbandingan kode yang salah dan benar.</p>`)}`;
    return {
      html,
      mount(root) {
        const body = $("#refBody", root);
        const draw = (q = "") => {
          const rows = D.quickRef.filter(([, c, p]) => (c + " " + p).toLowerCase().includes(q.toLowerCase()));
          body.innerHTML = rows.length ? rows.map(([ic, c, p]) => `<tr><td><strong style="display:inline-flex;gap:.45rem;align-items:center"><i data-lucide="${ic}"></i>${esc(c)}</strong></td><td>${esc(p)}</td></tr>`).join("")
            : `<tr><td colspan="2" class="muted">Konsep “${esc(q)}” tidak ditemukan.</td></tr>`;
          icons();
        };
        $("#refQ", root).addEventListener("input", (e) => draw(e.target.value));
        draw();
      },
    };
  }

  function pageMistakes() {
    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], ["Referensi"]), icon: "triangle-alert", gold: true, title: "Common React Mistakes", lead: "Lima kesalahan yang paling sering terjadi. Bandingkan versi salah dan benar." })}
      ${D.mistakes.map((m, i) => `
        <section class="mistake" data-m="${i}">
          <div class="mistake-top"><h2 id="${slug(m.title)}">${i + 1}. ${esc(m.title)}</h2>
            <div class="seg"><button class="bad active" data-side="bad">❌ Incorrect</button><button class="good" data-side="good">✅ Correct</button></div></div>
          <div data-view></div>
        </section>`).join("")}`;
    return {
      html,
      mount(root) {
        const show = (card, side) => {
          const m = D.mistakes[+card.dataset.m];
          $$("[data-side]", card).forEach((b) => b.classList.toggle("active", b.dataset.side === side));
          const v = $("[data-view]", card);
          v.innerHTML = side === "bad"
            ? (m.bad ? codeBlock(m.bad, "javascript", "Incorrect", true) : `<p>${fmt(m.badText)}</p>`)
            : (m.good ? codeBlock(m.good, "javascript", "Correct") : "") + (m.goodText ? `<p>${fmt(m.goodText)}</p>` : "") + (m.goodNote ? `<p>${fmt(m.goodNote)}</p>` : "");
          highlight(v); icons();
        };
        $$(".mistake", root).forEach((card) => {
          show(card, "bad");
          $(".seg", card).addEventListener("click", (e) => { const b = e.target.closest("[data-side]"); if (b) show(card, b.dataset.side); });
        });
      },
    };
  }

  function pageAI() {
    const a = D.ai;
    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], ["Referensi"]), icon: "bot", title: "AI-Assisted Learning Policy", lead: "AI boleh digunakan sebagai asisten belajar, dengan aturan berikut." })}
      ${h2("Aturan Penggunaan", "aturan")}
      <div class="ai-grid">
        ${callout("✅", "green", `<ul>${a.allowed.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul>`, "Allowed")}
        ${callout("⚠️", "gold", `<ul>${a.limited.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul><p class="note">${fmt(a.limitedNote)}</p>`, "Limited Usage")}
        ${callout("❌", "red", `<ul>${a.notAllowed.map((x) => `<li>${fmt(x)}</li>`).join("")}</ul>`, "Not Allowed")}
      </div>
      ${h2("Golden Rule", "golden-rule")}
      <blockquote class="quote">${esc(a.golden)}</blockquote>
      ${h2("Kuis: Boleh atau Tidak?", "kuis")}
      <p>Uji pemahamanmu dengan beberapa situasi nyata.</p>
      <div class="quiz" id="quiz"></div>`;
    return {
      html,
      mount(root) {
        const box = $("#quiz", root);
        const label = { allowed: "✅ Allowed", limited: "⚠️ Limited", no: "❌ Not Allowed" };
        let order, idx, score, answered;
        const start = () => { order = a.scenarios.map((_, i) => i).sort(() => Math.random() - 0.5); idx = 0; score = 0; draw(); };
        const draw = () => {
          answered = false;
          if (idx >= order.length) {
            box.innerHTML = `<div class="quiz-top"><span>Hasil akhir</span><span class="tag blue">Skor ${score}/${order.length}</span></div>
              <p class="quiz-q">${score === order.length ? "Sempurna! Kamu paham cara pakai AI yang sehat. 🌟" : score >= order.length * 0.7 ? "Bagus! Sedikit lagi sempurna. 👍" : "Baca ulang aturannya, lalu coba lagi. 🔄"}</p>
              <button class="btn btn-primary" data-restart><i data-lucide="rotate-ccw"></i> Main lagi</button>`;
          } else {
            box.innerHTML = `<div class="quiz-top"><span>Pertanyaan ${idx + 1} dari ${order.length}</span><span class="tag blue">Skor ${score}</span></div>
              <p class="quiz-q">${fmt(a.scenarios[order[idx]][0])}</p>
              <div class="quiz-a">${Object.entries(label).map(([k, l]) => `<button class="btn" data-ans="${k}">${l}</button>`).join("")}</div><div class="quiz-fb"></div>`;
          }
          icons();
        };
        box.addEventListener("click", (e) => {
          if (e.target.closest("[data-restart]")) return start();
          if (e.target.closest("[data-next]")) { idx++; return draw(); }
          const b = e.target.closest("[data-ans]");
          if (!b || answered) return;
          answered = true;
          const right = a.scenarios[order[idx]][1], ok = b.dataset.ans === right;
          if (ok) { score++; confetti(b); } else { b.classList.add("shake"); }
          $$("[data-ans]", box).forEach((x) => { x.disabled = true; if (x.dataset.ans === right) x.classList.add("btn-gold"); });
          $(".quiz-fb", box).innerHTML = callout(ok ? "🎉" : "🤔", ok ? "green" : "red", `<p>${ok ? "Benar!" : "Kurang tepat."} Jawabannya <strong>${label[right]}</strong>.</p><p style="margin-top:.6rem"><button class="btn btn-sm btn-primary" data-next>Lanjut <i data-lucide="chevron-right"></i></button></p>`);
          icons();
        });
        start();
      },
    };
  }

  function pageAssess() {
    const vals = store.get("calc", [85, 85, 85, 85]);
    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], ["Referensi"]), icon: "chart-column", gold: true, title: "Assessment & Grading", lead: "Komponen penilaian, level performa, dan target kompetensi minimum." })}
      ${h2("Evaluation Rubric", "rubric")}
      <div class="tbl"><table><thead><tr><th>Assessment</th><th>Weight</th></tr></thead><tbody>
        ${D.rubric.map(([n, w]) => `<tr><td>${esc(n)}</td><td><strong>${w}%</strong></td></tr>`).join("")}<tr><td><strong>Total</strong></td><td><strong>100%</strong></td></tr>
      </tbody></table></div>
      ${h2("Kalkulator Nilai", "kalkulator")}
      <p>Geser nilai tiap komponen untuk memperkirakan nilai akhirmu.</p>
      <div class="card" id="calc">
        ${D.rubric.map(([n, w], i) => `<div class="slider"><div class="slider-top"><span>${esc(n)}<em>${w}%</em></span><output data-o="${i}">${vals[i]}</output></div><input type="range" min="0" max="100" value="${vals[i]}" data-s="${i}" aria-label="${esc(n)}"></div>`).join("")}
        <div class="total"><div><span>Nilai akhir</span><b id="calcTotal">0</b></div><div><span>Level</span><strong id="calcLevel"></strong></div></div>
      </div>
      ${h2("Performance Levels", "levels")}
      <div class="tbl"><table><thead><tr><th>Score</th><th>Level</th><th>Description</th></tr></thead><tbody>
        ${D.levels.map(([min, em, n, d], i) => `<tr data-l="${i}"><td>${i === 3 ? "Below 70" : `${min}–${i ? D.levels[i - 1][0] - 1 : 100}`}</td><td>${em} <strong>${esc(n)}</strong></td><td>${esc(d)}</td></tr>`).join("")}
      </tbody></table></div>
      ${h2("Target Kompetensi Minimum", "kompetensi")}
      <ul>${D.competency.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>`;
    return {
      html,
      mount(root) {
        const calc = $("#calc", root);
        const draw = () => {
          const v = $$("[data-s]", calc).map((s) => +s.value);
          store.set("calc", v);
          v.forEach((x, i) => ($(`[data-o="${i}"]`, calc).textContent = x));
          const total = Math.round(D.rubric.reduce((s, [, w], i) => s + (v[i] * w) / 100, 0) * 10) / 10;
          const li = D.levels.findIndex(([min]) => total >= min);
          tween($("#calcTotal", root), total, 350, total % 1 ? 1 : 0);
          const lv = $("#calcLevel", root), txt = `${D.levels[li][1]} ${D.levels[li][2]}`;
          if (lv.textContent !== txt) { lv.textContent = txt; lv.classList.remove("pop"); void lv.offsetWidth; lv.classList.add("pop"); }
          $$("[data-l]", root).forEach((tr) => tr.classList.toggle("current", +tr.dataset.l === li));
        };
        calc.addEventListener("input", draw);
        draw();
      },
    };
  }

  function pageTracker() {
    const d = done(), n = d.length, C = 2 * Math.PI * 40, pct = progress();
    const msgFor = (k) => (k === 0 ? "Ayo mulai dari pertemuan pertama!" : k === CH.length ? "Semua pertemuan selesai. Keren! 🎓" : k >= 9 ? "Tinggal sedikit lagi menuju Demo Day! 💪" : k >= 6 ? "Sudah lewat setengah jalan. Gas terus! 🚀" : "Mantap, pertahankan ritme belajarmu! 🌱");
    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], ["Progres"]), icon: "calendar-check", title: "Learning Tracker", lead: "Pantau perkembanganmu di sini. Progres tersimpan di browser ini saja, jadi simpan cadangannya kalau pindah perangkat." })}
      <div class="card ring-wrap">
        <svg class="ring" viewBox="0 0 96 96"><circle class="bg" cx="48" cy="48" r="40"/><circle class="fg" cx="48" cy="48" r="40" style="stroke-dasharray:${C};stroke-dashoffset:${C}" data-off="${C * (1 - pct / 100)}"/></svg>
        <div><span class="ring-num"><span id="ringNum">0</span>%</span><span class="muted">${n} dari ${CH.length} pertemuan selesai</span><p id="trackMsg" style="margin:.3rem 0 0;color:var(--text)">${msgFor(n)}</p></div>
      </div>
      ${callout("💡", "blue", "<p><strong>Cara menghitung progres:</strong> tiap bab bernilai sama. Bab yang sudah ditandai selesai dihitung penuh. Bab yang belum selesai ikut bertambah sedikit demi sedikit setiap kamu mencentang <em>Self-Assessment</em> di bab itu.</p>")}
      ${D.phases.map((p) => `${h2(p.name, slug(p.name))}<ul class="checklist" data-tracker>${CH.filter((c) => c.phase === p.id).map((c) => checkItem(`<strong>${pad(c.num)}</strong> — ${esc(c.short)} <a href="#/${chRoute(c)}" class="muted small" style="margin-left:.3rem">buka →</a>`, d.includes(c.num), `data-n="${c.num}"`)).join("")}</ul>`).join("")}
      ${h2("Simpan & Pindahkan Progres", "backup")}
      <p>Progres, self-check, kuis, dan jurnal hanya tersimpan di browser ini. Simpan file cadangan sebelum ganti HP/laptop, lalu impor di perangkat baru. Kalau memakai komputer lab bergantian, reset progres setelah selesai belajar.</p>
      <div class="form-actions backup-actions">
        <button class="btn" type="button" id="bkExport"><i data-lucide="download"></i> Simpan cadangan (.json)</button>
        <label class="btn" for="bkFile"><i data-lucide="upload"></i> Impor cadangan</label>
        <input type="file" id="bkFile" accept=".json,application/json" hidden>
        <button class="btn btn-danger" type="button" id="bkReset"><i data-lucide="rotate-ccw"></i> Reset progres</button>
      </div>`;
    return {
      html,
      mount(root) {
        const fg = $(".ring .fg", root);
        requestAnimationFrame(() => requestAnimationFrame(() => { fg.style.strokeDashoffset = fg.dataset.off; }));
        tween($("#ringNum", root), pct, 800);
        const keys = () => { const out = []; try { for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k.startsWith("hsi-") && k !== "hsi-theme" && !k.startsWith("hsi-preview")) out.push(k); } } catch { /* ignore */ } return out; };
        $("#bkExport", root).addEventListener("click", () => {
          const data = {};
          keys().forEach((k) => (data[k] = localStorage.getItem(k)));
          const name = (store.get("profile", {}).name || "siswa").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "siswa";
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([JSON.stringify({ app: "hsi-react-journey", version: 1, savedAt: new Date().toISOString(), data }, null, 2)], { type: "application/json" }));
          a.download = `progres-react-${name}-${todayKey()}.json`;
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
          toast("File cadangan tersimpan 💾");
        });
        $("#bkFile", root).addEventListener("change", async (e) => {
          const file = e.target.files[0];
          e.target.value = "";
          if (!file) return;
          try {
            const json = JSON.parse(await file.text());
            if (json.app !== "hsi-react-journey" || !json.data || typeof json.data !== "object") throw new Error("bad");
            const entries = Object.entries(json.data).filter(([k, v]) => k.startsWith("hsi-") && k !== "hsi-theme" && typeof v === "string");
            if (!confirm("Progres di browser ini akan diganti dengan isi file cadangan. Lanjutkan?")) return;
            keys().forEach((k) => localStorage.removeItem(k));
            entries.forEach(([k, v]) => localStorage.setItem(k, v));
            toast("Progres berhasil dipulihkan ✓");
            render();
          } catch { toast("File tidak valid. Pilih file cadangan .json dari handbook ini."); }
        });
        $("#bkReset", root).addEventListener("click", () => {
          if (!confirm("Hapus semua progres, self-check, kuis, jurnal, serta nama & rombel di browser ini? Tindakan ini tidak bisa dibatalkan.")) return;
          keys().forEach((k) => { try { localStorage.removeItem(k); } catch { /* ignore */ } });
          toast("Progres direset");
          render();
        });
        $$("[data-tracker]", root).forEach((ul) => ul.addEventListener("change", (e) => {
          const num = +e.target.dataset.n;
          setDone(num, e.target.checked);
          if (e.target.checked) { toast(`Pertemuan ${pad(num)} selesai ✓`); confetti(e.target.closest(".check")); }
          const k = done().length;
          const pk = progress();
          fg.style.strokeDashoffset = C * (1 - pk / 100);
          tween($("#ringNum", root), pk, 500);
          $(".ring-wrap .muted", root).textContent = `${k} dari ${CH.length} pertemuan selesai`;
          $("#trackMsg", root).textContent = msgFor(k);
        }));
      },
    };
  }

  function pageJournal() {
    const html = `
      ${pageHead({ crumb: crumbs(["Beranda", ""], ["Progres"]), icon: "notebook-pen", gold: true, title: "Personal Learning Journal", lead: "Setiap selesai pembelajaran, catat refleksimu. Jurnal tersimpan di browser ini dan bisa diexport." })}
      <form class="form card" id="jForm" novalidate>
        <div class="form-row">
          <label>Meeting<select name="meeting">${CH.map((c) => `<option value="${c.num}">Meeting ${pad(c.num)}</option>`).join("")}</select></label>
          <label>Today's Topic<input name="topic" value="${esc(CH[0].short)}" placeholder="mis. Events & useState"></label>
        </div>
        <label>Three Things I Learned<textarea name="learned" rows="3" placeholder="1. …&#10;2. …&#10;3. …"></textarea></label>
        <label>One Problem I Encountered<input name="problem" placeholder="Error / kendala hari ini"></label>
        <label>How I Solved It<input name="solved" placeholder="Langkah penyelesaian"></label>
        <label>My Next Learning Goal<input name="goal" placeholder="Target berikutnya"></label>
        <div class="form-actions"><button class="btn btn-primary" type="submit"><i data-lucide="save"></i> Simpan jurnal</button><button class="btn" type="button" id="jExport"><i data-lucide="download"></i> Export .txt</button></div>
        <p class="form-msg" id="jMsg" role="status"></p>
      </form>
      ${h2("Catatan Tersimpan", "catatan")}
      <div id="jList"></div>`;
    return {
      html,
      mount(root) {
        const f = $("#jForm", root), list = $("#jList", root), msg = $("#jMsg", root);
        let auto = true;
        f.meeting.addEventListener("change", () => { if (auto || !f.topic.value) { f.topic.value = CH[+f.meeting.value - 1].short; auto = true; } });
        f.topic.addEventListener("input", () => (auto = false));
        const draw = () => {
          const entries = store.get("journal", []);
          list.innerHTML = entries.length ? entries.map((j, i) => `<div class="entry"><h3><small>MEETING ${pad(j.meeting)} · ${new Date(j.at).toLocaleDateString("id-ID", { dateStyle: "medium" })}</small>${esc(j.topic)}</h3>
            <dl><dt>Three Things I Learned</dt><dd>${esc(j.learned)}</dd>${j.problem ? `<dt>One Problem I Encountered</dt><dd>${esc(j.problem)}</dd>` : ""}${j.solved ? `<dt>How I Solved It</dt><dd>${esc(j.solved)}</dd>` : ""}${j.goal ? `<dt>My Next Learning Goal</dt><dd>${esc(j.goal)}</dd>` : ""}</dl>
            <button class="ibtn danger" data-del="${i}" aria-label="Hapus jurnal"><i data-lucide="trash-2"></i></button></div>`).join("")
            : `<div class="empty"><i data-lucide="notebook-pen"></i>Belum ada jurnal. Tulis refleksi pertamamu di atas.</div>`;
          icons();
        };
        f.addEventListener("submit", (e) => {
          e.preventDefault();
          const data = Object.fromEntries(new FormData(f));
          if (!data.topic.trim() || !data.learned.trim()) { msg.textContent = "Isi minimal Today's Topic dan Three Things I Learned."; msg.className = "form-msg error"; return; }
          store.set("journal", [{ ...data, meeting: +data.meeting, at: new Date().toISOString() }, ...store.get("journal", [])]);
          ["learned", "problem", "solved", "goal"].forEach((k) => (f.elements[k].value = ""));
          msg.textContent = "Jurnal tersimpan 📝"; msg.className = "form-msg";
          setTimeout(() => (msg.textContent = ""), 2500);
          draw();
        });
        list.addEventListener("click", (e) => {
          const b = e.target.closest("[data-del]");
          if (!b) return;
          const entries = store.get("journal", []);
          entries.splice(+b.dataset.del, 1);
          store.set("journal", entries);
          draw();
        });
        $("#jExport", root).addEventListener("click", () => {
          const entries = store.get("journal", []);
          if (!entries.length) return toast("Belum ada jurnal untuk diexport");
          const txt = "PERSONAL LEARNING JOURNAL — React.js Fundamental\n\n" + entries.map((j) =>
            `Meeting: ${pad(j.meeting)}\nToday's Topic: ${j.topic}\nThree Things I Learned:\n${j.learned}\nOne Problem I Encountered: ${j.problem || "-"}\nHow I Solved It: ${j.solved || "-"}\nMy Next Learning Goal: ${j.goal || "-"}\nTanggal: ${new Date(j.at).toLocaleString("id-ID")}\n`).join("\n------------------------------\n\n");
          const a = document.createElement("a");
          a.href = URL.createObjectURL(new Blob([txt], { type: "text/plain" }));
          a.download = "learning-journal.txt";
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        });
        draw();
      },
    };
  }

  function pageResources() {
    return {
      html: `
        ${pageHead({ crumb: crumbs(["Beranda", ""], ["Progres"]), icon: "link", title: "Learning Resources", lead: "Gunakan dokumentasi resmi sebagai referensi utama." })}
        <div class="grid">${D.resources.map(([ic, n, u], i) => `<a class="tile" href="${u}" target="_blank" rel="noopener"><span class="t-ico${i % 2 ? " gold" : ""}"><i data-lucide="${ic}"></i></span><div><b>${esc(n)}</b><span>${esc(u.replace(/^https:\/\//, ""))}</span></div></a>`).join("")}</div>
        ${callout("📌", "blue", "<p>Biasakan membaca dokumentasi berbahasa Inggris. Istilah teknis dan source code di handbook ini sengaja memakai bahasa Inggris agar kamu terbiasa.</p>")}`,
    };
  }

  function pageFinal() {
    return {
      html: `
        ${pageHead({ crumb: crumbs(["Beranda", ""], ["Progres"]), icon: "graduation-cap", gold: true, title: "From JavaScript Learner to React Developer" })}
        ${cheerStage()}
        ${h2("Pesan Penutup", "pesan-penutup")}
        <p>Menjadi developer bukan tentang siapa yang paling cepat mengetik kode atau siapa yang paling banyak menghafal sintaks.</p>
        <p>Developer yang baik adalah mereka yang memahami masalah, mampu menyusun solusi, berani bereksperimen, dan terus belajar dari kesalahan.</p>
        <p>Jangan takut ketika program kalian mengalami error. Error bukan akhir dari proses belajar. Justru saat kalian memahami penyebab error dan berhasil memperbaikinya, kemampuan programming kalian sedang berkembang.</p>
        ${callout("🚀", "gold", "<p><strong>Stay curious. Keep experimenting. Build something meaningful.</strong></p>")}
        <p class="muted small">HSI Boarding School Purworejo · React.js Fundamental — Student Learning Handbook · Academic Year 2026/2027</p>`,
      mount(root) {
        const t = setTimeout(() => confetti($(".stage", root)), 450);
        return () => clearTimeout(t);
      },
    };
  }

  /* ---------- routes ---------- */
  const ROUTES = [
    { id: "", title: "Beranda", icon: "house", group: "Mulai", render: pageHome },
    { id: "mulai", title: "Getting Started", icon: "flag", group: "Mulai", render: pageStart },
    ...CH.map((c) => ({ id: chRoute(c), title: c.title, short: c.short, chapter: c, icon: c.icon, group: phaseOf(c).name, render: () => pageChapter(c) })),
    { id: "referensi", title: "Quick Reference", icon: "book-marked", group: "Referensi", render: pageRef },
    { id: "kesalahan", title: "Common Mistakes", icon: "triangle-alert", group: "Referensi", render: pageMistakes },
    { id: "ai", title: "AI Learning Policy", icon: "bot", group: "Referensi", render: pageAI },
    { id: "asesmen", title: "Assessment & Grading", icon: "chart-column", group: "Referensi", render: pageAssess },
    { id: "tracker", title: "Learning Tracker", icon: "calendar-check", group: "Progres", render: pageTracker },
    { id: "jurnal", title: "Learning Journal", icon: "notebook-pen", group: "Progres", render: pageJournal },
    { id: "sumber", title: "Learning Resources", icon: "link", group: "Progres", render: pageResources },
    { id: "penutup", title: "Pesan Penutup", icon: "graduation-cap", group: "Progres", render: pageFinal },
  ];

  /* ---------- demos ---------- */
  const DEMOS = createDemos({ $, $$, esc, pad, icons, store, toast, avatar, checkItem });
  const PREVIEWS = createPreviews();

  /* ---------- sidebar & progress ---------- */
  function renderSidebar(activeId) {
    const d = done();
    const groups = [];
    ROUTES.forEach((r) => {
      let g = groups.find((x) => x.label === r.group);
      if (!g) groups.push((g = { label: r.group, items: [] }));
      g.items.push(r);
    });
    $("#sideNav").innerHTML = groups.map((g) => {
      const chs = g.items.filter((r) => r.chapter);
      const count = chs.length ? `<span>${chs.filter((r) => d.includes(r.chapter.num)).length}/${chs.length}</span>` : "";
      return `<div class="side-group"><div class="side-label"><span>${esc(g.label)}</span>${count}</div>${g.items.map((r) => `
        <a class="side-link${r.id === activeId ? " active" : ""}" href="#/${r.id}">
          ${r.chapter ? `<span class="sl-num">${pad(r.chapter.num)}</span>` : `<span class="sl-ico"><i data-lucide="${r.icon}"></i></span>`}
          <span class="sl-t">${esc(r.short || r.title)}</span>
          ${r.chapter && d.includes(r.chapter.num) ? `<span class="sl-done">${CHECK}</span>` : ""}
        </a>`).join("")}</div>`;
    }).join("");
  }

  function updateTop() {
    const p = progress();
    $("#topBar").style.width = p + "%";
    $("#topCount").textContent = p + "%";
    const sp = $("#stripPct");
    if (sp) sp.textContent = p + "%";
    if (!$("#shareModal").hidden) drawShare();
  }
  function setDone(n, val) {
    const set = new Set(done());
    val ? set.add(n) : set.delete(n);
    store.set("done", [...set]);
    updateTop();
    renderSidebar(currentId);
    icons();
  }

  /* ---------- toc ---------- */
  let tocLinks = [];
  function buildToc(hide) {
    const toc = $("#toc");
    const heads = $$("#page h2[id]");
    if (hide || heads.length < 2) { toc.innerHTML = ""; tocLinks = []; return; }
    toc.innerHTML = `<div class="toc-title"><i data-lucide="list"></i> Di halaman ini</div>${heads.map((h) => `<a href="#" data-target="${h.id}">${esc(h.childNodes[0].textContent)}</a>`).join("")}`;
    tocLinks = $$("a", toc);
    spy();
  }
  function spy() {
    if (!tocLinks.length) return;
    const heads = $$("#page h2[id]");
    let idx = 0;
    heads.forEach((h, i) => { if (h.getBoundingClientRect().top < 140) idx = i; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) idx = heads.length - 1;
    tocLinks.forEach((a, i) => a.classList.toggle("active", i === idx));
  }
  function scrollToId(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- router ---------- */
  let currentId = null, cleanup = null, pendingTarget = null;
  const highlight = (root) => { if (window.hljs) $$("pre code", root).forEach((el) => { if (!el.classList.contains("language-plaintext") && !el.dataset.highlighted) window.hljs.highlightElement(el); }); };

  function render() {
    const id = location.hash.replace(/^#\/?/, "");
    let idx = ROUTES.findIndex((r) => r.id === id);
    if (idx < 0) idx = 0;
    const r = ROUTES[idx];
    const changed = r.id !== currentId;
    currentId = r.id;
    if (cleanup) { try { cleanup(); } catch { /* ignore */ } cleanup = null; }

    const out = r.render();
    const page = $("#page");
    page.className = "page" + (out.wide ? " wide" : "");
    page.style.animation = "none"; void page.offsetWidth; page.style.animation = "";
    page.innerHTML = out.html;
    $(".layout").classList.toggle("no-toc", !!out.wide);
    $("#pager").className = "pager" + (out.wide ? " wide" : "");
    $(".page-foot").classList.toggle("wide", !!out.wide);

    const prev = ROUTES[idx - 1], next = ROUTES[idx + 1];
    $("#pager").innerHTML = (prev ? `<a href="#/${prev.id}"><small><i data-lucide="arrow-left"></i> Sebelumnya</small><b>${esc(prev.title)}</b></a>` : "<span></span>") +
      (next ? `<a class="next" href="#/${next.id}"><small>Berikutnya <i data-lucide="arrow-right"></i></small><b>${esc(next.title)}</b></a>` : "");

    $("#shareStrip").innerHTML = `<div class="ss-txt"><b>Selesai belajar hari ini?</b><span>Bagikan progresmu ke grup Telegram kelas.</span></div>
      <button class="btn btn-primary" type="button" data-share><i data-lucide="send"></i> Bagikan progres <span class="ss-pct" id="stripPct">${progress()}%</span></button>`;
    $("#shareStrip").className = "share-strip" + (out.wide ? " wide" : "");
    const c1 = out.mount ? out.mount(page) || null : null;
    const c2 = mountRuns(page);
    cleanup = () => { if (c1) c1(); c2(); };
    if (!out.wide) $$(":scope > .code, :scope > .callout, :scope > .compare, :scope > .grid, :scope > .tbl, :scope > .steps, :scope > .flow, :scope > #demoHost, :scope > .finish", page).forEach((el) => el.classList.add("reveal", "soft"));
    highlight(page);
    renderSidebar(r.id);
    updateTop();
    icons();
    buildToc(out.wide);
    reveal(page);
    document.title = r.id ? `${r.title} · HSI-BS React Journey` : "HSI-BS React Journey — Belajar React.js dari Nol";
    closeSidebar();
    if (pendingTarget) { const t = pendingTarget; pendingTarget = null; requestAnimationFrame(() => scrollToId(t)); }
    else if (changed) window.scrollTo(0, 0);
    onScroll();
    const act = $(".side-link.active");
    if (act && changed) act.scrollIntoView({ block: "nearest" });
  }

  function reveal(root) {
    const els = $$(".reveal", root);
    if (!("IntersectionObserver" in window)) return els.forEach((e) => e.classList.add("in"));
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -5% 0px" });
    els.forEach((el, i) => { if (!el.classList.contains("soft")) el.style.transitionDelay = (i % 4) * 50 + "ms"; io.observe(el); });
  }

  /* reading progress + back to top */
  function onScroll() {
    spy();
    const h = document.documentElement.scrollHeight - innerHeight;
    const k = h > 0 ? Math.min(1, scrollY / h) : 0;
    $("#readBar").style.transform = `scaleX(${k})`;
    $("#toTop").classList.toggle("show", scrollY > 900);
  }

  /* ---------- search ---------- */
  const INDEX = [];
  function buildIndex() {
    ROUTES.forEach((r) => INDEX.push({ route: r.id, title: r.title, sub: r.chapter ? `Bab ${pad(r.chapter.num)} · ${r.group}` : r.group, icon: r.icon, text: "" }));
    CH.forEach((c) => {
      let cur = null;
      c.blocks.forEach((b) => {
        if (b.h) { cur = { route: chRoute(c), title: plain(b.h), sub: `Bab ${pad(c.num)} · ${c.short}`, icon: "hash", target: slug(b.h), text: "" }; INDEX.push(cur); }
        else if (cur) cur.text += " " + plain(b.p || b.tip || (b.list || b.olist || []).join(" ") || b.code || "");
      });
      ["coba-langsung|Coba Langsung (demo)", "hands-on-practice|Hands-On Practice", "student-challenge|Challenge", "self-assessment|Self-Assessment"].forEach((s) => {
        const [t, n] = s.split("|");
        INDEX.push({ route: chRoute(c), title: `${n} — ${c.short}`, sub: `Bab ${pad(c.num)}`, icon: "hash", target: t, text: plain((c.practice.items || []).join(" ") + " " + (c.challenge || []).join(" ")) });
      });
    });
    D.quickRef.forEach(([ic, c, p]) => INDEX.push({ route: "referensi", title: c, sub: "Quick Reference · " + p, icon: ic, text: p }));
    D.mistakes.forEach((m) => INDEX.push({ route: "kesalahan", title: m.title, sub: "Common Mistakes", icon: "triangle-alert", target: slug(m.title), text: (m.bad || "") + (m.good || "") }));
  }
  let results = [], sel = 0;
  function openSearch() {
    $("#searchModal").hidden = false;
    const inp = $("#searchInput");
    inp.value = ""; doSearch(""); inp.focus();
  }
  function closeSearch() { $("#searchModal").hidden = true; }
  function doSearch(q) {
    q = q.trim().toLowerCase();
    if (!q) results = INDEX.filter((x) => x.icon !== "hash" && ROUTES.some((r) => r.id === x.route && r.title === x.title)).slice(0, 8);
    else {
      results = INDEX.map((x) => {
        const t = x.title.toLowerCase(), s = (x.sub + " " + x.text).toLowerCase();
        const score = t.startsWith(q) ? 3 : t.includes(q) ? 2 : s.includes(q) ? 1 : 0;
        return [score, x];
      }).filter(([s]) => s).sort((a, b) => b[0] - a[0]).slice(0, 14).map(([, x]) => x);
    }
    sel = 0;
    const mark = (s) => { const e = esc(s); if (!q) return e; const i = s.toLowerCase().indexOf(q); return i < 0 ? e : esc(s.slice(0, i)) + "<mark>" + esc(s.slice(i, i + q.length)) + "</mark>" + esc(s.slice(i + q.length)); };
    $("#searchResults").innerHTML = results.length ? results.map((x, i) => `<a class="sr-item${i === 0 ? " sel" : ""}" data-i="${i}"><span class="sr-ico"><i data-lucide="${x.icon}"></i></span><div><b>${mark(x.title)}</b><span>${esc(x.sub)}</span></div></a>`).join("")
      : `<div class="search-empty">Tidak ada hasil untuk “${esc(q)}”.</div>`;
    icons();
  }
  function go(i) {
    const x = results[i];
    if (!x) return;
    closeSearch();
    if (x.route === currentId) { if (x.target) scrollToId(x.target); return; }
    pendingTarget = x.target || null;
    location.hash = "#/" + x.route;
  }
  function initSearch() {
    buildIndex();
    $("#searchOpen").addEventListener("click", openSearch);
    $("#searchModal").addEventListener("click", (e) => { if (e.target.id === "searchModal") closeSearch(); const it = e.target.closest(".sr-item"); if (it) go(+it.dataset.i); });
    $("#searchInput").addEventListener("input", (e) => doSearch(e.target.value));
    $("#searchInput").addEventListener("keydown", (e) => {
      const items = $$(".sr-item");
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        sel = (sel + (e.key === "ArrowDown" ? 1 : -1) + items.length) % Math.max(items.length, 1);
        items.forEach((el, i) => el.classList.toggle("sel", i === sel));
        items[sel]?.scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter") go(sel);
    });
    document.addEventListener("keydown", (e) => {
      const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) { e.preventDefault(); openSearch(); }
      if (e.key === "Escape") { closeSearch(); closeSidebar(); }
    });
    if (/Mac|iPhone|iPad/.test(navigator.platform)) $(".search-trigger kbd").textContent = "⌘ K";
  }

  /* ---------- share progress (Telegram) ---------- */
  function shareText() {
    const prof = store.get("profile", {});
    const t = new Date();
    const cur = currentId && currentId.startsWith("bab-") ? CH[+currentId.slice(4) - 1] : null;
    const c = cur || CH.find((x) => !isDone(x.num)) || CH[CH.length - 1];
    return [
      `📚 Kursus: React.js Fundamental (${c.short})`,
      `📅 Tanggal: ${t.getDate()}-${t.getMonth() + 1}-${t.getFullYear()}`,
      `👤 Nama: ${(prof.name || "").trim() || "…"}`,
      `🏫 Rombel: ${(prof.rombel || "").trim() || "…"}`,
      `📊 Progress Awal: (${dayStart()}%)`,
      `📈 Progress Akhir: (${progress()}%)`,
    ].join("\n");
  }
  function drawShare() { $("#sharePreview").textContent = shareText(); }
  function openShare() {
    const f = $("#shareForm"), prof = store.get("profile", {});
    f.name.value = prof.name || "";
    f.rombel.value = prof.rombel || "";
    drawShare();
    $("#shareModal").hidden = false;
    icons();
    (f.name.value ? $("#shareCopy") : f.name).focus();
  }
  function closeShare() { $("#shareModal").hidden = true; }
  function initShare() {
    const f = $("#shareForm"), modal = $("#shareModal");
    const ready = () => {
      const miss = ["name", "rombel"].filter((k) => !f[k].value.trim());
      miss.forEach((k) => f[k].classList.add("invalid"));
      if (miss.length) { f[miss[0]].focus(); toast("Isi nama dan rombel dulu ya"); return false; }
      return true;
    };
    f.addEventListener("input", (e) => {
      e.target.classList.remove("invalid");
      store.set("profile", { name: f.name.value, rombel: f.rombel.value });
      drawShare();
    });
    f.addEventListener("submit", (e) => e.preventDefault());
    $("#shareOpen").addEventListener("click", openShare);
    $("#shareClose").addEventListener("click", closeShare);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeShare(); });
    $("#shareCopy").addEventListener("click", async () => {
      if (!ready()) return;
      const b = $("#shareCopy");
      if (await copyText(shareText())) {
        b.innerHTML = `<i data-lucide="check"></i> Tersalin! Tempel di grup Telegram`; icons();
        setTimeout(() => { b.innerHTML = `<i data-lucide="copy"></i> Copy teks`; icons(); }, 2200);
      } else toast("Gagal menyalin. Blok teks di atas lalu salin manual.");
    });
    const nat = $("#shareNative");
    if (navigator.share) {
      nat.hidden = false;
      nat.addEventListener("click", async () => {
        if (!ready()) return;
        try { await navigator.share({ text: shareText() }); } catch { /* dibatalkan */ }
      });
    }
    document.addEventListener("click", (e) => { if (e.target.closest("[data-share]")) openShare(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) closeShare(); });
  }

  /* ---------- global events ---------- */
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("show"); }
  function initGlobal() {
    $("#sideOpen").addEventListener("click", () => { $("#sidebar").classList.add("open"); $("#scrim").classList.add("show"); });
    $("#scrim").addEventListener("click", closeSidebar);

    const themeBtn = $("#themeToggle");
    const isDark = () => { const t = document.documentElement.getAttribute("data-theme"); return t ? t === "dark" : matchMedia("(prefers-color-scheme: dark)").matches; };
    const setIcon = () => { themeBtn.innerHTML = `<i data-lucide="${isDark() ? "sun" : "moon"}"></i>`; icons(); };
    themeBtn.addEventListener("click", () => {
      const t = isDark() ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", t);
      try { localStorage.setItem("hsi-theme", t); } catch { /* ignore */ }
      setIcon();
    });
    setIcon();

    // delegated handlers for page content (installed once)
    const page = $("#page");
    document.addEventListener("click", async (e) => {
      const tgt = e.target.closest("[data-target]");
      if (tgt) { e.preventDefault(); scrollToId(tgt.dataset.target); return; }
      const cp = e.target.closest("[data-copy]");
      if (cp) {
        await copyText(cp.closest(".code").querySelector("pre").textContent);
        cp.classList.add("ok"); cp.innerHTML = `<i data-lucide="check"></i> Copied`; icons();
        setTimeout(() => { cp.classList.remove("ok"); cp.innerHTML = `<i data-lucide="copy"></i> Copy`; icons(); }, 1500);
        return;
      }
      const st = e.target.closest("[data-status]");
      if (st) {
        const n = +st.dataset.status, val = !isDone(n);
        setDone(n, val);
        st.classList.toggle("green", val);
        st.innerHTML = statusLabel(val); icons();
        if (val) { toast(`Mantap! Bab ${pad(n)} selesai ✓`); confetti(st); }
        const fin = $("#finish");
        if (fin) { fin.outerHTML = finishCard(CH[n - 1]); icons(); }
        return;
      }
      const fb = e.target.closest("[data-finish]");
      if (fb) {
        const n = +fb.dataset.finish, next = CH[n];
        setDone(n, true);
        confetti(fb);
        toast(next ? `Bab ${pad(n)} selesai ✓ Lanjut ke Bab ${pad(next.num)}…` : `Bab ${pad(n)} selesai ✓ Semua bab tuntas!`);
        fb.disabled = true;
        setTimeout(() => { location.hash = "#/" + (next ? chRoute(next) : "penutup"); }, calm() ? 0 : 900);
      }
    });
    page.addEventListener("change", (e) => {
      const a = e.target.closest("[data-assess]");
      if (a) {
        const num = +a.dataset.assess;
        const vals = $$("input", a).map((x) => x.checked);
        store.set("assess-" + num, vals);
        updateTop();
        const n = vals.filter(Boolean).length;
        const prop = $("#assessProp");
        if (prop) prop.textContent = `${n}/${vals.length} tercentang`;
        if (n === vals.length && !isDone(num)) toast("Semua self-check tercentang! Tandai bab ini selesai di bagian Status ↑");
      }
      const cl = e.target.closest("[data-checklist]");
      if (cl) store.set("check-" + cl.dataset.checklist, $$("input", cl).map((x) => x.checked));
    });

    addEventListener("scroll", onScroll, { passive: true });
    $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: calm() ? "auto" : "smooth" }));
    // CDN dimuat async: begitu siap, render ikon & highlight tanpa menunggu.
    window.addEventListener("hsi:lib", () => { icons(); highlight($("#page")); });
    addEventListener("hashchange", render);
  }

  dayStart();
  initGlobal();
  initSearch();
  initShare();
  render();
})();

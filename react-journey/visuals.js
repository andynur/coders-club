/* ==========================================================
   HSI-BS React Journey — Ilustrasi & bagan interaktif
   Dipanggil dari data.js lewat blok { viz: "namaVisual" }.
   Setiap visual: title, hint (opsional), cap (caption HTML),
   html() -> markup, mount(el) -> fungsi cleanup (opsional).
   Animasi berjalan hanya saat visual terlihat di layar,
   dan menghormati prefers-reduced-motion.
   ========================================================== */
function createVisuals() {
  "use strict";
  const $ = (s, r) => r.querySelector(s);
  const $$ = (s, r) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const calm = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
  const sleep = (ms) => new Promise((r) => setTimeout(r, calm() ? Math.min(ms, 60) : ms));
  const flash = (node, cls = "pulse") => { if (!node) return; node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); };
  const shake = (node) => flash(node, "vz-shake");

  /* Urutan animasi yang bisa dibatalkan: start() memberi id baru, ok(id) false jika sudah diganti. */
  function runner() {
    let gen = 0;
    return { start: () => ++gen, ok: (id) => id === gen, stop: () => { gen++; } };
  }
  /* Jalankan show() saat visual terlihat, hide() saat keluar layar. */
  function watch(el, show, hide) {
    if (!("IntersectionObserver" in window)) { show(); return () => hide && hide(); }
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? show() : hide && hide()), { threshold: 0.3 });
    io.observe(el);
    return () => { io.disconnect(); if (hide) hide(); };
  }

  const V = {};

  /* ======================================================= Bab 01 */
  const TREE = [["App", 0], ["Navbar", 1], ["Sidebar", 1], ["Dashboard", 1], ["StatisticsCard", 2], ["StudentList", 2], ["TaskList", 2], ["Footer", 1]];
  V.uiTree = {
    title: "Satu halaman = susunan komponen",
    hint: "Arahkan kursor atau ketuk nama komponen",
    cap: "Kiri: tampilan dashboard. Kanan: <em>component tree</em>-nya. Setiap kotak adalah satu komponen yang dibuat sekali, lalu bisa dipakai ulang.",
    html: () => `<div class="vz-split">
      <div class="vz-wire" data-wire aria-hidden="true">
        <div class="w nav" data-k="Navbar"><b>Navbar</b><span class="w-dots"><i></i><i></i><i></i></span></div>
        <div class="w side" data-k="Sidebar"><b>Sidebar</b><span class="w-bars"><i></i><i></i><i></i><i></i></span></div>
        <div class="w stats" data-k="StatisticsCard"><b>StatisticsCard</b><span class="w-tiles"><i></i><i></i><i></i></span></div>
        <div class="w list" data-k="StudentList"><b>StudentList</b><span class="w-bars"><i></i><i></i><i></i></span></div>
        <div class="w task" data-k="TaskList"><b>TaskList</b><span class="w-bars"><i></i><i></i></span></div>
        <div class="w foot" data-k="Footer"><b>Footer</b></div>
      </div>
      <div class="vz-tree">${TREE.map(([k, l]) => `<button type="button" class="tn" data-k="${k}" style="--lvl:${l}">&lt;${k} /&gt;</button>`).join("")}</div>
    </div>`,
    mount(el) {
      const keys = TREE.map((t) => t[0]);
      const GROUP = { App: keys, Dashboard: ["Dashboard", "StatisticsCard", "StudentList", "TaskList"] };
      let i = 0, timer = null, pauseUntil = 0;
      const set = (k) => {
        const on = GROUP[k] || [k];
        $$("[data-k]", el).forEach((n) => n.classList.toggle("on", on.includes(n.dataset.k)));
        $("[data-tn-cur]", el)?.removeAttribute("data-tn-cur");
        $(`.tn[data-k="${k}"]`, el).setAttribute("data-tn-cur", "");
      };
      const pick = (e) => { const n = e.target.closest("[data-k]"); if (!n) return; pauseUntil = Date.now() + 5000; i = keys.indexOf(n.dataset.k); set(n.dataset.k); };
      el.addEventListener("mouseover", pick); el.addEventListener("click", pick); el.addEventListener("focusin", pick);
      set("App");
      const tick = () => { if (Date.now() < pauseUntil) return; i = (i + 1) % keys.length; set(keys[i]); };
      return watch(el, () => { if (!timer && !calm()) timer = setInterval(tick, 1700); }, () => { clearInterval(timer); timer = null; });
    },
  };

  const NAMES = ["Ahmad", "Zaid", "Umar", "Bilal"];
  V.uiFormula = {
    title: "UI = f(state): tampilan mengikuti data",
    hint: "Ubah data, lihat tampilannya",
    cap: "Kamu <b>tidak</b> menyuruh layar berubah satu per satu. Kamu cukup mengubah <b>data</b>, lalu React menggambar ulang tampilan dari data itu.",
    html: () => `<div class="vz-formula">
      <div class="vz-box"><small>① Data (state)</small><pre class="vz-pre" data-state></pre>
        <div class="vz-btns"><button type="button" class="vz-btn" data-act="poin">⭐ poin + 1</button><button type="button" class="vz-btn" data-act="hadir">🔁 hadir</button><button type="button" class="vz-btn" data-act="nama">✏️ nama</button></div></div>
      <span class="vz-arrow" data-ar="1" aria-hidden="true"></span>
      <div class="vz-box fn" data-fn><small>② Komponen</small><code>function Kartu(data)</code><span class="vz-gear" aria-hidden="true">⚙️</span></div>
      <span class="vz-arrow" data-ar="2" aria-hidden="true"></span>
      <div class="vz-box"><small>③ Tampilan (UI)</small><div class="vz-ui" data-ui></div></div>
    </div>`,
    mount(el) {
      const s = { nama: "Ahmad", hadir: true, poin: 3 };
      const run = runner();
      const pre = (changed) => {
        const row = (k, v) => `  ${k}: ${v},`;
        const lines = [["nama", `"${s.nama}"`], ["hadir", s.hadir], ["poin", s.poin]].map(([k, v]) => (k === changed ? `<mark>${row(k, v)}</mark>` : row(k, v)));
        $("[data-state]", el).innerHTML = `{\n${lines.join("\n")}\n}`;
      };
      const ui = () => {
        $("[data-ui]", el).innerHTML = `<div class="vz-mini${s.hadir ? "" : " off"}"><span class="vz-av">${esc(s.nama[0])}</span><div><b>${esc(s.nama)}</b><span class="vz-badge${s.hadir ? " ok" : ""}">${s.hadir ? "🟢 Hadir" : "🔴 Izin"}</span></div><span class="vz-stars">${"⭐".repeat(s.poin)}</span></div>`;
      };
      pre(); ui();
      el.addEventListener("click", async (e) => {
        const b = e.target.closest("[data-act]");
        if (!b) return;
        const k = b.dataset.act;
        if (k === "poin") s.poin = s.poin >= 5 ? 1 : s.poin + 1;
        if (k === "hadir") s.hadir = !s.hadir;
        if (k === "nama") s.nama = NAMES[(NAMES.indexOf(s.nama) + 1) % NAMES.length];
        pre(k);
        const id = run.start();
        flash($('[data-ar="1"]', el), "go"); await sleep(260); if (!run.ok(id)) return;
        flash($("[data-fn]", el)); await sleep(260); if (!run.ok(id)) return;
        flash($('[data-ar="2"]', el), "go"); await sleep(260); if (!run.ok(id)) return;
        ui(); flash($("[data-ui]", el));
      });
      return run.stop;
    },
  };

  /* ======================================================= Bab 02 */
  const EXPR = [["name", (n) => n], ["name.toUpperCase()", (n) => n.toUpperCase()], ["name.length", (n) => n.length], ["1 + 2", () => 3]];
  V.jsxAnatomy = {
    title: "Anatomi JSX: HTML + pintu masuk JavaScript",
    hint: "Ketik nama, pilih ekspresi",
    cap: "Bagian <span class=\"vz-k-t\">biru</span> terlihat seperti HTML. Bagian <span class=\"vz-k-s\">emas</span> di dalam <code>{ }</code> adalah JavaScript yang dihitung dulu, lalu hasilnya ditempel ke layar.",
    html: () => `<div class="vz-jsx">
      <label class="vz-var"><code>const name = "</code><input type="text" maxlength="14" value="Ahmad" aria-label="Nilai variabel name" data-name><code>";</code></label>
      <div class="vz-chips" role="group" aria-label="Pilih ekspresi">${EXPR.map(([x], i) => `<button type="button" class="vz-chip${i ? "" : " on"}" data-x="${i}"><code>{${esc(x)}}</code></button>`).join("")}</div>
      <div class="vz-cols">
        <div class="vz-col"><small>Kamu tulis (JSX)</small><pre class="vz-pre"><span class="vz-k-t">&lt;h1&gt;</span>Hello, <span class="vz-k-s" data-slot>{name}</span>!<span class="vz-k-t">&lt;/h1&gt;</span></pre></div>
        <span class="vz-arrow" aria-hidden="true"></span>
        <div class="vz-col"><small>Browser tampilkan</small><div class="vz-screen"><h1 class="vz-h1" data-out>Hello, Ahmad!</h1></div></div>
      </div>
    </div>`,
    mount(el) {
      let x = 0;
      const draw = () => {
        const n = $("[data-name]", el).value;
        $("[data-slot]", el).textContent = `{${EXPR[x][0]}}`;
        $("[data-out]", el).textContent = `Hello, ${EXPR[x][1](n)}!`;
        flash($("[data-slot]", el)); flash($("[data-out]", el));
      };
      $("[data-name]", el).addEventListener("input", draw);
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-x]");
        if (!b) return;
        x = +b.dataset.x;
        $$("[data-x]", el).forEach((c) => c.classList.toggle("on", c === b));
        draw();
      });
    },
  };

  V.componentStamp = {
    title: "Komponen itu seperti cetakan",
    hint: "Klik tombol untuk memakai komponen",
    cap: "Satu function <code>StudentCard</code> bisa dipakai berkali-kali. Tapi semua kartunya masih <b>sama persis</b>. Di Bab 03 kita pakai <b>props</b> supaya isinya bisa beda-beda.",
    html: () => `<div class="vz-stamp">
      <div class="vz-box"><small>Cetakan (dibuat sekali)</small>
        <pre class="vz-pre">function StudentCard() {
  return (
    &lt;article&gt;…&lt;/article&gt;
  );
}</pre>
        <div class="vz-btns"><button type="button" class="vz-btn primary" data-add>+ Pakai &lt;StudentCard /&gt;</button><button type="button" class="vz-btn" data-reset>Reset</button></div>
      </div>
      <div class="vz-box"><small>App.jsx</small><pre class="vz-pre" data-code></pre><div class="vz-cards" data-cards></div><p class="vz-note" data-note></p></div>
    </div>`,
    mount(el) {
      let n = 1;
      const draw = (pop) => {
        $("[data-code]", el).innerHTML = `&lt;main&gt;\n${Array.from({ length: n }, (_, i) => `  <span class="${pop && i === n - 1 ? "vz-new" : ""}">&lt;StudentCard /&gt;</span>`).join("\n")}\n&lt;/main&gt;`;
        $("[data-cards]", el).innerHTML = Array.from({ length: n }, (_, i) => `<article class="vz-sc${pop && i === n - 1 ? " pop" : ""}"><span class="vz-av">A</span><b>Ahmad</b><span>Class X</span></article>`).join("");
        $("[data-note]", el).textContent = `1 komponen, dipakai ${n}×`;
        $("[data-add]", el).disabled = n >= 4;
      };
      draw();
      el.addEventListener("click", (e) => {
        if (e.target.closest("[data-add]") && n < 4) { n++; draw(true); }
        if (e.target.closest("[data-reset]")) { n = 1; draw(); }
      });
    },
  };

  /* ======================================================= Bab 03 */
  V.propsFlow = {
    title: "Props mengalir dari parent ke child",
    hint: "Ubah nilai di parent",
    cap: "Data dikirim <b>satu arah</b>: dari atas (parent) ke bawah (child). Child hanya <b>membaca</b> props. Kalau mau mengubah, ubah dari parent.",
    html: () => `<div class="vz-props">
      <div class="vz-box parent"><small>Parent: &lt;App /&gt;</small>
        ${[["Ahmad", "X"], ["Zaid", "XI"]].map(([n, g], i) => `<div class="vz-prow"><code>&lt;StudentCard name="</code><input type="text" maxlength="12" value="${n}" data-n="${i}" aria-label="Props name kartu ${i + 1}"><code>" grade="</code><select data-g="${i}" aria-label="Props grade kartu ${i + 1}">${["X", "XI", "XII"].map((o) => `<option${o === g ? " selected" : ""}>${o}</option>`).join("")}</select><code>" /&gt;</code></div>`).join("")}
      </div>
      <div class="vz-pipes" aria-hidden="true"><div class="vz-pipe" data-p="0"><span class="pkt">props ↓</span></div><div class="vz-pipe" data-p="1"><span class="pkt">props ↓</span></div></div>
      <div class="vz-kids">${[["Ahmad", "X"], ["Zaid", "XI"]].map(([n, g], i) => `<div class="vz-box kid" data-c="${i}"><small>Child: StudentCard 🔒</small><b data-cn>${n}</b><span data-cg>Class: ${g}</span><button type="button" class="vz-btn xs" data-edit>✏️ ubah dari child</button><span class="vz-err" data-err></span></div>`).join("")}</div>
    </div>`,
    mount(el) {
      const timers = [];
      const send = (i) => {
        flash($(`[data-p="${i}"]`, el), "send");
        timers.push(setTimeout(() => {
          const kid = $(`[data-c="${i}"]`, el);
          $("[data-cn]", kid).textContent = $(`[data-n="${i}"]`, el).value || "…";
          $("[data-cg]", kid).textContent = "Class: " + $(`[data-g="${i}"]`, el).value;
          $("[data-err]", kid).textContent = "";
          flash(kid);
        }, calm() ? 0 : 420));
      };
      el.addEventListener("input", (e) => { const t = e.target.closest("[data-n],[data-g]"); if (t) send(+(t.dataset.n ?? t.dataset.g)); });
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-edit]");
        if (!b) return;
        const kid = b.closest(".kid");
        shake(kid);
        $("[data-err]", kid).textContent = "❌ Props read-only! Ubah dari parent.";
      });
      return () => timers.forEach(clearTimeout);
    },
  };

  const STUDENTS = [[1, "Ahmad", "X"], [2, "Zaid", "XI"], [3, "Umar", "XII"], [4, "Bilal", "X"]];
  V.mapConveyor = {
    title: "map(): satu data → satu komponen",
    hint: "Tekan ▶ untuk mengulang",
    cap: "<code>map()</code> mengubah setiap item array menjadi satu <code>&lt;StudentCard /&gt;</code>. <code>key</code> adalah “nomor induk” supaya React tahu kartu mana milik data mana.",
    html: () => `<div class="vz-map">
      <div class="vz-box"><small>students (array)</small><ul class="vz-arr">${STUDENTS.map(([id, n, g], i) => `<li data-i="${i}"><code>{ id: ${id}, name: "${n}", grade: "${g}" }</code></li>`).join("")}</ul></div>
      <div class="vz-machine" data-mc><code>.map()</code><small>student =&gt; &lt;StudentCard key={student.id} /&gt;</small></div>
      <div class="vz-box"><small>Hasil di layar</small><div class="vz-cards" data-out></div></div>
    </div>
    <div class="vz-row"><button type="button" class="vz-btn primary" data-play>▶ Jalankan map()</button><span class="vz-note" data-note></span></div>`,
    mount(el) {
      const run = runner();
      let played = false;
      const play = async () => {
        const id = run.start();
        played = true;
        $("[data-out]", el).innerHTML = "";
        $("[data-note]", el).textContent = "";
        $$("[data-i]", el).forEach((li) => li.classList.remove("on", "done"));
        for (let i = 0; i < STUDENTS.length; i++) {
          const li = $(`[data-i="${i}"]`, el);
          li.classList.add("on"); flash($("[data-mc]", el));
          await sleep(520); if (!run.ok(id)) return;
          const [k, n, g] = STUDENTS[i];
          $("[data-out]", el).insertAdjacentHTML("beforeend", `<article class="vz-sc pop"><span class="vz-key">key={${k}}</span><span class="vz-av">${n[0]}</span><b>${n}</b><span>Class ${g}</span></article>`);
          li.classList.replace("on", "done");
          await sleep(200); if (!run.ok(id)) return;
        }
        $("[data-note]", el).textContent = `${STUDENTS.length} data → ${STUDENTS.length} kartu ✅`;
      };
      $("[data-play]", el).addEventListener("click", play);
      return watch(el, () => { if (!played) play(); }, run.stop);
    },
  };

  /* ======================================================= Bab 04 */
  V.renderCycle = {
    title: "Apa yang terjadi saat tombol diklik?",
    hint: "Klik Increase, lihat urutannya",
    cap: "Setiap kali state berubah, React memanggil ulang function komponen (<em>re-render</em>) dan memperbarui bagian layar yang berubah saja.",
    html: () => `<div class="vz-cycle">
      ${[["Kamu klik tombol", "onClick"], ["Minta ubah state", "setCount(c => c + 1)"], ["React render ulang", "Counter() dipanggil lagi"], ["Layar berubah", "count = 0"]].map(([b, c], i) => `<div class="vz-step" data-s="${i}"><i>${i + 1}</i><b>${b}</b><code${i === 3 ? " data-cc" : ""}>${esc(c)}</code></div>`).join("")}
    </div>
    <div class="vz-row"><button type="button" class="vz-btn primary" data-click>Increase</button><span class="vz-screen inline">Count: <b data-count>0</b></span></div>`,
    mount(el) {
      let count = 0, busy = false;
      const run = runner();
      const btn = $("[data-click]", el);
      btn.addEventListener("click", async () => {
        if (busy) return;
        busy = true; btn.disabled = true;
        const id = run.start();
        const steps = $$("[data-s]", el);
        steps.forEach((s) => s.classList.remove("on"));
        for (let i = 0; i < 4; i++) {
          steps[i].classList.add("on");
          if (i === 3) { count++; $("[data-cc]", el).textContent = `count = ${count}`; $("[data-count]", el).textContent = count; flash($("[data-count]", el)); }
          await sleep(380); if (!run.ok(id)) return;
          if (i < 3) steps[i].classList.remove("on");
        }
        busy = false; btn.disabled = false;
      });
      return run.stop;
    },
  };

  V.varVsState = {
    title: "Variabel biasa vs state",
    hint: "Klik +1 di kedua sisi",
    cap: "Variabel biasa memang berubah di memori, tapi React <b>tidak diberi tahu</b>, jadi layar diam. Setter dari <code>useState</code> memberi tahu React untuk render ulang.",
    html: () => `<div class="vz-vs">
      ${[["bad", "❌ let count = 0", "count++"], ["good", "✅ useState(0)", "setCount(c => c + 1)"]].map(([k, t, op]) => `<div class="vz-box ${k}" data-side="${k}"><small>${t}</small>
        <div class="vz-screen">Count: <b data-scr>0</b></div>
        <div class="vz-mem">nilai di memori: <code data-mem>0</code></div>
        <button type="button" class="vz-btn" data-inc>+1 <code>${esc(op)}</code></button>
        <p class="vz-note" data-msg></p></div>`).join("")}
    </div>`,
    mount(el) {
      const v = { bad: 0, good: 0 };
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-inc]");
        if (!b) return;
        const box = b.closest("[data-side]"), k = box.dataset.side;
        v[k]++;
        $("[data-mem]", box).textContent = v[k]; flash($("[data-mem]", box));
        if (k === "good") { $("[data-scr]", box).textContent = v[k]; flash($("[data-scr]", box)); $("[data-msg]", box).textContent = "✨ React diberi tahu → render ulang"; }
        else { shake($(".vz-screen", box)); $("[data-msg]", box).textContent = "😴 React tidak tahu → layar tetap 0"; }
      });
    },
  };

  /* ======================================================= Bab 05 */
  V.controlledLoop = {
    title: "Controlled input: lingkaran yang tidak putus",
    hint: "Ketik di kotak input",
    cap: "Setiap huruf yang diketik berjalan memutar: input → <code>onChange</code> → state → <code>value</code> → kembali ke input. Karena itu React selalu tahu isi form.",
    html: () => `<div class="vz-loop">
      <div class="vz-ln" data-l="0"><small>① Input</small><input type="text" maxlength="20" placeholder="Ketik nama…" data-inp aria-label="Coba ketik"></div>
      <span class="vz-arrow" aria-hidden="true"></span>
      <div class="vz-ln" data-l="1"><small>② Event</small><code>onChange</code></div>
      <span class="vz-arrow" aria-hidden="true"></span>
      <div class="vz-ln" data-l="2"><small>③ Setter</small><code>setName(event.target.value)</code></div>
      <span class="vz-arrow" aria-hidden="true"></span>
      <div class="vz-ln" data-l="3"><small>④ State</small><code data-st>name = ""</code></div>
      <div class="vz-back" data-l="4"><span>↩</span><code>value={name}</code> mengisi kotak input lagi</div>
    </div>
    <p class="vz-note" data-val>Ketik minimal 3 huruf.</p>`,
    mount(el) {
      const run = runner();
      const inp = $("[data-inp]", el);
      inp.addEventListener("input", async () => {
        const id = run.start();
        const v = inp.value;
        const nodes = $$("[data-l]", el);
        nodes.forEach((n) => n.classList.remove("on"));
        for (let i = 1; i <= 4; i++) {
          nodes[i].classList.add("on");
          if (i === 3) $("[data-st]", el).textContent = `name = "${v}"`;
          await sleep(120); if (!run.ok(id)) return;
          nodes[i].classList.remove("on");
        }
        flash(nodes[0]);
        const ok = v.trim().length >= 3;
        $("[data-val]", el).textContent = !v.trim() ? "⚠️ Name is required!" : ok ? `✅ Valid. Welcome, ${v.trim()}!` : "⚠️ Nama minimal 3 huruf.";
        $("[data-val]", el).className = "vz-note " + (ok ? "ok" : "warn");
      });
      return run.stop;
    },
  };

  /* ======================================================= Bab 06 */
  const NEW_TASKS = ["Belajar Props", "Kerjakan PR", "Latihan CRUD", "Baca dokumentasi", "Murojaah"];
  V.immutable = {
    title: "Kenapa harus array baru?",
    hint: "Bandingkan dua tombol",
    cap: "React membandingkan <b>array lama</b> dengan <b>array baru</b>. Kalau kamu mengubah array yang sama (<code>push</code>), React mengira tidak ada perubahan. Buat salinan baru dengan spread <code>[...tasks]</code>.",
    html: () => `<div class="vz-btns"><button type="button" class="vz-btn ok" data-do="good">✅ <code>setTasks([...tasks, baru])</code></button><button type="button" class="vz-btn bad" data-do="bad">❌ <code>tasks.push(baru); setTasks(tasks)</code></button><button type="button" class="vz-btn" data-do="reset">Reset</button></div>
    <div class="vz-imm">
      <div class="vz-box"><small>Memori: state <code>tasks</code></small><div data-mem></div></div>
      <div class="vz-box"><small>Layar</small><ul class="vz-ul" data-scr></ul></div>
    </div>
    <p class="vz-note" data-msg>Pilih salah satu tombol di atas.</p>`,
    mount(el) {
      let ref, mem, scr, old, k;
      const reset = () => { ref = 1; mem = ["Belajar JSX"]; scr = [...mem]; old = null; k = 0; };
      const arr = (items, r, cls = "") => `<div class="vz-array ${cls}"><span class="vz-ref">#${r}</span>[ ${items.map((t) => `<code>"${esc(t)}"</code>`).join(", ")} ]</div>`;
      const draw = () => {
        $("[data-mem]", el).innerHTML = (old ? arr(old.items, old.ref, "old") : "") + arr(mem, ref, "cur");
        $("[data-scr]", el).innerHTML = scr.map((t) => `<li>${esc(t)}</li>`).join("");
      };
      reset(); draw();
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-do]");
        if (!b) return;
        const msg = $("[data-msg]", el);
        if (b.dataset.do === "reset") { reset(); draw(); msg.textContent = "Pilih salah satu tombol di atas."; msg.className = "vz-note"; return; }
        if (mem.length >= 5) { reset(); }
        const t = NEW_TASKS[k++ % NEW_TASKS.length];
        if (b.dataset.do === "good") {
          old = { items: [...mem], ref };
          mem = [...mem, t]; ref++; scr = [...mem];
          draw(); flash($("[data-scr]", el));
          msg.textContent = `Array baru (#${ref}) ≠ array lama (#${ref - 1}) → React render ulang ✅`;
          msg.className = "vz-note ok";
        } else {
          old = null;
          mem.push(t);
          draw(); shake($("[data-scr]", el).parentElement);
          msg.textContent = `Masih array yang sama (#${ref}) → React mengira tidak berubah → layar tidak update 😴`;
          msg.className = "vz-note warn";
        }
      });
    },
  };

  V.liftState = {
    title: "Lifting state up: data turun, event naik",
    hint: "Tambah tugas dari TaskForm",
    cap: "<code>TaskForm</code> dan <code>TaskList</code> butuh data yang sama, jadi state <code>tasks</code> disimpan di parent. Form mengirim <b>callback naik</b>, list menerima <b>props turun</b>.",
    html: () => `<div class="vz-lift">
      <div class="vz-box parent" data-parent><small>Parent: TaskManager (pemilik state)</small><code data-st>tasks = [ ]</code></div>
      <div class="vz-lanes" aria-hidden="true">
        <div class="vz-lane up"><span class="pkt gold" data-up>onAddTask()</span><em>⬆ callback</em></div>
        <div class="vz-lane down"><span class="pkt blue" data-down>tasks</span><em>⬇ props</em></div>
      </div>
      <div class="vz-kids">
        <div class="vz-box kid"><small>Child: TaskForm</small><form class="vz-form" data-form><input type="text" maxlength="24" placeholder="Tugas baru…" aria-label="Tugas baru"><button type="submit" class="vz-btn primary">Add</button></form></div>
        <div class="vz-box kid" data-listbox><small>Child: TaskList</small><ul class="vz-ul" data-list><li class="muted">Belum ada tugas</li></ul></div>
      </div>
    </div>`,
    mount(el) {
      const run = runner();
      const tasks = [];
      $("[data-form]", el).addEventListener("submit", async (e) => {
        e.preventDefault();
        const inp = $("input", e.currentTarget), t = inp.value.trim();
        if (!t) { shake(inp); return; }
        inp.value = "";
        const id = run.start();
        $("[data-up]", el).textContent = `onAddTask("${t.length > 10 ? t.slice(0, 10) + "…" : t}")`;
        flash($("[data-up]", el), "fly"); await sleep(700); if (!run.ok(id)) return;
        tasks.push(t); if (tasks.length > 4) tasks.shift();
        $("[data-st]", el).textContent = `tasks = [ ${tasks.length} item ]`;
        flash($("[data-parent]", el)); await sleep(300); if (!run.ok(id)) return;
        flash($("[data-down]", el), "fly"); await sleep(700); if (!run.ok(id)) return;
        $("[data-list]", el).innerHTML = tasks.map((x, i) => `<li class="${i === tasks.length - 1 ? "pop" : ""}">${esc(x)}</li>`).join("");
        flash($("[data-listbox]", el));
      });
      return run.stop;
    },
  };

  /* ======================================================= Bab 07 */
  const USERS = ["Leanne Graham", "Ervin Howell", "Clementine Bauch"];
  V.fetchStates = {
    title: "Perjalanan data dari API ke layar",
    hint: "Coba versi berhasil & gagal",
    cap: "Komponen render dulu dengan <code>loading = true</code>. Setelah itu <code>useEffect</code> meminta data. Ketika jawaban datang, state diubah dan komponen render lagi: tampil data <b>atau</b> pesan error.",
    html: () => `<div class="vz-fetch">
      <ol class="vz-tl">
        ${[["Render pertama", "loading = true"], ["useEffect berjalan", 'fetch("/users")'], ["Menunggu server…", "await response"], ["Jawaban datang", "setUsers(data)"], ["Render lagi", "loading = false"]].map(([b, c], i) => `<li data-t="${i}"><b>${b}</b><code${i === 3 ? " data-t3" : ""}>${esc(c)}</code></li>`).join("")}
      </ol>
      <div class="vz-screen tall" data-scr><span class="muted">Tekan tombol Fetch ↓</span></div>
    </div>
    <div class="vz-row"><button type="button" class="vz-btn primary" data-go="ok">▶ Fetch (berhasil)</button><button type="button" class="vz-btn" data-go="fail">▶ Fetch (internet putus)</button></div>`,
    mount(el) {
      const run = runner();
      const scr = $("[data-scr]", el);
      el.addEventListener("click", async (e) => {
        const b = e.target.closest("[data-go]");
        if (!b) return;
        const ok = b.dataset.go === "ok";
        const id = run.start();
        const items = $$("[data-t]", el);
        items.forEach((x) => x.classList.remove("on", "done", "err"));
        $("[data-t3]", el).textContent = ok ? "setUsers(data)" : 'setError("Gagal memuat")';
        const step = async (i, ms) => { items[i].classList.add("on"); await sleep(ms); if (!run.ok(id)) return false; items[i].classList.replace("on", "done"); return true; };
        scr.innerHTML = `<span class="vz-spin" aria-hidden="true"></span><span class="muted">Loading users…</span>`;
        if (!(await step(0, 550)) || !(await step(1, 550)) || !(await step(2, 1100))) return;
        if (!ok) items[3].classList.add("err");
        if (!(await step(3, 550))) return;
        scr.innerHTML = ok
          ? `<ul class="vz-ul">${USERS.map((u) => `<li class="pop">👤 ${u}</li>`).join("")}</ul>`
          : `<p class="vz-note warn">⚠️ Gagal memuat data. Coba lagi.</p>`;
        flash(scr);
        await step(4, 400);
      });
      return run.stop;
    },
  };

  V.effectLife = {
    title: "Kapan useEffect berjalan?",
    hint: "Klik tombol berurutan, baca log-nya",
    cap: "Effect berjalan <b>setelah</b> render. Effect hanya diulang kalau isi <em>dependency array</em> berubah. Sebelum effect diulang (atau komponen hilang), <b>cleanup</b> dijalankan dulu.",
    html: () => `<div class="vz-eff">
      <pre class="vz-pre code"><span data-cl="effect">useEffect(() =&gt; {
  // ① effect: ambil data user
  loadUser(userId);
</span><span data-cl="cleanup">  return () =&gt; {
    // ③ cleanup: batalkan request lama
  };
</span><span data-cl="dep">}, [userId]); // ② dependency</span></pre>
      <div class="vz-box"><small>Log</small><ol class="vz-log" data-log><li class="muted">Komponen belum tampil.</li></ol></div>
    </div>
    <div class="vz-row">
      <button type="button" class="vz-btn primary" data-e="mount">Tampilkan komponen</button>
      <button type="button" class="vz-btn" data-e="dep" disabled>userId + 1</button>
      <button type="button" class="vz-btn" data-e="same" disabled>Render ulang (userId sama)</button>
    </div>`,
    mount(el) {
      let on = false, uid = 1, first = true;
      const log = (cls, txt) => {
        const ol = $("[data-log]", el);
        if (first) { ol.innerHTML = ""; first = false; }
        ol.insertAdjacentHTML("beforeend", `<li class="${cls} pop">${txt}</li>`);
        while (ol.children.length > 7) ol.firstElementChild.remove();
      };
      const hi = (k) => flash($(`[data-cl="${k}"]`, el), "hl");
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-e]");
        if (!b) return;
        const k = b.dataset.e;
        if (k === "mount") {
          if (!on) { on = true; uid = 1; log("r", `🖼️ render (userId = ${uid})`); log("e", `① effect jalan → ambil user ${uid}`); hi("effect"); }
          else { on = false; log("c", "③ cleanup → komponen hilang, request dibatalkan"); hi("cleanup"); }
        } else if (k === "dep") {
          uid++; log("r", `🖼️ render (userId = ${uid})`); log("c", `③ cleanup effect lama (user ${uid - 1})`); log("e", `① effect jalan → ambil user ${uid}`); hi("cleanup"); hi("dep");
        } else {
          log("r", `🖼️ render (userId = ${uid})`); log("s", "② dependency sama → effect dilewati"); hi("dep");
        }
        $('[data-e="mount"]', el).textContent = on ? "Sembunyikan komponen" : "Tampilkan komponen";
        $('[data-e="dep"]', el).disabled = !on;
        $('[data-e="same"]', el).disabled = !on;
      });
    },
  };

  /* ======================================================= Bab 08 */
  const PAGES = { "/": ["🏠", "Home", "Selamat datang di HSI-BS!"], "/students": ["👥", "Students", "Ahmad · Zaid · Umar"], "/about": ["ℹ️", "About", "Kelas IT angkatan 2026"] };
  V.spaVsMpa = {
    title: "Website biasa vs Single Page Application",
    hint: "Klik menu di kedua browser",
    cap: "Website biasa meminta <b>dokumen HTML baru</b> ke server setiap pindah halaman, jadi layar berkedip. SPA hanya <b>mengganti bagian konten</b>; navbar dan state tetap di tempatnya.",
    html: () => `<div class="vz-vs">${[["mpa", "Website biasa (multi-page)"], ["spa", "SPA dengan React Router"]].map(([k, t]) => `<div class="vz-browser" data-b="${k}"><small>${t}</small>
      <div class="vz-urlbar"><span class="vz-lights"><i></i><i></i><i></i></span><code data-url>sekolah.id/</code></div>
      <div class="vz-load" data-load></div>
      <div class="vz-page" data-pg><nav class="vz-nav">${Object.keys(PAGES).map((p) => `<button type="button" data-to="${p}" class="${p === "/" ? "on" : ""}">${PAGES[p][1]}</button>`).join("")}</nav><div class="vz-content" data-ct></div></div>
      <div class="vz-mem">HTML diunduh dari server: <b data-cnt>1</b>×</div></div>`).join("")}</div>`,
    mount(el) {
      const runs = { mpa: runner(), spa: runner() };
      const cnt = { mpa: 1, spa: 1 };
      const show = (br, p) => {
        const [ic, t, d] = PAGES[p];
        $("[data-ct]", br).innerHTML = `<b>${ic} ${t}</b><span>${d}</span>`;
        $("[data-url]", br).textContent = "sekolah.id" + p;
        $$("[data-to]", br).forEach((x) => x.classList.toggle("on", x.dataset.to === p));
      };
      $$("[data-b]", el).forEach((br) => show(br, "/"));
      el.addEventListener("click", async (e) => {
        const b = e.target.closest("[data-to]");
        if (!b) return;
        const br = b.closest("[data-b]"), k = br.dataset.b, p = b.dataset.to;
        const id = runs[k].start();
        if (k === "spa") { show(br, p); flash($("[data-ct]", br), "swap"); return; }
        br.classList.add("blank"); flash($("[data-load]", br), "go");
        $("[data-url]", br).textContent = "sekolah.id" + p;
        await sleep(900); if (!runs[k].ok(id)) return;
        cnt[k]++; $("[data-cnt]", br).textContent = cnt[k];
        show(br, p); br.classList.remove("blank");
      });
      return () => { runs.mpa.stop(); runs.spa.stop(); };
    },
  };

  const ROUTES = [["/", "&lt;Home /&gt;"], ["/students", "&lt;Students /&gt;"], ["/students/:id", "&lt;StudentDetail /&gt;"], ["*", "&lt;NotFound /&gt;"]];
  V.routeMatch = {
    title: "Router mencocokkan URL dengan halaman",
    hint: "Ketik URL atau klik contoh",
    cap: "React Router membaca URL lalu memilih <code>&lt;Route&gt;</code> yang cocok. Bagian <code>:id</code> adalah “slot” yang isinya bisa dibaca dengan <code>useParams()</code>.",
    html: () => `<div class="vz-route">
      <label class="vz-urlbar big"><span class="muted">localhost:5173</span><input type="text" value="/students/2" maxlength="30" spellcheck="false" aria-label="URL" data-url></label>
      <div class="vz-chips">${["/", "/students", "/students/1", "/students/7", "/kantin"].map((u) => `<button type="button" class="vz-chip" data-u="${u}"><code>${u}</code></button>`).join("")}</div>
      <div class="vz-rt">
        <ul class="vz-routes">${ROUTES.map(([p, c], i) => `<li data-r="${i}"><code>path="${p}"</code><span>→</span><code>${c}</code></li>`).join("")}</ul>
        <div class="vz-box" data-res></div>
      </div>
    </div>`,
    mount(el) {
      const inp = $("[data-url]", el);
      const match = () => {
        const u = ("/" + inp.value.trim().replace(/^\/+/, "")).replace(/\/+$/, "") || "/";
        let r = 3, params = null;
        if (u === "/") r = 0;
        else if (u === "/students") r = 1;
        else { const m = u.match(/^\/students\/([^/]+)$/); if (m) { r = 2; params = m[1]; } }
        $$("[data-r]", el).forEach((li) => li.classList.toggle("on", +li.dataset.r === r));
        const res = $("[data-res]", el);
        res.innerHTML = r === 2
          ? `<small>Yang tampil</small><b>👤 Detail siswa #${esc(params)}</b><code>useParams() → { id: "${esc(params)}" }</code>`
          : r === 3 ? `<small>Yang tampil</small><b>🚫 404: Halaman tidak ditemukan</b><code>path="*" menangkap URL lain</code>`
          : `<small>Yang tampil</small><b>${r ? "👥 Daftar siswa" : "🏠 Beranda"}</b><code>tanpa params</code>`;
        flash(res);
      };
      inp.addEventListener("input", match);
      el.addEventListener("click", (e) => { const b = e.target.closest("[data-u]"); if (b) { inp.value = b.dataset.u; match(); } });
      match();
    },
  };

  /* ======================================================= Bab 09 */
  V.storageCycle = {
    title: "State hilang saat refresh, localStorage tidak",
    hint: "Tambah catatan, lalu refresh",
    cap: "State hidup di memori, jadi hilang ketika halaman dimuat ulang. <code>localStorage</code> menyimpan <b>teks</b> di browser, jadi array harus dibungkus dulu dengan <code>JSON.stringify</code> dan dibuka lagi dengan <code>JSON.parse</code>.",
    html: () => `<div class="vz-store">
      <div class="vz-box" data-sbox><small>🧠 State (memori sementara)</small><ul class="vz-ul" data-state></ul></div>
      <div class="vz-mid" aria-hidden="true"><span data-s1>JSON.stringify →</span><span data-s2>← JSON.parse</span></div>
      <div class="vz-box drawer" data-dbox><small>🗄️ localStorage (laci browser)</small><code class="vz-raw" data-raw></code></div>
    </div>
    <form class="vz-row" data-form><input type="text" maxlength="20" placeholder="Catatan baru…" aria-label="Catatan baru"><button type="submit" class="vz-btn primary">Simpan</button><button type="button" class="vz-btn" data-refresh>🔄 Refresh halaman</button><label class="vz-tog"><input type="checkbox" checked data-use> pakai localStorage</label></form>
    <p class="vz-note" data-msg></p>`,
    mount(el) {
      const run = runner();
      let state = [{ id: 1, text: "Belajar useState" }], raw = JSON.stringify(state), nid = 2;
      const use = () => $("[data-use]", el).checked;
      const draw = () => {
        $("[data-state]", el).innerHTML = state.length ? state.map((n) => `<li>📝 ${esc(n.text)}</li>`).join("") : `<li class="muted">(kosong)</li>`;
        $("[data-raw]", el).textContent = raw === null ? "null" : `"${raw}"`;
      };
      draw();
      $("[data-form]", el).addEventListener("submit", (e) => {
        e.preventDefault();
        const inp = $('input[type="text"]', e.currentTarget), t = inp.value.trim();
        if (!t) { shake(inp); return; }
        inp.value = "";
        state = [...state, { id: nid++, text: t }].slice(-4);
        if (use()) { raw = JSON.stringify(state); flash($("[data-s1]", el), "go"); flash($("[data-dbox]", el)); }
        draw(); flash($("[data-sbox]", el));
        $("[data-msg]", el).textContent = use() ? "Tersimpan di state dan di localStorage." : "Tersimpan di state saja.";
        $("[data-msg]", el).className = "vz-note";
      });
      $("[data-refresh]", el).addEventListener("click", async () => {
        const id = run.start();
        state = []; draw();
        const box = $("[data-sbox]", el);
        box.classList.add("blank");
        await sleep(700); if (!run.ok(id)) return;
        box.classList.remove("blank");
        const msg = $("[data-msg]", el);
        if (use() && raw) {
          flash($("[data-s2]", el), "go"); await sleep(350); if (!run.ok(id)) return;
          state = JSON.parse(raw); draw(); flash(box);
          msg.textContent = "✅ Data kembali, dibaca dari localStorage."; msg.className = "vz-note ok";
        } else {
          msg.textContent = "😱 Data hilang! Tanpa localStorage, state mulai dari awal lagi."; msg.className = "vz-note warn";
        }
      });
      return run.stop;
    },
  };

  /* ======================================================= Bab 10 */
  const TW = [
    ["p-6", "jarak dalam 1.5rem"], ["rounded-2xl", "sudut membulat"], ["shadow-lg", "bayangan"], ["bg-amber-100", "latar kuning muda"],
    ["border", "garis tepi"], ["text-2xl", "judul lebih besar"], ["font-bold", "huruf tebal"], ["text-blue-700", "judul biru"],
  ];
  V.utilityAnatomy = {
    title: "Utility class: satu class, satu tugas",
    hint: "Matikan / nyalakan class",
    cap: "Tailwind seperti kotak bumbu: setiap class hanya melakukan <b>satu hal kecil</b>. Gabungkan beberapa class untuk membentuk desain.",
    html: () => `<div class="vz-tw">
      <div class="vz-chips">${TW.map(([c, d]) => `<button type="button" class="vz-chip on" data-c="${c}" title="${d}"><code>${c}</code></button>`).join("")}</div>
      <pre class="vz-pre" data-cls></pre>
      <div class="vz-screen light"><div class="vz-twcard" data-card><h3 data-h>Welcome, Ahmad!</h3><p>Kelas X · Web Development</p></div></div>
      <p class="vz-note" data-tip>Arahkan kursor ke class untuk melihat fungsinya.</p>
    </div>`,
    mount(el) {
      const on = new Set(TW.map((t) => t[0]));
      const draw = () => {
        const c = $("[data-card]", el).style, h = $("[data-h]", el).style;
        c.padding = on.has("p-6") ? "1.5rem" : "0";
        c.borderRadius = on.has("rounded-2xl") ? "1rem" : "0";
        c.boxShadow = on.has("shadow-lg") ? "0 10px 15px -3px rgba(0,0,0,.12), 0 4px 6px -4px rgba(0,0,0,.1)" : "none";
        c.background = on.has("bg-amber-100") ? "#fef3c7" : "transparent";
        c.border = on.has("border") ? "1px solid #e5e7eb" : "1px solid transparent";
        h.fontSize = on.has("text-2xl") ? "1.5rem" : "1rem";
        h.fontWeight = on.has("font-bold") ? "700" : "400";
        h.color = on.has("text-blue-700") ? "#1d4ed8" : "inherit";
        $("[data-cls]", el).textContent = `<div className="${TW.map((t) => t[0]).filter((x) => on.has(x) && !x.startsWith("text-") && x !== "font-bold").join(" ")}">\n  <h3 className="${TW.map((t) => t[0]).filter((x) => on.has(x) && (x.startsWith("text-") || x === "font-bold")).join(" ")}">…</h3>`;
      };
      draw();
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-c]");
        if (!b) return;
        const c = b.dataset.c;
        on.has(c) ? on.delete(c) : on.add(c);
        b.classList.toggle("on", on.has(c));
        draw(); flash($("[data-card]", el));
      });
      const tip = (e) => { const b = e.target.closest("[data-c]"); if (b) $("[data-tip]", el).innerHTML = `<code>${b.dataset.c}</code> → ${esc(b.title)}`; };
      el.addEventListener("mouseover", tip); el.addEventListener("focusin", tip);
    },
  };

  /* ======================================================= Bab 11 */
  const CHS = [[2, "Components"], [3, "Props & map()"], [4, "useState"], [5, "Forms"], [6, "CRUD"], [7, "API"], [8, "Router"], [9, "localStorage"], [10, "Tailwind"]];
  const FEATS = [["🏠", "Dashboard Home", [2, 3, 10]], ["👥", "Student Directory", [3, 4, 5, 8]], ["✅", "Task Management", [4, 5, 6, 9]], ["📊", "Statistics", [3, 6, 10]], ["🧭", "Navigation", [8]], ["🌐", "Data dari API (bonus)", [7]], ["📱", "Responsive Design", [10]]];
  V.projectMap = {
    title: "Final project = gabungan semua bab",
    hint: "Ketuk bab atau fitur",
    cap: "Tidak ada materi baru di sini. Setiap fitur dashboard memakai ilmu dari bab-bab sebelumnya. Kalau bingung, buka lagi bab yang menyala.",
    html: () => `<div class="vz-pm">
      <div class="vz-chips">${CHS.map(([n, t]) => `<button type="button" class="vz-chip" data-ch="${n}"><b>${String(n).padStart(2, "0")}</b> ${t}</button>`).join("")}</div>
      <div class="vz-feats">${FEATS.map(([ic, t, chs], i) => `<button type="button" class="vz-feat" data-f="${i}"><span>${ic}</span><b>${t}</b><small>Bab ${chs.map((c) => String(c).padStart(2, "0")).join(", ")}</small></button>`).join("")}</div>
    </div>`,
    mount(el) {
      let timer = null, i = 0, pauseUntil = 0;
      const byCh = (n) => { $$("[data-ch]", el).forEach((c) => c.classList.toggle("on", +c.dataset.ch === n)); $$("[data-f]", el).forEach((f) => f.classList.toggle("on", FEATS[+f.dataset.f][2].includes(n))); };
      const byF = (k) => { $$("[data-f]", el).forEach((f) => f.classList.toggle("on", +f.dataset.f === k)); $$("[data-ch]", el).forEach((c) => c.classList.toggle("on", FEATS[k][2].includes(+c.dataset.ch))); };
      const pick = (e) => {
        const c = e.target.closest("[data-ch]"), f = e.target.closest("[data-f]");
        if (!c && !f) return;
        pauseUntil = Date.now() + 6000;
        c ? byCh(+c.dataset.ch) : byF(+f.dataset.f);
      };
      el.addEventListener("click", pick); el.addEventListener("mouseover", pick); el.addEventListener("focusin", pick);
      byF(0);
      const tick = () => { if (Date.now() < pauseUntil) return; i = (i + 1) % FEATS.length; byF(i); };
      return watch(el, () => { if (!timer && !calm()) timer = setInterval(tick, 1800); }, () => { clearInterval(timer); timer = null; });
    },
  };

  /* ======================================================= Bab 12 */
  const SRC = ["main.jsx", "App.jsx", "components/Navbar.jsx", "components/StatCard.jsx", "pages/Home.jsx", "pages/Students.jsx", "hooks/useLocalStorage.js", "index.css"];
  const DIST = [["index.html", "0.46 kB"], ["assets/index-Bx3k.css", "12.10 kB"], ["assets/index-Dq7f.js", "198.32 kB"]];
  V.buildShrink = {
    title: "npm run build: banyak file → sedikit file siap online",
    hint: "Tekan tombol build",
    cap: "Saat development, kode kita tersebar di banyak file <code>.jsx</code>. Build menggabung, mengecilkan, dan mengubahnya menjadi file biasa yang dimengerti browser di folder <code>dist/</code>. Folder inilah yang di-upload ke hosting.",
    html: () => `<div class="vz-build">
      <div class="vz-box"><small>📁 src/ (kode kamu)</small><ul class="vz-files" data-src>${SRC.map((f) => `<li>${f}</li>`).join("")}</ul></div>
      <div class="vz-machine" data-mc><code>Vite build</code><small>gabung · kecilkan · ubah JSX</small></div>
      <div class="vz-box"><small>📦 dist/ (siap online)</small><ul class="vz-files out" data-dist><li class="muted">(belum ada)</li></ul></div>
    </div>
    <div class="vz-row"><button type="button" class="vz-btn primary" data-build>▶ npm run build</button><span class="vz-note" data-msg></span></div>`,
    mount(el) {
      const run = runner();
      $("[data-build]", el).addEventListener("click", async () => {
        const id = run.start();
        const src = $$("[data-src] li", el);
        src.forEach((li) => li.classList.remove("gone"));
        $("[data-dist]", el).innerHTML = "";
        $("[data-msg]", el).textContent = "building…";
        $("[data-mc]", el).classList.add("busy");
        for (const li of src) { li.classList.add("gone"); await sleep(140); if (!run.ok(id)) return; }
        for (const [f, s] of DIST) {
          $("[data-dist]", el).insertAdjacentHTML("beforeend", `<li class="pop">${f}<span>${s}</span></li>`);
          await sleep(320); if (!run.ok(id)) return;
        }
        $("[data-mc]", el).classList.remove("busy");
        $("[data-msg]", el).textContent = "✓ built — siap di-deploy";
      });
      return () => { run.stop(); };
    },
  };

  /* ======================================================= API */
  function render(key) {
    const v = V[key];
    if (!v) return "";
    return `<figure class="viz" data-viz="${key}">
      <div class="viz-head"><span class="viz-tag">✨ Ilustrasi</span><b>${v.title}</b>${v.hint ? `<span class="viz-hint">${v.hint}</span>` : ""}</div>
      <div class="viz-body">${v.html()}</div>
      ${v.cap ? `<figcaption>${v.cap}</figcaption>` : ""}
    </figure>`;
  }
  function mount(root) {
    const fns = [];
    $$("[data-viz]", root).forEach((el) => {
      const v = V[el.dataset.viz];
      if (!v) return;
      fns.push(watch(el, () => el.classList.add("live"), () => el.classList.remove("live")));
      try { const f = v.mount && v.mount(el); if (typeof f === "function") fns.push(f); } catch (err) { console.error(err); }
    });
    return () => fns.forEach((f) => f());
  }
  return { render, mount, has: (k) => !!V[k] };
}
const VISUALS = createVisuals();

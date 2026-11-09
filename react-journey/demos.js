/* ==========================================================
   HSI-BS React Journey — Live demos
   Vanilla JS yang meniru perilaku komponen React.
   createDemos(helpers) → { counter, compose, ... }
   ========================================================== */
function createDemos(H) {
  "use strict";
  const { $, $$, esc, pad, icons, store, toast, avatar, checkItem } = H;
  const shell = (title, icon, inner) =>
    `<div class="demo"><div class="demo-bar"><i data-lucide="${icon}"></i> ${title}<span class="live">Live</span></div><div class="demo-body">${inner}</div></div>`;
  const flash = (el) => { el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash"); };
  const STUDENTS = [
    { id: 1, name: "Ahmad", grade: "X", skill: "React", isActive: true },
    { id: 2, name: "Zaid", grade: "XI", skill: "Node.js", isActive: true },
    { id: 3, name: "Umar", grade: "XII", skill: "UI Design", isActive: false },
    { id: 4, name: "Bilal", grade: "X", skill: "CSS", isActive: true },
    { id: 5, name: "Hamzah", grade: "XI", skill: "JavaScript", isActive: false },
    { id: 6, name: "Fatih", grade: "X", skill: "Python", isActive: true },
  ];
  const studentCard = (s, i) => `<div class="mini-card"><span class="avatar">${avatar(i)}</span><div class="grow"><b>${esc(s.name)}</b><span>Class ${esc(s.grade)} · ${esc(s.skill)}</span></div>${s.isActive === undefined ? "" : `<span class="badge ${s.isActive ? "on" : "off"}">${s.isActive ? "🟢 Active" : "🔴 Inactive"}</span>`}</div>`;

  const DEMOS = {
    /* 01 — Counter */
    counter(el) {
      let count = 0, renders = 1;
      el.innerHTML = shell("Counter — UI = Function of State", "zap", `
        <div class="demo-split">
          <div class="ui-box center" data-ui><span class="tag">&lt;Counter /&gt;</span>
            <div class="big-count" data-cnt>0</div>
            <div class="row"><button class="btn btn-primary btn-sm" data-a="inc"><i data-lucide="plus"></i> Increase</button>
            <button class="btn btn-ghost btn-sm" data-a="reset"><i data-lucide="rotate-ccw"></i> Reset</button></div>
          </div>
          <div class="state-box" data-state></div>
        </div>
        <p class="demo-note"><i data-lucide="info"></i> Setiap klik memanggil <code>setCount</code> → React me-render ulang komponen → UI mengikuti state. Kita tidak menyentuh DOM secara manual seperti di Vanilla JS.</p>`);
      const draw = () => {
        $("[data-cnt]", el).textContent = count;
        $("[data-state]", el).innerHTML = `<span class="lbl">state & render</span>const [count, setCount] = useState(0);\n\ncount   → <span class="hl">${count}</span>\nrender  → #<span class="hl">${renders}</span>\n\n// UI = f(state)`;
        flash($("[data-ui]", el));
      };
      el.addEventListener("click", (e) => {
        const a = e.target.closest("[data-a]")?.dataset.a;
        if (!a) return;
        count = a === "inc" ? count + 1 : 0;
        renders++;
        draw();
      });
      draw();
    },

    /* 02 — Composition */
    compose(el) {
      let parts = ["Header", "StudentCard", "StudentCard", "Footer"];
      el.innerHTML = shell("Component Composition Playground", "puzzle", `
        <div class="row"><b class="small">Tambahkan:</b>
          <button class="btn btn-ghost btn-sm" data-add="Header">&lt;Header /&gt;</button>
          <button class="btn btn-ghost btn-sm" data-add="StudentCard">&lt;StudentCard /&gt;</button>
          <button class="btn btn-ghost btn-sm" data-add="Footer">&lt;Footer /&gt;</button>
          <button class="btn btn-ghost btn-sm" data-add="reset"><i data-lucide="rotate-ccw"></i></button></div>
        <div class="demo-split">
          <div class="ui-box"><span class="tag">Preview</span><div class="list" data-prev></div></div>
          <div class="state-box" data-code></div>
        </div>
        <p class="demo-note"><i data-lucide="info"></i> Klik komponen di preview untuk menghapusnya. Satu komponen bisa dipakai berkali-kali — <b>Build small, combine later.</b></p>`);
      const draw = () => {
        const prev = $("[data-prev]", el);
        prev.innerHTML = parts.length ? parts.map((p, i) => {
          if (p === "Header") return `<div class="mini-card" data-rm="${i}" style="background:var(--navy);color:#fff;cursor:pointer"><i data-lucide="school"></i><b>Student Directory</b></div>`;
          if (p === "Footer") return `<div class="mini-card" data-rm="${i}" style="cursor:pointer;justify-content:center"><span>© HSI Boarding School</span></div>`;
          return `<div data-rm="${i}" style="cursor:pointer">${studentCard({ name: "Ahmad", grade: "X", skill: "Web Development Student" }, 0)}</div>`;
        }).join("") : `<div class="empty"><i data-lucide="layers"></i>Belum ada komponen. Tambahkan dari tombol di atas.</div>`;
        const n = parts.filter((p) => p === "StudentCard").length;
        $("[data-code]", el).innerHTML = `<span class="lbl">App.jsx</span>function App() {\n  return (\n    &lt;main&gt;\n${parts.map((p) => `      <span class="hl">&lt;${p} /&gt;</span>`).join("\n")}\n    &lt;/main&gt;\n  );\n}\n\n// StudentCard dipakai ${n}×`;
        icons();
      };
      el.addEventListener("click", (e) => {
        const add = e.target.closest("[data-add]");
        if (add) { parts = add.dataset.add === "reset" ? ["Header", "StudentCard", "StudentCard", "Footer"] : [...parts, add.dataset.add]; draw(); return; }
        const rm = e.target.closest("[data-rm]");
        if (rm) { const i = +rm.dataset.rm; parts = parts.filter((_, j) => j !== i); draw(); }
      });
      draw();
    },

    /* 03 — Props & list */
    props(el) {
      const p = { name: "Ahmad", grade: "X", skill: "React", isActive: true };
      let onlyX = false, sorted = false;
      el.innerHTML = shell("Props Playground & Student Directory", "users", `
        <div class="demo-split">
          <div style="display:grid;gap:.6rem">
            <label>name<input type="text" data-p="name" value="Ahmad" maxlength="20"></label>
            <div class="row">
              <label style="flex:1">grade<select data-p="grade"><option>X</option><option>XI</option><option>XII</option></select></label>
              <label style="flex:1">skill<input type="text" data-p="skill" value="React" maxlength="20"></label>
            </div>
            <label class="toggle"><input type="checkbox" data-p="isActive" checked> isActive</label>
          </div>
          <div style="display:grid;gap:.6rem;align-content:start">
            <div class="ui-box"><span class="tag">&lt;StudentCard /&gt;</span><div data-card></div></div>
            <div class="state-box" data-jsx></div>
          </div>
        </div>
        <hr style="border:0;border-top:1px dashed var(--line-2);width:100%">
        <div class="row" style="justify-content:space-between">
          <div class="row"><label class="toggle"><input type="checkbox" data-f="x"> Hanya kelas X</label><label class="toggle"><input type="checkbox" data-f="sort"> Urutkan nama</label></div>
          <b class="small" data-total></b>
        </div>
        <div class="state-box" data-expr style="max-height:none"></div>
        <div class="grid-cards" data-list></div>`);
      const draw = () => {
        $("[data-card]", el).innerHTML = studentCard(p, 1);
        $("[data-jsx]", el).innerHTML = `<span class="lbl">JSX (parent → child)</span>&lt;StudentCard\n  name=<span class="hl">"${esc(p.name)}"</span>\n  grade=<span class="hl">"${esc(p.grade)}"</span>\n  skill=<span class="hl">"${esc(p.skill)}"</span>\n  isActive={<span class="hl">${p.isActive}</span>}\n/&gt;`;
        let list = STUDENTS;
        if (onlyX) list = list.filter((s) => s.grade === "X");
        if (sorted) list = [...list].sort((a, b) => a.name.localeCompare(b.name));
        $("[data-total]", el).textContent = `Menampilkan ${list.length} dari ${STUDENTS.length} siswa`;
        $("[data-expr]", el).innerHTML = `<span class="lbl">expression</span>{students${onlyX ? `\n  .filter((s) => s.grade === <span class="hl">"X"</span>)` : ""}${sorted ? `\n  .sort((a, b) => a.name.localeCompare(b.name))` : ""}\n  .map((student) => (\n    &lt;StudentCard <span class="hl">key={student.id}</span> {...student} /&gt;\n  ))}`;
        $("[data-list]", el).innerHTML = list.map((s) => studentCard(s, s.id)).join("");
      };
      el.addEventListener("input", (e) => {
        const k = e.target.dataset.p;
        if (k) { p[k] = e.target.type === "checkbox" ? e.target.checked : e.target.value; draw(); }
        if (e.target.dataset.f === "x") { onlyX = e.target.checked; draw(); }
        if (e.target.dataset.f === "sort") { sorted = e.target.checked; draw(); }
      });
      draw();
    },

    /* 04 — Voting */
    voting(el) {
      let votes = [0, 0];
      const names = ["Ahmad", "Zaid"];
      el.innerHTML = shell("Student Voting App", "zap", `
        <div class="cands">${names.map((n, i) => `
          <div class="cand" data-cand="${i}"><span class="avatar">${avatar(i + 1)}</span><b>${n}</b>
            <div class="votes" data-v="${i}">0</div>
            <div class="row" style="justify-content:center"><button class="btn btn-primary btn-sm" data-vote="${i}" data-d="1"><i data-lucide="plus"></i> Vote</button>
            <button class="btn btn-ghost btn-sm" data-vote="${i}" data-d="-1" aria-label="Kurangi vote"><i data-lucide="minus"></i></button></div>
          </div>`).join("")}</div>
        <div class="vote-bar"><i data-bar="0"></i><i data-bar="1"></i></div>
        <div class="row" style="justify-content:space-between"><b data-status></b><button class="btn btn-ghost btn-sm" data-reset><i data-lucide="rotate-ccw"></i> Reset Vote</button></div>
        <div class="state-box" data-state></div>`);
      const draw = () => {
        const total = votes[0] + votes[1];
        votes.forEach((v, i) => {
          $(`[data-v="${i}"]`, el).textContent = v;
          $(`[data-bar="${i}"]`, el).style.width = total ? (v / total) * 100 + "%" : "50%";
          $(`[data-cand="${i}"]`, el).classList.toggle("lead", v > votes[1 - i]);
        });
        $("[data-status]", el).textContent = total === 0 ? "Total vote: 0 — belum ada suara" : votes[0] === votes[1] ? `Total vote: ${total} · ⚖️ Skor sama!` : `Total vote: ${total} · Unggul: ${names[votes[0] > votes[1] ? 0 : 1]}`;
        $("[data-state]", el).innerHTML = `<span class="lbl">state</span>const [votes, setVotes] = useState([0, 0]);\nvotes → [<span class="hl">${votes.join(", ")}</span>]\n\n// update berdasarkan nilai sebelumnya & tidak boleh negatif\nsetVotes((prev) => prev.map((v, i) =>\n  i === index ? Math.max(0, v + delta) : v\n));`;
      };
      el.addEventListener("click", (e) => {
        const b = e.target.closest("[data-vote]");
        if (b) {
          const i = +b.dataset.vote, d = +b.dataset.d;
          if (d < 0 && votes[i] === 0) toast("Nilai vote tidak boleh negatif 🙅");
          votes = votes.map((v, j) => (j === i ? Math.max(0, v + d) : v));
          draw();
        }
        if (e.target.closest("[data-reset]")) { votes = [0, 0]; draw(); }
      });
      draw();
    },

    /* 05 — Registration form */
    form(el) {
      const empty = { fullName: "", grade: "", email: "", language: "", motivation: "" };
      let form = { ...empty };
      el.innerHTML = shell("Student Registration Form", "clipboard-list", `
        <div class="demo-split">
          <form data-form novalidate style="display:grid;gap:.55rem">
            <label>Full Name<input type="text" name="fullName" placeholder="mis. Ahmad Fauzan"><span class="err" data-err="fullName"></span></label>
            <label>Class<select name="grade"><option value="">— Pilih kelas —</option><option>X</option><option>XI</option><option>XII</option></select><span class="err" data-err="grade"></span></label>
            <label>Email<input type="email" name="email" placeholder="nama@email.com"><span class="err" data-err="email"></span></label>
            <label>Favorite Programming Language<select name="language"><option value="">— Pilih bahasa —</option><option>JavaScript</option><option>Python</option><option>PHP</option><option>Dart</option><option>Go</option></select><span class="err" data-err="language"></span></label>
            <label>Motivation to Learn Coding<textarea name="motivation" rows="2" placeholder="Kenapa ingin belajar coding?"></textarea><span class="err" data-err="motivation"></span></label>
            <div class="row"><button class="btn btn-primary btn-sm" type="submit"><i data-lucide="check"></i> Submit</button><button class="btn btn-ghost btn-sm" type="button" data-reset><i data-lucide="rotate-ccw"></i> Reset</button></div>
          </form>
          <div style="display:grid;gap:.8rem;align-content:start">
            <div class="state-box" data-state></div>
            <div data-result></div>
          </div>
        </div>`);
      const f = $("[data-form]", el);
      const drawState = () => {
        $("[data-state]", el).innerHTML = `<span class="lbl">controlled state (live)</span>` +
          Object.entries(form).map(([k, v]) => `${k}: <span class="hl">"${esc(v)}"</span>`).join("\n");
      };
      const validate = () => {
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Nama wajib diisi.";
        else if (form.fullName.trim().length < 3) e.fullName = "Nama minimal tiga karakter.";
        if (!form.grade) e.grade = "Pilih kelas.";
        if (!form.email.trim()) e.email = "Email wajib diisi.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Format email tidak valid.";
        if (!form.language) e.language = "Pilih bahasa favorit.";
        if (!form.motivation.trim()) e.motivation = "Motivasi wajib diisi.";
        return e;
      };
      f.addEventListener("input", (e) => {
        if (!e.target.name) return;
        form = { ...form, [e.target.name]: e.target.value };
        e.target.classList.remove("invalid");
        $(`[data-err="${e.target.name}"]`, el).textContent = "";
        drawState();
      });
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const errs = validate();
        Object.keys(empty).forEach((k) => {
          $(`[data-err="${k}"]`, el).textContent = errs[k] || "";
          f.elements[k].classList.toggle("invalid", !!errs[k]);
        });
        if (Object.keys(errs).length) { $("[data-result]", el).innerHTML = ""; return; }
        $("[data-result]", el).innerHTML = `<div class="ui-box"><span class="tag">Registered ✓</span>${studentCard({ name: form.fullName, grade: form.grade, skill: form.language, isActive: true }, 2)}<p class="small" style="margin:.6rem 0 0;color:var(--ink-2)">📧 ${esc(form.email)}<br>💬 “${esc(form.motivation)}”</p></div>`;
        toast(`Welcome, ${form.fullName}! 🎉`);
      });
      $("[data-reset]", el).addEventListener("click", () => {
        form = { ...empty }; f.reset();
        $$(".err", el).forEach((x) => (x.textContent = ""));
        $$(".invalid", el).forEach((x) => x.classList.remove("invalid"));
        $("[data-result]", el).innerHTML = "";
        drawState();
      });
      drawState();
    },

    /* 06 — Task manager CRUD */
    tasks(el) {
      let uid = 3;
      let tasks = [
        { id: 1, title: "Murojaah materi JSX", priority: "medium", completed: true },
        { id: 2, title: "Kerjakan challenge Props", priority: "high", completed: false },
      ];
      let filter = "all", editing = null;
      el.innerHTML = shell("Student Task Manager (CRUD)", "list-checks", `
        <form class="row" data-add>
          <input type="text" name="title" placeholder="Tugas baru…" maxlength="60" aria-label="Judul tugas">
          <select name="priority" aria-label="Priority" style="flex:0 0 auto;width:auto"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select>
          <button class="btn btn-primary btn-sm" type="submit"><i data-lucide="plus"></i> Add</button>
        </form>
        <div class="row" style="justify-content:space-between">
          <div class="seg" data-filter><button data-f="all">All</button><button data-f="active">Active</button><button data-f="completed">Completed</button></div>
          <b class="small" data-counter></b>
        </div>
        <div class="list" data-list></div>
        <div class="state-box" data-state></div>`);
      const draw = () => {
        const shown = tasks.filter((t) => (filter === "all" ? true : filter === "active" ? !t.completed : t.completed));
        $$("[data-f]", el).forEach((b) => b.classList.toggle("active", b.dataset.f === filter));
        $("[data-counter]", el).textContent = `✅ ${tasks.filter((t) => t.completed).length} dari ${tasks.length} selesai`;
        $("[data-list]", el).innerHTML = shown.length ? shown.map((t) => `
          <div class="item${t.completed ? " completed" : ""}">
            <button class="ibtn${t.completed ? " ok" : ""}" data-toggle="${t.id}" aria-label="${t.completed ? "Undo" : "Complete"}"><i data-lucide="check"></i></button>
            <div class="grow">${editing === t.id ? `<input type="text" data-edit-input="${t.id}" value="${esc(t.title)}" maxlength="60">` : `<span class="title">${esc(t.title)}</span>`}</div>
            <span class="badge ${t.priority}">${t.priority}</span>
            ${editing === t.id ? `<button class="ibtn ok" data-save="${t.id}" aria-label="Simpan"><i data-lucide="save"></i></button>` : `<button class="ibtn" data-edit="${t.id}" aria-label="Edit"><i data-lucide="pencil"></i></button>`}
            <button class="ibtn danger" data-del="${t.id}" aria-label="Delete"><i data-lucide="trash-2"></i></button>
          </div>`).join("") : `<div class="empty"><i data-lucide="clipboard-list"></i>${tasks.length ? "Tidak ada tugas pada filter ini." : "Belum ada tugas. Yuk tambahkan tugas pertama!"}</div>`;
        $("[data-state]", el).innerHTML = `<span class="lbl">tasks state (immutable updates)</span>${esc(JSON.stringify(tasks, null, 1))}`;
        icons();
        const inp = $("[data-edit-input]", el);
        if (inp) { inp.focus(); inp.select(); }
      };
      const save = (id) => {
        const v = $(`[data-edit-input="${id}"]`, el).value.trim();
        if (v) tasks = tasks.map((t) => (t.id === id ? { ...t, title: v } : t));
        editing = null; draw();
      };
      $("[data-add]", el).addEventListener("submit", (e) => {
        e.preventDefault();
        const title = e.target.title.value.trim();
        if (!title) { toast("Judul tugas tidak boleh kosong"); return; }
        tasks = [...tasks, { id: uid++, title, priority: e.target.priority.value, completed: false }];
        e.target.title.value = "";
        draw();
      });
      el.addEventListener("click", (e) => {
        const t = e.target.closest("button");
        if (!t) return;
        if (t.dataset.f) { filter = t.dataset.f; draw(); }
        if (t.dataset.toggle) { const id = +t.dataset.toggle; tasks = tasks.map((x) => (x.id === id ? { ...x, completed: !x.completed } : x)); draw(); }
        if (t.dataset.del) { const id = +t.dataset.del; tasks = tasks.filter((x) => x.id !== id); draw(); }
        if (t.dataset.edit) { editing = +t.dataset.edit; draw(); }
        if (t.dataset.save) save(+t.dataset.save);
      });
      el.addEventListener("keydown", (e) => {
        if (e.target.dataset.editInput && e.key === "Enter") save(+e.target.dataset.editInput);
        if (e.target.dataset.editInput && e.key === "Escape") { editing = null; draw(); }
      });
      draw();
    },

    /* 07 — API explorer */
    api(el) {
      let users = [], status = "idle", error = "", query = "", fail = false, controller = null;
      const timers = [];
      el.innerHTML = shell("Public API Explorer — JSONPlaceholder", "globe", `
        <div class="flow" data-flow>${["React App", "HTTP Request", "Public API", "JSON Response", "React State", "Rendered UI"].map((n, i) => `${i ? '<i data-lucide="arrow-right" class="flow-arrow"></i>' : ""}<span class="flow-node${i % 2 ? " edge" : ""}">${n}</span>`).join("")}</div>
        <div class="row" style="justify-content:space-between">
          <div class="row"><button class="btn btn-primary btn-sm" data-fetch><i data-lucide="refresh-cw"></i> Fetch / Refresh</button>
          <label class="toggle"><input type="checkbox" data-fail> Simulasikan koneksi gagal</label></div>
          <b class="small" data-count></b>
        </div>
        <label class="search" style="margin:0;max-width:none"><i data-lucide="search"></i><input type="search" data-q placeholder="Cari nama atau kota…"></label>
        <div data-out></div>`);
      const light = (n) => $$(".flow-node", el).forEach((x, i) => x.classList.toggle("lit", i < n));
      const draw = () => {
        const out = $("[data-out]", el);
        const shown = users.filter((u) => (u.name + " " + u.address.city).toLowerCase().includes(query.toLowerCase()));
        $("[data-count]", el).textContent = status === "success" ? `${shown.length} dari ${users.length} data` : "";
        if (status === "idle") out.innerHTML = `<div class="empty"><i data-lucide="globe"></i>Klik <b>Fetch</b> untuk mengambil data users dari API.</div>`;
        else if (status === "loading") out.innerHTML = `<div class="empty"><div class="spinner"></div>Loading...</div>`;
        else if (status === "error") out.innerHTML = `<div class="err-box"><i data-lucide="circle-alert"></i> Error: ${esc(error)} — periksa koneksi lalu klik Refresh.</div>`;
        else out.innerHTML = shown.length ? `<div class="grid-cards">${shown.map((u, i) => `<div class="mini-card"><span class="avatar">${avatar(i)}</span><div class="grow" style="min-width:0"><b>${esc(u.name)}</b><span>${esc(u.email.toLowerCase())}<br>📍 ${esc(u.address.city)}</span></div></div>`).join("")}</div>` : `<div class="empty"><i data-lucide="search"></i>Tidak ada hasil untuk “${esc(query)}”.</div>`;
        icons();
      };
      const load = async () => {
        if (controller) controller.abort();
        timers.splice(0).forEach(clearTimeout);
        controller = new AbortController();
        const signal = controller.signal;
        status = "loading"; error = ""; light(2); draw();
        try {
          const url = fail ? "https://jsonplaceholder.typicode.com/users-404" : "https://jsonplaceholder.typicode.com/users";
          const response = await fetch(url, { signal });
          if (!response.ok) throw new Error("Failed to fetch users");
          light(4);
          const data = await response.json();
          await new Promise((r) => timers.push(setTimeout(r, 450)));
          if (signal.aborted) return;
          users = data; status = "success"; light(6);
        } catch (err) {
          if (err.name === "AbortError") return;
          status = "error"; error = err.message === "Failed to fetch users" ? err.message : "Koneksi gagal (" + err.message + ")"; light(0);
        }
        draw();
      };
      $("[data-fetch]", el).addEventListener("click", load);
      $("[data-fail]", el).addEventListener("change", (e) => (fail = e.target.checked));
      $("[data-q]", el).addEventListener("input", (e) => { query = e.target.value; draw(); });
      draw();
      return () => { if (controller) controller.abort(); timers.forEach(clearTimeout); };
    },

    /* 08 — Router simulator */
    router(el) {
      let path = "/", history = ["/"];
      const studs = STUDENTS.slice(0, 3);
      el.innerHTML = shell("React Router Simulator (SPA)", "route", `
        <div class="browser">
          <div class="browser-bar">
            <button class="ibtn" data-back aria-label="Back"><i data-lucide="chevron-left"></i></button>
            <form class="url" data-url><span>localhost:5173</span><input type="text" data-path aria-label="URL path"></form>
          </div>
          <nav class="r-nav" data-nav>${[["/", "Home"], ["/students", "Students"], ["/tasks", "Tasks"], ["/about", "About"]].map(([to, t]) => `<a href="#" data-to="${to}">${t}</a>`).join("")}</nav>
          <div data-page></div>
        </div>
        <div class="state-box" data-match></div>
        <p class="demo-note"><i data-lucide="info"></i> Coba ketik URL lain (mis. <code>/students/2</code> atau <code>/abc</code>) lalu tekan Enter. Halaman berganti tanpa reload dokumen.</p>`);
      const match = (p) => {
        if (p === "/") return ["/", {}, `<h5>🏠 Home Page</h5><p>Halo! Selamat datang di HSI-BS School App.</p>`];
        if (p === "/students") return ["/students", {}, `<h5>👨‍🎓 Student Directory</h5><div class="list">${studs.map((s, i) => `<a href="#" data-to="/students/${s.id}" style="text-decoration:none;color:inherit">${studentCard(s, i)}</a>`).join("")}</div>`];
        const m = p.match(/^\/students\/([^/]+)$/);
        if (m) {
          const s = STUDENTS.find((x) => String(x.id) === m[1]);
          return ["/students/:id", { id: m[1] }, s ? `<h5>Detail Siswa #${s.id}</h5>${studentCard(s, s.id)}<p class="small muted" style="margin-top:.6rem"><a href="#" data-to="/students">← Kembali ke Students</a></p>` : `<h5>Siswa tidak ditemukan</h5><p>Tidak ada siswa dengan ID ${esc(m[1])}.</p>`];
        }
        if (p === "/tasks") return ["/tasks", {}, `<h5>✅ Tasks</h5><ul><li>Belajar React Router</li><li>Buat halaman 404</li><li>Tandai menu aktif</li></ul>`];
        if (p === "/about") return ["/about", {}, `<h5>ℹ️ About</h5><p>Dibuat oleh siswa HSI Boarding School Purworejo.</p>`];
        return ["*", {}, `<h5>404 — Page Not Found</h5><p>Halaman <code>${esc(p)}</code> tidak ada. <a href="#" data-to="/">Kembali ke Home</a></p>`];
      };
      const draw = () => {
        const [route, params, html] = match(path);
        $("[data-path]", el).value = path;
        $("[data-page]", el).innerHTML = `<div class="r-page">${html}</div>`;
        $$("[data-nav] a", el).forEach((a) => a.classList.toggle("active", a.dataset.to === "/" ? path === "/" : path.startsWith(a.dataset.to)));
        $("[data-match]", el).innerHTML = `<span class="lbl">matched route</span>&lt;Route path=<span class="hl">"${route}"</span> /&gt;\nuseParams() → <span class="hl">${esc(JSON.stringify(params))}</span>\nhistory     → [${history.map((h) => `"${esc(h)}"`).join(", ")}]`;
      };
      const go = (p) => {
        p = "/" + p.trim().replace(/^\/+/, "").replace(/\/+$/, "");
        if (p !== path) { path = p; history = [...history, p].slice(-5); }
        draw();
      };
      el.addEventListener("click", (e) => {
        const a = e.target.closest("[data-to]");
        if (a) { e.preventDefault(); go(a.dataset.to); }
        if (e.target.closest("[data-back]") && history.length > 1) { history = history.slice(0, -1); path = history[history.length - 1]; draw(); }
      });
      $("[data-url]", el).addEventListener("submit", (e) => { e.preventDefault(); go($("[data-path]", el).value); });
      draw();
    },

    /* 09 — Notes + Local Storage */
    notes(el) {
      const KEY = "hsi-demo-notes";
      const read = () => { try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; } };
      let notes = read(), query = "", editing = null, confirmClear = false, confirmTimer;
      const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch { toast("Local Storage tidak tersedia di browser ini"); } };
      el.innerHTML = shell("Student Notes App — Local Storage", "notebook-pen", `
        <form data-add style="display:grid;gap:.5rem">
          <textarea name="text" rows="2" placeholder="Tulis catatan… (mis. hafalan, ide proyek, catatan kelas)" maxlength="200"></textarea>
          <div class="row"><select name="cat" style="flex:0 0 auto;width:auto" aria-label="Kategori"><option>Pelajaran</option><option>Ide Proyek</option><option>Hafalan</option><option>Lainnya</option></select>
          <button class="btn btn-primary btn-sm" type="submit"><i data-lucide="plus"></i> Simpan Note</button>
          <button class="btn btn-ghost btn-sm" type="button" data-clear><i data-lucide="trash-2"></i> Clear All</button></div>
        </form>
        <label class="search" style="margin:0;max-width:none"><i data-lucide="search"></i><input type="search" data-q placeholder="Cari note…"></label>
        <div class="list" data-list></div>
        <div class="state-box" data-raw></div>
        <p class="demo-note"><i data-lucide="info"></i> Refresh halaman ini — note kalian tetap ada karena tersimpan di Local Storage browser.</p>`);
      const draw = () => {
        const shown = notes.filter((n) => (n.text + n.cat).toLowerCase().includes(query.toLowerCase()));
        $("[data-list]", el).innerHTML = shown.length ? shown.map((n) => `
          <div class="item">
            <div class="grow">${editing === n.id ? `<input type="text" data-edit-input="${n.id}" value="${esc(n.text)}" maxlength="200">` : `<span class="title">${esc(n.text)}</span>`}
              <small>🏷️ ${esc(n.cat)} · 🕒 ${new Date(n.createdAt).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</small></div>
            ${editing === n.id ? `<button class="ibtn ok" data-save="${n.id}" aria-label="Simpan"><i data-lucide="save"></i></button>` : `<button class="ibtn" data-edit="${n.id}" aria-label="Edit"><i data-lucide="pencil"></i></button>`}
            <button class="ibtn danger" data-del="${n.id}" aria-label="Hapus"><i data-lucide="trash-2"></i></button>
          </div>`).join("") : `<div class="empty"><i data-lucide="notebook-pen"></i>${notes.length ? "Tidak ada note yang cocok." : "Belum ada note tersimpan."}</div>`;
        let raw = null;
        try { raw = localStorage.getItem(KEY); } catch { /* ignore */ }
        $("[data-raw]", el).innerHTML = `<span class="lbl">localStorage.getItem("${KEY}") — selalu string</span><span class="hl">${esc(raw === null ? "null" : raw.length > 400 ? raw.slice(0, 400) + "…" : raw)}</span>`;
        $("[data-clear]", el).innerHTML = confirmClear ? `<i data-lucide="triangle-alert"></i> Yakin? Klik lagi` : `<i data-lucide="trash-2"></i> Clear All`;
        icons();
        const inp = $("[data-edit-input]", el);
        if (inp) inp.focus();
      };
      const save = (id) => {
        const v = $(`[data-edit-input="${id}"]`, el).value.trim();
        if (v) { notes = notes.map((n) => (n.id === id ? { ...n, text: v } : n)); persist(); }
        editing = null; draw();
      };
      $("[data-add]", el).addEventListener("submit", (e) => {
        e.preventDefault();
        const text = e.target.text.value.trim();
        if (!text) { toast("Note masih kosong"); return; }
        notes = [{ id: Date.now(), text, cat: e.target.cat.value, createdAt: new Date().toISOString() }, ...notes];
        persist(); e.target.text.value = ""; draw();
      });
      $("[data-q]", el).addEventListener("input", (e) => { query = e.target.value; draw(); });
      el.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        if (b.dataset.del) { const id = +b.dataset.del; notes = notes.filter((n) => n.id !== id); persist(); draw(); }
        if (b.dataset.edit) { editing = +b.dataset.edit; draw(); }
        if (b.dataset.save) save(+b.dataset.save);
        if (b.hasAttribute("data-clear")) {
          if (!notes.length) return;
          if (!confirmClear) { confirmClear = true; draw(); confirmTimer = setTimeout(() => { confirmClear = false; draw(); }, 3000); }
          else { clearTimeout(confirmTimer); confirmClear = false; notes = []; persist(); draw(); toast("Semua note dihapus"); }
        }
      });
      el.addEventListener("keydown", (e) => { if (e.target.dataset.editInput && e.key === "Enter") save(+e.target.dataset.editInput); });
      draw();
      return () => clearTimeout(confirmTimer);
    },

    /* 10 — Responsive grid */
    responsive(el) {
      el.innerHTML = shell("Responsive Grid — Tailwind Breakpoint", "monitor", `
        <label>Lebar layar simulasi: <b data-w>375px</b><input type="range" min="320" max="1280" value="375" data-range></label>
        <div class="row"><span class="cls" data-c1>grid-cols-1</span><span class="cls">gap-4</span><span class="cls" data-c3>md:grid-cols-3</span><span class="small muted" data-info></span></div>
        <div class="frame" data-frame><div class="frame-grid" data-grid>
          ${[["users", "Total Students", "6"], ["clipboard-list", "Total Tasks", "12"], ["circle-check", "Completed", "8"]].map(([ic, l, v]) => `<div class="stat-card"><small><i data-lucide="${ic}"></i> ${l}</small><b>${v}</b></div>`).join("")}
        </div></div>
        <div class="state-box">&lt;div className="<span class="hl">grid grid-cols-1 gap-4 md:grid-cols-3</span>"&gt;\n  &lt;StatCard title="Total Students" value={6} /&gt;\n  &lt;StatCard title="Total Tasks" value={12} /&gt;\n  &lt;StatCard title="Completed" value={8} /&gt;\n&lt;/div&gt;</div>
        <p class="demo-note"><i data-lucide="info"></i> Breakpoint <code>md</code> aktif mulai 768px. Di bawahnya: satu kolom (mobile). Mulai 768px: tiga kolom.</p>`);
      const range = $("[data-range]", el);
      const draw = () => {
        const w = +range.value, md = w >= 768;
        $("[data-w]", el).textContent = w + "px";
        $("[data-frame]", el).style.width = Math.round(((w - 320) / 960) * 60 + 40) + "%";
        $("[data-grid]", el).style.gridTemplateColumns = md ? "repeat(3, 1fr)" : "1fr";
        $("[data-c1]", el).classList.toggle("on", !md);
        $("[data-c3]", el).classList.toggle("on", md);
        $("[data-info]", el).textContent = md ? "📺 Medium screen ke atas → 3 kolom" : "📱 Mobile → 1 kolom";
      };
      range.addEventListener("input", draw);
      draw();
    },

    /* 11 — Final project planner */
    planner(el) {
      const steps = ["Planning", "Component Breakdown", "Build Static UI", "Add Interaction", "Connect Data", "Test", "Refactor"];
      const ideas = ["Dark mode", "Favorite students", "Task priority", "Search by skill", "User profile settings"];
      el.innerHTML = shell("Final Project Planner — HSI-BS School Dashboard", "trophy", `
        <div class="demo-split">
          <div>
            <b class="small">Progress Workflow</b>
            <div class="meter"><div class="meter-bar" data-bar></div></div>
            <p class="meter-label" data-pct></p>
            <ul class="checklist" data-steps>${steps.map((s, i) => checkItem(`<b>Step ${i + 1}</b> — ${s}`, store.get("planner-steps", [])[i], `data-i="${i}"`)).join("")}</ul>
          </div>
          <div style="display:grid;gap:.8rem;align-content:start">
            <b class="small">Fitur unik pilihanku</b>
            <div class="row" data-ideas>${ideas.map((x) => `<button class="btn btn-ghost btn-sm" data-idea="${x}">${x}</button>`).join("")}</div>
            <form class="row" data-own><input type="text" name="own" placeholder="…atau tulis idemu sendiri" maxlength="40"><button class="btn btn-primary btn-sm"><i data-lucide="check"></i></button></form>
            <div class="ui-box"><span class="tag">My Unique Feature</span><b data-feature></b></div>
            <div class="ui-box"><span class="tag">Code Quality</span><span data-quality></span></div>
          </div>
        </div>`);
      const draw = () => {
        const vals = $$("[data-steps] input", el).map((x) => x.checked);
        store.set("planner-steps", vals);
        const pct = Math.round((vals.filter(Boolean).length / steps.length) * 100);
        $("[data-bar]", el).style.width = pct + "%";
        $("[data-pct]", el).textContent = `${pct}% — ${pct === 100 ? "Siap Demo Day! 🎤" : "Next: " + steps[vals.indexOf(false)]}`;
        const feat = store.get("planner-feature", "");
        $("[data-feature]", el).textContent = feat ? "⭐ " + feat : "Belum dipilih — tambahkan minimal satu fitur unik!";
        $$("[data-idea]", el).forEach((b) => b.classList.toggle("btn-gold", b.dataset.idea === feat));
        const q = store.get("check-quality", []).filter(Boolean).length;
        $("[data-quality]", el).innerHTML = `<b>${q}/9</b> poin Code Quality Checklist tercentang <span class="muted small">(lihat bagian 11.4 di atas)</span>`;
      };
      $("[data-steps]", el).addEventListener("change", draw);
      el.addEventListener("click", (e) => { const b = e.target.closest("[data-idea]"); if (b) { store.set("planner-feature", b.dataset.idea); draw(); } });
      $("[data-own]", el).addEventListener("submit", (e) => { e.preventDefault(); const v = e.target.own.value.trim(); if (v) { store.set("planner-feature", v); e.target.own.value = ""; draw(); } });
      draw();
    },

    /* 12 — Deploy simulator + Demo Day timer */
    deploy(el) {
      const timers = [];
      let stage = 0, remaining = 420, ticking = null;
      const cmds = [
        ["npm run build", ["vite v6 building for production...", "✓ 48 modules transformed.", "dist/index.html          0.46 kB", "dist/assets/index.css   12.10 kB", "dist/assets/index.js   198.32 kB", "<ok>✓ built in 1.84s</ok>"]],
        ["npm run preview", ["➜  Local:   http://localhost:4173/", "<dim>Cek semua fitur sebelum deployment…</dim>", "<ok>✓ Semua fitur berjalan</ok>"]],
        ["git push origin main", ["Enumerating objects: 42, done.", "Writing objects: 100% (42/42), done.", "<ok>✓ main -> main (GitHub)</ok>"]],
        ["deploy → Vercel / Netlify", ["Build command:    npm run build", "Output directory: dist", "Rewrites: /* → /index.html (deep link SPA)", "<ok>✓ Deployed!</ok>", "🌐 https://hsi-school-dashboard.vercel.app"]],
      ];
      el.innerHTML = shell("Deployment Simulator & Demo Day Timer", "cloud-upload", `
        <div class="row" data-btns>${cmds.map(([c], i) => `<button class="btn ${i ? "btn-ghost" : "btn-primary"} btn-sm" data-run="${i}" ${i ? "disabled" : ""}><i data-lucide="terminal"></i> ${c}</button>`).join("")}</div>
        <div class="term" data-term><span class="dim"># Jalankan perintah secara berurutan ↑</span></div>
        <div class="ui-box timer" data-timer><span class="tag">🎤 Demo Day — latihan presentasi 5–7 menit</span>
          <div class="t" data-t>07:00</div>
          <div class="row" style="justify-content:center"><button class="btn btn-primary btn-sm" data-tt="start"><i data-lucide="play"></i> Start</button><button class="btn btn-ghost btn-sm" data-tt="pause"><i data-lucide="pause"></i> Pause</button><button class="btn btn-ghost btn-sm" data-tt="reset"><i data-lucide="rotate-ccw"></i> Reset</button></div>
          <p class="small muted" style="margin:.6rem 0 0" data-tmsg>Intro → Problem & Solution → Features → Live Demo → React Concepts → Lessons Learned</p>
        </div>`);
      const term = $("[data-term]", el);
      const line = (html) => { term.insertAdjacentHTML("beforeend", "\n" + html); term.scrollTop = term.scrollHeight; };
      const run = (i) => {
        if (i !== stage) return;
        $$("[data-run]", el).forEach((b) => (b.disabled = true));
        if (stage === 0) term.innerHTML = "";
        line(`<span class="p">$</span> ${esc(cmds[i][0])}`);
        cmds[i][1].forEach((l, k) => timers.push(setTimeout(() => {
          line(l.replace(/<ok>(.*)<\/ok>/, '<span class="ok">$1</span>').replace(/<dim>(.*)<\/dim>/, '<span class="dim">$1</span>'));
          if (k === cmds[i][1].length - 1) {
            stage++;
            const next = $(`[data-run="${stage}"]`, el);
            if (next) { next.disabled = false; next.classList.replace("btn-ghost", "btn-primary"); }
            else toast("Aplikasi sudah online! 🚀");
          }
        }, 380 * (k + 1))));
      };
      const fmtT = (s) => `${s < 0 ? "-" : ""}${pad(Math.floor(Math.abs(s) / 60))}:${pad(Math.abs(s) % 60)}`;
      const drawT = () => {
        $("[data-t]", el).textContent = fmtT(remaining);
        const box = $("[data-timer]", el);
        box.classList.toggle("warn", remaining <= 120 && remaining > 0);
        box.classList.toggle("over", remaining <= 0);
        $("[data-tmsg]", el).textContent = remaining <= 0 ? "⏰ Waktu habis — tutup presentasi dengan salam." : remaining <= 120 ? "✅ Sudah lewat 5 menit — saatnya menutup presentasi." : "Intro → Problem & Solution → Features → Live Demo → React Concepts → Lessons Learned";
      };
      el.addEventListener("click", (e) => {
        const r = e.target.closest("[data-run]");
        if (r) run(+r.dataset.run);
        const t = e.target.closest("[data-tt]")?.dataset.tt;
        if (t === "start" && !ticking) ticking = setInterval(() => { remaining--; drawT(); if (remaining <= -60) { clearInterval(ticking); ticking = null; } }, 1000);
        if (t === "pause") { clearInterval(ticking); ticking = null; }
        if (t === "reset") { clearInterval(ticking); ticking = null; remaining = 420; drawT(); }
      });
      drawT();
      return () => { timers.forEach(clearTimeout); clearInterval(ticking); };
    },
  };
  return DEMOS;
}

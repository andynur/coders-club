/* ==========================================================
   HSI-BS React Journey — "Hasil" previews
   Tiap contoh kode yang punya `run` di data.js ditampilkan
   hasilnya di sini. Output sudah dicocokkan dengan hasil
   asli proyek Vite + React 19 + React Router + Tailwind 4.
   Setiap fungsi menerima elemen host dan boleh mengembalikan
   fungsi cleanup.
   ========================================================== */
function createPreviews() {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const on = (root, sel, ev, fn) => root.querySelectorAll(sel).forEach((el) => el.addEventListener(ev, fn));

  // Pengganti window.alert(): kotak dialog kecil di dalam panel hasil.
  function fakeAlert(host, msg) {
    host.querySelector(".o-alert")?.remove();
    const d = document.createElement("div");
    d.className = "o-alert";
    d.innerHTML = `<small>localhost:5173 says</small><p>${esc(msg)}</p><button type="button">OK</button>`;
    d.querySelector("button").addEventListener("click", () => d.remove());
    host.appendChild(d);
    d.querySelector("button").focus({ preventScroll: true });
  }
  // Pengganti console.log(): panel Console ala DevTools.
  const consoleBox = (lines) => `<div class="o-console"><small>Console</small>${lines.map((l) => `<div>${l}</div>`).join("")}</div>`;
  const card = (name, grade, extra) => `<article class="o-card"><h2>${esc(name)}</h2><p>${grade}</p>${extra ? `<p>${extra}</p>` : ""}</article>`;

  return {
    /* Bab 01 — Counter (React) */
    counter(host) {
      let count = 0;
      host.innerHTML = `<button type="button">Count: 0</button>`;
      const b = host.querySelector("button");
      b.addEventListener("click", () => { count++; b.textContent = `Count: ${count}`; });
    },
    practice1(host) {
      host.innerHTML = `<main><h1>Assalamu'alaikum! 👋</h1><h2>Welcome to HSI-BS React Class</h2><p>My first React application.</p></main>`;
    },

    /* Bab 02 — JSX */
    greeting(host) { host.innerHTML = `<h1>Hello, Ahmad!</h1>`; },
    fragment(host) {
      host.innerHTML = `<h1>Hello React</h1><p>Learning JSX</p>
        <p class="o-note">Di DevTools, tidak ada &lt;div&gt; tambahan: &lt;h1&gt; dan &lt;p&gt; langsung berada di dalam #root.</p>`;
    },
    jsxTitle(host) {
      host.innerHTML = `<h1 class="title">Hello World</h1><p class="o-note">HTML yang dihasilkan: <code>&lt;h1 class="title"&gt;</code>. <code>className</code> berubah jadi <code>class</code>.</p>`;
    },
    selfClosing(host) {
      host.innerHTML = `<span class="o-img" role="img" aria-label="Logo">🖼️ Logo</span> <input type="text" aria-label="contoh input">
        <p class="o-note">Gambar tampil sebagai teks alt "Logo" karena <code>/logo.png</code> belum ada di folder <code>public/</code>.</p>`;
    },
    studentCard(host) { host.innerHTML = card("Ahmad", "Class X", "Web Development Student"); },
    appCards(host) {
      host.innerHTML = `<main><h1>Student Directory</h1>${card("Ahmad", "Class X", "Web Development Student")}${card("Ahmad", "Class X", "Web Development Student")}</main>
        <p class="o-note">Isinya sama persis karena komponen belum menerima props. Ini yang diperbaiki di Bab 03.</p>`;
    },

    /* Bab 03 — Props */
    props(host) { host.innerHTML = card("Ahmad", "Class: X") + card("Zaid", "Class: XI"); },
    list(host) { host.innerHTML = `<div>${[["Ahmad", "X"], ["Zaid", "XI"], ["Umar", "XII"]].map(([n, g]) => card(n, "Class: " + g)).join("")}</div>`; },
    badge(host) {
      host.innerHTML = `<div class="o-rows">
        <div><code>&lt;StatusBadge isActive={true} /&gt;</code><span>🟢 Active</span></div>
        <div><code>&lt;StatusBadge isActive={false} /&gt;</code><span>🔴 Inactive</span></div></div>`;
    },

    /* Bab 04 — State & events */
    counter4(host) {
      let count = 0;
      host.innerHTML = `<div><h2>Count: <span>0</span></h2><button type="button" data-a="inc">Increase</button> <button type="button" data-a="reset">Reset</button></div>`;
      const out = host.querySelector("h2 span");
      on(host, "[data-a]", "click", (e) => {
        count = e.currentTarget.dataset.a === "inc" ? count + 1 : 0;
        out.textContent = count;
      });
    },
    greetBtn(host) {
      host.innerHTML = `<button type="button">Say Hello</button>`;
      host.querySelector("button").addEventListener("click", () => fakeAlert(host, "Welcome to React!"));
    },

    /* Bab 05 — Form */
    form(host) {
      host.innerHTML = `<form><input type="text" placeholder="Enter your name" aria-label="Name"> <button type="submit">Submit</button></form>
        <p class="o-note">Coba klik Submit saat input masih kosong.</p>`;
      const f = host.querySelector("form");
      f.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = f.querySelector("input").value;
        fakeAlert(host, name.trim() ? `Welcome, ${name}!` : "Name is required!");
      });
    },

    /* Bab 06 — CRUD */
    tasks(host) {
      let tasks = [], id = 0;
      host.innerHTML = `<div><button type="button" data-add>Add Example Task</button><div data-list></div></div>`;
      const list = host.querySelector("[data-list]");
      const draw = () => {
        list.innerHTML = tasks.map((t) => `<div class="o-task${t.completed ? " done" : ""}"><span>${esc(t.title)}</span>
          <button type="button" data-t="${t.id}">${t.completed ? "Undo" : "Complete"}</button>
          <button type="button" data-d="${t.id}">Delete</button></div>`).join("");
      };
      host.addEventListener("click", (e) => {
        if (e.target.closest("[data-add]")) tasks = [...tasks, { id: ++id, title: "Learn React", completed: false }];
        const t = e.target.closest("[data-t]"), d = e.target.closest("[data-d]");
        if (t) tasks = tasks.map((x) => (x.id === +t.dataset.t ? { ...x, completed: !x.completed } : x));
        if (d) tasks = tasks.filter((x) => x.id !== +d.dataset.d);
        draw();
      });
    },

    /* Bab 07 — Fetch */
    users(host) {
      const controller = new AbortController();
      const load = () => {
        host.innerHTML = `<p>Loading...</p>`;
        fetch("https://jsonplaceholder.typicode.com/users", { signal: controller.signal })
          .then((r) => { if (!r.ok) throw new Error("Failed to fetch users"); return r.json(); })
          .then((data) => { host.innerHTML = `<ul>${data.map((u) => `<li>${esc(u.name)}</li>`).join("")}</ul><button type="button" class="o-reload">↻ Muat ulang</button>`; host.querySelector(".o-reload").addEventListener("click", load); })
          .catch((err) => { if (err.name !== "AbortError") { host.innerHTML = `<p>Error: ${esc(err.message)}</p><button type="button" class="o-reload">↻ Coba lagi</button>`; host.querySelector(".o-reload").addEventListener("click", load); } });
      };
      load();
      return () => controller.abort();
    },

    /* Bab 08 — Router */
    router(host) {
      const pages = { "/": "Home Page", "/students": "Student Directory" };
      host.innerHTML = `<div class="o-url"><span>localhost:5173</span><b data-path>/</b></div>
        <nav><a href="#" data-to="/">Home</a> <a href="#" data-to="/students">Students</a></nav>
        <h1 data-page>Home Page</h1>
        <p class="o-note">Coba juga alamat yang tidak ada: <a href="#" data-to="/about">/about</a></p>`;
      on(host, "[data-to]", "click", (e) => {
        e.preventDefault();
        const p = e.currentTarget.dataset.to;
        host.querySelector("[data-path]").textContent = p;
        const h = host.querySelector("[data-page]");
        h.textContent = pages[p] || "404 — Page Not Found";
        h.classList.remove("o-pop"); void h.offsetWidth; h.classList.add("o-pop");
      });
    },

    /* Bab 09 — Local Storage */
    lsName(host) { host.innerHTML = consoleBox([`<span class="o-str">Ahmad</span>`]); },
    lsTasks(host) {
      host.innerHTML = `<div class="o-ls"><small>Application › Local Storage</small><div><b>Key</b><b>Value</b></div><div><code>tasks</code><code>[{"id":1,"title":"Learn React"}]</code></div></div>`;
    },
    lsRead(host) {
      host.innerHTML = consoleBox([`<span class="o-dim">&gt; savedTasks</span>`, `▸ (1) [{id: 1, title: 'Learn React'}]`, `<span class="o-dim">Jika key "tasks" belum ada, hasilnya array kosong [].</span>`]);
    },
    notes(host) {
      const KEY = "hsi-preview-my-note";
      let v = "";
      try { v = localStorage.getItem(KEY) || ""; } catch { /* storage unavailable */ }
      host.innerHTML = `<textarea rows="3" placeholder="Write your note..." aria-label="Note"></textarea>
        <p class="o-note">Ketik sesuatu, lalu refresh halaman ini. Catatanmu masih ada.</p>`;
      const ta = host.querySelector("textarea");
      ta.value = v;
      ta.addEventListener("input", () => { try { localStorage.setItem(KEY, ta.value); } catch { /* ignore */ } });
    },

    /* Bab 10 — Tailwind */
    welcome(host) {
      host.innerHTML = `<div class="o-tw-card"><h2>Welcome, Student!</h2><p>Keep building amazing things.</p></div>`;
    },
    grid(host) {
      host.innerHTML = `<div class="o-switch" role="group" aria-label="Lebar layar"><button type="button" data-w="sm" class="on">📱 Mobile</button><button type="button" data-w="md">💻 Desktop (md+)</button></div>
        <div class="o-tw-grid"><div>Card 1</div><div>Card 2</div><div>Card 3</div></div>`;
      const g = host.querySelector(".o-tw-grid");
      on(host, "[data-w]", "click", (e) => {
        host.querySelectorAll("[data-w]").forEach((b) => b.classList.toggle("on", b === e.currentTarget));
        g.classList.toggle("md", e.currentTarget.dataset.w === "md");
      });
    },
  };
}

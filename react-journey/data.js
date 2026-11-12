/* ==========================================================
   HSI-BS React Journey — Handbook content
   Sumber: HANDBOOK.md — React.js Fundamental, Student Learning Handbook
   Format teks: `kode`, **tebal**, *miring* (diformat oleh app.js)
   ========================================================== */

const HANDBOOK = {
  meta: {
    school: "HSI Boarding School Purworejo",
    program: "Kelas IT — Web Development",
    year: "2026/2027",
    mentor: "Kak Andy",
    duration: "12 Meetings × 120 Minutes",
    prerequisite: "JavaScript Fundamentals",
  },

  outcomes: [
    "Memahami konsep React dan component-based architecture.",
    "Membuat serta menjalankan proyek React menggunakan Vite.",
    "Menggunakan JSX untuk membangun antarmuka.",
    "Membuat reusable components dan mengirim data melalui props.",
    "Mengelola data dan interaksi menggunakan `useState`.",
    "Membuat form, validasi sederhana, dan fitur CRUD.",
    "Mengambil serta menampilkan data dari REST API.",
    "Membuat navigasi menggunakan React Router.",
    "Menyimpan data sederhana menggunakan Local Storage.",
    "Mendesain aplikasi responsif menggunakan Tailwind CSS.",
    "Melakukan deployment aplikasi.",
    "Menjelaskan kode dan mempresentasikan proyek.",
  ],

  phases: [
    { id: 1, icon: "layers", name: "Foundations", meetings: "1–3", topics: "React, JSX, Components, Props", milestone: "Student Directory" },
    { id: 2, icon: "zap", name: "Interactivity", meetings: "4–6", topics: "Events, State, Forms, CRUD", milestone: "Task Manager" },
    { id: 3, icon: "globe", name: "Real-World React", meetings: "7–9", topics: "API, Effects, Router, Local Storage", milestone: "API Explorer & Notes" },
    { id: 4, icon: "rocket", name: "Build & Ship", meetings: "10–12", topics: "Tailwind, Integration, Deployment", milestone: "HSI-BS School Dashboard" },
  ],

  prerequisites: [
    "`let`, `const`, dan JavaScript data types.",
    "Regular functions dan arrow functions.",
    "Arrays dan objects.",
    "Destructuring dan spread operator.",
    "`map()`, `filter()`, dan `find()`.",
    "Conditional statements.",
    "ES Modules (`import` dan `export`).",
    "Promises dan `async/await`.",
    "Dasar HTML, CSS, dan DOM.",
  ],

  chapters: [
    /* ---------------------------------------------------- 01 */
    {
      num: 1, phase: 1, icon: "rocket",
      part: "Part 2 — React Foundations",
      title: "Introduction to React & Environment Setup",
      short: "Introduction to React & Setup",
      meeting: "Meeting 01 | React Fundamentals",
      objective: "Siswa mampu menjelaskan apa itu React, alasan penggunaannya, dan cara membuat proyek React.",
      blocks: [
        { h: "1.1 What is React?" },
        { p: "React adalah JavaScript library untuk membangun **User Interfaces (UI)**." },
        { p: "Bayangkan kalian sedang membangun sebuah dashboard sekolah yang memiliki:" },
        { list: ["Navbar", "Sidebar", "Profile Card", "Student List", "Statistics Card", "Footer"], cols: true },
        { p: "Pada HTML biasa, kita dapat membuat semuanya dalam satu dokumen panjang. Tetapi semakin kompleks aplikasi, semakin sulit mengelola dan menggunakan kembali bagian-bagian UI tersebut." },
        { p: "Dengan React, kita bisa membaginya menjadi komponen kecil." },
        { analogy: "Bayangkan React seperti main **LEGO**. Kamu tidak memahat satu patung besar sekaligus. Kamu membuat balok-balok kecil (komponen), lalu menyusunnya menjadi rumah, mobil, atau apa saja. Balok yang sama bisa dipakai berkali-kali.", title: "React = LEGO untuk tampilan website", icon: "🧱" },
        { code: `App
├── Navbar
├── Sidebar
├── Dashboard
│   ├── StatisticsCard
│   ├── StudentList
│   └── TaskList
└── Footer`, lang: "plaintext", title: "Component Tree" },
        { p: "Setiap komponen dapat memiliki tampilan dan logikanya sendiri." },
        { viz: "uiTree" },

        { h: "1.2 React vs Vanilla JavaScript" },
        { compare: [
          { label: "Vanilla JavaScript", lang: "javascript", code: `const button = document.querySelector("#button");
const counter = document.querySelector("#counter");

let count = 0;

button.addEventListener("click", () => {
  count++;
  counter.textContent = count;
});` },
          { label: "React", lang: "javascript", code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}

export default Counter;`, run: "counter" },
        ] },
        { p: "Pada React, kita mendeskripsikan tampilan berdasarkan data. Ketika state diperbarui, React membantu memperbarui tampilan." },
        { analogy: "Vanilla JS itu seperti memandu teman memasak: *ambil wajan, nyalakan kompor, tuang minyak…* satu per satu. React itu seperti **memesan dari menu**: kamu cukup bilang hasil akhirnya (\"nasi goreng, pedas\"), dapurnya yang mengurus langkah-langkahnya.", title: "Menyuruh langkah vs memesan hasil", icon: "🍳" },
        { tip: "**Key Concept:** UI = Function of State.", kind: "key" },
        { viz: "uiFormula" },

        { h: "1.3 Development Tools" },
        { p: "Tools yang digunakan:" },
        { tools: [
          ["code", "VS Code", "Code Editor."],
          ["hard-drive", "Node.js", "JavaScript runtime untuk development tooling."],
          ["package", "npm", "Package Manager."],
          ["zap", "Vite", "Frontend build tool."],
          ["wrench", "Browser Developer Tools", "Debugging."],
          ["git-branch", "Git & GitHub", "Version Control."],
        ] },

        { h: "1.4 Create Your First React App" },
        { p: "Pastikan Node.js sudah terinstal dan kompatibel dengan Vite." },
        { code: `node -v
npm -v`, lang: "bash", title: "Terminal" },
        { p: "Buat proyek baru:" },
        { code: `npm create vite@latest hsi-react -- --template react
cd hsi-react
npm install
npm run dev`, lang: "bash", title: "Terminal" },
        { p: "Buka alamat lokal yang ditampilkan terminal." },
        { tip: "**Opsional — kenalan dengan Bun.** Bun adalah JavaScript runtime modern yang sudah termasuk package manager. Proses install-nya jauh lebih cepat daripada npm. Di kelas kita tetap memakai **npm**, jadi bagian ini hanya untuk perkenalan. Kalau ingin mencoba, langkahnya ada di bawah.", kind: "tip" },
        { p: "Install Bun (cukup sekali), lalu cek versinya di terminal baru:" },
        { code: `# macOS & Linux
curl -fsSL https://bun.com/install | bash

# Windows (PowerShell)
powershell -c "irm bun.sh/install.ps1|iex"

# Cek instalasi
bun --version`, lang: "bash", title: "Terminal" },
        { p: "Buat proyek Vite yang sama, tetapi semua perintahnya memakai Bun:" },
        { code: `bun create vite hsi-react --template react
cd hsi-react
bun install
bun run dev`, lang: "bash", title: "Terminal" },
        { list: [
          "Hasilnya sama persis dengan proyek npm: React + Vite, struktur folder sama, `bun run build` tetap menghasilkan folder `dist/`.",
          "Bedanya hanya di file lock: Bun membuat `bun.lock`, npm membuat `package-lock.json`. Pilih salah satu saja dalam satu proyek.",
          "Muncul `command not found` setelah install? Tutup lalu buka lagi terminal, atau tambahkan `~/.bun/bin` ke `PATH`.",
          "Bun juga punya template sendiri, `bun init --react` (full-stack, TypeScript). Struktur foldernya berbeda dari Vite, jadi untuk kelas ini tetap pakai template Vite.",
        ] },

        { tip: "**Kalau error di awal itu wajar.** Baca pesan di terminal pelan-pelan, cek ejaan perintah, dan pastikan kamu sudah `cd` ke folder proyek sebelum `npm install`.", kind: "tip" },
        { h: "1.5 Understanding Project Structure" },
        { code: `hsi-react/
├── public/
├── src/
│   ├── assets/
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── vite.config.js
└── node_modules/`, lang: "plaintext", title: "Project Structure" },
        { p: "**Important files:**" },
        { list: [
          "`App.jsx` — Komponen utama aplikasi.",
          "`main.jsx` — Entry point React.",
          "`index.css` — Global stylesheet.",
          "`package.json` — Project configuration dan dependencies.",
          "`node_modules` — Paket hasil instalasi npm.",
        ] },

        { recap: [
          "React = library untuk membangun UI dari **komponen** kecil yang bisa dipakai ulang.",
          "Di React kamu mengubah **data**, lalu React yang memperbarui tampilan: **UI = f(state)**.",
          "Proyek dibuat dengan `npm create vite@latest`, dijalankan dengan `npm run dev`.",
          "Kamu akan paling sering bekerja di folder `src/`, terutama `App.jsx`.",
        ] },
      ],
      practice: {
        intro: "Ganti isi `App.jsx`:",
        code: `function App() {
  return (
    <main>
      <h1>Assalamu'alaikum! 👋</h1>
      <h2>Welcome to HSI-BS React Class</h2>
      <p>My first React application.</p>
    </main>
  );
}

export default App;`,
        codeTitle: "src/App.jsx", run: "practice1",
      },
      challenge: [
        "Tambahkan nama kalian.",
        "Tambahkan kelas.",
        "Tambahkan tiga alasan mengapa ingin belajar React.",
        "Ubah warna background menggunakan CSS.",
      ],
      assess: [
        "Saya memahami fungsi React.",
        "Saya dapat menjelaskan perbedaan React dan Vanilla JS.",
        "Saya dapat membuat proyek Vite.",
        "Saya dapat menjalankan React development server.",
        "Saya memahami fungsi `App.jsx`.",
      ],
      deliverable: "hello-react",
      demo: "counter",
    },

    /* ---------------------------------------------------- 02 */
    {
      num: 2, phase: 1, icon: "puzzle",
      part: "Part 2 — React Foundations",
      title: "JSX & React Components",
      short: "JSX & Components",
      meeting: "Meeting 02 | Building Reusable UI",
      objective: "Siswa mampu menggunakan JSX, membuat functional components, dan menyusun UI menggunakan beberapa komponen.",
      blocks: [
        { h: "2.1 What is JSX?" },
        { p: "JSX adalah ekstensi sintaks JavaScript yang memungkinkan kita menulis markup menyerupai HTML di dalam JavaScript." },
        { p: "Contoh:" },
        { code: `const name = "Ahmad";

function Greeting() {
  return <h1>Hello, {name}!</h1>;
}`, lang: "javascript", run: "greeting" },
        { p: "Kurung kurawal `{}` digunakan untuk memasukkan ekspresi JavaScript ke dalam JSX." },
        { viz: "jsxAnatomy" },

        { h: "2.2 Important JSX Rules" },
        { rule: "Rule 1 — Return a single parent element" },
        { code: `function App() {
  return (
    <>
      <h1>Hello React</h1>
      <p>Learning JSX</p>
    </>
  );
}`, lang: "javascript", run: "fragment" },
        { p: "Fragment `<>...</>` memungkinkan kita mengelompokkan elemen tanpa menambah elemen HTML pembungkus." },
        { rule: "Rule 2 — Use `className` instead of `class`" },
        { code: `<h1 className="title">Hello World</h1>`, lang: "javascript", run: "jsxTitle" },
        { rule: "Rule 3 — Close all tags" },
        { code: `<>
  <img src="/logo.png" alt="Logo" />
  <input type="text" />
</>`, lang: "javascript", run: "selfClosing" },
        { rule: "Rule 4 — Use camelCase for many JSX attributes" },
        { p: "Contoh: `onClick`, `onChange`, dan `htmlFor`." },
        { rule: "Rule 5 — Nama komponen diawali huruf kapital" },
        { p: "Tulis `<StudentCard />`, bukan `<studentCard />`. Tag yang diawali huruf kecil dianggap tag HTML biasa, jadi komponenmu tidak akan muncul." },

        { h: "2.3 Creating Your First Component" },
        { p: "Buat file `src/components/StudentCard.jsx`:" },
        { code: `function StudentCard() {
  return (
    <article>
      <h2>Ahmad</h2>
      <p>Class X</p>
      <p>Web Development Student</p>
    </article>
  );
}

export default StudentCard;`, lang: "javascript", title: "src/components/StudentCard.jsx", run: "studentCard" },
        { p: "Kemudian gunakan di `App.jsx`:" },
        { code: `import StudentCard from "./components/StudentCard";

function App() {
  return (
    <main>
      <h1>Student Directory</h1>
      <StudentCard />
      <StudentCard />
    </main>
  );
}

export default App;`, lang: "javascript", title: "src/App.jsx", run: "appCards" },
        { p: "Perhatikan bahwa satu komponen dapat digunakan beberapa kali!" },
        { analogy: "Komponen itu seperti **cetakan kue**. Cetakannya dibuat sekali (function `StudentCard`), lalu bisa dipakai untuk mencetak kue sebanyak yang kamu mau (`<StudentCard />` berkali-kali).", title: "Cetakan kue", icon: "🍪" },
        { viz: "componentStamp" },

        { h: "2.4 Component Composition" },
        { p: "Component composition adalah cara menyusun komponen kecil menjadi antarmuka yang lebih besar." },
        { p: "Contoh:" },
        { code: `StudentProfile
├── ProfileImage
├── StudentInformation
└── SkillsBadge`, lang: "plaintext", title: "Component Tree" },
        { tip: "Prinsipnya sederhana: **Build small, combine later.**", kind: "key" },

        { recap: [
          "JSX = tulisan mirip HTML di dalam JavaScript. `{ }` adalah pintu masuk JavaScript.",
          "Aturan JSX: satu parent, `className`, semua tag ditutup, atribut camelCase.",
          "Komponen = function yang mengembalikan JSX. Namanya diawali huruf kapital.",
          "Bangun kecil-kecil, lalu gabungkan: **Build small, combine later**.",
        ] },
      ],
      practice: {
        intro: "Bangun **Student ID Card** dengan:",
        items: ["Foto atau avatar.", "Nama siswa.", "Kelas.", "Skill utama.", "Status aktif siswa."],
      },
      challenge: [
        "Buat tiga komponen terpisah: `Header.jsx`, `StudentCard.jsx`, dan `Footer.jsx`.",
        "Gabungkan semuanya pada `App.jsx`.",
      ],
      assess: [
        "Saya memahami aturan JSX.",
        "Saya dapat membuat functional component.",
        "Saya memahami import/export.",
        "Saya dapat menggabungkan beberapa komponen.",
        "Saya memahami reusable UI.",
      ],
      deliverable: "student-profile-card",
      demo: "compose",
    },

    /* ---------------------------------------------------- 03 */
    {
      num: 3, phase: 1, icon: "users",
      part: "Part 2 — React Foundations",
      title: "Props & Dynamic Rendering",
      short: "Props & Dynamic Rendering",
      meeting: "Meeting 03 | Making Components Dynamic",
      objective: "Siswa mampu menggunakan props, menampilkan array, dan melakukan conditional rendering.",
      blocks: [
        { h: "3.1 What are Props?" },
        { p: "Props adalah data yang dikirim dari parent component ke child component." },
        { analogy: "Props seperti **titipan dari orang tua** untuk anaknya di asrama. Anak menerima dan memakai titipan itu, tapi tidak bisa mengubah isi kiriman yang sudah dikirim. Kalau mau isinya beda, orang tua yang mengirim ulang.", title: "Titipan dari orang tua", icon: "🎁" },
        { p: "Contoh:" },
        { code: `function StudentCard({ name, grade }) {
  return (
    <article>
      <h2>{name}</h2>
      <p>Class: {grade}</p>
    </article>
  );
}

export default function App() {
  return (
    <>
      <StudentCard name="Ahmad" grade="X" />
      <StudentCard name="Zaid" grade="XI" />
    </>
  );
}`, lang: "javascript", run: "props" },
        { p: "Kita cukup membuat satu `StudentCard`, lalu menggunakannya dengan data berbeda." },
        { tip: "**Remember:** Props bersifat read-only. Child component tidak boleh mengubah props yang diterimanya secara langsung.", kind: "tip" },
        { viz: "propsFlow" },

        { h: "3.2 Rendering Arrays with map()" },
        { code: `const students = [
  { id: 1, name: "Ahmad", grade: "X" },
  { id: 2, name: "Zaid", grade: "XI" },
  { id: 3, name: "Umar", grade: "XII" },
];

function StudentList() {
  return (
    <div>
      {students.map((student) => (
        <StudentCard
          key={student.id}
          name={student.name}
          grade={student.grade}
        />
      ))}
    </div>
  );
}`, lang: "javascript", run: "list" },
        { p: "`key` membantu React mengidentifikasi item dalam sebuah daftar." },
        { p: "Gunakan identifier yang unik dan stabil, seperti ID siswa." },
        { viz: "mapConveyor" },
        { tip: "Hindari memakai index array sebagai `key` kalau urutan data bisa berubah (dihapus, diurutkan, disisipi). Pakai `id` dari data.", kind: "warn" },

        { h: "3.3 Conditional Rendering" },
        { p: "Contoh:" },
        { code: `function StatusBadge({ isActive }) {
  return (
    <span>
      {isActive ? "🟢 Active" : "🔴 Inactive"}
    </span>
  );
}`, lang: "javascript", run: "badge" },
        { p: "Dengan conditional rendering, tampilan dapat berubah berdasarkan kondisi data." },
        { p: "Kalau hanya ingin menampilkan sesuatu saat kondisinya `true`, pakai `&&`. Contoh: `{isActive && <span>Online</span>}`. Kalau `isActive` bernilai `false`, tidak ada yang tampil." },

        { recap: [
          "Props = data dari parent ke child. Sifatnya **read-only**.",
          "`array.map()` mengubah setiap data menjadi satu komponen.",
          "Setiap item di daftar butuh `key` yang unik dan stabil, misalnya `id`.",
          "Conditional rendering: `kondisi ? A : B` atau `kondisi && A`.",
        ] },
      ],
      practice: {
        intro: "Bangun **Student Directory** menggunakan array berisi minimal enam data siswa fiktif. Setiap card menampilkan:",
        items: ["Nama", "Kelas", "Skill", "Status aktif", "Avatar"],
      },
      challenge: [
        "Tambahkan label \"Active\" dan \"Inactive\".",
        "Urutkan data berdasarkan nama.",
        "Tampilkan hanya siswa kelas X menggunakan `filter()`.",
        "Tambahkan informasi jumlah seluruh siswa.",
      ],
      assess: [
        "Saya memahami fungsi props.",
        "Saya dapat menggunakan destructuring.",
        "Saya dapat menggunakan `map()` pada JSX.",
        "Saya memahami fungsi `key`.",
        "Saya dapat membuat conditional rendering.",
      ],
      milestone: "Mini Project 01 Completed: Student Directory",
      demo: "props",
    },

    /* ---------------------------------------------------- 04 */
    {
      num: 4, phase: 2, icon: "zap",
      part: "Part 3 — Building Interactive Applications",
      title: "Events & useState",
      short: "Events & useState",
      meeting: "Meeting 04 | Making UI Interactive",
      objective: "Siswa memahami React events, `useState`, dan cara perubahan state memperbarui tampilan.",
      blocks: [
        { h: "4.1 What is State?" },
        { p: "State adalah data yang disimpan oleh komponen React dan dapat berubah seiring interaksi pengguna atau proses aplikasi." },
        { analogy: "State seperti **papan skor** di lapangan. Ketika ada gol, petugas mengganti angka di papan skor, dan semua penonton langsung melihat skor baru. `setCount` adalah petugas yang mengganti angka itu.", title: "Papan skor pertandingan", icon: "🏟️" },
        { p: "Contoh:" },
        { code: `import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Count: {count}</h2>

      <button onClick={() => setCount((c) => c + 1)}>
        Increase
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
}

export default Counter;`, lang: "javascript", run: "counter4" },
        { p: "Penjelasan:" },
        { list: [
          "`count`: nilai state saat render berlangsung.",
          "`setCount`: function untuk meminta pembaruan state.",
          "`useState(0)`: membuat state dengan nilai awal 0.",
        ] },
        { viz: "renderCycle" },

        { h: "4.2 Why Not Update Variables Directly?" },
        { p: "Contoh yang tidak tepat:" },
        { code: `let count = 0;

function increase() {
  count++;
}`, lang: "javascript", bad: true },
        { p: "Mengubah variabel biasa seperti ini tidak memberi tahu React bahwa komponen perlu dirender ulang." },
        { p: "Gunakan setter dari `useState`." },
        { viz: "varVsState" },

        { h: "4.3 Handling Events" },
        { code: `function GreetingButton() {
  function handleClick() {
    alert("Welcome to React!");
  }

  return (
    <button onClick={handleClick}>
      Say Hello
    </button>
  );
}`, lang: "javascript", run: "greetBtn" },
        { p: "Perhatikan perbedaannya:" },
        { dos: [
          ["good", "`onClick={handleClick}`"],
          ["bad", "`onClick={handleClick()}`"],
        ] },
        { p: "Bentuk kedua langsung menjalankan function ketika ekspresi JSX dievaluasi." },
        { analogy: "`onClick={handleClick}` itu seperti **memberi nomor HP** ke temanmu: dia akan menelepon nanti, saat tombol diklik. `onClick={handleClick()}` itu seperti **langsung menelepon sekarang**, padahal belum ada yang klik.", title: "Simpan nomornya, jangan langsung telepon", icon: "📞" },

        { recap: [
          "State = data yang bisa berubah dan memicu render ulang.",
          "`const [count, setCount] = useState(0)`: nilai + setter + nilai awal.",
          "Variabel biasa tidak membuat layar berubah. Pakai setter.",
          "Berikan function ke event: `onClick={handleClick}`, bukan `handleClick()`.",
        ] },
      ],
      practice: {
        intro: "Buat **Student Voting App**. Fitur:",
        items: ["Dua kandidat.", "Tombol vote untuk setiap kandidat.", "Total vote.", "Reset vote.", "Menampilkan kandidat dengan vote tertinggi."],
        ordered: true,
      },
      challengeIntro: "Tambahkan aturan:",
      challenge: [
        "Nilai vote tidak boleh negatif.",
        "Berikan indikator ketika skor sama.",
        "Gunakan dua atau lebih komponen.",
      ],
      assess: [
        "Saya dapat menjelaskan state.",
        "Saya dapat menggunakan `useState`.",
        "Saya dapat menggunakan `onClick`.",
        "Saya memahami proses re-render secara konseptual.",
        "Saya dapat memperbarui state berdasarkan nilai sebelumnya.",
      ],
      deliverable: "student-voting-app",
      demo: "voting",
    },

    /* ---------------------------------------------------- 05 */
    {
      num: 5, phase: 2, icon: "clipboard-list",
      part: "Part 3 — Building Interactive Applications",
      title: "Forms & Controlled Inputs",
      short: "Forms & Controlled Inputs",
      meeting: "Meeting 05 | Working with User Input",
      objective: "Siswa dapat mengelola form dan input pengguna menggunakan React state.",
      blocks: [
        { h: "5.1 Controlled Components" },
        { p: "Controlled input adalah elemen form yang nilainya dikendalikan oleh React state." },
        { analogy: "Bayangkan **sekretaris kelas** yang mencatat setiap kata ketua kelas di buku notulen (state). Papan pengumuman (input) selalu menampilkan isi buku itu. Jadi isi papan dan isi buku tidak pernah berbeda.", title: "Sekretaris dan buku notulen", icon: "📝" },
        { code: `import { useState } from "react";

function StudentForm() {
  const [name, setName] = useState("");

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert("Name is required!");
      return;
    }

    alert(\`Welcome, \${name}!\`);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(event) =>
          setName(event.target.value)
        }
        placeholder="Enter your name"
      />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default StudentForm;`, lang: "javascript", title: "StudentForm.jsx", run: "form" },

        { viz: "controlledLoop" },
        { h: "5.2 Why preventDefault()?" },
        { p: "Secara default, browser dapat melakukan navigasi atau memuat ulang halaman ketika form HTML disubmit." },
        { p: "`event.preventDefault()` mencegah perilaku default tersebut sehingga kita dapat menangani submit melalui JavaScript." },
        { p: "Tanpa `preventDefault()`, halaman akan reload dan semua isi state hilang sebelum kamu sempat memprosesnya." },

        { h: "5.3 Form Validation" },
        { p: "Validasi sederhana meliputi:" },
        { list: ["Required fields.", "Minimum text length.", "Valid email format.", "Selecting predefined options.", "Showing error messages."] },

        { recap: [
          "Controlled input: `value` dari state, `onChange` mengubah state.",
          "`event.target.value` berisi teks yang sedang diketik.",
          "`event.preventDefault()` mencegah halaman reload saat submit.",
          "Validasi dulu sebelum memproses data, dan tampilkan pesan error yang jelas.",
        ] },
      ],
      practice: {
        intro: "Buat **Student Registration Form**. Fields:",
        items: ["Full Name", "Class", "Email", "Favorite Programming Language", "Motivation to Learn Coding"],
      },
      challenge: [
        "Semua field wajib diisi.",
        "Nama minimal tiga karakter.",
        "Tampilkan pesan error yang jelas.",
        "Setelah berhasil, tampilkan data siswa pada card.",
        "Tambahkan tombol reset form.",
      ],
      assess: [
        "Saya memahami controlled input.",
        "Saya mampu menggunakan `onChange`.",
        "Saya memahami `onSubmit`.",
        "Saya dapat membuat validasi.",
        "Saya mampu menampilkan feedback kepada pengguna.",
      ],
      deliverable: "student-registration",
      demo: "form",
    },

    /* ---------------------------------------------------- 06 */
    {
      num: 6, phase: 2, icon: "list-checks",
      part: "Part 3 — Building Interactive Applications",
      title: "State Lifting & CRUD Fundamentals",
      short: "State Lifting & CRUD",
      meeting: "Meeting 06 | Managing Shared Data",
      objective: "Siswa dapat mengelola daftar data, melakukan operasi CRUD, dan membagikan state antarkomponen.",
      blocks: [
        { h: "6.1 What is CRUD?" },
        { p: "CRUD adalah empat operasi dasar untuk mengelola data." },
        { table: {
          head: ["Operation", "Meaning", "Example"],
          rows: [
            ["**Create**", "Menambah data", "Add Task"],
            ["**Read**", "Membaca data", "Show Task List"],
            ["**Update**", "Mengubah data", "Edit / Complete Task"],
            ["**Delete**", "Menghapus data", "Remove Task"],
          ],
        } },

        { h: "6.2 Updating Arrays in State" },
        { code: `import { useState } from "react";

function TaskManager() {
  const [tasks, setTasks] = useState([]);

  function addTask(title) {
    const newTask = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    setTasks((previous) => [
      ...previous,
      newTask,
    ]);
  }

  function deleteTask(id) {
    setTasks((previous) =>
      previous.filter((task) => task.id !== id)
    );
  }

  function toggleTask(id) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  return (
    <div>
      <button onClick={() => addTask("Learn React")}>
        Add Example Task
      </button>

      {tasks.map((task) => (
        <div key={task.id}>
          <span>{task.title}</span>

          <button onClick={() => toggleTask(task.id)}>
            {task.completed ? "Undo" : "Complete"}
          </button>

          <button onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default TaskManager;`, lang: "javascript", title: "TaskManager.jsx", run: "tasks" },

        { analogy: "Mengubah state itu seperti **Save As** di Word: buat salinan baru yang sudah diedit, lalu serahkan ke React. Jangan mencoret dokumen asli (mutasi), karena React hanya mengecek *apakah dokumennya baru*.", title: "Save As, bukan coret-coret", icon: "📄" },
        { viz: "immutable" },
        { h: "6.3 What is Lifting State Up?" },
        { p: "Ketika dua komponen membutuhkan data yang sama, state biasanya ditempatkan di parent terdekat yang menaungi keduanya." },
        { p: "Contoh:" },
        { code: `TaskManager
├── TaskForm
│   └── onAddTask()
├── TaskFilters
│   └── currentFilter
└── TaskList
    ├── tasks
    ├── onComplete()
    └── onDelete()`, lang: "plaintext", title: "Lifting State Up" },
        { p: "Parent menjadi pemilik state, sementara child menerima data dan callback melalui props." },
        { analogy: "Seperti **wali kelas** yang memegang buku absen. Ketua kelas (TaskForm) melapor ke wali kelas kalau ada yang baru. Wali kelas mencatat, lalu memberi salinan daftar terbaru ke papan kelas (TaskList).", title: "Wali kelas pegang buku absen", icon: "👩‍🏫" },
        { viz: "liftState" },

        { recap: [
          "CRUD = Create, Read, Update, Delete.",
          "Jangan ubah array state secara langsung. Buat array baru: `[...tasks, baru]`, `map()`, `filter()`.",
          "Kalau beberapa komponen butuh data yang sama, simpan state di parent terdekat.",
          "Data turun lewat props, perubahan naik lewat callback.",
        ] },
      ],
      practice: {
        intro: "Bangun **Student Task Manager**. Minimum features:",
        items: ["Add task.", "View tasks.", "Edit task.", "Mark as completed.", "Delete task.", "Filter all, active, and completed tasks."],
      },
      challenge: [
        "Tambahkan priority: Low, Medium, High.",
        "Tambahkan counter tugas selesai.",
        "Tampilkan empty state.",
        "Pisahkan UI menjadi minimal tiga komponen.",
        "Pastikan semua update menggunakan state secara immutable.",
      ],
      assess: [
        "Saya memahami operasi CRUD.",
        "Saya mampu mengelola arrays dalam state.",
        "Saya dapat menggunakan `map()` dan `filter()` untuk update.",
        "Saya memahami konsep immutability.",
        "Saya mampu menerapkan lifting state up.",
      ],
      milestone: "Mini Project 02 Completed: Task Manager",
      demo: "tasks",
    },

    /* ---------------------------------------------------- 07 */
    {
      num: 7, phase: 3, icon: "globe",
      part: "Part 4 — Real-World React",
      title: "Fetching Data from APIs",
      short: "API & useEffect",
      meeting: "Meeting 07 | Connecting to External Data",
      objective: "Siswa dapat mengambil data dari API dan menangani loading, success, serta error states.",
      blocks: [
        { h: "7.1 What is an API?" },
        { p: "API (*Application Programming Interface*) memungkinkan aplikasi berkomunikasi dengan sistem lain." },
        { analogy: "API seperti **pelayan restoran**. Kamu (aplikasi React) tidak masuk ke dapur (server). Kamu memesan lewat pelayan (HTTP request), lalu pelayan membawakan makanan (data JSON). Kadang pesanan lama datang, kadang gagal, jadi aplikasi harus siap dengan *loading* dan *error*.", title: "Pelayan restoran", icon: "🍽️" },
        { p: "Contoh alur:" },
        { flow: ["React Application", "HTTP Request", "Public API", "JSON Response", "React State", "Rendered UI"] },

        { h: "7.2 Fetching Data with useEffect" },
        { code: `import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function loadUsers() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users",
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadUsers();

    return () => controller.abort();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name}
        </li>
      ))}
    </ul>
  );
}

export default UserList;`, lang: "javascript", title: "UserList.jsx", run: "users" },

        { viz: "fetchStates" },
        { h: "7.3 Understanding useEffect" },
        { p: "`useEffect` digunakan untuk menyinkronkan komponen dengan sistem eksternal, misalnya permintaan jaringan." },
        { p: "Tiga hal yang perlu dipahami:" },
        { olist: ["Effect function.", "Dependency array.", "Cleanup function."] },
        { viz: "effectLife" },
        { tip: "Jangan menggunakan `useEffect` untuk setiap perhitungan biasa. Jika nilai dapat dihitung langsung dari props atau state saat render, biasanya tidak perlu Effect.", kind: "warn" },

        { recap: [
          "API = cara aplikasi meminta data ke server. Hasilnya biasanya JSON.",
          "Selalu siapkan tiga keadaan: **loading**, **success**, **error**.",
          "`useEffect` berjalan setelah render, dan diulang hanya jika dependency berubah.",
          "Cleanup membatalkan pekerjaan lama sebelum effect diulang atau komponen hilang.",
        ] },
      ],
      practice: {
        intro: "Buat **Public API Explorer** menggunakan JSONPlaceholder atau API publik lainnya. Fitur:",
        items: ["Fetch data.", "Display data cards.", "Search/filter data.", "Loading indicator.", "Error message.", "Empty results message."],
      },
      challenge: [
        "Tambahkan tombol refresh.",
        "Tampilkan jumlah data.",
        "Buat pesan ketika koneksi gagal.",
        "Pisahkan logic API dari komponen presentasi.",
      ],
      assess: [
        "Saya memahami API dan JSON.",
        "Saya dapat menggunakan `fetch`.",
        "Saya memahami `async/await`.",
        "Saya memahami kegunaan `useEffect`.",
        "Saya dapat menangani loading dan error.",
        "Saya memahami alasan cleanup pada permintaan API.",
      ],
      deliverable: "public-api-explorer",
      demo: "api",
    },

    /* ---------------------------------------------------- 08 */
    {
      num: 8, phase: 3, icon: "route",
      part: "Part 4 — Real-World React",
      title: "React Router & Navigation",
      short: "React Router",
      meeting: "Meeting 08 | Building Multi-Page Experiences",
      objective: "Siswa dapat membangun navigasi antarhalaman menggunakan React Router.",
      blocks: [
        { h: "8.1 What is SPA?" },
        { p: "SPA berarti **Single Page Application**." },
        { p: "Dalam aplikasi React, perpindahan antarhalaman dapat dilakukan melalui client-side routing tanpa selalu memuat ulang seluruh dokumen HTML." },
        { analogy: "Website biasa seperti **membuka file presentasi baru** setiap pindah topik. SPA seperti **pindah slide** di file yang sama: cepat, dan semua yang sudah terbuka tetap di tempatnya.", title: "Pindah slide, bukan buka file baru", icon: "🎞️" },
        { viz: "spaVsMpa" },

        { h: "8.2 Install React Router" },
        { code: `npm install react-router`, lang: "bash", title: "Terminal" },

        { h: "8.3 Basic Routing" },
        { p: "Dalam `main.jsx`, bungkus aplikasi dengan BrowserRouter." },
        { code: `import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);`, lang: "javascript", title: "src/main.jsx" },
        { p: "Kemudian `App.jsx`:" },
        { code: `import {
  Routes,
  Route,
  Link,
} from "react-router";

function Home() {
  return <h1>Home Page</h1>;
}

function Students() {
  return <h1>Student Directory</h1>;
}

function App() {
  return (
    <>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/students">Students</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/students"
          element={<Students />}
        />
        <Route
          path="*"
          element={<h1>404 — Page Not Found</h1>}
        />
      </Routes>
    </>
  );
}

export default App;`, lang: "javascript", title: "src/App.jsx", run: "router" },

        { h: "8.4 Dynamic Routes" },
        { p: "React Router juga mendukung URL dinamis." },
        { p: "Contoh:" },
        { code: `/students/1
/students/2
/students/3`, lang: "plaintext", title: "URL" },
        { p: "Gunakan route parameter untuk mengidentifikasi siswa berdasarkan ID." },
        { viz: "routeMatch" },

        { recap: [
          "SPA mengganti konten tanpa memuat ulang seluruh halaman.",
          "`<BrowserRouter>` membungkus aplikasi, `<Routes>` + `<Route>` memetakan URL ke komponen.",
          "Pakai `<Link>` untuk pindah halaman, bukan `<a href>`.",
          "`/students/:id` + `useParams()` untuk halaman detail.",
        ] },
      ],
      practice: {
        intro: "Buat aplikasi dengan empat halaman:",
        items: ["Home", "Students", "Tasks", "About"],
        ordered: true,
      },
      challenge: [
        "Buat navbar.",
        "Tandai menu yang sedang aktif.",
        "Buat halaman 404.",
        "Tambahkan halaman detail siswa.",
      ],
      assess: [
        "Saya memahami konsep SPA.",
        "Saya dapat menginstal React Router.",
        "Saya dapat menggunakan Link.",
        "Saya dapat membuat Routes dan Route.",
        "Saya memahami konsep dynamic routing.",
      ],
      deliverable: "school-multipage-app",
      demo: "router",
    },

    /* ---------------------------------------------------- 09 */
    {
      num: 9, phase: 3, icon: "database",
      part: "Part 4 — Real-World React",
      title: "Local Storage & Reusable Logic",
      short: "Local Storage & Custom Hooks",
      meeting: "Meeting 09 | Keeping Data After Refresh",
      objective: "Siswa mampu menyimpan data sederhana pada browser dan memahami dasar reusable logic melalui custom hooks.",
      blocks: [
        { h: "9.1 What is Local Storage?" },
        { p: "Local Storage adalah fitur browser yang menyimpan data berbentuk string pada perangkat pengguna untuk origin website tertentu." },
        { analogy: "State itu seperti **tulisan di papan tulis**: dihapus setiap kali kelas selesai (halaman di-refresh). Local Storage seperti **buku catatan di laci meja**: besok masih ada. Karena laci hanya muat teks, array dan object harus \"dilipat\" dulu jadi teks dengan `JSON.stringify`.", title: "Papan tulis vs buku di laci", icon: "🗄️" },
        { p: "Contoh:" },
        { code: `localStorage.setItem("name", "Ahmad");

const name = localStorage.getItem("name");

console.log(name);`, lang: "javascript", run: "lsName" },
        { p: "Untuk menyimpan array atau object:" },
        { code: `const tasks = [
  { id: 1, title: "Learn React" },
];

localStorage.setItem(
  "tasks",
  JSON.stringify(tasks)
);`, lang: "javascript", run: "lsTasks" },
        { p: "Untuk membaca kembali:" },
        { code: `const savedTasks = JSON.parse(
  localStorage.getItem("tasks") || "[]"
);`, lang: "javascript", run: "lsRead" },

        { h: "9.2 Combining React State & Local Storage" },
        { code: `import { useEffect, useState } from "react";

function Notes() {
  const [note, setNote] = useState(() => {
    return localStorage.getItem("my-note") || "";
  });

  useEffect(() => {
    localStorage.setItem("my-note", note);
  }, [note]);

  return (
    <textarea
      value={note}
      onChange={(event) =>
        setNote(event.target.value)
      }
      placeholder="Write your note..."
    />
  );
}

export default Notes;`, lang: "javascript", title: "Notes.jsx", run: "notes" },
        { p: "Lazy initialization membantu membaca nilai awal ketika state dibuat." },

        { viz: "storageCycle" },
        { h: "9.3 Introduction to Custom Hooks" },
        { p: "Custom hooks adalah function yang diawali dengan `use` dan menggunakan React Hooks untuk membagikan logic antarkomponen." },
        { analogy: "Custom hook seperti **resep andalan** yang ditulis sekali, lalu bisa dipakai di dapur mana saja. Komponen `Notes`, `Tasks`, atau `Settings` cukup memanggil `useLocalStorage` tanpa menulis ulang logic simpan-baca.", title: "Resep yang bisa dipakai ulang", icon: "📒" },
        { p: "Contoh `useLocalStorage`:" },
        { code: `import { useEffect, useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);

    if (saved === null) return initialValue;

    try {
      return JSON.parse(saved);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      key,
      JSON.stringify(value)
    );
  }, [key, value]);

  return [value, setValue];
}`, lang: "javascript", title: "src/hooks/useLocalStorage.js" },
        { p: "Contoh ini digunakan untuk memperkenalkan reusable logic pada aplikasi browser sederhana." },
        { tip: "Jangan menyimpan password, token rahasia, atau informasi sensitif pada Local Storage. Data juga tidak otomatis tersinkron antarperangkat.", kind: "warn" },

        { recap: [
          "State hilang saat refresh. Local Storage tetap ada di browser.",
          "Simpan dengan `JSON.stringify`, baca dengan `JSON.parse`.",
          "Lazy initialization `useState(() => …)` membaca data hanya sekali saat awal.",
          "Custom hook (`useSesuatu`) = logic yang dibungkus supaya bisa dipakai ulang. Jangan simpan data rahasia di Local Storage.",
        ] },
      ],
      practice: {
        intro: "Bangun **Student Notes App**. Fitur:",
        items: ["Create note.", "Edit note.", "Delete note.", "Save to Local Storage.", "Load saved notes.", "Search notes."],
      },
      challenge: [
        "Tambahkan waktu pembuatan note.",
        "Tambahkan kategori note.",
        "Buat reusable `useLocalStorage` hook.",
        "Tambahkan tombol clear all dengan konfirmasi.",
      ],
      assess: [
        "Saya memahami Local Storage.",
        "Saya dapat menggunakan JSON.stringify.",
        "Saya dapat menggunakan JSON.parse.",
        "Saya memahami penyimpanan data yang persisten.",
        "Saya memahami dasar custom hooks.",
      ],
      milestone: "Mini Project 03 Completed: Student Notes / API Explorer Extension",
      demo: "notes",
    },

    /* ---------------------------------------------------- 10 */
    {
      num: 10, phase: 4, icon: "palette",
      part: "Part 5 — Build & Ship",
      title: "Styling, Tailwind CSS & Project Structure",
      short: "Tailwind CSS & Architecture",
      meeting: "Meeting 10 | Building a Modern Dashboard UI",
      objective: "Siswa mampu membuat UI responsif dan mengorganisasi komponen dengan rapi.",
      blocks: [
        { h: "10.1 Styling Options in React" },
        { p: "Beberapa pendekatan styling:" },
        { list: ["Regular CSS", "CSS Modules", "Inline Styles", "Utility-first CSS seperti Tailwind"], cols: true },
        { p: "Untuk program ini, kita menggunakan **Tailwind CSS**." },

        { h: "10.2 Installing Tailwind CSS" },
        { code: `npm install tailwindcss @tailwindcss/vite`, lang: "bash", title: "Terminal" },
        { p: "Konfigurasi `vite.config.js`:" },
        { code: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});`, lang: "javascript", title: "vite.config.js" },
        { p: "Tambahkan ke `src/index.css`:" },
        { code: `@import "tailwindcss";`, lang: "css", title: "src/index.css" },

        { h: "10.3 Using Tailwind" },
        { code: `function WelcomeCard() {
  return (
    <div className="rounded-2xl bg-blue-50 p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-blue-900">
        Welcome, Student!
      </h2>

      <p className="mt-2 text-slate-600">
        Keep building amazing things.
      </p>
    </div>
  );
}

export default WelcomeCard;`, lang: "javascript", title: "WelcomeCard.jsx", run: "welcome" },

        { viz: "utilityAnatomy" },
        { h: "10.4 Responsive Design" },
        { p: "Contoh:" },
        { code: `<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>`, lang: "javascript", run: "grid" },
        { list: ["Mobile: satu kolom.", "Medium screen dan lebih besar: tiga kolom."] },
        { p: "Awalan `md:` artinya: berlaku mulai layar medium (lebar 768px ke atas). Tailwind berpikir **mobile-first**: tulis gaya untuk HP dulu, lalu tambahkan awalan seperti `md:` atau `lg:` untuk layar yang lebih besar." },

        { h: "10.5 Recommended Folder Structure" },
        { code: `src/
├── assets/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   └── StatCard.jsx
├── pages/
│   ├── Home.jsx
│   ├── Students.jsx
│   └── Tasks.jsx
├── hooks/
│   └── useLocalStorage.js
├── data/
│   └── students.js
├── App.jsx
├── index.css
└── main.jsx`, lang: "plaintext", title: "Folder Structure" },
        { p: "Struktur ini adalah contoh yang dapat disesuaikan. Tidak semua proyek harus memiliki folder yang sama." },

        { recap: [
          "Tailwind = utility class kecil yang digabung langsung di `className`.",
          "Mobile-first: gaya tanpa awalan untuk HP, `md:` / `lg:` untuk layar besar.",
          "Buat komponen UI yang reusable, misalnya `StatCard`.",
          "Rapikan folder: `components/`, `pages/`, `hooks/`, `data/`.",
        ] },
      ],
      practice: {
        intro: "Buat dashboard layout:",
        items: ["Header.", "Sidebar / Navigation.", "Statistics cards.", "Main content.", "Footer."],
      },
      challenge: [
        "Gunakan tema putih, navy, dan kuning keemasan.",
        "Pastikan layout responsif.",
        "Buat reusable `StatCard`.",
        "Tambahkan empty state yang informatif.",
      ],
      assess: [
        "Saya dapat menginstal Tailwind CSS.",
        "Saya memahami utility classes.",
        "Saya dapat membuat layout responsive.",
        "Saya dapat menyusun folder proyek dengan rapi.",
        "Saya memahami manfaat reusable UI components.",
      ],
      deliverable: "school-dashboard-layout",
      demo: "responsive",
    },

    /* ---------------------------------------------------- 11 */
    {
      num: 11, phase: 4, icon: "trophy",
      part: "Part 5 — Build & Ship",
      title: "Final Project Development",
      short: "Final Project",
      meeting: "Meeting 11 | Integrating Everything",
      objective: "Siswa mampu mengintegrasikan pengetahuan React menjadi satu aplikasi lengkap.",
      blocks: [
        { banner: "🏆 Final Project: HSI-BS School Dashboard", text: "Kalian akan membangun dashboard sekolah sederhana menggunakan React." },
        { h: "11.1 Project Features" },
        { features: [
          ["house", "Dashboard Home", ["Welcome message.", "Statistics cards.", "Task summary.", "Student information summary."]],
          ["users", "Student Directory", ["Student list.", "Search student.", "Filter by class.", "Student detail page."]],
          ["circle-check", "Task Management", ["Add task.", "Edit task.", "Complete task.", "Delete task.", "Task status filtering.", "Local Storage persistence."]],
          ["chart-column", "Statistics", ["Total students.", "Total tasks.", "Completed tasks.", "Basic data visualization menggunakan Chart.js."]],
          ["compass", "Navigation", ["React Router.", "Active navigation indication.", "Not Found page."]],
          ["smartphone", "Responsive Design", ["Mobile-friendly.", "Desktop-friendly.", "Consistent styling."]],
        ] },

        { viz: "projectMap" },
        { h: "11.2 Project Architecture" },
        { code: `HSI-BS School Dashboard
│
├── Home Page
│   ├── Welcome Banner
│   ├── Stats Cards
│   └── Task Overview
│
├── Students Page
│   ├── Search Bar
│   ├── Class Filter
│   ├── Student List
│   └── Student Detail
│
├── Tasks Page
│   ├── Task Form
│   ├── Task Filters
│   └── Task List
│
└── About Page`, lang: "plaintext", title: "Architecture" },

        { h: "11.3 Project Workflow" },
        { steps: [
          ["Planning", "Buat daftar fitur dan sketsa tampilan."],
          ["Component Breakdown", "Identifikasi komponen yang dapat digunakan kembali."],
          ["Build Static UI", "Bangun tampilan dengan JSX dan Tailwind."],
          ["Add Interaction", "Gunakan props, events, dan state."],
          ["Connect Data", "Hubungkan dummy data, API jika diperlukan, dan Local Storage."],
          ["Test", "Periksa setiap fitur secara manual."],
          ["Refactor", "Rapikan kode, penamaan, dan struktur file."],
        ] },

        { h: "11.4 Code Quality Checklist" },
        { checklist: [
          "Components have meaningful names.",
          "State is updated correctly.",
          "Lists have stable keys.",
          "No unnecessary direct DOM manipulation.",
          "Forms have validation.",
          "Loading and error states are handled.",
          "Layout works on mobile.",
          "No unnecessary console errors.",
          "No sensitive credentials in source code.",
        ], key: "quality" },

        { recap: [
          "Final project menggabungkan semua bab, tanpa materi baru.",
          "Rencanakan dulu: fitur, halaman, komponen, dan data.",
          "Kerjakan sedikit demi sedikit, commit sesering mungkin.",
          "Cek checklist kualitas kode sebelum Demo Day.",
        ] },
      ],
      practice: {
        intro: "Bangun **HSI-BS School Dashboard** mengikuti 7 langkah Project Workflow di atas — dari planning hingga refactor.",
      },
      challengeIntro: "Tambahkan minimal satu fitur unik yang tidak dicontohkan mentor. Contoh:",
      challenge: ["Dark mode.", "Favorite students.", "Task priority.", "Search by skill.", "User profile settings."],
      challengeUnordered: true,
      assess: [
        "Saya sudah membuat daftar fitur dan sketsa tampilan.",
        "Saya sudah memecah UI menjadi komponen reusable.",
        "Fitur utama aplikasi saya sudah berfungsi.",
        "Saya sudah menguji setiap fitur secara manual.",
        "Saya sudah menambahkan minimal satu fitur unik.",
      ],
      deliverable: "Functional final project",
      demo: "planner",
    },

    /* ---------------------------------------------------- 12 */
    {
      num: 12, phase: 4, icon: "cloud-upload",
      part: "Part 5 — Build & Ship",
      title: "Deployment, Presentation & Demo Day",
      short: "Deployment & Demo Day",
      meeting: "Meeting 12 | From Localhost to the Internet",
      objective: "Siswa dapat mempublikasikan aplikasi dan menjelaskan hasil pengembangannya.",
      blocks: [
        { h: "12.1 Production Build" },
        { p: "Jalankan:" },
        { code: `npm run build`, lang: "bash", title: "Terminal" },
        { p: "Vite akan menghasilkan folder `dist/` berisi hasil production build." },
        { analogy: "`npm run dev` itu seperti **dapur saat memasak**: berantakan tapi enak untuk mencoba-coba. `npm run build` itu **mengemas makanan ke kotak** yang rapi dan ringan, siap dikirim ke pembeli (hosting).", title: "Dapur vs kotak bekal", icon: "🍱" },
        { viz: "buildShrink" },
        { p: "Untuk memeriksa secara lokal:" },
        { code: `npm run preview`, lang: "bash", title: "Terminal" },
        { p: "Pastikan seluruh fitur berjalan sebelum deployment." },

        { h: "12.2 Deployment" },
        { p: "Platform yang bisa digunakan: **Vercel** dan **Netlify**." },
        { p: "Secara umum:" },
        { olist: [
          "Push repository ke GitHub.",
          "Hubungkan repository ke platform hosting.",
          "Gunakan build command `npm run build`.",
          "Gunakan output directory `dist`.",
          "Jalankan deployment.",
          "Periksa URL hasil deployment.",
        ] },
        { tip: "Untuk aplikasi dengan client-side routing, pastikan hosting dikonfigurasi agar deep link menuju aplikasi React, bukan menghasilkan server-side 404.", kind: "warn" },

        { h: "12.3 Writing README.md" },
        { p: "Contoh:" },
        { code: `# HSI-BS School Dashboard

A student dashboard built with React.js.

## Features

- Student Directory
- Task Manager
- Statistics
- Responsive UI

## Tech Stack

- React.js
- Vite
- Tailwind CSS
- React Router

## Installation

\`\`\`bash
npm install
npm run dev
\`\`\``, lang: "markdown", title: "README.md" },
        { p: "README juga sebaiknya memuat screenshot, fitur utama, dan link demo aplikasi." },

        { h: "🎤 Demo Day Presentation" },
        { p: "Setiap siswa atau kelompok mempresentasikan:" },
        { olist: [
          "Project introduction.",
          "Problem and proposed solution.",
          "Application features.",
          "Live demonstration.",
          "React concepts used.",
          "Challenges and lessons learned.",
        ] },
        { tip: "**Recommended presentation time:** 5–7 menit per kelompok.", kind: "tip" },

        { recap: [
          "`npm run build` menghasilkan folder `dist/` yang siap online. Cek dulu dengan `npm run preview`.",
          "Deploy: push ke GitHub → hubungkan ke Vercel/Netlify → build `npm run build`, output `dist`.",
          "Aplikasi dengan router butuh pengaturan rewrite supaya deep link tidak 404.",
          "README yang baik + presentasi yang jelas = proyekmu mudah dipahami orang lain.",
        ] },
      ],
      practice: {
        intro: "Build, preview, dan deploy **HSI-BS School Dashboard** ke Vercel atau Netlify. Lengkapi dengan README.md yang memuat screenshot, fitur utama, dan link demo.",
      },
      challengeIntro: "**Final Challenge** — Setiap siswa harus dapat menjelaskan (klik kartu untuk petunjuk):",
      flipChallenge: [
        ["Mengapa aplikasi menggunakan components?", "Agar UI terbagi menjadi bagian kecil yang punya tampilan & logika sendiri, mudah dikelola, dan bisa dipakai ulang. Build small, combine later."],
        ["Apa perbedaan props dan state?", "Props = data dari parent, read-only. State = data milik komponen yang dapat berubah dan memicu re-render lewat setter."],
        ["Bagaimana data berpindah antarkomponen?", "Dari parent ke child lewat props. Child mengirim perubahan ke atas lewat callback. State dibagikan dengan lifting state up."],
        ["Bagaimana CRUD diterapkan?", "Create dengan spread `[...prev, item]`, Read dengan `map()`, Update dengan `map()` + spread object, Delete dengan `filter()` — semuanya immutable."],
        ["Bagaimana data tetap tersimpan setelah refresh?", "State disimpan ke Local Storage dengan `JSON.stringify` dan dibaca lagi dengan `JSON.parse` saat lazy initialization (mis. hook `useLocalStorage`)."],
        ["Bagaimana routing bekerja?", "React Router mencocokkan URL dengan `<Route path>` di client-side, `<Link>` berpindah halaman tanpa reload penuh, `path=\"*\"` untuk 404."],
        ["Apa bagian tersulit dari proyek?", "Refleksi pribadi: ceritakan masalahnya, cara kalian debug, dan pelajaran yang didapat."],
      ],
      assess: [
        "Saya dapat menjalankan `npm run build` dan `npm run preview`.",
        "Saya berhasil mendeploy aplikasi ke Vercel/Netlify.",
        "Saya sudah menulis README.md yang lengkap.",
        "Saya siap presentasi 5–7 menit di Demo Day.",
        "Saya dapat menjawab seluruh pertanyaan Final Challenge.",
      ],
      milestone: "Final Project Completed: HSI-BS School Dashboard",
      demo: "deploy",
    },
  ],

  quickRef: [
    ["code", "JSX", "Menulis markup di JavaScript"],
    ["puzzle", "Component", "Reusable UI building block"],
    ["arrow-right", "Props", "Mengirim data antar komponen"],
    ["database", "State", "Menyimpan data yang dapat berubah"],
    ["zap", "useState", "Menambahkan state ke komponen"],
    ["hand", "Event Handler", "Menangani interaksi"],
    ["list-checks", "map()", "Menampilkan list"],
    ["filter", "filter()", "Memfilter data"],
    ["git-branch", "Conditional Rendering", "Menampilkan UI berdasarkan kondisi"],
    ["refresh-cw", "useEffect", "Sinkronisasi dengan sistem eksternal"],
    ["wrench", "Custom Hook", "Menggunakan kembali logic"],
    ["route", "React Router", "Navigasi"],
    ["hard-drive", "Local Storage", "Penyimpanan browser"],
    ["palette", "Tailwind CSS", "Styling UI"],
    ["rocket", "Vite", "Development dan build tooling"],
  ],

  mistakes: [
    { title: "Mutating State Directly",
      bad: `tasks.push(newTask);
setTasks(tasks);`,
      good: `setTasks((prev) => [...prev, newTask]);` },
    { title: "Forgetting Keys",
      bad: `items.map((item) => <p>{item.name}</p>)`,
      good: `items.map((item) => (
  <p key={item.id}>{item.name}</p>
))` },
    { title: "Invoking Event Handler Immediately",
      bad: `<button onClick={handleClick()}>`,
      good: `<button onClick={handleClick}>` },
    { title: "Using Props as Mutable Data",
      bad: `function Student({ student }) {
  student.name = "Changed";
}`,
      goodText: "Kirim pembaruan melalui callback ke komponen pemilik state." },
    { title: "Using useEffect for Everything",
      badText: "Jangan menggunakan Effect hanya untuk menghitung data turunan.",
      good: `const completedTasks = tasks.filter(
  (task) => task.completed
);`,
      goodNote: "Lebih sederhana — tidak memerlukan Effect." },
  ],

  ai: {
    allowed: [
      "Menjelaskan konsep yang belum dipahami.",
      "Memberikan petunjuk debugging.",
      "Menjelaskan error messages.",
      "Memberikan feedback terhadap kode.",
      "Menyarankan perbaikan readability.",
      "Membantu membaca dokumentasi.",
    ],
    limited: [
      "Generate complete components.",
      "Refactor banyak file sekaligus.",
      "Generate keseluruhan struktur aplikasi.",
    ],
    limitedNote: "Penggunaan semacam ini perlu mengikuti arahan mentor dan siswa tetap harus memahami hasilnya.",
    notAllowed: [
      "Menyerahkan proyek AI sepenuhnya sebagai karya pribadi tanpa memahami kode.",
      "Menyalin solusi challenge tanpa mencoba.",
      "Menggunakan AI untuk menghindari proses belajar.",
      "Membagikan data pribadi, password, atau credential ke AI.",
    ],
    golden: "AI can help you write code, but you must be able to explain what your code does.",
    scenarios: [
      ["Kamu bingung kenapa muncul error \"Each child in a list should have a unique key prop\", lalu minta AI menjelaskan artinya.", "allowed"],
      ["Kamu minta AI membuatkan seluruh aplikasi final project, lalu mengumpulkannya tanpa membaca kodenya.", "no"],
      ["Mentor mengizinkan generate satu komponen `StatCard`, lalu kamu pelajari dan jelaskan setiap barisnya.", "limited"],
      ["Kamu menempelkan password akun GitHub ke chat AI supaya dibantu deploy.", "no"],
      ["Kamu minta AI memberi feedback tentang penamaan variabel agar kodenya lebih mudah dibaca.", "allowed"],
      ["Belum mencoba sama sekali, kamu langsung menyalin solusi challenge dari AI.", "no"],
      ["Kamu minta AI merapikan (refactor) seluruh folder proyek sekaligus, sesuai arahan mentor.", "limited"],
      ["Kamu minta AI membantu memahami bagian dokumentasi React tentang `useEffect`.", "allowed"],
    ],
  },

  rubric: [
    ["Concept Understanding", 25],
    ["Coding Practice & Challenges", 30],
    ["Mini Projects", 20],
    ["Final Project & Presentation", 25],
  ],
  levels: [
    [90, "🌟", "Excellent", "Mandiri, memahami konsep, kode rapi"],
    [80, "🚀", "Proficient", "Fitur berfungsi, konsep cukup kuat"],
    [70, "👍", "Developing", "Sebagian konsep masih perlu latihan"],
    [0, "🔄", "Needs Improvement", "Memerlukan pendampingan tambahan"],
  ],
  competency: [
    "Siswa mampu membuat aplikasi React tanpa mengikuti tutorial langkah demi langkah.",
    "Siswa mampu menjelaskan props, state, dan event handling.",
    "Siswa mampu melakukan debugging dasar.",
    "Siswa mampu membuat aplikasi yang interaktif dan responsif.",
  ],

  resources: [
    ["book-open", "React Official Documentation", "https://react.dev/learn"],
    ["book-marked", "React Documentation — Bahasa Indonesia", "https://id.react.dev/learn"],
    ["zap", "Vite Documentation", "https://vite.dev/guide/"],
    ["package", "Bun Documentation (opsional)", "https://bun.com/docs/installation"],
    ["route", "React Router Documentation", "https://reactrouter.com/start/declarative/installation"],
    ["palette", "Tailwind CSS Documentation", "https://tailwindcss.com/docs/installation/using-vite"],
    ["code", "JavaScript MDN", "https://developer.mozilla.org/en-US/docs/Web/JavaScript"],
    ["git-branch", "GitHub Documentation", "https://docs.github.com/"],
  ],
};

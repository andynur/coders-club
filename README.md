# Coders Club — HSI Boarding School Purworejo

Landing page interaktif untuk **Coders Club HSI Boarding School Purworejo**, komunitas belajar teknologi bagi siswa yang ingin mengenal coding, membangun proyek, melatih kemampuan problem solving, dan mempersiapkan diri menghadapi kompetisi IT.

Tampilan website menggunakan pendekatan visual yang ceria dan *game-like*: warna kontras, kartu interaktif, emoji, serta animasi ringan untuk membuat pengalaman belajar terasa lebih menyenangkan.

## Fitur utama

- Desain responsif untuk desktop, tablet, dan perangkat mobile.
- Tema terang dan gelap dengan preferensi yang tersimpan di browser.
- Logo berwarna untuk tema terang dan logo putih untuk tema gelap.
- Hero interaktif dengan pilihan misi belajar.
- Efek emoji ketika tombol dan kartu misi dipilih.
- Animasi elemen saat masuk ke area pandang.
- Navigasi aktif berdasarkan bagian halaman yang sedang dibaca.
- Menu mobile dan FAQ berbentuk accordion.
- Dukungan `prefers-reduced-motion` untuk pengguna yang mengurangi animasi.

## Bagian halaman

1. Hero dan pilihan misi.
2. Tentang Coders Club.
3. Program dan alur belajar.
4. Pilihan proyek latihan.
5. Competition Track.
6. Benefit untuk anggota.
7. Profil mentor.
8. FAQ dan ajakan bergabung.

## Teknologi

Proyek ini dibuat tanpa framework atau proses build tambahan:

- HTML5
- CSS3
- JavaScript vanilla
- Google Fonts — Nunito
- Local Storage untuk menyimpan tema
- Intersection Observer untuk animasi dan navigasi aktif

## Struktur proyek

```text
.
├── index.html       # Struktur dan konten landing page
├── style.css        # Design system, layout, tema, dan animasi
├── script.js        # Interaksi, tema, menu, dan efek visual
├── logo-color.png   # Logo untuk tema terang
├── logo-white.png   # Logo untuk tema gelap
└── README.md        # Dokumentasi proyek
```

## Menjalankan secara lokal

Karena proyek ini berupa website statis, halaman dapat dibuka langsung melalui `index.html`. Namun, penggunaan server lokal lebih disarankan agar perilakunya menyerupai lingkungan produksi.

Jalankan perintah berikut dari direktori proyek:

```bash
python3 -m http.server 4173
```

Kemudian buka:

```text
http://localhost:4173
```

Server dapat dihentikan dengan menekan `Ctrl+C` pada terminal.

## Kustomisasi

Design token utama berada di bagian `:root` pada `style.css`. Warna, radius, bayangan, ukuran container, serta nilai untuk tema gelap dapat diperbarui dari bagian tersebut.

Konten halaman dapat disunting langsung melalui `index.html`, sedangkan teks respons pada pilihan misi hero berada pada objek `missionCopy` di `script.js`.

## Kredit

Dikembangkan untuk **Coders Club — HSI Boarding School Purworejo**.

# MONICA KARTIKA INDAH RIYANTI (MONIC) - VENOM SYMBIOTE TECH HUB
### Portofolio Interaktif TKJ & Asisten AI Real-Time Google | Kelas 12 SMK Bangun Nusa Bangsa

Website portofolio beresolusi tinggi (HD) bertema symbiote **Marvel Venom**, dirancang khusus untuk memamerkan keahlian **Teknik Komputer & Jaringan (TKJ)**, **Mikrotik**, **Web Server**, **Coding**, **Video Editing**, dan **Desain Grafis** milik **Monica Kartika Indah Riyanti (Monic)**.

Dilengkapi dengan **Asisten AI Cerdas bertenaga Google Gen AI SDK (`@google/genai`)**, **Google Search Grounding real-time**, **integrasi Function Calling layanan Google**, serta **sensor kamera pelacak wajah (Face Tracking)** untuk Chibi Venom!

---

## 🌟 Fitur Baru & Pembaruan Sistem

### 1. 🤖 Asisten Venom dengan Google Search Grounding & Ekosistem Google
- **Identitas & Peran**: Bernama resmi **Asisten Venom**, asisten symbiote yang cerdas, adaptif, proaktif, dan ramah menyapa setiap tamu yang mengunjungi website Monic.
- **System Prompt Khusus & Modular**: Tersimpan di `src/prompts/assistantSystemPrompt.js` dan `src/prompts/assistantSystemPrompt.ts` dengan instruksi penalaran adaptif, pembagian langkah kompleks, verifikasi mandiri, data lengkap SMK Bangun Nusa Bangsa, evaluasi PKL (80%), dan integrasi Google.
- **Google Search Grounding**: Menggunakan tool `googleSearch` resmi dari Gemini API (`gemini-2.5-flash`) sehingga asisten AI dapat mencari informasi terkini, berita, dan fakta real-time di Google secara otomatis tanpa mengarang data.
- **Arsitektur Modular Google Services (`src/services/googleToolsRegistry.js`)**:
  - `searchGoogleMaps`: Mencari lokasi, alamat, atau rute rujukan (misal: rute ke SMK Bangun Nusa Bangsa & PT Dwi Prima Rezeky).
  - `searchYouTubeVideos`: Mencari video tutorial dan referensi teknikal di YouTube.
  - `checkGoogleCalendarEvents`: Cek agenda & jadwal kegiatan.
  - `listGmailMessages`: Pengecekan pesan masuk via OAuth.
  - `searchGoogleDriveFiles`: Penelusuran berkas dokumen Google Drive.
- **Keamanan Kunci API**: Kunci API disimpan aman melalui file environment `.env` (`GEMINI_API_KEY`) atau dapat diatur langsung melalui tombol pengaturan ⚙️ di jendela chat web.

### 2. 📷 Sensor Kamera Muka (Face Tracking) untuk Chibi Venom
- **Venom Mengikuti Arah Wajah**: Chibi Venom kini dapat mengakses kamera web secara interaktif!
- **Deteksi Gerakan Kepala Real-Time**:
  - Jika wajah pengguna bergerak/menoleh ke **kanan**, Chibi Venom langsung berputar dan melangkah ke **kanan**.
  - Jika wajah pengguna bergerak/menoleh ke **kiri**, Chibi Venom langsung berputar dan melangkah ke **kiri**.
  - Dilengkapi mini **Cyber Camera HUD** di pojok kiri bawah dengan indikator crosshair, visual scanning target, dan status arah deteksi.
  - Kamera dapat dinyalakan/dimatikan dengan satu klik melalui tombol `📷 Sensor Kamera Muka`.

### 3. 📸 Foto Asli Monic di Bagian Depan (Hero Section)
- Foto asli Monic (`assets/monic-photo.jpg`) disematkan dengan ukuran yang kompak, rapi, dan estetis (*small & tasteful*) di header utama.
- Diberi bingkai cyber gradien *cyan-purple-red*, indikator denyut host aktif (*green ping indicator*), dan label *HOST TERVERIFIKASI • MONICA*.

### 4. 🎬 Fitur Unggulan Lainnya
- **Visual HD Marvel Venom**: Palet warna Obsidian Black, Toxic Cyan, Symbiote Purple, dan Crimson Blood dengan animasi partikel.
- **Efek Menu Venom Kelindes (Squash & Splat)**: Klik pada menu memunculkan kepala Venom yang kelindes/gepeng dengan suara komik dan partikel cipratan cairan symbiote tanpa lag (terakselerasi GPU).
- **Simulator Winbox Mikrotik & Live Server Monitor**: Terminal interaktif RouterOS (`/ip address print`, `/queue simple print`, `/ping 8.8.8.8`, dll.) dan telemetri Nginx.
- **Data & Link Lengkap**: Data resmi SMK Bangun Nusa Bangsa (Kepala Sekolah Bpk. Muhammad Yunus, dewan guru, 3 jurusan: TKJ, AKL, TKRO, akreditasi A) dan evaluasi PKL PT Dwi Prima Rezeky dengan kedisiplinan **80% (Baik & Tanggap)** beserta tautan yang dapat diklik langsung.
- **Database Jaringan & Server Lab TKJ (Pengganti Login)**: Repositori node jaringan interaktif (Router Core, Web Server Nginx, Switch FO, DNS Server) lengkap dengan filter kategori, pencarian node, dan tombol salin IP cepat.

---

## 📁 Struktur Proyek

```
monica/
├── .env                              # Konfigurasi environment (GEMINI_API_KEY, PORT)
├── .env.example                      # Contoh template konfigurasi environment
├── package.json                      # Konfigurasi npm & dependensi (@google/genai, express, cors)
├── server.js                         # Backend server Express dengan endpoint /api/chat & /api/health
├── index.html                        # Frontend web portofolio HD & antarmuka interaktif
├── style.css                         # Styling tema Marvel Venom, efek kelindes & HUD kamera
├── app.js                            # Engine interaktif: Chibi walk, Face tracking, AI Client
├── README.md                         # Dokumentasi lengkap
├── assets/
│   └── monic-photo.jpg               # Foto asli Monica Kartika Indah Riyanti
└── src/
    ├── prompts/
    │   ├── assistantSystemPrompt.js  # File modular system prompt (JavaScript ESM)
    │   └── assistantSystemPrompt.ts  # File modular system prompt (TypeScript)
    └── services/
        ├── geminiService.js          # Service Gemini 2.5 Flash + Google Search Grounding
        └── googleToolsRegistry.js    # Registry function calling layanan Google (Maps, YouTube, dll)
```

---

## 🚀 Cara Menjalankan

### Cara 1: Menjalankan Backend Cerdas (Rekomendasi untuk Grounding Real-Time)
1. Buka terminal di folder project ini (`c:\Users\USER\Desktop\monica`).
2. Masukkan API Key Gemini Anda di file `.env`:
   ```env
   GEMINI_API_KEY=AIzaSy...
   PORT=3001
   ```
3. Pasang dependensi jika belum terpasang:
   ```bash
   npm install
   ```
4. Jalankan server:
   ```bash
   npm start
   ```
5. Buka browser di `http://localhost:3001`. AI Assistant sekarang terhubung penuh ke Google Search Grounding dan tools layanan Google!

### Cara 2: Menjalankan Frontend Langsung (Zero Configuration)
- Cukup klik dua kali file [index.html](file:///c:/Users/USER/Desktop/monica/index.html) di File Explorer.
- Semua fitur interaktif visual, Chibi Venom, efek kelindes, sensor kamera muka (Face Tracking), simulator Mikrotik, dan knowledge base Monic langsung aktif tanpa perlu server.
- Anda juga bisa memasukkan Gemini API Key langsung melalui tombol ⚙️ di jendela chat web.

---
*Dibuat untuk Monica Kartika Indah Riyanti — Kelas 12 TKJ SMK Bangun Nusa Bangsa*

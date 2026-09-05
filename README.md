# 🌟 Portfolio Website

Portfolio website interaktif yang dibangun dengan React dan teknologi modern untuk menampilkan proyek, keahlian, dan pencapaian saya.

![React](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1.18-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.182.0-000000?style=flat&logo=three.js&logoColor=white)

## ✨ Fitur Utama

- 🎨 **Multi-Theme Color Scheme** - 5 pilihan tema warna (Emerald, Sky, Violet, Amber, Red)
- 🌌 **Aurora Background Effect** - Efek background dinamis yang memukau
- 🤖 **AI Chatbot Integration** - Chatbot interaktif menggunakan Google Generative AI
- 📱 **Responsive Design** - Tampilan optimal di semua perangkat
- 🎭 **3D Elements** - Integrasi Three.js untuk elemen 3D interaktif
- ⚡ **Smooth Animations** - Animasi halus dengan GSAP dan Motion
- 🔥 **Firebase Integration** - Autentikasi dan database real-time
- 💬 **Real-time Chat** - Fitur chat dengan Firebase
- 🖼️ **Gallery Section** - Galeri foto interaktif dengan optimasi loading
- 🚀 **Image Optimization** - Kompresi otomatis, lazy loading, dan adaptive quality
- 🏆 **Achievements Showcase** - Tampilan sertifikat dan penghargaan
- 📊 **Projects Portfolio** - Showcase proyek dengan detail teknologi
- 🔗 **Clickable Project Cards** - Klik untuk membuka live demo atau repository

## 🛠️ Tech Stack

### Frontend
- **React 19** - Library UI modern
- **Vite** - Build tool yang cepat
- **TailwindCSS 4** - Utility-first CSS framework
- **React Router DOM** - Routing aplikasi

### 3D & Animasi
- **Three.js** - Library 3D graphics
- **@react-three/fiber** - React renderer untuk Three.js
- **@react-three/drei** - Helper untuk React Three Fiber
- **@react-three/rapier** - Physics engine
- **GSAP** - Animation library profesional
- **Motion** - Animation library modern

### Backend & Services
- **Firebase** - Authentication & Realtime Database
- **Google Generative AI** - AI Chatbot integration

### UI Components
- **Lucide React** - Icon library
- **Remixicon** - Icon font

### Optimasi
- **Canvas API** - Kompresi gambar client-side
- **Intersection Observer** - Lazy loading images
- **WebP/JPEG** - Format gambar optimal
- **Adaptive Loading** - Menyesuaikan dengan kecepatan koneksi

## 📂 Struktur Proyek

```
portfolio-reactjs/
├── public/              # Asset statis
│   ├── avatar2.png
│   ├── lanyard/
│   └── robots.txt
├── src/
│   ├── api/            # API routes
│   ├── assets/         # Gambar dan media
│   │   ├── cards/      # Icon teknologi
│   │   ├── certificate/# Sertifikat
│   │   ├── gallery/    # Foto galeri
│   │   └── projects/   # Screenshot proyek
│   ├── components/     # Komponen React
│   │   ├── ui/         # UI components
│   │   ├── ChatBot.jsx
│   │   ├── Sidebar.jsx
│   │   └── Topbar.jsx
│   ├── css/            # Style files
│   ├── data/           # Data statis
│   │   ├── achievementsData.js
│   │   ├── botContext.js
│   │   ├── cardData.js
│   │   ├── galleryData.js
│   │   └── projectData.js
│   ├── lib/            # Library & utilities
│   │   ├── auth.js
│   │   ├── chat.js
│   │   └── firebase.js
│   ├── pages/          # Halaman aplikasi
│   │   ├── About.jsx
│   │   ├── Achievements.jsx
│   │   ├── Chat.jsx
│   │   ├── Contact.jsx
│   │   ├── Gallery.jsx
│   │   ├── Projects.jsx
│   │   └── Skills.jsx
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── .env                # Environment variables
├── package.json
└── vite.config.js
```

## 🚀 Instalasi & Menjalankan

### Prerequisites
- Node.js (v18 atau lebih tinggi)
- npm atau yarn

### Langkah Instalasi

1. Clone repository
```bash
git clone <repository-url>
cd portfolio-reactjs
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
Buat file `.env` di root folder dan tambahkan:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_GEMINI_API_KEY=your_gemini_api_key
```

4. Jalankan development server
```bash
npm run dev
```

5. Buka browser dan akses `http://localhost:5173`

## 📦 Build untuk Production

```bash
npm run build
```

File production akan tersimpan di folder `dist/`

## 🎨 Fitur Halaman

### 1. Tentang (About)
- Informasi personal
- Animasi teks typing
- Spotlight card effect
- Lanyard 3D model

### 2. Proyek (Projects)
- Showcase 10+ proyek
- **Klik card untuk membuka website/demo**
- **Hover effect dengan spotlight interaktif**
- Filter berdasarkan teknologi
- Gradient border cards
- Detail teknologi yang digunakan
- Link ke live demo, GitHub, atau dokumentasi

### 3. Keahlian (Skills)
- 15+ teknologi yang dikuasai
- Infinite scroll menu
- Icon interaktif
- Kategori: Frontend, Backend, Database, Tools

### 4. Galeri (Gallery)
- Foto-foto personal dan proyek
- **Optimasi loading gambar otomatis**
- **Kompresi 70-85% ukuran file**
- **Adaptive quality berdasarkan koneksi**
- **Progressive loading (prioritas 3 gambar pertama)**
- Lightbox view
- Responsive grid layout
- Smooth transitions

### 5. Pencapaian (Achievements)
- Sertifikat dan penghargaan
- Detail kompetisi
- Teknologi yang digunakan
- Image preview

### 6. Kontak (Contact)
- Form kontak
- Social media links
- Email integration
- Location info

### 7. Chat
- Real-time messaging
- Firebase integration
- User authentication
- Message history

## 🎯 Proyek yang Ditampilkan

1. **Website Wayang Interaktif** - ReactJS, TailwindCSS
2. **Aplikasi WargaKita** - Flutter, NestJS, Supabase
3. **Company Profile PT Mandalanawa** - ReactJS, TailwindCSS, NestJS
4. **Website TokoBangunan** - ReactJS, TailwindCSS, Laravel
5. **Portofolio Guru Pendidik** - NextJS, TailwindCSS, PostgreSQL
6. **Mendeteksi Masker** - HTML, Python, JavaScript
7. **Landing Page EcoGuard AI** - ReactJS, TailwindCSS
8. **Aplikasi EcoGuard AI** - Flutter, SQLite
9. **Website Career** - NextJS, Firebase
10. **Website UJS** - HTML, CSS, JavaScript

## 🏆 Pencapaian & Sertifikasi

- 📜 **Google Ads Measurement Certification** – Google (2026)
- 🐍 **Statement of Achievement: Python Essentials 1** – Cisco Networking Academy & OpenEDG (2026)
- 💻 **Sertifikat Kompetensi: Frontend Developer (Next.js & NestJS)** – SMK Telkom Malang (2026)
- 🏆 **Semifinalis DIGITAL Competition 2024 (Business Model Canvas)** – BINUS University (2024)
- 🤖 **Sertifikat Kompetensi: Prompt Engineering untuk Software Developer** – Dicoding Indonesia (2026)
- 📊 **Certificate of Completion: Intro to Programming** – Kaggle (2026)
- 🧠 **Sertifikat Penyelesaian: Berpikir Kritis di Era Kecerdasan Buatan** – HP LIFE (2026)

## 🛡️ Scripts

```bash
npm run dev      # Menjalankan development server
npm run build    # Build untuk production
npm run preview  # Preview production build
npm run lint     # Menjalankan ESLint
```

## 🚀 Optimasi Performa

### Image Optimization
Gallery menggunakan sistem optimasi gambar canggih:

- ✅ **Kompresi Otomatis** - Mengurangi ukuran file 70-85%
- ✅ **WebP Format** - Format modern yang lebih ringan
- ✅ **Lazy Loading** - Load gambar saat dibutuhkan
- ✅ **Adaptive Quality** - Menyesuaikan dengan kecepatan koneksi
- ✅ **Progressive Loading** - Prioritas gambar yang terlihat dulu
- ✅ **Responsive Sizing** - Ukuran optimal untuk setiap device

Detail lengkap: [docs/IMAGE_OPTIMIZATION.md](docs/IMAGE_OPTIMIZATION.md)

## 🤝 Kontribusi

Kontribusi, issues, dan feature requests sangat diterima!

## 📝 License

Proyek ini bersifat private.

## 👨‍💻 Author

Dibuat dengan ❤️ menggunakan React dan teknologi modern

---

⭐ Jangan lupa berikan star jika Anda menyukai proyek ini!

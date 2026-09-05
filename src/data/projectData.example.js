// CONTOH: Template untuk menambahkan proyek baru
// Copy file ini dan rename menjadi projectData.js

import gambarProyek from '../assets/projects/nama-proyek.png';

export const projectData = [
    // ========================================
    // CONTOH 1: Website Live
    // ========================================
    {
        image: gambarProyek,
        title: "Website E-Commerce",
        subtitle: "ReactJS • TailwindCSS • Stripe",
        borderColor: "#10b981", // Warna border (hex color)
        gradient: "linear-gradient(160deg,#10b981 0%,#000 70%)", // Gradient background
        url: "https://my-ecommerce.vercel.app", // URL website live
    },

    // ========================================
    // CONTOH 2: GitHub Repository
    // ========================================
    {
        image: gambarProyek,
        title: "API Backend Service",
        subtitle: "NestJS • PostgreSQL • Docker",
        borderColor: "#ef4444",
        gradient: "linear-gradient(160deg,#ef4444 0%,#000 70%)",
        url: "https://github.com/username/backend-api", // URL GitHub repo
    },

    // ========================================
    // CONTOH 3: Mobile App (GitHub)
    // ========================================
    {
        image: gambarProyek,
        title: "Aplikasi Mobile Fitness",
        subtitle: "Flutter • Firebase • Google Maps",
        borderColor: "#3b82f6",
        gradient: "linear-gradient(160deg,#3b82f6 0%,#000 70%)",
        url: "https://github.com/username/fitness-app", // URL GitHub repo
    },

    // ========================================
    // CONTOH 4: Design/Prototype
    // ========================================
    {
        image: gambarProyek,
        title: "UI/UX Design System",
        subtitle: "Figma • Design Tokens",
        borderColor: "#8b5cf6",
        gradient: "linear-gradient(160deg,#8b5cf6 0%,#000 70%)",
        url: "https://figma.com/file/abc123/design-system", // URL Figma
    },

    // ========================================
    // CONTOH 5: Demo Video
    // ========================================
    {
        image: gambarProyek,
        title: "Game Development Project",
        subtitle: "Unity • C# • Blender",
        borderColor: "#f59e0b",
        gradient: "linear-gradient(160deg,#f59e0b 0%,#000 70%)",
        url: "https://youtube.com/watch?v=VIDEO_ID", // URL YouTube demo
    },

    // ========================================
    // CONTOH 6: Documentation
    // ========================================
    {
        image: gambarProyek,
        title: "Open Source Library",
        subtitle: "TypeScript • NPM Package",
        borderColor: "#06b6d4",
        gradient: "linear-gradient(160deg,#06b6d4 0%,#000 70%)",
        url: "https://docs.my-library.com", // URL dokumentasi
    },

    // ========================================
    // CONTOH 7: Proyek Tanpa URL (Private/NDA)
    // ========================================
    {
        image: gambarProyek,
        title: "Enterprise Dashboard",
        subtitle: "NextJS • GraphQL • AWS",
        borderColor: "#ec4899",
        gradient: "linear-gradient(160deg,#ec4899 0%,#000 70%)",
        // Tidak ada URL - card tetap tampil tapi tidak clickable
    },

    // ========================================
    // CONTOH 8: Multiple Links (gunakan yang paling penting)
    // ========================================
    {
        image: gambarProyek,
        title: "Full Stack Application",
        subtitle: "MERN Stack • Redux • Socket.io",
        borderColor: "#14b8a6",
        gradient: "linear-gradient(160deg,#14b8a6 0%,#000 70%)",
        url: "https://my-app.com", // Prioritas: Live website
        // Alternative URLs (simpan di comment):
        // GitHub: https://github.com/username/fullstack-app
        // Docs: https://docs.my-app.com
    },
];

// ========================================
// TIPS MEMILIH WARNA
// ========================================
/*
Warna populer untuk tech stack:

React: #61DAFB
Vue: #42b883
Angular: #dd0031
Node.js: #339933
Python: #3776ab
Java: #007396
PHP: #777bb4
Ruby: #cc342d
Go: #00add8
Rust: #000000
Swift: #fa7343
Kotlin: #7f52ff
TypeScript: #3178c6
JavaScript: #f7df1e
HTML: #e34f26
CSS: #1572b6
TailwindCSS: #06b6d4
Bootstrap: #7952b3
Firebase: #ffca28
MongoDB: #47a248
PostgreSQL: #336791
MySQL: #4479a1
Redis: #dc382d
Docker: #2496ed
Kubernetes: #326ce5
AWS: #ff9900
Azure: #0089d6
GCP: #4285f4
*/

// ========================================
// TIPS GRADIENT
// ========================================
/*
Format: linear-gradient(angle, color1 start%, color2 end%)

Contoh:
- Subtle: linear-gradient(160deg, #10b981 0%, #000 70%)
- Bold: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Vibrant: linear-gradient(120deg, #f093fb 0%, #f5576c 100%)
- Cool: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- Warm: linear-gradient(135deg, #f5af19 0%, #f12711 100%)

Generator: https://cssgradient.io/
*/

// ========================================
// CARA MENGGUNAKAN
// ========================================
/*
1. Import gambar proyek Anda
2. Copy salah satu contoh di atas
3. Ganti dengan data proyek Anda
4. Pastikan URL valid (dimulai dengan https://)
5. Pilih warna yang sesuai dengan tech stack
6. Save dan test di browser!
*/

import React, { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

export const translations = {
  id: {
    nav: {
      tentang: "Tentang",
      galeri: "Galeri",
      keahlian: "Keahlian",
      proyek: "Proyek",
      pencapaian: "Pencapaian",
      kontak: "Kontak",
      chat: "Chat",
    },
    theme: "TEMA",
    themeAria: "Pilih warna tema",
    sidebarAvatarAria: "Navigasi ke halaman Tentang",
    about: {
      greeting: "Hi 👋, I'm Bilal Mayor Abdillah",
      roles: ["Frontend Developer", "Software Quality Assurance", "Web Developer"],
      bio: "Siswa Software Engineering yang berfokus pada Frontend Development dan Software Quality Assurance. Saya senang membangun website yang modern, responsif, dan nyaman digunakan, sekaligus terus mengembangkan kemampuan dalam teknologi dan software testing.",
      follow: "Follow me",
      lanyardLoading: "Memuat Interactive Card...",
      biodata: "Biodata",
      nameLabel: "Nama",
      educationLabel: "Pendidikan",
      locationLabel: "Lokasi",
      experience: "Pengalaman",
      showLess: "Tampilkan Lebih Sedikit",
      showAll: "Lihat Semua Pengalaman",
      experiences: [
        {
          role: "Frontend Development",
          title: "Pengembangan Web Modern & Responsif",
          desc: "Membangun antarmuka web yang interaktif, modern, dan cepat menggunakan React, Tailwind CSS, dan JavaScript dengan struktur komponen yang rapi.",
          tags: ["React", "Tailwind CSS", "JavaScript", "Vite"],
        },
        {
          role: "Software Quality & Engineering",
          title: "Software Engineering & Testing",
          desc: "Menerapkan prinsip clean code, pengujian software, dan analisis alur kerja sistem untuk memastikan kualitas dan keandalan aplikasi.",
          tags: ["Software QA", "Testing", "Clean Code", "Git"],
        },
        {
          role: "UI/UX & Interactive Design",
          title: "Desain Antarmuka Pengguna Interaktif",
          desc: "Merancang tata letak antarmuka yang intuitif, estetis, dan adaptif di berbagai ukuran layar desktop maupun mobile.",
          tags: ["UI/UX", "Figma", "Responsive Web", "Motion"],
        },
        {
          role: "Cloud & Database Integration",
          title: "Integrasi Database & Cloud Services",
          desc: "Menghubungkan aplikasi web dengan layanan cloud seperti Firebase (Firestore, Auth) serta RESTful API.",
          tags: ["Firebase", "Firestore", "Auth", "REST API"],
        },
      ],
    },
    projects: {
      title: "Proyek Saya",
      subtitle: "Kumpulan proyek dan eksplorasi yang telah saya bangun menggunakan teknologi web modern.",
      addBtn: "Tambah Proyek",
      openBtn: "Buka Proyek",
      closeAria: "Tutup detail proyek",
      loading: "Memuat Halaman...",
    },
    gallery: {
      title: "Galeri Saya",
      subtitle: "Momen dari perjalanan saya — ngoding, kegiatan sekolah, hobi, dan keseharian.",
      addBtn: "Tambah Foto",
      connecting: "Menghubungkan ke galeri...",
      emptyTitle: "Galeri Kosong",
      emptyDesc: "Tidak ada foto yang tersedia untuk ditampilkan.",
      dragNav: "Drag untuk navigasi",
      swipeNav: "Swipe untuk navigasi",
      touchSwipeNav: "Touch & swipe untuk navigasi",
    },
    skills: {
      title: "Keahlian Saya",
      subtitle: "Teknologi dan tools yang saya gunakan untuk membangun aplikasi web modern.",
    },
    achievements: {
      title: "Pencapaian & Sertifikasi",
      subtitle: "Sertifikasi dan pencapaian pembelajaran yang mencerminkan perkembangan keahlian saya di bidang teknologi.",
      addBtn: "Tambah",
      closeAria: "Tutup detail pencapaian",
      items: [
        {
          id: "ach_1",
          title: "Google Ads Measurement Certification – Google (2026)",
          description: "Memperoleh sertifikasi profesional resmi dari Google dalam pengukuran efektivitas kampanye digital, pelacakan konversi (conversion tracking), serta analisis performa iklan digital (ID Kredensial: 190337211).",
          tech: ["Google Ads", "Conversion Tracking", "Digital Analytics"],
        },
        {
          id: "ach_2",
          title: "Statement of Achievement: Python Essentials 1 – Cisco & OpenEDG (2026)",
          description: "Menyelesaikan program sertifikasi pemrograman Python 3 berstandar internasional, menguasai computational thinking, perancangan logika algoritma, Python Standard Library, serta teknik debugging.",
          tech: ["Python 3", "Cisco", "OpenEDG", "Algorithms"],
        },
        {
          id: "ach_3",
          title: "Sertifikat Kompetensi: Frontend Developer – SMK Telkom Malang (2026)",
          description: "Meraih predikat \"Sangat Kompeten\" pada Uji Unit Kompetensi (UUK) Rekayasa Perangkat Lunak melalui proyek riil pengembangan aplikasi web berbasis Next.js dan integrasi API NestJS (No: 724/KUR/KL/TS-MLG/VI/2026).",
          tech: ["Frontend Developer", "Next.js", "NestJS", "SMK Telkom"],
        },
        {
          id: "ach_4",
          title: "Semifinalis DIGITAL Competition 2024 (BMC) – BINUS University (2024)",
          description: "Meraih pencapaian sebagai Semifinalis pada kompetisi Business Model Canvas (BMC) tingkat nasional bertema \"Startup in Digital Era\" dengan merancang serta mempresentasikan model bisnis digital inovatif (No: 082/HIMBIDI/SRT/DC/XII/2024).",
          tech: ["BINUS University", "Business Model Canvas", "Startup"],
        },
        {
          id: "ach_5",
          title: "Sertifikat Kompetensi: Prompt Engineering – Dicoding Indonesia (2026)",
          description: "Menyelesaikan kelas spesialisasi pemanfaatan prompt engineering untuk mengoptimalkan efisiensi penulisan kode, debugging, dan integrasi kecerdasan buatan (AI-assisted development) dalam rekayasa perangkat lunak.",
          tech: ["Prompt Engineering", "Dicoding", "AI Development", "Debugging"],
        },
        {
          id: "ach_6",
          title: "Certificate of Completion: Intro to Programming – Kaggle (2026)",
          description: "Menyelesaikan pelatihan pemrograman dasar pada platform Kaggle untuk memperkuat fondasi logika pemrograman, manipulasi data dasar, dan struktur alur kode.",
          tech: ["Kaggle", "Programming Fundamentals", "Data Logic"],
        },
        {
          id: "ach_7",
          title: "Sertifikat Penyelesaian: Berpikir Kritis di Era AI – HP LIFE (2026)",
          description: "Menyelesaikan pelatihan daring terkait penerapan pemikiran kritis dalam pengambilan keputusan, mitigasi bias algoritma, serta validasi fakta terhadap konten berbasis kecerdasan buatan (No: 0e73990e-4af9-4366-903d-bd830286a269).",
          tech: ["HP LIFE", "Critical Thinking", "AI Ethics", "Validation"],
        },
      ],
    },
    contact: {
      title: "Hubungi Saya",
      subtitle: "Silakan hubungi saya melalui platform berikut",
    },
    chatPage: {
      title: "Ruang Chat",
      subtitle: "Terbuka untuk berbagi dan diskusi yang santai.",
      loginPrompt: "Silahkan login dulu untuk mengirim pesan",
      loginGoogle: "Lanjutkan dengan Google",
      loginGithub: "Lanjutkan dengan GitHub",
      logout: "Logout",
      noMessages: "Belum ada pesan 💬",
      beFirst: "Jadilah yang pertama memulai percakapan!",
      placeholder: "Ketik Pesan...",
      send: "Kirim",
    },
    bot: {
      greeting: "Halo! Saya AI Bilal. Ada yang bisa saya bantu tentang portofolio Bilal?",
      headerTitle: "Bilal AI Assistant",
      poweredBy: "Powered by Gemini AI",
      clearTooltip: "Hapus Percakapan",
      clearAria: "Hapus percakapan",
      closeAria: "Tutup chatbot",
      thinking: "Bilal AI sedang berpikir",
      suggested: [
        "Siapa Bilal?",
        "Apa saja sertifikasinya?",
        "Apa keahliannya?",
        "Kontak Bilal"
      ],
      placeholder: "Tanya tentang skill, repo, atau proyek...",
      sendAria: "Kirim pesan",
      triggerTooltip: "Tanya AI Bilal",
      triggerAria: "Buka AI Assistant Chatbot",
    },
  },
  en: {
    nav: {
      tentang: "About",
      galeri: "Gallery",
      keahlian: "Skills",
      proyek: "Projects",
      pencapaian: "Achievements",
      kontak: "Contact",
      chat: "Chat",
    },
    theme: "THEME",
    themeAria: "Select theme color",
    sidebarAvatarAria: "Navigate to About page",
    about: {
      greeting: "Hi 👋, I'm Bilal Mayor Abdillah",
      roles: ["Frontend Developer", "Software Quality Assurance", "Web Developer"],
      bio: "Software Engineering student focusing on Frontend Development and Software Quality Assurance. I enjoy building modern, responsive, and user-friendly websites, while continuously advancing my skills in technology and software testing.",
      follow: "Follow me",
      lanyardLoading: "Loading Interactive Card...",
      biodata: "Biodata",
      nameLabel: "Name",
      educationLabel: "Education",
      locationLabel: "Location",
      experience: "Experience",
      showLess: "Show Less",
      showAll: "View All Experiences",
      experiences: [
        {
          role: "Frontend Development",
          title: "Modern & Responsive Web Development",
          desc: "Building interactive, modern, and fast web user interfaces using React, Tailwind CSS, and JavaScript with clean component design.",
          tags: ["React", "Tailwind CSS", "JavaScript", "Vite"],
        },
        {
          role: "Software Quality & Engineering",
          title: "Software Engineering & Testing",
          desc: "Applying clean code principles, software testing, and systematic workflows to ensure application reliability and quality.",
          tags: ["Software QA", "Testing", "Clean Code", "Git"],
        },
        {
          role: "UI/UX & Interactive Design",
          title: "Interactive User Interface Design",
          desc: "Designing intuitive, aesthetic, and adaptive layouts across various desktop and mobile screen sizes.",
          tags: ["UI/UX", "Figma", "Responsive Web", "Motion"],
        },
        {
          role: "Cloud & Database Integration",
          title: "Cloud Services & Database Integration",
          desc: "Connecting frontend web apps with cloud services including Firebase (Firestore, Auth) and RESTful APIs.",
          tags: ["Firebase", "Firestore", "Auth", "REST API"],
        },
      ],
    },
    projects: {
      title: "My Projects",
      subtitle: "A showcase of web projects and explorations built with modern technologies.",
      addBtn: "Add Project",
      openBtn: "Open Project",
      closeAria: "Close project details",
      loading: "Loading Page...",
    },
    gallery: {
      title: "My Gallery",
      subtitle: "Moments from my journey — coding, school activities, hobbies, and daily life.",
      addBtn: "Add Photo",
      connecting: "Connecting to gallery...",
      emptyTitle: "Gallery Empty",
      emptyDesc: "No photos available to display.",
      dragNav: "Drag to navigate",
      swipeNav: "Swipe to navigate",
      touchSwipeNav: "Touch & swipe to navigate",
    },
    skills: {
      title: "My Skills",
      subtitle: "Technologies and tools I use to build modern web applications.",
    },
    achievements: {
      title: "Achievements & Certifications",
      subtitle: "Certifications and learning achievements reflecting my growth in software engineering and technology.",
      addBtn: "Add",
      closeAria: "Close achievement details",
      items: [
        {
          id: "ach_1",
          title: "Google Ads Measurement Certification – Google (2026)",
          description: "Earned official professional certification from Google in measuring digital campaign performance, conversion tracking, and digital ads analytics (Credential ID: 190337211).",
          tech: ["Google Ads", "Conversion Tracking", "Digital Analytics"],
        },
        {
          id: "ach_2",
          title: "Statement of Achievement: Python Essentials 1 – Cisco & OpenEDG (2026)",
          description: "Completed international standard Python 3 certification, mastering computational thinking, algorithm design, Python Standard Library, and debugging techniques.",
          tech: ["Python 3", "Cisco", "OpenEDG", "Algorithms"],
        },
        {
          id: "ach_3",
          title: "Frontend Developer Competency Certificate – SMK Telkom Malang (2026)",
          description: "Achieved \"Highly Competent\" rating on the Software Engineering Competency Exam (UUK) through real-world web application development with Next.js and NestJS API integration (No: 724/KUR/KL/TS-MLG/VI/2026).",
          tech: ["Frontend Developer", "Next.js", "NestJS", "SMK Telkom"],
        },
        {
          id: "ach_4",
          title: "Semifinalist DIGITAL Competition 2024 (BMC) – BINUS University (2024)",
          description: "Achieved Semifinalist position in the national Business Model Canvas (BMC) competition themed \"Startup in Digital Era\" designing and presenting an innovative digital business model (No: 082/HIMBIDI/SRT/DC/XII/2024).",
          tech: ["BINUS University", "Business Model Canvas", "Startup"],
        },
        {
          id: "ach_5",
          title: "Competency Certificate: Prompt Engineering – Dicoding Indonesia (2026)",
          description: "Completed specialized course on utilizing prompt engineering to optimize code efficiency, debugging, and AI-assisted software development.",
          tech: ["Prompt Engineering", "Dicoding", "AI Development", "Debugging"],
        },
        {
          id: "ach_6",
          title: "Certificate of Completion: Intro to Programming – Kaggle (2026)",
          description: "Completed foundational programming training on Kaggle strengthening core programming logic, basic data manipulation, and clean code flow.",
          tech: ["Kaggle", "Programming Fundamentals", "Data Logic"],
        },
        {
          id: "ach_7",
          title: "Certificate of Completion: Critical Thinking in the AI Era – HP LIFE (2026)",
          description: "Completed online training on applying critical thinking in decision-making, algorithmic bias mitigation, and fact-checking AI-generated content (No: 0e73990e-4af9-4366-903d-bd830286a269).",
          tech: ["HP LIFE", "Critical Thinking", "AI Ethics", "Validation"],
        },
      ],
    },
    contact: {
      title: "Contact Me",
      subtitle: "Feel free to reach out to me on the following platforms",
    },
    chatPage: {
      title: "Chat Room",
      subtitle: "Open for sharing and casual discussions.",
      loginPrompt: "Please login first to send a message",
      loginGoogle: "Continue with Google",
      loginGithub: "Continue with GitHub",
      logout: "Logout",
      noMessages: "No messages yet 💬",
      beFirst: "Be the first to start a conversation!",
      placeholder: "Type a message...",
      send: "Send",
    },
    bot: {
      greeting: "Hello! I'm Bilal's AI. How can I help you regarding Bilal's portfolio?",
      headerTitle: "Bilal AI Assistant",
      poweredBy: "Powered by Gemini AI",
      clearTooltip: "Clear Conversation",
      clearAria: "Clear conversation",
      closeAria: "Close chatbot",
      thinking: "Bilal AI is thinking",
      suggested: [
        "Who is Bilal?",
        "What are his certifications?",
        "What are his skills?",
        "Contact Bilal"
      ],
      placeholder: "Ask about skills, repos, or projects...",
      sendAria: "Send message",
      triggerTooltip: "Ask Bilal AI",
      triggerAria: "Open AI Assistant Chatbot",
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("app_lang");
    return saved === "en" ? "en" : "id";
  });

  useEffect(() => {
    localStorage.setItem("app_lang", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "id" ? "en" : "id"));
  };

  const t = (path) => {
    const keys = path.split(".");
    let current = translations[language];
    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to Indonesian if key missing in current language
        let fallback = translations.id;
        for (const k of keys) {
          if (fallback && fallback[k] !== undefined) {
            fallback = fallback[k];
          } else {
            return path;
          }
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, translations: translations[language] }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import About from "./pages/About";
import Aurora from "./components/ui/Aurora";
import Preloader from "./components/ui/PreLoader";
import ChatBot from "./components/ChatBot";
import { getRedirectResult } from "firebase/auth";
import { auth } from "./lib/firebase";
import AdminLoginModal from "./components/AdminLoginModal";
import AdminPanel from "./pages/AdminPanel";
import CommandPalette from "./components/CommandPalette";
import { isAdminLoggedIn } from "./lib/adminAuth";
import { motion, AnimatePresence } from "motion/react";

// Code Splitting - Lazy Load off-screen routes
const Projects = lazy(() => import("./pages/Projects"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Skills = lazy(() => import("./pages/Skills"));
const Contact = lazy(() => import("./pages/Contact"));
const Achievements = lazy(() => import("./pages/Achievements"));
const Chat = lazy(() => import("./pages/Chat"));

// Cinematic page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 12, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -8,
    filter: "blur(4px)",
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const App = () => {
  const [activePage, setActivePage] = useState("tentang");
  const [activeColor, setActiveColor] = useState("tangerine");
  const [colorCombo, setColorCombo] = useState(() => {
    return localStorage.getItem("bilal_color_combo") || "2";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [adminTab, setAdminTab] = useState("gallery");

  const scrollbarColors = {
    tangerine: "#FF6B35",
    turquoise: "#00F5D4",
    fuchsia: "#F72585",
    bronze: "#E2B870",
    indigo: "#6366F1",
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--scroll-thumb", scrollbarColors[activeColor] || "#FF6B35");
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-combo", colorCombo);
    localStorage.setItem("bilal_color_combo", colorCombo);
  }, [colorCombo]);

  const themeMap = {
    tangerine: { accent: "#FF6B35", accentRgb: "255, 107, 53" },
    turquoise: { accent: "#00F5D4", accentRgb: "0, 245, 212" },
    fuchsia: { accent: "#F72585", accentRgb: "247, 37, 133" },
    bronze: { accent: "#E2B870", accentRgb: "226, 184, 112" },
    indigo: { accent: "#6366F1", accentRgb: "99, 102, 241" },
  };

  useEffect(() => {
    const theme = themeMap[activeColor] || themeMap.tangerine;
    if (!theme) return;
    document.documentElement.style.setProperty("--accent", theme.accent);
    document.documentElement.style.setProperty("--accent-rgb", theme.accentRgb);
  }, [activeColor]);

  const openAdmin = useCallback((tab = "gallery") => {
    setAdminTab(tab);
    if (isAdminLoggedIn()) setShowAdminPanel(true);
    else setShowAdminLogin(true);
  }, []);

  // Global helper — callable from any page: window.openAdminWithTab("gallery")
  useEffect(() => {
    window.openAdminWithTab = openAdmin;
    return () => { delete window.openAdminWithTab; };
  }, [openAdmin]);

  const renderPage = () => {
    switch (activePage) {
      case "proyek": return <Projects />;
      case "galeri": return <Gallery activeColor={activeColor} />;
      case "keahlian": return <Skills onNavigatePage={setActivePage} />;
      case "kontak": return <Contact />;
      case "pencapaian": return <Achievements />;
      case "chat": return <Chat />;
      default: return <About isReady={isReady} />;
    }
  };

  useEffect(() => {
    getRedirectResult(auth)
      .then((r) => { if (r?.user) console.log("Login GitHub sukses:", r.user); })
      .catch((e) => console.error("Redirect error:", e));
  }, []);

  // Shortcuts: Ctrl+Shift+A (Admin) and Ctrl+K / Cmd+K (Command Center)
  const handleKeydown = useCallback((e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      e.preventDefault();
      openAdmin("gallery");
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      setIsCommandPaletteOpen((prev) => !prev);
    }
  }, [openAdmin]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [handleKeydown]);

  return (
    <div className="select-none relative min-h-screen overflow-hidden" style={{ background: "var(--bg-deep)" }}>
      {/* Dynamic Aurora animated background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Aurora
          colorStops={
            activeColor === "tangerine"
              ? ["#FF6B35", "#ea580c", "#c2410c"]
              : activeColor === "turquoise"
              ? ["#00F5D4", "#06b6d4", "#0891b2"]
              : activeColor === "fuchsia"
              ? ["#F72585", "#d946ef", "#c026d3"]
              : activeColor === "bronze"
              ? ["#E2B870", "#d97706", "#b45309"]
              : ["#6366F1", "#4f46e5", "#4338ca"]
          }
          blend={0.5}
          amplitude={1.0}
          speed={0.5}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center p-2 sm:p-3 lg:p-5 h-dvh lg:h-screen">
        {/* Outer shell container with animated side glow and border beam */}
        <div className="relative w-full max-w-7xl h-full lg:h-[88vh] flex items-center justify-center">
          {/* Subtle Ambient Flank/Side Glow (Di samping kotaknya: kiri dan kanan) */}
          <div className="shell-side-glow shell-side-glow-left" aria-hidden="true" />
          <div className="shell-side-glow shell-side-glow-right" aria-hidden="true" />

          {/* Precision Perimeter Border Beam (Garis aksen halus mengitari tepi kotak) */}
          <div className="shell-border-beam" aria-hidden="true" />

          {/* Main Portfolio Content Card */}
          <div
            className={`w-full h-full rounded-2xl sm:rounded-3xl flex text-[var(--text-primary)] relative overflow-hidden z-10 ${activeColor}`}
            style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--shell-shadow)",
            }}
          >
            {/* Top shimmer line */}
            <div className="glass-shimmer rounded-t-2xl sm:rounded-t-3xl" />
            <Sidebar
              setActivePage={setActivePage}
              activePage={activePage}
              setActiveColor={setActiveColor}
              activeColor={activeColor}
              colorCombo={colorCombo}
              setColorCombo={setColorCombo}
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
            />
            <div className="flex-1 min-w-0 w-full flex flex-col">
              <Topbar
                activePage={activePage}
                setIsSidebarOpen={setIsSidebarOpen}
                onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
                colorCombo={colorCombo}
                setColorCombo={setColorCombo}
              />
              <main className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-1.5">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activePage}
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="h-full"
                  >
                    <Suspense fallback={
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-6 h-6 border-2 border-zinc-800 border-t-[var(--accent)] rounded-full animate-spin" />
                          <span className="text-zinc-600 text-xs font-medium tracking-wide">Memuat...</span>
                        </div>
                      </div>
                    }>
                      {renderPage()}
                    </Suspense>
                  </motion.div>
                </AnimatePresence>
              </main>
            </div>
          </div>
        </div>
      </div>

      {!isReady && <Preloader onFinish={() => setIsReady(true)} />}
      <ChatBot />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        setActivePage={setActivePage}
        setActiveColor={setActiveColor}
        activeColor={activeColor}
        colorCombo={colorCombo}
        setColorCombo={setColorCombo}
      />

      {showAdminLogin && (
        <AdminLoginModal
          onSuccess={() => {
            setShowAdminLogin(false);
            setShowAdminPanel(true);
            window.dispatchEvent(new Event("adminDataUpdated"));
          }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
      {showAdminPanel && (
        <AdminPanel
          onClose={() => setShowAdminPanel(false)}
          initialTab={adminTab}
        />
      )}
    </div>
  );
};

export default App;

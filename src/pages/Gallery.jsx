import { useState, useEffect, useMemo } from "react";
import { galleryData } from "../data/galleryData";
import InfiniteMenu from "../components/ui/InfiniteMenu";
import { getMergedGallery } from "../lib/adminStore";
import { isAdminLoggedIn } from "../lib/adminAuth";
import { Plus, ImageOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { motion } from "motion/react";

const Gallery = ({ activeColor }) => {
  const { t } = useLanguage();
  // Show static data immediately — Firestore merge happens silently in background
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mergedGallery, setMergedGallery] = useState(galleryData);
  const [adminMode, setAdminMode] = useState(isAdminLoggedIn());

  useEffect(() => {
    const merge = () =>
      getMergedGallery(galleryData)
        .then((data) => { setMergedGallery(data); setAdminMode(isAdminLoggedIn()); })
        .catch(console.error);
    merge();
    window.addEventListener("adminDataUpdated", merge);
    return () => window.removeEventListener("adminDataUpdated", merge);
  }, []);

  // Deteksi ukuran layar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Gunakan data gabungan yang sudah di-merge dari adminStore
  const infiniteItems = useMemo(() => {
    const combined = mergedGallery;

    if (!combined || !Array.isArray(combined)) {
      console.error("galleryData is undefined or not an array");
      return [];
    }

    try {
      return combined
        .sort((a, b) => (a.priority ?? 99) - (b.priority ?? 99))
        .map((item) => ({
          image: item?.image || "",
          title: item?.title || "Untitled",
          description: item?.description || "",
          link: item?.link || "#",
        }));
    } catch (error) {
      console.error("Error processing galleryData:", error);
      return [];
    }
  }, [mergedGallery]);

  useEffect(() => {
    const root = document.documentElement;
    const accentMap = {
      emerald: { bg: "#10b981", text: "#000000" },
      sky: { bg: "#0ea5e9", text: "#ffffff" },
      violet: { bg: "#8b5cf6", text: "#ffffff" },
      amber: { bg: "#fde68a", text: "#000000" },
      red: { bg: "#ef4444", text: "#ffffff" },
    };

    const accent = accentMap[activeColor];
    if (!accent) return;

    root.style.setProperty("--accent", accent.bg);
    root.style.setProperty("--accent-text", accent.text);
  }, [activeColor]);

  // Loading state
  if (loading) {
    return (
      <section className="space-y-6 section-spacing">
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {t("gallery.title")}
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mt-2 text-sm">
            {t("gallery.subtitle")}
          </p>
        </div>

        <div className="h-[60vh] md:h-[70vh] lg:h-125 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <div className="text-center space-y-3">
            <div className="w-8 h-8 border-2 border-zinc-800 border-t-[var(--accent)] rounded-full animate-spin mx-auto" />
            <p className="text-[var(--text-tertiary)] text-xs">{t("gallery.connecting")}</p>
          </div>
        </div>
      </section>
    );
  }

  // Jika tidak ada data
  if (infiniteItems.length === 0) {
    return (
      <section className="space-y-6 section-spacing">
        <div>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
            {t("gallery.title")}
          </h1>
          <p className="text-[var(--text-secondary)] max-w-xl mt-2 text-sm">
            {t("gallery.subtitle")}
          </p>
        </div>

        <div className="h-[60vh] md:h-[70vh] lg:h-125 rounded-2xl flex items-center justify-center" style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}>
          <div className="text-center space-y-3 p-8">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
              <ImageOff className="w-7 h-7 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">{t("gallery.emptyTitle")}</h3>
            <p className="text-[var(--text-tertiary)] text-xs max-w-xs mx-auto">
              {t("gallery.emptyDesc")}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5 section-spacing">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex items-start justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              {t("gallery.title")}
            </h1>
            <span className="badge-accent">{infiniteItems.length}</span>
          </div>
          <p className="text-[var(--text-secondary)] max-w-xl mt-2 text-sm">
            {t("gallery.subtitle")}
          </p>
        </div>
        {adminMode && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => window.openAdminWithTab?.("gallery")}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold
              bg-[rgba(var(--accent-rgb),0.1)] hover:bg-[rgba(var(--accent-rgb),0.15)]
              border border-[rgba(var(--accent-rgb),0.2)]
              text-[var(--accent)] transition-all duration-200 mt-1 cursor-pointer"
          >
            <Plus size={14} />
            {t("gallery.addBtn")}
          </motion.button>
        )}
      </motion.div>

      {/* MAIN CONTENT AREA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        className="gallery-container h-[60vh] md:h-[70vh] lg:h-125 xl:h-[80vh] rounded-2xl overflow-hidden relative"
        style={{
          background: "var(--bg-elevated)",
          border: "1px solid var(--border-default)",
          boxShadow: "var(--glass-shadow-elevated)",
        }}
      >
        {/* Top shimmer */}
        <div className="glass-shimmer rounded-t-2xl" />

        {/* GALLERY CONTENT */}
        <div className="h-full">
          <InfiniteMenu
            items={infiniteItems}
            mobileView={isMobile}
          />
        </div>

        {/* Floating Indicator */}
        <div className="absolute bottom-16 sm:bottom-4 right-4 z-20">
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] text-[var(--text-secondary)] font-medium font-['JetBrains_Mono']"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              {isMobile ? t("gallery.swipeNav") : t("gallery.dragNav")}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Gallery;
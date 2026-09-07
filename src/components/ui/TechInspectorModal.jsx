import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X, ShieldCheck, Sparkles, CheckCircle2, FolderGit2, Layers } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const TechInspectorModal = ({ item, isOpen, onClose, onExploreProjects }) => {
  const { language, t } = useLanguage();
  const isId = language === "id";

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!item) return null;

  const experienceText = item.experienceDesc
    ? (isId ? item.experienceDesc.id : item.experienceDesc.en)
    : item.description;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 pointer-events-auto">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-lg rounded-2xl p-6 sm:p-7 overflow-hidden z-10"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              boxShadow: "0 24px 64px -12px rgba(0,0,0,0.45), var(--glass-shadow-elevated)",
            }}
          >
            {/* Top decorative aura */}
            <div
              className="absolute -top-24 -right-24 w-56 h-56 rounded-full pointer-events-none opacity-25 blur-3xl"
              style={{ background: item.color || "var(--accent)" }}
            />
            <div className="glass-shimmer rounded-t-2xl" />

            {/* Header: Icon, Title, Category & Close */}
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                {/* Tech Icon with glowing ring */}
                <div
                  className="relative w-14 h-14 rounded-xl flex items-center justify-center p-3 shrink-0"
                  style={{
                    background: "var(--bg-surface)",
                    border: `1px solid ${item.color ? `${item.color}40` : "var(--border-default)"}`,
                    boxShadow: item.color
                      ? `0 0 20px -4px ${item.color}35`
                      : "var(--glass-shadow)",
                  }}
                >
                  <img
                    src={item.icon}
                    alt={item.title}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="text-xl font-bold font-[Space_Grotesk] text-[var(--text-primary)] tracking-tight">
                      {item.title}
                    </h3>
                    <span
                      className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold"
                      style={{
                        background: item.color ? `${item.color}15` : "rgba(var(--accent-rgb),0.12)",
                        color: item.color || "var(--accent)",
                        border: `1px solid ${item.color ? `${item.color}30` : "rgba(var(--accent-rgb),0.25)"}`,
                      }}
                    >
                      {item.tier || "Proficient"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] font-mono">
                    <span>{item.description}</span>
                    <span className="text-[var(--text-muted)]">•</span>
                    <span className="text-[var(--accent)] flex items-center gap-1">
                      <Layers size={11} />
                      {isId ? `Orbit Ring ${item.ring || 1}` : `Orbit Layer ${item.ring || 1}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                aria-label={t("skills.closeInspector") || "Tutup"}
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] border border-transparent hover:border-[var(--border-subtle)] transition-all shrink-0"
              >
                <X size={17} />
              </button>
            </div>

            {/* Tech Status & Verification Badge */}
            <div className="mt-5 p-3.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-emerald-500 font-medium">
                <ShieldCheck size={16} />
                {t("skills.verifiedBadge") || "QA & Clean Code Verified"}
              </span>
              <span className="text-[var(--text-secondary)] font-mono text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-lg bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
                Production Ready
              </span>
            </div>

            {/* Practical Implementation & Real-world Usage */}
            <div className="mt-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-1.5 font-semibold flex items-center gap-1.5">
                <Sparkles size={12} className="text-[var(--accent)]" />
                {t("skills.practicalExperience") || "Implementasi & Pengalaman Nyata"}
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-hover)]/60 p-3.5 rounded-xl border border-[var(--border-subtle)]">
                {experienceText}
              </p>
            </div>

            {/* Core Strengths / Highlights */}
            {item.highlights && item.highlights.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-2 font-semibold">
                  {isId ? "Kekuatan & Fokus Utama" : "Core Capabilities"}
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {item.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[11px] font-medium text-[var(--text-secondary)]"
                    >
                      <CheckCircle2 size={13} className="text-[var(--accent)] shrink-0" />
                      <span className="truncate">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Projects */}
            {item.relatedProjects && item.relatedProjects.length > 0 && (
              <div className="mt-4 pt-3 border-t border-[var(--border-subtle)]">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono text-[var(--text-muted)] flex items-center gap-1.5">
                    <FolderGit2 size={12} className="text-[var(--accent)]" />
                    {t("skills.appliedInProjects") || "Diterapkan Pada Proyek"}
                  </span>
                  {onExploreProjects && (
                    <button
                      onClick={() => {
                        onClose();
                        onExploreProjects(item);
                      }}
                      className="text-[11px] text-[var(--accent)] hover:underline cursor-pointer font-medium"
                    >
                      {isId ? "Lihat Halaman Proyek →" : "View Projects Page →"}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {item.relatedProjects.map((proj, pIdx) => (
                    <span
                      key={pIdx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium text-[var(--text-secondary)] bg-[var(--bg-hover)] border border-[var(--border-subtle)]"
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color || "var(--accent)" }} />
                      {proj}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-[var(--border-subtle)] flex items-center justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200"
                style={{
                  background: "var(--bg-hover)",
                  color: "var(--text-primary)",
                  border: "1px solid var(--border-default)",
                }}
              >
                {t("skills.closeInspector") || "Tutup"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
};

export default TechInspectorModal;

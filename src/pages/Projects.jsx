import ChromaGrid from "../components/ui/ChromaGrid";
import { projectData } from "../data/projectData";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { getMergedProjects } from "../lib/adminStore";
import { isAdminLoggedIn } from "../lib/adminAuth";
import { X, ExternalLink, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Projects = () => {
  const { t } = useLanguage();
  // Show static data immediately — Firestore merge happens silently in background
  const [allProjects, setAllProjects] = useState(projectData);
  const [selectedProject, setSelectedProject] = useState(null);
  const [adminMode, setAdminMode] = useState(isAdminLoggedIn());

  useEffect(() => {
    const merge = () =>
      getMergedProjects(projectData).then((data) => {
        setAllProjects(data);
        setAdminMode(isAdminLoggedIn());
      });
    merge();
    window.addEventListener("adminDataUpdated", merge);
    return () => window.removeEventListener("adminDataUpdated", merge);
  }, []);

  return (
    <section className="space-y-8 section-spacing relative">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">{t("projects.title")}</h1>
              <span className="badge-accent">{allProjects.length}</span>
            </div>
            <p className="text-[var(--text-secondary)] max-w-xl mt-2 text-sm">{t("projects.subtitle")}</p>
          </div>
          {adminMode && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.openAdminWithTab?.("project")}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold
                bg-[rgba(var(--accent-rgb),0.1)] hover:bg-[rgba(var(--accent-rgb),0.15)]
                border border-[rgba(var(--accent-rgb),0.2)]
                text-[var(--accent)] transition-all duration-200 mt-1 cursor-pointer"
            >
              <Plus size={14} />
              {t("projects.addBtn")}
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* PROJECT GRID */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="relative w-full isolate pb-4"
      >
        <ChromaGrid items={allProjects} radius={320} damping={0.5} fadeOut={0.7} onItemClick={(item) => setSelectedProject(item)} />
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full max-w-3xl rounded-2xl overflow-hidden max-h-[90vh] flex flex-col"
              style={{
                background: "var(--bg-surface)",
                border: "1px solid var(--border-default)",
                boxShadow: "0 24px 64px rgba(0, 0, 0, 0.5)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glass shimmer */}
              <div className="glass-shimmer rounded-t-2xl" />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProject(null)}
                aria-label={t("projects.closeAria")}
                className="absolute top-3 right-3 z-30 p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)]
                  bg-[var(--bg-hover)] border border-[var(--border-subtle)] cursor-pointer transition-colors"
              >
                <X size={16} />
              </motion.button>

              {/* Image Area */}
              <div
                className="w-full h-[28vh] sm:h-[38vh] shrink-0 relative flex items-center justify-center p-4 sm:p-8 border-b border-[var(--border-subtle)] overflow-hidden"
                style={{ background: "rgba(0, 0, 0, 0.2)" }}
              >
                {/* Ambient glow */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${selectedProject.borderColor || "#10b981"}44 0%, transparent 70%)`,
                  }}
                />
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  decoding="async"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl relative z-10 border border-[var(--border-default)]"
                />
              </div>

              {/* Content Area */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1">
                <h2
                  className="text-xl sm:text-2xl font-bold font-[Space_Grotesk] tracking-tight"
                  style={{ color: selectedProject.borderColor || "#10b981" }}
                >
                  {selectedProject.title}
                </h2>

                <p className="text-[var(--text-secondary)] leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedProject.subtitle}
                </p>

                {selectedProject.url && (
                  <div className="mt-5 pt-5 border-t border-[var(--border-subtle)] flex justify-start">
                    <motion.a
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      href={selectedProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm cursor-pointer"
                      style={{
                        background: selectedProject.borderColor || "#10b981",
                        color: "#000",
                        boxShadow: `0 4px 16px ${selectedProject.borderColor || "#10b981"}35`,
                      }}
                    >
                      {t("projects.openBtn")} <ExternalLink size={14} />
                    </motion.a>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Projects;

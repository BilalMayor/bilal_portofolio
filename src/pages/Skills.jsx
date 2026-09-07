import { useState } from "react";
import MagicBento from "../components/ui/MagicBento";
import TechOrbitCluster from "../components/ui/TechOrbitCluster";
import skillsData, { skillCategories } from "../data/cardData";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { Compass, LayoutGrid } from "lucide-react";

const Skills = ({ onNavigatePage }) => {
  const { t } = useLanguage();
  const [viewMode, setViewMode] = useState("orbit"); // "orbit" | "bento"
  const [activeCategory, setActiveCategory] = useState("all");

  const totalSkills = skillCategories.reduce((sum, cat) => sum + cat.items.length, 0);

  const filterOptions = [
    { id: "all", label: "Semua", labelEn: "All", icon: "ri-apps-2-line" },
    ...skillCategories.map((cat) => ({
      id: cat.id,
      label: cat.name,
      labelEn: cat.name,
      icon: cat.icon,
    })),
  ];

  const displayedCategories =
    activeCategory === "all"
      ? skillCategories
      : skillCategories.filter((cat) => cat.id === activeCategory);

  return (
    <section className="space-y-6 sm:space-y-8 section-spacing max-w-7xl mx-auto">
      {/* HEADER WITH DUAL VIEW MODE SWITCHER */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
              {t("skills.title")}
            </h1>
            <span className="badge-accent">{totalSkills}</span>
          </div>
          <p className="text-[var(--text-secondary)] max-w-2xl mt-1.5 text-xs sm:text-sm">
            {t("skills.subtitle")}
          </p>
        </div>

        {/* View Mode Toggle Pill (3D Orbit vs Bento Grid) */}
        <div className="flex items-center p-1 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-subtle)] shrink-0 self-start sm:self-auto shadow-sm">
          <button
            onClick={() => setViewMode("orbit")}
            aria-label="3D Orbit Cluster View"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              viewMode === "orbit"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <Compass
              size={14}
              className={`${viewMode === "orbit" ? "text-[var(--accent)] animate-spin-slow" : ""}`}
            />
            <span>{t("skills.orbitMode") || "3D Orbit Cluster"}</span>
          </button>

          <button
            onClick={() => setViewMode("bento")}
            aria-label="Bento Grid View"
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
              viewMode === "bento"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            <LayoutGrid
              size={14}
              className={`${viewMode === "bento" ? "text-[var(--accent)]" : ""}`}
            />
            <span>{t("skills.bentoMode") || "Bento Grid"}</span>
          </button>
        </div>
      </motion.div>

      {/* MAIN VIEW CONTENT */}
      <AnimatePresence mode="wait">
        {viewMode === "orbit" ? (
          /* ═════════════════════════════════════════════════════════
             VIEW A: INTERACTIVE 3D TECH STACK ORBIT CLUSTER
             ═════════════════════════════════════════════════════════ */
          <motion.div
            key="orbit-view"
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="w-full"
          >
            <TechOrbitCluster
              onNavigateProjects={() => {
                if (onNavigatePage) onNavigatePage("proyek");
              }}
            />
          </motion.div>
        ) : (
          /* ═════════════════════════════════════════════════════════
             VIEW B: BENTO GRID VIEW WITH CATEGORY TABS
             ═════════════════════════════════════════════════════════ */
          <motion.div
            key="bento-view"
            initial={{ opacity: 0, scale: 0.98, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* CATEGORY FILTER TABS */}
            <div className="flex flex-wrap gap-1.5">
              {filterOptions.map((tab) => {
                const isActive = activeCategory === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveCategory(tab.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
                      cursor-pointer border transition-all duration-200 ${
                      isActive
                        ? "text-[var(--text-primary)] border-[rgba(var(--accent-rgb),0.25)] bg-[rgba(var(--accent-rgb),0.08)]"
                        : "text-[var(--text-tertiary)] border-[var(--border-subtle)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    <i className={`${tab.icon} text-[13px] ${isActive ? "text-[var(--accent)]" : ""}`} />
                    <span>{tab.label}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* CATEGORIZED SKILLS BENTO SECTIONS */}
            <div className="space-y-8">
              <AnimatePresence mode="wait">
                {displayedCategories.map((category, idx) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4, delay: idx * 0.06 }}
                    className="space-y-3"
                  >
                    {/* CATEGORY TITLE */}
                    <div className="flex items-center gap-2.5 px-1">
                      <i className={`${category.icon} text-[var(--accent)] text-sm`} />
                      <h2 className="text-lg font-semibold font-[Space_Grotesk] text-[var(--text-primary)]">
                        {category.name}
                      </h2>
                      <span className="text-[10px] text-[var(--text-muted)] font-['JetBrains_Mono']">
                        {category.items.length}
                      </span>
                    </div>

                    {/* BENTO GRID */}
                    <MagicBento data={category.items} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Skills;


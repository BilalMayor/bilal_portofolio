import React, { useState, useEffect } from "react";
import SpotlightCard from "../components/spotlight_card/SpotlightCard";
import { achievementsData } from "../data/achievementsData";
import { getMergedAchievements } from "../lib/adminStore";
import { isAdminLoggedIn } from "../lib/adminAuth";
import { motion, AnimatePresence } from "motion/react";
import { X, Plus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const cardStagger = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  },
};

const Achievements = () => {
  const { t, language } = useLanguage();
  // Show static data immediately — Firestore merge happens silently in background
  const [allAchievements, setAllAchievements] = useState(achievementsData);
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [adminMode, setAdminMode] = useState(isAdminLoggedIn());

  useEffect(() => {
    const merge = () =>
      getMergedAchievements(achievementsData).then((data) => {
        setAllAchievements(data);
        setAdminMode(isAdminLoggedIn());
      });
    merge();
    window.addEventListener("adminDataUpdated", merge);
    return () => window.removeEventListener("adminDataUpdated", merge);
  }, []);

  const translatedItems = t("achievements.items") || achievementsData;

  const displayAchievements = allAchievements.map((item) => {
    const matched = translatedItems.find((tItem) => tItem.id === item.id);
    if (matched) {
      return {
        ...item,
        title: matched.title || item.title,
        description: matched.description || item.description,
        tech: matched.tech || item.tech,
      };
    }
    return item;
  });

  return (
    <section className="space-y-4 relative">
      {/* Header */}
      <div className="section-spacing pb-0 max-w-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">{t("achievements.title")}</h1>
              <span className="badge-accent">{displayAchievements.length}</span>
            </div>
            <p className="text-[var(--text-secondary)] mt-2 leading-relaxed text-sm">{t("achievements.subtitle")}</p>
          </div>
          {adminMode && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => window.openAdminWithTab?.("achievement")}
              className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold
                bg-[rgba(var(--accent-rgb),0.1)] hover:bg-[rgba(var(--accent-rgb),0.15)]
                border border-[rgba(var(--accent-rgb),0.2)]
                text-[var(--accent)] transition-all duration-200 mt-1 cursor-pointer"
            >
              <Plus size={14} />
              {t("achievements.addBtn")}
            </motion.button>
          )}
        </div>
      </div>

      {/* Grid — staggered entrance animation */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-6 sm:px-8 pb-6"
        variants={cardStagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        {displayAchievements.map((item, index) => (
          <motion.div
            key={item.id || index}
            variants={cardVariant}
            whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }}
            onClick={() => setSelectedAchievement(item)}
            className="cursor-pointer group h-full"
          >
            <SpotlightCard
              spotlightColor="rgba(var(--accent-rgb), 0.15)"
              className="rounded-xl overflow-hidden h-full border border-[var(--border-subtle)] hover:border-[rgba(var(--accent-rgb),0.2)] transition-all duration-300 relative"
              style={{
                background: "var(--bg-elevated)",
              }}
            >
              {/* Glass shimmer */}
              <div className="glass-shimmer rounded-t-xl" />

              {/* IMAGE CONTAINER */}
              <div className="relative w-full overflow-hidden aspect-video border-b border-[var(--border-subtle)]" style={{ background: "rgba(0,0,0,0.2)" }}>
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* CONTENT */}
              <div className="p-4 space-y-2.5 flex flex-col justify-between flex-1">
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-[var(--accent)] group-hover:translate-x-0.5 transition-transform duration-200 line-clamp-1">
                    {item.title}
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {(Array.isArray(item.tech) ? item.tech : []).map((tech, i) => (
                      <span key={i} className="tag text-[10px]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed line-clamp-2">{item.description}</p>
              </div>
            </SpotlightCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal Popup */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md"
            onClick={() => setSelectedAchievement(null)}
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
              <div className="glass-shimmer rounded-t-2xl" />

              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedAchievement(null)}
                aria-label={t("achievements.closeAria")}
                className="absolute top-3 right-3 z-30 p-2 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--text-primary)]
                  bg-[var(--bg-hover)] border border-[var(--border-subtle)] cursor-pointer transition-colors"
              >
                <X size={16} />
              </motion.button>

              {/* Image */}
              <div
                className="w-full h-[28vh] sm:h-[38vh] shrink-0 relative flex items-center justify-center p-4 sm:p-8 border-b border-[var(--border-subtle)] overflow-hidden"
                style={{ background: "rgba(0, 0, 0, 0.2)" }}
              >
                <img
                  src={selectedAchievement.image}
                  alt={selectedAchievement.title}
                  decoding="async"
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl relative z-10 border border-[var(--border-default)]"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 space-y-4 overflow-y-auto flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--accent)] font-[Space_Grotesk] tracking-tight">
                  {selectedAchievement.title}
                </h2>

                <div className="flex flex-wrap gap-1.5">
                  {selectedAchievement.tech.map((tech, i) => (
                    <span key={i} className="tag text-xs py-1 px-2.5">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="h-px w-full bg-[var(--border-subtle)] my-3" />

                <p className="text-[var(--text-secondary)] leading-relaxed text-sm whitespace-pre-wrap">
                  {selectedAchievement.description}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Achievements;

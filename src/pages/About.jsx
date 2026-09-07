import TextType from "../components/text/TextType";
import DecryptedText from "../components/ui/DecryptedText";
import logo_telkom from "../assets/cards/logo_telkom.webp";
import bilal_avatar from "../assets/cards/bilal_avatar.webp";
import google_maps from "../assets/cards/google_maps.webp";
import BlurText from "../components/ui/BlurText";
import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import AnimatedList from "../components/ui/AnimatedList";

const Lanyard = lazy(() => import("../components/ui/Lanyard"));

const socialLinks = [
  { name: "linkedin", href: "https://www.linkedin.com/in/bilal-abdillah-549143422", label: "LinkedIn" },
  { name: "github", href: "https://github.com/BilalMayor", label: "GitHub" },
  { name: "instagram", href: "https://www.instagram.com/bilal.mayor", label: "Instagram" },
  { name: "mail", href: "mailto:bilalmayorab@gmail.com", label: "Email" },
];

const About = ({ isReady }) => {
  const { t } = useLanguage();
  const [showAllExp, setShowAllExp] = useState(false);

  const experiences = t("about.experiences") || [];

  return (
    <section className="relative">
      <div className="relative inset-0 z-10">
        <div className="max-w-7xl mx-auto section-spacing">

          {/* ═══════════════════ HERO ═══════════════════ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

            {/* TEXT — takes 5 columns on desktop */}
            <div className="lg:col-span-5 space-y-5 pt-2 lg:pt-12">
              {/* Eyebrow label */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] font-['JetBrains_Mono'] cursor-pointer"
              >
                <DecryptedText
                  text="Software Engineering Student"
                  speed={35}
                  maxIterations={8}
                  animateOn="hover"
                />
              </motion.div>

              {/* HEADLINE */}
              <BlurText
                text={t("about.greeting")}
                className="font-[Space_Grotesk] text-2xl sm:text-3xl lg:text-[2.5rem] font-bold leading-[1.15] tracking-tight text-[var(--text-primary)]"
                animateBy="words"
                delay={80}
                direction="top"
              />

              {/* ROLES — cycling text */}
              <TextType
                text={t("about.roles")}
                typingSpeed={35}
                deletingSpeed={25}
                pauseDuration={1200}
                cursorCharacter="_"
                className="text-[var(--accent)] tracking-wider text-[13px] font-semibold font-['JetBrains_Mono']"
              />

              {/* BIO */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-lg"
              >
                {t("about.bio")}
              </motion.p>

              {/* SOCIAL LINKS */}
              <motion.div
                className="flex items-center gap-4 pt-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
              >
                <span className="text-[var(--text-muted)] text-xs font-medium tracking-wide">{t("about.follow")}</span>

                <div className="flex items-center gap-2">
                  {socialLinks.map((item, i) => (
                    <motion.a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Profil ${item.label} Bilal Mayor Abdillah`}
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1], delay: 0.4 + i * 0.06 }}
                      whileHover={{ scale: 1.1, y: -1 }}
                      whileTap={{ scale: 0.9 }}
                      className="relative w-9 h-9 flex items-center justify-center rounded-lg
                        bg-[var(--bg-hover)] border border-[var(--border-subtle)] hover:border-[rgba(var(--accent-rgb),0.3)]
                        hover:bg-[rgba(var(--accent-rgb),0.1)] text-[var(--text-tertiary)] hover:text-[var(--accent)]
                        transition-all duration-300 cursor-pointer group"
                    >
                      <i className={`ri-${item.name}-fill text-base transition-colors duration-200`} />
                      {/* Tooltip */}
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded
                        text-[10px] font-medium text-[var(--text-secondary)] bg-[var(--bg-elevated)] border border-[var(--border-default)]
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        pointer-events-none whitespace-nowrap">
                        {item.label}
                      </span>
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* LANYARD 3D CARD — takes 7 columns on desktop, the signature element */}
            <div className="lg:col-span-7 h-[380px] sm:h-[440px] lg:h-[480px] w-full relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
                className="w-full h-full"
              >
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-6 h-6 border-2 border-zinc-800 border-t-[var(--accent)] rounded-full animate-spin" />
                      <span className="text-[var(--text-muted)] text-xs font-medium">{t("about.lanyardLoading")}</span>
                    </div>
                  </div>
                }>
                  <Lanyard position={[0, 0, 13]} fov={22} />
                </Suspense>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════ SECTION DIVIDER ═══════════════════ */}
      <div className="section-divider" />

      {/* ═══════════════════ BIODATA — Inline metadata strip ═══════════════════ */}
      <div className="section-spacing pt-0">
        <motion.div
          className="flex items-center gap-2 mb-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <i className="ri-information-line text-[var(--accent)] text-base" />
          <h3 className="text-base font-semibold text-[var(--text-primary)] font-[Space_Grotesk]">{t("about.biodata")}</h3>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          {/* NAME */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl group cursor-default transition-all duration-300 hover:bg-[var(--bg-hover)]"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-hover)] shrink-0 overflow-hidden">
              <img src={bilal_avatar} alt="Bilal Mayor Abdillah" width="32" height="32" decoding="async" className="w-8 h-8 rounded-full object-cover" />
            </div>
            <div>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.15em] font-['JetBrains_Mono'] mb-0.5">{t("about.nameLabel")}</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">Bilal Mayor Abdillah</p>
            </div>
          </div>

          {/* EDUCATION */}
          <a
            href="https://www.smktelkom-mlg.sch.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl group cursor-pointer transition-all duration-300 hover:bg-[var(--bg-hover)]"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-hover)] shrink-0 group-hover:bg-[rgba(var(--accent-rgb),0.1)] transition-colors duration-300">
              <img src={logo_telkom} alt="SMK Telkom Malang Logo" width="24" height="24" decoding="async" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.15em] font-['JetBrains_Mono'] mb-0.5">{t("about.educationLabel")}</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">SMK Telkom Malang</p>
            </div>
            <i className="ri-arrow-right-up-line text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors text-sm shrink-0" />
          </a>

          {/* LOCATION */}
          <a
            href="https://maps.google.com/?q=Malang"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl group cursor-pointer transition-all duration-300 hover:bg-[var(--bg-hover)]"
            style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-[var(--bg-hover)] shrink-0 group-hover:bg-[rgba(var(--accent-rgb),0.1)] transition-colors duration-300">
              <img src={google_maps} alt="Malang Map Icon" width="24" height="24" decoding="async" className="w-6 h-6 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-[0.15em] font-['JetBrains_Mono'] mb-0.5">{t("about.locationLabel")}</p>
              <p className="text-sm font-medium text-[var(--text-primary)]">Malang, Indonesia</p>
            </div>
            <i className="ri-arrow-right-up-line text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors text-sm shrink-0" />
          </a>
        </motion.div>
      </div>

      {/* ═══════════════════ SECTION DIVIDER ═══════════════════ */}
      <div className="section-divider" />

      {/* ═══════════════════ EXPERIENCE ═══════════════════ */}
      <div className="section-spacing pt-0 pb-8">
        <motion.div
          className="flex items-center gap-2 mb-5"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <i className="ri-organization-chart text-[var(--accent)] text-base" />
          <h3 className="text-base font-semibold text-[var(--text-primary)] font-[Space_Grotesk]">{t("about.experience")}</h3>
          <span className="badge-accent ml-auto">
            {experiences.length}
          </span>
        </motion.div>

        <AnimatedList
          items={showAllExp ? experiences : experiences.slice(0, 3)}
          showGradients={showAllExp}
          displayScrollbar={false}
          enableArrowNavigation={true}
          maxHeight={showAllExp ? "1200px" : "none"}
          renderItem={(item, index, isSelected) => (
            <div
              className={`w-full p-4 sm:p-5 rounded-xl transition-all duration-300 flex flex-col justify-between border ${
                isSelected
                  ? "border-[rgba(var(--accent-rgb),0.25)] bg-[var(--bg-hover)]"
                  : "border-[var(--border-subtle)] hover:border-[var(--border-hover)] bg-[var(--bg-elevated)]"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h4 className={`font-semibold text-sm sm:text-base transition-colors ${isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-primary)]"}`}>
                    {item.title}
                  </h4>
                  <span className="badge-accent text-[10px]">
                    {item.role}
                  </span>
                </div>
                <p className="text-xs sm:text-[13px] text-[var(--text-secondary)] mt-1 leading-relaxed">{item.desc}</p>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
                {item.tags.map((tag, tIdx) => (
                  <span key={tIdx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        />

        {/* Toggle Show More / Show Less Button */}
        <div className="mt-5 text-center">
          <motion.button
            layout
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowAllExp(!showAllExp)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-medium
              text-[var(--text-secondary)] border border-[var(--border-default)] bg-[var(--bg-elevated)]
              hover:bg-[var(--bg-hover)] hover:border-[var(--border-hover)] transition-all cursor-pointer"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={showAllExp ? "less" : "more"}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                {showAllExp ? t("about.showLess") : `${t("about.showAll")} (${experiences.length})`}
              </motion.span>
            </AnimatePresence>
            <motion.i
              animate={{ rotate: showAllExp ? 180 : 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="ri-arrow-down-s-line text-sm text-[var(--accent)]"
            />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default About;

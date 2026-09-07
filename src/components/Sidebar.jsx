import bilal_avatar from "../assets/cards/bilal_avatar.webp";
import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import ThemeComboToggle from "./ThemeComboToggle";
import { motion } from "motion/react";

const navItems = [
  { id: "tentang", icon: "ri-user-3-line" },
  { id: "galeri", icon: "ri-image-line" },
  { id: "keahlian", icon: "ri-code-line" },
  { id: "proyek", icon: "ri-folder-line" },
  { id: "pencapaian", icon: "ri-award-line" },
  { id: "kontak", icon: "ri-mail-line" },
  { id: "chat", icon: "ri-chat-3-line" },
];

const themeColors = [
  { name: "tangerine", class: "bg-[#FF6B35]", glow: "rgba(255, 107, 53, 0.6)" },
  { name: "turquoise", class: "bg-[#00F5D4]", glow: "rgba(0, 245, 212, 0.6)" },
  { name: "fuchsia", class: "bg-[#F72585]", glow: "rgba(247, 37, 133, 0.6)" },
  { name: "bronze", class: "bg-[#E2B870]", glow: "rgba(226, 184, 112, 0.6)" },
  { name: "indigo", class: "bg-[#6366F1]", glow: "rgba(99, 102, 241, 0.6)" },
];

const Sidebar = ({ setActivePage, activePage, activeColor, setActiveColor, isOpen, setIsOpen, colorCombo, setColorCombo }) => {
  const { t } = useLanguage();

  return (
    <>
      {/* Overlay - MOBILE ONLY */}
      <div
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 z-40 lg:hidden bg-black/50
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
          transition-all duration-300`}
      />

      {/* SIDEBAR */}
      <aside
        className={`fixed z-50 top-0 bottom-0 left-0 w-[17rem] rounded-r-2xl
          py-6 px-4 flex flex-col overflow-hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:translate-x-0 lg:rounded-none lg:z-40 lg:w-[16rem] lg:shrink-0 lg:h-full lg:overflow-hidden`}
        style={{
          background: "var(--bg-elevated)",
          borderRight: "1px solid var(--border-subtle)",
          transition: "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        {/* ─── Profile Section ─── */}
        <div className="mb-6 text-center relative z-10 px-2">
          <button
            onClick={() => setActivePage("tentang")}
            aria-label={t("sidebarAvatarAria")}
            className="block mx-auto mb-3 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] group cursor-pointer"
          >
            <div className="relative inline-flex items-center justify-center p-0.5 rounded-full border border-[var(--border-hover)] transition-all duration-300 group-hover:scale-105 group-hover:border-[rgba(var(--accent-rgb),0.3)]">
              <img
                src={bilal_avatar}
                alt="Bilal Mayor Abdillah Profile"
                width="56"
                height="56"
                decoding="async"
                className="w-14 h-14 rounded-full object-cover"
              />
            </div>
          </button>
          <h2 className="text-base font-semibold font-[Space_Grotesk] text-[var(--text-primary)] tracking-tight leading-tight">
            Bilal Mayor A.
          </h2>
          <p className="text-[11px] text-[var(--text-tertiary)] font-['JetBrains_Mono'] mt-1 tracking-wide">
            Frontend Developer
          </p>
          {/* Status indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ background: "var(--accent)" }}
              />
            </span>
            <span
              className="text-[10px] font-medium tracking-wide"
              style={{ color: "var(--accent)", opacity: 0.85 }}
            >
              Available
            </span>
          </div>
        </div>

        {/* Separator */}
        <div className="h-px mx-2 mb-3 bg-[var(--border-subtle)]" />

        {/* ─── Navigation ─── */}
        <nav className="flex-1 min-h-0 overflow-y-auto space-y-0.5 relative z-10 px-1" role="navigation" aria-label="Main Navigation">
          {navItems.map(({ id, icon }) => {
            const isActive = activePage === id;
            const label = t(`nav.${id}`);
            return (
              <button
                key={id}
                onClick={() => { setActivePage(id); setIsOpen(false); }}
                aria-current={isActive ? "page" : undefined}
                className={`group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
                  text-[13px] font-medium cursor-pointer transition-all duration-200
                  ${isActive
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"}`}
              >
                {/* Animated active background */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{
                      background: "var(--glass-bg-active)",
                      border: "1px solid var(--border-hover)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {/* Active accent bar */}
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active-bar"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 rounded-full"
                    style={{ background: "var(--accent)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <i className={`relative z-10 ${icon} text-[15px] transition-all duration-200
                  ${isActive ? "text-[var(--accent)]" : "opacity-60 group-hover:opacity-100"}`} />
                <span className={`relative z-10 tracking-wide ${isActive ? "font-semibold" : ""}`}>
                  {label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* ─── Theme Switcher — ALWAYS PINNED AT BOTTOM ─── */}
        <div className="pt-3 mt-auto border-t border-[var(--border-subtle)] relative z-20 shrink-0 space-y-3 px-2">
          <p className="text-[10px] text-[var(--text-muted)] text-center tracking-[0.2em] font-['JetBrains_Mono'] uppercase">
            {t("theme")}
          </p>
          <div className="flex justify-center gap-2.5">
            {themeColors.map(({ name, class: bg, glow }) => (
              <motion.button
                key={name}
                onClick={() => setActiveColor(name)}
                aria-label={`${t("themeAria")} ${name}`}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
                className={`w-4 h-4 rounded-full ${bg} cursor-pointer transition-all duration-300
                  ${activeColor === name
                    ? "ring-2 ring-[var(--text-primary)] ring-offset-1 ring-offset-[var(--bg-elevated)]"
                    : "opacity-40 hover:opacity-80"}`}
                style={{
                  boxShadow: activeColor === name ? `0 0 12px ${glow}` : "none",
                }}
              />
            ))}
          </div>
          {/* Theme combo & Language toggle in sidebar on mobile */}
          <div className="flex items-center justify-center gap-2 lg:hidden pt-1">
            <ThemeComboToggle colorCombo={colorCombo} setColorCombo={setColorCombo} />
            <LanguageToggle />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

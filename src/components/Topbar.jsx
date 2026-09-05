import { useLanguage } from "../context/LanguageContext";
import LanguageToggle from "./LanguageToggle";
import { motion, AnimatePresence } from "motion/react";
import { Terminal, Command } from "lucide-react";

const pageIcons = {
  tentang: "ri-user-3-line",
  galeri: "ri-image-line",
  keahlian: "ri-code-line",
  proyek: "ri-folder-line",
  pencapaian: "ri-award-line",
  kontak: "ri-mail-line",
  chat: "ri-chat-3-line",
};

const Topbar = ({ activePage, setIsSidebarOpen, onOpenCommandPalette }) => {
  const { t } = useLanguage();
  const pageTitle = t(`nav.${activePage}`) || activePage;
  const pageIcon = pageIcons[activePage] || "ri-pages-line";

  return (
    <header
      className="h-12 sm:h-14 px-4 sm:px-6 flex items-center justify-between shrink-0"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <div className="flex items-center gap-2.5">
        {/* Hamburger — mobile only */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="lg:hidden block text-[var(--text-tertiary)] hover:text-[var(--text-primary)] cursor-pointer p-1 -ml-1 rounded-lg hover:bg-[var(--bg-hover)] transition-colors"
          onClick={() => setIsSidebarOpen(true)}
          aria-label="Open Sidebar Menu"
        >
          <i className="ri-menu-4-line text-lg" />
        </motion.button>

        {/* Page title with animated icon */}
        <div className="flex items-center gap-2">
          <AnimatePresence mode="wait">
            <motion.i
              key={activePage + "-icon"}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className={`${pageIcon} text-sm text-[var(--accent)]`}
            />
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.h1
              key={activePage + "-title"}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 6 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="capitalize font-medium text-[var(--text-secondary)] text-xs sm:text-[13px] tracking-wide"
            >
              {pageTitle}
            </motion.h1>
          </AnimatePresence>
        </div>
      </div>

      {/* Right side — Command Center trigger + Language toggle */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Command Launcher Button */}
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer
            bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[rgba(var(--accent-rgb),0.3)]
            text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-all shadow-xs"
          title="Open Command Center (Ctrl + K)"
        >
          <Terminal size={13} className="text-[var(--accent)]" />
          <span className="hidden md:inline font-['JetBrains_Mono'] text-[11px]">Command Center</span>
          <span className="flex items-center gap-0.5 text-[10px] font-['JetBrains_Mono'] px-1.5 py-0.5 rounded bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-tertiary)]">
            <Command size={10} className="hidden sm:inline" />
            <span>K</span>
          </span>
        </motion.button>

        <div className="hidden lg:flex items-center">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
};

export default Topbar;

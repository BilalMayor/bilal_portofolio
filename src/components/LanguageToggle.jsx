import { useLanguage } from "../context/LanguageContext";
import { Globe } from "lucide-react";
import { motion } from "motion/react";

const LanguageToggle = ({ className = "" }) => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      aria-label={`Ganti Bahasa. Bahasa aktif: ${language.toUpperCase()}`}
      title={language === "id" ? "Switch to English" : "Ganti ke Bahasa Indonesia"}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full
        text-xs font-semibold tracking-wider cursor-pointer
        glass-card hover:border-white/20 ${className}`}
    >
      <Globe size={14} className="text-[var(--accent)] group-hover:rotate-12 transition-transform duration-300 shrink-0" />

      <div className="relative flex items-center gap-0.5 font-mono text-[11px]">
        {/* Sliding indicator */}
        <motion.div
          layout
          className="absolute inset-y-0 rounded-md"
          style={{
            background: "var(--accent)",
            width: "calc(50% - 2px)",
            left: language === "id" ? "0%" : "50%",
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
        <span
          className={`relative z-10 px-1.5 py-0.5 rounded-md transition-colors duration-200 ${
            language === "id" ? "text-black font-bold" : "text-zinc-400"
          }`}
        >
          ID
        </span>
        <span
          className={`relative z-10 px-1.5 py-0.5 rounded-md transition-colors duration-200 ${
            language === "en" ? "text-black font-bold" : "text-zinc-400"
          }`}
        >
          EN
        </span>
      </div>
    </motion.button>
  );
};

export default LanguageToggle;

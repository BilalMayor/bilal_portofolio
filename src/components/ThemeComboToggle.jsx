import React from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

export default function ThemeComboToggle({ colorCombo, setColorCombo, className = "" }) {
  const isCombo2 = colorCombo === "2";

  const handleToggle = () => {
    setColorCombo((prev) => (prev === "2" ? "1" : "2"));
  };

  return (
    <motion.button
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={handleToggle}
      className={`relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
        cursor-pointer transition-all duration-200 select-none
        bg-[var(--bg-elevated)] border border-[var(--border-default)] hover:border-[rgba(var(--accent-rgb),0.3)]
        text-[var(--text-secondary)] hover:text-[var(--text-primary)] shadow-xs ${className}`}
      title={
        isCombo2
          ? "Tema: Warna Kombinasi 2 (Putih Cerah & Hitam #131312). Klik untuk kembali ke Warna Kombinasi 1"
          : "Tema: Warna Kombinasi 1 (Dark Obsidian). Klik untuk beralih ke Warna Kombinasi 2"
      }
      aria-label={`Ganti Kombinasi Warna. Saat ini: Warna Kombinasi ${colorCombo}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isCombo2 ? (
          <Sun size={14} className="text-[var(--accent)] animate-spin-slow" />
        ) : (
          <Moon size={14} className="text-[var(--accent)]" />
        )}
      </div>

      <span className="font-['JetBrains_Mono'] text-[11px] font-medium hidden sm:inline">
        {isCombo2 ? "Kombinasi 2" : "Kombinasi 1"}
      </span>
      <span className="font-['JetBrains_Mono'] text-[11px] font-medium sm:hidden">
        {isCombo2 ? "C2" : "C1"}
      </span>
    </motion.button>
  );
}

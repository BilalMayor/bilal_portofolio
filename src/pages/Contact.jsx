import { useState } from "react";
import gmail from "../assets/cards/gmail.webp";
import instagram from "../assets/cards/instagram.webp";
import github from "../assets/cards/github.webp";
import linkedin from "../assets/cards/linkedin.webp";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import { Check, Copy, ArrowUpRight } from "lucide-react";

const socials = [
  {
    name: "Gmail",
    value: "bilalmayorab@gmail.com",
    href: "mailto:bilalmayorab@gmail.com",
    icon: gmail,
    copyable: true,
    description: "Primary email",
  },
  {
    name: "Instagram",
    value: "@bilal.mayor",
    href: "https://www.instagram.com/bilal.mayor",
    icon: instagram,
    description: "Personal feed",
  },
  {
    name: "GitHub",
    value: "github.com/BilalMayor",
    href: "https://github.com/BilalMayor",
    icon: github,
    description: "Code & projects",
  },
  {
    name: "LinkedIn",
    value: "in/bilal-abdillah-549143422",
    href: "https://www.linkedin.com/in/bilal-abdillah-549143422",
    icon: linkedin,
    description: "Professional profile",
  },
];

const Contact = () => {
  const { t } = useLanguage();
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = async (e, value) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(value);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="relative h-full flex items-center justify-center section-spacing">
      <div className="mx-auto w-full max-w-3xl">
        {/* Header — CTA-focused design */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-10 text-center"
        >
          <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-[var(--accent)] font-['JetBrains_Mono'] mb-3">
            Get in touch
          </p>
          <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--text-primary)] tracking-tight">
            {t("contact.title")}
          </h1>
          <p className="mt-2 text-[var(--text-secondary)] text-sm max-w-md mx-auto">{t("contact.subtitle")}</p>
        </motion.div>

        {/* GRID — 2x2 contact cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          {socials.map((item, index) => (
            <motion.a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.15 + index * 0.06 }}
              whileHover={{ y: -3 }}
              className="group relative overflow-hidden rounded-xl p-4 sm:p-5
                cursor-pointer border border-[var(--border-subtle)] hover:border-[rgba(var(--accent-rgb),0.2)]
                transition-all duration-300"
              style={{
                background: "var(--bg-elevated)",
              }}
            >
              {/* Shimmer */}
              <div className="glass-shimmer rounded-t-xl" />

              {/* Accent glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl pointer-events-none"
                style={{
                  background: "radial-gradient(circle at 50% 0%, rgba(var(--accent-rgb), 0.08) 0%, transparent 75%)",
                }}
              />

              <div className="relative z-10 flex items-center gap-3">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                    transition-all duration-300 ease-out group-hover:scale-105
                    bg-[var(--bg-hover)] border border-[var(--border-subtle)]
                    group-hover:bg-[rgba(var(--accent-rgb),0.08)] group-hover:border-[rgba(var(--accent-rgb),0.15)]"
                >
                  <img src={item.icon} alt={`${item.name} Logo`} loading="lazy" decoding="async" className="w-5 h-5 object-contain" />
                </div>

                {/* Text */}
                <div className="flex-1 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold text-[var(--text-primary)] text-sm group-hover:text-white transition-colors">{item.name}</p>
                    <span className="text-[10px] text-[var(--text-muted)] font-['JetBrains_Mono']">· {item.description}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--text-tertiary)] font-['JetBrains_Mono'] truncate">{item.value}</p>
                </div>

                {/* Copy button for email */}
                {item.copyable ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => handleCopyEmail(e, item.value)}
                    className="p-1.5 rounded-lg text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors cursor-pointer
                      bg-[var(--bg-hover)] border border-[var(--border-subtle)] hover:border-[rgba(var(--accent-rgb),0.2)]"
                    aria-label="Copy email"
                  >
                    {copiedEmail ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  </motion.button>
                ) : (
                  <ArrowUpRight size={14} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors shrink-0" />
                )}
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer accent */}
        <motion.p
          className="text-center mt-8 text-[11px] text-[var(--text-muted)] font-['JetBrains_Mono']"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          Prefer email? → bilalmayorab@gmail.com
        </motion.p>
      </div>
    </section>
  );
};

export default Contact;

import { useState } from "react";
import { motion } from "motion/react";
import { useLanguage } from "../context/LanguageContext";
import {
  MessageCircle,
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Sparkles
} from "lucide-react";
import gmail from "../assets/cards/gmail.webp";
import instagram from "../assets/cards/instagram.webp";
import github from "../assets/cards/github.webp";
import linkedin from "../assets/cards/linkedin.webp";

const Contact = () => {
  const { language } = useLanguage();
  const isId = language === "id";

  const [copiedEmail, setCopiedEmail] = useState(false);
  const emailAddress = "bilalmayorab@gmail.com";
  const waNumber = "6281234567890"; // Dapat diubah sesuai nomor asli Bilal

  const handleCopyEmail = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(emailAddress);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const contactChannels = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      subtitle: isId ? "Pesan Langsung & Chat Cepat" : "Direct Messaging & Chat",
      value: isId ? "Chat WhatsApp (+62)" : "WhatsApp Chat (+62)",
      href: `https://wa.me/${waNumber}`,
      isExternal: true,
      featured: true,
      actionLabel: isId ? "Buka WhatsApp" : "Open WhatsApp",
      icon: (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#25D366]/15 text-[#25D366] border border-[#25D366]/30">
          <MessageCircle size={22} />
        </div>
      ),
    },
    {
      id: "gmail",
      name: "Gmail",
      subtitle: isId ? "Email Resmi" : "Primary Email",
      value: emailAddress,
      href: `mailto:${emailAddress}`,
      isEmail: true,
      featured: true,
      actionLabel: isId ? "Kirim Email" : "Send Email",
      icon: (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
          <img src={gmail} alt="Gmail" className="w-5 h-5 object-contain" />
        </div>
      ),
    },
    {
      id: "github",
      name: "GitHub",
      subtitle: isId ? "Repositori & Kode Terbuka" : "Code Repositories & Open Source",
      value: "github.com/BilalMayor",
      href: "https://github.com/BilalMayor",
      isExternal: true,
      actionLabel: isId ? "Kunjungi Profil" : "Visit Profile",
      icon: (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
          <img src={github} alt="GitHub" className="w-5 h-5 object-contain" />
        </div>
      ),
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      subtitle: isId ? "Jaringan Profesional" : "Professional Network",
      value: "in/bilal-abdillah-549143422",
      href: "https://www.linkedin.com/in/bilal-abdillah-549143422",
      isExternal: true,
      actionLabel: isId ? "Lihat Profil" : "View Profile",
      icon: (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
          <img src={linkedin} alt="LinkedIn" className="w-5 h-5 object-contain" />
        </div>
      ),
    },
    {
      id: "instagram",
      name: "Instagram",
      subtitle: isId ? "Aktivitas & Keseharian" : "Daily Updates & Journey",
      value: "@bilal.mayor",
      href: "https://www.instagram.com/bilal.mayor",
      isExternal: true,
      actionLabel: isId ? "Buka Instagram" : "Open Instagram",
      icon: (
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
          <img src={instagram} alt="Instagram" className="w-5 h-5 object-contain" />
        </div>
      ),
    },
  ];

  return (
    <section className="relative min-h-full flex items-center justify-center section-spacing py-6">
      <div className="w-full max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-semibold bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.25)]"
          >
            <Sparkles size={13} className="animate-pulse" />
            <span>{isId ? "Informasi Kontak" : "Contact Channels"}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="font-[Space_Grotesk] text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[var(--text-primary)]"
          >
            {isId ? "Hubungi Saya" : "Get in Touch"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed"
          >
            {isId
              ? "Silakan terhubung langsung melalui platform komunikasi atau saluran media sosial di bawah ini."
              : "Feel free to reach out or connect directly through any of the communication platforms below."}
          </motion.p>
        </div>

        {/* Featured Channels: WhatsApp & Gmail (Top 2 large cards) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactChannels.slice(0, 2).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 + index * 0.08 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between transition-all"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <div className="glass-shimmer rounded-t-2xl" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {item.icon}
                  {item.isEmail ? (
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      className="p-2 rounded-lg cursor-pointer bg-[var(--bg-hover)] border border-[var(--border-subtle)] hover:border-[var(--accent)] transition-all"
                      title={isId ? "Salin alamat email" : "Copy email address"}
                    >
                      {copiedEmail ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-[var(--text-tertiary)]" />}
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 font-semibold">
                      WhatsApp Direct
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-[Space_Grotesk] font-bold text-base text-[var(--text-primary)]">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">{item.subtitle}</p>
                </div>

                <p className="font-semibold text-xs sm:text-sm text-[var(--text-primary)] font-mono truncate">
                  {item.value}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--text-muted)]">
                  {item.isEmail && copiedEmail ? (isId ? "Email disalin!" : "Copied!") : (isId ? "Saluran langsung" : "Direct channel")}
                </span>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] hover:underline"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social Profiles (3 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {contactChannels.slice(2).map((item, index) => (
            <motion.a
              key={item.id}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.06 }}
              whileHover={{ y: -3 }}
              className="rounded-xl p-4 sm:p-5 relative overflow-hidden flex flex-col justify-between group transition-all"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <div className="glass-shimmer rounded-t-xl" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {item.icon}
                  <ArrowUpRight size={15} className="text-[var(--text-muted)] group-hover:text-[var(--accent)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>

                <div>
                  <h4 className="font-[Space_Grotesk] font-bold text-sm text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-[var(--text-muted)] font-mono">{item.subtitle}</p>
                </div>

                <p className="text-xs text-[var(--text-secondary)] font-mono truncate">
                  {item.value}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Bottom Location Indicator */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] font-mono">
            <MapPin size={13} className="text-[var(--accent)]" />
            <span>Malang, Jawa Timur, Indonesia • SMK Telkom Malang</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

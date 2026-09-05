import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Terminal,
  Compass,
  Palette,
  ExternalLink,
  Copy,
  Check,
  X,
  HelpCircle,
  Play,
  User,
  ShieldCheck,
  Globe,
  Sparkles,
  ArrowRight,
  AlertTriangle,
  Code2
} from "lucide-react";
import DecryptedText from "./ui/DecryptedText";
import { useLanguage } from "../context/LanguageContext";

export default function CommandPalette({
  isOpen,
  onClose,
  setActivePage,
  setActiveColor,
  activeColor,
}) {
  const { language, toggleLanguage } = useLanguage();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [viewMode, setViewMode] = useState("all"); // 'all' | 'terminal' | 'manual'
  const [terminalLogs, setTerminalLogs] = useState([
    {
      type: "system",
      text: "⚡ Developer Command Center initialized. Type 'help' to see all valid commands.",
    },
  ]);
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const inputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Auto-scroll terminal
  useEffect(() => {
    if (viewMode === "terminal") {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [terminalLogs, viewMode]);

  // Show temporary toast
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2500);
  };

  // Supported commands definition
  const COMMAND_ITEMS = [
    // Navigation
    {
      id: "nav-about",
      title: "Go to About",
      desc: "Navigate to bio, profile and experience",
      category: "Navigation",
      keywords: ["about", "tentang", "bio", "home", "goto about"],
      icon: <User size={15} className="text-emerald-400" />,
      action: () => {
        setActivePage("tentang");
        onClose();
        showToast("Navigated to About");
      },
    },
    {
      id: "nav-projects",
      title: "Go to Projects",
      desc: "Explore featured web applications and repositories",
      category: "Navigation",
      keywords: ["projects", "proyek", "work", "portfolio", "goto projects"],
      icon: <Code2 size={15} className="text-sky-400" />,
      action: () => {
        setActivePage("proyek");
        onClose();
        showToast("Navigated to Projects");
      },
    },
    {
      id: "nav-skills",
      title: "Go to Skills",
      desc: "Browse frontend, QA, and development toolsets",
      category: "Navigation",
      keywords: ["skills", "keahlian", "tech", "stack", "goto skills"],
      icon: <Compass size={15} className="text-violet-400" />,
      action: () => {
        setActivePage("keahlian");
        onClose();
        showToast("Navigated to Skills");
      },
    },
    {
      id: "nav-achievements",
      title: "Go to Achievements",
      desc: "View professional certifications and competition awards",
      category: "Navigation",
      keywords: ["achievements", "pencapaian", "certs", "certificates", "goto achievements"],
      icon: <ShieldCheck size={15} className="text-amber-400" />,
      action: () => {
        setActivePage("pencapaian");
        onClose();
        showToast("Navigated to Achievements");
      },
    },
    {
      id: "nav-gallery",
      title: "Go to Gallery",
      desc: "Explore photo highlights, school journey & daily moments",
      category: "Navigation",
      keywords: ["gallery", "galeri", "photos", "moments", "goto gallery"],
      icon: <Sparkles size={15} className="text-pink-400" />,
      action: () => {
        setActivePage("galeri");
        onClose();
        showToast("Navigated to Gallery");
      },
    },
    {
      id: "nav-contact",
      title: "Go to Contact",
      desc: "Get in touch via Gmail, GitHub, or LinkedIn",
      category: "Navigation",
      keywords: ["contact", "kontak", "email", "reach", "goto contact"],
      icon: <ArrowRight size={15} className="text-teal-400" />,
      action: () => {
        setActivePage("kontak");
        onClose();
        showToast("Navigated to Contact");
      },
    },
    {
      id: "nav-chat",
      title: "Go to Chat Room",
      desc: "Open public interactive chat and guestbook",
      category: "Navigation",
      keywords: ["chat", "pesan", "room", "guestbook", "goto chat"],
      icon: <Terminal size={15} className="text-indigo-400" />,
      action: () => {
        setActivePage("chat");
        onClose();
        showToast("Navigated to Chat");
      },
    },

    // Themes
    {
      id: "theme-emerald",
      title: "Set Theme: Emerald",
      desc: "Switch accent color to Emerald Green",
      category: "Theme",
      keywords: ["theme emerald", "color green", "emerald", "hijau"],
      icon: <Palette size={15} className="text-emerald-400" />,
      action: () => {
        setActiveColor("emerald");
        showToast("Theme switched to Emerald");
      },
    },
    {
      id: "theme-sky",
      title: "Set Theme: Sky Blue",
      desc: "Switch accent color to Sky Blue",
      category: "Theme",
      keywords: ["theme sky", "color blue", "sky", "biru"],
      icon: <Palette size={15} className="text-sky-400" />,
      action: () => {
        setActiveColor("sky");
        showToast("Theme switched to Sky");
      },
    },
    {
      id: "theme-violet",
      title: "Set Theme: Violet",
      desc: "Switch accent color to Electric Violet",
      category: "Theme",
      keywords: ["theme violet", "color purple", "violet", "ungu"],
      icon: <Palette size={15} className="text-violet-400" />,
      action: () => {
        setActiveColor("violet");
        showToast("Theme switched to Violet");
      },
    },
    {
      id: "theme-amber",
      title: "Set Theme: Amber Gold",
      desc: "Switch accent color to Amber Gold",
      category: "Theme",
      keywords: ["theme amber", "color yellow", "amber", "kuning"],
      icon: <Palette size={15} className="text-amber-300" />,
      action: () => {
        setActiveColor("amber");
        showToast("Theme switched to Amber");
      },
    },
    {
      id: "theme-red",
      title: "Set Theme: Crimson Red",
      desc: "Switch accent color to Crimson Red",
      category: "Theme",
      keywords: ["theme red", "color red", "red", "merah"],
      icon: <Palette size={15} className="text-red-400" />,
      action: () => {
        setActiveColor("red");
        showToast("Theme switched to Red");
      },
    },

    // Actions & External Links
    {
      id: "act-copy-email",
      title: "Copy Email Address",
      desc: "Copy bilalmayorab@gmail.com to clipboard",
      category: "Actions",
      keywords: ["copy email", "email copy", "mail", "salin email"],
      icon: <Copy size={15} className="text-zinc-300" />,
      action: async () => {
        await navigator.clipboard.writeText("bilalmayorab@gmail.com");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        showToast("Email copied to clipboard!");
      },
    },
    {
      id: "act-open-github",
      title: "Open GitHub Profile",
      desc: "Visit https://github.com/BilalMayor in new tab",
      category: "Actions",
      keywords: ["github", "repo", "git", "open github"],
      icon: <ExternalLink size={15} className="text-zinc-300" />,
      action: () => {
        window.open("https://github.com/BilalMayor", "_blank");
        showToast("Opening GitHub profile...");
      },
    },
    {
      id: "act-open-linkedin",
      title: "Open LinkedIn Profile",
      desc: "Connect with Bilal Mayor on LinkedIn",
      category: "Actions",
      keywords: ["linkedin", "connect", "in", "open linkedin"],
      icon: <ExternalLink size={15} className="text-zinc-300" />,
      action: () => {
        window.open("https://www.linkedin.com/in/bilal-abdillah-549143422", "_blank");
        showToast("Opening LinkedIn profile...");
      },
    },
    {
      id: "act-toggle-lang",
      title: `Toggle Language (${language === "id" ? "EN" : "ID"})`,
      desc: `Switch interface to ${language === "id" ? "English" : "Bahasa Indonesia"}`,
      category: "Actions",
      keywords: ["lang", "language", "bahasa", "toggle language", "translate"],
      icon: <Globe size={15} className="text-zinc-300" />,
      action: () => {
        toggleLanguage();
        showToast(`Language switched to ${language === "id" ? "English" : "Bahasa Indonesia"}`);
      },
    },

    // Developer / QA Simulation Tools
    {
      id: "cli-test-qa",
      title: "Run QA Test Suite",
      desc: "Simulate automated Software QA test assertions & benchmarks",
      category: "Developer CLI",
      keywords: ["run test", "test qa", "npm test", "qa", "test"],
      icon: <Play size={15} className="text-emerald-400" />,
      action: () => {
        executeCliCommand("run test");
      },
    },
    {
      id: "cli-whoami",
      title: "CLI: whoami",
      desc: "Print current developer credentials, education & status",
      category: "Developer CLI",
      keywords: ["whoami", "about me", "info developer"],
      icon: <Terminal size={15} className="text-sky-400" />,
      action: () => {
        executeCliCommand("whoami");
      },
    },
  ];

  // Reference for valid vs invalid commands
  const COMMAND_REFERENCE = {
    valid: [
      { cmd: "help / commands / ?", desc: "Show complete list of all supported commands" },
      { cmd: "whoami", desc: "Display developer bio, school, and current stack" },
      { cmd: "run test / test qa", desc: "Execute simulated automated Software QA test suite" },
      { cmd: "goto [page]", desc: "Navigate to: about, projects, skills, achievements, gallery, contact, chat" },
      { cmd: "theme [color]", desc: "Change theme to: emerald, sky, violet, amber, red" },
      { cmd: "copy email", desc: "Copy bilalmayorab@gmail.com directly to clipboard" },
      { cmd: "github / linkedin", desc: "Open developer's social & coding profiles" },
      { cmd: "lang [id/en]", desc: "Switch language between Indonesian and English" },
      { cmd: "sudo hire-me", desc: "Special easter egg for recruiters & hiring managers" },
      { cmd: "echo [text]", desc: "Print custom string to the terminal console" },
      { cmd: "clear", desc: "Wipe all console logs in the terminal" },
    ],
    invalid: [
      { cmd: "hack / inject / bypass", reason: "Blocked: Portofolio runs in a secure sandboxed environment." },
      { cmd: "rm -rf / delete", reason: "Blocked: Read-only production environment. Cannot destroy assets." },
      { cmd: "play game / open steam", reason: "Unrecognized: No game runtime embedded in this portfolio." },
      { cmd: "download-all-code", reason: "Unsupported: Please clone public repositories from GitHub." },
      { cmd: "sudo root / make coffee", reason: "Unsupported: User is not in the sudoers file." },
    ],
  };

  // Filter items based on query
  const filteredItems = COMMAND_ITEMS.filter((item) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q))
    );
  });

  // Execute CLI Command directly
  const executeCliCommand = (rawInput) => {
    const trimmed = rawInput.trim();
    if (!trimmed) return;

    setViewMode("terminal");
    const lower = trimmed.toLowerCase();

    // Add user input to terminal
    const newLogs = [...terminalLogs, { type: "input", text: `$ ${trimmed}` }];

    // Command Dispatcher
    if (lower === "help" || lower === "commands" || lower === "?") {
      newLogs.push({
        type: "output",
        text: `📋 AVAILABLE COMMANDS:\n  • whoami          : Developer summary & credentials\n  • run test        : Run automated QA test simulations\n  • goto [page]     : about, projects, skills, achievements, gallery, contact, chat\n  • theme [color]   : emerald, sky, violet, amber, red\n  • copy email      : Copy email to clipboard\n  • github/linkedin : Open external profiles\n  • lang [id|en]    : Toggle language\n  • sudo hire-me    : Recruiter fast-track easter egg\n  • echo [msg]      : Echo back string\n  • clear           : Clear console`,
      });
    } else if (lower === "whoami") {
      newLogs.push({
        type: "output",
        text: `👨‍💻 DEVELOPER PROFILE:\n  Name     : Bilal Mayor Abdillah\n  Role     : Frontend Developer & Software QA Enthusiast\n  School   : SMK Telkom Malang (Software Engineering)\n  Location : Malang, Indonesia\n  Status   : Available for projects & internships 🚀`,
      });
    } else if (lower === "run test" || lower === "test qa" || lower === "npm test" || lower === "test") {
      newLogs.push({
        type: "qa",
        text: `🧪 RUNNING SUITE: portfolio-qa-e2e\n  ✓ [PASS] Responsive Viewport Check (375px - 1440px)\n  ✓ [PASS] Form Input Sanitization & Edge-case Bounds\n  ✓ [PASS] Three.js Lanyard Canvas Render Pipeline (60 FPS)\n  ✓ [PASS] Firebase Auth & Firestore Realtime Sync (Latency: 42ms)\n  ✓ [PASS] Color Contrast Accessibility (WCAG AAA Standard)\n\n  📊 Tests: 5 passed, 5 total | Time: 0.48s | Coverage: 98.4%`,
      });
    } else if (lower.startsWith("goto ")) {
      const target = lower.replace("goto ", "").trim();
      const pageMap = {
        about: "tentang",
        tentang: "tentang",
        projects: "proyek",
        proyek: "proyek",
        skills: "keahlian",
        keahlian: "keahlian",
        achievements: "pencapaian",
        pencapaian: "pencapaian",
        certs: "pencapaian",
        gallery: "galeri",
        galeri: "galeri",
        contact: "kontak",
        kontak: "kontak",
        chat: "chat",
      };
      if (pageMap[target]) {
        setActivePage(pageMap[target]);
        newLogs.push({ type: "success", text: `🚀 Navigated successfully to '${target}' page.` });
        showToast(`Navigated to ${target}`);
      } else {
        newLogs.push({
          type: "error",
          text: `❌ Unknown page: '${target}'. Valid pages: about, projects, skills, achievements, gallery, contact, chat`,
        });
      }
    } else if (lower.startsWith("theme ")) {
      const color = lower.replace("theme ", "").trim();
      if (["emerald", "sky", "violet", "amber", "red"].includes(color)) {
        setActiveColor(color);
        newLogs.push({ type: "success", text: `🎨 Theme accent color changed to '${color}'.` });
        showToast(`Theme changed to ${color}`);
      } else {
        newLogs.push({
          type: "error",
          text: `❌ Invalid theme '${color}'. Supported: emerald, sky, violet, amber, red`,
        });
      }
    } else if (lower === "copy email" || lower === "email") {
      navigator.clipboard.writeText("bilalmayorab@gmail.com");
      newLogs.push({ type: "success", text: `📋 Copied 'bilalmayorab@gmail.com' to your clipboard.` });
      showToast("Email copied!");
    } else if (lower === "github") {
      window.open("https://github.com/BilalMayor", "_blank");
      newLogs.push({ type: "success", text: `🌐 Opened GitHub repository in a new browser tab.` });
    } else if (lower === "linkedin") {
      window.open("https://www.linkedin.com/in/bilal-abdillah-549143422", "_blank");
      newLogs.push({ type: "success", text: `🌐 Opened LinkedIn profile in a new browser tab.` });
    } else if (lower === "sudo hire-me" || lower === "hire" || lower === "hire me") {
      newLogs.push({
        type: "success",
        text: `🎉 EXCELLENT DECISION!\n  Bilal Mayor is ready to bring high attention-to-detail, modern UI craft, and QA testing standards to your team.\n  👉 Email: bilalmayorab@gmail.com\n  👉 WhatsApp / Direct: Let's connect on LinkedIn!`,
      });
      setActivePage("kontak");
    } else if (lower.startsWith("echo ")) {
      const echoMsg = trimmed.substring(5);
      newLogs.push({ type: "output", text: echoMsg });
    } else if (lower === "clear" || lower === "cls") {
      setTerminalLogs([{ type: "system", text: "⚡ Console cleared. Type 'help' for commands list." }]);
      setQuery("");
      return;
    } else {
      // INVALID / UNRECOGNIZED COMMAND FEEDBACK
      newLogs.push({
        type: "error",
        text: `❌ Command '${trimmed}' is not recognized or unsupported in this sandbox environment.\n\n💡 TIP: Type 'help' or click the 'Manual' tab to view all valid commands you can run!`,
      });
    }

    setTerminalLogs(newLogs);
    setQuery("");
  };

  // Keyboard navigation inside modal
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }

    if (viewMode === "all") {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (query.trim().startsWith(">") || query.trim().startsWith("$")) {
          // Direct CLI execution
          executeCliCommand(query.replace(/^[>$]\s*/, ""));
        } else if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action();
        } else if (query.trim()) {
          // Attempt CLI fallback for arbitrary text
          executeCliCommand(query);
        }
      }
    } else if (viewMode === "terminal" && e.key === "Enter") {
      e.preventDefault();
      executeCliCommand(query);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-start justify-center p-3 sm:p-6 pt-[8vh] sm:pt-[12vh]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: -16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: -16 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans z-10"
          style={{
            background: "rgba(14, 14, 18, 0.92)",
            backdropFilter: "blur(32px) saturate(180%)",
            border: "1px solid var(--border-default)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}
          onKeyDown={handleKeyDown}
        >
          {/* Glass Top Shimmer */}
          <div className="glass-shimmer rounded-t-2xl" />

          {/* Toast Notice */}
          <AnimatePresence>
            {toastMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-3 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-[var(--accent)] text-black font-semibold text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Check size={13} />
                <span>{toastMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Search / Command Input Header */}
          <div className="p-3 sm:p-4 border-b border-[var(--border-subtle)] flex items-center gap-3">
            <div className="flex items-center gap-2 text-[var(--accent)] shrink-0">
              <Terminal size={18} />
              <span className="font-['JetBrains_Mono'] text-xs font-bold">$</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder={
                viewMode === "terminal"
                  ? "Type command (e.g. whoami, run test, help, theme sky)..."
                  : "Type a command or search action (or press Enter to run as CLI)..."
              }
              className="flex-1 bg-transparent text-[var(--text-primary)] text-sm sm:text-base placeholder:text-[var(--text-muted)] focus:outline-none font-['JetBrains_Mono']"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded text-[var(--text-tertiary)] hover:text-white transition-colors cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
            <button
              onClick={onClose}
              className="px-2 py-1 rounded-md text-[10px] font-['JetBrains_Mono'] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] bg-[var(--bg-hover)] border border-[var(--border-subtle)] transition-colors cursor-pointer"
            >
              ESC
            </button>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="px-3 sm:px-4 py-2 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setViewMode("all")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "all"
                    ? "bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.25)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <Compass size={13} />
                <span>Commands</span>
              </button>
              <button
                onClick={() => setViewMode("terminal")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "terminal"
                    ? "bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.25)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <Terminal size={13} />
                <span>CLI Terminal</span>
              </button>
              <button
                onClick={() => setViewMode("manual")}
                className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  viewMode === "manual"
                    ? "bg-[rgba(var(--accent-rgb),0.12)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.25)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                <HelpCircle size={13} />
                <span>Command Reference</span>
              </button>
            </div>

            <span className="hidden sm:inline text-[10px] text-[var(--text-muted)] font-['JetBrains_Mono']">
              {filteredItems.length} available actions
            </span>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="max-h-[50vh] sm:max-h-[55vh] overflow-y-auto p-2 sm:p-3 scrollbar-thin scrollbar-thumb-zinc-800">
            {/* VIEW 1: COMMAND LIST */}
            {viewMode === "all" && (
              <div className="space-y-1">
                {filteredItems.length === 0 ? (
                  <div className="p-8 text-center space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
                      <AlertTriangle size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        No direct match found for "{query}"
                      </p>
                      <p className="text-xs text-[var(--text-tertiary)] mt-1 font-['JetBrains_Mono']">
                        Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">Enter</kbd> to execute as raw CLI command, or check the Manual tab.
                      </p>
                    </div>
                    <button
                      onClick={() => executeCliCommand(query)}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold bg-[var(--accent)] text-black cursor-pointer shadow"
                    >
                      <Play size={12} />
                      <span>Run "{query}" in Terminal</span>
                    </button>
                  </div>
                ) : (
                  filteredItems.map((item, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <div
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full p-2.5 sm:p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? "bg-[var(--bg-hover)] border border-[rgba(var(--accent-rgb),0.3)] shadow-sm"
                            : "border border-transparent hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                              isSelected
                                ? "bg-[rgba(var(--accent-rgb),0.15)] border border-[rgba(var(--accent-rgb),0.3)]"
                                : "bg-[var(--bg-surface)] border border-[var(--border-subtle)]"
                            }`}
                          >
                            {item.icon}
                          </div>
                          <div className="min-w-0 text-left">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs sm:text-sm font-medium ${isSelected ? "text-white" : "text-[var(--text-primary)]"}`}>
                                <DecryptedText
                                  text={item.title}
                                  speed={30}
                                  maxIterations={6}
                                  animateOn="hover"
                                />
                              </span>
                            </div>
                            <p className="text-[11px] text-[var(--text-tertiary)] truncate">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] text-[var(--text-muted)] font-['JetBrains_Mono'] px-2 py-0.5 rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                            {item.category}
                          </span>
                          {isSelected && (
                            <ArrowRight size={14} className="text-[var(--accent)] animate-pulse" />
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* VIEW 2: CLI TERMINAL MODE */}
            {viewMode === "terminal" && (
              <div className="font-['JetBrains_Mono'] text-xs space-y-2 p-2 sm:p-3 rounded-xl bg-black/40 border border-[var(--border-subtle)] min-h-[220px]">
                {terminalLogs.map((log, idx) => (
                  <div key={idx} className="leading-relaxed whitespace-pre-wrap break-all">
                    {log.type === "input" && (
                      <span className="text-[var(--accent)] font-semibold">{log.text}</span>
                    )}
                    {log.type === "system" && (
                      <span className="text-zinc-400">{log.text}</span>
                    )}
                    {log.type === "output" && (
                      <span className="text-zinc-200">{log.text}</span>
                    )}
                    {log.type === "success" && (
                      <span className="text-emerald-400">{log.text}</span>
                    )}
                    {log.type === "qa" && (
                      <span className="text-sky-300 bg-sky-950/30 p-2 rounded-lg block border border-sky-800/40">
                        {log.text}
                      </span>
                    )}
                    {log.type === "error" && (
                      <span className="text-rose-400 bg-rose-950/30 p-2 rounded-lg block border border-rose-900/40">
                        {log.text}
                      </span>
                    )}
                  </div>
                ))}
                <div ref={terminalEndRef} />
              </div>
            )}

            {/* VIEW 3: COMMAND REFERENCE MANUAL */}
            {viewMode === "manual" && (
              <div className="space-y-4 p-2 font-['JetBrains_Mono'] text-xs">
                {/* VALID COMMANDS SECTION */}
                <div>
                  <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2.5 pb-1 border-b border-emerald-500/20">
                    <Check size={14} />
                    <span>COMMAND YANG BISA DIGUNAKAN (VALID COMMANDS)</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {COMMAND_REFERENCE.valid.map((item, i) => (
                      <div
                        key={i}
                        onClick={() => {
                          setQuery(item.cmd.split(" ")[0]);
                          setViewMode("terminal");
                        }}
                        className="p-2.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-emerald-500/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <code className="text-[var(--accent)] font-bold text-xs group-hover:underline">
                            $ {item.cmd}
                          </code>
                          <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300">Click to run →</span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* INVALID COMMANDS SECTION */}
                <div>
                  <div className="flex items-center gap-2 text-rose-400 font-semibold mb-2.5 pb-1 border-b border-rose-500/20">
                    <AlertTriangle size={14} />
                    <span>CONTOH COMMAND YANG TIDAK BISA / INVALID</span>
                  </div>
                  <div className="grid grid-cols-1 gap-2">
                    {COMMAND_REFERENCE.invalid.map((item, i) => (
                      <div
                        key={i}
                        className="p-2.5 rounded-lg bg-rose-950/15 border border-rose-900/30 text-zinc-300"
                      >
                        <code className="text-rose-400 font-bold text-xs line-through opacity-80">
                          $ {item.cmd}
                        </code>
                        <p className="text-[11px] text-zinc-400 mt-1 font-sans">
                          {item.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="p-3 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[var(--text-tertiary)] font-['JetBrains_Mono']">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">↑↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">↵</kbd>
                <span>Select / Run</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 text-[10px]">Ctrl+K</kbd>
                <span>Toggle</span>
              </span>
            </div>

            <span className="text-[10px] text-[var(--text-muted)]">
              Developer CLI v2.0
            </span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

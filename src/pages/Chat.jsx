import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import { loginWithGoogle, loginWithGithub } from "../lib/auth";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, limitToLast } from "firebase/firestore";
import google from "../assets/cards/google.svg";
import github from "../assets/cards/github.webp";
import CyberCore from "../components/ui/CyberCore";
import {
  LogOut,
  Send,
  Sparkles,
  MessageSquare,
  Zap,
  Check,
  Copy,
  Terminal,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const quickPrompts = [
  "Halo Bilal! Saya tertarik dengan portofolio Anda.",
  "Bagaimana pengalaman Anda di bidang Software QA?",
  "Bisa ceritakan tentang proyek web yang paling menantang?",
  "Apakah Anda terbuka untuk peluang magang / freelance?",
];

const Chat = () => {
  const { language } = useLanguage();
  const isId = language === "id";

  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const messagesEndRef = useRef(null);

  // Firestore real-time listener (capped at last 80 messages to prevent memory exhaustion / DoS)
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"), limitToLast(80));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => {
        console.warn("Firestore snapshot error:", error);
      }
    );
    return () => unsub();
  }, []);

  // Firebase auth state observer
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.displayName) {
        localStorage.setItem("last_chat_user_name", currentUser.displayName);
      }
    });
    return () => unsub();
  }, []);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!message.trim() || !user || isSending || cooldown) return;
    
    // Strict input length validation and sanitization
    const cleanText = message.trim().slice(0, 500);
    if (!cleanText) return;

    setMessage("");
    setIsSending(true);
    setCooldown(true);
    setTimeout(() => setCooldown(false), 1500); // 1.5s anti-flood throttling

    const safePhoto = (url) => {
      if (url && typeof url === "string" && (url.startsWith("https://") || url.startsWith("http://"))) {
        return url;
      }
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "A")}&background=FF6B35&color=fff`;
    };

    const cleanName = (user.displayName || "Anonymous Explorer")
      .replace(/[^\p{L}\p{N}\s._-]/gu, "")
      .trim()
      .slice(0, 40) || "Anonymous Explorer";

    try {
      await addDoc(collection(db, "messages"), {
        text: cleanText,
        uid: user.uid,
        name: cleanName,
        photo: safePhoto(user.photoURL),
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.warn("Google login popup closed or failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGithubLogin = async () => {
    setIsLoggingIn(true);
    try {
      await loginWithGithub();
    } catch (error) {
      console.warn("GitHub login failed:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleCopyMessage = async (id, text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <section className="relative px-3 sm:px-6 py-4 h-full flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col justify-center">
        {!user ? (
          /* ═════════════════════════════════════════════════════════════
             STATE A: NOT LOGGED IN — Split Console & CyberCore Matrix
             ═════════════════════════════════════════════════════════════ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-6">
            {/* Left: Login Terminal */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 rounded-2xl p-6 sm:p-8 relative overflow-hidden flex flex-col justify-between"
              style={{
                background: "var(--bg-elevated)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--glass-shadow-elevated)",
              }}
            >
              <div className="glass-shimmer rounded-t-2xl" />

              <div className="space-y-6">
                {/* Header Badge */}
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.25)]">
                    <Terminal size={13} />
                    <span>Bilal Community Network</span>
                  </div>

                  <h1 className="font-[Space_Grotesk] text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                    {isId ? "Ruang Diskusi & Pesan Langsung" : "Live Chat & Community Hub"}
                  </h1>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {isId
                      ? "Masuk secara instan dengan akun Google atau GitHub Anda untuk bergabung dalam diskusi dan meninggalkan pesan."
                      : "Sign in instantly with your Google or GitHub account to join the discussion and leave a message."}
                  </p>
                </div>

                {/* Direct One-Click Auth */}
                <div className="space-y-3 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleGoogleLogin}
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-3.5 rounded-xl py-3.5 px-4 cursor-pointer font-semibold text-xs sm:text-sm transition-all"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--glass-shadow)",
                    }}
                  >
                    <img src={google} alt="Google" className="w-5 h-5 object-contain" />
                    <span>{isLoggingIn ? "Menghubungkan..." : (isId ? "Masuk Otomatis dengan Google" : "Instant Sign In with Google")}</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.015, y: -2 }}
                    whileTap={{ scale: 0.985 }}
                    onClick={handleGithubLogin}
                    disabled={isLoggingIn}
                    className="w-full flex items-center justify-center gap-3.5 rounded-xl py-3.5 px-4 cursor-pointer font-semibold text-xs sm:text-sm transition-all"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border-default)",
                      color: "var(--text-primary)",
                      boxShadow: "var(--glass-shadow)",
                    }}
                  >
                    <img src={github} alt="GitHub" className="w-5 h-5 object-contain" />
                    <span>{isId ? "Lanjutkan dengan GitHub" : "Continue with GitHub"}</span>
                  </motion.button>
                </div>
              </div>

              {/* Status footer */}
              <div className="pt-6 mt-6 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] text-[var(--text-muted)] font-mono">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-[var(--accent)]" />
                  <span>Persistent Session Enabled</span>
                </span>
                <span>{messages.length} Pesan Tersimpan</span>
              </div>
            </motion.div>

            {/* Right: New Cybernetic Holographic Quantum Core */}
            <div className="lg:col-span-5 flex justify-center items-center">
              <CyberCore />
            </div>
          </div>
        ) : (
          /* ═════════════════════════════════════════════════════════════
             STATE B: LOGGED IN — Full Glass Chat Console
             ═════════════════════════════════════════════════════════════ */
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl mx-auto rounded-2xl p-4 sm:p-6 flex flex-col justify-between relative overflow-hidden h-[80vh] sm:h-[75vh]"
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--glass-shadow-elevated)",
            }}
          >
            <div className="glass-shimmer rounded-t-2xl" />

            {/* Header User Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-9 h-9 rounded-full object-cover border-2 border-[var(--accent)] shadow-sm"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "U")}&background=FF6B35&color=fff&bold=true`;
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-[var(--bg-elevated)]" />
                </div>
                <div>
                  <h2 className="font-[Space_Grotesk] font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    {user.displayName || "Community Member"}
                    <span className="text-[9px] font-mono px-2 py-0.2 rounded-full bg-[rgba(var(--accent-rgb),0.15)] text-[var(--accent)]">
                      Active
                    </span>
                  </h2>
                  <p className="text-[10px] text-[var(--text-muted)] font-mono">
                    {user.email || "Guest Session (Persistent)"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => signOut(auth)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--text-tertiary)] hover:text-red-400 bg-[var(--bg-hover)] border border-[var(--border-subtle)] hover:border-red-500/20 transition-all cursor-pointer"
                >
                  <LogOut size={13} />
                  <span className="hidden sm:inline">{isId ? "Keluar" : "Log out"}</span>
                </motion.button>
              </div>
            </div>

            {/* Message Stream */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-[var(--text-muted)] space-y-2">
                  <MessageSquare size={32} className="text-[var(--accent)] opacity-60 animate-bounce" />
                  <p className="font-semibold text-sm text-[var(--text-primary)]">
                    {isId ? "Belum Ada Pesan" : "No Messages Yet"}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] max-w-xs">
                    {isId ? "Jadilah yang pertama menyapa Bilal atau tinggalkan pesan di ruang diskusi!" : "Be the first to say hello or leave a note in the chat!"}
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = msg.uid === user.uid;
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
                    >
                      {!isMe && (
                        <img
                          src={msg.photo && typeof msg.photo === "string" && (msg.photo.startsWith("https://") || msg.photo.startsWith("http://")) ? msg.photo : `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.name || "U")}&background=FF6B35&color=fff`}
                          alt={msg.name || "User"}
                          loading="lazy"
                          className="w-7 h-7 rounded-full object-cover shrink-0 mt-1 border border-[var(--border-subtle)]"
                        />
                      )}

                      <div
                        className="group relative max-w-[85%] sm:max-w-[75%] rounded-2xl p-3 text-xs sm:text-sm leading-relaxed"
                        style={
                          isMe
                            ? {
                                background: "var(--accent)",
                                color: "#000",
                                fontWeight: 500,
                                borderBottomRightRadius: "4px",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                              }
                            : {
                                background: "var(--bg-hover)",
                                color: "var(--text-primary)",
                                border: "1px solid var(--border-subtle)",
                                borderBottomLeftRadius: "4px",
                              }
                        }
                      >
                        {!isMe && (
                          <div className="flex items-center justify-between gap-3 mb-1">
                            <span className="font-bold text-[11px] text-[var(--accent)]">
                              {msg.name}
                            </span>
                          </div>
                        )}

                        <p className="whitespace-pre-wrap break-words">{msg.text}</p>

                        {/* Copy button on hover */}
                        <button
                          type="button"
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className={`absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                            isMe ? "hover:bg-black/15 text-black" : "hover:bg-white/10 text-[var(--text-muted)]"
                          }`}
                          title="Copy text"
                        >
                          {copiedId === msg.id ? <Check size={11} /> : <Copy size={11} />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Chips */}
            <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              <span className="text-[10px] font-mono text-[var(--text-muted)] shrink-0 flex items-center gap-1">
                <Sparkles size={11} className="text-[var(--accent)]" />
                {isId ? "Saran:" : "Prompts:"}
              </span>
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessage(prompt)}
                  className="shrink-0 text-[11px] px-2.5 py-1 rounded-full bg-[var(--bg-hover)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer truncate max-w-[220px]"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)] shrink-0">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder={isId ? "Tulis pesan di sini... (Enter untuk kirim)" : "Write your message... (Enter to send)"}
                className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-none focus:outline-none"
              />

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleSend}
                disabled={!message.trim()}
                type="button"
                className="h-10 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-35 disabled:cursor-not-allowed transition-all shrink-0"
                style={{
                  background: "var(--accent)",
                  color: "#000",
                }}
              >
                <span className="hidden sm:inline">{isId ? "Kirim" : "Send"}</span>
                <Send size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default Chat;
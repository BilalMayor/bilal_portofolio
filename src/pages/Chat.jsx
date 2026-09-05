import { motion } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import { loginWithGoogle, loginWithGithub } from "../lib/auth";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { addDoc, serverTimestamp } from "firebase/firestore";

import { db } from "../lib/firebase";

import google from "../assets/cards/google.svg";
import github from "../assets/cards/github.webp";
import Orb from "../components/ui/Orb";
import { LogOut, Send } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

const Chat = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    console.log("User object saat kirim:", {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      providerData: user.providerData
    });

    try {
      const docRef = await addDoc(collection(db, "messages"), {
        text: message,
        uid: user.uid,
        name: user.displayName || "Anonymous",
        photo: user.photoURL,
        createdAt: serverTimestamp(),
      });

      console.log("Message saved with ID:", docRef.id);
    } catch (error) {
      console.error("Error saving:", error);
    }

    setMessage("");
  };

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "asc"));

    const unsub = onSnapshot(q, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <section className="relative px-4 h-full">
      <div
        className={`
      max-w-6xl mx-auto h-full
      grid gap-6 lg:gap-8 items-center
      ${user ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-12"}
    `}
      >
        {/* CHAT / LOGIN COLUMN */}
        <div
          className={`
        flex justify-center
        ${user ? "col-span-1" : "lg:col-span-7"}
      `}
        >
          <div
            className={`
          w-full relative overflow-hidden
          ${user ? "max-w-4xl" : "max-w-2xl"}
          rounded-2xl
          p-5 sm:p-7
          mt-4 mb-4 sm:mt-6 sm:mb-6
        `}
            style={{
              background: "var(--bg-elevated)",
              border: "1px solid var(--border-default)",
              boxShadow: "var(--glass-shadow-elevated)",
            }}
          >
            {/* Glass shimmer */}
            <div className="glass-shimmer rounded-t-2xl" />

            {/* HEADER */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              <div className="text-center mb-5">
                <h1 className="font-[Space_Grotesk] text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-tight">{t("chatPage.title")}</h1>
                <p className="text-[var(--text-tertiary)] text-xs mt-1">{t("chatPage.subtitle")}</p>
              </div>
            </motion.div>

            {/* AUTH CHECK */}
            {!user ? (
              /* ═══════════════ LOGIN ═══════════════ */
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} className="flex flex-col items-center gap-3 py-8">
                <p className="text-xs text-[var(--text-tertiary)]">{t("chatPage.loginPrompt")}</p>

                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={loginWithGoogle}
                  className="w-full flex items-center justify-center gap-3 rounded-xl py-3
                    cursor-pointer group transition-all duration-200
                    bg-[var(--bg-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                >
                  <img src={google} alt="google" width="18" height="18" decoding="async" className="w-[18px]" />
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{t("chatPage.loginGoogle")}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={loginWithGithub}
                  className="w-full flex items-center justify-center gap-3 rounded-xl py-3
                    cursor-pointer group transition-all duration-200
                    bg-[var(--bg-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-hover)]"
                >
                  <img src={github} alt="github" width="24" height="24" decoding="async" className="w-6" />
                  <span className="text-sm font-medium text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">{t("chatPage.loginGithub")}</span>
                </motion.button>
              </motion.div>
            ) : (
              /* ═══════════════ CHAT ═══════════════ */
              <>
                {/* USER INFO & LOGOUT */}
                <motion.div
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between mb-4 p-3 rounded-xl"
                  style={{
                    background: "var(--bg-hover)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <img
                        src={user.photoURL}
                        alt={`${user.displayName || "User"}'s Profile`}
                        width="36"
                        height="36"
                        decoding="async"
                        className="w-9 h-9 rounded-full border-2 border-[rgba(var(--accent-rgb),0.2)]"
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=6366f1&color=fff&bold=true`;
                        }}
                      />
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-[var(--bg-elevated)]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[var(--text-primary)] text-sm">{user.displayName}</p>
                      <p className="text-[10px] text-[var(--text-muted)] font-['JetBrains_Mono'] hidden sm:block">{user.email}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => signOut(auth)}
                    className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-tertiary)] hover:text-red-400
                      px-2.5 py-1.5 rounded-lg cursor-pointer bg-[var(--bg-elevated)] border border-[var(--border-subtle)] hover:border-red-500/20 transition-all"
                  >
                    <LogOut size={13} />
                    <span className="hidden sm:inline">{t("chatPage.logout")}</span>
                  </motion.button>
                </motion.div>

                {/* CHAT WINDOW */}
                <div
                  className="rounded-xl p-3 h-[55vh] sm:h-[45vh] overflow-y-auto flex flex-col gap-2.5 mb-3"
                  style={{
                    background: "rgba(0, 0, 0, 0.15)",
                    border: "1px solid var(--border-subtle)",
                  }}
                >
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-[var(--text-muted)]">
                      <i className="ri-chat-3-line text-2xl mb-2" />
                      <p className="font-medium text-sm">{t("chatPage.noMessages")}</p>
                      <p className="text-[10px] mt-1 text-[var(--text-muted)]">{t("chatPage.beFirst")}</p>
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.uid === user.uid;

                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 6, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                          className={`flex gap-2 ${isMe ? "self-end flex-row-reverse items-end" : "self-start items-end"}`}
                        >
                          {msg.photo && (
                            <img
                              src={msg.photo}
                              alt={`${msg.name}'s Profile`}
                              width="24"
                              height="24"
                              decoding="async"
                              className="w-6 h-6 rounded-full border border-[var(--border-subtle)] shrink-0"
                            />
                          )}

                          <div
                            className="px-3.5 py-2 rounded-xl max-w-[85%] text-[13px] leading-relaxed"
                            style={
                              isMe
                                ? {
                                    background: "var(--accent)",
                                    color: "#000",
                                    fontWeight: 600,
                                    borderBottomRightRadius: "4px",
                                    boxShadow: `0 2px 8px rgba(0,0,0,0.2)`,
                                  }
                                : {
                                    background: "var(--bg-hover)",
                                    color: "var(--text-secondary)",
                                    border: "1px solid var(--border-subtle)",
                                    borderBottomLeftRadius: "4px",
                                  }
                            }
                          >
                            {!isMe && <p className="text-[10px] text-[var(--accent)] font-semibold mb-0.5 opacity-80">{msg.name}</p>}
                            <p className="whitespace-pre-wrap break-all">{msg.text}</p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* INPUT BAR */}
                <div className="flex gap-2">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder={t("chatPage.placeholder")}
                    rows={1}
                    className="flex-1 rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
                      resize-none focus:outline-none glass-input"
                  />
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleSend}
                    type="button"
                    disabled={!message.trim()}
                    className="cursor-pointer rounded-xl px-4 font-semibold text-sm flex items-center justify-center
                      gap-1.5 shrink-0 disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                    style={{
                      background: "var(--accent)",
                      color: "#000",
                    }}
                  >
                    <span className="hidden sm:inline">{t("chatPage.send")}</span>
                    <Send size={14} />
                  </motion.button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ORB (ONLY WHEN NOT LOGIN) */}
        {!user && (
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-sm lg:max-w-md">
              <Orb />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Chat;
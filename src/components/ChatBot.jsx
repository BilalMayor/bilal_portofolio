import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, Loader2, Trash2, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AiCoreIcon = ({ size = 26, className = "" }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
    {/* Outer orbital ring */}
    <motion.svg
      viewBox="0 0 40 40"
      className="absolute inset-0 w-full h-full"
      animate={{ rotate: 360 }}
      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="20"
        cy="20"
        r="17"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="4 6"
        opacity="0.65"
      />
      <circle cx="20" cy="3" r="2" fill="var(--accent)" />
    </motion.svg>
    {/* Inner counter-rotating ring */}
    <motion.svg
      viewBox="0 0 30 30"
      className="absolute w-[75%] h-[75%]"
      animate={{ rotate: -360 }}
      transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
    >
      <circle
        cx="15"
        cy="15"
        r="11"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.2"
        strokeDasharray="2 4"
        opacity="0.85"
      />
      <circle cx="15" cy="4" r="1.5" fill="var(--accent)" />
    </motion.svg>
    {/* Central Pulsing Quantum Core */}
    <motion.div
      animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.8, 1, 0.8] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      className="relative z-10 w-2.5 h-2.5 rounded-full"
      style={{
        background: "var(--accent)",
        boxShadow: "0 0 10px var(--accent)",
      }}
    />
  </div>
);

const parseInlineFormatting = (text) => {
  if (!text) return [];

  // Match Markdown Links [text](url), Bold **text**, or Raw URLs https://...
  const combinedRegex = /(\[(.*?)\]\((https?:\/\/[^\s\)]+)\))|(\*\*(.*?)\*\*)|(https?:\/\/[^\s\)]+)/g;

  const elements = [];
  let lastIndex = 0;
  let match;

  while ((match = combinedRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      elements.push(text.substring(lastIndex, match.index));
    }

    const isValidHttpUrl = (str) => {
      try {
        const u = new URL(str);
        return u.protocol === "https:" || u.protocol === "http:";
      } catch {
        return false;
      }
    };

    if (match[1]) {
      // Markdown link: [text](url)
      const linkText = match[2];
      const linkUrl = match[3];
      if (isValidHttpUrl(linkUrl)) {
        elements.push(
          <a
            key={match.index}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-(--accent) hover:text-white underline font-semibold transition-colors break-all"
          >
            <span>{linkText}</span>
            <i className="ri-external-link-line text-xs shrink-0" />
          </a>
        );
      } else {
        elements.push(linkText);
      }
    } else if (match[4]) {
      // Bold text: **text**
      const boldText = match[5];
      elements.push(
        <strong key={match.index} className="font-bold text-(--accent)">
          {boldText}
        </strong>
      );
    } else if (match[6]) {
      // Raw URL
      const rawUrl = match[6];
      if (isValidHttpUrl(rawUrl)) {
        elements.push(
          <a
            key={match.index}
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-(--accent) hover:text-white underline font-semibold transition-colors break-all"
          >
            <span>{rawUrl.replace(/^https?:\/\/(www\.)?/, "")}</span>
            <i className="ri-external-link-line text-xs shrink-0" />
          </a>
        );
      } else {
        elements.push(rawUrl);
      }
    }

    lastIndex = combinedRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return elements;
};

const renderMessageContent = (text) => {
  if (typeof text !== 'string') return text;

  const lines = text.split('\n');

  return lines.map((line, i) => {
    let cleanLine = line;

    // Bullet points (* or - or •)
    const isBullet = /^\s*[\*\-\•]\s+(.*)/.test(line);
    // Numbered lists (1. 2. etc.)
    const isNumbered = /^\s*(\d+)\.\s+(.*)/.test(line);

    if (isBullet) {
      const match = line.match(/^\s*[\*\-\•]\s+(.*)/);
      cleanLine = match[1];
    } else if (isNumbered) {
      const match = line.match(/^\s*(\d+)\.\s+(.*)/);
      cleanLine = match[2];
    }

    const parts = parseInlineFormatting(cleanLine);

    if (isBullet) {
      return (
        <li key={i} className="ml-4 list-disc mb-1.5 pl-1 text-zinc-200 leading-relaxed">
          {parts}
        </li>
      );
    }
    if (isNumbered) {
      return (
        <li key={i} className="ml-4 list-decimal mb-1.5 pl-1 text-zinc-200 leading-relaxed">
          {parts}
        </li>
      );
    }

    if (cleanLine.trim() === '') {
      return <div key={i} className="h-2" />;
    }

    return (
      <p key={i} className="mb-2 last:mb-0 text-zinc-100 leading-relaxed">
        {parts}
      </p>
    );
  });
};

const ChatBot = () => {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chat_history');
    return saved ? JSON.parse(saved) : [
      { role: 'assistant', content: t('bot.greeting') }
    ];
  });
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestedQuestions = t('bot.suggested') || [
    "Siapa Bilal?",
    "Apa saja sertifikasinya?",
    "Apa keahliannya?",
    "Kontak Bilal"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    localStorage.setItem('chat_history', JSON.stringify(messages));
  }, [messages]);

  const toggleChat = () => setIsOpen(!isOpen);

  const clearChat = () => {
    const initialMessage = [{ role: 'assistant', content: t('bot.greeting') }];
    setMessages(initialMessage);
    localStorage.setItem('chat_history', JSON.stringify(initialMessage));
  };

  const handleSend = async (e, textOverride = null) => {
    if (e) e.preventDefault();
    const messageText = (textOverride || input).trim().slice(0, 1000);
    if (!messageText || isLoading) return;

    const userMessage = { role: 'user', content: messageText };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Format history (excluding initial greeting) for the backend API
      const history = messages
        .filter((_, index) => index > 0)
        .map(msg => ({
          role: msg.role === 'assistant' ? 'assistant' : 'user',
          content: msg.content,
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          history,
          language,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 429) {
          throw new Error('RATE_LIMITED');
        }
        throw new Error(errData.error || `HTTP_${res.status}`);
      }

      const data = await res.json();
      if (!data.reply) {
        throw new Error('EMPTY_REPLY');
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("ChatBot Error:", error);

      // Fallback Mock Logic
      const lowerInput = messageText.toLowerCase();
      let fallbackResponse = "";

      if (error.message === 'RATE_LIMITED') {
        fallbackResponse = language === 'en'
          ? "You're sending messages too fast. Please wait a moment before sending another message."
          : "Kamu mengirim pesan terlalu cepat. Mohon tunggu sebentar sebelum mengirim pesan lagi.";
      } else if (lowerInput.includes('siapa') || lowerInput.includes('bilal') || lowerInput.includes('who')) {
        fallbackResponse = language === 'en'
          ? "Bilal Mayor Abdillah is a Frontend Developer and Software Engineering student studying at SMK Telkom Malang."
          : "Bilal Mayor Abdillah adalah seorang Frontend Developer dan siswa Rekayasa Perangkat Lunak di SMK Telkom Malang.";
      } else if (lowerInput.includes('proyek') || lowerInput.includes('project') || lowerInput.includes('repo') || lowerInput.includes('github')) {
        fallbackResponse = language === 'en'
          ? "Bilal actively builds modern web applications and explores new technologies. You can check his latest projects on the Projects page!"
          : "Bilal aktif mengembangkan berbagai proyek web modern dan eksplorasi teknologi. Kamu bisa cek detailnya di halaman Proyek!";
      } else if (lowerInput.includes('skill') || lowerInput.includes('kemampuan') || lowerInput.includes('tech')) {
        fallbackResponse = language === 'en'
          ? "Bilal is proficient in ReactJS, Tailwind CSS, JavaScript, and modern web development tools."
          : "Bilal memiliki keahlian dalam ReactJS, Tailwind CSS, JavaScript, dan teknologi pengembangan web modern.";
      } else if (lowerInput.includes('kontak') || lowerInput.includes('contact') || lowerInput.includes('hubungi')) {
        fallbackResponse = language === 'en'
          ? "You can contact Bilal via the Contact page or his social media accounts."
          : "Kamu bisa menghubungi Bilal melalui halaman Kontak atau sosial medianya.";
      } else {
        fallbackResponse = language === 'en'
          ? "Sorry, I'm experiencing technical difficulties. Please try again later or contact Bilal directly."
          : "Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi nanti atau hubungi Bilal langsung.";
      }

      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: fallbackResponse }]);
      }, 400);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="mb-4 w-[90vw] sm:w-[400px] h-[580px] flex flex-col overflow-hidden relative rounded-3xl"
            style={{
              background: "rgba(18, 18, 22, 0.72)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 8px 40px 0 rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {/* Liquid glass shimmer highlight at top */}
            <div className="glass-shimmer rounded-t-3xl" />
            {/* Subtle inner glow for depth */}
            <div
              className="absolute top-0 left-0 right-0 h-24 pointer-events-none rounded-t-3xl"
              style={{ background: "rgba(255,255,255,0.025)" }}
            />

            {/* Header */}
            <div
              className="p-4 flex items-center justify-between shrink-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.14)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.3)",
                    }}
                  >
                    <AiCoreIcon size={22} />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: "var(--accent)" }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-3 w-3 border-2 border-[var(--bg-deep)]"
                      style={{ background: "var(--accent)" }}
                    />
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[var(--text-primary)] flex items-center gap-1.5">
                    {t('bot.headerTitle')}
                    <Sparkles size={13} className="text-(--accent) animate-pulse" />
                  </h3>
                  <span className="text-[11px] text-[var(--text-secondary)] font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                    {t('bot.poweredBy')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={clearChat}
                  title={t('bot.clearTooltip')}
                  aria-label={t('bot.clearAria')}
                  className="p-2 rounded-xl transition-all text-zinc-400 hover:text-red-400 hover:bg-white/[0.06] cursor-pointer"
                >
                  <Trash2 size={17} />
                </button>
                <button
                  onClick={toggleChat}
                  aria-label={t('bot.closeAria')}
                  className="p-2 rounded-xl transition-all text-zinc-400 hover:text-white hover:bg-white/[0.06] cursor-pointer"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800">
              {messages.map((msg, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed`}
                    style={
                      msg.role === 'user'
                        ? {
                          background: "var(--accent)",
                          color: "#000",
                          fontWeight: 600,
                          boxShadow: "0 2px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.25)",
                        }
                        : {
                          background: "rgba(255,255,255,0.06)",
                          color: "rgba(228,228,231,1)",
                          border: "1px solid rgba(255,255,255,0.10)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                        }
                    }
                  >
                    {msg.role === 'assistant' ? (
                      <div className="space-y-1">{renderMessageContent(msg.content)}</div>
                    ) : (
                      msg.content
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div
                    className="p-3.5 rounded-2xl"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.10)",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
                    }}
                  >
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <span>{t('bot.thinking')}</span>
                      <div className="flex gap-1">
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-1.5 h-1.5 bg-(--accent) rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                          className="w-1.5 h-1.5 bg-(--accent) rounded-full"
                        />
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                          className="w-1.5 h-1.5 bg-(--accent) rounded-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions */}
            {!isLoading && messages.length <= 1 && (
              <div
                className="px-4 py-2.5 flex flex-wrap gap-1.5 shrink-0"
                style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
              >
                {suggestedQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(null, q)}
                    className="text-[11px] text-zinc-300 hover:text-zinc-100 px-3 py-1.5 rounded-full
                      transition-all cursor-pointer font-medium glass-card hover:bg-white/[0.10] hover:border-white/20"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input Form */}
            <form
              onSubmit={handleSend}
              className="p-3 flex items-center gap-2 shrink-0"
              style={{
                borderTop: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.025)",
              }}
            >
              <div
                className="relative flex-1 flex items-center rounded-2xl px-3.5 py-1.5 transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t('bot.placeholder')}
                  aria-label={t('bot.sendAria')}
                  className="w-full bg-transparent border-none text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none py-1"
                />
              </div>
              <motion.button
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.93 }}
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label={t('bot.sendAria')}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-30 disabled:grayscale cursor-pointer disabled:cursor-not-allowed shrink-0"
                style={{
                  background: "var(--accent)",
                  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 4px 12px rgba(0,0,0,0.35)",
                  color: "#000",
                }}
              >
                <Send size={17} className="ml-0.5" />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <div className="relative flex items-center gap-3">
        {/* Tooltip prompt when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 12, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              onClick={toggleChat}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full cursor-pointer text-xs font-semibold text-[var(--text-primary)] transition-all"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px) saturate(160%)",
                WebkitBackdropFilter: "blur(20px) saturate(160%)",
                border: "1px solid var(--border-default)",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <Sparkles size={14} className="text-(--accent) animate-pulse" />
              <span>{t('bot.triggerTooltip')}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleChat}
          aria-label={t('bot.triggerAria')}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-300 group overflow-visible"
          style={{
            background: "var(--bg-elevated)",
            backdropFilter: "blur(24px) saturate(180%)",
            WebkitBackdropFilter: "blur(24px) saturate(180%)",
            border: "1px solid var(--border-default)",
            boxShadow: "var(--glass-shadow-elevated)",
          }}
        >
          {/* Pulse ring — only when closed */}
          {!isOpen && (
            <span
              className="absolute inset-0 rounded-2xl animate-ping opacity-20 pointer-events-none"
              style={{ border: '2px solid var(--accent)' }}
            />
          )}

          {/* Hover shimmer overlay */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-2xl pointer-events-none"
            style={{ background: "rgba(255,255,255,0.05)" }}
          />

          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: 90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X size={24} className="text-[var(--text-primary)] group-hover:opacity-80" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, scale: 0.5, opacity: 0 }}
                animate={{ rotate: 0, scale: 1, opacity: 1 }}
                exit={{ rotate: -90, scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
              >
                <AiCoreIcon size={28} />

                {/* Glowing status online dot matching theme accent */}
                <span className="absolute -top-2.5 -right-2.5 flex h-3.5 w-3.5">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ background: "var(--accent)" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-[var(--bg-deep)]"
                    style={{ background: "var(--accent)" }}
                  />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default ChatBot;


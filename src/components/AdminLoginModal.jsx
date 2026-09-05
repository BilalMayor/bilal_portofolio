import { useState, useEffect, useRef } from "react";
import { checkAdminPassword, loginAdmin } from "../lib/adminAuth";
import { ShieldCheck, Lock, Eye, EyeOff, X, AlertTriangle } from "lucide-react";

const AdminLoginModal = ({ onSuccess, onClose }) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isShaking, setIsShaking] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const inputRef = useRef(null);

  // Auto-focus input
  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Countdown timer saat locked
  useEffect(() => {
    if (!isLocked) return;
    if (lockTimer <= 0) {
      setIsLocked(false);
      setAttempts(0);
      return;
    }
    const t = setTimeout(() => setLockTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [isLocked, lockTimer]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLocked) return;

    if (checkAdminPassword(password)) {
      loginAdmin();
      onSuccess();
    } else {
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      setPassword("");
      setError(
        newAttempts >= 3
          ? `Terlalu banyak percobaan. Coba lagi dalam ${30}s.`
          : `Password salah. (${newAttempts}/3)`
      );
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 600);

      if (newAttempts >= 3) {
        setIsLocked(true);
        setLockTimer(30);
      }
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 transition-all duration-300 animate-fadeIn"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className={`relative w-full max-w-sm bg-gradient-to-b from-zinc-900/90 to-zinc-950/95 border border-zinc-800/80 rounded-2xl p-8 shadow-2xl shadow-black/80 flex flex-col gap-6 transition-all duration-300 ${isShaking ? "animate-shake" : "animate-scaleUp"}`}
      >
        {/* Glow Element */}
        <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-emerald-500/10 to-transparent -z-10 pointer-events-none" />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 transition-all duration-200 cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div className="text-center flex flex-col items-center">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-lg ${
              isLocked 
                ? "bg-amber-500/10 border-amber-500/35 text-amber-400 shadow-amber-500/5 animate-pulse" 
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5"
            }`}
          >
            {isLocked ? (
              <AlertTriangle size={24} />
            ) : (
              <ShieldCheck size={24} />
            )}
          </div>
          <h2
            className="text-zinc-100 font-bold text-lg tracking-wide font-[Space_Grotesk] mt-4"
          >
            Developer Access
          </h2>
          <p className="text-zinc-500 text-xs mt-1 font-medium leading-relaxed max-w-[200px]">
            {isLocked
              ? `Akses terkunci sementara selama ${lockTimer}s`
              : "Masukkan password untuk membuka admin panel"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-zinc-500 text-[10px] font-bold tracking-wider uppercase ml-1">Password</label>
            <div
              className={`flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/60 focus-within:bg-zinc-900 border transition-all duration-300 focus-within:shadow-[0_0_15px_rgba(16,185,129,0.06)] ${
                error 
                  ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.04)]" 
                  : "border-zinc-800/80 focus-within:border-emerald-500/50"
              }`}
            >
              <Lock size={15} className="text-zinc-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                placeholder="Masukkan password dev..."
                disabled={isLocked}
                className="bg-transparent border-none outline-none text-zinc-100 text-sm flex-1 font-medium font-sans placeholder-zinc-600 disabled:text-zinc-650"
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="p-1 rounded text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-[11px] font-medium mt-2 flex items-center gap-1.5 animate-slideUp ml-1">
                <AlertTriangle size={12} className="text-red-400" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!password || isLocked}
            className={`w-full py-3 rounded-xl text-xs font-bold transition-all shadow-lg select-none cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] ${
              !password || isLocked
                ? "bg-zinc-850 border border-zinc-800 text-zinc-500 cursor-not-allowed shadow-none"
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/10 hover:shadow-emerald-600/20"
            }`}
          >
            {isLocked ? `Terkunci (${lockTimer}s)` : "Buka Admin Panel"}
          </button>
        </form>

        {/* Subtle hint */}
        <p className="text-center text-zinc-600 text-[10px] font-semibold tracking-wide uppercase">
          Tekan Esc untuk keluar
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-shake {
          animation: shake 0.6s ease;
        }
        .animate-slideUp {
          animation: slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginModal;

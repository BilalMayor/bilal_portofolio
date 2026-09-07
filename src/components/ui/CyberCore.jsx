import { useEffect, useRef } from "react";
import { motion } from "motion/react";

const CyberCore = ({ className = "" }) => {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-square max-w-[340px] sm:max-w-[400px] flex items-center justify-center select-none ${className}`}
    >
      {/* Deep Ambient Background Glow */}
      <div
        className="absolute inset-0 rounded-full filter blur-[60px] opacity-35 pointer-events-none"
        style={{
          background: "radial-gradient(circle, var(--accent) 0%, rgba(var(--accent-rgb), 0.2) 50%, transparent 70%)",
        }}
      />

      {/* Layer 1: Outer Hexagonal Ring */}
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute w-full h-full pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        <polygon
          points="100,10 180,55 180,145 100,190 20,145 20,55"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.2"
          strokeDasharray="8 12"
          opacity="0.4"
        />
        <circle cx="100" cy="10" r="3.5" fill="var(--accent)" />
        <circle cx="180" cy="145" r="3.5" fill="var(--accent)" />
        <circle cx="20" cy="145" r="3.5" fill="var(--accent)" />
      </motion.svg>

      {/* Layer 2: Middle Orbital Ring (Counter-rotating) */}
      <motion.svg
        viewBox="0 0 160 160"
        className="absolute w-[82%] h-[82%] pointer-events-none"
        animate={{ rotate: -360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <circle
          cx="80"
          cy="80"
          r="72"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          opacity="0.6"
        />
        {/* Orbital nodes */}
        <circle cx="80" cy="8" r="4" fill="var(--accent)" />
        <circle cx="152" cy="80" r="3" fill="var(--accent)" />
        <circle cx="8" cy="80" r="3" fill="var(--accent)" />
      </motion.svg>

      {/* Layer 3: Dynamic Quantum Gyroscope Ring (Tilted) */}
      <motion.div
        animate={{ rotateX: [15, -15, 15], rotateY: [-25, 25, -25], rotateZ: [0, 360] }}
        transition={{
          rotateX: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          rotateY: { duration: 8, repeat: Infinity, ease: "easeInOut" },
          rotateZ: { duration: 18, repeat: Infinity, ease: "linear" },
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="absolute w-[65%] h-[65%] rounded-full border border-[var(--accent)] border-dashed opacity-75 pointer-events-none flex items-center justify-center"
      >
        <span className="w-2.5 h-2.5 rounded-full bg-[var(--accent)] absolute -top-1" />
      </motion.div>

      {/* Layer 4: Central Holographic Octahedron / Diamond Core */}
      <motion.div
        animate={{
          scale: [0.92, 1.08, 0.92],
          rotate: [0, 180, 360],
        }}
        transition={{
          scale: { duration: 4, repeat: Infinity, ease: "easeInOut" },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
        className="relative z-10 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center rounded-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(var(--accent-rgb), 0.25) 0%, rgba(18, 18, 24, 0.6) 100%)",
          backdropFilter: "blur(16px)",
          border: "1px solid rgba(var(--accent-rgb), 0.5)",
          boxShadow: "0 0 35px rgba(var(--accent-rgb), 0.4), inset 0 0 15px rgba(var(--accent-rgb), 0.3)",
        }}
      >
        {/* Inner Diamond Gem */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-lg transform rotate-45 flex items-center justify-center"
          style={{
            background: "var(--accent)",
            boxShadow: "0 0 20px var(--accent)",
          }}
        >
          <div className="w-4 h-4 rounded-sm bg-black/40" />
        </motion.div>

        {/* Floating crosshairs */}
        <div className="absolute top-2 left-2 text-[9px] font-mono text-[var(--accent)] opacity-70">
          AI // CORE
        </div>
        <div className="absolute bottom-2 right-2 text-[9px] font-mono text-[var(--accent)] opacity-70">
          v3.0
        </div>
      </motion.div>

      {/* Floating Status Ring Indicator */}
      <div className="absolute -bottom-6 flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] shadow-md">
        <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-ping" />
        <span>Quantum Neural State: Active</span>
      </div>
    </div>
  );
};

export default CyberCore;

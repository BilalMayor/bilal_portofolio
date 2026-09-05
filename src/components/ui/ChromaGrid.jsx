import { useRef, useEffect } from "react";
import { gsap } from "gsap";

const ChromaGrid = ({ items, className = "", radius = 300, damping = 0.45, fadeOut = 0.6, ease = "power3.out", onItemClick }) => {
  const rootRef = useRef(null);
  const fadeRef = useRef(null);
  const setX = useRef(null);
  const setY = useRef(null);
  const pos = useRef({ x: 0, y: 0 });

  const demo = [
    {
      image: "https://i.pravatar.cc/300?img=8",
      title: "Alex Rivera",
      subtitle: "Full Stack Developer",
      handle: "@alexrivera",
      borderColor: "#4F46E5",
      gradient: "linear-gradient(145deg,#4F46E5,#000)",
      url: "https://github.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=11",
      title: "Jordan Chen",
      subtitle: "DevOps Engineer",
      handle: "@jordanchen",
      borderColor: "#10B981",
      gradient: "linear-gradient(210deg,#10B981,#000)",
      url: "https://linkedin.com/in/",
    },
    {
      image: "https://i.pravatar.cc/300?img=3",
      title: "Morgan Blake",
      subtitle: "UI/UX Designer",
      handle: "@morganblake",
      borderColor: "#F59E0B",
      gradient: "linear-gradient(165deg,#F59E0B,#000)",
      url: "https://dribbble.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=16",
      title: "Casey Park",
      subtitle: "Data Scientist",
      handle: "@caseypark",
      borderColor: "#EF4444",
      gradient: "linear-gradient(195deg,#EF4444,#000)",
      url: "https://kaggle.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=25",
      title: "Sam Kim",
      subtitle: "Mobile Developer",
      handle: "@thesamkim",
      borderColor: "#8B5CF6",
      gradient: "linear-gradient(225deg,#8B5CF6,#000)",
      url: "https://github.com/",
    },
    {
      image: "https://i.pravatar.cc/300?img=60",
      title: "Tyler Rodriguez",
      subtitle: "Cloud Architect",
      handle: "@tylerrod",
      borderColor: "#06B6D4",
      gradient: "linear-gradient(135deg,#06B6D4,#000)",
      url: "https://aws.amazon.com/",
    },
  ];

  const data = items?.length ? items : demo;

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    setX.current = gsap.quickSetter(el, "--x", "px");
    setY.current = gsap.quickSetter(el, "--y", "px");
    const { width, height } = el.getBoundingClientRect();
    pos.current = { x: width / 2, y: height / 2 };
    setX.current(pos.current.x);
    setY.current(pos.current.y);
  }, []);

  const moveTo = (x, y) => {
    gsap.to(pos.current, {
      x,
      y,
      duration: damping,
      ease,
      onUpdate: () => {
        setX.current?.(pos.current.x);
        setY.current?.(pos.current.y);
      },
      overwrite: true,
    });
  };

  const handleMove = (e) => {
    const r = rootRef.current.getBoundingClientRect();
    moveTo(e.clientX - r.left, e.clientY - r.top);
    gsap.to(fadeRef.current, { opacity: 0, duration: 0.1, overwrite: true });
  };

  const handleLeave = () => {
    gsap.to(fadeRef.current, {
      opacity: 1,
      duration: 0.2,
      overwrite: true,
    });
  };

  const handleCardClick = (item, e) => {
    if (onItemClick) {
      onItemClick(item);
      return;
    }
    if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardMove = (e) => {
    const c = e.currentTarget;
    const rect = c.getBoundingClientRect();
    c.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    c.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={rootRef}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className={`relative w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}
      style={{
        "--r": `${radius}px`,
        "--x": "50%",
        "--y": "50%",
      }}
    >
      {data.map((c, i) => {
        const accentColor = c.borderColor || "#10B981";
        return (
          <article
            key={i}
            onMouseMove={handleCardMove}
            onClick={(e) => handleCardClick(c, e)}
            className="group relative flex flex-col w-full rounded-3xl overflow-hidden transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-95 border border-white/10 hover:border-[var(--card-accent)] hover:shadow-xl"
            style={{
              "--card-accent": accentColor,
              "--card-accent-glow": `${accentColor}55`,
              background: "rgba(18, 18, 24, 0.45)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 8px 32px rgba(0, 0, 0, 0.35)",
              isolation: "isolate",
            }}
          >
            {/* Liquid Glass top shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-white/20 pointer-events-none z-20 rounded-t-2xl" />

            {/* Hover colored ambient glow layer */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-0 opacity-0 group-hover:opacity-100 rounded-2xl"
              style={{
                background: `radial-gradient(circle at 50% 0%, ${accentColor}30 0%, rgba(18,18,24,0) 75%)`,
              }}
            />

            {/* Interactive mouse spotlight glow in project signature color */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-500 z-20 opacity-0 group-hover:opacity-100 rounded-2xl"
              style={{
                background: `radial-gradient(circle 170px at var(--mouse-x) var(--mouse-y), ${accentColor}55 0%, ${accentColor}15 45%, transparent 70%)`,
              }}
            />

            {/* Image Container — aspect-video for uniform responsive sizing */}
            <div className="relative z-10 w-full aspect-video shrink-0 bg-black/30 backdrop-blur-xs overflow-hidden border-b border-white/10">
              <img
                src={c.image}
                alt={c.title || "Project Image"}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Footer Content — fills remaining height uniformly */}
            <footer
              className="relative z-10 flex-1 p-4 text-white font-sans flex flex-col justify-between shrink-0 transition-colors duration-300"
              style={{
                background: "rgba(255, 255, 255, 0.03)",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="m-0 text-[1rem] font-semibold text-zinc-100 group-hover:text-white transition-colors line-clamp-1">
                    {c.title}
                  </h3>
                  {c.handle && <span className="text-[0.85rem] opacity-80 font-mono shrink-0">{c.handle}</span>}
                </div>
                <p className="m-0 text-[0.8rem] text-zinc-300 font-medium line-clamp-2 mt-1.5 leading-relaxed">
                  {c.subtitle}
                </p>
              </div>

              {c.url && (
                <div className="flex items-center gap-2 text-[0.78rem] text-zinc-400 group-hover:text-white transition-colors font-medium mt-auto pt-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  <span>Klik untuk membuka</span>
                </div>
              )}
            </footer>
          </article>
        );
      })}
    </div>
  );
};

export default ChromaGrid;

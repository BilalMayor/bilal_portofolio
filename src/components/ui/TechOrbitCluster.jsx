import React, { useRef, useEffect, useState, useCallback, useMemo } from "react";
import * as THREE from "three";
import { motion, AnimatePresence } from "motion/react";
import {
  RotateCcw,
  Play,
  Pause,
  Layers,
  Sparkles,
  Compass,
  Info,
  CheckCircle2,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import skillsData, { skillCategories } from "../../data/cardData";
import TechInspectorModal from "./TechInspectorModal";
import bilal_avatar from "../../assets/cards/bilal_avatar.webp";

// ── Node Placement Constants ──
const ORBIT_RINGS = {
  1: { radius: 14, inclinationX: 0.25, inclinationZ: 0.15, speed: 0.004 },
  2: { radius: 21, inclinationX: -0.35, inclinationZ: -0.2, speed: -0.0028 },
  3: { radius: 28, inclinationX: 0.45, inclinationZ: 0.3, speed: 0.0018 },
};

const TechOrbitCluster = ({ onNavigateProjects }) => {
  const { language, t } = useLanguage();
  const isId = language === "id";

  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // States
  const [selectedTech, setSelectedTech] = useState(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [hoveredTechId, setHoveredTechId] = useState(null);
  const [nodePositions, setNodePositions] = useState([]);

  // Refs for animation & physics
  const isAutoRotatingRef = useRef(isAutoRotating);
  isAutoRotatingRef.current = isAutoRotating;

  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });
  const rotationVelocityRef = useRef({ x: 0, y: 0.003 });
  const clusterRotationRef = useRef({ x: 0.2, y: 0 });
  const targetZoomRef = useRef(42);
  const currentZoomRef = useRef(42);
  const cameraRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  // Filtered skills list
  const filteredSkills = useMemo(() => {
    return skillsData;
  }, []);

  // Compute node angular distributed positions along 3 concentric orbital rings
  const nodesConfig = useMemo(() => {
    // Group skills by ring
    const ringItems = { 1: [], 2: [], 3: [] };
    filteredSkills.forEach((item) => {
      const ringNum = item.ring || 1;
      if (ringItems[ringNum]) ringItems[ringNum].push(item);
    });

    const configs = [];

    [1, 2, 3].forEach((ringNum) => {
      const items = ringItems[ringNum] || [];
      const total = items.length;
      const ringDef = ORBIT_RINGS[ringNum];

      items.forEach((item, index) => {
        const baseAngle = (index / total) * Math.PI * 2;
        configs.push({
          ...item,
          ring: ringNum,
          baseAngle,
          radius: ringDef.radius,
          speed: ringDef.speed,
          inclinationX: ringDef.inclinationX,
          inclinationZ: ringDef.inclinationZ,
        });
      });
    });

    return configs;
  }, [filteredSkills]);

  // Handle node selection
  const handleSelectNode = useCallback((item) => {
    setSelectedTech(item);
    setIsInspectorOpen(true);
  }, []);

  // Reset view handler
  const handleResetView = useCallback(() => {
    clusterRotationRef.current = { x: 0.2, y: 0 };
    rotationVelocityRef.current = { x: 0, y: 0.003 };
    targetZoomRef.current = 42;
    setIsAutoRotating(true);
  }, []);

  // Three.js Scene Setup & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let width = container.clientWidth || 800;
    let height = container.clientHeight || 550;

    // Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 1000);
    camera.position.set(0, 0, currentZoomRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    scene.add(ambientLight);

    const centerPointLight = new THREE.PointLight(0xffffff, 2.0, 80);
    centerPointLight.position.set(0, 0, 0);
    scene.add(centerPointLight);

    // ── Main Cluster Rotating Group ──
    const clusterGroup = new THREE.Group();
    clusterGroup.rotation.x = clusterRotationRef.current.x;
    clusterGroup.rotation.y = clusterRotationRef.current.y;
    scene.add(clusterGroup);

    // ── Central Nucleus Core (Bilal Sun) ──
    const coreGroup = new THREE.Group();
    clusterGroup.add(coreGroup);

    // Central Sphere Core
    const coreGeo = new THREE.SphereGeometry(2.4, 32, 32);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x111118,
      emissive: 0x222233,
      roughness: 0.2,
      metalness: 0.8,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Central Corona Wireframe Ring
    const coronaGeo = new THREE.RingGeometry(2.7, 3.1, 48);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      opacity: 0.35,
      transparent: true,
      side: THREE.DoubleSide,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.rotation.x = Math.PI / 2;
    coreGroup.add(coronaMesh);

    // ── Orbital Trajectory Rings ──
    [1, 2, 3].forEach((ringNum) => {
      const ringDef = ORBIT_RINGS[ringNum];
      const ringCurve = new THREE.EllipseCurve(
        0, 0,
        ringDef.radius, ringDef.radius,
        0, 2 * Math.PI,
        false,
        0
      );
      const points = ringCurve.getPoints(96);
      const orbitGeo = new THREE.BufferGeometry().setFromPoints(points);

      const orbitMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: ringNum === 1 ? 0.22 : ringNum === 2 ? 0.16 : 0.12,
      });

      const orbitLine = new THREE.Line(orbitGeo, orbitMat);
      orbitLine.rotation.x = Math.PI / 2 + ringDef.inclinationX;
      orbitLine.rotation.z = ringDef.inclinationZ;
      clusterGroup.add(orbitLine);
    });

    // ── Ambient Star Dust Particles ──
    const particleCount = 360;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const r = 16 + Math.random() * 32;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      particlePositions[i * 3] = r * Math.cos(theta) * Math.cos(phi);
      particlePositions[i * 3 + 1] = r * Math.sin(phi);
      particlePositions[i * 3 + 2] = r * Math.sin(theta) * Math.cos(phi);

      const brightness = 0.4 + Math.random() * 0.6;
      particleColors[i * 3] = brightness;
      particleColors[i * 3 + 1] = brightness;
      particleColors[i * 3 + 2] = brightness;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    clusterGroup.add(particles);

    // ── Animation Loop ──
    let animationFrameId;
    let clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Core pulsing
      const coreScale = 1 + Math.sin(elapsedTime * 2.2) * 0.04;
      coreGroup.scale.set(coreScale, coreScale, coreScale);
      coronaMesh.rotation.z += 0.005;

      // Stardust gentle drift
      particles.rotation.y += 0.0006;

      // Inactivity or Drag Momentum physics
      if (!isDraggingRef.current) {
        if (isAutoRotatingRef.current) {
          rotationVelocityRef.current.y = 0.0025;
        } else {
          rotationVelocityRef.current.x *= 0.94;
          rotationVelocityRef.current.y *= 0.94;
        }
      }

      clusterRotationRef.current.x += rotationVelocityRef.current.x;
      clusterRotationRef.current.y += rotationVelocityRef.current.y;

      // Clamp X rotation to prevent flipping upside down
      clusterRotationRef.current.x = Math.max(-1.1, Math.min(1.1, clusterRotationRef.current.x));

      clusterGroup.rotation.x = clusterRotationRef.current.x;
      clusterGroup.rotation.y = clusterRotationRef.current.y;

      // Smooth Camera Zoom Lerp
      currentZoomRef.current += (targetZoomRef.current - currentZoomRef.current) * 0.1;
      camera.position.z = currentZoomRef.current;

      // ── Calculate 3D to 2D projected screen positions for nodes ──
      camera.updateMatrixWorld();
      clusterGroup.updateMatrixWorld();

      const calculatedPositions = nodesConfig.map((config) => {
        // Compute node position in cluster local space
        const currentAngle = config.baseAngle + elapsedTime * config.speed;
        const localX = Math.cos(currentAngle) * config.radius;
        const localZ = Math.sin(currentAngle) * config.radius;

        // Apply orbital inclination tilt
        const pos = new THREE.Vector3(localX, 0, localZ);
        pos.applyAxisAngle(new THREE.Vector3(1, 0, 0), config.inclinationX);
        pos.applyAxisAngle(new THREE.Vector3(0, 0, 1), config.inclinationZ);

        // Convert to world space
        pos.applyMatrix4(clusterGroup.matrixWorld);

        // Compute camera-distance for z-sorting & depth scaling
        const distToCamera = pos.distanceTo(camera.position);

        // Project to normalized device coordinates (-1 to +1)
        const projected = pos.clone().project(camera);

        // Convert to container pixel coordinates
        const screenX = ((projected.x + 1) * width) / 2;
        const screenY = ((-projected.y + 1) * height) / 2;

        // Depth scale & opacity
        // Foreground (closer to camera) gets scale ~1.1, background ~0.72
        const depthFactor = Math.max(0.68, Math.min(1.18, 50 / distToCamera));
        const depthOpacity = Math.max(0.42, Math.min(1.0, 52 / distToCamera));
        const isBehind = projected.z > 1 || pos.z < -25;

        return {
          ...config,
          screenX,
          screenY,
          depthScale: depthFactor,
          depthOpacity: depthOpacity,
          distToCamera,
          isBehind,
        };
      });

      setNodePositions(calculatedPositions);
      renderer.render(scene, camera);
    };

    render();

    // ── Resize Observer ──
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || 800;
      height = container.clientHeight || 550;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [nodesConfig]);

  // ── Drag & Touch Handlers for 360° Interaction ──
  const handlePointerDown = (e) => {
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX || e.touches?.[0]?.clientX || 0, y: e.clientY || e.touches?.[0]?.clientY || 0 };
    rotationVelocityRef.current = { x: 0, y: 0 };
  };

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
    const clientY = e.clientY || e.touches?.[0]?.clientY || 0;

    const deltaX = clientX - lastMousePosRef.current.x;
    const deltaY = clientY - lastMousePosRef.current.y;

    rotationVelocityRef.current = {
      x: deltaY * 0.004,
      y: deltaX * 0.004,
    };

    lastMousePosRef.current = { x: clientX, y: clientY };
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Zoom on wheel
  const handleWheel = (e) => {
    e.preventDefault();
    targetZoomRef.current = Math.max(28, Math.min(58, targetZoomRef.current + e.deltaY * 0.035));
  };

  return (
    <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-[var(--border-default)] bg-[var(--bg-elevated)] shadow-2xl">
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)",
        }}
      />

      {/* Top Header Bar inside Cluster */}
      <div className="relative z-20 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/70 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.25)]">
            <Compass size={18} className="animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-[Space_Grotesk] text-[var(--text-primary)] flex items-center gap-2">
              <span>{isId ? "Tata Surya Keahlian 3D" : "3D Tech Stack Solar Cluster"}</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[rgba(var(--accent-rgb),0.1)] text-[var(--accent)] border border-[rgba(var(--accent-rgb),0.2)]">
                Interactive 360°
              </span>
            </h3>
            <p className="text-[11px] text-[var(--text-secondary)] font-mono hidden sm:block">
              {t("skills.dragHint") || "Tarik mouse untuk memutar 360° • Klik node untuk melihat detail"}
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--bg-hover)] border border-[var(--border-subtle)]">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all ${
              activeCategory === "all"
                ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-semibold"
                : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
            }`}
          >
            {isId ? "Semua" : "All"} ({filteredSkills.length})
          </button>
          {skillCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm font-semibold"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <i className={`${cat.icon} text-[11px] ${isActive ? "text-[var(--accent)]" : ""}`} />
                <span className="hidden md:inline">{cat.name}</span>
                <span className="md:hidden">{cat.name.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Interactive Canvas & Screen Node Projection Layer */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onWheel={handleWheel}
        className="relative w-full h-[480px] sm:h-[560px] lg:h-[620px] cursor-grab active:cursor-grabbing overflow-hidden touch-none select-none"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

        {/* Central Monogram Core Overlay Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10 flex flex-col items-center">
          <div
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-1 border border-[rgba(var(--accent-rgb),0.4)] flex items-center justify-center animate-pulse"
            style={{
              background: "rgba(15, 15, 20, 0.65)",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 32px -4px rgba(var(--accent-rgb), 0.5)",
            }}
          >
            <img
              src={bilal_avatar}
              alt="Bilal Mayor Abdillah"
              className="w-full h-full rounded-full object-cover select-none"
            />
          </div>
          <span className="mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--bg-surface)]/80 text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm">
            Bilal Core
          </span>
        </div>

        {/* Projected 2D Interactive HTML Nodes */}
        {nodePositions.map((node) => {
          const isCategoryMatch = activeCategory === "all" || node.category === activeCategory;
          const isHovered = hoveredTechId === node.id;

          // Compute interactive opacity & scale
          let finalOpacity = node.depthOpacity;
          let finalScale = node.depthScale;

          if (!isCategoryMatch) {
            finalOpacity = 0.15;
            finalScale *= 0.8;
          } else if (isHovered) {
            finalOpacity = 1.0;
            finalScale = 1.25;
          }

          // Sort Z-Index based on distToCamera (closer items appear on top)
          const zIndex = Math.round(1000 - node.distToCamera * 10) + (isHovered ? 500 : 0);

          return (
            <motion.div
              key={node.id}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectNode(node);
              }}
              onMouseEnter={() => {
                setHoveredTechId(node.id);
                setIsAutoRotating(false);
              }}
              onMouseLeave={() => {
                setHoveredTechId(null);
                setIsAutoRotating(true);
              }}
              style={{
                position: "absolute",
                left: `${node.screenX}px`,
                top: `${node.screenY}px`,
                transform: `translate(-50%, -50%) scale(${finalScale})`,
                opacity: finalOpacity,
                zIndex: zIndex,
                transition: "transform 0.15s ease-out, opacity 0.25s ease-out",
                pointerEvents: (isCategoryMatch && !isInspectorOpen) ? "auto" : "none",
              }}
              className="group cursor-pointer"
            >
              {/* Node Card Pill */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-200"
                style={{
                  background: isHovered
                    ? "var(--bg-surface)"
                    : "var(--glass-bg)",
                  borderColor: isHovered
                    ? (node.color || "var(--accent)")
                    : "var(--border-default)",
                  boxShadow: isHovered
                    ? `0 8px 24px -4px ${node.color ? `${node.color}50` : "rgba(var(--accent-rgb),0.4)"}`
                    : "var(--glass-shadow)",
                }}
              >
                {/* Tech Icon */}
                <div className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 flex items-center justify-center">
                  <img
                    src={node.icon}
                    alt={node.title}
                    className="w-full h-full object-contain filter drop-shadow-sm"
                  />
                </div>

                {/* Tech Title */}
                <span className="text-xs sm:text-[13px] font-semibold font-[Space_Grotesk] text-[var(--text-primary)] whitespace-nowrap">
                  {node.title}
                </span>
              </div>
            </motion.div>
          );
        })}

        {/* Bottom Control Bar */}
        <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Legend hints */}
          <div className="hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[var(--bg-surface)]/80 backdrop-blur-md border border-[var(--border-subtle)] text-[11px] font-mono text-[var(--text-secondary)] pointer-events-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#61DAFB]" />
              {isId ? "Ring 1: Inti Frontend" : "Ring 1: Core Frontend"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F05032]" />
              {isId ? "Ring 2: Tools & Framework" : "Ring 2: Tools & Ecosystem"}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              {isId ? "Ring 3: Quality Assurance" : "Ring 3: QA & Strategy"}
            </span>
          </div>

          {/* Interactive controls */}
          <div className="flex items-center gap-2 ml-auto pointer-events-auto">
            <button
              onClick={() => setIsAutoRotating((prev) => !prev)}
              aria-label={isAutoRotating ? "Pause Orbit" : "Play Orbit"}
              className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-md"
            >
              {isAutoRotating ? (
                <>
                  <Pause size={13} className="text-[var(--accent)]" />
                  <span className="hidden sm:inline">{t("skills.autoRotateOn") || "Jeda"}</span>
                </>
              ) : (
                <>
                  <Play size={13} className="text-[var(--accent)]" />
                  <span className="hidden sm:inline">{t("skills.autoRotateOff") || "Putar"}</span>
                </>
              )}
            </button>

            <button
              onClick={handleResetView}
              aria-label={t("skills.resetView") || "Reset Sudut Pandang"}
              className="px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-[var(--bg-surface)]/90 backdrop-blur-md border border-[var(--border-default)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all cursor-pointer shadow-md"
            >
              <RotateCcw size={13} className="text-[var(--accent)]" />
              <span className="hidden sm:inline">{t("skills.resetView") || "Reset"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tech Inspector Modal / Drawer */}
      <TechInspectorModal
        item={selectedTech}
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        onExploreProjects={onNavigateProjects}
      />
    </div>
  );
};

export default TechOrbitCluster;

// src/data/cardData.js

import html from "../assets/cards/html.svg";
import css from "../assets/cards/css.svg";
import js from "../assets/cards/js.svg";
import typescript from "../assets/cards/typescript.svg";
import react from "../assets/cards/react.svg";
import nextjs from "../assets/cards/nextjs.svg";
import vue from "../assets/cards/vue.svg";
import tailwindcss from "../assets/cards/tailwindcss.svg";

import git from "../assets/cards/git.svg";
import github from "../assets/cards/github.svg";
import restapi from "../assets/cards/restapi.svg";
import vercel from "../assets/cards/vercel.svg";

import testing from "../assets/cards/testing.svg";
import manual_testing from "../assets/cards/manual_testing.svg";
import bug from "../assets/cards/bug.svg";
import uiux from "../assets/cards/uiux.svg";
import responsive from "../assets/cards/responsive.svg";
import problem_solving from "../assets/cards/problem_solving.svg";

export const skillCategories = [
  {
    id: "frontend",
    name: "Frontend Development",
    nameId: "Frontend Development",
    icon: "ri-code-s-slash-line",
    items: [
      {
        id: "react",
        title: "React.js",
        description: "Frontend Library",
        icon: react,
        category: "frontend",
        level: 95,
        tier: "Core Competency",
        ring: 1,
        color: "#61DAFB",
        experienceDesc: {
          id: "Pengembangan komponen modular, hooks kustom, state management, integrasi animasi motion, dan optimasi render.",
          en: "Modular component architecture, custom hooks, state management, motion animation integrations, and render optimizations.",
        },
        highlights: ["React 19 & Hooks", "Component Design", "Virtual DOM", "Performance Tuning"],
        relatedProjects: ["Website Portofolio", "Interactive Dashboard"],
      },
      {
        id: "tailwind",
        title: "Tailwind CSS",
        description: "Utility-First CSS Framework",
        icon: tailwindcss,
        category: "frontend",
        level: 94,
        tier: "Core Competency",
        ring: 1,
        color: "#38BDF8",
        experienceDesc: {
          id: "Perancangan UI sistematis dengan utility class, arsitektur tema adaptif, CSS variables, dan glassmorphism modern.",
          en: "Systematic UI design with utility classes, adaptive theme tokens, CSS variables, and modern glassmorphic aesthetics.",
        },
        highlights: ["Tailwind v4", "Design Tokens", "Glassmorphism", "Responsive Layouts"],
        relatedProjects: ["Website Portofolio", "UI Design System"],
      },
      {
        id: "javascript",
        title: "JavaScript",
        description: "Core Programming Language",
        icon: js,
        category: "frontend",
        level: 92,
        tier: "Core Competency",
        ring: 1,
        color: "#F7DF1E",
        experienceDesc: {
          id: "Penguasaan mendalam ES6+, asynchronous programming (Promises/async-await), DOM manipulation, dan functional programming.",
          en: "Deep command of ES6+, asynchronous patterns (Promises/async-await), DOM manipulation, and functional patterns.",
        },
        highlights: ["ES6+ Modern", "Async/Await", "Event Loop", "Clean Code"],
        relatedProjects: ["Interactive Games", "Dynamic Web Apps"],
      },
      {
        id: "typescript",
        title: "TypeScript",
        description: "Typed JavaScript",
        icon: typescript,
        category: "frontend",
        level: 88,
        tier: "Advanced",
        ring: 1,
        color: "#3178C6",
        experienceDesc: {
          id: "Membangun kode yang type-safe, interface terstruktur, generic types, dan pencegahan runtime error sejak compile-time.",
          en: "Developing type-safe codebases, structured interfaces, generics, and preempting runtime bugs at compile time.",
        },
        highlights: ["Type Safety", "Interfaces & Generics", "Strict Linting", "Scalable Code"],
        relatedProjects: ["Fullstack Web App", "Component Library"],
      },
      {
        id: "nextjs",
        title: "Next.js",
        description: "React Framework",
        icon: nextjs,
        category: "frontend",
        level: 86,
        tier: "Advanced",
        ring: 2,
        color: "#ffffff",
        experienceDesc: {
          id: "Server-side rendering (SSR), static site generation (SSG), App Router, dan integrasi API routes berkecepatan tinggi.",
          en: "Server-side rendering (SSR), static site generation (SSG), App Router, and fast API route orchestrations.",
        },
        highlights: ["App Router", "SSR / SSG", "SEO Optimization", "Server Components"],
        relatedProjects: ["Modern Production Apps"],
      },
      {
        id: "vue",
        title: "Vue.js",
        description: "Frontend Framework",
        icon: vue,
        category: "frontend",
        level: 84,
        tier: "Proficient",
        ring: 2,
        color: "#42B883",
        experienceDesc: {
          id: "Pembuatan aplikasi SPA berbasis Composition API, reactivity system, scoped styles, dan Vue Router.",
          en: "Single-page application development leveraging Composition API, reactivity system, scoped styles, and Vue Router.",
        },
        highlights: ["Composition API", "Reactivity System", "Vue Router", "Component Lifecycle"],
        relatedProjects: ["Internal Dashboard"],
      },
      {
        id: "html5",
        title: "HTML5",
        description: "Markup Language",
        icon: html,
        category: "frontend",
        level: 96,
        tier: "Mastery",
        ring: 1,
        color: "#E34F26",
        experienceDesc: {
          id: "Struktur semantik HTML5 yang ramah SEO, aksesibilitas (a11y), validasi W3C, dan pemanfaatan micro-data.",
          en: "Semantic HTML5 structure engineered for SEO, a11y accessibility standards, W3C compliance, and microdata.",
        },
        highlights: ["Semantic Elements", "A11y Standards", "SEO Meta tags", "Modern Audio/Video"],
        relatedProjects: ["Semua Proyek Web"],
      },
      {
        id: "css3",
        title: "CSS3",
        description: "Styling Language",
        icon: css,
        category: "frontend",
        level: 95,
        tier: "Mastery",
        ring: 1,
        color: "#1572B6",
        experienceDesc: {
          id: "Penguasaan Flexbox, CSS Grid, custom properties (CSS variables), keyframe animations, dan fluid typography.",
          en: "Mastery over Flexbox, CSS Grid, custom properties (variables), keyframe animations, and fluid typography.",
        },
        highlights: ["Flexbox & Grid", "Keyframe Animations", "Fluid Scaling", "Media Queries"],
        relatedProjects: ["Semua Proyek Web"],
      },
    ],
  },
  {
    id: "tools",
    name: "Development & Tools",
    nameId: "Development & Tools",
    icon: "ri-tools-line",
    items: [
      {
        id: "git",
        title: "Git",
        description: "Version Control",
        icon: git,
        category: "tools",
        level: 92,
        tier: "Core Competency",
        ring: 2,
        color: "#F05032",
        experienceDesc: {
          id: "Branching strategies (Git Flow), resolving merge conflicts, interactive rebase, dan atomic commit messages.",
          en: "Branching strategies (Git Flow), resolving merge conflicts, interactive rebasing, and atomic commit practices.",
        },
        highlights: ["Git Flow", "Merge & Rebase", "Commit Standards", "History Inspection"],
        relatedProjects: ["Semua Proyek Kolaborasi"],
      },
      {
        id: "github",
        title: "GitHub",
        description: "Code Hosting",
        icon: github,
        category: "tools",
        level: 90,
        tier: "Core Competency",
        ring: 2,
        color: "#ffffff",
        experienceDesc: {
          id: "Collaborative code reviews, pull requests, issue tracking, GitHub Actions CI/CD workflows, dan project boards.",
          en: "Collaborative pull request reviews, issue management, GitHub Actions CI/CD workflows, and project boards.",
        },
        highlights: ["Pull Requests", "Code Reviews", "Actions CI/CD", "Release Tags"],
        relatedProjects: ["Repositori Portofolio & Proyek"],
      },
      {
        id: "restapi",
        title: "REST API",
        description: "API Integration",
        icon: restapi,
        category: "tools",
        level: 93,
        tier: "Core Competency",
        ring: 2,
        color: "#009688",
        experienceDesc: {
          id: "Konsumsi dan pengujian endpoint HTTP/HTTPS, error handling terstruktur, payload serialization, dan caching strategi.",
          en: "Consuming and testing HTTP/HTTPS endpoints, structured error handling, payload serialization, and client caching.",
        },
        highlights: ["RESTful Architecture", "Status Codes & Headers", "Payload Optimization", "Auth Tokens"],
        relatedProjects: ["Integrasi Backend & Gemini AI"],
      },
      {
        id: "vercel",
        title: "Vercel",
        description: "Deployment Platform",
        icon: vercel,
        category: "tools",
        level: 89,
        tier: "Advanced",
        ring: 2,
        color: "#ffffff",
        experienceDesc: {
          id: "Automated edge deployment, environment variables management, domain linking, dan serverless function execution.",
          en: "Automated edge deployments, environment variable security, domain DNS routing, and serverless runtime execution.",
        },
        highlights: ["Edge CDN", "Serverless API", "Continuous Deployment", "Speed Insights"],
        relatedProjects: ["Deploy Portofolio Live"],
      },
    ],
  },
  {
    id: "quality",
    name: "Quality & Supporting Skills",
    nameId: "Quality & Supporting Skills",
    icon: "ri-shield-check-line",
    items: [
      {
        id: "software-testing",
        title: "Software Testing",
        description: "Quality Assurance",
        icon: testing,
        category: "quality",
        level: 94,
        tier: "Specialized QA",
        ring: 3,
        color: "#10B981",
        experienceDesc: {
          id: "Penerapan metodologi software QA, perancangan test plan menyeluruh, edge-case analysis, dan pengujian regresi.",
          en: "Application of software QA methodologies, comprehensive test plan design, edge-case analysis, and regression audits.",
        },
        highlights: ["Test Case Design", "Boundary Value Analysis", "Regression Testing", "Verification & Validation"],
        relatedProjects: ["QA Testing Suites", "Production Web Audit"],
      },
      {
        id: "manual-testing",
        title: "Manual Testing",
        description: "Functional Testing",
        icon: manual_testing,
        category: "quality",
        level: 93,
        tier: "Specialized QA",
        ring: 3,
        color: "#34D399",
        experienceDesc: {
          id: "Pengujian fungsional lintas skenario pengguna (happy path vs error path), simulasi input ekstrim, dan verifikasi alur bisnis.",
          en: "Functional scenario-based testing (happy path vs error paths), edge input stress testing, and business workflow audits.",
        },
        highlights: ["Functional Verification", "Smoke Testing", "Usability Inspection", "User Journey Audits"],
        relatedProjects: ["Web Application QA"],
      },
      {
        id: "bug-reporting",
        title: "Bug Reporting",
        description: "Issue Identification & Documentation",
        icon: bug,
        category: "quality",
        level: 95,
        tier: "Specialized QA",
        ring: 3,
        color: "#EF4444",
        experienceDesc: {
          id: "Penyusunan laporan bug komprehensif mencakup steps to reproduce, expected vs actual behavior, log stack trace, dan severity triage.",
          en: "Composing structured bug reports including reproducible steps, expected vs actual delta, stack traces, and severity triage.",
        },
        highlights: ["Steps to Reproduce", "Severity & Priority", "Console Log Auditing", "Issue Triage"],
        relatedProjects: ["Issue Tracking System"],
      },
      {
        id: "uiux",
        title: "UI/UX",
        description: "User Interface & Experience",
        icon: uiux,
        category: "quality",
        level: 90,
        tier: "Core Competency",
        ring: 3,
        color: "#A855F7",
        experienceDesc: {
          id: "Merancang tata letak ergonomis, kontras visual WCAG, navigasi intuitif, micro-interaction, dan estetika cyber-modern.",
          en: "Designing ergonomic layouts, WCAG visual contrast, intuitive navigation patterns, micro-interactions, and cyber-modern aesthetics.",
        },
        highlights: ["Design Hierarchy", "Visual Contrast", "Micro-interactions", "Figma Prototyping"],
        relatedProjects: ["Portofolio Redesign", "Client Web Concepts"],
      },
      {
        id: "responsive",
        title: "Responsive Design",
        description: "Cross-Device Web Design",
        icon: responsive,
        category: "quality",
        level: 96,
        tier: "Mastery",
        ring: 3,
        color: "#06B6D4",
        experienceDesc: {
          id: "Tampilan adaptif pixel-perfect di layar smartphone, tablet, laptop, dan monitor ultra-wide tanpa horizontal overflow.",
          en: "Pixel-perfect adaptive layouts across smartphones, tablets, laptops, and ultra-wide displays with zero overflow.",
        },
        highlights: ["Mobile-First Design", "Fluid Layouts", "Touch-friendly UI", "Breakpoints Tuning"],
        relatedProjects: ["Semua Proyek Web"],
      },
      {
        id: "problem-solving",
        title: "Problem Solving",
        description: "Analytical Thinking",
        icon: problem_solving,
        category: "quality",
        level: 92,
        tier: "Core Strength",
        ring: 3,
        color: "#F59E0B",
        experienceDesc: {
          id: "Pendekatan analitis berbasis data untuk mendiagnosis bottleneck performa, root cause analysis, dan refactoring kode.",
          en: "Data-driven analytical approaches to diagnostic performance bottlenecks, root cause analysis, and code refactoring.",
        },
        highlights: ["Root Cause Analysis", "Algorithmic Logic", "Debugging", "Clean Refactoring"],
        relatedProjects: ["Software Optimization & QA"],
      },
    ],
  },
];

const skillsData = skillCategories.flatMap((cat) => cat.items);

export default skillsData;

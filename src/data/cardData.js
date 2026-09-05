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
      { title: "HTML5", description: "Markup Language", icon: html, category: "frontend" },
      { title: "CSS3", description: "Styling Language", icon: css, category: "frontend" },
      { title: "JavaScript", description: "Core Programming Language", icon: js, category: "frontend" },
      { title: "TypeScript", description: "Typed JavaScript", icon: typescript, category: "frontend" },
      { title: "React.js", description: "Frontend Library", icon: react, category: "frontend" },
      { title: "Next.js", description: "React Framework", icon: nextjs, category: "frontend" },
      { title: "Vue.js", description: "Frontend Framework", icon: vue, category: "frontend" },
      { title: "Tailwind CSS", description: "Utility-First CSS Framework", icon: tailwindcss, category: "frontend" },
    ],
  },
  {
    id: "tools",
    name: "Development & Tools",
    nameId: "Development & Tools",
    icon: "ri-tools-line",
    items: [
      { title: "Git", description: "Version Control", icon: git, category: "tools" },
      { title: "GitHub", description: "Code Hosting", icon: github, category: "tools" },
      { title: "REST API", description: "API Integration", icon: restapi, category: "tools" },
      { title: "Vercel", description: "Deployment Platform", icon: vercel, category: "tools" },
    ],
  },
  {
    id: "quality",
    name: "Quality & Supporting Skills",
    nameId: "Quality & Supporting Skills",
    icon: "ri-shield-check-line",
    items: [
      { title: "Software Testing", description: "Quality Assurance", icon: testing, category: "quality" },
      { title: "Manual Testing", description: "Functional Testing", icon: manual_testing, category: "quality" },
      { title: "Bug Reporting", description: "Issue Identification & Documentation", icon: bug, category: "quality" },
      { title: "UI/UX", description: "User Interface & Experience", icon: uiux, category: "quality" },
      { title: "Responsive Design", description: "Cross-Device Web Design", icon: responsive, category: "quality" },
      { title: "Problem Solving", description: "Analytical Thinking", icon: problem_solving, category: "quality" },
    ],
  },
];

const skillsData = skillCategories.flatMap((cat) => cat.items);

export default skillsData;

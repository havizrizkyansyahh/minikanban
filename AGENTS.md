# AGENTS.md — MiniKanban Engineering Standards

This document defines the architecture, engineering principles, design rules, and operational workflow for developing the **MiniKanban** web application.

---

## 1. Project Overview & Tech Stack

* **Application:** MiniKanban — an agile, intuitive, and tactile Kanban board.
* **Core Stack:**
  * **Framework:** React with TypeScript (Strict mode enabled)
  * **Build Tool:** Vite
  * **Styling:** Tailwind CSS (utility-first, semantic token-driven)
  * **State & Logic:** Lightweight React patterns (custom hooks, Context or lightweight store when scoped, functional state transitions)

---

## 2. Core Engineering Principles

* **SOLID, DRY, KISS, and YAGNI:**
  * Apply principles pragmatically. Do not over-engineer abstractions before requirements justify them.
  * Keep components small, focused, and single-purpose.
* **Separation of Concerns:**
  * **Presentation:** Pure/presentational UI components receive data and callbacks via typed props.
  * **Business Logic & State:** Encapsulated in custom hooks (e.g., `useKanbanBoard`, `useDragAndDrop`, `useLocalStorage`).
  * **Domain Types:** Centralized domain models (e.g., `Board`, `Column`, `Task`, `Priority`) in dedicated type declaration files.
* **Strict TypeScript Standards:**
  * Strict mode must be enforced; avoid `any`. Use strict unions, generics, and unknown/type-guards where appropriate.
  * Ensure explicit prop interfaces and exhaustiveness checking for state/action discriminators.

---

## 3. Frontend Design & Craft (Impeccable Standards)

Adhere to the project's **Impeccable** design skill:

* **Surface Mode: Operate:**
  * The primary purpose is fast, tactile task execution and clarity. Prioritize scanability, visual rhythm, low latency, and clarity over decorative fluff.
* **Anti-AI Aesthetic Rule:**
  * Avoid generic AI tropes: glowing neon cards, washed-out low-contrast gray text, arbitrary purple-on-black gradients, and excessive floating glassmorphism.
  * Deliver crisp typography, deliberate borders, tactile elevation, clean drag-state affordances, and coherent semantic color indicators (e.g., priorities, task states).
* **Design System Consistency:**
  * Strict spacing scale (multiples of 4/8px via Tailwind).
  * Harmonious, purposeful color tokens for backgrounds, cards, status badges, and interactive hover/active states.
  * Thoughtful micro-interactions: smooth transitions, clear drop-zone highlights, grab/grabbing cursors.
* **Responsive Design & Accessibility (a11y):**
  * Fully responsive across mobile, tablet, and desktop viewports.
  * Semantic HTML structure (`<main>`, `<section>`, `<article>`, `<button>`).
  * Keyboard navigation and ARIA attributes for interactive elements and modal dialogs.
  * Ensure WCAG AA contrast compliance for text and interactive controls.

---

## 4. React Best Practices & Performance

Incorporate guidance from the **react-best-practices** skill:

* **State Colocation:** Keep state as close as possible to the components that consume it. Avoid lifting state prematurely.
* **Re-render Discipline:**
  * Use functional updates (`setTasks(prev => ...)`) for stable handler callbacks.
  * Hoist static JSX and constants outside of component bodies.
  * Avoid unnecessary inline function or object creation inside performance-critical loops (e.g., card lists).
  * Utilize `useMemo` and `useCallback` deliberately where reference stability or expensive calculations warrant it—not indiscriminately.
* **Lean Bundle & Dependencies:**
  * Prefer idiomatic native solutions over heavy third-party libraries for trivial tasks.
  * Avoid barrel imports that bloat tree-shaking; import modularly.
* **State Completeness:**
  * Always provide deliberate states for: **Loading**, **Empty** (e.g., empty column, no search results), and **Error** (with recovery actions).

---

## 5. Quality Assurance & UI Review

* **Automated Verification:**
  * **Type Checking:** Must pass `tsc --noEmit` cleanly without errors.
  * **Linting:** Must pass ESLint with project-specific rules without warnings.
  * **Build Verification:** Must produce a clean production bundle via `vite build`.
  * **Automated Tests:** Unit and integration tests for critical business logic (state transitions, task sorting/filtering, drag-and-drop computations).
* **UI Auditing:**
  * Review all UI code against the **web-design-guidelines** skill (verifying contrast, tap targets, focus rings, accessibility landmarks).

---

## 6. Safety & Operational Workflow

* **Scoped Worktree:**
  * Work strictly within the current Git worktree directory (`feat-initial-app`). Never touch files or directories outside this boundary.
* **Inspect Before Changing:**
  * Always inspect existing files and project structure before proposing or applying modifications.
* **Plan Before Implementation:**
  * Outline the implementation approach, architectural impacts, and verification criteria prior to writing code.
* **Explicit User Approval:**
  * **Never** commit, push, deploy, or delete files without explicit approval from the user.
  * **Never** run unprompted destructive shell commands.
* **Post-Task Summary:**
  * Provide a concise summary of changes made, files modified, and verification results after every completed task.

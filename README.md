# MiniKanban

MiniKanban is a mindful, tactile, and open-source personal Kanban task manager built with React 18, TypeScript, Vite, Tailwind CSS, `@dnd-kit`, and `localStorage`.

It provides a distraction-free, editorial workspace designed for deep focus.

---

## ✨ Features

* **Agile Kanban Board:** Three structured columns (*To Do*, *In Progress*, *Done*) with dynamic task counts.
* **Full Task CRUD:** Create, edit, and delete tasks with title validation, optional descriptions, and priority levels (*Low*, *Medium*, *High*).
* **Tactile Drag-and-Drop (`@dnd-kit`):**
  * Reorder tasks within columns or move across columns seamlessly.
  * Tactile drag elevation (`shadow-modal`) and 1.2° tilt feedback.
  * Pointer and touch sensor constraints (5px distance / 200ms touch delay) to distinguish clicking/editing from dragging.
  * Full screen-reader live announcements on drag start, move, drop, and cancel.
* **Accessible Non-Drag Alternatives:** Every card includes a dedicated keyboard-accessible action menu (`···`) to move tasks across columns, edit, or delete with confirmation.
* **Safe LocalStorage Persistence:**
  * Synchronous hydration on initial render to prevent data overwrites.
  * Runtime schema validation (`version: 1`) verifying types and referential integrity.
  * Automated recovery: corrupt or incompatible data is safely preserved to a timestamped backup key (`minikanban_backup_{timestamp}`) instead of being destroyed.
* **Real-Time Search & Priority Filter:**
  * Instant search across task titles and descriptions.
  * Priority filter pills (*All*, *High*, *Medium*, *Low*).
  * Clear/Reset filters action and adaptive empty-state messaging.
  * Safe DnD protection: Drag-and-drop is paused during active search/filtering to prevent index corruption.
* **Calm & Editorial Visual Design:**
  * Warm off-white canvas (`#FAF8F5`), charcoal typography (`#1C1917`), and botanical sage accents (`#3D5A45`).
  * Deep charcoal dark mode maintaining warm mineral undertones.
  * Anti-AI aesthetic: Zero generic neon gradients, washed-out low-contrast gray text, or nested card sprawl.
* **Accessibility (WCAG 2.2 AA):**
  * Automated `axe-core` accessibility test suite with 0 violations.
  * High-contrast focus indicators (`focus-visible:ring-2 focus-visible:ring-sage`).
  * Full modal dialog focus trapping, Escape dismissal, and focus restoration.
  * Touch target optimization (`touch-manipulation`) and `prefers-reduced-motion` compliance.

---

## 🛠️ Tech Stack

* **Framework:** React 18
* **Language:** TypeScript 5 (Strict Mode enabled)
* **Build Tool:** Vite 6
* **Styling:** Tailwind CSS 3 (Utility-first semantic tokens)
* **Drag-and-Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
* **Icons:** `lucide-react` (Tree-shaken)
* **Testing:** Vitest, React Testing Library, `vitest-axe` (automated WCAG testing), `jsdom`
* **Linting:** ESLint 9 (TypeScript-ESLint + React Hooks)

---

## 🚀 Getting Started

### Prerequisites

* **Node.js:** v18.0.0 or later (Node 20+ recommended)
* **npm:** v9.0.0 or later

### Installation

```bash
# Clone the repository
git clone https://github.com/example/minikanban.git
cd minikanban

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server with Hot Module Replacement (HMR) |
| `npm run build` | Runs TypeScript compiler checks and compiles production assets into `dist/` |
| `npm run preview` | Locally serves and previews the production build output |
| `npm run lint` | Runs ESLint 9 across all TypeScript and React files |
| `npm run typecheck` | Validates TypeScript types across the codebase (`tsc --noEmit`) |
| `npm run test` | Runs the full Vitest suite (including unit, integration, and axe a11y tests) |
| `npm run test:watch` | Runs Vitest in interactive watch mode |

---

## 🧪 Testing & Quality Assurance

### Automated Testing Matrix
* **Unit Tests:** `kanbanReducer.test.ts`, `storage.test.ts`, `useKanbanBoard.test.ts`, `useTaskFilter.test.ts`
* **Component Tests:** `Button.test.tsx`, `Modal.test.tsx`, `TaskCard.test.tsx`, `Column.test.tsx`, `FilterToolbar.test.tsx`
* **Integration Tests:** `App.test.tsx` (Complete CRUD, modal workflows, persistence, accessible actions)
* **Accessibility Audits:** `Accessibility.test.tsx` (Automated `axe-core` audits checking WCAG 2.2 AA compliance across components and views)

To run the full verification suite:
```bash
npm run lint && npm run typecheck && npm run test && npm run build
```

### Manual Acceptance Testing Checklist
1. **Drag-and-Drop:** Pick up a card with pointer or touch, drag across columns, and release. Confirm clean reordering and tactile feedback.
2. **Click vs. Drag:** Single-clicking any card opens the Edit Task modal without initiating an accidental drag.
3. **Keyboard Accessibility:** Press `Tab` to navigate through tasks and action menus. Press `Space` on a card to initiate keyboard drag, move with arrows, and drop with `Space`.
4. **LocalStorage Persistence:** Add/edit a task, refresh the browser, and verify all updates remain intact.
5. **Search & Filter Safety:** Search for a term; verify that non-matching tasks hide, column counts reflect `filtered / total`, and drag-and-drop displays the active pause banner.

---

## 📂 Architecture Documentation

* [AGENTS.md](AGENTS.md) — Engineering standards, architectural rules, and operational workflows.
* [DESIGN.md](DESIGN.md) — Comprehensive design system, accessible color tokens, typography, and interaction matrix.
* [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) — Phased architecture roadmap and delivery plan.

---

## ⚠️ Known Boundaries & Scope Limitations

* **Single Personal Board:** Designed as a personal task manager; does not support multi-board switching or cloud teams.
* **Client-Side Only:** Operates entirely within the browser (`localStorage`). No server databases or user authentication required.
* **Filter DnD Pause:** Drag-and-drop is intentionally disabled while filters are active to prevent corrupting the canonical board ordering. Use the card action menu (`···`) for non-drag moves while filtering.

---

## 📄 License

[MIT](LICENSE) © 2026 MiniKanban Contributors

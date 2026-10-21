# DESIGN.md — MiniKanban Design System & Interface Specification

This document establishes the visual identity, token architecture, interaction patterns, and design specifications for **MiniKanban**. It serves as the single source of truth for all presentational and interaction engineering.

---

## 1. Product Personality & Design Principles

MiniKanban is a mindful, tactile, and personal task execution surface. It is designed to foster deep focus and intentionality rather than chaotic team ticketing.

### Core Tenets
1. **Calm & Editorial:** The board feels like a curated physical notebook or architectural workspace—warm off-white paper, crisp charcoal ink, and natural sage accents.
2. **Tactile & Responsive (Operate Mode):** Every interaction (card drag, state toggle, inline edit) gives immediate, physical feedback. No mushy or sluggish animations.
3. **Clarity Over Decoration:** Content is king. Avoid gratuitous cards-within-cards, excessive borders, uninformative badges, or visual noise.
4. **Anti-AI Dashboard Aesthetic:**
   * **Banned:** Neon cyan/purple gradients, generic dark-mode glassmorphism, washed-out low-contrast gray text (`#9CA3AF` body text), and arbitrary floating glow effects.
   * **Mandated:** Purposeful warm neutrals, high-contrast typography, distinct physical elevation layers, and grounded semantic colors.

---

## 2. Color System & Semantic Tokens

The color palette is built on warm mineral tones (stone/charcoal) with restrained botanical sage as the primary accent, and terracotta/ochre for state and priority.

### 2.1 Light Theme Palette (Default)

| Token Name | Hex / CSS Value | Tailwind Class Equivalent | Purpose / WCAG Contrast |
| :--- | :--- | :--- | :--- |
| `bg-canvas` | `#FAF8F5` | `bg-[#FAF8F5]` | Warm off-white canvas (background) |
| `bg-surface` | `#FFFFFF` | `bg-white` | Card and modal surface |
| `bg-column` | `#F4F1EA` | `bg-[#F4F1EA]` | Column container track background |
| `bg-subtle` | `#EFECE6` | `bg-[#EFECE6]` | Hover fills, subtle chip backgrounds |
| `border-subtle` | `#E7E3DA` | `border-[#E7E3DA]` | Column borders, divider rules |
| `border-strong` | `#D5D0C5` | `border-[#D5D0C5]` | Card borders, input field borders |
| `text-primary` | `#1C1917` | `text-stone-900` | Headings, card titles (14.2:1 against canvas) |
| `text-secondary` | `#57534E` | `text-stone-600` | Descriptions, metadata (5.8:1 against canvas) |
| `text-muted` | `#78716C` | `text-stone-500` | Secondary icons, shortcuts, timestamps (4.5:1) |
| `accent-sage` | `#3D5A45` | `text-[#3D5A45]` / `bg-[#3D5A45]` | Primary action, active tab (5.6:1 against canvas) |
| `accent-sage-hover`| `#314937` | `bg-[#314937]` | Button hover state |
| `accent-sage-soft` | `#EAF0EB` | `bg-[#EAF0EB]` | Selected states, column accent highlights |
| `accent-sage-border`| `#B8CEBE`| `border-[#B8CEBE]` | Focused outline, active card dropzone |

### 2.2 Semantic & Priority Tokens

| Priority / Status | Foreground | Background Pill | Border |
| :--- | :--- | :--- | :--- |
| **Urgent** | `#9A3412` (Rust 700) | `#FFEDD5` (Orange 100) | `#FDBA74` (Orange 300) |
| **High** | `#C2410C` (Terracotta 600)| `#FFF7ED` (Orange 50) | `#FED7AA` (Orange 200) |
| **Medium** | `#A16207` (Warm Amber 700)| `#FEF9C3` (Yellow 100) | `#FDE047` (Yellow 300) |
| **Low** | `#57534E` (Stone 600) | `#F5F5F4` (Stone 100) | `#E7E5E4` (Stone 200) |
| **Complete / Done**| `#2B5138` (Forest Sage) | `#EBF2EC` (Sage 50) | `#C2D9C7` (Sage 200) |

### 2.3 Dark Theme Palette (Quiet Charcoal)

Dark mode preserves the warm editorial feel by avoiding pitch-black `#000000` or cold blue `#0F172A`.

| Token Name | Hex / CSS Value | Purpose |
| :--- | :--- | :--- |
| `bg-canvas` | `#181716` | Deep warm charcoal background |
| `bg-surface` | `#232220` | Card surface |
| `bg-column` | `#1C1B19` | Column track background |
| `bg-subtle` | `#2E2C29` | Interactive chip fills, hover states |
| `border-subtle` | `#363430` | Subtle container lines |
| `border-strong` | `#4B4843` | Card borders, input outlines |
| `text-primary` | `#F5F5F4` | Headings, card titles (13.8:1 against canvas) |
| `text-secondary` | `#A8A29E` | Secondary metadata (6.5:1 against canvas) |
| `text-muted` | `#78716C` | Muted auxiliary labels |
| `accent-sage` | `#6E997B` | Primary highlights & badges in dark context |
| `accent-sage-soft` | `#1F2922` | Active chip background |

---

## 3. Typography & Hierarchy

### 3.1 Font Family Stacks
* **Primary (UI & Titles):** System Humanist/Swiss Stack:
  `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", "Helvetica Neue", sans-serif`
* **Monospace (Counts, IDs, Shortcuts):**
  `ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace`

### 3.2 Type Scale

| Role | Size | Weight | Tracking | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / App Header**| `20px` (`1.25rem`) | `600` (SemiBold) | `-0.015em` | `1.3` | Top-bar app name, board title |
| **Section / Dialog Title**| `16px` (`1.0rem`) | `600` (SemiBold) | `-0.01em` | `1.4` | Modal dialog titles, drawer headers |
| **Column Header** | `13px` (`0.8125rem`)| `600` (SemiBold) | `+0.02em` | `1.2` | Column title (`TO DO`, `IN PROGRESS`) |
| **Card Title** | `14px` (`0.875rem`) | `500` (Medium) | `-0.005em` | `1.4` | Primary task card text |
| **Body / Description** | `13px` (`0.8125rem`)| `400` (Regular) | `0` | `1.5` | Task descriptions, notes |
| **Caption / Meta** | `11px` (`0.6875rem`)| `500` (Medium) | `+0.01em` | `1.3` | Priority tags, dates, keyboard hints |

---

## 4. Spacing, Elevation & Geometric Tokens

### 4.1 Spacing Scale
Follows a 4px/8px rhythm via standard Tailwind spacing tokens:
* `space-1` (4px): Micro gaps (icon-to-text, badge internal padding).
* `space-2` (8px): Compact element spacing, card vertical internal elements.
* `space-3` (12px): Standard card padding, column gap on mobile.
* `space-4` (16px): Column horizontal padding, card list gap.
* `space-6` (24px): Board header padding, gutter between columns.

### 4.2 Radii (Border Radius)
* `rounded-sm` (`4px`): Badges, priority pills, keyboard shortcut tags.
* `rounded-md` (`6px`): Buttons, form inputs, dropdown menus.
* `rounded-lg` (`8px`): Task cards.
* `rounded-xl` (`12px`): Kanban columns, modal containers.

### 4.3 Shadows & Elevation
* **Resting Task Card:**
  `box-shadow: 0 1px 2px 0 rgba(28, 25, 23, 0.05);` (Tailwind: `shadow-xs`)
* **Card Hover:**
  `box-shadow: 0 2px 5px 0 rgba(28, 25, 23, 0.08);` (Subtle 1px vertical elevation)
* **Active Dragging Card:**
  `box-shadow: 0 12px 24px -4px rgba(28, 25, 23, 0.15), 0 4px 8px -2px rgba(28, 25, 23, 0.06);`
* **Dialog Modal:**
  `box-shadow: 0 20px 30px -10px rgba(28, 25, 23, 0.18), 0 8px 10px -6px rgba(28, 25, 23, 0.08);`

---

## 5. Component Specifications

### 5.1 Kanban Column Container
* **Dimensions:**
  * Desktop: Fixed width `300px` (`w-[300px]`), flex-shrink `0`.
  * Height: `calc(100vh - 120px)` with independent internal card scroll.
* **Header:**
  * Column title in `text-stone-700` / `font-semibold`.
  * Pill counter for task count: `px-1.5 py-0.5 text-xs font-mono rounded bg-stone-200/80 text-stone-600`.
  * Quick-add button `＋` aligned right (`hover:bg-stone-200/60 p-1 rounded`).
* **Drop Zone Styling:**
  * Resting: Clean track background `#F4F1EA` with `border border-[#E7E3DA] rounded-xl`.
  * Active Drag-over: Border shifts to `border-dashed border-[#8EA694] bg-[#F1F6F2]`.
  * Insertion Indicator: 2px solid horizontal line (`bg-[#3D5A45] rounded-full my-1`).

### 5.2 Task Card (`<TaskCard />`)
* **Structure:**
  * Background: Pure white `#FFFFFF` (dark: `#232220`).
  * Border: `1px solid #E7E3DA` (dark: `1px solid #363430`).
  * Padding: `12px` (`p-3`).
  * Radius: `rounded-lg`.
  * Cursor: `cursor-grab`, switches to `cursor-grabbing` on mousedown.
* **Card Content Hierarchy:**
  1. **Top Row:** Priority pill (e.g. `Urgent`, `Medium`) + Optional category tag + Context menu trigger (`···`).
  2. **Middle:** Task title (`text-stone-900 text-sm font-medium leading-snug`).
  3. **Bottom Row:** Due date badge (if present) with overdue warning (terracotta) + Subtask/checklist counter (e.g., `2/4`).

### 5.3 Buttons
* **Primary Action (e.g., "Add Task", "Save"):**
  * `bg-[#3D5A45] text-white hover:bg-[#314937] active:scale-[0.98]`
  * Padding: `px-3.5 py-1.5`, `rounded-md`, `text-sm font-medium`.
  * Transition: `transition-all duration-150 ease-out`.
* **Secondary / Ghost (e.g., "Cancel", "Filter"):**
  * `bg-transparent text-stone-700 border border-stone-300 hover:bg-stone-100/80 active:bg-stone-200`
* **Icon-Only Buttons:**
  * Square tap target: minimum `36x36px` on desktop, `44x44px` on mobile.
  * Centered icon, `hover:bg-stone-200/70 rounded-md`.

### 5.4 Form Controls & Modals
* **Inputs & Textareas:**
  * Background: White `#FFFFFF`.
  * Border: `1px solid #D5D0C5`.
  * Focus: `focus:outline-none focus:border-[#3D5A45] focus:ring-2 focus:ring-[#3D5A45]/20`.
  * Text: `text-stone-900 text-sm placeholder:text-stone-400`.
* **Dialog / Modal:**
  * Backdrop: `bg-stone-950/40 backdrop-blur-[2px]`.
  * Dialog Container: Centered, max-width `480px`, `rounded-xl bg-white p-6 border border-stone-200`.
  * Header: Title + Close `✕` button.
  * Footer: Right-aligned Cancel and Primary action buttons.

---

## 6. Interaction & State Specifications

### 6.1 State Matrix

| State | Visual Treatment |
| :--- | :--- |
| **Hover** | Background tints subtly (`bg-stone-100/60`), borders darken by 5%, shadow shifts from `shadow-xs` to `shadow-sm`. No jarring scale transforms. |
| **Focus-Visible**| Prominent, high-contrast focus ring: `ring-2 ring-[#3D5A45] ring-offset-2 ring-offset-white`. Never hide outline for keyboard users. |
| **Active / Pressed**| `transform: scale(0.985); transition: transform 75ms ease;` for crisp tactile tactile feel. |
| **Loading** | Warm pulse skeletons: `bg-stone-200 animate-pulse rounded`. Avoid spinner rings unless awaiting async network save. |
| **Empty Column** | Dashed subtle border `border border-dashed border-stone-300/80 rounded-lg p-6 text-center text-xs text-stone-500` with "+ Add task" trigger. |
| **Error** | Border `#DC2626`, background `#FEF2F2`, text `#991B1B`, accompanied by clear inline description and undo/retry action. |

---

## 7. Drag-and-Drop Principles

1. **Instant Feedback:** Dragging initiates after 3px movement or 150ms hold to avoid accidental drags when clicking to edit.
2. **Tactile Drag Affordance:**
   * Picked-up card tilts slightly (`rotate-1` / 1.2deg clockwise).
   * Elevation increases to `shadow-xl`.
   * Dragged source slot renders a placeholder with `opacity-30 border-2 border-dashed border-stone-300`.
3. **Drop Target Indication:**
   * An insertion pill/bar indicator (`h-1 bg-[#3D5A45] rounded-full mx-1`) marks the exact index where the card will land.
4. **Keyboard Drag Alternative:**
   * Each card provides a keyboard-accessible action menu (`Move to Next Column`, `Move Up`, `Move Down`) to satisfy WCAG AA without requiring pointer drag.

---

## 8. Responsive & Adaptive Design

### 8.1 Breakpoints
* **Mobile (`< 640px`):**
  * Top navigation becomes compact with a sticky bar.
  * Board layout: Horizontal snap-carousel (`scroll-snap-type: x mandatory;`) where each column occupies `88vw`, allowing rapid horizontal swiping between columns.
  * Touch targets scaled to `min-h-[44px]` for all interactive buttons and card grab zones.
* **Tablet (`640px - 1024px`):**
  * Columns retain `280px` width, board scrolls horizontally with natural momentum scrolling (`overflow-x-auto`).
* **Desktop (`> 1024px`):**
  * Full multi-column view (`300px` per column) with generous gutter (`24px`).
  * Global board toolbar with search, filter by priority, and "New Task" shortcut (`Ctrl/Cmd + N`).

---

## 9. Accessibility (a11y) & Reduced Motion

* **Contrast Compliance:** All text tokens maintain minimum `4.5:1` ratio against their respective surfaces (meeting WCAG 2.1 AA). Priority badges maintain minimum `3:1` contrast for graphical elements.
* **Semantic HTML:**
  * Board root: `<main role="main">`
  * Column: `<section aria-labelledby="col-title-{id}">`
  * Column Header: `<h2 id="col-title-{id}">`
  * Task Card: `<article role="listitem" tabindex="0">`
* **Keyboard Navigation:**
  * `Tab` traverses interactive cards, buttons, and inputs.
  * `Space` or `Enter` opens task details / edit mode.
  * `Escape` dismisses modals, menus, or open inputs.
* **Reduced Motion (`prefers-reduced-motion: reduce`):**
  * Disable drag card tilt and spring transforms.
  * Collapse transition times to `0ms` or instant opacity fades.

---

## 10. Theme Strategy (Light/Dark Switch)

* **Architecture:** Tailwind class strategy (`darkMode: 'class'`).
* **Default:** Light theme (warm editorial stone & sage).
* **Toggle:** Stored in `localStorage.getItem('minikanban-theme')` with fallback to `window.matchMedia('(prefers-color-scheme: dark)')`.
* **Smooth Transition:** Color transitions constrained to `duration-200 ease-in-out` on theme toggle to avoid visual stutter.

---

## 11. Explicit Anti-Patterns

1. **No Artificial Glow:** Do not use `drop-shadow` with colored neon blurs (`#8B5CF6` or `#06B6D4`).
2. **No Unstyled Glassmorphism:** Avoid `backdrop-blur-md bg-white/20` card surfaces that compromise text contrast.
3. **No Decorative Icon Sprawl:** Do not litter cards with decorative icons (e.g. arbitrary smileys, star emojis, decorative rockets). Only use functional icons (calendar for due date, flag for priority, checkmark for completion).
4. **No Low-Contrast Grey Placeholders:** Placeholder text must remain legible (`text-stone-400` minimum `3.2:1` on white).
5. **No Deep Nested Cards:** A task card is a single physical plane. Do not nest sub-cards within task cards on the main board view.

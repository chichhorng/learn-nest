# UI Tokens

Theme tokens and variables used throughout the LearnNest application to maintain a polished, modern developer aesthetic.

---

## Color Palette

LearnNest uses a sleek slate-based dark and light theme palette accented with vibrant violet/indigo tones.

### 1. Brand Accents
- **Primary (Violet/Indigo)**:
  - Hex: `#6366F1` (Indigo-500)
  - HSL: `hsl(239, 84%, 67%)`
  - Usage: Buttons, links, active navigation tabs, brand accent marks.
- **Secondary (Purple)**:
  - Hex: `#8B5CF6` (Purple-500)
  - HSL: `hsl(258, 90%, 66%)`
  - Usage: Special badges, gradient highlights.

### 2. Status Colors
- **Success (Green/Emerald)**:
  - Hex: `#10B981` (Emerald-500)
  - HSL: `hsl(159, 74%, 44%)`
  - Usage: Completed lessons, 100% progress markers, positive review scores.
- **Alert / Danger (Red/Rose)**:
  - Hex: `#F43F5E` (Rose-500)
  - HSL: `hsl(351, 89%, 60%)`
  - Usage: Incomplete profile warnings, pending approvals, required validation errors.

### 3. Neutral Scales (Slate)
- **Background**: `#F8FAFC` (Slate-50)
- **Card Background**: `#FFFFFF`
- **Border**: `#E2E8F0` (Slate-200)
- **Text Primary**: `#0F172A` (Slate-900)
- **Text Secondary**: `#475569` (Slate-600)
- **Text Muted**: `#94A3B8` (Slate-400)

---

## Typography (Inter Font Family)

Always use Inter as the base sans font.

| Token     | Size (px) | Line Height | Font Weight | Usage                                 |
| --------- | --------- | ----------- | ----------- | ------------------------------------- |
| Heading 1 | 36px      | 1.25        | 700 (Bold)  | Main dashboard headings               |
| Heading 2 | 24px      | 1.35        | 600 (Semib) | Page sections, Course Titles          |
| Heading 3 | 18px      | 1.4         | 600 (Semib) | Card headers, small highlights        |
| Body Large| 16px      | 1.5         | 400 (Reg)   | Main course descriptions, lesson body |
| Body Reg  | 14px      | 1.5         | 400 (Reg)   | Standard text, stats, profile descriptions |
| Subtext   | 12px      | 1.5         | 500 (Med)   | Muted dates, tags, badge labels       |

---

## Borders & Shadows

### Border Radius:
- Small components (badges, toggles): `4px`
- Interactive controls (buttons, input fields): `8px`
- Section containers (cards, sidebar panels): `12px`
- Outer main page containers: `16px`

### Shadows:
- **Card Shadow**: `0px 1px 3px rgba(0,0,0,0.05), 0px 1px 2px -1px rgba(0,0,0,0.05)`
- **Hover Shadow**: `0px 4px 6px -1px rgba(0,0,0,0.05), 0px 2px 4px -2px rgba(0,0,0,0.05)`
- **Overlay/Modal Shadow**: `0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px rgba(0,0,0,0.04)`

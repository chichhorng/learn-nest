# UI Rules

Visual layout and component guidelines for the LearnNest Online Learning Platform.

---

## Global Layout

- **Page Wrap**: Max-width `1440px`, centered, padding `32px` horizontally.
- **Section Spacing**: `24px` gap between grid blocks and vertical content sections.
- **Top Navbar**: Height `64px`, full width, white background with border bottom (`#E2E8F0`), padding `0 32px`.
- **Primary Layout Structure**: Top navbar for navigation with main route views rendered below it.

---

## Navigation Navbar

The navbar adapts dynamically based on the user's login state and role:
- **Logged out**: Displays brand logo, "Courses", "Login", and "Register" button.
- **Logged in Student**: Displays "Dashboard", "Browse Courses", "Profile", and a "Logout" button.
- **Logged in Instructor**: Displays "Instructor Dashboard", "Manage Courses", "Profile", and "Logout".
- **Logged in Admin**: Displays "Admin Panel", "Manage Courses", "Profile", and "Logout".
- **Active Navigation Item**: Accented with Violet color `#6366F1` and a bold font weight.

---

## Course Cards Grid

Used in the course catalog directory.
- Rendered in a responsive grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
- **Card styling**: White background, `12px` rounded corners, Slate border, subtle shadow.
- **Card content hierarchy**:
  - Top: Course title (`h3` styling, Slate-900, 2 lines max).
  - Middle: Instructor name, category badge (Indigo background), level badge (beginner/intermediate/advanced).
  - Bottom: Avg rating badge (star icon, yellow text), enroll count, and price label (bold green text if free, Slate-900 if paid).

---

## Classroom Interface

The classroom route (`/classroom/[id]`) uses a two-column desktop layout:
- **Left Column (70% width)**:
  - Embeds the main HTML5 video player (16:9 aspect ratio).
  - Lesson title and complete details/content rendered directly below the player.
- **Right Column (30% width)**:
  - Collapsible curriculum list.
  - Lists all lessons in sequential order (`order`).
  - Each lesson row has a checklist toggle (checkbox). Checking or unchecking triggers progress percentage calculation.
  - Active playing lesson highlighted with Violet outline/background.

---

## Dashboard Grid

- **Stats Grid**: Displays 3 to 4 cards at the top of the dashboard page:
  - Students: Enrolled Courses Count, Total Hours Studied, Progress completion badge.
  - Instructors: Active Courses Taught, Total Enrolled Students, Average Rating badge.
- **Activity Section**: A list of recently completed lessons, course signups, or reviews left.

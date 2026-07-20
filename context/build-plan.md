# Build Plan

This plan structures the frontend development phases of the LearnNest Online Learning Platform, wiring the Angular client-side interfaces to the fully completed NestJS backend APIs.

---

## Phase 1 — Layout & Foundation

Set up the global layouts, responsive configurations, and common shared widgets.

### 01 Base Routing & Top Navbar
- Configure standard layouts inside `src/app/layout/` (`NavbarComponent`, `FooterComponent`).
- Add route guards placeholder logic (`AuthGuard`, `RoleGuard`).
- Top Navbar:
  - Brand Logo.
  - Dynamically display routes based on active role signals: Student Dashboard vs Instructor Dashboard, Browse Courses, Profile, Login/Register.
  - Bind "Logout" action to clear token signals and redirect to homepage.

### 02 Homepage / Landing Page
- Build the landing page UI inside `features/home/`:
  - Hero banner with headline "Learn, Teach, Grow".
  - Split Call-to-Action buttons: "Browse Catalog" and "Start Teaching".
  - Features grid (value propositions for Students and Instructors).
  - Testimonial card stack.

---

## Phase 2 — Authentication Integration

Secure the client application and manage user session tokens.

### 03 HTTP Auth Interceptor
- Implement the functional HTTP Interceptor `auth.interceptor.ts`:
  - Intercept outgoing requests.
  - Automatically append the `Authorization: Bearer <token>` header if a JWT token exists in local storage.
  - Handle `401 Unauthorized` responses by clearing local session state and redirecting to the login route.

### 04 Login & Registration Pages
- Build the Login UI:
  - Email and password inputs with custom reactive form validations.
  - Form submission binds to `AuthService.login()`.
- Build the Registration UI:
  - Name, Email, Password, and Role selection dropdown (Student vs Instructor).
  - Form submission binds to `AuthService.register()`.
  - Handle Instructor registration response: display a notification that instructor accounts require Admin approval before first login.

---

## Phase 3 — Course Catalog

Search, sort, filter, and navigate the platform's courses.

### 05 Browse Course Catalog Directory
- Search bar layout with debounced text query inputs.
- Category filters (dropdown/tabs) and level filters (Beginner, Intermediate, Advanced).
- Sorting controls (Newest, Price: Low to High, Rating).
- Grid layout displaying lightweight course cards:
  - Display thumbnail placeholder or loaded image.
  - Course title, instructor name, and badges.
  - Price labels and average rating star badge.
  - Paginated navigation controls (previous page, next page, active page).
  - Wire to `CourseService.findAll()`.

### 06 Course Detail Curriculum View
- Detailed page displaying course title, description, price, and syllabus grid.
- Syllabus listing all lessons in order (free lessons highlighted with preview badges).
- Instructor bio card.
- User reviews list showing rating stars and student comments.
- Enroll button:
  - If already enrolled → "Go to Classroom" button.
  - If not enrolled → "Enroll Now" button.
  - Wire to `EnrollmentService.enroll()`.

---

## Phase 4 — Classroom & Progress Tracking

The core learning workspace environment.

### 07 Classroom Player Page
- Two-column player view:
  - Left column: Video player element + lesson title + full content details.
  - Right column: Collapsible curriculum list.
- Sidebar lesson list items:
  - List all lessons in order.
  - Checkbox next to each lesson indicating completed status.
  - Clicking a lesson loads its video URL into the player and updates active item state.
  - Toggling a checkbox triggers `EnrollmentService.updateProgress()`.
  - Dynamically recalculate progress bar percentage at the top of the classroom view.

---

## Phase 5 — Dashboards & Settings

Stat cards, activity feeds, and user configurations.

### 08 Student & Instructor Dashboards
- Student Dashboard:
  - Stat cards: Courses Enrolled, Courses Completed, Hours Spent Studied (calculated from the duration sum of completed lessons).
  - Progress list: List of enrolled courses with progress bars. Clicking a course opens the classroom page.
- Instructor Dashboard:
  - Stat cards: Active Courses Taught, Total Enrolled Students, Average Course Rating.
  - Managed Courses List: List of all taught courses, including draft and published states.
  - "Create Course" trigger.

### 09 Profile Customizations
- Editable profile forms (display name, bio).
- File upload trigger to upload user avatar.

---

## Phase 6 — Reviews & Admin Controls

### 10 Stars Review Form
- Component on the course details page permitting reviews.
- Stars selection widget (1-5 stars) and comment text area.
- Verify user has not reviewed the course yet (hide form if already reviewed).
- Wire submit to `ReviewService.create()`.

### 11 Admin Panel
- Access-restricted page (`/admin`) guarded by `AdminRoleGuard`.
- List of pending instructor accounts retrieved from `UsersService.findPendingInstructors()`.
- "Approve" button on each row triggering the `approveInstructor()` API call.
- Immediate UI list refresh upon successful approval.

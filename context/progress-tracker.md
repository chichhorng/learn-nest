# Progress Tracker

Project feature implementation roadmap checklist. Update this file as progress is made to prevent session context drift.

---

## 🟢 Backend Services (100% Completed)

- [x] Database Schema configuration with Prisma & Postgres (User, Course, Lesson, Enrollment, Review).
- [x] Password encryption hashing and validation logic.
- [x] JWT authentication and Passport security strategies.
- [x] Role authorization decorators and guards.
- [x] Public course list endpoint with custom pagination, sorting, and tag filters.
- [x] Access-protected classroom lesson endpoint allowing public preview only for free lessons.
- [x] Course reviews with transactional average rating calculations.
- [x] Database double-review constraint safety via unique constraints.
- [x] Draft course listing endpoint restricted to course instructors.
- [x] Transactional, atomic progress updates on lessons.
- [x] Admin approval controller for instructor registrations.
- [x] Dynamic dashboard analytics and study hours calculations based on lesson durations.
- [x] Compilation, linting, and unit tests passing.

---

## 🟡 Frontend UI (Pending Implementation)

### Phase 1 — Layout & Foundation
- [x] Top navbar component (`Dashboard`, `Courses`, `Profile`, `Login`/`Register`/`Logout` triggers).
- [x] Platform homepage and hero CTA sections.

### Phase 2 — Authentication Integration
- [x] functional HTTP interceptor appending JWT bearer headers.
- [x] Login page form with reactive validations.
- [x] Registration page form with Role (Student/Instructor) dropdown and pending message display.

### Phase 3 — Course Catalog
- [x] Course search directory with debounced text filter, category tags, and sorting.
- [x] Syllabus curriculum grid list with free preview signals.
- [x] Detail view for instructor profiles and user reviews lists.
- [x] "Enroll" button wiring.

### Phase 4 — Classroom Player
- [x] Video player integration for classroom lessons.
- [x] Collapsible syllabus navigation drawer.
- [x] Progress percentage calculations and checkbox toggle handlers.

### Phase 5 — Dashboards & Profile Settings
- [x] Student stats view (courses count, hours spent, progress bars).
- [x] Instructor dashboard (courses list, total students, average rating).
- [x] Profile settings and file uploading for user avatars.
- [x] Support updating profile email address (with unique duplicate email checks on backend).

### Phase 6 — Feedback & Admin
- [x] Reviews star widget and submission form.
- [x] Admin panel list of pending instructors with "Approve" triggers.
- [x] Admin user moderation dashboard (searching, listing, and cascade deleting users).
- [x] Secure password change support in user profile settings.

### Phase 7 — Instructor Portal & Course Creation
- [x] Course details creator & editor with status and thumbnail inputs.
- [x] Syllabus lesson playlist constructor (adding, editing, and deleting lectures).

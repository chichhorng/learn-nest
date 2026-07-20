# Project Overview

## About the Project

LearnNest is a full-featured online learning platform (similar to Udemy or Coursera) designed for students to take courses and instructors to teach them. The platform supports structured user registration with role selection (Student, Instructor, Admin). Instructor registrations must be explicitly approved by an Admin before they can publish courses or access instructor-specific tools.

Students can browse the course catalog, search and filter courses by level and category, enroll in courses, view video lessons, track their completion progress, and leave ratings and reviews. Instructors can create courses, structure them with video lessons, view analytics on their students and reviews, and manage draft states of their courses.

---

## Roles & Access Control

- **Student**: Can view published courses, enroll, track study progress, leave reviews, and access the Student Dashboard.
- **Instructor**: Can create and edit courses/lessons, publish draft courses, view student and revenue analytics, and access the Instructor Dashboard. Requires Admin approval to activate account.
- **Admin**: Can view pending instructor accounts and approve them. Can manage and delete any course on the platform.

---

## Pages & Routing Structure (Angular)

```
/                     → Homepage / Landing Page
/login                → Authentication page (Login / Register)
/dashboard            → Dashboard page (Instructor or Student stats view)
/courses              → Paginated course catalog (Search, Sort, Filters)
/courses/[id]         → Course details overview & curriculum listing
/classroom/[id]       → Interactive classroom view (video player, lesson progress checklist)
/profile              → User profile settings (avatar, bio, details)
/admin                → Admin dashboard (approve pending instructors list)
```

---

## Core User Flow

### 1. Registration & Approval
- A user signs up and selects either the Student or Instructor role.
- If registering as a **Student**, the account is auto-approved and they can login immediately.
- If registering as an **Instructor**, the account is locked in a pending state (`isApproved: false`). They must wait for an Admin to approve them.
- Once approved by an Admin via the admin panel, the Instructor can login and create courses.

### 2. Student Course Discovery & Enrollment
- Students search, sort (by price, rating, date created), and filter (by category, level) the course directory.
- Clicking on a course opens its overview page showing description, curriculum list, instructor bio, and user reviews.
- Students click "Enroll" to register for the course (only allowed for published courses).
- Enrollment increases the course `enrollCount` and adds it to the student's dashboard.

### 3. Classroom & Study Progress
- In the classroom, the student watches lesson videos.
- Free lessons are public to everyone. Paid lessons are guarded and require course enrollment or instructor ownership.
- Students can toggle the completion checkbox on any lesson. This updates their progress percentage atomically in a transaction.
- Completing 100% of the lessons marks the enrollment completion date.

### 4. Course Reviews & Feedback
- Students can submit a single review (rating 1-5 stars and optional comment) per enrolled course.
- Submitting a review recalculates the course `avgRating` inside a PostgreSQL database transaction.
- Database-level unique constraints prevent a student from reviewing a course multiple times.

---

## Features In Scope

- JWT authentication with secure HttpOnly cookies (or session header tokens).
- Dynamic role-based guard routing (`RolesGuard`, `JwtAuthGuard`, `OptionalJwtAuthGuard`).
- Safe user type serialization to prevent password leaks.
- Paginated catalog search with debounced text search, level and category filters, and sorting parameters.
- Admin dashboard to view and approve pending instructor signups.
- Instructor course creator (create courses/lessons, edit curriculum structure, manage draft/published status).
- Classroom environment with sidebar lesson navigator, video player, and real-time progress update sync.
- Student dashboard displaying enrolled courses list, progress bars, and total study hours calculated from completed lesson durations.
- Instructor dashboard showing courses count, total enrolled students, and average rating across all taught courses.
- Double-submission protection on course reviews via database unique constraints.

---

## Features Out of Scope

- Real-time video streaming setup (standard file uploads and links only).
- Direct credit card processing or payment gateway integration (enrollment is simulated free or manual).
- Interactive messaging boards or Q&A channels inside the classroom.
- Multi-instructor courses (single instructor per course only).
- Live browser video recording or direct video transcoding.
- Email sign-up verification or push notification subscriptions.
- Team or organization plans.
- Student certificates of completion PDF generation.

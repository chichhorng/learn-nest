# UI Registry

Registry mapping of Angular frontend routes, component classes, and API service bindings.

---

## 1. Feature Components & Routes

| Path               | Component Class                 | Purpose                                           |
| ------------------ | ------------------------------- | ------------------------------------------------- |
| `/`                | `HomeComponent`                 | Platform homepage, features list, CTAs            |
| `/login`           | `LoginComponent`                | User login form                                   |
| `/register`        | `RegisterComponent`             | Account creation (Student / Instructor roles)     |
| `/dashboard`       | `DashboardComponent`            | Main stats and enrollment dashboard               |
| `/courses`         | `CourseListComponent`           | Paginated course catalog (Search, Filters, Sort)  |
| `/courses/:id`     | `CourseDetailComponent`         | Syllabus, instructor profile, reviews listing     |
| `/classroom/:id`   | `ClassroomComponent`            | Video player and lesson completion checklist      |
| `/profile`         | `ProfileComponent`              | User avatar, bio, and account configurations      |
| `/admin`           | `AdminPanelComponent`           | Admin view to approve pending instructor accounts |

---

## 2. Core API Services

- **`AuthService`**: Manages registration, logins, JWT storage, profile updates, and active user context signals.
- **`CourseService`**: Handles searching, detail loading, and instructor course creation/updates.
- **`LessonService`**: Handles lesson media loading and management.
- **`EnrollmentService`**: Tracks course signups, progress percentage ticks, and lesson completed list updates.
- **`ReviewService`**: Handles review submission.

---

## 3. Global Layout Components

- **`NavbarComponent`**: Implements the top navigation bar with dynamic routes adapting to authentication and role state signals.
- **`FooterComponent`**: Renders standard copyright info and platform metadata.


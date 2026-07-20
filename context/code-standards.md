# Code Standards

Implementation rules and conventions for the entire project. The AI agent must follow these in every session without exception. These rules prevent pattern drift across sessions.

---

## Engineering Mindset

The AI agent on this project operates as a senior engineer. This means:

- **Think before implementing** — understand what is being built and why before writing a single line.
- **Read context files first** — never assume, always verify against `architecture.md` and `project-overview.md`.
- **Scope is sacred** — only build what the current feature requires. Never go beyond scope even if it seems helpful.
- **Every feature must be testable** — if it cannot be verified immediately after implementation, it is incomplete.
- **Clean over clever** — simple readable code that a junior developer can understand is always preferred over clever abstractions.
- **One thing at a time** — complete one feature fully before touching the next.
- **Failures are expected** — wrap agent operations in try/catch, log failures, never let one failure crash everything.

---

## TypeScript

- Strict mode enabled in `tsconfig.json` — no exceptions.
- Never use `any` — use `unknown` and narrow the type, or define specific interfaces/types.
- Never use type assertions (`as SomeType`) unless absolutely necessary (like casting roles for ESLint enum checks) and comment why.
- All function parameters and return types must be explicitly typed.
- Use `type` for object shapes and unions — use `interface` only for extendable models/props.
- All async functions must have proper error handling — never let promises float unhandled.
- Use `const` by default — only use `let` when reassignment is necessary.

---

## NestJS (Backend) Conventions

- **Constructor injection** — never instantiate service classes manually inside controllers or other services.
- **Module boundaries** — feature code must live in its respective feature folder (e.g. `src/auth/`, `src/courses/`).
- **Prisma queries** — write database operations inside services, not controllers.
- **Validation** — always create and bind DTO classes decorated with `class-validator` rules. Never map raw `@Body` values directly in routes.
- **Access Control** — bind `JwtAuthGuard` and `RolesGuard` at the controller or route level.
- **Atomic Operations** — use `$transaction` block when performing multiple database writes (e.g., creating reviews and updating course `avgRating` together, or incrementing `enrollCount` during registration).
- **Error management** — map errors to appropriate NestJS built-in HTTP exceptions (e.g., `NotFoundException`, `ForbiddenException`, `BadRequestException`).

---

## Angular (Frontend) Conventions

- **Standalone components** — use standalone components for pages, layouts, and shared widgets, eliminating boilerplate Angular modules.
- **Signals-first state** — use Angular Signals (`signal()`, `computed()`) for reactive component state management. Use RxJS Observables (`HttpClient`) for API data streams and convert them to signals using `toSignal()` when binding to templates.
- **Component communication** — use Signal-based inputs (`input()`) and outputs (`output()`) for parent-child communication.
- **Dependency Injection** — inject services using the constructor injection syntax.
- **HTTP Interceptor** — attach the JWT authentication token automatically to all outgoing HTTP requests using an Angular functional HTTP interceptor.
- **Route Guards** — guard pages using functional router guards (e.g., `authGuard`, `roleGuard`).

---

## File and Folder Naming

### Backend (NestJS)
- Folders: kebab-case — `dto`, `strategies`
- Source files: kebab-case with standard suffix:
  - Controllers: `name.controller.ts`
  - Services: `name.service.ts`
  - Modules: `name.module.ts`
  - DTOs: `name.dto.ts`
  - Guards: `name.guard.ts`

### Frontend (Angular)
- Folders: kebab-case — `shared`, `core`, `features`
- Source files: kebab-case with standard suffix:
  - Components: `name.component.ts`, `name.component.html`, `name.component.css`
  - Services: `name.service.ts`
  - Guards: `name.guard.ts`
  - Interceptors: `name.interceptor.ts`
  - Routes: `name.routes.ts`

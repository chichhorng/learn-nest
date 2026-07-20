<!-- BEGIN:angular-agent-rules -->

# This is Angular 21 (Standalone Components)

This project runs on Angular 21. Standalone components are the default (no NgModules). State management is managed primarily through Angular Signals (`signal()`, `computed()`). APIs, conventions, and configuration differ from older Angular versions.

<!-- END:angular-agent-rules -->

## Read Before Anything Else

Read in this exact order before any implementation:

1. context/project-overview.md
2. context/architecture.md
3. context/ui-tokens.md
4. context/ui-rules.md
5. context/ui-registry.md
6. context/code-standards.md
7. context/library-docs.md
8. context/build-plan.md
9. context/progress-tracker.md

## Rules That Never Change

- Never use hardcoded hex values or raw Tailwind color classes. Always use shadcn CSS variables (e.g. `bg-primary`, `border-border`, `text-muted-foreground`).
- Maintain standalone components by importing all necessary directives (e.g., `RouterLink`, `CommonModule`) inline in the `@Component` decorator.
- Use Signals-first logic for local state, and functional HTTP interceptors for automatic JWT header passing.
- Update `progress-tracker.md` and `ui-registry.md` after completing every feature.
- Before importing any third-party library, load its installed skill first, then read `context/library-docs.md` for project-specific conventions.
- If the same problem persists after one failed correction, stop immediately and run `/recover`.

## Available Skills

- `/architect` — before any complex feature. Think before building.
- `/imprint` — after any new UI component. Capture patterns.
- `/review` — before demo or when something feels off.
- `/recover` — when something breaks after one failed correction.
- `/remember save` — when a feature spans multiple sessions.
- `/remember restore` — when returning after a multi-session feature.
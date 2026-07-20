# Library Documentation

Durable guidelines for using third-party libraries installed in the project. These rules prevent pattern drift and misuse of library APIs.

---

## Prisma Client (Backend Database)

Used for database queries, relations, and transactions.

### Rules:
- Never initialize PrismaClient manually (no `new PrismaClient()`). Use `PrismaService` from `@/lib/database/prisma.service`.
- Always wrap multiple dependent database updates in a `$transaction`.
- Avoid full entity selections where only a subset of fields is required (e.g. catalog listing should select specific lightweight fields, omitting content details).
- Handle database constraints gracefully by wrapping critical operations (like double-reviewed courses or unique username signups) in try/catch and mapping to bad request or conflict exceptions.

### Common Patterns:

```typescript
// Transactional aggregate update
return this.prisma.$transaction(async (tx) => {
  const review = await tx.review.create({ data });
  const aggregate = await tx.review.aggregate({
    where: { courseId },
    _avg: { rating: true },
  });
  await tx.course.update({
    where: { id: courseId },
    data: { avgRating: aggregate._avg.rating || 0 },
  });
  return review;
});
```

---

## Class Validator (Backend Validation)

Used to validate incoming client request payloads inside DTOs.

### Rules:
- Apply `@IsString()`, `@IsEmail()`, `@IsInt()`, `@IsBoolean()`, `@IsOptional()`, `@IsEnum()` decorators to properties in DTO classes.
- Use `@Min()` and `@Max()` constraints where necessary (such as review rating between 1 and 5).
- Ensure global `ValidationPipe` in `main.ts` is configured with `whitelist: true`, `forbidNonWhitelisted: true`, and `transform: true`.

---

## Passport JWT (Backend Security)

Used to secure endpoints and authenticate requests.

### Rules:
- Inherit strategies from `@nestjs/passport`.
- Extract authorization headers as bearer tokens (`ExtractJwt.fromAuthHeaderAsBearerToken()`).
- Verify expiration dates (`ignoreExpiration: false`).

---

## Tailwind CSS (Frontend Design)

Utility-first CSS framework used for frontend styling.

### Rules:
- Declare all colors, spacing, and typography tokens in `styles.css` using theme variables.
- Always use semantic classes for layouts (e.g. Flexbox/CSS Grid classes like `flex`, `grid`, `gap-4`).
- Support theme colors by applying utility classes that match variables rather than static hex classes.

---

## Angular HTTP Client (Frontend API Calls)

The primary library to perform asynchronous calls to the backend NestJS service.

### Rules:
- Always inject `HttpClient` into Angular services, never call fetch directly.
- Convert raw API observable streams to Angular Signals using `toSignal()` or subscribe to them reactively.
- Define explicit typescript response interfaces for all API endpoints.

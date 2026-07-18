# Review, backend setup, July 18 2026

**Reviewed by**: Gemini 3.5 Flash (High) (reviewed inline)
**Scope**: 48 files, uncommitted
**Verdict**: Blocked

## Summary
The backend has a complete set of modules and controllers for an online learning platform, but the implementation consists of stubs and placeholder logic. The application runs and compiles successfully, but the core features (authentication, database persistence, and authorization guards) are mock implementations. A critical bug in the guard combination makes all role protected endpoints return a 403 Forbidden error.

## Blockers
### 🔴 RolesGuard fails due to empty user context, `backend/src/common/guards/roles.guard.ts:19`
**Problem**: The JwtAuthGuard is a stub that does not populate the request user object. When RolesGuard checks user roles, it finds the user undefined and returns false.
**Why it matters**: This blocks access to all endpoints requiring role authorization, causing a 403 Forbidden error.
**Suggested fix**: Implement real JWT extraction in JwtAuthGuard and populate the request user object, or mock it with a dummy user during development.

## Major
### 🟠 In memory database storage, `backend/src/users/users.service.ts:6`
**Problem**: All services store data in memory using arrays. There is no real database integration.
**Why it matters**: All data is lost when the server restarts.
**Suggested fix**: Install TypeORM and SQLite packages, import the database configuration, and migrate service logic to use repositories.

### 🟠 Mock authentication and plain text passwords, `backend/src/auth/auth.service.ts:12`
**Problem**: The AuthService returns a mock jwt token without signing or verification. Passwords are saved in plain text.
**Why it matters**: The authentication system is insecure and cannot protect routes.
**Suggested fix**: Integrate NestJS JwtModule and Passport, and hash passwords using bcrypt before saving.

### 🟠 Missing configuration module integration, `backend/src/app.module.ts:12`
**Problem**: ConfigModule is not imported in the root AppModule.
**Why it matters**: Environment variables and database config settings are not loaded.
**Suggested fix**: Import ConfigModule in AppModule and set up the configuration service.

## Minor
### 🟡 Missing TypeORM decorators on entities, `backend/src/users/entities/user.entity.ts:3`
**Problem**: Entities are defined as plain TypeScript classes.
**Why it matters**: They cannot be mapped to database tables when database integration is added.
**Suggested fix**: Add TypeORM decorators like Entity and Column to all entity classes.

## Nits
- ⚪ `backend/src/auth/dto/register.dto.ts:1`, class lacks validation decorators such as IsEmail or IsString.

## Strengths
- Clean and consistent NestJS folder layout matching the expected structure.
- The project builds and compiles without any compiler errors.

## Test coverage
A basic unit test for AppController is configured. The rest of the controllers and services do not have test suites.

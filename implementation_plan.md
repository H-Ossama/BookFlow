# Implement Authentication & Authorization System (JWT + Google OAuth + RBAC)

This task will implement the complete authentication and role-based access control (RBAC) flows for both the Express backend and React frontend. This forms the security foundation of the BookingHub SaaS platform.

## User Review Required

> [!IMPORTANT]
> **Token Storage Strategy**: In the proposed design, we store the Access Token in-memory (in React state) and store the Refresh Token in an HTTP-only, secure, `SameSite=Lax` cookie. This prevents XSS attacks from reading the refresh token and CSRF from causing unauthorized mutations.
>
> **Multi-Tenant Context on Signup**: When a user signs up as a `COMPANY_ADMIN`, they must create a Company/Tenant profile concurrently. In contrast, registering as a `CUSTOMER` does not associate them with a specific tenant, allowing them to browse and book across different businesses.

## Open Questions

> [!IMPORTANT]
> **Google OAuth Configuration**: Do you have a Google Cloud Developer Console project set up, or should we use placeholder credentials (`GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`) in `.env` for now and mock passport/google behavior for sandbox testing? (Recommended: placeholder credentials + mocked redirect route for easy testing).

---

## Proposed Changes

### Backend Security Foundation

We will implement the database queries, password hashing, JWT token creation, and schema-level verification.

#### [MODIFY] [errors.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/utils/errors.ts)
- Implement base custom `AppError` and subclassed HTTP error helpers (`UnauthorizedError`, `ForbiddenError`, `ConflictError`, `ValidationError`, `NotFoundError`).

#### [MODIFY] [auth.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/config/auth.ts)
- Configure JWT secrets, expiry values, and Google Passport OAuth strategies.

#### [MODIFY] [auth.repository.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/repositories/auth.repository.ts)
- Add database methods to find users by email, find users by ID, find users by Google ID, and create new users (with optional Company association for admins).

#### [MODIFY] [auth.validator.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/validators/auth.validator.ts)
- Write Zod validation schemas for `/register` (both client and tenant modes), `/login`, `/forgot-password`, and `/reset-password`.

#### [MODIFY] [auth.service.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/services/auth.service.ts)
- Implement password hashing (bcrypt), token issuance (access/refresh), token refreshing, email verification triggers, and password reset procedures.

---

### Backend Middlewares & Routing

We will restrict access to routing endpoints based on verified JWTs and the user's role.

#### [MODIFY] [auth.middleware.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/middlewares/auth.middleware.ts)
- Implement token extraction from the `Authorization: Bearer <token>` header, verification, and request attachment of the current user.

#### [MODIFY] [rbac.middleware.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/middlewares/rbac.middleware.ts)
- Create `checkRole(allowedRoles: Role[])` middleware that checks `req.user.role` against authorized list.

#### [MODIFY] [auth.controller.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/controllers/auth.controller.ts)
- Connect endpoints to `AuthService` handling cookies, tokens, and unified API responses.

#### [MODIFY] [auth.routes.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/backend/src/routes/auth.routes.ts)
- Wire routing paths `/register`, `/login`, `/refresh-token`, `/logout`, `/verify-email`, `/forgot-password`, `/reset-password` with appropriate validators.

---

### Frontend Core Auth Context

We will handle storing authentications, token refreshes, and guarding specific application zones.

#### [MODIFY] [client.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/frontend/src/api/client.ts)
- Implement Axios request interceptor to attach bearer token.
- Add response interceptor to handle `401 Unauthorized` by automatically attempting `/auth/refresh-token` and retrying the failed request.

#### [MODIFY] [auth.api.ts](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/frontend/src/api/auth.api.ts)
- Connect frontend calls to backend auth endpoints.

#### [MODIFY] [AuthContext.tsx](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/frontend/src/context/AuthContext.tsx)
- Manage `user`, `accessToken`, `isAuthenticated`, and `isLoading` states.
- Support login, signup, logout actions, and initial session recovery check on mount.

#### [NEW] [ProtectedRoute.tsx](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/frontend/src/components/common/ProtectedRoute.tsx)
- Create component to restrict route access based on authentication state and role.

---

### Frontend Auth UI Views (Refined Luxury Theme)

We will design a striking, high-converting onboarding experience matching a luxury salon vibe: deep muted slate/black backgrounds, bronze-gold accents, smooth transitions, and distinct onboarding paths (Business vs Customer).

#### [MODIFY] [LoginPage.tsx](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/frontend/src/pages/auth/LoginPage.tsx)
- Build a beautiful, responsive Login form with validation, errors, loading state, Google login button, and a premium aesthetic layout.

#### [MODIFY] [RegisterPage.tsx](file:///c:/Users/H_Oussama/Desktop/Programing/Barber_shop/frontend/src/pages/auth/RegisterPage.tsx)
- Build a responsive Sign-up form supporting customer registration and company onboarding (which asks for business name/slug).

---

## Verification Plan

### Automated Tests
- Run `npm run test` inside the backend directory to ensure existing tests pass.
- Write unit tests for `AuthService` covering register, login, and jwt issuance.

### Manual Verification
1. Run local postgres and redis.
2. Launch Express server on port 5000 and Vite on port 3000.
3. Verify successful customer registration via UI.
4. Verify company admin registration (tenant and user record creation).
5. Verify login, refresh token behavior on access token expiration, and secure route access based on role.

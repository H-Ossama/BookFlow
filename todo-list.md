# BookingHub — Full Project Checklist

> **Status:** Phases 1-10 complete.

---

## Phase 1 — Company & Service Management

### Backend — Company CRUD
- [x] `company.validator.ts` — Zod schemas for create/update company (name, slug, logo, description, phone, email, address)
- [x] `company.service.ts` — Business logic: create, update, get by slug, list public companies
- [x] `company.controller.ts` — Request handlers with proper error handling
- [x] `company.routes.ts` — Wire routes (`GET /companies`, `GET /companies/:slug`, `PATCH /companies/:id` — admin only)
- [ ] Add company logo upload endpoint (Multer in `upload.middleware.ts`)

### Backend — Service CRUD
- [x] `service.repository.ts` — CRUD methods scoped by `companyId`
- [x] `service.service.ts` — Business logic, verify company ownership
- [x] `service.controller.ts` — Handlers with pagination, filtering by company
- [x] `service.validator.ts` — Schemas for create/update (name, duration, price, color, isActive)
- [x] `service.routes.ts` — `GET /services?companyId=`, `POST /services`, `PATCH /services/:id`, `DELETE /services/:id`

### Frontend — Company Pages
- [x] Company list page (public browsing at `/companies`)
- [x] Company detail/settings page
- [ ] Logo upload UI (deferred)

### Frontend — Services Management
- [x] Services list page (company admin view)
- [x] Create/edit service modal or form
- [x] Service card in booking flow (shown during booking steps)

---

## Phase 2 — Employee Management

### Backend — Employee CRUD
- [x] `employee.repository.ts` — CRUD scoped by company
- [x] `employee.service.ts` — Create employee (links to User, returns temp password), update, list
- [x] `employee.controller.ts` — Handlers
- [x] `employee.validator.ts` — Schemas (userId, bio, specialties, isActive)
- [x] `employee.routes.ts` — `GET /employees?companyId=`, `POST /employees`, `PATCH /employees/:id`

### Backend — Working Hours & Vacations
- [x] `working-hours` sub-routes — Set weekly schedule per employee
- [x] `vacation-days` sub-routes — Block specific dates
- [x] Validation: valid dayOfWeek (0-6), valid time format (HH:mm)

### Frontend — Employee Management
- [x] Employee list page (company admin)
- [x] Create/edit employee form
- [x] Working hours editor (weekly grid)
- [x] Vacation day picker (add/remove in employee management)

---

## Phase 3 — Booking Engine

### Backend — Booking CRUD
- [x] `booking.repository.ts` — Create, list, update status, cancel
- [x] `booking.validator.ts` — Schema with conflict prevention fields
- [x] `booking.service.ts` — Core booking logic:
  - [x] Conflict detection (no overlapping bookings for same employee at same time)
  - [x] Check employee working hours
  - [x] Check vacation days
  - [x] Check holidays
  - [x] Calculate endTime from service duration + startTime
  - [x] Booking status flow: PENDING → CONFIRMED → COMPLETED / CANCELLED
- [x] `booking.controller.ts` — Handlers with pagination, status filtering
- [x] `booking.routes.ts` — `POST /bookings`, `GET /bookings`, `PATCH /bookings/:id/status`, `DELETE /bookings/:id`

### Backend — Availability Slots (read-only endpoint)
- [x] `GET /availability?companyId=&employeeId=&date=` endpoint
- [x] Algorithm: fetch working hours → subtract existing bookings → subtract breaks → return free slots

### Frontend — Booking Flow (Customer)
- [x] Step 1: Select Business (company slug route `/book/:slug`)
- [x] Step 2: Select Service (from company's services)
- [x] Step 3: Select Employee (filtered by company)
- [x] Step 4: Select Date (date picker)
- [x] Step 5: Select Time (from availability slots)
- [ ] Step 6: Confirm & Pay (Stripe sandbox)

### Frontend — Booking Management (Admin/Employee)
- [x] Calendar view (monthly grid with List/Calendar toggle)
- [x] Booking list with status filters
- [x] Accept / Reject / Complete booking buttons
- [x] Cancel booking (with reason)
- [x] Drag & drop rescheduling (drag booking pills between days)

---

## Phase 4 — Dashboard & Analytics

### Backend — Analytics
- [x] `analytics.repository.ts` — Aggregation queries:
  - [x] Today's bookings count
  - [x] Weekly / monthly revenue
  - [x] Top employee by bookings
  - [x] Most popular service
  - [x] Cancellation rate
- [x] `analytics.service.ts` — Date range calculations
- [x] `analytics.controller.ts` — Return stats for company dashboard
- [x] `analytics.routes.ts` — `GET /analytics/dashboard`

### Frontend — Dashboard
- [x] Stats cards (today's bookings, revenue, top employee, cancellation rate)
- [x] Popular services bar chart (Recharts)
- [x] Top employees pie chart (Recharts)
- [x] Recent bookings table
- [x] Date range filter (frontend wired with Apply/Reset)

---

## Phase 5 — Notifications

### Backend — Notification System
- [x] `notification.repository.ts` — Create, list by user, mark read
- [x] `notification.service.ts` — Trigger on booking events:
  - [x] Email: booking confirmation via Nodemailer (send on create/confirm/cancel)
  - [x] In-app: notification record in DB
  - [ ] (Optional) Real-time via WebSocket + Redis pub/sub
- [x] `notification.controller.ts` — List notifications, mark as read
- [x] `notification.routes.ts` — `GET /notifications`, `PATCH /notifications/:id/read`, `PATCH /notifications/read-all`

### Frontend — Notification UI
- [x] Notification bell icon in header
- [x] Notification dropdown/modal
- [x] Unread badge count
- [x] Mark as read / mark all read

---

## Phase 6 — Subscription & Billing

### Backend — Subscription Logic
- [x] `subscription.service.ts` — Plan enforcement:
  - [x] Check booking limits (Free = 5/month)
  - [x] Upgrade/downgrade plan
  - [ ] Stripe webhook handling (requires Stripe account):
    - [ ] `invoice.payment_succeeded`
    - [ ] `customer.subscription.updated`
    - [ ] `customer.subscription.deleted`
- [x] `subscription.controller.ts` — List plans, get current plan, change plan
- [x] `subscription.routes.ts` — `GET /plans`, `GET /current`, `PATCH /change`

### Frontend — Subscription UI
- [x] Pricing page (`/pricing`)
- [x] Dashboard subscription management (`/dashboard/subscription`)
- [x] Current plan card with usage meter
- [x] Upgrade/downgrade flow
- [ ] (Sandbox) Stripe checkout integration

---

## Phase 7 — Reviews & Ratings

### Backend — Review CRUD
- [x] `review.repository.ts` — Create, list by company
- [x] `review.validator.ts` — Rating (1-5), comment optional
- [x] `review.service.ts` — Verify booking belongs to customer, prevent duplicate reviews
- [x] `review.controller.ts` — Handlers
- [x] `review.routes.ts` — `POST /reviews`, `GET /reviews?companyId=`

### Frontend — Review UI
- [x] Star rating display
- [x] Review list on company dashboard (`/dashboard/reviews`)
- [x] Average rating with distribution bar
- [x] Write review form (after completed booking) — star rating modal in CustomerBookings

---

## Phase 8 — Coupons & Promo Codes

### Backend — Coupon CRUD
- [x] `coupon.repository.ts` — CRUD, validate coupon code
- [x] `coupon.validator.ts` — Code, discount %, maxUses, expiresAt
- [x] `coupon.service.ts` — Validate code (active, not expired, under max uses)
- [x] `coupon.controller.ts`
- [x] `coupon.routes.ts` — `POST /coupons`, `GET /coupons`, `PATCH /coupons/:id`

### Frontend — Coupon UI
- [x] Coupon input in booking flow (coupon code field in BookingPage step 3)
- [x] Admin coupon management page (`/dashboard/coupons`) — list, create, toggle active
- [x] Discount display in booking detail (backend returns discountAmount/coupon)

---

## Phase 9 — Reporting & Export

### Backend — Export Endpoints
- [x] `GET /report/bookings/csv`, `/excel`, `/pdf`
- [x] `GET /report/revenue/csv`, `/pdf`
- [x] `GET /report/customers/csv`
- [x] Uses `csv-writer`, `exceljs`, `pdfkit`

### Frontend — Report UI
- [x] Reports page (`/dashboard/reports`) with date range picker
- [x] Download buttons (CSV / Excel / PDF) for bookings, revenue, customers

---

## Phase 10 — Polish & Production Readiness

### Backend Hardening
- [x] Rate limiting per endpoint (auth: 20/15min, general API: 200/15min)
- [x] Input sanitization (helmet CSP + express.json limit 10kb)
- [x] Request logging with Morgan (already enabled)
- [x] CORS restrict to production frontend URL
- [x] Environment variable validation on startup (`config/env.ts` — fail fast)
- [x] Helmet Content-Security-Policy configured

### Frontend Hardening
- [x] Loading skeletons (`Skeleton`, `TableSkeleton`, `StatsSkeleton` components)
- [x] Empty states (`EmptyState` component with icon + action)
- [x] Error boundaries per dashboard route (`ErrorBoundary` wrapping each page)
- [x] 404 page (`NotFoundPage` with styled UI)
- [x] 403 / unauthorized page (`UnauthorizedPage`)
- [ ] Responsive design audit (deferred)
- [ ] Accessibility audit (deferred)

### Testing
- [ ] Backend unit tests (deferred)
- [ ] Backend integration tests (deferred)
- [ ] Frontend component tests (deferred)
- [ ] E2E tests (deferred)

### DevOps
- [x] `Dockerfile` for frontend (production build + nginx serve)
- [x] `Dockerfile` for backend (multi-stage build, already existed)
- [x] `docker-compose.yml` (already exists with postgres, redis, backend, frontend, nginx)
- [ ] GitHub Actions CI pipeline (deferred)

### Documentation
- [x] Swagger/OpenAPI annotations on booking routes + report routes
- [ ] Postman collection export (deferred)
- [ ] Deployment guide in README (deferred)
- [x] Environment variable reference updated in `.env.example`

### Deployment
- [ ] Frontend deploy to Vercel (deferred)
- [ ] Backend deploy to Railway / Render / DigitalOcean (deferred)
- [ ] Database: Neon PostgreSQL (deferred)
- [ ] Redis: Upstash / Redis Cloud (deferred)
- [ ] Custom domain + SSL (deferred)
- [ ] Monitoring setup (deferred)

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ [x] | Done |
| [ ] | Not started |

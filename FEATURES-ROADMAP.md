# BookFlow — Feature Roadmap

> All incomplete, placeholder, and planned features across the codebase.
> Last audit: July 2026

---

## 1. Internationalization (i18n / Multi-Language)

**Status: ❌ Not started**

No i18n library or setup exists anywhere in the project.

### Required work
- [ ] Choose library (recommended: `react-i18next` + `i18next`)
- [ ] Create locale files (`en.json`, `fr.json`, `ar.json`, etc.)
- [ ] Wrap app in `I18nextProvider`
- [ ] Replace all hardcoded UI strings with `t()` calls
- [ ] Add language switcher to Header + auth pages
- [ ] Backend: accept `Accept-Language` header, localize validation errors
- [ ] Persist locale choice in user profile + localStorage

---

## 2. Website Builder

**Status: 🟡 Framework exists, needs completion**

### Files
- `frontend/src/components/website-builder/*.tsx` (7 files)
- `backend/src/routes/website.routes.ts` (exists)
- `frontend/src/pages/company/WebsiteBuilder.tsx`

### What's done
- Section renderers (hero, services, about, gallery, testimonials, contact, stats, header, footer, features, cta)
- Theme panel (colors, fonts, border radius, button style, animations)
- Drag-and-drop canvas (reorder sections)
- Section library panel
- Preview frame
- Live preview toggle
- Publish/publish API integration

### What's missing
- [ ] AI section generation ("AI placeholder" in WebsiteBuilder.tsx:184)
- [ ] Image upload flow (currently only URL input, no upload widget)
- [ ] Mobile responsive preview toggle
- [ ] Section duplication
- [ ] Undo/redo history
- [ ] Autosave drafts
- [ ] Custom CSS injection
- [ ] SEO meta tags editor (title, description, og:image)
- [ ] Domain custom domain linking
- [ ] Section animations on scroll
- [ ] Contact form submissions storage + export
- [ ] Analytics (page views, form submissions)
- [ ] Gallery — image reordering + lightbox
- [ ] Menu / navigation configuration

---

## 3. Calendar & Scheduling

**Status: 🟡 Component shells exist, no implementation**

Placeholder components at `frontend/src/components/calendar/`:
- `CalendarView.tsx` — TODO
- `DayView.tsx` — TODO
- `WeekView.tsx` — TODO
- `TimeSlot.tsx` — TODO

### Required work
- [ ] Implement full calendar with daily/weekly/monthly views
- [ ] Drag-and-drop time slot management
- [ ] Real-time availability updates (WebSocket or polling)
- [ ] Buffer time handling between appointments
- [ ] Recurring availability patterns
- [ ] Blocked time / vacation slots
- [ ] Overlapping booking prevention
- [ ] Calendar sync (Google Calendar, Outlook, iCal)

---

## 4. Booking Components (Customer-Facing Wizard)

**Status: 🟡 Component shells exist, partial implementation**

Placeholder components at `frontend/src/components/booking/`:
- `BookingWizard.tsx` — TODO
- `ServiceSelect.tsx` — TODO
- `EmployeeSelect.tsx` — TODO
- `DatePicker.tsx` — TODO
- `TimeSlotPicker.tsx` — TODO
- `BookingCard.tsx` — TODO
- `BookingConfirmation.tsx` — TODO

The main `BookingPage.tsx` at `frontend/src/pages/public/BookingPage.tsx` is partially implemented (shows list of companies).

### Required work
- [ ] Implement full multi-step booking wizard
- [ ] Service selection → employee selection → date/time → confirmation
- [ ] Real-time availability check
- [ ] Coupon code application (input exists, backend may be partial)
- [ ] Customer notes (textarea exists)
- [ ] Email/SMS confirmation after booking
- [ ] Google Calendar "Add to Calendar" link

---

## 5. Customer Dashboard Pages

**Status: 🔴 Placeholder / not implemented**

| Page | File | Status |
|---|---|---|
| Customer Dashboard | `pages/customer/CustomerDashboard.tsx` | TODO placeholder |
| Customer Profile | `pages/customer/CustomerProfile.tsx` | TODO placeholder |
| Customer Bookings | `pages/customer/CustomerBookings.tsx` | Done (fully implemented) |

### Required work
- [ ] Customer Dashboard — overview of upcoming bookings, recent activity, quick actions
- [ ] Customer Profile — edit personal details, avatar, password, notification preferences
- [ ] Customer Settings — language, timezone, email notifications

---

## 6. Employee Dashboard Pages

**Status: 🔴 All placeholders**

| Page | File | Status |
|---|---|---|
| Employee Dashboard | `pages/employee/EmployeeDashboard.tsx` | TODO placeholder |
| Employee Bookings | `pages/employee/EmployeeBookings.tsx` | TODO placeholder |
| Employee Schedule | `pages/employee/EmployeeSchedule.tsx` | TODO placeholder |

### Required work
- [ ] Employee Dashboard — today's schedule, stats, quick links
- [ ] Employee Bookings — upcoming appointments with customer info
- [ ] Employee Schedule — weekly view, time-off requests, availability

---

## 7. Auth Pages (Incomplete)

| Page | File | Status |
|---|---|---|
| Forgot Password | `pages/auth/ForgotPasswordPage.tsx` | TODO placeholder |
| Reset Password | `pages/auth/ResetPasswordPage.tsx` | Needs backend endpoint verification |
| Verify Email | `pages/auth/VerifyEmailPage.tsx` | TODO placeholder |
| OAuth/SSO | Not started | Not present |

---

## 8. Business Public Pages

| Page | File | Status |
|---|---|---|
| Business Profile | `pages/public/BusinessPage.tsx` | TODO placeholder |
| Companies List | `pages/public/CompaniesListPage.tsx` | Done (listing + search) |

### Required work
- [ ] Business Profile page — public-facing company page with services, team, booking CTA
- [ ] Filtering on Companies List (by category, location)

---

## 9. Dashboard Components (Reusable Widgets)

**Status: 🟡 All shells**

Placeholder components at `frontend/src/components/dashboard/`:
- `StatsCard.tsx` — TODO
- `RevenueChart.tsx` — TODO
- `BookingsChart.tsx` — TODO
- `PopularServices.tsx` — TODO
- `RecentBookings.tsx` — TODO
- `TopEmployees.tsx` — TODO

Currently the `CompanyDashboard` component has all dashboard logic inlined (~480 lines). These should be extracted into the reusable widgets above.

---

## 10. Search

**Status: 🟡 Shell only**

- `frontend/src/components/common/SearchBar.tsx` — TODO placeholder
- Companies List page has inline search (works)
- Employee/service management pages have inline search (works)

### Required work
- [ ] Global search bar (companies, customers, bookings across the app)
- [ ] Backend full-text search endpoint

---

## 11. Common UI Components

**Status: 🟡 Shells**

| Component | File | Status |
|---|---|---|
| Avatar | `components/common/Avatar.tsx` | TODO placeholder |
| Rating | `components/common/Rating.tsx` | TODO placeholder |
| Pagination | `components/ui/Pagination.tsx` | Partially done |
| SearchBar | `components/common/SearchBar.tsx` | TODO placeholder |

---

## 12. Backend — Stubs / Missing Services

### Controllers & Services
| File | Status |
|---|---|
| `controllers/customer.controller.ts` | TODO — only stub methods |
| `services/customer.service.ts` | TODO — only stub methods |
| `repositories/customer.repository.ts` | TODO — only stub methods |
| `repositories/admin.repository.ts` | TODO — only stub methods |

### Middleware
| File | Status |
|---|---|
| `middlewares/rateLimiter.middleware.ts` | TODO — not implemented |
| `middlewares/upload.middleware.ts` | TODO — not implemented |

### Config
| File | Status |
|---|---|
| `config/stripe.ts` | TODO — not configured |
| `config/app.ts` | TODO — not configured |

### Types
| File | Status |
|---|---|
| `types/user.types.ts` | TODO |
| `types/service.types.ts` | TODO |
| `types/employee.types.ts` | TODO |
| `types/company.types.ts` | TODO |
| `types/booking.types.ts` | TODO |
| `types/common.types.ts` | TODO |

### Utilities
| File | Status |
|---|---|
| `utils/email.ts` | TODO — not implemented |
| `utils/upload.ts` | TODO — not implemented |
| `utils/pdf.ts` | TODO — not implemented |
| `utils/csv.ts` | TODO — not implemented |
| `utils/excel.ts` | TODO — not implemented |
| `utils/date.ts` | TODO — not implemented |
| `utils/pagination.ts` | TODO — not implemented |

### Validators
| File | Status |
|---|---|
| `validators/common.validator.ts` | TODO — not implemented |

### Routes
| File | Status |
|---|---|
| `routes/customer.routes.ts` | Partially implemented — "TODO: Add more routes" |

---

## 13. Subscription & Payments

**Status: 🟡 Partial**

- `frontend/src/api/subscriptions.api.ts` — TODO placeholder
- `SubscriptionPage.tsx` — UI exists
- Stripe config not set up (`backend/src/config/stripe.ts` — TODO)
- Pricing page (`PricingPage.tsx`) — done (UI)
- Coupons management — done (UI + backend)

### Required work
- [ ] Stripe integration (checkout session, webhooks)
- [ ] Subscription lifecycle (create, upgrade, downgrade, cancel)
- [ ] Invoice generation + history
- [ ] Payment method management
- [ ] Trial period handling

---

## 14. Notifications System

**Status: Done (can be enhanced)**

Bell component, notifications page, backend routes, polling hook all exist and work.

### Future enhancements
- [ ] Email notifications (send grid / SMTP integration)
- [ ] SMS notifications (Twilio)
- [ ] Push notifications (Service Worker)
- [ ] Notification preferences page (per-type toggle)
- [ ] Real-time delivery via WebSocket instead of polling

---

## 15. Testing

**Status: ❌ Not started**

No test files exist anywhere in the project.

### Required work
- [ ] Set up Vitest + React Testing Library
- [ ] Unit tests for hooks, utilities, API functions
- [ ] Component tests for key UI components
- [ ] Integration tests for auth flows
- [ ] API endpoint tests (backend)
- [ ] E2E tests (Playwright)

---

## 16. PWA / Offline Support

**Status: ❌ Not started**

No service worker, manifest, or offline support exists.

---

## 17. Docker & Deployment

**Status: Partial**

- `docker-compose.yml` exists (likely for postgres)
- No Dockerfile for the app itself
- No CI/CD pipeline

---

## 18. Documentation

**Status: ❌ Not started**

No README, API docs, or architectural documentation exists.

---

## 19. Analytics & Reporting

**Status: 🟡 Partial**

- Dashboard shows basic stats (bookings, revenue, ratings)
- Reports page (`ReportsPage.tsx`) — exists
- Backend `analytics.routes.ts` — exists

### Future enhancements
- [ ] Export reports (PDF, CSV, Excel) — utility stubs exist
- [ ] Custom date range comparisons
- [ ] Customer acquisition reports
- [ ] Employee performance analytics
- [ ] Revenue forecasting

---

## 20. Reviews System

**Status: 🟡 Partial**

- Reviews page (`ReviewsPage.tsx`) — exists
- Review submission on booking completion — not yet integrated
- Public testimonials section — exists in website builder

---

## 21. Websites (Customer Portal / Tenant Sites)

**Status: 🟡 Framework exists**

- Subdomain-based routing works (`getSlugFromSubdomain`)
- Customer portal pages exist (home, services, about, book, contact)
- Website builder renders sections

### Missing
- [ ] Custom domain DNS integration
- [ ] SSL certificate management
- [ ] Theme persistence across sessions
- [ ] Blog / news section type
- [ ] Online store / product listings
- [ ] Appointment types configuration

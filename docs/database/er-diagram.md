# Database Entity Relationship Diagram

This document outlines the core relational structure of the BookingHub platform.

```mermaid
erDiagram
    %% Core Entities
    COMPANY {
        uuid id PK
        string name
        string slug "Unique URL identifier"
        string email
        string phone
        string address
        string logoUrl
        jsonb settings
        datetime createdAt
        datetime updatedAt
    }

    USER {
        uuid id PK
        string email
        string passwordHash
        string firstName
        string lastName
        enum role "SUPER_ADMIN, COMPANY_ADMIN, EMPLOYEE, CUSTOMER"
        boolean isEmailVerified
        datetime createdAt
        datetime updatedAt
    }

    %% Tenant specific
    SERVICE {
        uuid id PK
        uuid companyId FK
        string name
        string description
        integer duration "Minutes"
        decimal price
        boolean isActive
        datetime createdAt
    }

    EMPLOYEE {
        uuid id PK
        uuid userId FK "Nullable if employee is not a system user"
        uuid companyId FK
        string firstName
        string lastName
        string position
        string avatarUrl
        boolean isActive
    }

    %% Availability & Scheduling
    WORKING_HOURS {
        uuid id PK
        uuid employeeId FK
        uuid companyId FK
        enum dayOfWeek "MONDAY..SUNDAY"
        time startTime
        time endTime
        boolean isDayOff
    }

    VACATION_DAY {
        uuid id PK
        uuid employeeId FK
        uuid companyId FK
        date date
        string reason
    }

    HOLIDAY {
        uuid id PK
        uuid companyId FK
        date date
        string name
    }

    %% Business Operations
    BOOKING {
        uuid id PK
        uuid companyId FK
        uuid userId FK
        uuid employeeId FK
        uuid serviceId FK
        datetime startTime
        datetime endTime
        enum status "PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW"
        decimal totalPrice
        text notes
        datetime createdAt
    }

    REVIEW {
        uuid id PK
        uuid companyId FK
        uuid userId FK
        uuid bookingId FK
        integer rating "1-5"
        text comment
        datetime createdAt
    }

    COUPON {
        uuid id PK
        uuid companyId FK
        string code
        decimal discountAmount
        enum discountType "PERCENTAGE, FIXED"
        datetime validFrom
        datetime validUntil
        integer maxUses
        integer currentUses
    }

    SUBSCRIPTION {
        uuid id PK
        uuid companyId FK
        string stripeCustomerId
        string stripeSubscriptionId
        enum tier "FREE, BASIC, PREMIUM"
        enum status "ACTIVE, PAST_DUE, CANCELED, INCOMPLETE"
        datetime currentPeriodEnd
    }

    NOTIFICATION {
        uuid id PK
        uuid companyId FK
        uuid userId FK
        string type
        string message
        boolean isRead
        datetime createdAt
    }

    %% Relationships
    COMPANY ||--o{ SERVICE : "offers"
    COMPANY ||--o{ EMPLOYEE : "employs"
    COMPANY ||--o{ BOOKING : "manages"
    COMPANY ||--o{ REVIEW : "receives"
    COMPANY ||--o{ COUPON : "issues"
    COMPANY ||--o{ SUBSCRIPTION : "has"
    COMPANY ||--o{ HOLIDAY : "observes"
    
    USER ||--o{ BOOKING : "makes"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o| EMPLOYEE : "can be"
    
    EMPLOYEE ||--o{ BOOKING : "fulfills"
    EMPLOYEE ||--o{ WORKING_HOURS : "has schedule"
    EMPLOYEE ||--o{ VACATION_DAY : "takes"
    
    SERVICE ||--o{ BOOKING : "included in"
    
    BOOKING ||--o| REVIEW : "gets"
```

## Table Descriptions

*   **COMPANY**: The core tenant record. All other entities (except User) are tied to a Company.
*   **USER**: Global users table. A user can be a customer of multiple companies, or an admin/employee of a specific company.
*   **SERVICE**: Services offered by a company (e.g., "Men's Haircut", "Beard Trim").
*   **EMPLOYEE**: Staff members who perform the services. They may or may not have a corresponding `USER` account for login.
*   **WORKING_HOURS**: Defines the regular weekly schedule for an employee.
*   **VACATION_DAY**: Specific dates an employee is not available, overriding regular working hours.
*   **HOLIDAY**: Company-wide closures.
*   **BOOKING**: The central transaction record linking a User, Employee, Service, and Company at a specific time.
*   **REVIEW**: Feedback left by a User after a completed Booking.
*   **COUPON**: Promotional codes created by a Company to offer discounts on Bookings.
*   **SUBSCRIPTION**: Tracks the SaaS billing state for a Company via Stripe integration.
*   **NOTIFICATION**: In-app alerts and records of sent communications to Users.

# BookingHub Deployment Guide

This document outlines the step-by-step process for deploying the BookingHub platform to production using modern cloud infrastructure.

## Prerequisites

Before beginning, ensure you have accounts with the following providers:
- **GitHub**: For source code hosting and CI/CD pipelines.
- **Vercel**: For frontend React/Next.js hosting.
- **Railway** or **Render**: For backend Node.js/Express API hosting.
- **Neon**: For Serverless PostgreSQL database hosting.
- **Upstash** or **Redis Cloud**: For managed Redis caching.
- **Stripe**: For subscription billing.
- **Domain Registrar**: (e.g., Namecheap, Cloudflare, GoDaddy) for custom domain configuration.

## 1. Database Setup (Neon PostgreSQL)

1. Log in to [Neon.tech](https://neon.tech) and create a new project named `bookinghub`.
2. Select your preferred region (choose one close to your backend server).
3. Retrieve the **Connection String** from the dashboard.
4. Keep the connection string secure; it will be used as the `DATABASE_URL` environment variable.

## 2. Redis Setup (Upstash)

1. Log in to [Upstash](https://upstash.com) and create a new Redis database.
2. Select a region matching your backend and database to minimize latency.
3. Enable TLS/SSL.
4. Copy the **Redis URL** (`rediss://...`) provided in the dashboard. This is your `REDIS_URL`.

## 3. Backend Deployment (Railway / Render)

### Option A: Railway
1. Connect your GitHub account to Railway.
2. Create a "New Project" and select "Deploy from GitHub repo".
3. Select the `BookingHub` repository. If it's a monorepo, specify the backend root directory.
4. Navigate to the **Variables** tab and add the necessary environment variables (see Section 5).
5. Railway will automatically detect the Node.js environment. Ensure your `package.json` has a `"start": "node dist/server.js"` and `"build": "tsc"` script.
6. Trigger a deployment. Railway will build and deploy your API.

### Option B: Render
1. Create a new "Web Service" in Render connected to your GitHub repo.
2. Set the Build Command: `npm install && npm run build`
3. Set the Start Command: `npm start`
4. Add environment variables.
5. Deploy.

## 4. Frontend Deployment (Vercel)

1. Connect your GitHub account to [Vercel](https://vercel.com).
2. Click "Add New..." -> "Project".
3. Import the `BookingHub` repository.
4. If using a monorepo, set the "Root Directory" to your frontend folder (e.g., `client` or `frontend`).
5. Vercel automatically detects Next.js or React (Vite/CRA).
6. In the "Environment Variables" section, add `VITE_API_URL` or `NEXT_PUBLIC_API_URL` pointing to your deployed backend URL (e.g., `https://api.bookinghub.com/api/v1`).
7. Click **Deploy**.

## 5. Environment Variables Configuration

### Backend (.env)
```env
PORT=5000
NODE_ENV=production

# Database
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# Redis
REDIS_URL="rediss://default:password@endpoint.upstash.io:30000"

# JWT Auth
JWT_ACCESS_SECRET="your_secure_access_secret_here"
JWT_REFRESH_SECRET="your_secure_refresh_secret_here"

# Stripe
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Nodemailer / Email Service
SMTP_HOST="smtp.sendgrid.net"
SMTP_PORT=587
SMTP_USER="apikey"
SMTP_PASS="your_sendgrid_api_key"
FROM_EMAIL="noreply@bookinghub.com"

# Client URL (for CORS)
CLIENT_URL="https://bookinghub.com"
```

### Frontend (.env)
```env
VITE_API_URL="https://api.bookinghub.com/api/v1"
```

## 6. Domain & SSL Setup

1. In your Vercel project settings, go to **Domains**.
2. Add your custom domain (e.g., `bookinghub.com`).
3. Follow the Vercel instructions to update your DNS records (A record or CNAME) in your domain registrar's dashboard. Vercel provisions free SSL certificates automatically via Let's Encrypt.
4. For the API, if you want a custom subdomain (e.g., `api.bookinghub.com`), add the domain in your Railway/Render settings and configure the CNAME record appropriately.

## 7. CI/CD Pipeline Explanation

The project uses GitHub Actions for Continuous Integration and Deployment (`.github/workflows/ci.yml`).

- **Trigger**: The pipeline runs on every push to the `main` branch and on Pull Requests targeting `main`.
- **Jobs**:
  1. **Linting**: Checks code quality using ESLint and Prettier.
  2. **Testing**: Spins up ephemeral PostgreSQL and Redis service containers. Runs Prisma migrations, then executes unit and integration tests (Jest) for the backend.
  3. **Build**: Verifies that both frontend and backend build successfully.
- **Deployment**: If the `main` branch pipeline passes successfully, Vercel and Railway/Render automatically trigger a new deployment via their GitHub integrations (Continuous Deployment). No manual deployment step is required.

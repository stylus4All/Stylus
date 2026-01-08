# Stylus — Vercel Deployment Guide

This short guide shows the exact Vercel dashboard steps and commands to deploy this repository's backend and frontend.

## What to deploy
- Backend: `backend/` (Node + Express + Prisma)
- Frontend: `frontend/` (Vite React app)

## Required environment variables (backend)
- `DATABASE_URL` — production DB connection string (required). Examples:
  - Postgres: `postgres://USER:PASSWORD@HOST:5432/DATABASE`
  - MySQL: `mysql://USER:PASSWORD@HOST:3306/DATABASE?sslaccept=strict`
  - (Local dev only) SQLite: `file:./prisma/dev.db` — NOT recommended on Vercel.
- `SHADOW_DATABASE_URL` — optional; required by some providers for Prisma Migrate (e.g., PlanetScale).
- `NODE_ENV` — set to `production`.
- `PORT` — optional if running a standalone server (Vercel serverless ignores this).

## Backend: Vercel dashboard steps (exact)
1. Go to the Vercel dashboard and click **New Project** → **Import Git Repository**.
2. Select this repository and on the _Configure Project_ screen:
   - For Backend deployment only: set **Root Directory** to `backend/`.
   - Framework Preset: **Other** (Node).
3. Under **Environment Variables**, add the following entries (select the environment: Preview/Production):
   - Key: `DATABASE_URL` — Value: your production DB URL
   - Key: `SHADOW_DATABASE_URL` — Value: (optional) shadow DB URL
   - Key: `NODE_ENV` — Value: `production`
   - (Optional) Key: `PORT` — Value: `4000`
4. Build & Output settings:
   - **Build Command** (recommended to run migrations at deploy):
     ```bash
     npm ci && npm run build && npx prisma generate && npx prisma migrate deploy
     ```
   - **Output Directory**: leave empty (Node server)
   - **Start Command**: `npm start`
5. Click **Deploy**.

Notes: running `npx prisma migrate deploy` during the build will apply migrations. Some teams prefer running migrations separately from deployment to avoid race conditions.

## Frontend: Vercel dashboard steps (exact)
1. Create a separate Vercel project or add another root for the frontend.
2. Set **Root Directory** to `frontend/`.
3. Environment variables (if frontend needs any API URL):
   - Example: `VITE_API_BASE_URL` = `https://your-backend.example.com/api`
4. Build Command: `npm ci && npm run build`
5. Output Directory: `dist`
6. Deploy.

## Local / CI commands you may run before or during deploy
- Install deps and build backend:
  ```bash
  cd backend
  npm ci
  npm run build
  npx prisma generate
  npx prisma migrate deploy   # run once in production (or via CI)
  npm start
  ```
- Frontend build:
  ```bash
  cd frontend
  npm ci
  npm run build
  ```

## Important production notes
- Do NOT use SQLite on Vercel: the filesystem is ephemeral and data will be lost across deploys. Use a managed Postgres/MySQL provider.
- Use `prisma migrate deploy` in production (not `prisma migrate dev`).
- If using PlanetScale or similar, set `SHADOW_DATABASE_URL` appropriately and follow provider-specific Prisma guidance.

## Where things live in this repo
- Backend: [backend](backend)
- Frontend: [frontend](frontend)

If you want, I can add this file into the `backend/` folder instead, or also create a short CI job to run migrations before each production deploy.

# Stylus — Luxury Fashion Rental Platform

A full-stack luxury fashion rental and e-commerce platform where users can rent designer pieces, partners can list items, and admins manage the marketplace.

## 🏗️ Architecture

**Monorepo Structure**: Two independent applications in one workspace
- **Backend**: Express.js REST API with Prisma ORM + PostgreSQL/SQLite
- **Frontend**: React SPA with Vite, TypeScript, Tailwind CSS, and HashRouter

## 🚀 Tech Stack

### Backend
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL (production) / SQLite (local dev)
- **ORM**: Prisma
- **Authentication**: JWT (User, Partner, Admin roles)

### Frontend
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router (HashRouter)
- **State Management**: Context API
- **AI Integration**: Google Gemini AI for styling recommendations

## 📁 Project Structure

```
Stylus/
├── backend/               # Express API server
│   ├── prisma/           # Database schema & migrations
│   │   ├── schema.prisma # Database models
│   │   └── seed.js       # Demo data seeder
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic layer
│   │   ├── index.ts      # Server entry point
│   │   └── prisma.ts     # Prisma client
│   └── .env.example      # Environment template
├── frontend/             # React SPA
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React Context providers
│   │   ├── pages/        # Route pages
│   │   ├── services/     # API client & external services
│   │   └── types.ts      # TypeScript definitions
│   └── .env.example      # Environment template
└── .github/
    └── copilot-instructions.md  # AI agent guidelines
```

## 🛠️ Local Development Setup

### Prerequisites
- Node.js v18+
- npm or yarn

### 1. Clone & Install

```bash
git clone <repository-url>
cd Stylus

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** (`backend/.env`):
```bash
DATABASE_URL="file:./prisma/dev.db"
PORT=4000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend** (`frontend/.env`):
```bash
VITE_API_BASE_URL=http://localhost:4000
GEMINI_API_KEY=your-gemini-api-key-here
NODE_ENV=development
```

### 3. Setup Database

```bash
cd backend

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed demo data (creates 1 demo user + 10 products)
npx prisma db seed
```

### 4. Start Development Servers

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev  # Runs on http://localhost:4000
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev  # Runs on http://localhost:3000
```

Visit `http://localhost:3000` to see the application.

## 📚 API Documentation

Full API documentation available at: `backend/API_DOCUMENTATION.md`

API Base URL: `http://localhost:4000/api`

Key endpoints:
- `/api/users` - User management & authentication
- `/api/products` - Product catalog
- `/api/orders` - Order management
- `/api/cart` - Shopping cart
- `/api/wishlist` - Wishlist operations
- `/api/transactions` - Wallet & payments
- `/api/reviews` - Product reviews

## 🔐 Authentication & Roles

- **User**: Browse catalog, rent items, manage cart/wishlist
- **Partner**: List items for rent/sale, manage inventory
- **Admin**: Manage users, approve verifications, oversee platform

All roles use JWT authentication with role-based access control.

## 🎨 Key Features

- ✅ Luxury fashion rental marketplace
- ✅ Partner verification system
- ✅ Wallet & transaction management
- ✅ AI-powered styling recommendations (Gemini AI)
- ✅ Shopping cart & wishlist
- ✅ Order tracking & management
- ✅ Product reviews & ratings
- ✅ Admin dashboard
- ✅ Multi-role authentication (User/Partner/Admin)

## 📦 What to Deploy

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

## 📖 Additional Resources

- **Copilot Instructions**: `.github/copilot-instructions.md` - Comprehensive guide for AI coding agents
- **Backend API Docs**: `backend/API_DOCUMENTATION.md` - Complete endpoint reference
- **Database Schema**: `backend/prisma/schema.prisma` - Data models & relationships
- **API Client**: `frontend/src/services/api.ts` - Typed API wrapper functions

## 🤝 Development Workflow

1. **Database Changes**: Edit `schema.prisma` → run `npx prisma migrate dev` → regenerate client
2. **Add API Endpoint**: Create route in `backend/src/routes/` → add service in `services/` → register in `index.ts`
3. **Add Frontend Feature**: Create component/page → add route in `App.tsx` → integrate with context/API

## 📝 Notes

- Frontend currently uses Context API with mock data in some areas
- Migration to full backend API integration is in progress (see `frontend/src/services/api.ts`)
- Use PostgreSQL for production deployments (SQLite is for local dev only)
- JWT tokens should be stored securely and refreshed appropriately

## 📄 License

[Your License Here]

## 👥 Contributors

[Your Team/Contributors Here]

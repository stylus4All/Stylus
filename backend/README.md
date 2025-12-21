# Stylus Backend

Simple Node + TypeScript backend using Prisma (SQLite) and Express.

Quick start:

```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```

Endpoints:
- `GET /health` — health check
- `GET /users` — list users
- `POST /users` — create user `{ "email": "x@x.com", "name": "Name" }`

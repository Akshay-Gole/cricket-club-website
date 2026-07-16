# Top G's Cricket Club Website

A modern full-stack cricket club platform for Top G's CC, built to manage public club content, squad profiles, fixtures, results, honours, gallery items, contact messages, and admin operations from one focused dashboard.

The project includes a public marketing website, an authenticated admin portal, a PostgreSQL-backed API, automated player-stat syncing, and fixture/result syncing from external cricket platforms.

---

## Overview

Top G's CC is a responsive cricket club website designed for both supporters and club administrators.

The public website presents:

- Club homepage and hero sections
- Squad and player profile pages
- Fixtures and results
- News and articles
- Honours
- Gallery
- Sponsors
- Contact and membership-related forms

The admin portal allows club staff to manage:

- Players
- Fixtures and results
- Homepage content
- Sponsors
- News
- Honours
- Gallery content
- Contact messages

---

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- React Hook Form
- Zod
- Redux Toolkit
- TanStack React Query
- GSAP
- Lenis
- Axios
- Sentry-ready configuration

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication
- bcrypt password hashing
- Zod validation

### Infrastructure

- Frontend hosted on Vercel
- Backend hosted on Railway
- PostgreSQL hosted on Railway
- Cron service on Railway for scheduled sync jobs

---

## Project Structure

```txt
cricket-club-website/
├── src/                         # Frontend React app
│   ├── components/              # Shared UI components
│   ├── constants/               # Shared frontend constants
│   ├── features/                # Feature-based frontend modules
│   ├── hooks/                   # Reusable React hooks
│   ├── pages/                   # Route-level pages
│   ├── services/                # API and logger services
│   ├── store/                   # Redux store setup
│   └── styles/                  # Global styles
│
├── backend/                     # Backend API
│   ├── prisma/                  # Prisma schema, migrations, seed
│   └── src/
│       ├── features/            # Backend feature services
│       ├── lib/                 # Shared backend utilities
│       ├── routes/              # Express routes
│       └── server.ts            # Backend entry point
│
├── public/                      # Static assets
├── package.json                 # Frontend scripts and dependencies
└── README.md
```

---

## Features

### Public Website

- Responsive dark sports-themed UI
- Animated homepage sections
- Real squad data from backend API
- Real fixture data from backend API
- Player profile pages with career and match statistics
- Fixtures grouped by season and month
- Result badges for won, lost, draw, abandoned, forfeited, and pending matches
- Gallery with year filtering and pagination
- Contact and enquiry forms

### Admin Portal

- Protected admin login
- JWT-based authentication
- Player creation, editing, deletion, and stat syncing
- Optional Play Cricket player ID support
- Fixture creation and editing
- PlayHQ scoreboard URL support
- Homepage content management
- Message inbox
- Gallery and honours management UI
- Dashboard overview

### External Syncing

- Player statistics can sync from Cricket Australia / Play Cricket data
- Fixture results can sync from PlayHQ scoreboard links
- Railway cron can run scheduled sync jobs automatically

---

## Getting Started

### Prerequisites

Install the following before running the project:

- Node.js 22+
- npm
- PostgreSQL database
- Railway account for backend deployment
- Vercel account for frontend deployment

---

## Environment Variables

### Frontend

Create a `.env.development` file in the root project folder:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SENTRY_DSN=
VITE_INSTAGRAM_TOKEN=
VITE_GOOGLE_MAPS_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

For production on Vercel, set:

```env
VITE_API_URL=https://your-backend-domain.railway.app/api
VITE_SENTRY_DSN=
VITE_INSTAGRAM_TOKEN=
VITE_GOOGLE_MAPS_KEY=
VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

### Backend

Create a `.env` file inside `backend/`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
FRONTEND_URL=http://localhost:5173

JWT_SECRET=replace-with-a-secure-random-secret
JWT_EXPIRES_IN=7d

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-secure-password

CRON_SECRET=replace-with-a-secure-random-secret
```

For Railway production, set the same backend variables inside the Railway backend service.

---

## Installation

Install frontend dependencies:

```bash
npm install
```

Install backend dependencies:

```bash
cd backend
npm install
```

---

## Running Locally

### Start the backend

```bash
cd backend
npm run dev
```

Backend runs on:

```txt
http://localhost:4000
```

Health check:

```txt
http://localhost:4000/api/health
```

### Start the frontend

From the project root:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Database

The backend uses Prisma with PostgreSQL.

### Generate Prisma Client

```bash
cd backend
npx prisma generate
```

### Run migrations locally

```bash
cd backend
npx prisma migrate dev
```

### Run migrations in production

Railway runs this automatically through the backend start command:

```bash
prisma migrate deploy && node dist/src/server.js
```

---

## Seeding Admin User

The seed script creates the first admin user from environment variables.

```bash
cd backend
npx prisma db seed
```

Required environment variables:

```env
ADMIN_EMAIL=
ADMIN_PASSWORD=
```

Players are managed from the admin portal, not through seed data.

---

## Available Scripts

### Frontend

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Builds the production frontend.

```bash
npm run preview
```

Previews the production frontend build.

```bash
npm run lint
```

Runs ESLint.

```bash
npm run lint:fix
```

Runs ESLint and fixes supported issues.

```bash
npm run format
```

Formats frontend and backend code with Prettier.

```bash
npm run format:check
```

Checks formatting without changing files.

```bash
npm run type-check
```

Runs TypeScript type checking.

### Backend

```bash
cd backend
npm run dev
```

Starts the backend in development mode.

```bash
cd backend
npm run build
```

Generates Prisma Client and compiles TypeScript.

```bash
cd backend
npm run start
```

Runs production migrations and starts the compiled backend.

```bash
cd backend
npm run sync:player-stats
```

Runs the scheduled sync script in production.

```bash
cd backend
npm run sync:player-stats:dev
```

Runs the scheduled sync script locally with TypeScript.

---

## Deployment

### Frontend: Vercel

The frontend is deployed to Vercel.

Production environment variable:

```env
VITE_API_URL=https://your-railway-backend-url/api
```

Whenever changes are pushed to the connected production branch, Vercel builds and deploys the frontend.

### Backend: Railway

The backend is deployed as a Railway service.

Recommended Railway settings:

```txt
Root Directory: /backend
Build Command: npm run build
Start Command: npm run start
```

Required Railway variables:

```env
DATABASE_URL=
FRONTEND_URL=
JWT_SECRET=
JWT_EXPIRES_IN=
ADMIN_EMAIL=
ADMIN_PASSWORD=
CRON_SECRET=
```

---

## Cron Jobs

A Railway cron service can run scheduled background syncs.

Recommended command:

```bash
npm run sync:player-stats
```

Example schedule:

```txt
30 16 * * *
```

This runs every day at 16:30 UTC.

The cron service is used to keep external cricket data updated without requiring manual admin action.

---

## API Overview

Base API URL:

```txt
/api
```

Common endpoints include:

```txt
GET    /api/health
GET    /api/players
GET    /api/players/:id
GET    /api/fixtures
GET    /api/home-content
POST   /api/admin/auth/login
GET    /api/admin/auth/me
POST   /api/admin/players
PATCH  /api/admin/players/:id
DELETE /api/admin/players/:id
POST   /api/admin/players/:id/sync
POST   /api/admin/fixtures
PATCH  /api/admin/fixtures/:id
DELETE /api/admin/fixtures/:id
```

Admin endpoints require authentication.

---

## Authentication

The admin portal uses JWT authentication.

Flow:

```txt
Admin logs in
↓
Backend validates email and password
↓
Backend returns JWT token
↓
Frontend stores token
↓
Protected admin routes use token for API requests
```

Passwords are hashed using bcrypt before being stored in the database.

---

## External Cricket Data

### Player Statistics

Players can optionally store a Play Cricket player ID.

When available, the backend can sync:

- Career summary
- Batting statistics
- Bowling statistics
- Fielding statistics
- Recent match performances

### Fixture Results

Fixtures can optionally store a PlayHQ scoreboard URL.

The backend extracts the PlayHQ game ID from the URL and uses it to fetch:

- Match status
- Home team
- Away team
- Winner
- Team scores
- Wickets
- Overs
- Match label, such as Grand Final or Semi Final

---

## Code Quality

This project uses:

- TypeScript strict mode
- ESLint
- Prettier
- Husky
- lint-staged
- Commitlint
- Conventional commits

Example commit message:

```bash
git commit -m "feat: add fixture result syncing"
```

---

## Production Notes

Before production release, confirm:

- Vercel `VITE_API_URL` points to Railway backend
- Railway backend has all required environment variables
- Railway PostgreSQL is connected
- Prisma migrations have run successfully
- Admin user has been seeded
- Cron service is active
- CORS `FRONTEND_URL` matches the production frontend domain
- No secrets are committed to GitHub

---

## Security Notes

- Never commit `.env` files
- Use strong values for `JWT_SECRET` and `CRON_SECRET`
- Keep admin credentials private
- Rotate secrets if they are ever exposed
- Restrict production database access where possible

---

## Roadmap

Potential future improvements:

- Cloudinary image upload integration
- Rich text editor for news articles
- Public search for fixtures and players
- Email notifications for contact forms
- Role-based admin permissions
- Automated PlayHQ fixture import
- Better analytics and error monitoring
- Full test coverage for API and UI flows

---

## Author

Built and maintained by Akshay Gole.

```txt
Top G's CC
Play Hard. Win Harder.
```

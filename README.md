<div align="center">
  <img src="./public/club-logo.png" alt="Top G's CC crest" width="112" />

# Top G's CC

**Play hard. Win harder.**

A full-stack cricket club platform for the squad, fixtures, honours, gallery,
sponsors and club enquiries.

[Live website](https://www.topgscc.com) ·
[API health](https://api.topgscc.com/api/health) ·
[Instagram](https://www.instagram.com/topgs_cc/)

</div>

![Top G's CC website preview](./public/social-preview.png)

## About

Top G's CC is an Adelaide cricket club website with two connected experiences:

- A responsive public website for supporters, players and prospective sponsors.
- A protected admin portal for managing club content and operations.

The platform combines manually managed club information with scheduled data
syncs from Instagram, Play Cricket and PlayHQ.

## Highlights

### Public website

- Dynamic homepage content and featured players
- Searchable squad and detailed player profiles
- Fixtures, results and season filters
- Club honours and awards
- Instagram gallery with pagination and year filters
- Active sponsor showcase
- Player, sponsor, social and general enquiry forms
- Responsive layouts, page-level metadata and structured SEO

### Admin portal

- JWT-protected administration
- Dashboard backed by live database totals
- Player profiles, images, roles and external statistics
- Fixture creation, editing and PlayHQ result syncing
- Homepage, honours and sponsor management
- Cloudinary image uploads
- Contact enquiry inbox and status workflow

### Automation

- Scheduled Play Cricket player-stat syncing
- Scheduled PlayHQ fixture-result syncing
- Scheduled Instagram gallery syncing

## Technology

| Layer          | Stack                                     |
| -------------- | ----------------------------------------- |
| Frontend       | React 19, TypeScript, Vite, Tailwind CSS  |
| Data           | TanStack Query, Redux Toolkit, Axios, Zod |
| Motion         | GSAP, Lenis                               |
| Backend        | Node.js, Express 5, TypeScript            |
| Database       | PostgreSQL, Prisma                        |
| Authentication | JWT, bcrypt                               |
| Media          | Cloudinary                                |
| Hosting        | Vercel, Railway                           |

## Architecture

```text
www.topgscc.com
      │
      │ HTTPS / JSON
      ▼
api.topgscc.com
      │
      ├── PostgreSQL
      ├── Cloudinary
      ├── Play Cricket / PlayHQ
      └── Instagram Graph API
```

The frontend is deployed on Vercel. The API, PostgreSQL database and scheduled
jobs run on Railway.

## Project structure

```text
.
├── public/                  Static assets, favicons, sitemap and robots.txt
├── src/
│   ├── components/          Shared frontend components
│   ├── features/            Feature-based UI, state and admin modules
│   ├── pages/               Public route-level pages
│   ├── services/            API clients and logging
│   └── styles/              Global styling
├── backend/
│   ├── prisma/              Schema, migrations and seed
│   └── src/
│       ├── features/        External sync and domain services
│       ├── middleware/      Authentication middleware
│       ├── routes/          Public, admin and internal API routes
│       └── scripts/         Railway cron entry points
└── vercel.json              SPA routing and response-header configuration
```

## Local development

### Requirements

- Node.js 22 LTS
- npm
- PostgreSQL
- Cloudinary account for image uploads
- Instagram credentials only when testing the gallery sync

### 1. Install dependencies

```bash
npm install
npm --prefix backend install
```

### 2. Configure the frontend

Copy the root example file:

```bash
cp .env.example .env.development
```

Minimum local configuration:

```env
VITE_API_URL=http://localhost:4000/api
VITE_SENTRY_DSN=
```

Variables prefixed with `VITE_` are included in the browser bundle. Never place
private credentials in them.

### 3. Configure the backend

Copy the backend example:

```bash
cp backend/.env.example backend/.env
```

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

JWT_SECRET=generate-a-long-random-value
JWT_EXPIRES_IN=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password

CRON_SECRET=generate-another-long-random-value

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

INSTAGRAM_ACCOUNT_ID=
INSTAGRAM_ACCESS_TOKEN=
```

Keep `.env` files local. They are ignored by Git and must never be committed.

### 4. Prepare the database

```bash
cd backend
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

The seed command creates or updates the administrator using `ADMIN_EMAIL` and
`ADMIN_PASSWORD`.

### 5. Start both applications

In one terminal:

```bash
cd backend
npm run dev
```

In another terminal:

```bash
npm run dev
```

| Service      | Local URL                           |
| ------------ | ----------------------------------- |
| Website      | `http://localhost:5173`             |
| API          | `http://localhost:4000/api`         |
| Health check | `http://localhost:4000/api/health`  |
| Admin portal | `http://localhost:5173/admin/login` |

## Useful commands

### Frontend

```bash
npm run dev          # Start Vite
npm run build        # Type-check and build production assets
npm run preview      # Preview the production build
npm run lint         # Run ESLint
npm run lint:fix     # Apply supported lint fixes
npm run format:check # Check formatting
npm run type-check   # Run TypeScript checks
```

### Backend

```bash
cd backend
npm run dev               # Start the API with watch mode
npm run build             # Generate Prisma Client and compile TypeScript
npm run start             # Apply migrations and start the compiled API
npm run sync:player-stats # Sync player stats and finished fixtures
```

Run the Instagram sync against a compiled backend:

```bash
cd backend
node dist/src/scripts/sync-instagram-posts.js
```

## Deployment

### Vercel

The production frontend requires:

```env
VITE_API_URL=https://api.topgscc.com/api
VITE_SENTRY_DSN=
```

Vite embeds these values at build time, so redeploy after changing a frontend
environment variable.

### Railway API

Recommended service settings:

```text
Root directory: backend
Build command:  npm run build
Start command:  npm run start
Custom domain:  api.topgscc.com
```

Configure all backend variables from the local example in Railway. In
production, set:

```env
FRONTEND_URL=https://www.topgscc.com
```

### Railway cron services

The automation is split into two short-lived services:

```bash
# Player statistics and completed fixture results
npm run sync:player-stats

# Instagram gallery
node dist/src/scripts/sync-instagram-posts.js
```

Each cron service needs the relevant API credentials and a reference to the
same production `DATABASE_URL`.

## API overview

Public endpoints include:

```text
GET  /api/health
GET  /api/home-content
GET  /api/players
GET  /api/players/:id
GET  /api/fixtures
GET  /api/honours
GET  /api/gallery
GET  /api/sponsors
POST /api/contact
```

Administration endpoints live below `/api/admin` and require a valid bearer
token. Scheduled HTTP sync endpoints live below `/api/internal` and require the
configured cron secret.

## Security

- Passwords are hashed with bcrypt.
- Admin routes require signed, expiring JWTs.
- Public and admin payloads are validated with Zod.
- Prisma provides parameterized database access.
- Uploads are authenticated and size-limited.
- Production secrets remain in Railway and are never sent to the frontend.

Run dependency checks regularly:

```bash
npm audit
npm --prefix backend audit
```

## Content and data ownership

Club content, branding, player information and uploaded media belong to
Top G's CC and their respective owners. External cricket and social data remain
subject to the terms of their source platforms.

# Flipkart Clone

Full-stack Flipkart-inspired e-commerce application built from the assignment PDF and roadmap with current package lines as of March 28, 2026.

Live stack:
- Frontend: React 19.2.4, Vite 8.0.3, React Router DOM 7.13.2, Redux Toolkit 2.11.2, Tailwind CSS 4.2.2
- Backend: Node.js 24.x, Express 5.2.1, Prisma 7.6.0
- Database: Neon PostgreSQL

## Implemented Features

### Core
- Product listing grid with search, category filters, sorting, pagination
- Product detail page with image carousel, specifications, price display, stock status
- Cart management with quantity updates, remove flow, and totals
- Checkout with address form, order summary, order placement, and confirmation page

### Bonus
- Responsive UI across mobile, tablet, and desktop
- JWT authentication with login and signup
- Wishlist
- Order history
- Order confirmation email service with SMTP support and JSON fallback

## Folder Structure

```text
clone/
├── backend/
├── frontend/
├── package.json
└── README.md
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure env

Backend env lives in [backend/.env].
Frontend env lives in [frontend/.env].

Paste your Neon Postgres connection string into `backend/.env` as `DATABASE_URL`.

Expected format:

```env
DATABASE_URL="postgresql://<user>:<password>@<host>/<database>?sslmode=require&channel_binding=require"
```

Notes:
- Use your Neon direct Postgres connection string as the default choice.
- Keep `sslmode=require`.
- The backend runtime and Prisma CLI both use the same `DATABASE_URL`.

### 3. Prepare the database

```bash
cd backend
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
```

Demo user after seeding:
- `demo@flipkartclone.dev`
- `Demo@12345`

### 4. Run the app

From the repo root:

```bash
npm run dev
```

Or run services independently:

```bash
npm run dev:backend
npm run dev:frontend
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000`

## Neon Setup

1. Create a Neon project and database from the Neon dashboard.
2. Copy the connection string from Neon.
3. Paste it into [backend/.env] as `DATABASE_URL`.
4. Run:

```bash
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

Neon is the default database provider for this project in local development and deployment-facing configuration.


## Notes

- The backend email service sends through SMTP when credentials are configured.
- Without SMTP credentials, order emails still run through Nodemailer's JSON transport for local development.
- Product seed data is tailored to an Indian marketplace feel with INR pricing and multiple categories.
- Prisma runtime and schema commands both resolve the same Neon `DATABASE_URL`.

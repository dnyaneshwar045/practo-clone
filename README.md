# PractoClone

A full-stack Practo-style healthcare marketplace: patients search verified doctors and book
in-clinic or video appointments, doctors manage their practice and slots, and admins run the
whole platform (verification, articles, premium plans, demo consultations).

Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS + Prisma (SQLite)**. All mutations
are React Server Actions; auth is a signed JWT in an httpOnly cookie.

## Features

### Patients
- Home page with speciality shortcuts, top-rated doctors, latest articles and plan highlights
- Doctor search with free-text, speciality and city filters
- Doctor profile with weekly availability and real bookable slots (next 7 days, double-booking safe)
- Book in-clinic or video appointments, cancel appointments
- Premium plan subscribe / renew / cancel
- Free demo consultation scheduling
- Dashboard: appointments, doctor's notes, active plan, demo requests

### Doctors
- Self-service registration with practice details (goes live after admin verification)
- Dashboard stats (pending / confirmed / completed appointments, earnings)
- Confirm, complete (with consultation notes) or cancel appointments
- Manage weekly availability windows and slot length
- Edit practice profile, fee, experience and bio

### Admin panel
- Overview: platform counters, active-subscription revenue, latest bookings
- Doctor verification (approve / reject)
- All users, all appointments (confirm / cancel)
- Articles & blogs CRUD (draft / published)
- Premium plan CRUD
- Demo consultation request pipeline (requested → scheduled → done / cancelled)

## Getting started

```bash
npm install
cp .env.example .env      # then set AUTH_SECRET
npm run db:migrate         # creates prisma/dev.db
npm run db:seed            # demo doctors, articles, plans, appointments
npm run dev                # http://localhost:3000
```

## Demo logins

All seeded accounts use the password `password123`.

| Role    | Email                      |
| ------- | -------------------------- |
| Admin   | `admin@practoclone.dev`    |
| Patient | `patient@practoclone.dev`  |
| Doctor  | `anita@practoclone.dev`    |

## Scripts

| Script | Purpose |
| ------ | ------- |
| `npm run dev` | Start the dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript checks |
| `npm run db:migrate` / `db:seed` / `db:reset` | Prisma migrations and seed data |

## Project structure

```
prisma/schema.prisma      Data model (users, doctors, availability, appointments,
                          articles, plans, subscriptions, demo requests)
prisma/seed.ts            Demo data
src/lib/auth.ts           Password hashing, JWT session cookie, role guards
src/lib/slots.ts          Weekly availability -> bookable slot generation
src/lib/actions/*         Server actions (auth, appointments, doctor, content, plans, demo)
src/app/(public)          Home, doctors, articles, plans, demo, login, register
src/app/dashboard         Patient dashboard
src/app/doctor/*          Doctor dashboard
src/app/admin/*           Admin panel
```

Switching to Postgres only needs the `datasource` provider plus `DATABASE_URL` changed in
`prisma/schema.prisma`; no application code depends on SQLite.

> Educational demo project. Not affiliated with Practo.

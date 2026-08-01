# West Africa Impact Jobs

A mobile-first job board consolidating social-impact, NGO, and development
employment opportunities across West Africa — with country/sector filtering,
live aggregation from partner job boards, a staff admin backend, and
job-seeker accounts with resume upload.

## Features

- **Public job feed** — filter by country (Liberia, Nigeria, Ghana, Senegal,
  Sierra Leone, The Gambia, Cote d'Ivoire, Burkina Faso, Guinea), sector, and
  keyword. Filters persist in the URL for easy sharing/bookmarking.
- **Live partner aggregation** — listings are pulled live from Afrorama and
  WACSI (via their public feeds), with a ReliefWeb API connector ready to go
  live once an approved `appname` is configured. A few boards with no public
  API (Devex, DevelopmentAid, CTG, NGO Jobs in Africa) are shown as clearly
  labeled sample listings pending a scraping connector.
- **Social sharing** — WhatsApp and Facebook share buttons on every job card.
- **Job-seeker accounts** — email signup with verification email, resume/CV
  upload (PDF/DOC/DOCX).
- **Staff admin backend** — hashed username/password login (`/admin`, linked
  from the "Staff Only" footer link), job ingestion desk, inventory
  management (edit/archive), integration sync status, and a dev mailbox for
  testing the verification flow without a real SMTP provider.
- **Rate limiting** — sliding-window limits on auth, uploads, and job
  mutation endpoints.

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in values as needed
npm run dev
```

Open http://localhost:3000.

### Default staff login

- URL: `/admin`
- Username: `admin`
- Password: `ImpactJobs2026!`

Change this via the admin table (`lib/admins.ts`) before deploying publicly.

## Notes on the current implementation

This project uses **in-memory data stores** (`lib/store.ts`, `lib/users.ts`,
`lib/admins.ts`) for jobs, accounts, and admins — everything resets on
server restart. Before a real deployment you'll want to:

1. Replace the in-memory stores with a real database (Postgres/Supabase, etc).
2. Move resume uploads from local disk (`public/uploads/resumes`) to object
   storage (S3, Supabase Storage, etc).
3. Configure a real SMTP provider (or Postmark/SendGrid/Resend) via the
   `SMTP_*` env vars for verification emails.
4. Set a strong, random `SESSION_SECRET`.

## Tech stack

Next.js 15 (App Router) - React 19 - TypeScript - Tailwind CSS - shadcn/ui

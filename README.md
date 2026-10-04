# Aashi Sharma Portfolio

Personal academic/professional portfolio for **Aashi Sharma** — Applied Psychology undergraduate (B.A. Applied Psychology, Hons with Research), Amity University.

## Overview

A psychology portfolio with an integrated **Poetry** section and a private **CMS/admin dashboard**, backed by Supabase.

- **Public site:** Home (Hero, About, Research, Internship Matrix, Contact), Poetry list, individual poem pages.
- **Private admin:** content, research, clinical matcher, poems, and settings editors behind Supabase Auth.

## Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (PostgreSQL + Auth + RLS)
- **Cloudflare Workers** (deployment via vinext and Wrangler)

## Architecture

Two-tier: static/SSR Next.js public site + private admin, both reading/writing Supabase through RLS.

- **Client components** (minimal): `ClinicalMatcher`, `ResearchModal`, admin forms.
- **Server components** (everything else): page sections, poetry list/detail, layouts.
- **Auth:** Supabase Auth (email/password, no public signup), session via `@supabase/ssr` cookies.
- **Authorization:** enforced by PostgreSQL RLS via an `is_admin()` security-definer function and an `admin_users` allowlist. The frontend is never trusted for authorization.
- **Keys:** `anon` key on client; `service_role` key server-only (never exposed).

## Routes

### Public
- `/` — Home
- `/poetry` — Poetry index
- `/poetry/[slug]` — Individual poem

### Admin
- `/admin/login`
- `/admin`
- `/admin/content`
- `/admin/research`
- `/admin/clinical`
- `/admin/poems`
- `/admin/settings`

## Database Schema

Tables (all with RLS enabled):

- `admin_users` — owner/editor allowlist (FK → `auth.users`)
- `site_content` — editable page copy (key/value)
- `site_settings` — site-wide config (key/value)
- `research_projects` — research/term-paper content
- `clinical_duties` — internship matcher content
- `contact_links` — email/social links
- `poems` — poetry (title, slug, excerpt, content, status, tags, timestamps)

Migrations live in `supabase/migrations/`.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

See `.env.local.example` for details.

## Development

```bash
npm install
npm run dev
```

## Deployment

Deployed to Cloudflare Workers at [aashi.work](https://aashi.work), with Supabase as the external backend. Cloudflare's Workers Vite plugin runs the vinext build; Wrangler deploys the generated Worker and custom route.

---

See `PROJECT_IMPLEMENTATION_PLAN.md` for the full source-of-truth implementation plan.

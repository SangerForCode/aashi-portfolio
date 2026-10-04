# Aashi Sharma Portfolio — Project Implementation Plan

> **Source of truth** for the Supabase + CMS implementation.
> No architectural changes may be made without explicitly explaining why in this document first.

---

## 1. Architecture

Next.js (App Router) application backed by Supabase. Deployed to Cloudflare Workers via vinext.

- **Public site**: Next.js Server Components reading public content from Supabase at runtime via the Supabase server client (`@supabase/ssr`). Only explicitly public rows are exposed.
- **Private admin**: Next.js routes under `/admin/*`, gated by Supabase Auth + middleware, with writes authorized by PostgreSQL RLS.
- **Backend**: Supabase Postgres + Auth + RLS (+ Storage only if image uploads are later required).

### Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + Auth + RLS)
- Cloudflare Workers (deployment via `vinext`)

### Key decisions
- **Migrate from vanilla HTML to Next.js.** Preserve the existing visual design and content exactly; the existing `index.html` is the design source of truth. No redesign.
- **Server Components by default; Client Components only where interactivity is required** (matcher, research modal, admin forms). Client JS kept to a minimum.
- **Poem detail rendering**: server-side fetch via dynamic route `/poetry/[slug]`. `generateStaticParams` is not a correctness requirement for V1. CMS publish must not require a manual deploy.
- **Supabase clients**: browser client (anon key) for client interactions; server client (cookies) for server components; service-role client server-only for bootstrap/maintenance only.
- `site.html` is a stale duplicate of `index.html` and will be retired.

### Hosting decision update — 2026-10-04

- At the user's request, Cloudflare Workers replaces Vercel for deployment; `aashi.work` is the intended public domain.
- Rationale: the user has Cloudflare access for `aashi.work` and requested hosting there. This supersedes the original Vercel hosting choice and Phase 6 deployment target.
- Cloudflare's current Next.js guidance recommends vinext for Next.js 16; its compatibility check reported 100% support for this codebase (9 supported integrations, no partials or issues). vinext remains beta, so the deployment must receive production smoke tests.
- The typed Cloudflare Build Output path currently rejects vinext's required RSC child environments. Use vinext's documented legacy Wrangler deployment path instead; keep CDN/data caching disabled so public CMS edits remain request-fresh.
- The apex `aashi.work` currently points to the existing Netlify origin and `www.aashi.work` is a Netlify CNAME. Preserve these records; attach the Worker route to the apex, then enable Cloudflare proxying on the existing apex A record. Leave `www` unchanged unless separately requested.

---

## 2. Database Schema

All tables in the `public` schema, all with Row Level Security enabled.

### `admin_users`
`auth.users` is the source of truth for the user's email; no duplicated email column.

| column | type | notes |
|---|---|---|
| `id` | uuid PK | references `auth.users(id)` on delete cascade |
| `role` | text not null default `'owner'` | `owner` \| `editor` |
| `created_at` | timestamptz not null default now() | |

### `site_content` — key/value page copy
| column | type |
|---|---|
| `id` | uuid PK default gen_random_uuid() |
| `key` | text unique not null |
| `value` | text not null |
| `group` | text not null |
| `is_public` | boolean not null default false |
| `updated_at` | timestamptz not null default now() |

### `site_settings` — key/value site config
| column | type |
|---|---|
| `id` | uuid PK default gen_random_uuid() |
| `key` | text unique not null |
| `value` | text not null |
| `is_public` | boolean not null default false |
| `updated_at` | timestamptz not null default now() |

### `research_projects`
| column | type |
|---|---|
| `id` | uuid PK default gen_random_uuid() |
| `title` | text not null |
| `slug` | text unique not null |
| `description` | text |
| `supervisor` | text |
| `project_focus` | text |
| `enrolment_id` | text |
| `abstract` | text |
| `highlights` | jsonb not null default '[]' |
| `pdf_path` | text |
| `sort_order` | int not null default 0 |
| `published` | boolean not null default true |
| `created_at` | timestamptz not null default now() |
| `updated_at` | timestamptz not null default now() |

> `research_highlights` merged here as JSONB (`highlights`).

### `clinical_duties`
| column | type |
|---|---|
| `id` | uuid PK default gen_random_uuid() |
| `key` | text unique not null |
| `label` | text not null |
| `title` | text not null |
| `highlight` | text |
| `bullets` | jsonb not null default '[]' |
| `quote` | text |
| `sort_order` | int not null default 0 |
| `published` | boolean not null default true |

### `contact_links`
| column | type |
|---|---|
| `id` | uuid PK default gen_random_uuid() |
| `label` | text not null |
| `type` | text not null check (`email` \| `url`) |
| `value` | text not null |
| `sort_order` | int not null default 0 |
| `published` | boolean not null default true |

### `poems`
| column | type |
|---|---|
| `id` | uuid PK default gen_random_uuid() |
| `title` | text not null |
| `slug` | text unique not null |
| `excerpt` | text |
| `content` | text not null — literal `\n` newlines + blank lines preserve stanzas |
| `status` | text not null default `'draft'` (`draft` \| `published`) |
| `published_at` | timestamptz |
| `tags` | jsonb not null default '[]' |
| `sort_order` | int not null default 0 |
| `created_at` | timestamptz not null default now() |
| `updated_at` | timestamptz not null default now() |

---

## 3. Routes

### Public
- `/` — Home: Hero, About, Research, Internship Matrix, Contact
- `/poetry` — Poetry index (published poems)
- `/poetry/[slug]` — individual poem (dynamic server component)
- `site.html` — legacy, retired

### Admin
- `/admin/login`
- `/admin` — dashboard
- `/admin/content` — `site_content`
- `/admin/research` — `research_projects`
- `/admin/clinical` — `clinical_duties`
- `/admin/poems` — `poems`
- `/admin/settings` — `site_settings` + `contact_links`

---

## 4. Authentication Architecture

- Supabase Auth, email/password provider.
- Public signups disabled.
- Login calls `signInWithPassword()` from the browser client.
- Session maintained by `@supabase/ssr` via cookies; server components read `getUser()` from the request.
- No custom hashing, no stored passwords, no fake frontend auth.

---

## 5. Authorization Architecture

- `admin_users` is the allowlist; `id` FK → `auth.users`.
- Middleware checks session presence for `/admin/*` (except `/admin/login`).
- **RLS is authoritative** via `is_admin()` security-definer function; the frontend is never trusted for authorization.
- Normal admin CRUD uses the authenticated session (RLS applies per row).

### Service role (server-only)
- Used **only** for privileged bootstrap/maintenance (e.g., creating the first `admin_users` row).
- Lives in `lib/supabase/admin.ts`, marked `import 'server-only'`.
- **Never** imported from Client Components, browser utilities, normal data-fetching code, or admin UI components.

---

## 6. RLS Model

Deny by default. `is_admin()` security-definer function returns true when `auth.uid()` is present in `admin_users`.

- **anon** (`anon` key):
  - `poems` `SELECT` where `status = 'published'`
  - `research_projects` / `clinical_duties` / `contact_links` `SELECT` where `published = true`
  - `site_content` / `site_settings` `SELECT` where `is_public = true` only (no blanket read)
  - no access to `admin_users`
- **authenticated (admin)**:
  - content tables full CRUD where `is_admin()`
  - `admin_users` self `SELECT` only
- **service_role**: server-only, not exposed.

**Explicitly public groups** (migrated with `is_public = true`): `hero`, `about`, `interests`, `research`, `clinical`, `contact`, `footer`, plus intentionally public `site_settings` (brand name, email, LinkedIn URL, tagline). Everything else defaults to `is_public = false`.

---

## 7. RLS Verification

Actual verification via script (Supabase CLI + test roles, or pgTAP):

**ANON:**
- ✅ read published/public content
- ❌ cannot read drafts
- ❌ cannot INSERT / UPDATE / DELETE
- ❌ cannot read `admin_users`

**Non-admin authenticated user:**
- ✅ read public content
- ❌ cannot read private/draft content where prohibited
- ❌ cannot INSERT / UPDATE / DELETE

**Admin (owner):**
- ✅ read public + draft content
- ✅ INSERT / UPDATE / DELETE

---

## 8. Migration Strategy

- Additive, idempotent, versioned SQL files in `supabase/migrations/`, numbered in order.
- All DB changes via migrations; no undocumented dashboard-only schema changes.
- Content seeding uses `INSERT ... ON CONFLICT (key) DO NOTHING` (or equivalent) so re-runs are safe.
- Public pages keep static fallback content; server fetch overrides from DB.

---

## 9. Poetry Architecture

- `/poetry` — server component listing published poems, ordered by `sort_order` then `published_at desc`.
- `/poetry/[slug]` — dynamic server component; fetches by slug where `status = 'published'`; `notFound()` otherwise.
- Server-side fetch with dynamic rendering; `generateStaticParams` optional (not required for correctness).
- CMS publish must appear without a manual deploy (revalidation on save or short revalidation window).
- Line/stanza preservation via `whitespace-pre-wrap` / stanza splitting; literary serif typography within the `brand` palette.
- Per-poem metadata via `generateMetadata`.

---

## 10. SEO / Metadata Architecture

- Root layout exports base `metadata` (title, description, `metadataBase`).
- Per-page `generateMetadata` for poems and Home.
- `app/sitemap.ts` + `app/robots.ts`; semantic headings; alt text; OpenGraph per poem; optional JSON-LD `Person`.

---

## 11. Assets

- `aashi.jpeg` → `public/aashi.jpeg`
- `favicon.png` → `public/favicon.png`
- `aashi sharma ntcc term paper.docx.pdf` → `public/downloads/aashi-sharma-ntcc-term-paper.pdf`
- No Supabase Storage for V1 (add later only if CMS image uploads are needed).

---

## 12. Environment Variables

`.env.local.example` committed with placeholders; `.env.local` gitignored.

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Secrets are never requested in chat.

---

## 13. Supabase Connection

- Use the existing Supabase CLI (`npx supabase`, v2.119.0) for project introspection, migrations, and secrets.
- If a Supabase MCP becomes available, use it for inspection; otherwise rely on the CLI.
- `supabase link` in Phase 1 (project ref from `supabase projects list`); no manual credential paste required.

---

## 14. Implementation Phases

- **Phase 0 — Bootstrap**: scaffold Next.js app (TS + Tailwind + App Router), port design system + assets, Supabase client scaffolding (`client.ts`/`server.ts`/`admin.ts`), `.env.local.example`, middleware scaffold. No DB changes.
- **Phase 1 — Schema + RLS**: apply migrations (`0001_schema.sql`, `0002_rls.sql`, `0003_seed_admin.sql`); link project; seed owner.
- **Phase 2 — Component port (static-first)**: rebuild Home as server components (`Nav`, `Hero`, `About`, `Research`, `Contact`, `Footer`) with hardcoded content matching current site; port `ClinicalMatcher` + `ResearchModal` as client components.
- **Phase 3 — Supabase hydration**: replace hardcoded strings with server-fetched data (typed queries), keeping static fallbacks.
- **Phase 4 — Auth + Admin**: middleware, `/admin/login`, admin shell, five editors (RLS-gated, session-based).
- **Phase 5 — Poetry**: `/poetry`, `/poetry/[slug]`, metadata, literary typography.
- **Phase 6 — SEO + Deploy**: sitemap/robots, OG/JSON-LD, revalidation strategy, Cloudflare Workers deploy via vinext to `aashi.work`, full test pass.

---

## 15. Testing Strategy

- Types: `tsc --noEmit` / `npm run build`.
- Lint: ESLint / `next lint`.
- Unit: utility functions (slug, dates, stanza splitting) via Vitest.
- RLS verification: scripted assertions (see §7).
- Manual smoke: nav, matcher, modal, poetry list/detail, login/logout, CRUD per admin section.
- Poem formatting: multi-stanza content renders with exact line breaks/stanza gaps.
- Auth: sign-in, session persistence, sign-out, protected redirect.

# Improvements

Review of the Aashi Sharma portfolio (Next.js App Router + Supabase + Cloudflare
Workers). Findings are grouped by area and prioritised. Items marked **(done)**
were addressed as part of adding the Playwright suite; the rest are
recommendations.

## What was added

- `playwright.config.ts` — desktop (`chromium`) + mobile (`Pixel 7`) projects,
  auto-starts the dev server, retains traces/video on failure.
- `e2e/*.spec.ts` — 30+ end-to-end tests covering the home page, clinical
  matcher, research modal, poetry, admin login/redirects, SEO, and 404s.
- `npm run test:e2e`, `npm run test:e2e:ui`, `npm run typecheck`.
- `.gitignore` entries for Playwright artifacts.
- Fixed the nav "Poetry" link **(done)**: it pointed at `#poetry`, an anchor that
  only exists when poems are seeded, so with no poems it did nothing. It now
  routes to the dedicated `/poetry` index.

---

## P0 — Correctness & security

1. **Protected admin routes return HTTP 500 instead of redirecting when Supabase
   env is missing.** `middleware.ts:9` intentionally no-ops without env, then
   `src/app/admin/(protected)/layout.tsx:21` calls `createClient()` which throws
   `Missing NEXT_PUBLIC_SUPABASE_URL...`. `GET /admin` returns 500 today. Failing
   closed to `/admin/login` (or a branded error page) is safer and more
   predictable.
2. **Admin bootstrap migration is brittle.** `supabase/migrations/0003_seed_admin.sql`
   raises unless there are *exactly two* Auth users, then grants `owner` to
   **every** Auth user. If a third user is created before the migration runs the
   migration aborts; if it never runs, no admin exists. Prefer an explicit
   allowlist (emails or UUIDs) with an idempotent upsert, or a documented CLI
   script.
3. **No rate limiting / bot protection on the login endpoint.** Supabase Auth is
   the gate, but the public `/admin/login` is open to credential stuffing. Add
   Cloudflare rate limiting and/or Turnstile.
4. **No security headers.** `next.config.ts` is empty. Add CSP, HSTS,
   `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options` via headers
   in `next.config.ts` (or the Worker).
5. **`updated_at` / `published_at` are computed on the client.** In
   `AdminCrudEditor.tsx:237-246` these timestamps are set in the browser, so a
   manipulated or out-of-sync client can write arbitrary values. Move them to
   DB defaults/triggers (`set_updated_at()` + a `BEFORE UPDATE` trigger).
6. **Silent failure in content loading.** `src/lib/content/home.ts:336` and
   `src/lib/content/poems.ts` swallow every error and fall back to static
   content. A DB outage looks identical to "content not edited yet". Log/report
   errors and consider surfacing a degraded state.

## P1 — UX, accessibility & SEO

7. **Add App Router `not-found.tsx`, `error.tsx`, and `loading.tsx`.** There are
   no custom boundary files; users see raw Next.js defaults. A branded 404 and a
   skeleton for `/poetry` would match the design system.
8. **Modal accessibility.** `ResearchModal.tsx` handles Escape and backdrop, but
   there is no focus trap, initial focus, or focus restoration to the trigger.
   Use `inert`/`<dialog>` or a small focus-trap hook.
9. **Reduced-motion support.** `globals.css` sets `scroll-behavior: smooth` and
   the hero uses `animate-pulse` + `hover:scale`; none respect
   `prefers-reduced-motion`. Add a media query to disable these.
10. **Skip-to-content link.** No keyboard skip link exists; add one targeting
    `<main id="top">`.
11. **Public "Admin Login" link on `/poetry`** (`src/app/poetry/page.tsx:43`)
    advertises the admin surface to every visitor. Consider removing it from the
    public page (keep it in `robots.txt` disallow + direct URL) or rate-limiting
    access.
12. **Use `next/image` and intrinsic dimensions.** The hero portrait is a raw
    `<img>` without `width`/`height`, risking layout shift; fonts are loaded via
    a render-blocking Google `<link>` instead of `next/font` (self-hosted,
    preloaded, no layout shift).
13. **Per-poem metadata gaps.** `/poetry/[slug]` has no canonical URL, no
    `generateStaticParams`, and no `CreativeWork`/`Article` JSON-LD. Add them.
14. **Sitemap completeness.** `src/app/sitemap.ts` omits `lastModified` for the
    home and `/poetry` entries; add it.
15. **`site-url.ts` still falls back to `VERCEL_URL`** (`src/lib/site-url.ts:7`)
    even though deployment is Cloudflare. Also, when `NEXT_PUBLIC_SITE_URL` is
    unset the canonical/OG URLs silently point at `http://localhost:3000`. Fail
    loudly in production.
16. **Footer caption contrast.** `text-brand-200/50` on `bg-brand-900` is likely
    below WCAG AA for small text; bump the opacity.

## P1 — Performance

17. **`force-dynamic` everywhere.** `src/app/page.tsx:13`, `poetry/page.tsx:12`,
    `poetry/[slug]/page.tsx:10`, and `sitemap.ts` are all `force-dynamic` while
    CDN/data caching is disabled, so every request re-hits Supabase. Adopt
    `revalidateTag`/`revalidatePath` on admin save (the plan already calls for
    "revalidation on save") to reconcile freshness with cost.
18. **No Turbopack root set.** `next dev` warns that `package-lock.json` in
    `/home/tuff` is outside the repo; set `turbopack.root` in `next.config.ts` to
    silence it and avoid wrong workspace-root inference.

## P2 — Maintainability & DX

19. **Legacy artifacts committed at repo root:** `index.html`, `site.html`
    (the plan already calls it "stale… will be retired"), `aashi.jpeg`,
    `aashi sharma ntcc term paper.docx.pdf`, and `favicon.png`. They duplicate
    `public/` assets and confuse the source of truth. Remove them.
20. **No CI.** Add a GitHub Actions workflow running `lint`, `typecheck`,
    `test` (Vitest), `test:e2e`, and `build`.
21. **`tsc --noEmit` currently fails** on generated `.next/types/validator.ts`
    (`AppRoutes`/`LayoutRoutes`/`ParamMap` not exported). Exclude `.next` from the
    tsconfig typecheck or pin the Next types.
22. **Low unit coverage.** Vitest only covers `poem-formatting.ts`. Add tests for
    the `parseHighlights`/`parseBullets`/fallback logic in `content/home.ts`,
    `AdminCrudEditor` payload mapping (JSON/number coercion), and `site-url.ts`.
23. **RLS is still verified manually** (`PROJECT_IMPLEMENTATION_PLAN.md §7`). Add
    scripted pgTAP or a Supabase test project with assertions for anon vs admin
    vs non-admin roles.
24. **Auth-dependent e2e tests skip without env.** Provide a seeded local
    Supabase project (or `ADMIN_TEST_EMAIL`/`ADMIN_TEST_PASSWORD`) so
    `admin-auth.spec.ts` and the redirect tests run in CI.
25. **No formatter.** ESLint is configured but there is no Prettier (or Biome)
    config/`format` script; add one for consistent formatting.
26. **README lacks testing docs.** Document `npm test`, `npm run test:e2e`,
    `npx playwright install`, and the env vars needed for the full suite.

## P2 — CMS / data model

27. **JSON fields are hand-edited.** `tags`, `bullets`, and `highlights` are
    entered as raw JSON in `AdminCrudEditor.tsx`, which is error-prone for a
    non-technical editor. Provide add/remove repeatable field UIs.
28. **`admin_users` has no email and no editor-management UI.** The schema
    comment says the owner can add editors, but no screen exists and admins can
    only read their own row (`0002_rls.sql`). Add an owner-only admin-management
    page or document the CLI flow.
29. **Contact defaults are duplicated** in `content/home.ts` (`DEFAULT_CONTACT_LINKS`),
    `DEFAULT_SETTINGS`, and `Contact.tsx` fallbacks. Consolidate into one source.

---

## Admin portal — non-technical usability analysis

### How it works today

The admin is a single generic component, `AdminCrudEditor.tsx`, reused for all
six resources (`site_content`, `research_projects`, `clinical_duties`, `poems`,
`site_settings`, `contact_links`). It renders a flat list of records plus a form
generated from a field config. It is functionally complete but exposes the
database schema directly to the editor.

Concrete friction points observed in the code:

- **Database jargon on screen.** Editors type values into `key`, `group`,
  `slug`, `sort_order`, `is_public`, `published`, and `status`. Nothing explains
  what `is_public` or `group` means.
- **Raw JSON for lists.** `tags`, `bullets`, and `highlights` are textareas
  expecting `["a","b"]` or `[{"title":"...","text":"..."}]`
  (`AdminCrudEditor.tsx:54-59, 73-78, 92`). A missing quote or comma throws
  `One of the JSON fields is not valid JSON.`
- **Page copy is a global key/value table.** To change the hero heading the
  editor must find the row literally named `hero.title`, then know that
  `hero.cta_details` etc. even exist. Adding a new key does nothing on the site
  unless a component already reads that key — the CMS edits *values*, not
  structure.
- **Poems need manual slugs and hand-typed blank-line stanzas.** There is no
  live preview of how the stanza spacing renders (`poem-formatting.ts` splits on
  blank lines).
- **Ordering is a number.** Editors set `sort_order` by guessing; there is no
  drag-and-drop.
- **No preview before publishing.** Saving writes straight to production; there
  is no draft preview, no "view changes", no undo.
- **No media handling.** Images/PDFs are referenced by path (`pdf_path`,
  `/aashi.jpeg`); uploading a new file requires a developer.
- **Rough feedback.** Errors are surfaced as raw Supabase messages; success is a
  bare `Saved.` status string. Deletes use the native `window.confirm`
  (`AdminCrudEditor.tsx:271`).
- **Login is password-only.** No "forgot password", no magic link, no account
  invite — a non-technical editor who forgets a password is locked out.
- **No history.** There is no way to see who changed what or to revert.
- **The public `/poetry` page links to `/admin/login`** (`poetry/page.tsx:43`),
  inviting the wrong audience in.

### What a non-technical editor actually needs

1. **Purpose-built forms, not a schema grid.** One screen per page/section
   ("Home → Hero", "Home → About", "Contact") with human labels ("Headline",
   "Short intro"), help text, and character guidance. Keep `key`, `group`,
   `is_public`, `slug`, `sort_order` behind an **Advanced** disclosure.
2. **Structured repeaters** for every list: add/remove/reorder rows for interests,
   bullets, highlights, tags, contact links, and clinical duties instead of JSON.
3. **Auto-magic fields.** Generate `slug` from the title; auto-assign
   `sort_order`; default `published`/`is_public` sensibly.
4. **Rich text / Markdown with preview** for prose, and a **dedicated poem
   editor** that renders stanzas live as they are typed.
5. **Preview & drafts.** A "Preview" iframe (or draft URL) before publishing,
   plus scheduled publishing.
6. **Version history and restore.** Even a simple `*_revisions` table (snapshot
   on save) gives "undo", which non-technical users rely on.
7. **Media library.** Upload to Supabase Storage or Cloudflare R2 and pick from
   a gallery; auto alt text; replaces manual path fields.
8. **Friendly validation and toasts.** Field-level errors, plain-language
   messages, styled confirm dialogs, optimistic save feedback.
9. **Self-service account recovery.** Magic-link login and password reset
   (Supabase Auth supports both), plus an owner-only screen to invite editors by
   email (backed by `admin_users`).
10. **Onboarding.** A first-run checklist, "View site" link, and inline help.
11. **Audit log.** Who edited which record and when.

Quick wins vs larger work: items 1-4 and 8-9 are contained UI changes; items 5-7
and 10-11 need schema/Storage additions.

### Architectural limitation to be aware of

The current model cannot let an editor add a *new* section or field that the
site will render, because the public components hardcode which keys they read
(`Hero.tsx`, `About.tsx`, etc.). If the goal is "edit anything without a
developer," the content needs a **block/section registry** (JSON describing
ordered blocks, with a component per block type) or a page-builder — a larger
refactor. If edits are limited to existing copy and records, the forms above are
sufficient.

---

## Option: GitHub/Git-backed CMS ("Instatic"-style)

The user suggested using a GitHub-hosted, instant CMS for editing the workspace.
That is a real and well-trodden pattern: store content as files (Markdown, JSON,
YAML, or MDX) **in the GitHub repository**, let editors use a hosted CMS UI that
commits to GitHub, and let a push trigger a Cloudflare build/deploy. The editor
never sees Supabase or code; content gains full version history via Git.

> Note: I could not verify a product named exactly "Instatic"; if it is a
> specific tool, confirm the name and I will compare it directly. The category
> and the closest maintained options are below.

Candidate tools:

| Tool | Model | Editor UX | Notes |
|---|---|---|---|
| **Pages CMS** (pagescms.org) | GitHub-native, `.pages.yml` config | Clean, modern | Free for public repos; no server to run |
| **Decap CMS** | Git-based, `admin/config.yml` | Mature, familiar | Supports editorial workflow (PR previews) |
| **Sveltia CMS** | Decap-compatible drop-in | Modern Decap replacement | Fast, actively maintained |
| **TinaCMS** | Git-backed + visual editing | Visual/inline editing | Heavier; cloud or self-host |
| **Netlify/Cloudflare Git CMS** | Git-based | Varies | Same pattern, different host |

### Trade-offs vs the current Supabase CMS

| Dimension | Supabase admin (today) | Git/GitHub-backed CMS |
|---|---|---|
| Publish latency | Instant | Requires rebuild/deploy (seconds-minutes) |
| Version history / undo | None | Every edit is a commit; easy rollback |
| Access control | RLS + `admin_users` | GitHub repo permissions / CMS OAuth |
| Non-technical UX | Raw schema forms | Markdown + structured fields, previews |
| Media | Manual paths (no storage) | Native file upload to repo/host |
| Drafts/preview | No | PR/branch preview deployments |
| Roles | owner/editor in DB | GitHub collaborators |
| Offline/DB dependency | Needs Supabase at runtime | Site can be fully static |
| Migration effort | — | Move content out of Supabase into files and refactor `src/lib/content/*` |

### Fit for this project

- **Pros:** Git history replaces a custom audit log; PR previews replace the
  missing draft preview; editors get Markdown rather than JSON; the Supabase
  admin (and its auth surface) can eventually be retired; content becomes
  portable and reviewable.
- **Cons:** The public site currently reads Supabase at runtime
  (`getHomePageData`, `getPublishedPoems`), so adopting a Git CMS means either
  (a) exporting content to repo files and refactoring those loaders to read
  local files at build time, or (b) a hybrid where the Git CMS writes to a build
  step that syncs into Supabase. Cloudflare's "no caching" requirement in
  `PROJECT_IMPLEMENTATION_PLAN.md` also conflicts with a static-rebuild model —
  decide whether instant publish (Supabase) or Git portability (static) wins.

### Recommended path

1. **Short term (highest ROI, keeps Supabase):** rebuild the admin as
   purpose-built section forms with repeaters, poem preview, auto-slug/order, and
   friendly validation (the "quick wins" above).
2. **Medium term:** add revision history, media storage, and self-service auth
   (magic link / reset / invites).
3. **Long term, if the goal is to remove the custom admin:** migrate content to
   `content/**` files and adopt **Pages CMS** or **Decap/Sveltia** with a GitHub
   Action + Cloudflare deploy hook, then retire `/admin` and its RLS/auth
   surface. Choose this only if slightly delayed publishing and Markdown authoring
   are acceptable.

**Decision guardrail:** if editors need instant, granular, database-driven
content, invest in the Supabase admin UX. If the priority is a simple,
maintainable, version-controlled editing workflow for a mostly static site,
the GitHub-backed CMS is the better long-term fit.

---

## Suggested test matrix

| Area | Covered by | Notes |
|---|---|---|
| Home structure, SEO, JSON-LD | `e2e/home.spec.ts`, `e2e/seo.spec.ts` | desktop + mobile |
| Clinical matcher interaction | `e2e/clinical-matcher.spec.ts` | selection, live region |
| Research modal | `e2e/research-modal.spec.ts` | open/close/escape/backdrop/scroll-lock |
| Poetry list + detail | `e2e/poetry.spec.ts` | graceful empty state, 404 |
| Admin login & redirects | `e2e/admin.spec.ts` | redirects skip without env |
| Admin full auth flow | `e2e/admin-auth.spec.ts` | set `ADMIN_TEST_EMAIL/PASSWORD` |
| Unit (formatting) | `src/lib/content/poems.test.ts` | extend for parsers |

Run everything with:

```bash
npx playwright install chromium
npm test          # unit
npm run test:e2e  # end-to-end
```

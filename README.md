# NexLearn — Student Dashboard

A premium learning dashboard built with Next.js 16, Supabase, Framer Motion, and Tailwind CSS v4. Tracks course progress, learning streaks, and study activity in a modern dark-mode UI.

![Dashboard preview](./public/preview.png)

---

## Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 16 (App Router) | RSC, Suspense streaming, file-based routing |
| Database | Supabase (PostgreSQL) | Managed Postgres, RLS, real-time ready |
| Auth client | `@supabase/ssr` | Secure server-side client with cookie handling |
| Styling | Tailwind CSS v4 + vanilla CSS | Design tokens via CSS custom properties |
| Animation | Framer Motion | Spring physics, layout animations, stagger |
| Language | TypeScript (strict) | End-to-end type safety |
| Icons | Lucide React | Tree-shakeable, consistent icon set |

---

## Project structure

```
app/
  layout.tsx          Root layout (metadata, fonts)
  page.tsx            Dashboard page — Server Component
  loading.tsx         Route-level loading skeleton
  error.tsx           Route-level error boundary (Client Component)
  globals.css         Design tokens, utility classes, keyframes

components/
  layout/
    DashboardShell    Root shell: sidebar + main content
    Sidebar           Desktop sidebar with layoutId nav animation
    BottomNav         Mobile bottom bar with layoutId active pill
  dashboard/
    HeroTile          Personalised greeting + streak ring
    StatsRow          XP / hours / rank stat cards
    CourseGrid        Staggered grid + empty state
    CourseTile        Individual course card (dynamic icon, progress bar, grain)
    ActivityTile      GitHub-style heatmap with AnimatePresence tooltip
  ui/
    Badge             Colour-variant status badge
    GlowCard          Glassmorphism card wrapper
    Skeleton          Pulse skeleton + CourseGridSkeleton
    ErrorState        Reusable error fallback + CoursesSectionError
    StreakRing        Animated SVG streak ring

lib/
  supabase/
    client.ts         Browser-side Supabase client (@supabase/ssr)
    server.ts         Server-side Supabase client (RSC / Route Handlers)
  data/
    courses.ts        Server-only data layer — returns CoursesResult union
  mock-data.ts        User profile + activity data (until auth is wired)
  utils.ts            cn(), formatNumber(), daysAgo(), activityLevel()

types/
  index.ts            Shared TypeScript interfaces (Course, UserProfile, …)

supabase/
  migrations/
    20260602_create_courses.sql   Table DDL + seed data
```

---

## Server / Client split

Next.js App Router makes the boundary explicit.

**Server Components** (no `"use client"` directive):
- `app/page.tsx` — fetches Supabase data, composes the page
- `app/layout.tsx` — static metadata and HTML shell
- `app/loading.tsx` — route-level skeleton (rendered by the framework)
- `lib/data/courses.ts` — all DB queries live here

**Client Components** (`"use client"` at the top):
- Everything in `components/` — they receive data as props from the server
- `app/error.tsx` — Next.js requires error boundaries to be Client Components

This keeps secrets (Supabase URL, anon key) server-side. Nothing from the DB client ever ships to the browser.

---

## Supabase setup

### 1. Create a project

Go to [supabase.com](https://supabase.com) → New project.

### 2. Run the migration

Open **SQL Editor** in your Supabase dashboard and paste the contents of:

```
supabase/migrations/20260602_create_courses.sql
```

This creates the `courses` table with RLS enabled (anon read allowed) and inserts four seed rows.

### 3. Add environment variables

Copy `.env.example` to `.env.local` and fill in your project credentials:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Find both values in: **Supabase Dashboard → Settings → API**.

### 4. Schema

```sql
courses (
  id               uuid        primary key
  title            text
  progress         integer     0–100
  icon_name        text        must match a key in CourseTile's icon registry
  instructor       text
  color            text        hex colour used for accent/glow
  category         text
  total_lessons    integer
  completed_lessons integer
  created_at       timestamptz
)
```

Supported `icon_name` values: `Brain`, `Atom`, `Cpu`, `Network`, `Calculator`, `Code`, `BookOpen`, `FlaskConical`, `Globe`, `Layers`, `Lightbulb`, `Music`, `Palette`, `Sigma`, `Terminal`. Unknown names fall back to `BookOpen` — no runtime crash.

---

## Running locally

```bash
npm install
npm run dev        # starts on http://localhost:3000
```

---

## Deploying to Vercel

1. Push to GitHub (already done).
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Add the two environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy. Vercel auto-detects Next.js and runs `next build`.

---

## Key design decisions

**Streaming with Suspense** — `CoursesSection` is an async Server Component wrapped in `<Suspense>`. The hero, stats, and activity tiles render immediately while the Supabase fetch completes in parallel. The skeleton pulses until real data arrives, then springs in.

**Typed error handling** — `getCourses()` returns a discriminated union (`CoursesResult`) instead of throwing. The page can cleanly distinguish "fetch failed" (show `CoursesSectionError`) from "empty table" (show `CourseGrid`'s empty state).

**Animation** — Framer Motion spring physics throughout (`stiffness: 300, damping: 20`). CSS `transform` is never mixed with Framer Motion on the same element to avoid conflicts. All hover effects use `transform` and `box-shadow` only — no layout-triggering properties.

**Grain texture** — Each course card has a `.card-grain` pseudo-element using an inline SVG noise filter (no network request, no external image). Opacity is low (3.5%) — visible only on close inspection.

**`prefers-reduced-motion`** — All CSS animations collapse to instant for users who opt out via OS accessibility settings. Framer Motion respects this automatically via its `useReducedMotion` hook.

---

## Known limitations / future work

- User profile data is still mocked (`MOCK_USER`). Wire up `supabase.auth.getUser()` to replace it.
- Activity heatmap data is seeded client-side. Add a `study_sessions` table and aggregate by date.
- No pagination on courses. Add Supabase `.range()` once the course count grows.
- `icon_name` is a free-text column. A `CHECK` constraint listing valid values would prevent typos.

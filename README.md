# NexLearn — Student Dashboard

A **dark-mode Bento Grid** learning dashboard built with Next.js 16 App Router, Supabase, Framer Motion, and Tailwind CSS v4. Designed as a frontend internship submission.

---

## Live demo

> Add your Vercel deployment URL here after deploying.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, RSC, Streaming) |
| Database | Supabase (PostgreSQL + RLS) |
| Auth client | `@supabase/ssr` — server-side cookie handling |
| Styling | Tailwind CSS v4 + vanilla CSS custom properties |
| Animation | Framer Motion — spring physics, variants, layoutId |
| Language | TypeScript (strict) |
| Icons | Lucide React (tree-shakeable) |
| Fonts | Inter (UI) + JetBrains Mono (numbers) via Google Fonts |

---

## Bento Grid layout

The dashboard uses a **12-column CSS Grid** (no JavaScript layout engine). Each section is a named Bento cell:

```
Desktop (≥ 1024px):
┌─────────────────────────────────┬──────────────┐
│  Hero tile           (8 cols)   │  XP          │  ← row 1
│  Greeting + Streak ring + CTAs  │  Hours       │
│                                 │  Rank        │
├─────────────────────────────────┴──────────────┤
│  Course Grid                    (12 cols)       │  ← row 2
│  3-column sub-grid of CourseTiles               │
├──────────────────────────────────────────────── ┤
│  Activity Heatmap               (12 cols)       │  ← row 3
└─────────────────────────────────────────────────┘

Tablet (640–1023px): 2-col stats, single-col hero/courses/activity
Mobile (<640px):     single column, tiles stack
```

Grid classes are in `app/globals.css` — no JS involved, so there are **zero layout shifts**.

---

## Architecture

### Server / Client split

| File | Boundary | Reason |
|---|---|---|
| `app/page.tsx` | Server | Composes the page; CoursesSection is async |
| `app/layout.tsx` | Server | Static metadata + HTML shell |
| `app/loading.tsx` | Server | Framework-rendered skeleton |
| `app/error.tsx` | **Client** | Next.js requires error boundaries to be client |
| `lib/data/courses.ts` | Server | All DB queries — credentials never leave backend |
| `lib/supabase/server.ts` | Server | `@supabase/ssr` server client |
| All `components/` | **Client** | Receive typed props; own all animation logic |

### Data flow

```
Supabase DB
    │
    ▼
getCourses()           ← lib/data/courses.ts  (server-only)
    │ CoursesResult { ok, courses } | { ok: false, message }
    ▼
CoursesSection         ← async RSC in page.tsx
    │ courses: Course[]
    ▼
<CourseGrid>           ← client component, receives plain data
    │
    ▼
<CourseTile>           ← animates, useInView for progress bar
```

Supabase credentials (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are read by `createServerClient` on the server. They never appear in the browser bundle.

### Error handling

`getCourses()` returns a discriminated union:

```typescript
type CoursesResult =
  | { ok: true;  courses: Course[] }
  | { ok: false; message: string  };
```

- **Supabase error** → `<CoursesSectionError />` (graceful degradation, not a crash)
- **Empty table** → `<EmptyState />` inside `CourseGrid`
- **Unhandled throw** → `app/error.tsx` catches it, shows retry button

---

## Project structure

```
app/
  layout.tsx            Root layout (dark-mode locked, metadata)
  page.tsx              Dashboard page — Bento Grid composition
  loading.tsx           Route skeleton (mirrors bento layout)
  error.tsx             Route error boundary
  globals.css           Design tokens + bento-grid + glass-card

components/
  layout/
    DashboardShell      Sidebar + main content wrapper
    Sidebar             Desktop collapsible nav (layoutId animation)
    BottomNav           Mobile bottom bar (layoutId animation)
  dashboard/
    HeroTile            Left 8-col Bento hero
    StatCard            Individual stat (XP / Hours / Rank)
    CourseGrid          12-col Bento tile wrapping 3-col sub-grid
    CourseTile          Dynamic icon, grain texture, spring progress bar
    ActivityTile        GitHub-style heatmap (AnimatePresence tooltip)
  ui/
    Badge               Colour-variant pill
    Skeleton + CourseGridSkeleton
    ErrorState + CoursesSectionError
    GlowCard
    StreakRing          Animated SVG arc

lib/
  data/courses.ts       Server-only data layer
  supabase/client.ts    Browser client (@supabase/ssr)
  supabase/server.ts    Server client (@supabase/ssr)
  mock-data.ts          User + activity until auth is connected
  utils.ts              cn, formatNumber, daysAgo, activityLevel

types/index.ts          Course, UserProfile, ActivityDay, StatCard
supabase/migrations/    SQL to create and seed the courses table
```

---

## Supabase setup

### 1. Create a project

[supabase.com](https://supabase.com) → New project.

### 2. Run the migration

**SQL Editor → New query** → paste `supabase/migrations/20260602_create_courses.sql` → Run.

Creates the `courses` table with RLS enabled and inserts 4 seed rows.

### 3. Configure environment variables

```bash
cp .env.example .env.local
# fill in your project URL and anon key
```

Find both at **Settings → API** in the Supabase dashboard.

### 4. Schema

```sql
courses (
  id               uuid        PK
  title            text
  progress         integer     0–100
  icon_name        text        key in CourseTile's ICON_MAP
  instructor       text
  color            text        hex  e.g. "#10b981"
  category         text
  total_lessons    integer
  completed_lessons integer
  created_at       timestamptz DEFAULT now()
)
```

**Supported icon_name values**: `Brain`, `Atom`, `Cpu`, `Network`, `Calculator`, `Code`, `BookOpen`, `FlaskConical`, `Globe`, `Layers`, `Lightbulb`, `Music`, `Palette`, `Sigma`, `Terminal`. Unknown names fall back to `BookOpen` — no crash.

---

## Running locally

```bash
npm install
npm run dev       # http://localhost:3000
```

---

## Deploying to Vercel

1. Push to GitHub.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Set two environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

---

## Animation system

All motion uses Framer Motion spring physics — no `duration` tweening:

| Element | Animation |
|---|---|
| Hero tile | `y: 24 → 0` on mount, `y: -2` on hover |
| Stat cards | Slide in from `x: 20`, staggered 80ms each |
| Course tiles | `y: 24 → 0`, staggered 70ms each via parent `Variants` |
| Progress bar | Springs from `width: 0` on first viewport entry (`useInView`) |
| Sidebar nav | `layoutId="sidebar-active-pill"` moves between active items |
| Bottom nav | `layoutId="bottom-nav-pill"` same |
| Heatmap cells | Scale in with 0.6ms inter-cell delay |
| Tooltip | `AnimatePresence` fade + scale |

All hover effects use `transform` + `box-shadow` only — no layout-triggering properties.

`prefers-reduced-motion` collapses all CSS animations to instant. Framer Motion respects this automatically.

---

## Design decisions

**Bento Grid in CSS not JS** — Using `display: grid` with named classes avoids any JS measurement, hydration, or resize observer. Grid dimensions are fixed at parse time — no layout shifts.

**`CoursesResult` discriminated union** — Returning `{ ok, courses }` instead of throwing means the page can cleanly branch between error state and empty state without try/catch in JSX.

**Grain texture via inline SVG** — The `.card-grain::before` pseudo-element uses a base64 SVG noise filter. No network request, no image asset, no CLS.

**`"use client"` boundary at components** — Server Components compose the page and pass plain serialisable props down. Client Components own all interactivity and animation. This keeps the Supabase client strictly server-side.

---

## Known gaps / future work

- User profile is mocked; wire up `supabase.auth.getUser()`
- Activity heatmap uses seeded mock data; add a `study_sessions` table
- No course pagination; add `.range()` when count grows
- `icon_name` is free text; a Postgres `CHECK` constraint would prevent typos

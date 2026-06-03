# NexLearn — Student Dashboard

A futuristic dark-mode student dashboard built with **Next.js 16 App Router**, **React 19**, **Supabase**, and **Framer Motion**. The UI follows a bento-grid layout and streams real course data from a Postgres database while keeping everything else instantly available via mock data.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy the env template and fill in your Supabase credentials
cp .env.local.example .env.local   # set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Run the migration against your Supabase project
# Paste supabase/migrations/20260602_create_courses.sql into the Supabase SQL Editor

# 4. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router) | RSC + streaming Suspense out of the box |
| Language | TypeScript 5 | Full-stack type safety |
| Database | Supabase (Postgres) | Real-time capable, free tier, SSR-friendly SDK |
| Styling | Tailwind CSS v4 + vanilla CSS | Utility classes for layout, custom CSS for design tokens & animations |
| Animation | Framer Motion | Declarative spring animations with SSR-safe motion |
| Icons | Lucide React | Tree-shakeable, consistent icon set |
| Utilities | clsx + tailwind-merge | Conditional class composition without duplication |

---

## Architectural Choices

### Bento Grid Layout

The main dashboard is structured as a 12-column CSS grid (`bento-grid` in `globals.css`). Each tile occupies a named area:

```
┌──────────────────────────┬────────────┐
│  HeroTile   (8 cols)     │ Stats col  │
│                          │ (4 cols,   │
│                          │ 3 cards)   │
├──────────────────────────┴────────────┤
│  CourseGrid              (12 cols)    │
├───────────────────────────────────────┤
│  ActivityTile heatmap    (12 cols)    │
└───────────────────────────────────────┘
```

Grid areas collapse to a single column on mobile. The sidebar is replaced by a bottom navigation bar (`BottomNav`) at `< md` breakpoints so the full viewport is available for content.

### Data Flow — Two-tier Strategy

The dashboard deliberately uses two data sources to show both static and dynamic patterns:

| Tile | Source | Why |
|---|---|---|
| HeroTile, Stats, Activity | `lib/mock-data.ts` | Instantly available, zero latency, no auth required |
| CourseGrid | Supabase `courses` table | Demonstrates real async data fetching via RSC |

The `getCourses()` function in `lib/data/courses.ts` wraps the Supabase query in a **tagged union result type** (`{ ok: true; courses } | { ok: false; message }`). This keeps error handling explicit without `try/catch` at the call site, and surfaces a graceful `CoursesSectionError` fallback instead of crashing the page.

---

## Server / Client Component Split

Next.js App Router defaults every component to a **Server Component (RSC)**. The split decision was made by asking: *"Does this component need the browser?"*

### Server Components (no `"use client"`)

| File | Reason |
|---|---|
| `app/page.tsx` | Orchestrates layout; calls `getCourses()` on the server |
| `app/layout.tsx` | Static HTML shell, metadata, font preconnect |
| `lib/data/courses.ts` → `CoursesSection` (async function) | Runs the Supabase query; uses `next/headers` cookies |
| `components/dashboard/HeroTile.tsx` | Pure display, no interactivity |
| `components/dashboard/CourseGrid.tsx` | Renders a list from props, no event handlers |
| `components/dashboard/ActivityTile.tsx` | SVG heatmap calculation, no browser APIs |
| `components/dashboard/StatCard.tsx` | Display only |
| `components/ui/*` (Skeleton, ErrorState, Badge, GlowCard) | Presentational |

### Client Components (`"use client"`)

| File | Why it needs the browser |
|---|---|
| `components/layout/DashboardShell.tsx` | Calls `useSidebar()` hook — needs `useState` |
| `hooks/useSidebar.ts` | Uses `useState` + `useCallback` |
| `components/layout/Sidebar.tsx` | Hover states, collapsible animation via Framer Motion |
| `components/layout/BottomNav.tsx` | Active route highlighting via `usePathname` |
| `components/dashboard/CourseTile.tsx` | Hover animation via Framer Motion |

**Key principle:** The boundary is pushed as far down the tree as possible. `DashboardShell` is a client component purely because it manages sidebar-collapse state — but its `children` prop (which includes all the dashboard tiles) is still server-rendered HTML passed through, so those children never re-render on the client.

### Supabase Client Instantiation

Two separate helpers exist under `lib/supabase/`:

- **`server.ts`** — `createServerClient` from `@supabase/ssr`. Uses Next.js `cookies()` for auth token propagation. Only imported from RSCs or Route Handlers.
- **`client.ts`** — `createBrowserClient` from `@supabase/ssr`. Safe to import from Client Components. Currently unused in UI code (reserved for future real-time subscriptions).

This dual-client pattern avoids the most common Supabase/Next.js pitfall: accidentally importing the server client into a Client Component, which would throw a runtime error because `next/headers` is not available in the browser.

### Streaming with Suspense

`CoursesSection` is an `async` Server Component nested inside `<Suspense>` on the dashboard page:

```tsx
<Suspense fallback={<CourseGridSkeleton count={4} />}>
  <CoursesSection />   {/* awaits Supabase, streams in when ready */}
</Suspense>
```

This means the rest of the page (Hero, Stats, Activity) renders and streams to the browser immediately. The course grid slot shows an animated skeleton and fills in once the DB query resolves — no loading spinners, no client-side fetch waterfalls.

---

## Project Structure

```
student-dashboard/
├── app/
│   ├── layout.tsx          # Root HTML shell, metadata, dark-mode setup
│   ├── page.tsx            # Dashboard page (RSC, bento grid orchestrator)
│   ├── globals.css         # Design tokens, bento grid, animations
│   ├── loading.tsx         # Route-level skeleton (full page)
│   └── error.tsx           # Route-level error boundary
├── components/
│   ├── dashboard/
│   │   ├── HeroTile.tsx    # Welcome card + streak ring (RSC)
│   │   ├── StatCard.tsx    # XP / Hours / Rank cards (RSC)
│   │   ├── StatsRow.tsx    # Stat card row wrapper (RSC)
│   │   ├── CourseGrid.tsx  # Course card grid (RSC)
│   │   ├── CourseTile.tsx  # Individual course card (Client — Framer Motion)
│   │   └── ActivityTile.tsx# GitHub-style heatmap (RSC)
│   ├── layout/
│   │   ├── DashboardShell.tsx # Sidebar + content wrapper (Client — useState)
│   │   ├── Sidebar.tsx     # Desktop nav + collapse (Client — Framer Motion)
│   │   └── BottomNav.tsx   # Mobile nav bar (Client — usePathname)
│   └── ui/
│       ├── Badge.tsx       # Category pill
│       ├── ErrorState.tsx  # Courses fetch error fallback
│       ├── GlowCard.tsx    # Reusable glowing card wrapper
│       ├── Skeleton.tsx    # Loading skeleton components
│       └── StreakRing.tsx  # SVG progress ring
├── hooks/
│   └── useSidebar.ts       # Sidebar open/collapse state
├── lib/
│   ├── data/
│   │   └── courses.ts      # Supabase query + result type
│   ├── supabase/
│   │   ├── server.ts       # SSR Supabase client (server-only)
│   │   └── client.ts       # Browser Supabase client
│   ├── mock-data.ts        # Static user, courses, activity data
│   └── utils.ts            # cn(), formatNumber(), daysAgo()
├── types/
│   └── index.ts            # Shared TypeScript interfaces
└── supabase/
    └── migrations/
        └── 20260602_create_courses.sql  # Schema + seed data
```

---

## Database Schema

```sql
-- courses table (abbreviated)
create table courses (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  instructor      text not null,
  progress        integer check (progress between 0 and 100),
  icon_name       text not null,
  color           text not null,
  category        text not null,
  total_lessons   integer not null,
  completed_lessons integer not null,
  created_at      timestamptz default now()
);
-- Row-Level Security: anon SELECT only
```

The migration file seeds six sample courses matching the mock data for a consistent demo experience. RLS is enabled with an `anon` select-only policy so the public Supabase anon key is safe to ship in the frontend.

---

## Challenges & How They Were Solved

### 1. Keeping the Server/Client Boundary Clean

**Problem:** Framer Motion, `useState`, and `usePathname` are browser-only APIs, but they are needed deep in the component tree (e.g., inside `CourseTile`, which is a child of the server-rendered `CourseGrid`).

**Solution:** Split at the smallest possible boundary. `CourseGrid` (RSC) renders a list and passes each `Course` object as a prop to `CourseTile` (Client). The RSC never uses browser APIs; the Client Component never does async data fetching. RSC-produced children passed as props are treated as already-rendered HTML by React, so they don't hydrate again — only the interactive shell does.

### 2. Supabase Auth Cookie Forwarding in RSCs

**Problem:** `@supabase/ssr`'s server client must read auth cookies to attach the user's JWT to queries, but `next/headers` is async in Next.js 16 (`await cookies()`).

**Solution:** `createClient()` in `lib/supabase/server.ts` is `async` and `await`s `cookies()`. This propagates correctly through the async RSC call chain (`page.tsx` → `CoursesSection` → `getCourses()`) without any middleware.

### 3. Streaming Without Blocking Non-Async Tiles

**Problem:** If course fetching blocks the entire page render, users see nothing until Supabase responds.

**Solution:** Only `CoursesSection` is async; the rest of the page is synchronous. Wrapping only that component in `<Suspense>` means Next.js streams the outer HTML immediately and patches the course grid in when ready. The skeleton uses the same grid dimensions as the real cards to prevent layout shift.

### 4. Seeded Deterministic Mock Activity

**Problem:** A GitHub-style heatmap needs 364 days of data. Random data would change on every render, causing hydration mismatches between server and client.

**Solution:** `generateMockActivity()` uses a linear-congruential PRNG seeded with a fixed constant (`42`). The same sequence is produced on every call — server and client agree without needing `useEffect` or `suppressHydrationWarning`.

### 5. Dark Mode Flash Prevention

**Problem:** Even with Tailwind's dark strategy, browsers can briefly flash a white background before CSS loads.

**Solution:** `color-scheme: dark` is declared in three places simultaneously — as an HTML attribute on `<html>`, as a `<meta>` tag in `<head>`, and in the CSS `:root`. This tells the browser's native form controls, scrollbars, and background to go dark before any stylesheet is parsed.

---

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-public-key>
```

Both variables are prefixed `NEXT_PUBLIC_` so they are available in browser bundles. They are safe to expose because Supabase RLS restricts what the anon key can access.

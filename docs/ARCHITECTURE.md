# Simple CRM - Technical Architecture

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [Data Fetching Patterns](#data-fetching-patterns)
7. [API & Server Actions](#api--server-actions)
8. [UI Architecture](#ui-architecture)
9. [Key Dependencies](#key-dependencies)
10. [Performance Strategy](#performance-strategy)
11. [Deployment](#deployment)
12. [Security](#security)

---

## Overview

Simple CRM is a modern customer relationship management web application built with Next.js 15 (App Router) and Supabase. It provides contact management, company tracking, deal pipeline management with Kanban boards, activity logging, and notes — all with real-time collaboration support and row-level security.

### Design Principles

- **Server-first**: Leverage React Server Components for initial data loads; minimize client-side JavaScript
- **Type-safe end-to-end**: TypeScript everywhere, Zod validation at boundaries, generated Supabase types
- **Secure by default**: Row Level Security on every table, middleware-protected routes, input validation
- **Simple and pragmatic**: No over-abstraction; direct Supabase queries over unnecessary API layers

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript 5 |
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth (email/password, OAuth) |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Forms | React Hook Form + Zod |
| Drag & Drop | @hello-pangea/dnd |
| Dates | date-fns |
| URL State | nuqs |
| Deployment | Vercel (app) + Supabase Cloud (database/auth) |

---

## Project Structure

```
simple-crm-2/
├── docs/
│   └── ARCHITECTURE.md
├── supabase/
│   ├── migrations/          # Numbered SQL migration files
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_rls_policies.sql
│   │   └── 003_indexes.sql
│   ├── seed.sql             # Development seed data
│   └── config.toml          # Supabase local config
├── src/
│   ├── app/
│   │   ├── layout.tsx               # Root layout (providers, fonts, metadata)
│   │   ├── page.tsx                 # Landing/marketing page (public)
│   │   ├── globals.css              # Tailwind imports + CSS variables
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   ├── callback/route.ts    # OAuth callback handler
│   │   │   └── layout.tsx           # Centered auth layout
│   │   └── (dashboard)/
│   │       ├── layout.tsx           # Dashboard shell (sidebar, header, providers)
│   │       ├── dashboard/page.tsx   # Overview / home
│   │       ├── contacts/
│   │       │   ├── page.tsx         # Contact list with search/filter
│   │       │   ├── [id]/page.tsx    # Contact detail view
│   │       │   └── new/page.tsx     # Create contact form
│   │       ├── companies/
│   │       │   ├── page.tsx         # Company list
│   │       │   ├── [id]/page.tsx    # Company detail view
│   │       │   └── new/page.tsx     # Create company form
│   │       ├── deals/
│   │       │   ├── page.tsx         # Kanban board (default view)
│   │       │   ├── list/page.tsx    # Table/list view of deals
│   │       │   ├── [id]/page.tsx    # Deal detail view
│   │       │   └── new/page.tsx     # Create deal form
│   │       ├── activities/
│   │       │   └── page.tsx         # Activity feed/timeline
│   │       └── settings/
│   │           ├── page.tsx         # General settings
│   │           └── profile/page.tsx # Profile settings
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives (button, input, dialog, etc.)
│   │   ├── layout/
│   │   │   ├── sidebar.tsx          # App sidebar navigation
│   │   │   ├── header.tsx           # Top header bar
│   │   │   ├── mobile-nav.tsx       # Mobile navigation drawer
│   │   │   └── breadcrumbs.tsx      # Dynamic breadcrumb trail
│   │   ├── contacts/
│   │   │   ├── contact-form.tsx     # Create/edit contact form
│   │   │   ├── contact-card.tsx     # Contact summary card
│   │   │   └── contact-table.tsx    # Contacts data table
│   │   ├── companies/
│   │   │   ├── company-form.tsx
│   │   │   ├── company-card.tsx
│   │   │   └── company-table.tsx
│   │   ├── deals/
│   │   │   ├── deal-form.tsx
│   │   │   ├── deal-card.tsx        # Kanban card
│   │   │   ├── deal-column.tsx      # Kanban column (stage)
│   │   │   ├── deal-board.tsx       # Kanban board container
│   │   │   └── deal-table.tsx       # Table view
│   │   ├── activities/
│   │   │   ├── activity-form.tsx
│   │   │   ├── activity-timeline.tsx
│   │   │   └── activity-item.tsx
│   │   ├── notes/
│   │   │   ├── note-form.tsx
│   │   │   └── note-list.tsx
│   │   └── shared/
│   │       ├── data-table.tsx       # Reusable table with sorting/filtering
│   │       ├── search-input.tsx     # Search with debounce
│   │       ├── empty-state.tsx      # Empty state illustrations
│   │       ├── loading-skeleton.tsx # Skeleton loaders
│   │       ├── confirm-dialog.tsx   # Reusable confirmation dialog
│   │       └── avatar.tsx           # User/contact avatar
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client (singleton)
│   │   │   ├── server.ts           # Server-side Supabase client (per-request)
│   │   │   ├── middleware.ts        # Supabase auth middleware helper
│   │   │   └── admin.ts            # Service-role client (server-only, for admin ops)
│   │   ├── actions/
│   │   │   ├── contacts.ts         # Contact server actions
│   │   │   ├── companies.ts        # Company server actions
│   │   │   ├── deals.ts            # Deal server actions
│   │   │   ├── activities.ts       # Activity server actions
│   │   │   └── notes.ts            # Note server actions
│   │   ├── queries/
│   │   │   ├── contacts.ts         # Contact query functions (for RSC)
│   │   │   ├── companies.ts        # Company query functions
│   │   │   ├── deals.ts            # Deal query functions
│   │   │   ├── activities.ts       # Activity query functions
│   │   │   └── dashboard.ts        # Dashboard aggregate queries
│   │   ├── validations/
│   │   │   ├── contact.ts          # Contact Zod schemas
│   │   │   ├── company.ts          # Company Zod schemas
│   │   │   ├── deal.ts             # Deal Zod schemas
│   │   │   ├── activity.ts         # Activity Zod schemas
│   │   │   └── note.ts             # Note Zod schemas
│   │   └── utils.ts                # General utility functions (cn, formatCurrency, etc.)
│   ├── types/
│   │   ├── database.ts             # Auto-generated Supabase types (supabase gen types)
│   │   └── index.ts                # App-level type aliases and derived types
│   ├── hooks/
│   │   ├── use-realtime.ts         # Generic Supabase realtime subscription hook
│   │   ├── use-debounce.ts         # Debounced value hook
│   │   └── use-optimistic-action.ts # Optimistic update wrapper for server actions
│   └── middleware.ts               # Next.js middleware (auth gate)
├── public/
│   └── images/                     # Static assets
├── .env.local                      # Local env vars (NEXT_PUBLIC_SUPABASE_URL, etc.)
├── .env.example                    # Template env file
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json
└── README.md
```

### Route Group Conventions

- `(auth)` — Public routes for authentication (login, signup, password reset). Uses a centered, minimal layout.
- `(dashboard)` — Protected routes requiring authentication. Uses the full app shell layout (sidebar + header).

---

## Database Schema

### Entity Relationship Diagram

```
users (Supabase Auth)
  │
  ├── 1:1 ── profiles
  │
  ├── 1:N ── contacts ──── N:1 ── companies
  │              │
  │              ├── 1:N ── activities
  │              ├── 1:N ── notes
  │              └── N:M ── deals (via deal_contacts)
  │
  ├── 1:N ── companies
  │              │
  │              ├── 1:N ── deals
  │              └── 1:N ── notes
  │
  └── 1:N ── deals ──── N:1 ── deal_stages
                 │
                 ├── 1:N ── activities
                 └── 1:N ── notes
```

### Table Definitions

#### `profiles`
Extends Supabase Auth users with app-specific data.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  job_title TEXT,
  timezone TEXT DEFAULT 'UTC',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `companies`

```sql
CREATE TABLE companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  domain TEXT,                    -- e.g. "acme.com"
  industry TEXT,
  size TEXT,                      -- e.g. "1-10", "11-50", "51-200", "201-500", "500+"
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `contacts`

```sql
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  job_title TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'lead')),
  source TEXT,                    -- e.g. "website", "referral", "cold-call"
  avatar_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `deal_stages`
Configurable pipeline stages.

```sql
CREATE TABLE deal_stages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,             -- e.g. "Qualification", "Proposal", "Negotiation"
  display_order INT NOT NULL,     -- Position in pipeline
  color TEXT,                     -- Hex color for UI
  is_won BOOLEAN NOT NULL DEFAULT false,
  is_lost BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `deals`

```sql
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  stage_id UUID NOT NULL REFERENCES deal_stages(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  value NUMERIC(12,2),            -- Deal monetary value
  currency TEXT NOT NULL DEFAULT 'USD',
  expected_close_date DATE,
  probability INT CHECK (probability BETWEEN 0 AND 100),
  description TEXT,
  position INT NOT NULL DEFAULT 0, -- Order within stage column (for Kanban)
  won_at TIMESTAMPTZ,
  lost_at TIMESTAMPTZ,
  lost_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `deal_contacts`
Many-to-many join table between deals and contacts.

```sql
CREATE TABLE deal_contacts (
  deal_id UUID NOT NULL REFERENCES deals(id) ON DELETE CASCADE,
  contact_id UUID NOT NULL REFERENCES contacts(id) ON DELETE CASCADE,
  role TEXT,                      -- e.g. "decision-maker", "influencer", "champion"
  PRIMARY KEY (deal_id, contact_id)
);
```

#### `activities`

```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'task', 'note')),
  title TEXT NOT NULL,
  description TEXT,
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

#### `notes`

```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id) ON DELETE SET NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### Row Level Security (RLS) Policies

All tables use RLS to ensure users can only access their own data. Pattern applied to every table:

```sql
-- Enable RLS
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Users can only see their own rows
CREATE POLICY "Users can view own contacts"
  ON contacts FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert rows they own
CREATE POLICY "Users can create own contacts"
  ON contacts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own rows
CREATE POLICY "Users can update own contacts"
  ON contacts FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own rows
CREATE POLICY "Users can delete own contacts"
  ON contacts FOR DELETE
  USING (auth.uid() = user_id);
```

For `profiles`:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

For `deal_contacts` (join table — access scoped through the deal's user_id):

```sql
ALTER TABLE deal_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage deal_contacts for own deals"
  ON deal_contacts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM deals WHERE deals.id = deal_contacts.deal_id AND deals.user_id = auth.uid()
    )
  );
```

### Indexes

```sql
-- Contacts
CREATE INDEX idx_contacts_user_id ON contacts(user_id);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_status ON contacts(user_id, status);
CREATE INDEX idx_contacts_name ON contacts(user_id, last_name, first_name);

-- Companies
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_companies_name ON companies(user_id, name);

-- Deals
CREATE INDEX idx_deals_user_id ON deals(user_id);
CREATE INDEX idx_deals_stage_id ON deals(stage_id);
CREATE INDEX idx_deals_company_id ON deals(company_id);
CREATE INDEX idx_deals_stage_position ON deals(user_id, stage_id, position);

-- Activities
CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_contact_id ON activities(contact_id);
CREATE INDEX idx_activities_deal_id ON activities(deal_id);
CREATE INDEX idx_activities_due_date ON activities(user_id, due_date) WHERE NOT is_completed;

-- Notes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_contact_id ON notes(contact_id);
CREATE INDEX idx_notes_deal_id ON notes(deal_id);
CREATE INDEX idx_notes_company_id ON notes(company_id);

-- Deal Stages
CREATE INDEX idx_deal_stages_user_order ON deal_stages(user_id, display_order);
```

### Automatic `updated_at` Trigger

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON companies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON deals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON activities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON notes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### Default Deal Stages Seed

```sql
-- Seeded per-user on first login via a database function or server action
INSERT INTO deal_stages (user_id, name, display_order, color, is_won, is_lost) VALUES
  ($user_id, 'Qualification', 0, '#6366f1', false, false),
  ($user_id, 'Meeting Scheduled', 1, '#8b5cf6', false, false),
  ($user_id, 'Proposal Sent', 2, '#a855f7', false, false),
  ($user_id, 'Negotiation', 3, '#f59e0b', false, false),
  ($user_id, 'Closed Won', 4, '#22c55e', true, false),
  ($user_id, 'Closed Lost', 5, '#ef4444', false, true);
```

---

## Authentication & Authorization

### Auth Flow

```
Browser                     Next.js Middleware          Supabase Auth
  │                              │                          │
  ├── Request /dashboard ──────► │                          │
  │                              ├── Check session cookie ──►│
  │                              │◄── Session valid/invalid ─┤
  │                              │                          │
  │  (if invalid)                │                          │
  │◄── Redirect to /login ──────┤                          │
  │                              │                          │
  │  (if valid)                  │                          │
  │◄── Continue to page ────────┤                          │
```

### Middleware (`src/middleware.ts`)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protected routes: redirect to login if no user
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Auth routes: redirect to dashboard if already logged in
  if (user && ['/login', '/signup'].includes(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|images/).*)'],
}
```

### Supabase Client Setup

**Server client** (`src/lib/supabase/server.ts`) — used in Server Components and Server Actions:

```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options))
        },
      },
    }
  )
}
```

**Browser client** (`src/lib/supabase/client.ts`) — used in Client Components:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### Session Management

- Supabase Auth stores sessions in cookies via `@supabase/ssr`
- Middleware refreshes tokens on every request automatically
- The `auth.getUser()` call in middleware validates the JWT with Supabase (not just decoding locally)
- On sign-out, cookies are cleared and the user is redirected to `/login`

### Profile Creation on Sign-Up

A Supabase database function automatically creates a profile when a new user signs up:

```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## Data Fetching Patterns

### Pattern 1: React Server Components (Initial Load)

Used for page-level data fetching. Data is fetched on the server, serialized, and sent as HTML.

```typescript
// src/app/(dashboard)/contacts/page.tsx
import { createClient } from '@/lib/supabase/server'
import { ContactTable } from '@/components/contacts/contact-table'

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>
}) {
  const { q, status, page } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('contacts')
    .select('*, company:companies(id, name)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(((Number(page) || 1) - 1) * 20, (Number(page) || 1) * 20 - 1)

  if (q) {
    query = query.or(`first_name.ilike.%${q}%,last_name.ilike.%${q}%,email.ilike.%${q}%`)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: contacts, count } = await query

  return <ContactTable contacts={contacts ?? []} totalCount={count ?? 0} />
}
```

### Pattern 2: Server Actions (Mutations)

Used for create, update, delete operations. Defined in `src/lib/actions/`.

```typescript
// src/lib/actions/contacts.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { contactSchema } from '@/lib/validations/contact'

export async function createContact(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')

  const raw = Object.fromEntries(formData)
  const validated = contactSchema.parse(raw)

  const { error } = await supabase
    .from('contacts')
    .insert({ ...validated, user_id: user.id })

  if (error) throw new Error(error.message)

  revalidatePath('/contacts')
}
```

### Pattern 3: Optimistic Updates (Client-Side)

Used for interactions that should feel instant (e.g., Kanban drag-and-drop, toggling activity completion).

```typescript
// src/hooks/use-optimistic-action.ts
import { useOptimistic, useTransition } from 'react'

export function useOptimisticAction<T>(
  currentState: T,
  updateFn: (state: T, optimisticValue: Partial<T>) => T
) {
  const [optimisticState, addOptimistic] = useOptimistic(currentState, updateFn)
  const [isPending, startTransition] = useTransition()

  return { optimisticState, addOptimistic, isPending, startTransition }
}
```

### Pattern 4: Real-Time Subscriptions

Used sparingly for the deal Kanban board to keep it synced across tabs/sessions.

```typescript
// src/hooks/use-realtime.ts
'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'

export function useRealtime<T extends { [key: string]: unknown }>(
  table: string,
  filter: string | undefined,
  onChange: (payload: RealtimePostgresChangesPayload<T>) => void
) {
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`${table}-changes`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter },
        onChange
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [table, filter, onChange])
}
```

### Data Flow Summary

```
┌─────────────────────────────────────────────────────┐
│                    Page Request                       │
│                                                       │
│  Server Component ──► lib/queries/*.ts ──► Supabase  │
│       │                                               │
│       ▼                                               │
│  Client Component (interactive parts only)            │
│       │                                               │
│       ├── Form submit ──► Server Action ──► Supabase │
│       │       │                                       │
│       │       └── revalidatePath() ──► Re-render     │
│       │                                               │
│       ├── Optimistic update (useOptimistic)           │
│       │                                               │
│       └── Real-time subscription (deals board only)   │
└─────────────────────────────────────────────────────┘
```

---

## API & Server Actions

### Server Action Organization

Each entity has its own action file in `src/lib/actions/`:

| File | Actions |
|------|---------|
| `contacts.ts` | `createContact`, `updateContact`, `deleteContact` |
| `companies.ts` | `createCompany`, `updateCompany`, `deleteCompany` |
| `deals.ts` | `createDeal`, `updateDeal`, `deleteDeal`, `moveDeal` (stage change), `reorderDeals` (Kanban position) |
| `activities.ts` | `createActivity`, `updateActivity`, `deleteActivity`, `toggleActivityComplete` |
| `notes.ts` | `createNote`, `updateNote`, `deleteNote` |

### Validation Pattern

All server actions validate input with Zod before database operations:

```typescript
// src/lib/validations/contact.ts
import { z } from 'zod'

export const contactSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().max(30).optional().or(z.literal('')),
  job_title: z.string().max(100).optional().or(z.literal('')),
  company_id: z.string().uuid().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive', 'lead']).default('active'),
  source: z.string().max(50).optional().or(z.literal('')),
})

export type ContactFormValues = z.infer<typeof contactSchema>
```

### Query Organization

Read queries for Server Components are in `src/lib/queries/`:

```typescript
// src/lib/queries/dashboard.ts
import { createClient } from '@/lib/supabase/server'

export async function getDashboardStats() {
  const supabase = await createClient()

  const [contacts, deals, activities] = await Promise.all([
    supabase.from('contacts').select('id', { count: 'exact', head: true }),
    supabase.from('deals').select('id, value, stage:deal_stages(is_won)'),
    supabase.from('activities').select('id', { count: 'exact', head: true })
      .eq('is_completed', false)
      .lte('due_date', new Date().toISOString()),
  ])

  return {
    totalContacts: contacts.count ?? 0,
    totalDealValue: deals.data?.reduce((sum, d) => sum + (Number(d.value) || 0), 0) ?? 0,
    wonDeals: deals.data?.filter(d => (d.stage as any)?.is_won).length ?? 0,
    overdueActivities: activities.count ?? 0,
  }
}
```

---

## UI Architecture

### Component Hierarchy

```
RootLayout
├── (auth)/layout.tsx                    # Minimal centered layout
│   └── Login / Signup / ForgotPassword
│
└── (dashboard)/layout.tsx               # Full app shell
    ├── Sidebar                          # Left nav (collapsible)
    ├── Header                           # Top bar (search, profile menu)
    └── <page content>                   # Route-specific content
        ├── Data tables (contacts, companies)
        ├── Kanban board (deals)
        ├── Detail views (contact/company/deal)
        └── Forms (create/edit)
```

### shadcn/ui Components Used

Core primitives installed from shadcn/ui:

- `button`, `input`, `label`, `textarea` — Form elements
- `dialog`, `sheet`, `popover` — Overlays
- `select`, `command` — Dropdowns and command palette
- `table` — Data tables
- `card` — Content containers
- `badge` — Status indicators
- `avatar` — User/contact avatars
- `dropdown-menu` — Context menus
- `toast` (via `sonner`) — Notifications
- `skeleton` — Loading states
- `tabs` — View switching
- `separator` — Visual dividers
- `form` — React Hook Form integration

### Form Pattern

All forms use React Hook Form with Zod resolver:

```typescript
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactSchema, type ContactFormValues } from '@/lib/validations/contact'
import { createContact } from '@/lib/actions/contacts'

export function ContactForm() {
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { first_name: '', last_name: '', status: 'active' },
  })

  async function onSubmit(values: ContactFormValues) {
    const formData = new FormData()
    Object.entries(values).forEach(([key, val]) => {
      if (val !== undefined && val !== '') formData.append(key, val)
    })
    await createContact(formData)
  }

  return <form onSubmit={form.handleSubmit(onSubmit)}>{/* fields */}</form>
}
```

### URL State Management (nuqs)

Search, filter, sort, and pagination state is managed via URL search params using `nuqs`:

```typescript
'use client'

import { useQueryState, parseAsString, parseAsInteger } from 'nuqs'

export function useContactFilters() {
  const [search, setSearch] = useQueryState('q', parseAsString.withDefault(''))
  const [status, setStatus] = useQueryState('status', parseAsString.withDefault(''))
  const [page, setPage] = useQueryState('page', parseAsInteger.withDefault(1))

  return { search, setSearch, status, setStatus, page, setPage }
}
```

This keeps filter state shareable via URL and supports browser back/forward navigation.

### Kanban Board (Deals)

The deal pipeline uses `@hello-pangea/dnd` for drag-and-drop between stage columns:

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Qualification│  │  Meeting    │  │  Proposal   │  │ Negotiation │
│             │  │  Scheduled  │  │  Sent       │  │             │
│ ┌─────────┐ │  │ ┌─────────┐ │  │             │  │ ┌─────────┐ │
│ │ Deal A  │ │  │ │ Deal C  │ │  │             │  │ │ Deal E  │ │
│ │ $5,000  │ │  │ │ $12,000 │ │  │             │  │ │ $8,500  │ │
│ └─────────┘ │  │ └─────────┘ │  │             │  │ └─────────┘ │
│ ┌─────────┐ │  │             │  │             │  │             │
│ │ Deal B  │ │  │             │  │             │  │             │
│ │ $3,200  │ │  │             │  │             │  │             │
│ └─────────┘ │  │             │  │             │  │             │
└─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

On drag end:
1. Optimistically update the UI
2. Call `moveDeal` server action with new `stage_id` and `position`
3. `revalidatePath('/deals')` on success
4. Revert optimistic state on error

---

## Key Dependencies

```json
{
  "dependencies": {
    "next": "^15.1",
    "react": "^19.0",
    "react-dom": "^19.0",
    "@supabase/supabase-js": "^2.47",
    "@supabase/ssr": "^0.5",
    "tailwindcss": "^4.0",
    "@tailwindcss/postcss": "^4.0",
    "class-variance-authority": "^0.7",
    "clsx": "^2.1",
    "tailwind-merge": "^2.6",
    "lucide-react": "^0.468",
    "react-hook-form": "^7.54",
    "@hookform/resolvers": "^3.9",
    "zod": "^3.24",
    "@hello-pangea/dnd": "^17.0",
    "date-fns": "^4.1",
    "nuqs": "^2.2",
    "sonner": "^1.7"
  },
  "devDependencies": {
    "typescript": "^5.7",
    "@types/react": "^19.0",
    "@types/react-dom": "^19.0",
    "supabase": "^2.10"
  }
}
```

### Dependency Rationale

| Dependency | Why |
|-----------|-----|
| `@supabase/ssr` | Cookie-based auth for Next.js App Router (replaces deprecated `@supabase/auth-helpers-nextjs`) |
| `class-variance-authority` | Type-safe component variant styling (used by shadcn/ui) |
| `tailwind-merge` | Merge Tailwind classes without conflicts (used by `cn()` utility) |
| `lucide-react` | Icon library (used by shadcn/ui) |
| `sonner` | Toast notification library (integrates with shadcn/ui) |
| `nuqs` | Type-safe URL search param state management for Next.js |
| `@hello-pangea/dnd` | Maintained fork of react-beautiful-dnd; accessible drag-and-drop |

---

## Performance Strategy

### Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` (landing) | Static (SSG) | Marketing page, no dynamic data |
| `/login`, `/signup` | Static (SSG) | Auth forms are static shells |
| `/dashboard` | Dynamic (SSR) | Aggregated stats must be fresh |
| `/contacts`, `/companies` | Dynamic (SSR) | User-specific data, search/filter params |
| `/deals` | Dynamic (SSR) | Real-time Kanban state |
| `/contacts/[id]` | Dynamic (SSR) | User-specific detail |
| `/settings` | Dynamic (SSR) | User-specific |

### Optimizations

1. **Streaming with Suspense**: Wrap slow data fetches in `<Suspense>` with skeleton fallbacks so the page shell renders instantly.

   ```tsx
   <Suspense fallback={<DashboardSkeleton />}>
     <DashboardStats />
   </Suspense>
   ```

2. **Parallel Data Fetching**: Use `Promise.all()` in server components for independent queries.

3. **Pagination**: All list views are paginated (20 items per page) to limit query size. No infinite scroll (simpler, more predictable).

4. **Image Optimization**: Use `next/image` for avatars with appropriate `sizes` attribute. Avatar images served from Supabase Storage with automatic resizing.

5. **Bundle Optimization**:
   - Most logic lives in Server Components (zero client JS)
   - Client Components are leaf nodes (forms, interactive tables, Kanban board)
   - Dynamic imports for heavy client components: `dynamic(() => import('./deal-board'), { ssr: false })`
   - `@hello-pangea/dnd` loaded only on `/deals` route

6. **Database Performance**:
   - Indexes on all foreign keys and commonly filtered columns (see [Indexes](#indexes))
   - Partial index on activities for overdue queries
   - Supabase connection pooling via Supavisor (built-in)

---

## Deployment

### Infrastructure

```
┌──────────────┐         ┌──────────────────────┐
│    Vercel     │         │    Supabase Cloud     │
│              │         │                      │
│  Next.js App  │ ──────► │  PostgreSQL Database  │
│  (Edge + Node)│         │  Auth Service         │
│              │         │  Storage (avatars)    │
│  CDN (static) │         │  Realtime Server      │
└──────────────┘         └──────────────────────┘
```

### Environment Variables

```bash
# .env.local (and Vercel environment settings)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...     # Server-only, never exposed to client
```

### Deployment Workflow

1. Push to `main` branch triggers Vercel deployment
2. Supabase migrations applied via `supabase db push` or Supabase Dashboard
3. Preview deployments on PRs (Vercel) with separate Supabase project for staging

---

## Security

### Defense in Depth

1. **Row Level Security**: Every table has RLS policies. Even if application code has a bug, the database enforces access control.

2. **Input Validation**: All mutations validate input with Zod schemas before hitting the database. Never trust client data.

3. **Auth Verification**: Server Actions always call `supabase.auth.getUser()` (which validates the JWT with Supabase's auth server) before any mutation. Never rely on just decoding the JWT locally.

4. **CSRF Protection**: Server Actions in Next.js have built-in CSRF protection via the `__next_action_id` header.

5. **SQL Injection Prevention**: Supabase client uses parameterized queries. No raw SQL in application code.

6. **Environment Variables**: `SUPABASE_SERVICE_ROLE_KEY` is server-only (no `NEXT_PUBLIC_` prefix). Only the anon key is exposed to the browser.

7. **Content Security**: `next/image` prevents serving arbitrary external images. Supabase Storage handles file uploads with size limits and type validation.

---

## Appendix: Type Generation

Generate TypeScript types from the Supabase database schema:

```bash
npx supabase gen types typescript --project-id <project-id> > src/types/database.ts
```

Then create convenient aliases in `src/types/index.ts`:

```typescript
import type { Database } from './database'

export type Contact = Database['public']['Tables']['contacts']['Row']
export type ContactInsert = Database['public']['Tables']['contacts']['Insert']
export type ContactUpdate = Database['public']['Tables']['contacts']['Update']

export type Company = Database['public']['Tables']['companies']['Row']
export type Deal = Database['public']['Tables']['deals']['Row']
export type DealStage = Database['public']['Tables']['deal_stages']['Row']
export type Activity = Database['public']['Tables']['activities']['Row']
export type Note = Database['public']['Tables']['notes']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']

// Joined types for common queries
export type ContactWithCompany = Contact & {
  company: Pick<Company, 'id' | 'name'> | null
}

export type DealWithStage = Deal & {
  stage: DealStage
}

export type DealWithDetails = Deal & {
  stage: DealStage
  company: Pick<Company, 'id' | 'name'> | null
  contacts: Pick<Contact, 'id' | 'first_name' | 'last_name'>[]
}
```

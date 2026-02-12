# Simple CRM - System Specification

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Core Features](#2-core-features)
3. [User Stories](#3-user-stories)
4. [Data Model](#4-data-model)
5. [Authentication & Authorization](#5-authentication--authorization)
6. [Tech Stack](#6-tech-stack)
7. [API Design](#7-api-design)
8. [Non-Functional Requirements](#8-non-functional-requirements)

---

## 1. Product Overview

### 1.1 What Is Simple CRM?

Simple CRM is a lightweight, modern customer relationship management application designed for small teams and startups. It provides an intuitive interface for managing contacts, companies, deals, activities, and notes — all in one place.

### 1.2 Target Users

- **Startup founders** who have outgrown spreadsheets and need a structured way to track leads and customers
- **Small sales teams** (2–20 people) who need pipeline visibility without the complexity of enterprise CRMs
- **Freelancers and consultants** who want to keep track of clients and opportunities
- **Customer success teams** managing ongoing relationships and renewals

### 1.3 Design Principles

- **Simplicity first**: Require minimal setup, minimal fields to create records, and deliver value immediately
- **Speed**: Fast page loads, instant search, responsive interactions
- **Clarity**: Clean UI with clear information hierarchy; no feature bloat
- **Collaboration**: Real-time data sharing across team members with role-based access

### 1.4 Key Differentiators

- Zero-config setup — sign up and start using immediately
- Modern, responsive UI built with shadcn/ui components
- Open-source friendly tech stack (Next.js + Supabase)
- Fast global search across all entities
- Kanban-style deal pipeline with drag-and-drop

---

## 2. Core Features

### 2.1 Dashboard

The dashboard is the home screen after login, providing an at-a-glance overview of CRM activity.

**Metrics Cards:**
- Total contacts count (with trend vs. last period)
- Open deals count and total pipeline value
- Deals won this month (count and value)
- Overdue activities count

**Recent Activity Feed:**
- Chronological list of recent actions across the CRM (new contacts added, deals moved, notes created, activities completed)
- Each entry shows: action type, entity name, user who performed it, timestamp
- Clickable entries to navigate to the relevant record

**Pipeline Summary:**
- Mini pipeline visualization showing deal count and value per stage
- Quick link to the full pipeline view

**Upcoming Activities:**
- List of the next 5–10 activities due (tasks, calls, meetings)
- Shows: activity type, subject, associated contact/deal, due date
- Quick-complete action button

### 2.2 Contacts Management

Contacts are individual people tracked in the CRM.

**CRUD Operations:**
- Create contact with minimal required fields (name, email)
- View contact detail page with all associated data (company, deals, activities, notes)
- Edit contact inline or via detail page
- Delete contact with soft-delete (moves to trash, recoverable for 30 days)

**Contact Fields:**
- First name, last name (required: at least one)
- Email address (optional, validated format)
- Phone number (optional)
- Company (optional, linked to Companies entity)
- Job title (optional)
- Status: Lead, Active, Inactive, Churned
- Source: Manual, Import, Web Form, Referral, Other
- Tags (freeform, multiple)
- Custom fields (future enhancement)
- Avatar (auto-generated from initials, or Gravatar)

**List View:**
- Paginated table with sortable columns
- Column visibility toggle
- Bulk actions: delete, change status, assign tags

**Search & Filter:**
- Real-time search by name, email, phone, company
- Filter by: status, source, tags, company, date created, assigned user
- Save filter presets for quick access

**Import/Export:**
- CSV import with column mapping UI
- CSV export of current filtered view
- Duplicate detection during import (match on email)

### 2.3 Companies / Organizations

Companies represent businesses or organizations that contacts belong to.

**CRUD Operations:**
- Create company with minimal required fields (name)
- View company detail page with linked contacts, deals, activities, notes
- Edit company inline or via detail page
- Delete company (soft-delete)

**Company Fields:**
- Name (required)
- Domain / Website (optional, validated URL)
- Industry (optional, predefined list + custom)
- Company size: 1-10, 11-50, 51-200, 201-500, 500+
- Address (street, city, state/province, country, postal code)
- Phone (optional)
- Description / Notes (optional, plain text)
- Tags (freeform, multiple)

**Relationships:**
- One company → many contacts
- One company → many deals
- View all linked entities from company detail page

### 2.4 Deals / Pipeline

Deals represent sales opportunities with monetary value tracked through pipeline stages.

**Pipeline Stages (Default):**
1. **Qualified** — Lead has been qualified as a real opportunity
2. **Meeting Scheduled** — Initial meeting or demo is booked
3. **Proposal Sent** — Proposal or quote has been delivered
4. **Negotiation** — Terms are being negotiated
5. **Closed Won** — Deal is successfully closed
6. **Closed Lost** — Deal was lost

**Deal Fields:**
- Title (required)
- Value (currency amount, required)
- Currency (default: USD, configurable)
- Stage (required, from pipeline stages)
- Probability (auto-set based on stage, manually overridable)
  - Qualified: 20%, Meeting: 40%, Proposal: 60%, Negotiation: 80%, Won: 100%, Lost: 0%
- Expected close date (optional)
- Contact (required, linked to Contacts)
- Company (optional, auto-populated from contact's company)
- Assigned user (required, defaults to creator)
- Description (optional)
- Tags (freeform, multiple)

**Pipeline View (Kanban Board):**
- Columns for each stage
- Deal cards showing: title, value, contact name, expected close date
- Drag-and-drop to move deals between stages
- Visual indicators: overdue deals highlighted, high-value deals emphasized
- Stage summary: count and total value per column

**List View:**
- Alternative table view with sortable columns
- Filters: stage, assigned user, value range, close date range, contact, company

**Deal Detail Page:**
- Full deal information
- Activity timeline showing all changes, notes, and activities
- Quick actions: move to next stage, mark won/lost, add note, schedule activity

### 2.5 Activities / Tasks

Activities represent actions to be taken — calls to make, emails to send, meetings to attend, tasks to complete.

**Activity Types:**
- Call
- Email
- Meeting
- Task
- Deadline

**Activity Fields:**
- Type (required)
- Subject / Title (required)
- Description (optional)
- Due date and time (required)
- Duration (optional, for calls/meetings)
- Status: Planned, In Progress, Completed, Cancelled
- Priority: Low, Medium, High
- Associated contact (optional)
- Associated deal (optional)
- Associated company (optional)
- Assigned user (required, defaults to creator)
- Outcome / Notes (optional, filled after completion)

**Views:**
- **List view**: Filterable, sortable table of activities
- **Calendar view** (future enhancement): Monthly/weekly calendar display
- Filters: type, status, priority, due date range, assigned user, associated entity

**Reminders:**
- Visual indicators for overdue activities (red highlight)
- Due today section on dashboard
- Browser notifications for upcoming activities (future enhancement)

### 2.6 Notes

Notes provide rich context attached to contacts, companies, or deals.

**Note Fields:**
- Content (rich text — bold, italic, lists, links, headings)
- Associated entity: contact, company, or deal (required, at least one)
- Created by (auto-set to current user)
- Created at / Updated at (auto-set)
- Pinned (boolean, pinned notes appear first)

**Features:**
- Rich text editor (Markdown-based with toolbar)
- Pin/unpin notes for quick reference
- Notes displayed in reverse-chronological order on entity detail pages
- Quick-add note from entity detail page

### 2.7 Global Search

A unified search experience across all entities.

**Behavior:**
- Triggered via search bar in the top navigation (keyboard shortcut: `Cmd/Ctrl + K`)
- Searches across: contacts (name, email), companies (name, domain), deals (title), notes (content)
- Results grouped by entity type
- Shows top 5 results per type, with "View all" link
- Debounced input (300ms) for performance
- Recent searches saved locally

**Implementation:**
- Full-text search powered by Supabase `tsvector` / `tsquery`
- Prefix matching for partial queries
- Results ranked by relevance

---

## 3. User Stories

### 3.1 Authentication

| ID | Story | Priority |
|----|-------|----------|
| AUTH-1 | As a new user, I can sign up with my email and password so that I can create an account | P0 |
| AUTH-2 | As a user, I can log in with my email and password so that I can access my CRM data | P0 |
| AUTH-3 | As a user, I can log in with Google OAuth so that I can use my existing Google account | P1 |
| AUTH-4 | As a user, I can log in with GitHub OAuth so that I can use my existing GitHub account | P1 |
| AUTH-5 | As a user, I can reset my password via email so that I can regain access if I forget it | P0 |
| AUTH-6 | As a user, I can log out from any page so that I can secure my session | P0 |
| AUTH-7 | As an admin, I can invite team members by email so that they can join my CRM workspace | P1 |

### 3.2 Dashboard

| ID | Story | Priority |
|----|-------|----------|
| DASH-1 | As a user, I can see key metrics (total contacts, open deals, won deals, overdue tasks) on the dashboard so that I get an at-a-glance overview | P0 |
| DASH-2 | As a user, I can see a recent activity feed so that I know what has happened recently | P1 |
| DASH-3 | As a user, I can see my upcoming activities on the dashboard so that I know what I need to do next | P0 |
| DASH-4 | As a user, I can see a pipeline summary so that I understand the current state of my deals | P1 |
| DASH-5 | As a user, I can click on any dashboard item to navigate to its detail page | P0 |

### 3.3 Contacts

| ID | Story | Priority |
|----|-------|----------|
| CON-1 | As a user, I can create a new contact with a name and email so that I can start tracking them | P0 |
| CON-2 | As a user, I can view a list of all contacts with pagination so that I can browse my contacts | P0 |
| CON-3 | As a user, I can search contacts by name, email, or phone so that I can quickly find someone | P0 |
| CON-4 | As a user, I can filter contacts by status, source, tags, and company so that I can segment my contact list | P1 |
| CON-5 | As a user, I can click on a contact to see their detail page with all related information | P0 |
| CON-6 | As a user, I can edit a contact's information so that I can keep their data up to date | P0 |
| CON-7 | As a user, I can delete a contact (soft-delete) so that I can remove irrelevant records | P0 |
| CON-8 | As a user, I can import contacts from a CSV file so that I can bulk-add contacts | P1 |
| CON-9 | As a user, I can export my contacts to CSV so that I can use the data externally | P1 |
| CON-10 | As a user, I can add tags to contacts so that I can categorize and segment them | P1 |
| CON-11 | As a user, I can link a contact to a company so that I can see organizational relationships | P0 |
| CON-12 | As a user, I can perform bulk actions (delete, change status) on selected contacts | P2 |

### 3.4 Companies

| ID | Story | Priority |
|----|-------|----------|
| COM-1 | As a user, I can create a new company with a name so that I can track organizations | P0 |
| COM-2 | As a user, I can view a list of all companies with pagination | P0 |
| COM-3 | As a user, I can search companies by name or domain | P0 |
| COM-4 | As a user, I can view a company detail page showing linked contacts, deals, activities, and notes | P0 |
| COM-5 | As a user, I can edit company information | P0 |
| COM-6 | As a user, I can delete a company (soft-delete) | P0 |
| COM-7 | As a user, I can see all contacts that belong to a company from the company detail page | P0 |

### 3.5 Deals / Pipeline

| ID | Story | Priority |
|----|-------|----------|
| DEAL-1 | As a user, I can create a new deal with a title, value, stage, and contact so that I can track an opportunity | P0 |
| DEAL-2 | As a user, I can view deals in a Kanban board grouped by pipeline stage | P0 |
| DEAL-3 | As a user, I can drag and drop deals between stages on the Kanban board | P0 |
| DEAL-4 | As a user, I can view deals in a list/table format as an alternative to the Kanban view | P1 |
| DEAL-5 | As a user, I can click on a deal to see its detail page with full information and activity timeline | P0 |
| DEAL-6 | As a user, I can edit a deal's information (value, stage, close date, etc.) | P0 |
| DEAL-7 | As a user, I can mark a deal as Won or Lost with a single action | P0 |
| DEAL-8 | As a user, I can filter deals by stage, assigned user, value range, and date range | P1 |
| DEAL-9 | As a user, I can see the total value and count of deals per pipeline stage | P0 |
| DEAL-10 | As a user, I can set an expected close date and probability on a deal | P1 |

### 3.6 Activities / Tasks

| ID | Story | Priority |
|----|-------|----------|
| ACT-1 | As a user, I can create a new activity (call, email, meeting, task, deadline) with a due date | P0 |
| ACT-2 | As a user, I can view a list of all my activities with filters | P0 |
| ACT-3 | As a user, I can mark an activity as completed | P0 |
| ACT-4 | As a user, I can associate an activity with a contact, deal, or company | P0 |
| ACT-5 | As a user, I can see overdue activities highlighted visually | P0 |
| ACT-6 | As a user, I can filter activities by type, status, priority, and due date range | P1 |
| ACT-7 | As a user, I can edit an activity's details | P0 |
| ACT-8 | As a user, I can delete an activity | P0 |
| ACT-9 | As a user, I can add outcome notes to a completed activity | P1 |

### 3.7 Notes

| ID | Story | Priority |
|----|-------|----------|
| NOTE-1 | As a user, I can create a note with rich text and attach it to a contact, company, or deal | P0 |
| NOTE-2 | As a user, I can view all notes on an entity's detail page in reverse-chronological order | P0 |
| NOTE-3 | As a user, I can edit a note I created | P0 |
| NOTE-4 | As a user, I can delete a note I created | P0 |
| NOTE-5 | As a user, I can pin a note so it appears at the top of the notes list | P1 |

### 3.8 Global Search

| ID | Story | Priority |
|----|-------|----------|
| SEARCH-1 | As a user, I can open global search with Cmd/Ctrl+K so that I can quickly find anything | P0 |
| SEARCH-2 | As a user, I can search across contacts, companies, deals, and notes from one search bar | P0 |
| SEARCH-3 | As a user, I can see results grouped by entity type with the top matches highlighted | P0 |
| SEARCH-4 | As a user, I can click a search result to navigate directly to that record | P0 |
| SEARCH-5 | As a user, I can see my recent searches for quick re-access | P2 |

---

## 4. Data Model

### 4.1 Entity Relationship Diagram (Textual)

```
users (Supabase Auth)
  │
  ├── 1:N → contacts
  ├── 1:N → companies
  ├── 1:N → deals
  ├── 1:N → activities
  └── 1:N → notes

companies
  ├── 1:N → contacts (a company has many contacts)
  ├── 1:N → deals (a company has many deals)
  ├── 1:N → activities
  └── 1:N → notes

contacts
  ├── N:1 → companies (a contact belongs to one company)
  ├── 1:N → deals (a contact has many deals)
  ├── 1:N → activities
  └── 1:N → notes

deals
  ├── N:1 → contacts (a deal belongs to one contact)
  ├── N:1 → companies (a deal belongs to one company)
  ├── 1:N → activities
  └── 1:N → notes

activities
  ├── N:1 → contacts (optional)
  ├── N:1 → companies (optional)
  └── N:1 → deals (optional)

notes
  ├── N:1 → contacts (optional)
  ├── N:1 → companies (optional)
  └── N:1 → deals (optional)
```

### 4.2 Table Definitions

#### `profiles`

Extends Supabase Auth users with app-specific data.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, FK → auth.users.id | User ID from Supabase Auth |
| full_name | text | NOT NULL | User's display name |
| avatar_url | text | | Profile picture URL |
| role | text | NOT NULL, DEFAULT 'member' | 'admin' or 'member' |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |

#### `contacts`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| first_name | text | | Contact's first name |
| last_name | text | | Contact's last name |
| email | text | | Email address |
| phone | text | | Phone number |
| job_title | text | | Job title / role |
| company_id | uuid | FK → companies.id, ON DELETE SET NULL | Linked company |
| status | text | NOT NULL, DEFAULT 'lead' | lead, active, inactive, churned |
| source | text | DEFAULT 'manual' | manual, import, web_form, referral, other |
| tags | text[] | DEFAULT '{}' | Array of tag strings |
| avatar_url | text | | Profile picture URL |
| address | jsonb | DEFAULT '{}' | {street, city, state, country, postal_code} |
| created_by | uuid | NOT NULL, FK → profiles.id | User who created the contact |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |
| deleted_at | timestamptz | | Soft delete timestamp |

**Check constraint:** At least one of `first_name` or `last_name` must be non-null.

**Indexes:**
- `idx_contacts_company_id` on `company_id`
- `idx_contacts_status` on `status`
- `idx_contacts_created_by` on `created_by`
- `idx_contacts_search` GIN index on `to_tsvector('english', coalesce(first_name,'') || ' ' || coalesce(last_name,'') || ' ' || coalesce(email,''))`
- `idx_contacts_deleted_at` on `deleted_at` WHERE `deleted_at IS NULL`

#### `companies`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| name | text | NOT NULL | Company name |
| domain | text | | Website domain |
| industry | text | | Industry category |
| company_size | text | | 1-10, 11-50, 51-200, 201-500, 500+ |
| phone | text | | Phone number |
| description | text | | Brief description |
| tags | text[] | DEFAULT '{}' | Array of tag strings |
| address | jsonb | DEFAULT '{}' | {street, city, state, country, postal_code} |
| created_by | uuid | NOT NULL, FK → profiles.id | |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |
| deleted_at | timestamptz | | Soft delete timestamp |

**Indexes:**
- `idx_companies_search` GIN index on `to_tsvector('english', coalesce(name,'') || ' ' || coalesce(domain,''))`
- `idx_companies_deleted_at` on `deleted_at` WHERE `deleted_at IS NULL`

#### `deals`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| title | text | NOT NULL | Deal title |
| value | numeric(12,2) | NOT NULL, DEFAULT 0 | Monetary value |
| currency | text | NOT NULL, DEFAULT 'USD' | ISO 4217 currency code |
| stage | text | NOT NULL, DEFAULT 'qualified' | Pipeline stage |
| probability | integer | DEFAULT 20, CHECK 0-100 | Win probability percentage |
| expected_close_date | date | | Expected close date |
| contact_id | uuid | NOT NULL, FK → contacts.id | Primary contact |
| company_id | uuid | FK → companies.id, ON DELETE SET NULL | Associated company |
| assigned_to | uuid | NOT NULL, FK → profiles.id | Assigned team member |
| description | text | | Deal description |
| tags | text[] | DEFAULT '{}' | |
| position | integer | NOT NULL, DEFAULT 0 | Sort order within stage (for Kanban) |
| created_by | uuid | NOT NULL, FK → profiles.id | |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |
| closed_at | timestamptz | | When deal was won/lost |
| deleted_at | timestamptz | | Soft delete timestamp |

**Valid stages:** `qualified`, `meeting_scheduled`, `proposal_sent`, `negotiation`, `closed_won`, `closed_lost`

**Indexes:**
- `idx_deals_stage` on `stage`
- `idx_deals_contact_id` on `contact_id`
- `idx_deals_company_id` on `company_id`
- `idx_deals_assigned_to` on `assigned_to`
- `idx_deals_deleted_at` on `deleted_at` WHERE `deleted_at IS NULL`

#### `activities`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| type | text | NOT NULL | call, email, meeting, task, deadline |
| subject | text | NOT NULL | Activity title |
| description | text | | Details |
| due_date | timestamptz | NOT NULL | When it's due |
| duration_minutes | integer | | Duration for calls/meetings |
| status | text | NOT NULL, DEFAULT 'planned' | planned, in_progress, completed, cancelled |
| priority | text | NOT NULL, DEFAULT 'medium' | low, medium, high |
| outcome | text | | Notes after completion |
| contact_id | uuid | FK → contacts.id, ON DELETE SET NULL | Associated contact |
| company_id | uuid | FK → companies.id, ON DELETE SET NULL | Associated company |
| deal_id | uuid | FK → deals.id, ON DELETE SET NULL | Associated deal |
| assigned_to | uuid | NOT NULL, FK → profiles.id | Assigned team member |
| created_by | uuid | NOT NULL, FK → profiles.id | |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |

**Indexes:**
- `idx_activities_due_date` on `due_date`
- `idx_activities_status` on `status`
- `idx_activities_assigned_to` on `assigned_to`
- `idx_activities_contact_id` on `contact_id`
- `idx_activities_deal_id` on `deal_id`

#### `notes`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| content | text | NOT NULL | Rich text content (stored as HTML or Markdown) |
| is_pinned | boolean | NOT NULL, DEFAULT false | Pin to top of notes list |
| contact_id | uuid | FK → contacts.id, ON DELETE CASCADE | Associated contact |
| company_id | uuid | FK → companies.id, ON DELETE CASCADE | Associated company |
| deal_id | uuid | FK → deals.id, ON DELETE CASCADE | Associated deal |
| created_by | uuid | NOT NULL, FK → profiles.id | |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |
| updated_at | timestamptz | NOT NULL, DEFAULT now() | |

**Check constraint:** At least one of `contact_id`, `company_id`, or `deal_id` must be non-null.

**Indexes:**
- `idx_notes_contact_id` on `contact_id`
- `idx_notes_company_id` on `company_id`
- `idx_notes_deal_id` on `deal_id`
- `idx_notes_search` GIN index on `to_tsvector('english', content)`

#### `activity_log`

Tracks all changes across the CRM for the dashboard activity feed.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK, DEFAULT gen_random_uuid() | |
| action | text | NOT NULL | created, updated, deleted, stage_changed, etc. |
| entity_type | text | NOT NULL | contact, company, deal, activity, note |
| entity_id | uuid | NOT NULL | ID of the affected entity |
| entity_name | text | NOT NULL | Display name of the entity |
| metadata | jsonb | DEFAULT '{}' | Additional context (e.g., {from_stage, to_stage}) |
| user_id | uuid | NOT NULL, FK → profiles.id | Who performed the action |
| created_at | timestamptz | NOT NULL, DEFAULT now() | |

**Indexes:**
- `idx_activity_log_created_at` on `created_at DESC`
- `idx_activity_log_entity` on `(entity_type, entity_id)`
- `idx_activity_log_user_id` on `user_id`

### 4.3 Database Functions & Triggers

- **`update_updated_at()`**: Trigger function that sets `updated_at = now()` before each UPDATE on contacts, companies, deals, activities, notes
- **`log_activity()`**: Trigger function that inserts into `activity_log` after INSERT, UPDATE, DELETE on main entities
- **`calculate_deal_probability()`**: Trigger function that auto-sets deal probability based on stage when stage changes (unless manually overridden)

---

## 5. Authentication & Authorization

### 5.1 Authentication Methods

| Method | Provider | Priority |
|--------|----------|----------|
| Email + Password | Supabase Auth | P0 |
| Google OAuth | Supabase Auth + Google | P1 |
| GitHub OAuth | Supabase Auth + GitHub | P1 |
| Magic Link (passwordless) | Supabase Auth | P2 |

### 5.2 Auth Flow

1. **Sign Up**: User creates account → Supabase creates `auth.users` row → Database trigger creates `profiles` row
2. **Sign In**: User authenticates → Supabase issues JWT → Client stores session
3. **Session Management**: Supabase handles refresh tokens automatically; Next.js middleware validates session on protected routes
4. **Password Reset**: User requests reset → Email sent with reset link → User sets new password

### 5.3 Role-Based Access Control (RBAC)

**Roles:**

| Role | Description |
|------|-------------|
| **admin** | Full access. Can manage team members, view all data, configure settings. |
| **member** | Standard access. Can create, read, update, delete own records. Can view records created by other team members. |

**Permissions Matrix:**

| Action | Admin | Member |
|--------|-------|--------|
| View all records | Yes | Yes |
| Create records | Yes | Yes |
| Edit own records | Yes | Yes |
| Edit others' records | Yes | No |
| Delete own records | Yes | Yes |
| Delete others' records | Yes | No |
| Invite team members | Yes | No |
| Manage team settings | Yes | No |
| Export data | Yes | Yes |
| Import data | Yes | Yes |

### 5.4 Row Level Security (RLS)

All tables will have RLS enabled. Policies:

- **SELECT**: All authenticated users within the same organization can read all records
- **INSERT**: Authenticated users can insert records; `created_by` is auto-set to `auth.uid()`
- **UPDATE**: Admins can update any record; Members can only update records where `created_by = auth.uid()` or `assigned_to = auth.uid()`
- **DELETE**: Admins can soft-delete any record; Members can only soft-delete their own records

### 5.5 Multi-Tenancy (Future)

The initial version is single-tenant (one workspace per Supabase project). Multi-tenancy via `organization_id` on all tables is a future enhancement.

---

## 6. Tech Stack

### 6.1 Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router, Server Components, Server Actions |
| **TypeScript** | Type safety across the entire codebase |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **shadcn/ui** | Accessible, customizable UI component library |
| **@hello-pangea/dnd** | Drag-and-drop for Kanban board (fork of react-beautiful-dnd) |
| **React Hook Form** | Form management with validation |
| **Zod** | Schema validation (shared between client and server) |
| **nuqs** | Type-safe URL search param state management |
| **TipTap** | Rich text editor for notes |
| **date-fns** | Date formatting and manipulation |
| **Lucide React** | Icon library (used by shadcn/ui) |

### 6.2 Backend

| Technology | Purpose |
|------------|---------|
| **Supabase** | Backend-as-a-service: PostgreSQL database, Auth, Storage, Realtime |
| **Supabase Auth** | Authentication with email/password and OAuth providers |
| **Supabase JS Client** | Client-side database access with RLS |
| **Supabase SSR** | Server-side Supabase client for Next.js App Router |
| **PostgreSQL** | Primary database (via Supabase) |
| **Row Level Security** | Database-level authorization |

### 6.3 Development & Tooling

| Technology | Purpose |
|------------|---------|
| **pnpm** | Package manager |
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **Supabase CLI** | Local development, migrations, type generation |
| **Vitest** | Unit and integration testing |
| **Playwright** | End-to-end testing |

### 6.4 Project Structure

```
simple-crm-2/
├── docs/
│   └── SPEC.md                  # This specification
├── supabase/
│   ├── migrations/              # SQL migration files
│   ├── seed.sql                 # Seed data for development
│   └── config.toml              # Supabase local config
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx       # Auth layout (centered, no sidebar)
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx       # Dashboard layout (sidebar + topbar)
│   │   │   ├── page.tsx         # Dashboard home
│   │   │   ├── contacts/
│   │   │   │   ├── page.tsx     # Contacts list
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx # Contact detail
│   │   │   │   └── new/
│   │   │   │       └── page.tsx # New contact form
│   │   │   ├── companies/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── deals/
│   │   │   │   ├── page.tsx     # Pipeline / Kanban view
│   │   │   │   ├── [id]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   ├── activities/
│   │   │   │   ├── page.tsx
│   │   │   │   └── new/
│   │   │   │       └── page.tsx
│   │   │   └── settings/
│   │   │       └── page.tsx     # User & team settings
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing / redirect to dashboard
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   ├── layout/              # Sidebar, Topbar, CommandPalette
│   │   ├── contacts/            # Contact-specific components
│   │   ├── companies/           # Company-specific components
│   │   ├── deals/               # Deal-specific components (Kanban, cards)
│   │   ├── activities/          # Activity-specific components
│   │   ├── notes/               # Note editor, note cards
│   │   └── shared/              # Shared components (DataTable, Filters, etc.)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser Supabase client
│   │   │   ├── server.ts        # Server Supabase client
│   │   │   └── middleware.ts    # Supabase auth middleware helper
│   │   ├── validations/         # Zod schemas for each entity
│   │   ├── utils.ts             # General utility functions
│   │   └── constants.ts         # App-wide constants (stages, statuses, etc.)
│   ├── actions/                 # Server Actions for mutations
│   │   ├── contacts.ts
│   │   ├── companies.ts
│   │   ├── deals.ts
│   │   ├── activities.ts
│   │   └── notes.ts
│   ├── hooks/                   # Custom React hooks
│   └── types/
│       ├── database.ts          # Auto-generated Supabase types
│       └── index.ts             # App-level type definitions
├── public/
├── .env.local.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 7. API Design

### 7.1 Data Access Strategy

- **Reads**: Use Supabase client directly from Server Components with RLS for authorization. This leverages Next.js streaming and server-side rendering.
- **Writes**: Use Next.js Server Actions that create a server-side Supabase client with the user's session. Server Actions handle validation (Zod), mutation, and revalidation.

### 7.2 Server Actions

Each entity module exports these Server Actions:

**Contacts (`src/actions/contacts.ts`):**
- `createContact(data: ContactInput)` → Contact
- `updateContact(id: string, data: Partial<ContactInput>)` → Contact
- `deleteContact(id: string)` → void (soft-delete)
- `importContacts(file: File)` → ImportResult
- `exportContacts(filters: ContactFilters)` → CSV Blob

**Companies (`src/actions/companies.ts`):**
- `createCompany(data: CompanyInput)` → Company
- `updateCompany(id: string, data: Partial<CompanyInput>)` → Company
- `deleteCompany(id: string)` → void (soft-delete)

**Deals (`src/actions/deals.ts`):**
- `createDeal(data: DealInput)` → Deal
- `updateDeal(id: string, data: Partial<DealInput>)` → Deal
- `updateDealStage(id: string, stage: Stage, position: number)` → Deal
- `deleteDeal(id: string)` → void (soft-delete)

**Activities (`src/actions/activities.ts`):**
- `createActivity(data: ActivityInput)` → Activity
- `updateActivity(id: string, data: Partial<ActivityInput>)` → Activity
- `completeActivity(id: string, outcome?: string)` → Activity
- `deleteActivity(id: string)` → void

**Notes (`src/actions/notes.ts`):**
- `createNote(data: NoteInput)` → Note
- `updateNote(id: string, data: Partial<NoteInput>)` → Note
- `togglePinNote(id: string)` → Note
- `deleteNote(id: string)` → void

### 7.3 Data Fetching Patterns

```typescript
// Server Component data fetching (example: contacts list)
// src/app/(dashboard)/contacts/page.tsx

export default async function ContactsPage({ searchParams }: Props) {
  const supabase = await createServerClient()
  const { search, status, page = '1' } = await searchParams

  let query = supabase
    .from('contacts')
    .select('*, company:companies(id, name)', { count: 'exact' })
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .range((+page - 1) * PAGE_SIZE, +page * PAGE_SIZE - 1)

  if (search) {
    query = query.textSearch('search_vector', search)
  }
  if (status) {
    query = query.eq('status', status)
  }

  const { data: contacts, count, error } = await query

  return <ContactsList contacts={contacts} totalCount={count} />
}
```

### 7.4 Validation Schemas (Zod)

```typescript
// src/lib/validations/contacts.ts
import { z } from 'zod'

export const contactSchema = z.object({
  first_name: z.string().max(100).optional(),
  last_name: z.string().max(100).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(30).optional(),
  job_title: z.string().max(100).optional(),
  company_id: z.string().uuid().optional().nullable(),
  status: z.enum(['lead', 'active', 'inactive', 'churned']).default('lead'),
  source: z.enum(['manual', 'import', 'web_form', 'referral', 'other']).default('manual'),
  tags: z.array(z.string().max(50)).default([]),
}).refine(
  (data) => data.first_name || data.last_name,
  { message: 'At least one of first name or last name is required' }
)

export type ContactInput = z.infer<typeof contactSchema>
```

---

## 8. Non-Functional Requirements

### 8.1 Performance

- **Page Load**: Initial page load under 2 seconds on 4G connection
- **Search**: Global search results returned within 300ms
- **Kanban Drag-and-Drop**: Optimistic UI updates; stage change persisted within 500ms
- **List Pagination**: 25 records per page default; smooth pagination

### 8.2 Accessibility

- WCAG 2.1 AA compliance
- Full keyboard navigation for all interactive elements
- Screen reader support via semantic HTML and ARIA attributes (provided by shadcn/ui)
- Focus management for modals and dialogs
- Color contrast ratios meeting AA standards

### 8.3 Responsive Design

- **Desktop** (1024px+): Full sidebar navigation, multi-column layouts
- **Tablet** (768px–1023px): Collapsible sidebar, responsive grids
- **Mobile** (< 768px): Bottom navigation, stacked layouts, simplified Kanban (list mode)

### 8.4 Security

- All data access governed by Supabase RLS policies
- Input validation on both client (UX) and server (security) with Zod
- CSRF protection via Server Actions (built into Next.js)
- No sensitive data in client-side code or URL parameters
- Secure session management via Supabase Auth (HttpOnly cookies)
- Rate limiting on auth endpoints (Supabase built-in)

### 8.5 Data Integrity

- Soft deletes on contacts, companies, and deals (30-day recovery window)
- Foreign key constraints with appropriate ON DELETE behavior
- Check constraints on enum-like fields (status, stage, type)
- Database triggers for `updated_at` timestamps and activity logging
- Optimistic concurrency control for Kanban board updates

### 8.6 Testing Strategy

- **Unit Tests**: Zod schemas, utility functions, data transformation logic
- **Integration Tests**: Server Actions with mocked Supabase client
- **E2E Tests**: Critical user flows (sign up, create contact, create deal, move deal through pipeline)
- **Target Coverage**: 80% for business logic, 100% for validation schemas

---

*This specification is a living document. It will be updated as requirements evolve during development.*

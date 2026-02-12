# Simple CRM - UI/UX Design System

## Table of Contents

- [Design Philosophy](#design-philosophy)
- [Design Tokens](#design-tokens)
- [Layout System](#layout-system)
- [Page Designs](#page-designs)
- [Component Patterns](#component-patterns)
- [Interaction Design](#interaction-design)
- [Dark Mode](#dark-mode)
- [Accessibility](#accessibility)

---

## Design Philosophy

Simple CRM follows a **clean, minimal, professional** design language inspired by modern SaaS tools like **Linear**, **Attio**, and **Notion**. The guiding principles:

1. **Information density without clutter** - Show the data users need at a glance using tight spacing, clear typography hierarchy, and subtle dividers. Avoid excessive whitespace or decorative elements that waste screen real estate.

2. **Speed-first interaction** - Every action should feel instant. Keyboard shortcuts, command palette (Cmd+K), inline editing, and optimistic UI updates eliminate unnecessary clicks and page loads.

3. **Progressive disclosure** - Show summary data in lists and tables; reveal detail on demand through sheets/drawers, expandable rows, and detail pages. Don't overwhelm the user upfront.

4. **Consistency over novelty** - Reuse the same component patterns everywhere. A table is a table, a form is a form. Users learn the system once and apply it everywhere.

5. **Quiet confidence** - Muted colors, subtle shadows, refined typography. The UI should feel premium without being flashy. Let the user's data be the visual focus.

---

## Design Tokens

### Color Palette

All colors are defined as CSS custom properties for theme switching. HSL format for easy manipulation.

#### Core Colors

```
/* Light Mode */
--background:         0 0% 100%        /* #FFFFFF - Page background */
--background-subtle:  220 14% 96%      /* #F4F5F7 - Cards, sidebars */
--background-muted:   220 13% 91%      /* #E4E7EC - Hover states, zebra rows */
--background-inset:   220 14% 96%      /* #F4F5F7 - Inset panels */

--foreground:         224 71% 4%       /* #030712 - Primary text */
--foreground-muted:   220 9% 46%       /* #6B7280 - Secondary text */
--foreground-subtle:  220 9% 63%       /* #9CA3AF - Tertiary text, placeholders */

--border:             220 13% 91%      /* #E5E7EB - Default borders */
--border-strong:      220 9% 78%       /* #C6CCD6 - Emphasized borders */

--ring:               221 83% 53%      /* #3B82F6 - Focus ring color */
```

#### Brand / Primary

```
--primary:            221 83% 53%      /* #3B82F6 - Primary buttons, links */
--primary-hover:      221 83% 47%      /* #2563EB - Primary hover */
--primary-foreground: 0 0% 100%        /* #FFFFFF - Text on primary */
--primary-muted:      221 83% 95%      /* #EFF6FF - Primary backgrounds */
```

#### Semantic Colors

```
/* Success */
--success:            142 71% 45%      /* #22C55E */
--success-muted:      142 71% 95%      /* #F0FDF4 */
--success-foreground: 142 71% 25%      /* #166534 */

/* Warning */
--warning:            38 92% 50%       /* #F59E0B */
--warning-muted:      38 92% 95%       /* #FFFBEB */
--warning-foreground: 38 92% 30%       /* #92400E */

/* Destructive / Error */
--destructive:        0 84% 60%        /* #EF4444 */
--destructive-muted:  0 84% 95%        /* #FEF2F2 */
--destructive-foreground: 0 84% 30%    /* #991B1B */

/* Info */
--info:               199 89% 48%      /* #0EA5E9 */
--info-muted:         199 89% 95%      /* #F0F9FF */
--info-foreground:    199 89% 28%      /* #075985 */
```

#### Deal Stage Colors

Each deal stage has a distinct color for visual pipeline clarity:

```
--stage-lead:         220 14% 60%      /* #8B95A5 - Gray, unqualified */
--stage-qualified:    199 89% 48%      /* #0EA5E9 - Blue, qualified */
--stage-proposal:     262 83% 58%      /* #8B5CF6 - Purple, proposal sent */
--stage-negotiation:  38 92% 50%       /* #F59E0B - Amber, in negotiation */
--stage-won:          142 71% 45%      /* #22C55E - Green, closed won */
--stage-lost:         0 84% 60%        /* #EF4444 - Red, closed lost */
```

#### Tag / Category Colors

A set of 8 soft colors for tags, labels, and categories:

```
--tag-blue:           bg #DBEAFE  text #1E40AF
--tag-green:          bg #DCFCE7  text #166534
--tag-purple:         bg #F3E8FF  text #6B21A8
--tag-amber:          bg #FEF3C7  text #92400E
--tag-rose:           bg #FFE4E6  text #9F1239
--tag-cyan:           bg #CFFAFE  text #155E75
--tag-orange:         bg #FFEDD5  text #9A3412
--tag-gray:           bg #F3F4F6  text #374151
```

### Typography

**Font Family**: `Inter` (primary), falling back to system fonts.

```css
--font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
```

**Type Scale** (based on a 1.200 minor third ratio):

| Token         | Size   | Weight | Line Height | Use Case                          |
|---------------|--------|--------|-------------|-----------------------------------|
| `text-xs`     | 11px   | 400    | 16px        | Badges, captions, timestamps      |
| `text-sm`     | 12px   | 400    | 16px        | Table cells, secondary labels     |
| `text-base`   | 13px   | 400    | 20px        | Body text, form inputs            |
| `text-md`     | 14px   | 500    | 20px        | Table headers, sidebar nav items  |
| `text-lg`     | 16px   | 600    | 24px        | Section headings, card titles     |
| `text-xl`     | 20px   | 600    | 28px        | Page titles                       |
| `text-2xl`    | 24px   | 700    | 32px        | Dashboard metrics, hero numbers   |
| `text-3xl`    | 30px   | 700    | 36px        | Large dashboard stats             |

**Font Weights**:
- `400` Regular - Body text, descriptions
- `500` Medium - Labels, nav items, table headers
- `600` Semibold - Section titles, card headings, buttons
- `700` Bold - Page titles, large metrics

> Note: The base font size is 13px (not the standard 16px) for higher information density, matching tools like Linear and Figma.

### Spacing System

Based on a **4px grid**. All spacing values are multiples of 4px:

```
--space-0:   0px
--space-0.5: 2px
--space-1:   4px
--space-1.5: 6px
--space-2:   8px
--space-3:   12px
--space-4:   16px
--space-5:   20px
--space-6:   24px
--space-8:   32px
--space-10:  40px
--space-12:  48px
--space-16:  64px
```

**Common spacing patterns**:
- Inline element gap (icon + text): `8px`
- Form field gap: `12px`
- Card padding: `16px`
- Section gap: `24px`
- Page padding: `24px` (desktop), `16px` (mobile)

### Border Radius

```
--radius-sm:   4px    /* Tags, badges, small chips */
--radius-md:   6px    /* Buttons, inputs, dropdowns */
--radius-lg:   8px    /* Cards, modals, sheets */
--radius-xl:   12px   /* Large cards, feature panels */
--radius-full: 9999px /* Avatars, circular elements */
```

### Shadows

Subtle, layered shadows. Avoid heavy drop shadows.

```
--shadow-xs:   0 1px 2px rgba(0,0,0,0.05)
--shadow-sm:   0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
--shadow-md:   0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)
--shadow-lg:   0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)
--shadow-xl:   0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04)
```

### Transitions

```
--duration-fast:    100ms   /* Hover states, active states */
--duration-normal:  150ms   /* Dropdowns, tooltips */
--duration-slow:    250ms   /* Modals, sheets, drawers */
--duration-slower:  350ms   /* Page transitions */

--ease-default:     cubic-bezier(0.4, 0, 0.2, 1)
--ease-in:          cubic-bezier(0.4, 0, 1, 1)
--ease-out:         cubic-bezier(0, 0, 0.2, 1)
--ease-spring:      cubic-bezier(0.34, 1.56, 0.64, 1)   /* Playful bounces */
```

### Z-Index Scale

```
--z-base:      0
--z-dropdown:  50
--z-sticky:    100
--z-overlay:   200
--z-modal:     300
--z-popover:   400
--z-toast:     500
--z-command:   600    /* Command palette is always on top */
```

---

## Layout System

### Overall Structure

```
┌──────────────────────────────────────────────────────┐
│ ┌──────────┐ ┌─────────────────────────────────────┐ │
│ │           │ │ Header Bar                          │ │
│ │           │ ├─────────────────────────────────────┤ │
│ │  Sidebar  │ │                                     │ │
│ │  (240px)  │ │           Main Content              │ │
│ │           │ │            (flex: 1)                 │ │
│ │           │ │                                     │ │
│ │           │ │                                     │ │
│ └──────────┘ └─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

### Sidebar Navigation

**Width**: 240px expanded, 48px collapsed (icon-only mode).

**Structure**:

```
┌─────────────────┐
│  Logo / App Name │  ← 48px height, clickable to dashboard
├─────────────────┤
│  🔍 Search...    │  ← Quick search trigger (opens Cmd+K)
├─────────────────┤
│  📊 Dashboard    │  ← Primary nav items with icons
│  👤 Contacts     │
│  🏢 Companies    │
│  💰 Deals        │
│  📋 Activities   │
├─────────────────┤
│  FAVORITES       │  ← Section divider
│  · Hot leads     │  ← Saved views / filters
│  · Q4 pipeline   │
├─────────────────┤
│                  │
│                  │  ← Flex spacer
├─────────────────┤
│  ⚙ Settings      │  ← Bottom-pinned
│  👤 User Avatar   │  ← User menu trigger
└─────────────────┘
```

**Behavior**:
- Collapsed state on `< 1024px` or user toggle via button (hamburger icon at top)
- Hover on collapsed sidebar: expand temporarily with smooth slide animation
- Active nav item: `primary-muted` background with `primary` left border accent (3px)
- Hover nav item: `background-muted` background
- Icons: Lucide icon set, 18px size, `foreground-muted` color
- Text: `text-md` (14px, medium weight)

### Header Bar

**Height**: 48px, fixed at top of main content area.

```
┌───────────────────────────────────────────────────────┐
│  Breadcrumbs / Page Title      [Actions]  [+ Create]  │
└───────────────────────────────────────────────────────┘
```

**Contents**:
- **Left**: Page title (text-lg, semibold) or breadcrumbs for nested views
- **Right**: Context-specific action buttons + primary "Create" button
- **Border**: 1px bottom border using `--border`
- **Background**: `--background` with subtle blur (backdrop-filter) when content scrolls under

### Responsive Breakpoints

```
--breakpoint-sm:   640px    /* Mobile landscape */
--breakpoint-md:   768px    /* Tablet portrait */
--breakpoint-lg:   1024px   /* Tablet landscape / small desktop */
--breakpoint-xl:   1280px   /* Standard desktop */
--breakpoint-2xl:  1536px   /* Large desktop */
```

**Responsive behavior**:

| Breakpoint     | Sidebar           | Content         | Tables           |
|----------------|-------------------|-----------------|------------------|
| `< 768px`      | Hidden (overlay)  | Full width      | Horizontal scroll or card view |
| `768 - 1024px` | Collapsed (48px)  | Fills remainder | Condensed columns |
| `> 1024px`     | Expanded (240px)  | Fills remainder | Full table        |

**Mobile navigation**: Bottom tab bar (5 items: Dashboard, Contacts, Deals, Activities, More) replaces sidebar on `< 768px`.

---

## Page Designs

### Dashboard

The landing page after login. Provides a snapshot of CRM health.

```
┌────────────────────────────────────────────────────────┐
│  Header: "Dashboard"                  [Date Range ▾]   │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ │
│  │ Total     │ │ Open     │ │ Pipeline │ │ Won This │ │
│  │ Contacts  │ │ Deals    │ │ Value    │ │ Month    │ │
│  │ 1,247     │ │ 34       │ │ $2.4M   │ │ $840K   │ │
│  │ ↑ 12%     │ │ ↑ 3      │ │ ↑ 18%   │ │ ↑ 24%   │ │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘ │
│                                                        │
│  ┌─────────────────────────┐ ┌────────────────────────┐│
│  │  Deal Pipeline Summary  │ │  Upcoming Tasks        ││
│  │                         │ │                        ││
│  │  [Horizontal stacked    │ │  ☐ Follow up w/ Acme  ││
│  │   bar chart by stage]   │ │  ☐ Send proposal       ││
│  │                         │ │  ☐ Demo call           ││
│  │  Lead        ████░ 12   │ │  ☐ Contract review     ││
│  │  Qualified   ██████ 8   │ │                        ││
│  │  Proposal    ████ 6     │ │  [View all →]          ││
│  │  Negotiation ███ 5      │ │                        ││
│  │  Won         █████ 3    │ │                        ││
│  └─────────────────────────┘ └────────────────────────┘│
│                                                        │
│  ┌─────────────────────────────────────────────────────┤
│  │  Recent Activity                                    │
│  │                                                     │
│  │  • Jane created deal "Acme Corp Q4"       2m ago   │
│  │  • You logged a call with Bob Smith       15m ago  │
│  │  • Deal "Widget Co" moved to Negotiation  1h ago   │
│  │  • Sarah added contact "Mike Johnson"     2h ago   │
│  │                                                     │
│  │  [View all activity →]                              │
│  └─────────────────────────────────────────────────────┘
└────────────────────────────────────────────────────────┘
```

**Metric Cards**:
- 4-column grid (2 cols on tablet, 1 on mobile)
- Each card: `background-subtle`, `radius-lg`, `shadow-xs`, `padding: 16px`
- Metric value: `text-2xl`, `font-bold`
- Change indicator: Green up arrow or red down arrow, `text-sm`
- Label: `text-sm`, `foreground-muted`

**Pipeline Summary**:
- Horizontal stacked bars, colored by stage
- Click a stage to filter the deals list

**Tasks Widget**:
- Shows next 5 due tasks with checkbox, title, due date
- Checkbox triggers inline completion with optimistic update

**Activity Feed**:
- Chronological list, each with icon (type indicator), description, relative timestamp
- Activity types: call, email, note, deal update, contact created

### Contacts List

The primary contacts view. High-density data table optimized for scanning.

```
┌────────────────────────────────────────────────────────────┐
│  Header: "Contacts" (1,247)     [Filter ▾] [+ Add Contact]│
├────────────────────────────────────────────────────────────┤
│  Search: [🔍 Search contacts...]    [Columns ▾] [Export]   │
├────────────────────────────────────────────────────────────┤
│  ☐ │ Name ▾          │ Company    │ Email          │ Phone │
│────┼─────────────────┼────────────┼────────────────┼───────│
│  ☐ │ 🟢 Jane Smith   │ Acme Corp  │ jane@acme.co   │ +1... │
│  ☐ │ 🔵 Bob Johnson  │ Widget Inc │ bob@widget.io  │ +1... │
│  ☐ │ 🟢 Alice Chen   │ TechStart  │ alice@tech.co  │ +1... │
│  ☐ │ ⚪ Mike Davis    │ BigCo      │ mike@bigco.com │ +1... │
│────┼─────────────────┼────────────┼────────────────┼───────│
│  [Bulk actions: Assign, Tag, Delete]    Page 1 of 63  [< >]│
└────────────────────────────────────────────────────────────┘
```

**Table Design**:
- **Row height**: 44px for comfortable clicking
- **Checkbox column**: 40px wide, for bulk selection
- **Avatar**: 28px circle with status dot (green=active, gray=inactive), placed next to name
- **Name column**: `text-md`, `font-medium`, primary color on hover (linkable)
- **Other columns**: `text-sm`, `foreground-muted`
- **Tags**: Inline badges next to or below name, using tag colors
- **Last contacted**: Relative time ("2d ago"), turns `destructive` if > 30 days
- **Row hover**: `background-muted` background
- **Selected row**: `primary-muted` background
- **Sortable columns**: Click header to sort, arrow indicator for direction
- **Sticky header**: Table header sticks on scroll

**Visible columns** (default, user-configurable):
1. Checkbox (select)
2. Avatar + Name
3. Company
4. Email
5. Phone
6. Last Contacted
7. Tags
8. Actions (kebab menu: Edit, Delete, Log activity)

**Filter Bar**:
- Dropdown filters: Status, Company, Tags, Owner, Date range
- Active filters shown as removable chips below the search bar
- "Save view" button to persist filter combinations

**Bulk Actions Bar**:
- Appears when 1+ rows selected, slides up from bottom or replaces header
- Actions: Assign to user, Add tags, Remove tags, Export, Delete
- Shows count: "12 contacts selected"

### Contact Detail

Opened by clicking a contact row. Can open as a full page or a right-side sheet.

```
┌────────────────────────────────────────────────────────┐
│  [← Back]                               [Edit] [···]  │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────┐  Jane Smith                                  │
│  │Avatar│  VP of Engineering @ Acme Corp               │
│  │ 64px │  jane@acme.co · +1 (555) 123-4567           │
│  └──────┘  Tags: [VIP] [Decision Maker]                │
│                                                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐               │
│  │ 3 Deals  │ │ Last     │ │ Total    │               │
│  │ Open     │ │ Contact  │ │ Value    │               │
│  │          │ │ 2d ago   │ │ $420K    │               │
│  └──────────┘ └──────────┘ └──────────┘               │
│                                                        │
│  [Activity] [Deals] [Notes] [Files] [Details]          │
│  ─────────────────────────────────────────────         │
│                                                        │
│  Activity Tab:                                         │
│  ┌──────────────────────────────────────────┐          │
│  │  + Log activity  [Call] [Email] [Note]   │          │
│  ├──────────────────────────────────────────┤          │
│  │  📞 Call with Jane - discussed Q4 plans  │          │
│  │     Jan 15, 2025 · 15 min · You          │          │
│  │                                          │          │
│  │  ✉️ Email sent: "Proposal attached"       │          │
│  │     Jan 14, 2025 · You                   │          │
│  │                                          │          │
│  │  📝 Note: "Interested in enterprise plan" │          │
│  │     Jan 12, 2025 · Sarah                 │          │
│  └──────────────────────────────────────────┘          │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Contact Header**:
- Large avatar (64px) with upload/change on hover
- Name: `text-xl`, editable inline on click
- Role + Company: `text-base`, `foreground-muted`, company name is a link
- Contact methods: email (clickable to compose), phone (clickable to call)
- Tags: Editable tag list, click "+" to add

**Quick Stats Row**:
- 3 mini metric cards below the header
- Deal count, last contact date, total pipeline value

**Tabbed Content**:
- Tabs: Activity, Deals, Notes, Files, Details
- Activity: Timeline of all interactions (same component as global activity)
- Deals: List of associated deals with stage, value, expected close
- Notes: Rich text notes with @mentions and timestamps
- Files: Attached documents with upload drag-and-drop
- Details: All contact fields in an editable form layout (2-column grid)

**Right Sidebar (optional, on wide screens > 1440px)**:
- Pinned panel showing key details, upcoming tasks, and related contacts
- Avoids needing to switch tabs for common info

### Companies List

Structurally identical to Contacts List with company-specific columns.

```
Columns: Logo + Name | Industry | Contacts Count | Open Deals | Total Value | Website | Location
```

**Differences from Contacts**:
- Company logo (square, `radius-md`, 32px) instead of avatar
- "Contacts" column shows count, clickable to see associated contacts
- "Open Deals" shows aggregate pipeline info
- Industry and Location columns for segmentation
- Company detail page has additional tabs: Contacts (grid of people), Financials

### Deals Pipeline (Kanban)

The primary deals view. Drag-and-drop Kanban board.

```
┌──────────────────────────────────────────────────────────┐
│  Header: "Deals" ($2.4M)   [Kanban|Table] [+ Add Deal]  │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Lead (12)    Qualified (8)  Proposal (6)  Negotiation   │
│  $180K        $420K          $680K         (5) $540K     │
│  ┌─────────┐ ┌─────────┐   ┌─────────┐   ┌─────────┐   │
│  │ Acme    │ │ Widget  │   │ TechCo  │   │ BigCorp │   │
│  │ $45K    │ │ $120K   │   │ $200K   │   │ $180K   │   │
│  │ Jane S. │ │ Bob J.  │   │ Alice C.│   │ Mike D. │   │
│  │ 30 days │ │ 15 days │   │ 7 days  │   │ 3 days  │   │
│  └─────────┘ └─────────┘   └─────────┘   └─────────┘   │
│  ┌─────────┐ ┌─────────┐   ┌─────────┐                  │
│  │ StartUp │ │ MedCo   │   │ Agency  │                  │
│  │ $15K    │ │ $80K    │   │ $150K   │                  │
│  │ Tom R.  │ │ Eva M.  │   │ Lisa K. │                  │
│  │ 45 days │ │ 8 days  │   │ 12 days │                  │
│  └─────────┘ └─────────┘   └─────────┘                  │
│                                                          │
│  Won (3) $840K                Lost (2) $120K             │
│  [Collapsed columns with expand toggle]                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Kanban Columns**:
- Column header: Stage name, deal count, total value
- Column header color: Top 3px border using stage color
- Horizontal scroll when columns exceed viewport
- "Won" and "Lost" columns collapsed by default (expandable)

**Deal Cards**:
- Width: Fill column (typically 260-300px)
- Padding: 12px
- Background: `background` (white), `shadow-xs`, `radius-md`
- Content:
  - **Deal name**: `text-md`, `font-medium`, truncated with ellipsis
  - **Value**: `text-sm`, `font-semibold`
  - **Contact**: Small avatar (20px) + name, `text-sm`, `foreground-muted`
  - **Age**: Days in current stage, turns amber at 14d, red at 30d
  - **Priority indicator**: Colored dot (optional)
  - **Expected close date**: `text-xs`, `foreground-subtle`

**Drag and Drop**:
- Cards lift with `shadow-lg` and slight scale (1.02) when grabbed
- Drop zone highlights with dashed `primary` border
- Stage transition triggers a confirmation toast: "Deal moved to Negotiation" [Undo]
- Smooth spring animation for card reordering

**Quick Actions on Card Hover**:
- Small action icons appear (top-right): Edit, Log activity, Delete
- Click card to open deal detail (sheet or page)

### Deals Table View

Toggle between Kanban and Table view via segmented control in header.

```
Columns: Name | Company | Contact | Value | Stage | Expected Close | Owner | Age | Priority
```

- Same table patterns as Contacts List
- Stage shown as colored badge (pill shape, using stage color)
- Value formatted as currency, right-aligned
- Expected close: Date, turns red if overdue
- Inline stage dropdown for quick pipeline changes

### Activities

Global timeline of all CRM activity across contacts, deals, and users.

```
┌────────────────────────────────────────────────────────┐
│  Header: "Activities"        [Filter: Type ▾] [Date ▾] │
├────────────────────────────────────────────────────────┤
│                                                        │
│  TODAY                                                 │
│  ┌──────────────────────────────────────────────┐      │
│  │ 📞 You logged a call with Jane Smith          │      │
│  │    "Discussed Q4 renewal, she's interested"   │      │
│  │    Acme Corp · 15 min · 2:30 PM               │      │
│  ├──────────────────────────────────────────────┤      │
│  │ 💰 Deal "Widget Co" moved to Negotiation      │      │
│  │    Value: $120K · Updated by Sarah             │      │
│  │    11:45 AM                                    │      │
│  ├──────────────────────────────────────────────┤      │
│  │ ✉️ Email sent to Bob Johnson                   │      │
│  │    Subject: "Follow up on demo"               │      │
│  │    Widget Inc · 9:15 AM                        │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  YESTERDAY                                             │
│  ┌──────────────────────────────────────────────┐      │
│  │ 👤 Contact "Mike Davis" created                │      │
│  │    Added by You · BigCo                        │      │
│  │    4:20 PM                                     │      │
│  └──────────────────────────────────────────────┘      │
│                                                        │
│  [Load more...]                                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Timeline Design**:
- Grouped by date with sticky date headers
- Each entry: Icon (activity type), title, description, metadata row
- Left vertical line connecting entries (timeline connector)
- Activity type icons use semantic colors (call=blue, email=purple, deal=amber, note=gray)

**Filters**:
- Type: All, Calls, Emails, Notes, Deal updates, Contact changes
- User: All users, specific user
- Date range: Today, This week, This month, Custom range
- Related to: Specific contact or deal

**Log Activity Button**:
- Floating action or header button: "+ Log Activity"
- Opens sheet with activity type selector, contact/deal picker, notes, duration

### Settings

Multi-section settings page with left sub-navigation.

```
┌────────────────────────────────────────────────────────┐
│  Header: "Settings"                                    │
├────────────────────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────────────────────────────────┐ │
│  │ Profile   │ │  Profile Settings                    │ │
│  │ Team      │ │                                      │ │
│  │ Pipeline  │ │  Avatar  [Upload]                    │ │
│  │ Email     │ │  Name    [________________]          │ │
│  │ Notifs    │ │  Email   [________________]          │ │
│  │ Import    │ │  Role    [________________]          │ │
│  │ Billing   │ │  Timezone [EST ▾]                    │ │
│  │           │ │                                      │ │
│  │           │ │  [Save Changes]                      │ │
│  └──────────┘ └──────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

**Sections**:
- **Profile**: Name, email, avatar, timezone, notification preferences
- **Team**: Invite members, manage roles, view team directory
- **Pipeline**: Customize deal stages (reorder, rename, add/remove, set colors)
- **Email**: Email integration settings, templates, signature
- **Notifications**: Granular notification controls (in-app, email, per event type)
- **Import/Export**: CSV import wizard, data export
- **Billing**: Plan details, usage, payment method, invoices

Each section is a form layout:
- Labels above inputs (not inline) for clarity
- Group related fields with section dividers
- "Save Changes" button fixed at bottom with unsaved changes indicator
- Destructive actions (delete account, remove member) in a separate "Danger Zone" section with red border

---

## Component Patterns

### Command Palette (Cmd+K)

Global search and navigation accessible from anywhere.

```
┌────────────────────────────────────────────────┐
│  🔍 Type a command or search...                │
├────────────────────────────────────────────────┤
│  RECENT                                        │
│  ↩ Jane Smith                                  │
│  ↩ Acme Corp deal                              │
├────────────────────────────────────────────────┤
│  CONTACTS                                      │
│  👤 Jane Smith · Acme Corp                      │
│  👤 Bob Johnson · Widget Inc                    │
├────────────────────────────────────────────────┤
│  ACTIONS                                       │
│  + Create contact                              │
│  + Create deal                                 │
│  + Log activity                                │
├────────────────────────────────────────────────┤
│  NAVIGATION                                    │
│  → Go to Dashboard                             │
│  → Go to Contacts                              │
│  → Go to Deals                                 │
└────────────────────────────────────────────────┘
```

**Behavior**:
- Opens with `Cmd+K` (or `/` when not in an input)
- Full-width overlay centered on screen, max-width 560px
- Backdrop blur with dark overlay
- Fuzzy search across contacts, companies, deals, and navigation
- Results grouped by category with section headers
- Keyboard navigation: arrows to move, enter to select, esc to close
- Recent items shown by default (before typing)
- Actions section for quick creation shortcuts

### Sheet / Drawer

Side panel for create/edit forms without losing page context.

```
┌──────────────────────────────┐
│  Create Contact          [✕] │
├──────────────────────────────┤
│                              │
│  First Name                  │
│  [________________]          │
│                              │
│  Last Name                   │
│  [________________]          │
│                              │
│  Email                       │
│  [________________]          │
│                              │
│  Company                     │
│  [Acme Corp ▾ (searchable)]  │
│                              │
│  Phone                       │
│  [________________]          │
│                              │
│  Tags                        │
│  [VIP] [Decision Maker] [+]  │
│                              │
├──────────────────────────────┤
│  [Cancel]      [Save Contact]│
└──────────────────────────────┘
```

**Specs**:
- Slides in from right, width: 480px (or 100% on mobile)
- Backdrop overlay: semi-transparent black
- Close: X button, Esc key, or click backdrop
- Sticky footer with action buttons
- Scrollable content area
- Animate in with `ease-out` 250ms, out with `ease-in` 200ms

### Dialog / Modal

For confirmations, focused tasks, and destructive action warnings.

**Sizes**:
- `sm`: 400px - Confirmations, simple prompts
- `md`: 560px - Forms, detail views
- `lg`: 720px - Complex forms, previews

**Structure**:
- Title (text-lg, semibold) + optional description (text-sm, muted)
- Content area (scrollable if needed)
- Footer: Cancel (ghost button) + Primary action (filled button)
- For destructive actions: Red destructive button, require typing confirmation for critical operations

### Toast Notifications

Non-blocking feedback messages.

**Positions**: Bottom-right (desktop), bottom-center (mobile).

**Variants**:
- **Success**: Green left border, checkmark icon
- **Error**: Red left border, X icon, with retry action
- **Info**: Blue left border, info icon
- **Warning**: Amber left border, alert icon

**Behavior**:
- Stack vertically, max 3 visible at once
- Auto-dismiss after 5s (errors persist until dismissed)
- Swipe to dismiss (mobile), X button (desktop)
- Action button for undo/retry: "Contact deleted. [Undo]"
- Animate: slide in from bottom + fade, spring easing

### Inline Editing

Click-to-edit for quick field updates without opening a form.

**Pattern**:
1. Display value in normal text style
2. On click (or double-click for text areas): Transform into input with same dimensions
3. Show subtle `primary` bottom border on the input
4. Save on Enter or blur, cancel on Esc
5. Show brief "Saved" indicator (checkmark that fades out)

**Applicable to**: Contact name, deal value, stage, notes, tags, phone, email, custom fields.

### Avatar Component

```
Sizes: xs (20px), sm (24px), md (32px), lg (40px), xl (64px)

- Image: rounded-full, object-cover
- Fallback: Initials on colored background (deterministic color from name hash)
- Status dot: 8px circle, positioned bottom-right
  - Online: green
  - Away: amber
  - Offline: gray
- Group: Overlapping avatars (-8px margin), "+3" counter at end
```

### Badge / Tag System

**Badges** (status indicators):
- Small pill shape: `px-2 py-0.5`, `radius-full`, `text-xs`, `font-medium`
- Variants: solid (filled bg) or subtle (muted bg with colored text)
- Used for: Deal stages, contact status, priority levels

**Tags** (user-created categories):
- Pill shape: `px-2 py-0.5`, `radius-sm`, `text-xs`
- Uses tag color palette (8 colors)
- Removable: X button on hover
- Add: "+" button that opens an inline tag picker/creator

### Data Table

Shared table component used across Contacts, Companies, Deals (table view).

**Features**:
- Sortable columns (click header, tri-state: none → asc → desc)
- Resizable columns (drag column border)
- Reorderable columns (drag column header)
- Column visibility toggle (dropdown menu)
- Sticky first column (name) on horizontal scroll
- Pagination: "Showing 1-50 of 1,247" + page size selector (25, 50, 100)
- Bulk selection: Header checkbox for select all (current page), shift+click for range
- Row click: Navigate to detail view
- Virtualized rendering for large datasets (react-window or tanstack-virtual)

### Empty States

Every list view has a designed empty state:

```
┌────────────────────────────────────────┐
│                                        │
│           📋  (Illustration)           │
│                                        │
│      No contacts yet                   │
│                                        │
│   Start building your network by       │
│   adding your first contact.           │
│                                        │
│      [+ Add Contact]                   │
│                                        │
└────────────────────────────────────────┘
```

- Simple illustration or icon (not clip art)
- Headline: What's missing
- Description: Why it matters or what to do
- CTA button: Primary action to resolve

---

## Interaction Design

### State Styles

**Hover**:
- Buttons: Darken background 8% (`primary-hover`), transition 100ms
- Table rows: `background-muted`
- Cards: Subtle `shadow-sm` uplift
- Links: Underline on hover

**Focus**:
- Ring: 2px `ring` color, 2px offset, `radius-md`
- Applied to all interactive elements via `:focus-visible`
- No ring on mouse click (`:focus:not(:focus-visible)` removes it)

**Active / Pressed**:
- Buttons: Scale 0.98, darken 12%
- Cards: Scale 0.99
- Duration: 50ms for snappy feel

**Disabled**:
- Opacity 0.5, cursor: not-allowed
- No hover/focus effects

### Loading States

**Skeleton screens** (not spinners) for all content:

```
┌──────────────────────────────────────────┐
│  ██████████                ░░░░░  ░░░░░ │
│  ░░░░░░░░░░░░  ░░░░░░  ░░░░░░░░  ░░░░  │
│  ░░░░░░░░░░░░  ░░░░░░  ░░░░░░░░  ░░░░  │
│  ░░░░░░░░░░░░  ░░░░░░  ░░░░░░░░  ░░░░  │
│  ░░░░░░░░░░░░  ░░░░░░  ░░░░░░░░  ░░░░  │
└──────────────────────────────────────────┘
```

- Pulse animation: Subtle opacity oscillation (0.4 → 1.0), 1.5s duration
- Match exact layout of loaded content (same heights, widths, spacing)
- Use `rounded` shapes that approximate text lines and avatars
- Header skeleton loads before content skeleton
- Progressive loading: Show skeleton → replace sections as data arrives

**Inline loaders**:
- Button: Text replaced with small spinner (16px), button width locked
- Saving indicator: "Saving..." text near the field being edited

### Optimistic UI Updates

For speed perception, update the UI before server confirms:

- **Creating**: Item appears in list immediately (with subtle "syncing" indicator)
- **Updating**: Field changes instantly, reverts on error with toast
- **Deleting**: Item fades out immediately, undo toast for 5s, then hard delete
- **Moving deals**: Card moves to new column instantly with animation
- **Toggling**: Checkboxes, toggles respond immediately

On error: Revert change + show error toast with retry option.

### Error States

**Form validation**:
- Inline errors below fields, red text, shake animation (subtle)
- Validate on blur for first touch, on change after first error
- Error summary at top of form if multiple errors

**API / Network errors**:
- Toast notification with "Retry" button
- Full-page error: Illustration + "Something went wrong" + Retry button + Support link
- Offline banner: Yellow bar at top "You're offline. Changes will sync when reconnected."

**404 / Not Found**:
- Friendly message: "This [contact/deal] doesn't exist or was deleted"
- CTA: "Go back" or "Go to [section]"

---

## Dark Mode

Full dark mode via CSS custom properties and Tailwind `dark:` variant. Respects `prefers-color-scheme` by default, with manual toggle in settings.

### Dark Mode Color Overrides

```
/* Dark Mode */
--background:         224 71% 4%        /* #030712 */
--background-subtle:  220 15% 10%       /* #151921 */
--background-muted:   220 14% 14%       /* #1E2330 */
--background-inset:   220 15% 8%        /* #111520 */

--foreground:         0 0% 95%          /* #F2F2F2 */
--foreground-muted:   220 9% 60%        /* #8B95A5 */
--foreground-subtle:  220 9% 46%        /* #6B7280 */

--border:             220 14% 18%       /* #272E3A */
--border-strong:      220 14% 25%       /* #353E4E */

--ring:               221 83% 58%       /* #5B9BF6 - Slightly lighter for visibility */
```

**Primary** remains the same but adjusted for contrast:
```
--primary:            221 83% 58%       /* #5B9BF6 */
--primary-hover:      221 83% 65%       /* #7DB1F8 */
--primary-muted:      221 83% 12%       /* #0D1B33 */
```

**Semantic colors** in dark mode: Use the same hue but reduce saturation by ~10% and adjust lightness for dark backgrounds.

### Dark Mode Guidelines

1. **Never use pure black** (#000000). Use very dark blue-gray (#030712) for depth.
2. **Reduce shadow intensity** to near-zero in dark mode. Use subtle border emphasis instead.
3. **Swap shadow for border** on cards: In light mode cards use shadow, in dark mode they use `border` for definition.
4. **Images and illustrations**: Slightly reduce brightness (filter: brightness(0.9)) or provide dark variants.
5. **Colored elements** (tags, stages): Reduce opacity slightly or use darker variants for comfortable viewing.
6. **Transition**: `transition: background-color 200ms, color 200ms, border-color 200ms` on `html` element for smooth theme switching.

### Implementation

```css
/* Root light theme */
:root {
  --background: 0 0% 100%;
  --foreground: 224 71% 4%;
  /* ... all light tokens */
}

/* Dark theme */
:root.dark {
  --background: 224 71% 4%;
  --foreground: 0 0% 95%;
  /* ... all dark tokens */
}

/* System preference fallback */
@media (prefers-color-scheme: dark) {
  :root:not(.light) {
    /* dark tokens */
  }
}
```

Tailwind config maps these to utility classes:
```js
theme: {
  colors: {
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    primary: { DEFAULT: 'hsl(var(--primary))', ... },
    // etc.
  }
}
```

---

## Accessibility

### WCAG 2.1 AA Compliance

**Color Contrast**:
- Normal text (< 18px): Minimum 4.5:1 contrast ratio against background
- Large text (>= 18px or >= 14px bold): Minimum 3:1 contrast ratio
- UI components and graphical objects: Minimum 3:1 against adjacent colors
- All color combinations verified for both light and dark modes
- Never use color alone to convey information (always pair with icon, text, or pattern)

**Focus Management**:
- Visible focus indicators on all interactive elements (2px ring)
- Focus trapped within modals, sheets, and command palette when open
- Focus restored to trigger element when overlay closes
- Skip-to-content link as first focusable element
- Logical tab order following visual layout

### Keyboard Navigation

**Global shortcuts**:
| Shortcut      | Action                          |
|---------------|---------------------------------|
| `Cmd+K`       | Open command palette            |
| `Cmd+/`       | Show keyboard shortcuts panel   |
| `N`           | Create new (context-aware)      |
| `Esc`         | Close overlay / deselect        |
| `/`           | Focus search (when not in input)|

**Table navigation**:
| Shortcut      | Action                          |
|---------------|---------------------------------|
| `↑/↓`         | Navigate rows                   |
| `Enter`       | Open selected row               |
| `Space`       | Toggle row selection             |
| `Shift+↑/↓`  | Extend selection                 |
| `Cmd+A`       | Select all                      |

**Kanban navigation**:
| Shortcut      | Action                          |
|---------------|---------------------------------|
| `←/→`         | Move between columns            |
| `↑/↓`         | Move between cards in column    |
| `Enter`       | Open card detail                |
| `M`           | Move card (opens stage picker)  |

### Screen Reader Support

- Semantic HTML: Use `<nav>`, `<main>`, `<aside>`, `<header>`, `<section>`, `<table>`, `<dialog>` appropriately
- ARIA landmarks for major page regions
- `aria-label` for icon-only buttons (e.g., "Close", "Delete contact", "Sort ascending")
- `aria-live="polite"` for toast notifications and dynamic content updates
- `aria-expanded` for collapsible sections and dropdowns
- `aria-selected` for active tab, selected table rows
- `aria-describedby` for form fields linking to error messages and help text
- `role="status"` for loading indicators
- Table column headers with `scope="col"`, row headers with `scope="row"`
- Meaningful alt text for all images; decorative images use `alt=""`
- Announce route changes for SPA navigation

### Motion and Animation

- Respect `prefers-reduced-motion`:
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  ```
- All animations serve a functional purpose (indicating state change, guiding attention)
- No auto-playing animations or continuous motion
- Drag and drop has keyboard alternative (move via menu or shortcut)

### Touch Targets

- Minimum 44x44px touch target for all interactive elements on mobile
- Adequate spacing between adjacent touch targets (minimum 8px gap)
- Larger hit areas for frequently used controls (checkboxes, action buttons)

---

## Appendix: Tailwind CSS Configuration Reference

```js
// tailwind.config.ts (key excerpts)
{
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      fontSize: {
        xs: ['11px', { lineHeight: '16px' }],
        sm: ['12px', { lineHeight: '16px' }],
        base: ['13px', { lineHeight: '20px' }],
        md: ['14px', { lineHeight: '20px' }],
        lg: ['16px', { lineHeight: '24px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['30px', { lineHeight: '36px' }],
      },
      borderRadius: {
        sm: '4px',
        md: '6px',
        lg: '8px',
        xl: '12px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(0,0,0,0.05)',
        sm: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        md: '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.04)',
        lg: '0 10px 15px rgba(0,0,0,0.08), 0 4px 6px rgba(0,0,0,0.04)',
        xl: '0 20px 25px rgba(0,0,0,0.10), 0 8px 10px rgba(0,0,0,0.04)',
      },
      colors: {
        background: 'hsl(var(--background))',
        'background-subtle': 'hsl(var(--background-subtle))',
        'background-muted': 'hsl(var(--background-muted))',
        foreground: 'hsl(var(--foreground))',
        'foreground-muted': 'hsl(var(--foreground-muted))',
        'foreground-subtle': 'hsl(var(--foreground-subtle))',
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          foreground: 'hsl(var(--primary-foreground))',
          muted: 'hsl(var(--primary-muted))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          muted: 'hsl(var(--success-muted))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          muted: 'hsl(var(--warning-muted))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          muted: 'hsl(var(--destructive-muted))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          muted: 'hsl(var(--info-muted))',
          foreground: 'hsl(var(--info-foreground))',
        },
        stage: {
          lead: 'hsl(var(--stage-lead))',
          qualified: 'hsl(var(--stage-qualified))',
          proposal: 'hsl(var(--stage-proposal))',
          negotiation: 'hsl(var(--stage-negotiation))',
          won: 'hsl(var(--stage-won))',
          lost: 'hsl(var(--stage-lost))',
        },
      },
      keyframes: {
        'skeleton-pulse': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        },
        'slide-in-right': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'toast-enter': {
          from: { transform: 'translateY(100%)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'skeleton-pulse': 'skeleton-pulse 1.5s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 250ms ease-out',
        'fade-in': 'fade-in 150ms ease-out',
        'toast-enter': 'toast-enter 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
}
```

---

## Appendix: Component Library (shadcn/ui Base)

The design system builds on **shadcn/ui** components, customized to match these design tokens. Key components and their customizations:

| Component        | shadcn/ui Base    | Customization                                          |
|------------------|-------------------|--------------------------------------------------------|
| Button           | `button`          | Compact sizes (h-8, h-9), 13px text, tighter padding  |
| Input            | `input`           | h-9, 13px text, subtle border, focus ring              |
| Select           | `select`          | Searchable variant for long lists (companies, contacts)|
| Table            | `table`           | Sticky header, sortable, selectable, virtualizable     |
| Dialog           | `dialog`          | Size variants (sm/md/lg), trap focus                   |
| Sheet            | `sheet`           | Right-side default, 480px width                        |
| Command          | `command`          | Full command palette with categories and fuzzy search   |
| Toast            | `sonner`          | Bottom-right, stacking, action buttons                 |
| Tabs             | `tabs`            | Underline style (not boxed), compact                   |
| Badge            | `badge`           | Stage and tag color variants                            |
| Avatar           | `avatar`          | Status dot, group, size variants                       |
| Dropdown Menu    | `dropdown-menu`   | Consistent styling, keyboard nav                       |
| Tooltip          | `tooltip`         | 200ms delay, arrow, dark bg                            |
| Skeleton         | `skeleton`        | Pulse animation, layout-matching                       |
| Popover          | `popover`         | Date pickers, filter panels                            |
| Calendar         | `calendar`        | For date fields (expected close, follow-up dates)       |

---

*This design document serves as the source of truth for all UI/UX decisions in Simple CRM. All implementations should reference these patterns for consistency.*

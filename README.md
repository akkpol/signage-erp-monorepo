# SignageERP - Single-Tenant MVP

**Modern ERP System for Signage Shops** (Phase 1: Single Organization Focus)

---

## 🎯 Project Vision

**Phase 1 (MVP):** Build a fully functional ERP for **ONE signage shop** first

- Focus: Core features that work perfectly for a single organization
- Timeline: 4 weeks to launch
- Validate business logic before expanding to Multi-tenant SaaS

**Phase 2 & Beyond:** Expand to Multi-tenant SaaS after MVP proves successful

---

## ✨ Core Features (MVP - Phase 1)

This ERP system provides:

### 🧶 **Stock Management**

Track materials, monitor usage, and get low-stock alerts

### 📦 **Kanban Workflow**

Visual order tracking across Sales & Production boards (manual drag-and-drop)

### 🎨 **Smart Pricing Engine** *(Already Built!)*

Dynamic pricing based on material, dimensions, and customer tiers

### 🧾 **Accounting Module**

Generate Quotations, Invoices, and Receipts (PDF export)

### 📊 **Executive Dashboard**

Mobile-first analytics for quick decision-making

---

## 🏗️ Architecture

```
SignageERP Monorepo (Turborepo)
├── apps/
│   ├── web/          # Next.js 15 Frontend (App Router)
│   └── api/          # NestJS Backend + Prisma ORM
└── packages/
    └── types/        # Shared TypeScript Types
```

**Key Files:**

- `apps/api/prisma/schema.prisma` - Database models
- `packages/types/src/index.ts` - Shared interfaces
- `apps/web/` - Next.js frontend with HeroUI v3

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Monorepo** | Turborepo |
| **Frontend** | Next.js 15 (App Router) + TypeScript + TailwindCSS |
| **UI Components** | HeroUI v3 / Shadcn UI |
| **Backend** | NestJS + TypeScript |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **State** | React Query / TanStack Query |
| **Auth** | NextAuth.js (planned Phase 2) |

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup database (Supabase connection already configured)
cd apps/api
npx prisma generate
npx prisma db push

# Run development servers (all apps)
npm run dev

# Or run individual apps
cd apps/web && npm run dev    # Frontend: http://localhost:3000
cd apps/api && npm run dev    # Backend: http://localhost:3001
```

---

## 📋 Project Status

**Current Phase:** Documentation Synchronization  
**Next Step:** Stock Management System Implementation

See [REQUIREMENTS.md](./REQUIREMENTS.md) for full MVP scope and timeline.

---

## 📚 Documentation

- **[REQUIREMENTS.md](./REQUIREMENTS.md)** - MVP scope, timeline, and success criteria
- **[mvp_scope.md](./brain/mvp_scope.md)** - Detailed feature breakdown
- **[docs/specifications/](./docs/specifications/)** - Business logic and workflows
- **[.agent/workflows/](./. agent/workflows/)** - Development workflows

---

## 🎯 MVP Success Criteria

MVP is successful if:

- ✅ Shop owner checks Dashboard and knows today's sales
- ✅ Production staff checks Kanban and knows which jobs to work on
- ✅ Staff checks Stock and knows material inventory levels
- ✅ Can generate Quotations and Invoices

---

## 📝 License

ISC

# 🏗️ Blueprint: SignageERP "Clean Build" (Option A)

> **Scenario:** Rebuilding SignageERP from scratch with a unified Next.js 15 stack.
> **Goal:** Zero technical debt, optimal performance, single-tenant MVP → multi-tenant ready.
> **Location:** `d:\PrintFlowERP\whatif`

---

## 1. 🏛️ Core Architecture

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.x
- **Database:** PostgreSQL (Supabase)
- **ORM:** Prisma 6.x (Latest)
- **Styling:** Tailwind CSS v4 + Shadcn UI (for complex data/forms)
- **State Management:** Nuqs (URL state) + React Query (minimal needed with Server Actions)
- **Auth:** Supabase Auth (SSR)

### 🔹 Key Architectural Decisions

1.  **No Separate API Server:** All logic lives in Next.js Server Actions.
2.  **Strict Type Safety:** Zod schemas for everything (DB, Forms, API).
3.  **Modular Feature Folder Structure:**
    ```
    src/
      ├── modules/
      │     ├── orders/          # Feature: Orders
      │     │     ├── components/
      │     │     ├── actions.ts # Server Actions
      │     │     ├── schema.ts  # Zod validation
      │     │     └── types.ts
      │     ├── inventory/       # Feature: Inventory
      │     └── ...
      ├── db/                    # Shared Prisma setup
      └── lib/                   # Shared utilities
    ```

---

## 2. 🗄️ Database Schema Design (Unified)

This schema merges the best parts of the old schema with new requirements (Multi-tenant ready).

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// --- Enum Definitions ---

enum UserRole {
  OWNER
  ADMIN
  SALES
  DESIGNER
  PRODUCTION
}

enum OrderStatus {
  DRAFT
  QUOTED
  CONFIRMED
  IN_DESIGN
  IN_PRODUCTION
  COMPLETED
  CANCELLED
}

// --- Core Models ---

model Organization {
  id          String   @id @default(uuid())
  name        String
  slug        String   @unique // for subdomain/url
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  users       User[]
  customers   Customer[]
  products    Product[]
  materials   Material[]
  orders      Order[]
}

model User {
  id             String       @id @default(uuid())
  email          String       @unique
  name           String?
  role           UserRole     @default(SALES)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model Customer {
  id             String       @id @default(uuid())
  name           String
  phone          String?
  lineId         String?
  taxId          String?
  address        String?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])
  
  orders         Order[]

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

// --- Inventory & Pricing ---

model Material {
  id             String       @id @default(uuid())
  name           String
  type           String       // VINYL, STICKER, etc.
  unit           String       // SQM, PIECE
  costPrice      Decimal      @db.Decimal(10, 2)
  sellingPrice   Decimal      @db.Decimal(10, 2)
  inStock        Decimal      @default(0) @db.Decimal(10, 2)
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  transactions   StockTransaction[]
  
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model StockTransaction {
  id          String    @id @default(uuid())
  materialId  String
  material    Material  @relation(fields: [materialId], references: [id])
  quantity    Decimal   @db.Decimal(10, 2)
  type        String    // IN, OUT, ADJUST
  reference   String?   // Order ID or PO Number
  notes       String?
  createdAt   DateTime  @default(now())
}

// --- Sales & Production ---

model Order {
  id             String       @id @default(uuid())
  orderNumber    String       // Friendly ID: ORD-2024-001
  status         OrderStatus  @default(DRAFT)
  
  customerId     String
  customer       Customer     @relation(fields: [customerId], references: [id])
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id])

  items          OrderItem[]
  
  totalAmount    Decimal      @db.Decimal(10, 2)
  vatAmount      Decimal      @db.Decimal(10, 2)
  grandTotal     Decimal      @db.Decimal(10, 2)
  
  hasDesign      Boolean      @default(false)
  designStatus   String?      // PENDING, APPROVED

  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt
}

model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id])
  
  name        String
  width       Decimal? @db.Decimal(10, 2)
  height      Decimal? @db.Decimal(10, 2)
  quantity    Int
  
  unitPrice   Decimal  @db.Decimal(10, 2)
  totalPrice  Decimal  @db.Decimal(10, 2)
  
  details     Json?    // Stores specific finishing options snapshot
}
```

---

## 3. 🔄 System Flow (User Journey)

### Scenario: Walk-in Customer for Vinyl Banner

1.  **Sales (Dashboard):**
    *   Creates **New Order**.
    *   Selects **Customer** (or creates new).
    *   Adds **Item**: "Vinyl Banner".
    *   Inputs Dimensions: `2m x 1m` | Qty: `1`.
    *   System calculates Price: `2 * 1 * UnitPrice`.
    *   Status: `DRAFT` → Sales confirms → `QUOTED`.

2.  **Design (Kanban: Design Lane):**
    *   Designer sees new job in "To Do".
    *   Uploads draft artwork.
    *   Customer approves (via Line/Email).
    *   Designer moves card to "Ready for Print".
    *   Status: `IN_DESIGN` → `IN_PRODUCTION`.

3.  **Production (Kanban: Production Lane):**
    *   Production staff sees job.
    *   Checks material "Vinyl Glossy".
    *   **Stock deduction:** System auto-calculates usage `2 sqm` + waste.
    *    Prints → Finishes.
    *   Moves card to "Completed".
    *   Status: `COMPLETED`.

4.  **Accounting:**
    *   Generates **Invoice (PDF)** from Order data.
    *   Records Payment.
    *   Job Closed.

---

## 4. 📦 Module Breakdown (Implementation Order)

We will build these sequentially in `packages/whatif`.

### Phase 1: Foundation (Week 1)
- [ ] **Setup:** Next.js 15, Prisma, Shadcn, Tailwind v4.
- [ ] **Auth:** Supabase Auth integration + Role-based middleware.
- [ ] **Tenant Isolation:** Logic to ensure `organizationId` is always checked.

### Phase 2: Inventory & Pricing (Week 1-2)
- [ ] **Material Master:** CRUD for materials.
- [ ] **Stock Transactions:** IN/OUT logic.
- [ ] **Pricing Engine:** Calculation utility (Width x Height x Price).

### Phase 3: Sales Workflow (Week 2-3)
- [ ] **Customer CRM:** Basic contact management.
- [ ] **Order Management:** Create/Edit orders with dynamic line items.
- [ ] **Quotation PDF:** Generate PDF for customers.

### Phase 4: Production Tracking (Week 3-4)
- [ ] **Kanban Board:** Drag-and-drop workflow.
- [ ] **Status Transitions:** Logic connecting Kanban moves to Order Status.
- [ ] **Dashboard:** High-level metrics.

---

# 🚀 Module Execution Plan: SignageERP "Clean Build"

> **Context:** This plan details the execution steps for the `whatif` clean build scenario.
> **Philosophy:** Autonomous execution with "Default to Action".
> **Stack:** Next.js 15, Prisma, Supabase Auth, Shadcn UI, Tailwind v4.

---

## 🏗️ Phase 1: Foundation (Zero Technical Debt)

**Goal:** Setup the core infrastructure that all other modules will depend on.

### 1.1 Project Scaffolding

- [ ] **Initialize Next.js 15:** `npx create-next-app@latest whatif --typescript --tailwind --eslint`
- [ ] **Configure Turborepo:** Add `whatif` to monorepo workspace.
- [ ] **Install Core Deps:** `prisma`, `@prisma/client`, `lucide-react`, `clsx`, `tailwind-merge`.
- [ ] **Setup Shadcn UI:** Initialize and add basic components (Button, Input, Card, Table, Sheet, Dialog).

### 1.2 Database & Auth

- [ ] **Schema Setup:** Apply the unified `schema.prisma` from Blueprint.
- [ ] **Supabase Auth:**
  - Install `@supabase/ssr` `@supabase/supabase-js`.
  - Create `utils/supabase/server.ts` and `middleware.ts` for session handling.
  - Implement `auth/callback` route.
  - Create `LoginPage` component.

### 1.3 Layout & Navigation

- [ ] **App Shell:** Create `DashboardLayout` with Sidebar and Topbar.
- [ ] **Navigation Menu:** Links to Dashboard, Orders, Inventory, Customers.
- [ ] **Theme:** Dark mode by default (Cyan/Magenta highlights).

**Verification:**

- `npm run dev` starts without errors.
- Can login with Supabase Auth.
- Dashboard layout is responsive.

---

## 📦 Phase 2: Inventory Management (P0)

**Goal:** Manage materials and stock transactions (Fundamental for ERP).

### 2.1 Material Master

- [ ] **Database:** Ensure `Material` model exists.
- [ ] **Server Actions:**
  - `getMaterials()`: Fetch with pagination/search.
  - `createMaterial(data)`: Validate with Zod.
  - `updateMaterial(id, data)`: Handle optimistic UI updates.
- [ ] **UI Components:**
  - `MaterialTable`: DataTable with sorting/filtering.
  - `MaterialForm`: Sheet/Dialog for Create/Edit.
- [ ] **Page:** `/inventory` route.

### 2.2 Stock Transactions (IN/OUT)

- [ ] **Database:** Ensure `StockTransaction` model.
- [ ] **Server Actions:**
  - `adjustStock(materialId, qty, type, reason)`: Transactional update (update material + log transaction).
- [ ] **UI:**
  - `StockAdjustmentDialog`: Select Type (IN/OUT), Qty, Reason.
  - `TransactionHistory`: Sub-table or separate view.

**Verification:**

- Create "Vinyl".
- Add stock (IN) 10 units.
- Remove stock (OUT) 2 units.
- Verify balance = 8.
- Verify 2 transaction logs.

---

## 💰 Phase 3: Sales & Orders (P0)

**Goal:** Create orders and generate invoices.

### 3.1 Customer CRM

- [ ] **Database:** Ensure `Customer` model.
- [ ] **Server Actions:** CRUD for Customers.
- [ ] **UI:** Simple Customer List and Create/Edit Form.

### 3.2 Order Management

- [ ] **Database:** `Order` and `OrderItem` models.
- [ ] **Pricing Engine (Logic):**
  - `calculatePrice(width, height, unitPrice)` helper.
- [ ] **Server Actions:**
  - `createOrder(data)`: Transactional create (Order + Items).
  - `updateOrderStatus(id, status)`.
- [ ] **UI:**
  - `OrderList`: Kanban or Table view (switchable?). Start with Table.
  - `OrderForm`: Complex form with dynamic line items (use `useFieldArray` concept).

### 3.3 Quotation/Invoice

- [ ] **UI:** `InvoicePreview` component (printable).
- [ ] **Page:** `/orders/[id]/invoice` (Print-friendly CSS).

**Verification:**

- Create Customer "John Doe".
- Create Order with 2 items.
- Verify Total calculation.
- Print Invoice.

---

## 🏭 Phase 4: Production (Kanban) (P0)

**Goal:** Track work in progress.

### 4.1 Kanban Board

- [ ] **UI:** Install `@dnd-kit`.
- [ ] **Component:** `KanbanBoard` (Columns: To Do, In Progress, Done).
- [ ] **Integration:** Dragging card updates `Order.status`.

### 4.2 Dashboard

- [ ] **Server Actions:** `getDashboardStats()` (Sales today, Pending jobs).
- [ ] **UI:** Stats Cards and "Recent Orders" table.

**Verification:**

- Drag order from "To Do" to "In Progress".
- Refresh page -> Position persists.
- Dashboard shows correct numbers.

---

## 🧪 Phase 5: Verification & Polish

- [ ] **E2E Tests:** Playwright flow (Login -> Create Material -> Create Order -> Check Dashboard).
- [ ] **i18n:** Wrap all text strings with `t()`.
- [ ] **Mobile Check:** Responsive tweaks.

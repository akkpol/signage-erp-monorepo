# Feature: Executive Dashboard

**วันที่**: 2026-02-10  
**เจ้าของ**: SignageERP Team  
**สถานะ**: Draft

---

## ภาพรวม

Dashboard สำหรับผู้บริหาร (Executive Dashboard) ที่ออกแบบให้ใช้งานได้ทั้งบน Mobile, Tablet, และ Desktop โดยเน้น Mobile-First Design เพื่อให้เจ้าของร้านป้ายสามารถตรวจสอบสถานะธุรกิจได้ทุกที่ทุกเวลา

---

## Business Value

- **Real-time Decision Making**: เจ้าของร้านสามารถตัดสินใจเชิงธุรกิจได้ทันทีโดยไม่ต้องรอเข้า Office
- **Operational Visibility**: เห็นภาพรวมของงานที่กำลังดำเนินการทั้งหมดในมุมมองเดียว
- **Financial Transparency**: ติดตามยอดขายและกำไรแบบ Real-time
- **Inventory Awareness**: รับรู้สถานะสต็อกวัสดุก่อนที่จะขาดแคลน

---

## User Stories

### US-1: View Daily Sales

**As a** shop owner  
**I want to** see today's total sales revenue at a glance  
**So that** I can track daily business performance without manual calculation

### US-2: Monitor Pending Jobs

**As a** shop owner  
**I want to** see the number of incomplete orders  
**So that** I can understand current workload

### US-3: Urgent Job Alerts

**As a** shop owner  
**I want to** see jobs that are due within 3 days highlighted in red  
**So that** I can prioritize urgent work and avoid missed deadlines

### US-4: Stock Overview

**As a** shop owner  
**I want to** see materials with low stock levels  
**So that** I can reorder before running out

### US-5: Mobile Access

**As a** shop owner  
**I want to** check the dashboard on my smartphone  
**So that** I can monitor business even when I'm away from the shop

---

## Acceptance Criteria

### AC-1: Mobile-First Design

- [ ] Dashboard loads within 3 seconds on 4G mobile connection
- [ ] All widgets are readable without zooming on mobile (min 320px width)
- [ ] Touch-friendly interface (buttons min 44x44px)
- [ ] Responsive layout adapts to Tablet (768px) and Desktop (1024px+)

### AC-2: Daily Sales Widget

- [ ] Shows today's total sales revenue (sum of all paid invoices)
- [ ] Updates automatically when new payment is recorded
- [ ] Displays currency in Thai Baht (฿)
- [ ] Shows comparison with yesterday (optional: +/-%)

### AC-3: Pending Jobs Widget

- [ ] Shows count of orders with status NOT "Completed"
- [ ] Grouped by status (Quoted, In Progress, etc.)
- [ ] Clickable to navigate to Kanban board

### AC-4: Urgent Jobs Alert

- [ ] Highlights orders where deadline is ≤ 3 days from today
- [ ] Shows in RED color for high visibility
- [ ] Displays customer name and deadline date
- [ ] Updates daily at midnight

### AC-5: Stock Overview Widget

- [ ] Lists materials where current quantity < minimum threshold
- [ ] Shows material name, current stock, and unit
- [ ] Red warning icon for critical low stock

---

## Business Logic

### Sales Calculation

```
Today's Sales = SUM(Invoice.amount WHERE Invoice.paidAt = TODAY AND Invoice.status = "PAID")
```

### Pending Jobs Count

```
Pending = COUNT(Order WHERE Order.status != "Completed")
```

### Urgent Jobs Definition

```
Urgent = Order WHERE (Order.deadline - TODAY) <= 3 days AND Order.status != "Completed"
```

### Low Stock Threshold

```
Low Stock = Material WHERE Material.currentStock < Material.minimumStock
```

---

## Technical Requirements

### Frontend

- **Framework**: Next.js 15 (App Router)
- **UI Library**: HeroUI v3 + TailwindCSS
- **Data Fetching**: Server Components (App Router) for initial load
- **Real-time Updates**: React Query for auto-refresh (polling every 60s)

### Backend

- **API Endpoints**: Server Actions (Next.js)
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma

### Performance

- **First Load**: < 3s on 4G
- **Subsequent Loads**: Use cached data with stale-while-revalidate
- **Auto-refresh**: Polling every 60 seconds (configurable)

---

## UI/UX Requirements

### Layout Structure (Mobile-First)

```
┌─────────────────────────┐
│  📊 Executive Dashboard  │
├─────────────────────────┤
│  💰 Today's Sales        │
│  ฿ 45,320               │
│  ↑ +12% vs yesterday    │
├─────────────────────────┤
│  📦 Pending Jobs         │
│  🟡 Quoted: 3           │
│  🔵 In Progress: 7      │
│  🟢 QC: 2               │
├─────────────────────────┤
│  ⚠️  Urgent Jobs (3)     │
│  🔴 ร้านอาหาร ABC       │
│     Due: 2026-02-12     │
│  🔴 ป้ายโชว์รูม XYZ     │
│     Due: 2026-02-11     │
├─────────────────────────┤
│  🧶 Low Stock (2)        │
│  ⚠️  Vinyl Premium       │
│     10 sqm (Min: 50)    │
│  ⚠️  Inkjet Eco         │
│     2 rolls (Min: 5)    │
└─────────────────────────┘
```

### Color Scheme

- **Primary Color**: Blue (#0070f3) - Trust, Professionalism
- **Success**: Green (#10b981) - Completed jobs
- **Warning**: Yellow/Orange (#f59e0b) - Low stock
- **Danger**: Red (#ef4444) - Urgent jobs
- **Neutral**: Gray (#6b7280) - Pending

### Typography

- **Headings**: Bold, 18-24px (Mobile), 24-32px (Desktop)
- **Numbers**: XX-Large, Bold (Sales figures)
- **Body**: 14-16px, Regular

---

## API Requirements

### Server Actions (Next.js App Router)

#### 1. `getDashboardData()`

```typescript
export async function getDashboardData() {
  return {
    todaySales: number,
    yesterdaySales: number,
    pendingJobs: {
      quoted: number,
      inProgress: number,
      qc: number
    },
    urgentJobs: {
      id: string,
      customerName: string,
      deadline: Date
    }[],
    lowStock: {
      materialName: string,
      currentStock: number,
      minimumStock: number,
      unit: string
    }[]
  }
}
```

#### 2. Database Queries (Prisma)

**Today's Sales:**

```typescript
const todaySales = await prisma.invoice.aggregate({
  _sum: { amount: true },
  where: {
    paidAt: {
      gte: startOfDay(new Date()),
      lte: endOfDay(new Date())
    },
    status: 'PAID'
  }
});
```

**Pending Jobs:**

```typescript
const pendingJobs = await prisma.order.groupBy({
  by: ['status'],
  _count: true,
  where: {
    status: { not: 'COMPLETED' }
  }
});
```

**Urgent Jobs:**

```typescript
const urgentJobs = await prisma.order.findMany({
  where: {
    deadline: {
      lte: addDays(new Date(), 3)
    },
    status: { not: 'COMPLETED' }
  },
  include: { customer: true },
  orderBy: { deadline: 'asc' }
});
```

**Low Stock:**

```typescript
const lowStock = await prisma.material.findMany({
  where: {
    currentStock: {
      lt: prisma.material.fields.minimumStock
    }
  }
});
```

---

## Testing Requirements

### Unit Tests

- [ ] Sales calculation aggregates invoices correctly
- [ ] Pending jobs count excludes completed orders
- [ ] Urgent jobs filter works for 3-day deadline
- [ ] Low stock comparison logic is accurate

### Integration Tests

- [ ] Dashboard loads all widgets successfully
- [ ] Real-time updates refresh data every 60s
- [ ] Server Actions return correct data structure

### E2E Tests (Playwright)

- [ ] Dashboard is accessible at `/dashboard`
- [ ] All widgets render on mobile viewport (375px)
- [ ] All widgets render on desktop viewport (1920px)
- [ ] Clicking "Pending Jobs" navigates to Kanban
- [ ] Urgent job deadline is displayed in red

### Performance Tests

- [ ] Lighthouse Score > 90 (Mobile)
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s

---

## Dependencies

### Feature Dependencies

- **Stock Management System**: Required for "Low Stock" widget
- **Order Management (Kanban)**: Required for "Pending Jobs" and "Urgent Jobs"
- **Accounting Module**: Required for "Today's Sales" (Invoice data)

### Technical Dependencies

- **Prisma Schema**: Must have `Order`, `Invoice`, `Material` models
- **Authentication**: Dashboard should be behind login (Phase 2)
- **Date Library**: `date-fns` for date calculations

---

## Implementation Notes

### MVP Scope (Phase 1)

**INCLUDE:**

- ✅ Today's Sales (simple sum)
- ✅ Pending Jobs count
- ✅ Urgent Jobs (3-day deadline)
- ✅ Low Stock alerts
- ✅ Mobile-responsive design

**DEFER to Phase 2:**

- ❌ Profit/Loss calculation (complex accounting)
- ❌ Real-time P&L charts
- ❌ Staff performance tracking
- ❌ Advanced analytics with filters
- ❌ Export to PDF/Excel

---

## Reference Screenshots

(To be added after UI design using Stitch)

---

**Last Updated:** 2026-02-10  
**Related Specs:** `usecaseDef.md`, `FutureAcc.md`

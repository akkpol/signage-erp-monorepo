# Feature: Order Management (Kanban Board)

**วันที่**: 2026-02-10  
**เจ้าของ**: SignageERP Team  
**สถานะ**: Draft

---

## ภาพรวม

ระบบ Kanban Board สำหรับจัดการออร์เดอร์ (Order Management) แบบ Visual Workflow โดยแบ่งออกเป็น 2 บอร์ดหลัก:

1. **Sales Board** - สำหรับฝ่ายขายติดตามสถานะการเสนอราคาและการอนุมัติ
2. **Production Board** - สำหรับฝ่ายผลิตติดตามสถานะการผลิต QC และจัดส่ง

**MVP Scope**: Manual drag-and-drop เท่านั้น (ไม่มี Automation, WIP Limits ในเฟส 1)

---

## Business Value

- **Visual Workflow**: เห็นภาพรวมงานทั้งหมดในมุมมองเดียว ไม่ต้องถามคนอื่น
- **Reduced Bottlenecks**: เห็นงานที่ค้างในแต่ละขั้นตอน จัดการคอขวดได้ทันท่วงที
- **Accountability**: แต่ละทีมรู้ความรับผิดชอบของตัวเอง (card อยู่ใน column ไหน = ใครรับผิดชอบ)
- **Real-time Status**: ลูกค้าถามว่างานถึงไหนแล้ว ตอบได้ทันทีโดยดูบอร์ด

---

## User Stories

### US-1: Sales Workflow

**As a** sales representative  
**I want to** move order cards between "New → Quoted → Approved"  
**So that** I can track quotation status visually

### US-2: Production Workflow

**As a** production staff  
**I want to** move order cards between "Printing → Finishing → QC → Ready"  
**So that** I can see which jobs I need to work on next

### US-3: Visual Status at a Glance

**As a** shop owner  
**I want to** see all orders grouped by status in columns  
**So that** I can understand overall workload instantly

### US-4: Job Details Quick View

**As a** staff member  
**I want to** see customer name, size, and deadline on each card  
**So that** I can identify urgent jobs without clicking into details

### US-5: Manual Drag-and-Drop

**As a** staff member  
**I want to** drag order cards to the next column  
**So that** I can update status quickly without complex forms

---

## Acceptance Criteria

### AC-1: Sales Board Columns

- [ ] New - ลูกค้าขอใบเสนอราคา
- [ ] Quoted - ส่งใบเสนอราคาแล้ว (รอลูกค้าตอบกลับ)
- [ ] Approved - ลูกค้าอนุมัติงาน (พร้อมเข้าผลิต)
- [ ] Completed - งานเสร็จสมบูรณ์

### AC-2: Production Board Columns

- [ ] Printing - กำลังพิมพ์
- [ ] Finishing - กำลังตบแต่ง/ตัด/เคลือบ
- [ ] QC - ตรวจสอบคุณภาพ
- [ ] Ready - พร้อมส่ง/ติดตั้ง

### AC-3: Card Display

- [ ] แสดงชื่อลูกค้า (Customer name)
- [ ] แสดงขนาดงาน (Width × Height)
- [ ] แสดง Deadline (วันส่งมอบ)
- [ ] แสดงป้ายสี Red ถ้างานเร่งด่วน (Deadline ≤ 3 วัน)

### AC-4: Drag-and-Drop Functionality

- [ ] ลากการ์ดจาก column นึงไป column อื่นได้
- [ ] บันทึกสถานะใหม่ลง database ทันที
- [ ] แสดง confirmation message เมื่ออัปเดตสำเร็จ

### AC-5: MVP Scope Limitations (Phase 1)

- [ ] **NO** WIP Limits (จำกัดจำนวนงานต่อ column)
- [ ] **NO** Auto-reserve materials
- [ ] **NO** Automation rules (auto-move cards)
- [ ] **NO** LINE notifications

---

## Business Logic

### Sales Board State Transitions

```
New → Quoted → Approved → Completed
       ↓
   (can also go to Cancelled)
```

### Production Board State Transitions

```
Approved → Printing → Finishing → QC → Ready → Completed
                                   ↓
                                Rework (ถ้า QC fail - Phase 2)
```

### Urgent Job Definition

```
Urgent = (Order.deadline - TODAY) <= 3 days
```

### Card Grouping

- Orders are grouped by `status` field in database
- Each column displays orders WHERE `status = column_name`

---

## Technical Requirements

### Frontend

- **Framework**: Next.js 15 (App Router)
- **Drag-and-Drop**: `@dnd-kit/core` (modern React DnD library)
- **UI Components**: HeroUI v3 Card component
- **State**: Optimistic updates (UI updates immediately, then sync with DB)

### Backend

- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **API**: Server Actions for `updateOrderStatus(orderId, newStatus)`

### Database Schema (Prisma)

```prisma
model Order {
  id          String   @id @default(cuid())
  customerName String
  width       Float    // cm
  height      Float    // cm
  deadline    DateTime
  status      OrderStatus
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum OrderStatus {
  NEW
  QUOTED
  APPROVED
  PRINTING
  FINISHING
  QC
  READY
  COMPLETED
  CANCELLED
  REWORK // Phase 2
}
```

---

## UI/UX Requirements

### Desktop Layout (Horizontal Scrolling)

```
┌────────────────────────────────────────────────────────────────┐
│  📦 Sales Board                                                │
├────────┬────────┬────────┬────────────┬──────────┬──────────┤
│  New   │ Quoted │Approved│ Completed  │          │          │
│  (3)   │  (5)   │  (2)   │   (10)     │          │          │
├────────┼────────┼────────┼────────────┼──────────┼──────────┤
│ ┌────┐ │┌────┐  │┌────┐  │  ┌────┐   │          │          │
│ │Card│ ││Card│  ││Card│  │  │Card│   │          │          │
│ └────┘ │└────┘  │└────┘  │  └────┘   │          │          │
└────────┴────────┴────────┴────────────┴──────────┴──────────┘
```

### Card Component

```
┌─────────────────────────┐
│ 🏢 ร้านอาหาร ABC        │  ← Customer name
│ 📏 150 × 200 cm         │  ← Dimensions
│ 📅 Due: 2026-02-12      │  ← Deadline
│ 🔴 URGENT               │  ← Red badge if ≤ 3 days
└─────────────────────────┘
```

### Color Coding

- **Green border**: Completed
- **Yellow border**: Quoted (waiting for customer)
- **Red badge**: Urgent (deadline ≤ 3 days)
- **Blue border**: In progress (Printing, Finishing, QC)

---

## API Requirements

### Server Action: `updateOrderStatus`

```typescript
'use server'

export async function updateOrderStatus(
  orderId: string, 
  newStatus: OrderStatus
) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: newStatus,
        updatedAt: new Date()
      }
    });
    
    return { success: true, order: updatedOrder };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

### Server Action: `getKanbanData`

```typescript
'use server'

export async function getKanbanData(board: 'SALES' | 'PRODUCTION') {
  if (board === 'SALES') {
    const columns = ['NEW', 'QUOTED', 'APPROVED', 'COMPLETED'];
  } else {
    const columns = ['PRINTING', 'FINISHING', 'QC', 'READY'];
  }
  
  const data = {};
  for (const status of columns) {
    data[status] = await prisma.order.findMany({
      where: { status },
      orderBy: { deadline: 'asc' }
    });
  }
  
  return data;
}
```

---

## Testing Requirements

### Unit Tests

- [ ] `updateOrderStatus()` changes order status in database
- [ ] Urgent job logic correctly identifies jobs ≤ 3 days
- [ ] Card component renders customer name, size, deadline

### Integration Tests

- [ ] Dragging card to new column updates database
- [ ] Kanban board fetches orders grouped by status
- [ ] Optimistic UI updates revert if database update fails

### E2E Tests (Playwright)

- [ ] Can drag card from "New" to "Quoted"
- [ ] Card displays red "URGENT" badge when deadline ≤ 3 days
- [ ] Both Sales and Production boards render correctly
- [ ] Clicking card shows full order details (Phase 2)

---

## Dependencies

### Feature Dependencies

- **Order Database Schema**: Must have `Order` model with `status` field
- **Customer Data**: Order must have `customerName` field

### Technical Dependencies

- **@dnd-kit/core**: Drag-and-drop library
- **date-fns**: For deadline calculations
- **Prisma Client**: For database queries

---

## Deferred to Phase 2 (Advanced Features)

### WIP Limits

- Limit max cards per column (e.g., Printing ≤ 2 งานต่อเครื่อง)
- Show warning when trying to exceed limit

### Automation Rules

- Auto-reserve materials when moving to "Approved"
- Auto-create Invoice when moving to "Completed"
- Auto-send LINE notification to customer on status change

### Rework Flow

- Add "Rework" column for QC failures
- Track rework count per order

### Multi-Board Views

- Design Board (Designing → Artwork Approval)
- Logistics Board (Ready → In Transit → Installed)
- Accounting Board (Invoiced → Paid)

### Advanced Filters

- Filter by customer, material type, urgent only
- Search by order ID or customer name

---

## Full Workflow Example (เพื่อความเข้าใจ)

### งาน A: ปกติ (ไม่มีปัญหา)

```
New → Quoted → Approved → Printing → Finishing → QC → Ready → Completed
```

### งาน B: QC ไม่ผ่าน (Phase 2 - MVP ยังไม่มี Rework)

```
New → Quoted → Approved → Printing → Finishing → QC (fail)
                                                     ↓
                                                  Rework → QC (pass) → Ready
```

---

## Implementation Notes

### MVP Phase 1 Focus

- ✅ Manual drag-and-drop only
- ✅ Basic status tracking (Sales + Production boards)
- ✅ Visual cards with customer name, size, deadline
- ✅ Urgent job highlighting (red badge)

### Phase 2 Enhancements

- Auto-reserve materials on "Approved"
- WIP limits (prevent overload)
- LINE notifications
- Rework column
- Advanced filters

---

**Last Updated:** 2026-02-10  
**Related Specs:** `dashboard.md`, `FutureAcc.md`, `usecaseDef.md`

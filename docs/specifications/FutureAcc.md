# Feature: Accounting Module

**วันที่**: 2026-02-10  
**เจ้าของ**: SignageERP Team  
**สถานะ**: Draft

---

## ภาพรวม

ระบบบัญชีสำหรับธุรกิจร้านป้าย ครอบคลุมการสร้างเอกสารทางบัญชีตั้งแต่ใบเสนอราคาไปจนถึงใบเสร็จรับเงิน รวมถึงการติดตามสถานะการชำระเงิน

**MVP Scope (Phase 1):**

- Quotation (ใบเสนอราคา)
- Invoice (ใบแจ้งหนี้/ใบวางบิล)
- Receipt (ใบเสร็จรับเงิน)
- Payment Tracking (ติดตามสถานะชำระเงิน: Paid/Unpaid)

**Deferred to Phase 2:**

- e-Tax Invoice (ใบกำกับภาษีอิเล็กทรอนิกส์)
- Online Payment Gateway
- Auto-accounting (Dr/Cr)
- Partial Payments
- Financial Reports

---

## Business Value

- **Professional Documents**: สร้างเอกสารทางบัญชีที่ถูกต้องตามกฎหมาย ดูมืออาชีพ
- **Time Saving**: ลดเวลาการทำเอกสารจากหลายชั่วโมงเหลือไม่กี่นาที
- **Cash Flow Tracking**: ติดตามสถานะเก็บเงินได้ทันที รู้ว่ายังไม่จ่ายใครบ้าง
- **Audit Trail**: บันทึกประวัติเอกสารทั้งหมด ตรวจสอบย้อนหลังได้

---

## User Stories

### US-1: Create Quotation

**As a** sales representative  
**I want to** generate a professional quotation with pricing  
**So that** I can send it to customers quickly

### US-2: Generate Invoice

**As an** accounting staff  
**I want to** create an invoice from approved quotation  
**So that** I can bill the customer after job completion

### US-3: Record Payment

**As an** accounting staff  
**I want to** mark invoice as "Paid" when customer pays  
**So that** I can track which customers still owe money

### US-4: Generate Receipt

**As an** accounting staff  
**I want to** generate a receipt after receiving payment  
**So that** I can provide proof of payment to customer

### US-5: PDF Export

**As a** staff member  
**I want to** export documents as PDF  
**So that** I can send them to customers via email or print them

---

## Acceptance Criteria

### AC-1: Quotation Generation

- [ ] สร้างใบเสนอราคาจาก Order data
- [ ] ใช้ Pricing Engine คำนวณราคา (Material + Size + Tier)
- [ ] แสดงรายการงาน (Job items) พร้อมราคาต่อหน่วย
- [ ] รวมราคาสุทธิ (Grand Total)
- [ ] Export เป็น PDF

### AC-2: Invoice Generation

- [ ] สร้างใบแจ้งหนี้จาก Approved Order
- [ ] Copy ข้อมูลจาก Quotation (ถ้ามี)
- [ ] แสดงข้อมูลลูกค้า, รายการงาน, ราคา
- [ ] สถานะ: Unpaid (default), Paid
- [ ] Export เป็น PDF

### AC-3: Receipt Generation

- [ ] สร้างใบเสร็จจาก Paid Invoice
- [ ] แสดงวันที่ชำระเงิน (paidAt)
- [ ] แสดงจำนวนเงินที่ชำระ
- [ ] Export เป็น PDF

### AC-4: Payment Tracking

- [ ] แสดงสถานะ Paid/Unpaid บน Invoice list
- [ ] บันทึกวันที่ชำระเงิน (paidAt timestamp)
- [ ] กรอง Invoice ที่ยังไม่จ่ายได้

### AC-5: MVP Limitations (Phase 1)

- [ ] **NO** e-Tax Invoice (ภาษีอิเล็กทรอนิกส์)
- [ ] **NO** Online payment gateway integration
- [ ] **NO** Auto Dr/Cr accounting entries
- [ ] **NO** Partial payment tracking (จ่ายเต็มจำนวนเท่านั้น)

---

## Business Logic

### Quotation → Invoice Flow

```
1. Order status = "Approved"
2. Create Quotation (optional, for customer review)
3. If customer accepts → Create Invoice
4. When payment received → Mark Invoice as "Paid"
5. Generate Receipt
```

### Pricing Calculation (Using Pricing Engine)

```typescript
totalPrice = (width * height * material.sellingPrice) * (1 + material.wasteFactor)
if (customer.tier === "VIP") {
  totalPrice = totalPrice * 0.9 // 10% discount
}
```

### Payment Status

```
Unpaid = Invoice.paidAt === null
Paid = Invoice.paidAt !== null
```

---

## Technical Requirements

### Frontend

- **Framework**: Next.js 15 (App Router)
- **PDF Generation**: `react-pdf` or `jsPDF` library
- **Forms**: React Hook Form + Zod validation
- **UI**: HeroUI v3 components

### Backend

- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **API**: Server Actions for CRUD operations

### Database Schema (Prisma)

```prisma
model Quotation {
  id          String   @id @default(cuid())
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id])
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  items       QuotationItem[]
  totalAmount Float
  status      QuotationStatus // DRAFT, SENT, ACCEPTED, REJECTED
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Invoice {
  id          String   @id @default(cuid())
  orderId     String   @unique
  order       Order    @relation(fields: [orderId], references: [id])
  customerId  String
  customer    Customer @relation(fields: [customerId], references: [id])
  totalAmount Float
  paidAt      DateTime? // null = Unpaid, not-null = Paid
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model Payment {
  id        String   @id @default(cuid())
  invoiceId String   @unique
  invoice   Invoice  @relation(fields: [invoiceId], references: [id])
  amount    Float
  paidAt    DateTime
  method    PaymentMethod // CASH, TRANSFER, CHEQUE
  createdAt DateTime @default(now())
}

enum QuotationStatus {
  DRAFT
  SENT
  ACCEPTED
  REJECTED
}

enum PaymentMethod {
  CASH
  TRANSFER
  CHEQUE
}
```

---

## UI/UX Requirements

### Quotation Form

```
┌─────────────────────────────────┐
│  สร้างใบเสนอราคา                │
├─────────────────────────────────┤
│  ลูกค้า: [ร้านอาหาร ABC ▼]     │
│  งาน: [ป้ายไฟ LED]              │
│                                 │
│  รายการ:                        │
│  ┌─────────────────────────────┐│
│  │ วัสดุ: Acrylic 3mm ▼       ││
│  │ ขนาด: 150 × 200 cm         ││
│  │ ราคา: ฿ 4,500              ││
│  └─────────────────────────────┘│
│  [+ เพิ่มรายการ]                │
│                                 │
│  รวมทั้งสิ้น: ฿ 4,500           │
│  [บันทึก] [Export PDF]          │
└─────────────────────────────────┘
```

### Invoice List

```
┌─────────────────────────────────────────────────┐
│  ใบแจ้งหนี้ทั้งหมด           [+ สร้างใหม่]     │
├─────────┬────────────┬──────────┬─────────────┤
│ เลขที่  │ ลูกค้า     │ จำนวนเงิน │ สถานะ       │
├─────────┼────────────┼──────────┼─────────────┤
│ INV-001 │ ร้าน ABC   │ ฿ 4,500  │ ✅ Paid     │
│ INV-002 │ บริษัท XYZ │ ฿ 12,000 │ ⚠️ Unpaid  │
│ INV-003 │ คุณสมชาย   │ ฿ 2,300  │ ⚠️ Unpaid  │
└─────────┴────────────┴──────────┴─────────────┘
```

### PDF Document Template (Quotation/Invoice/Receipt)

```
┌────────────────────────────────────────┐
│   [โลโก้ร้าน]   ร้านป้าย ABC           │
│   123 ถ.พระราม 4 กรุงเทพฯ             │
│                                        │
│   ใบเสนอราคา / QUOTATION               │
│   เลขที่: QT-2026-001                  │
│   วันที่: 10 ก.พ. 2026                 │
│                                        │
│   ถึงลูกค้า: ร้านอาหาร ABC             │
│            456 ถ.สุขุมวิท              │
│                                        │
│   ┌──────────────────────────────────┐ │
│   │ รายการ      │ ขนาด    │ ราคา    │ │
│   ├──────────────────────────────────┤ │
│   │ ป้ายอะคริลิก│150×200cm│฿ 4,500  │ │
│   └──────────────────────────────────┘ │
│                                        │
│   รวมทั้งสิ้น: ฿ 4,500 (สี่พันห้าร้อยบาทถ้วน)│
│                                        │
│   ผู้อนุมัติ: ________________         │
└────────────────────────────────────────┘
```

---

## API Requirements

### Server Actions

#### 1. `createQuotation(data: QuotationInput)`

```typescript
'use server'

export async function createQuotation(data: QuotationInput) {
  // 1. Calculate total using Pricing Engine
  const total = await calculateQuotationTotal(data.items);
  
  // 2. Create quotation in database
  const quotation = await prisma.quotation.create({
    data: {
      orderId: data.orderId,
      customerId: data.customerId,
      items: { create: data.items },
      totalAmount: total,
      status: 'DRAFT'
    }
  });
  
  return quotation;
}
```

#### 2. `createInvoice(orderId: string)`

```typescript
'use server'

export async function createInvoice(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { quotation: true }
  });
  
  const invoice = await prisma.invoice.create({
    data: {
      orderId: order.id,
      customerId: order.customerId,
      totalAmount: order.quotation.totalAmount,
      paidAt: null // Unpaid by default
    }
  });
  
  return invoice;
}
```

#### 3. `markInvoiceAsPaid(invoiceId: string, paymentMethod: PaymentMethod)`

```typescript
'use server'

export async function markInvoiceAsPaid(
  invoiceId: string, 
  paymentMethod: PaymentMethod
) {
  const now = new Date();
  
  // Update invoice
  const invoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { paidAt: now }
  });
  
  // Create payment record
  await prisma.payment.create({
    data: {
      invoiceId: invoice.id,
      amount: invoice.totalAmount,
      paidAt: now,
      method: paymentMethod
    }
  });
  
  return invoice;
}
```

#### 4. `generatePDF(documentType: 'quotation' | 'invoice' | 'receipt', id: string)`

```typescript
'use server'

export async function generatePDF(
  documentType: 'quotation' | 'invoice' | 'receipt',
  id: string
) {
  const data = await fetchDocumentData(documentType, id);
  const pdfBuffer = await renderPDFTemplate(documentType, data);
  
  return {
    filename: `${documentType}-${id}.pdf`,
    buffer: pdfBuffer
  };
}
```

---

## Testing Requirements

### Unit Tests

- [ ] Quotation total calculation is correct (with Pricing Engine)
- [ ] Invoice creation copies data from Quotation
- [ ] Payment recording updates Invoice.paidAt correctly
- [ ] PDF generation returns valid PDF buffer

### Integration Tests

- [ ] Creating Quotation saves to database
- [ ] Marking Invoice as Paid creates Payment record
- [ ] Unpaid Invoices list shows correct count

### E2E Tests (Playwright)

- [ ] Can create Quotation from Order
- [ ] Can mark Invoice as Paid
- [ ] Can download PDF for Invoice
- [ ] Unpaid filter shows only unpaid invoices

---

## Dependencies

### Feature Dependencies

- **Pricing Engine**: Required for Quotation price calculation
- **Order Management**: Quotation/Invoice linked to Order
- **Customer Data**: Need customer info for documents

### Technical Dependencies

- **PDF Library**: `react-pdf` or `jsPDF` for document generation
- **Pricing Engine**: Use existing Material + PricingTier models
- **Prisma Client**: For database operations

---

## Deferred to Phase 2

### e-Tax Invoice (ใบกำกับภาษีอิเล็กทรอนิกส์)

- Integration with RD (Revenue Department) API
- XML format generation
- Digital signature
- Submit to e-Tax portal

### Online Payment Gateway

- Integration with payment providers (2C2P, Omise, PromptPay)
- QR Code payment
- Payment confirmation webhook

### Auto-Accounting (Dr/Cr)

- Double-entry bookkeeping
- Chart of Accounts
- Journal entries
- General Ledger

### Partial Payments

- Track multiple payments per invoice
- Outstanding balance calculation
- Payment installment plans

### Financial Reports

- Profit & Loss statement
- Balance Sheet
- Cash Flow statement
- Aging Report (receivables)

---

## Implementation Notes

### MVP Phase 1 Priority

1. ✅ Quotation creation with Pricing Engine
2. ✅ Invoice generation from Order
3. ✅ Payment status tracking (Paid/Unpaid)
4. ✅ Receipt generation
5. ✅ PDF export for all documents

### Phase 2 Enhancements

- e-Tax invoice integration
- Online payment gateway
- Advanced accounting features
- Financial reports

---

**Last Updated:** 2026-02-10  
**Related Specs:** `dashboard.md`, `TaskKanbanbord.md`, `pricing-calculation-rules.md` (future)

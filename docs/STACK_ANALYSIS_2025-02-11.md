# ⚡ Technology Stack Analysis — SignageERP

> **วันที่:** 11 กุมภาพันธ์ 2568  
> **สถานะ:** วิเคราะห์เท่านั้น — ยังไม่แก้ไข  
> **อ้างอิง:** [System Audit](file:///d:/PrintFlowERP/docs/SYSTEM_AUDIT_2025-02-11.md) | [Requirements](file:///d:/PrintFlowERP/REQUIREMENTS.md)

---

## 📊 1. Current Stack Overview

| Layer | Technology | Version |
|---|---|---|
| **Frontend** | Next.js (App Router) | 15.1.7 |
| **UI Framework** | React | 19.0.0 |
| **UI Components** | HeroUI | v2.8.8 |
| **Styling** | Tailwind CSS | v4 |
| **i18n** | next-intl | v3.26.3 |
| **Backend API** | NestJS | v11 |
| **ORM** | Prisma | 5.22 |
| **Database** | PostgreSQL (Supabase) | — |
| **Monorepo** | Turborepo | v1.11 |
| **Testing** | Jest + Playwright | 29/30 + 1.58 |
| **Language** | TypeScript | ~5.3-5.7 |

---

## 🎯 2. ตรงกับ Requirements มั้ย?

### ✅ สิ่งที่ Stack ตอบโจทย์ได้ดี

| Requirement | Stack ที่รองรับ | ระดับ |
|---|---|---|
| **Dashboard + Charts** | Next.js SSR + React 19 | ⭐⭐⭐⭐⭐ |
| **CRUD (Stock, Orders, Customers)** | Prisma + Server Actions | ⭐⭐⭐⭐⭐ |
| **Kanban (Drag & Drop)** | @dnd-kit + React | ⭐⭐⭐⭐⭐ |
| **i18n (TH/EN/MM)** | next-intl | ⭐⭐⭐⭐⭐ |
| **Mobile Responsive** | Tailwind + HeroUI | ⭐⭐⭐⭐ |
| **Database + ORM** | Prisma + Supabase PG | ⭐⭐⭐⭐⭐ |
| **PDF Generation** | Next.js API routes หรือ NestJS | ⭐⭐⭐⭐ |
| **Pricing Engine** | TypeScript (shared types) | ⭐⭐⭐⭐ |
| **Type Safety** | TypeScript + Prisma types | ⭐⭐⭐⭐ |

### ⚠️ สิ่งที่ Stack รองรับได้แต่ต้องระวัง

| Requirement | ปัญหา |
|---|---|
| **Multi-tenant (Phase 3)** | Supabase Row-Level Security ดี แต่ต้อง plan schema ตั้งแต่ตอนนี้ |
| **File Storage (Design Files)** | Supabase Storage รองรับ แต่ยังไม่ได้ setup |
| **Real-time (Kanban updates)** | Supabase Realtime ได้ แต่ complexity สูง |
| **Auth** | ❌ **ยังไม่มีเลย** — ต้องเพิ่ม Supabase Auth หรือ NextAuth |

---

## 🔴 3. ปัญหาหลักของ Stack ปัจจุบัน

### 3.1 ❓ ทำไมต้องมี NestJS?

> [!CAUTION]
> นี่คือ **ปัญหาสถาปัตยกรรมใหญ่ที่สุด** ของ Stack ปัจจุบัน

**สถานการณ์ปัจจุบัน:**

```
apps/web (Next.js 15)  ← มี Server Actions อยู่แล้ว
apps/api (NestJS 11)   ← ทำอะไร? มีแค่ Pricing + DesignFile
```

**Next.js 15 + React 19 Server Actions ทำได้เกือบทุกอย่างที่ NestJS ทำ:**

| Feature | Next.js Server Actions | NestJS |
|---|---|---|
| CRUD Database | ✅ ผ่าน Prisma | ✅ ผ่าน Prisma |
| Auth Middleware | ✅ next-auth / Supabase Auth | ✅ Guards |
| Validation | ✅ Zod | ✅ class-validator |
| File Upload | ✅ Route Handlers | ✅ Multer |
| PDF Generation | ✅ Route Handlers | ✅ Services |
| CORS | ❌ ไม่จำเป็น (same-origin) | ✅ ต้อง config |
| Type Safety | ✅ Server/Client shared types | ⚠️ ต้อง share types แยก |

**เมื่อไหร่ถึง "จำเป็น" ต้องใช้ NestJS?**

- ✅ **External API** สำหรับ mobile app, third-party integrations
- ✅ **Microservices** ที่ต้อง scale แยก
- ✅ **Background jobs** ที่ซับซ้อน (queue, cron)
- ✅ **WebSocket server** แยกจาก Next.js

**สำหรับ MVP (Single-tenant, Web only):** NestJS **ไม่จำเป็น** — เพิ่มความซับซ้อน (2 servers, CORS, type sync) โดยไม่ได้ประโยชน์

---

### 3.2 HeroUI — เหมาะหรือไม่?

| ข้อดี | ข้อเสีย |
|---|---|
| สวย, ใช้ง่าย | ยังเป็น Beta (v2 → v3 migration) |
| Built on React Aria (accessible) | Community เล็กกว่า shadcn/ui |
| Built-in dark mode | Custom theme ยากกว่า shadcn |
| — | ERP ต้องการ complex tables/forms ที่ HeroUI ยังไม่แข็ง |

**สำหรับ ERP:** shadcn/ui + Tailwind จะยืดหยุ่นกว่ามาก เพราะ:

- ERP ต้องการ **DataTable ที่ซับซ้อน** (sort, filter, pagination, inline edit)
- ERP ต้องการ **Form ที่ซับซ้อน** (multi-step, validation, conditional fields)
- shadcn/ui เป็น copy-paste ที่ customize ได้ 100%

> **แต่:** ถ้าใช้ HeroUI อยู่แล้วและ UI ทำงานได้ดี → **ไม่ต้องเปลี่ยน** สำหรับ MVP

---

### 3.3 Tailwind CSS v4 — ยังเร็วเกินไป?

**ปัญหาปัจจุบัน:**

- Config เป็น v3 format แต่ runtime เป็น v4
- HeroUI อาจยังไม่ support v4 เต็มที่
- Documentation และ community support ยัง thin

**ถ้าใช้ v4 แล้ว work** → ไม่ต้อง downgrade  
**ถ้า UI มีปัญหา** → พิจารณากลับไป v3

---

### 3.4 Turborepo v1 — ควร upgrade?

- `pipeline` key ถูก deprecated ตั้งแต่ Turbo v2
- v2 มี performance ดีกว่า + ใช้ `tasks` key
- **แก้ง่าย:** เปลี่ยน `"pipeline"` → `"tasks"` + upgrade version

---

## 📐 4. Stack Recommendations

### 🏆 Option A: Simplified Stack (แนะนำสำหรับ MVP)

```
ลบ NestJS ออก → ใช้ Next.js Server Actions + Route Handlers ทั้งหมด
```

| Layer | Technology |
|---|---|
| **Full-stack** | Next.js 15 (App Router) |
| **UI** | HeroUI (เดิม) หรือ migrate เป็น shadcn/ui ทิหลัง |
| **Database** | Prisma + Supabase PostgreSQL |
| **Auth** | Supabase Auth (เพิ่มใหม่) |
| **File Storage** | Supabase Storage |
| **Monorepo** | Turborepo v2 |
| **Types** | Prisma generated types (ลบ packages/types ที่ manual) |

**ข้อดี:**

- 1 server แทน 2 → deploy ง่ายกว่า
- ไม่ต้อง CORS
- Type safety end-to-end (Server Action → Client)
- ลด boilerplate 40-50%

**ข้อเสีย:**

- ถ้าจะทำ Mobile App ในอนาคต → ต้องเพิ่ม API layer ทีหลัง

---

### 🔄 Option B: Keep Both (ถ้ามั่นใจว่าต้อง External API)

```
เก็บ NestJS แต่ "fix" ให้ถูก
```

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15 (Server Actions สำหรับ internal use) |
| **API** | NestJS 11 (เฉพาะ external API / background jobs) |
| **Database** | Prisma + Supabase PostgreSQL (shared ผ่าน packages/database) |
| **Auth** | Supabase Auth (shared) |

**ข้อดี:**

- Mobile-ready (API แยก)
- Separation of concerns ชัด

**ข้อเสีย:**

- Complexity สูง (2 servers, CORS, type sync)
- Over-engineering สำหรับ MVP

---

## 📊 5. Decision Matrix

| เกณฑ์ | Option A (Next.js only) | Option B (Next.js + NestJS) |
|---|---|---|
| **ความเร็วพัฒนา** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **ความซับซ้อน** | ต่ำ | สูง |
| **Deploy** | 1 service (Vercel/Supabase) | 2 services |
| **MVP readiness** | 4 สัปดาห์ | 6-8 สัปดาห์ |
| **Mobile support** | ❌ (ต้องเพิ่มทีหลัง) | ✅ API ready |
| **Multi-tenant** | ✅ (Supabase RLS) | ✅ |
| **Scalability** | กลาง | สูง |
| **Cost (hosting)** | ต่ำ (Vercel free tier) | สูงกว่า (2 servers) |

---

## 🎯 6. สรุปคำแนะนำ

> [!IMPORTANT]
> **สำหรับ MVP Single-Tenant ร้านเดียว → Option A (ลบ NestJS)**  
> **สำหรับ Multi-Tenant SaaS ตั้งแต่ต้น → Option B (เก็บ NestJS)**

**สิ่งที่ต้องตัดสินใจก่อน:**

1. MVP นี้ "ร้านเดียว" หรือ "หลายร้าน" ตั้งแต่ launch?
2. จะมี Mobile App ใน 6 เดือนข้างหน้ามั้ย?
3. คนพัฒนากี่คน? (Solo dev → Option A ชัดเจน)

---

> **📌 เอกสารนี้เป็นการวิเคราะห์เท่านั้น — ไม่ได้แก้ไขโค้ดใดๆ**

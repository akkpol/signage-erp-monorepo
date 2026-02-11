---
description: Checklist หลังแก้โค้ด - ทำทุกครั้งเพื่อไม่พลาด
---

# ✅ Checklist หลังแก้โค้ดทุกครั้ง

**วัตถุประสงค์:** ป้องกันไม่ให้ลืมทำสิ่งสำคัญหลังแก้โค้ด

---

## 🔄 ขั้นตอนที่ต้องทำทุกครั้ง

### 1️⃣ เพิ่มข้อความใหม่ → อัพเดต i18n (3 ภาษา)

**เมื่อไร:** เพิ่ม UI component, หน้าจอใหม่, ข้อความแจ้งเตือน

// turbo
**ทำอะไร:**

```bash
# เช็คว่ามี hardcoded text ไหม
cd apps/web
grep -r "\".*ภาษาไทย.*\"" app/ --include="*.tsx"

# แก้ไขไฟล์ภาษา 3 ไฟล์
code messages/th.json  # ภาษาไทย (หลัก)
code messages/en.json  # อังกฤษ
code messages/mm.json  # พม่า
```

**ตัวอย่าง:**

```json
// messages/th.json
{
  "NewFeature": {
    "title": "ฟีเจอร์ใหม่",
    "button": "บันทึก"
  }
}
```

---

### 2️⃣ แก้ Database Schema → Run Migration

**เมื่อไร:** เพิ่ม/ลบ/แก้ไข Prisma schema

// turbo
**ทำอะไร:**

```bash
# Generate migration
cd apps/api
npx prisma migrate dev --name "describe_what_changed"

# Generate Prisma Client
npx prisma generate

# Restart dev server
# (กด Ctrl+C ใน terminal แล้ว npm run dev ใหม่)
```

---

### 3️⃣ แก้ Server Actions → Test API

**เมื่อไร:** แก้ไขไฟล์ใน `apps/web/actions/`

**ทำอะไร:**

1. เช็คว่า return type ถูกต้อง
2. ทดสอบใน browser (เปิด DevTools)
3. ดู console มี error ไหม

```typescript
// ✅ ดี - มี error handling
export async function getOrders() {
  try {
    const orders = await prisma.order.findMany()
    return { data: orders, error: null }
  } catch (error) {
    return { data: null, error: 'Failed to fetch orders' }
  }
}
```

---

### 4️⃣ แก้ UI Components → ทดสอบ Responsive

**เมื่อไร:** เพิ่ม/แก้ไข component ใน `apps/web/components/`

**ทำอะไร:**

1. เปิด browser (<http://localhost:3001>)
2. กด F12 → Toggle device toolbar (Ctrl+Shift+M)
3. ทดสอบ:
   - 📱 Mobile (375px)
   - 📱 Tablet (768px)
   - 💻 Desktop (1920px)

---

### 5️⃣ เพิ่มฟีเจอร์ใหม่ → เพิ่ม E2E Test

**เมื่อไร:** เพิ่มหน้าใหม่หรือ user flow สำคัญ

**ทำอะไร:**

```bash
cd apps/web

# สร้างไฟล์ test ใหม่
code tests/[feature-name].spec.ts
```

**Template:**

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('http://localhost:3001/th/feature')
    await expect(page.locator('text=Expected Text')).toBeVisible()
  })
})
```

// turbo
**Run test:**

```bash
npm run test:e2e tests/[feature-name].spec.ts
```

---

### 6️⃣ ก่อน Commit → Final Checklist

**ทำอะไร:**

// turbo

```bash
# 1. Type check
npm run type-check

# 2. Lint check
npm run lint

# 3. ทดสอบ build ได้ไหม (optional)
npm run build
```

**Git commit:**

```bash
git add .
git commit -m "feat: Add [feature name] with i18n support"
git push
```

---

## 🚨 อย่าลืม! (Critical)

### ❌ สิ่งที่ต้องไม่ทำ

- ❌ Hardcode ข้อความภาษาไทยใน component (ใช้ `useTranslations()` เสมอ)
- ❌ Skip migration หลังแก้ schema (database จะไม่ sync)
- ❌ ไม่ test responsive (ลูกค้าใช้มือถือ!)
- ❌ Commit โดยไม่เช็ค lint errors

### ✅ Best Practices

- ✅ แก้ไฟล์ภาษาทั้ง 3 ภาษาพร้อมกัน
- ✅ Restart dev server หลัง generate Prisma Client
- ✅ ทดสอบใน browser ก่อน commit
- ✅ เขียน commit message ให้ชัดเจน

---

## 📝 Quick Reference

| งานที่ทำ | ไฟล์ที่แก้ | คำสั่งที่ต้อง run |
|---------|-----------|------------------|
| เพิ่ม UI text | `messages/*.json` | - |
| แก้ schema | `prisma/schema.prisma` | `prisma migrate dev` → `prisma generate` |
| แก้ server action | `actions/*.ts` | - |
| เพิ่มหน้าใหม่ | `app/[locale]/*/page.tsx` | อัพเดต i18n + เพิ่ม test |

---

## 🔧 Automation Tips

**สร้าง script ช่วยเตือน:**

```bash
# package.json
{
  "scripts": {
    "pre-commit": "npm run type-check && npm run lint",
    "post-schema": "npx prisma generate && echo '✅ Don't forget to restart dev server!'"
  }
}
```

**ใช้ Git hooks:**

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run type-check || exit 1
```

---

**สรุป:** ทุกครั้งที่แก้โค้ด ให้เช็ค checklist นี้ → ไม่พลาด ไม่ต้องย้อนกลับมาแก้!

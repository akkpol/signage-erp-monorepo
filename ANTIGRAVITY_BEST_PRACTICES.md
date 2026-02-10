# 🚀 Google Antigravity IDE - Best Practices สำหรับ SignageERP

คู่มือการใช้ Antigravity IDE อย่างมีประสิทธิภาพสูงสุดสำหรับโปรเจกต์ SignageERP

---

## 📋 Table of Contents
1. [Workflow Management](#workflow-management)
2. [Context & Artifacts](#context--artifacts)
3. [Code Navigation](#code-navigation)
4. [Collaboration with AI](#collaboration-with-ai)
5. [Performance Tips](#performance-tips)

---

## 1. Workflow Management

### ✅ ใช้ Workflows (Skills) สำหรับงานซ้ำๆ

**เรามีสร้าง Workflows ไว้แล้ว:**
- `/dev` - Start development servers
- `/prisma` - Database migrations workflow
- `/crud-api` - Generate CRUD endpoints
- `/git` - Git commit conventions
- `/testing` - Testing standards (สำคัญสำหรับ financial code!)

**วิธีใช้:**
```
พิมพ์: /dev      → Start all dev servers
พิมพ์: /prisma   → Database workflow guide
พิมพ์: /crud-api → CRUD pattern template
พิมพ์: /git      → Git commit best practices
พิมพ์: /testing  → Testing requirements
```

### 🎯 สร้าง Workflow ใหม่เมื่อ:
- ทำงานซ้ำ 3 ครั้งขึ้นไป
- มีขั้นตอนมากกว่า 3 steps
- ต้องการ document ไว้ให้ทีม

**ตัวอย่าง:**
```markdown
---
description: Deploy to Vercel
---
// turbo
1. Build production: `npm run build`
2. Deploy: `vercel deploy --prod`
```

---

## 2. Context & Artifacts

### 📝 Artifacts ที่สำคัญ (อยู่ใน `.gemini/antigravity/brain/<conversation-id>/`)

| Artifact | วัตถุประสงค์ | อัพเดทเมื่อไหร่ |
|----------|-------------|----------------|
| **task.md** | Track progress | ทุกครั้งที่เสร็จงาน |
| **implementation_plan.md** | Design decisions | ก่อนเริ่ม feature ใหม่ |
| **walkthrough.md** | Documentation | หลังเสร็จ milestone |

### ✅ Best Practices:

**DO:**
- ✅ Ask AI to update `task.md` หลังเสร็จแต่ละ task
- ✅ Reference ไฟล์ที่สำคัญใน conversation (`file:///d:/PrintFlowERP/...`)
- ✅ ใช้ backticks ครอบชื่อไฟล์ เช่น `pricing.service.ts`

**DON'T:**
- ❌ ไม่ลบ artifacts เก่า (AI จะอ้างอิงย้อนหลัง)
- ❌ ไม่ทำหลาย task พร้อมกันใน 1 conversation

---

## 3. Code Navigation

### 🔍 การค้นหาและอ่านโค้ด

**เมื่อต้องการทำความเข้าใจโค้ด:**
```
✅ "Show me the pricing service implementation"
✅ "Explain how the Material model works"
✅ "What endpoints exist in the API?"
```

**เมื่อต้องการแก้โค้ด:**
```
✅ "Add validation to pricing input"
✅ "Create CRUD API for Materials"  
✅ "Fix the module resolution error in api/src/pricing"
```

### 📂 โครงสร้างไฟล์ที่ AI เข้าใจดี:

```
SignageERP/
├── apps/
│   ├── web/          → "frontend", "Next.js + HeroUI"
│   └── api/          → "backend", "NestJS + Prisma"
├── packages/
│   └── types/        → "shared types", "domain models"
└── .agent/
    └── workflows/    → "workflows", "skills"
```

**ใช้คำที่ชัดเจน:**
- ✅ "Update pricing service in backend"
- ❌ "แก้ pricing" (คลุมเครือ)

---

## 4. Collaboration with AI

### 💬 การสื่อสารที่ได้ผลดี

#### ✅ **Be Specific**
```
❌ "ทำ CRUD API"
✅ "Create CRUD API for Materials with endpoints: GET, POST, PUT, DELETE"
```

#### ✅ **Confirm Architecture Decisions**
```
คุณ: "Should we use SQLite or PostgreSQL for development?"
AI: "SQLite for local dev, PostgreSQL for production"
คุณ: "Use SQLite"  ← Confirm!
```

#### ✅ **Ask for Verification**
```
"Show me the current API endpoints"
"List all pending tasks in task.md"
"What files have been changed?"
```

### 🎯 รูปแบบคำถามที่ดี:

| สถานการณ์ | คำถามที่ดี |
|----------|----------|
| ไม่เข้าใจ error | "Explain this error and how to fix it: <paste error>" |
| ต้องการ feature ใหม่ | "I need a Quote entry form with fields: customer, items, total" |
| ปรับปรุงโค้ด | "Optimize the pricing calculator performance" |
| Review changes | "Show me what changed in the pricing service" |

---

## 5. Performance Tips

### ⚡ การใช้งานที่ประหยัด RAM (สำหรับเครื่องที่แรมน้อย)

#### ✅ **DO: แนะนำสำหรับแรมน้อย**
- ✅ **ใช้ Cloud Database** (Neon.tech / Supabase) - **ไม่กินแรมเครื่องเลย!** ⭐
- ✅ ปิด VS Code terminal/output panels ที่ไม่ใช้
- ✅ Run แค่ service ที่ต้องใช้:
  ```bash
  # แทนที่จะ run ทั้งหมด
  cd apps/web && npm run dev  # แค่ frontend (ถ้า API ยังไม่พร้อม)
  # หรือ
  cd apps/api && npm run dev  # แค่ backend
  ```
- ✅ ใช้ browser แบบประหยัดแรม (ปิด extensions ที่ไม่จำเป็น)
- ✅ Close unused applications

#### ❌ **DON'T: หลีกเลี่ยงถ้าแรมน้อย**
- ❌ **Run Docker PostgreSQL** (กินแรม ~200-500MB)
- ❌ Run multiple dev servers พร้อมกัน (ถ้าไม่จำเป็น)
- ❌ เปิด browser tabs เยอะๆ ระหว่าง dev
- ❌ Run production build ขณะ dev
- ❌ เปิด Prisma Studio ค้างไว้ตลอด

### 🛠️ Memory Optimization Checklist:

- [ ] ใช้ **Cloud Database** (Neon/Supabase) แทน local PostgreSQL ⭐ แนะนำ!
- [ ] เปิดเฉพาะ **dev server ที่ใช้**
- [ ] Close browser DevTools เมื่อไม่ใช้
- [ ] Close unused VS Code extensions
- [ ] Restart IDE ทุกๆ 2-3 ชั่วโมง
- [ ] Kill orphan Node processes: `taskkill /F /IM node.exe`
- [ ] Monitor RAM usage: Task Manager → Performance tab

---

## 🎓 Quick Reference

### คำสั่งที่ใช้บ่อย

```bash
# Start dev
npm run dev                    # All services
cd apps/api && npm run dev     # Backend only
cd apps/web && npm run dev     # Frontend only

# Database
cd apps/ap prisma migrate dev         # Create migration
npx prisma studio              # View database
npx prisma generate            # Generate client

# Type checking
npm run type-check             # Check all
cd packages/types && npm run build  # Build types

# Git
git status                     # Check changes
git add . && git commit -m ""  # Commit
git push                       # Push to GitHub
```

### Slash Commands (Workflows)

```
/dev       - Start development servers (web + api)
/prisma    - Database migrations workflow
/crud-api  - CRUD endpoint pattern
/git       - Git commit conventions
/testing   - Testing standards (financial code)
```
**Remember:** Git is your safety net. Commit often, push regularly! 🚀

---

## 💰 **CRITICAL: Financial Code Requirements**

### 🎯 This System Handles MONEY - Zero Tolerance for Bugs

**Special rules for pricing/financial calculations:**

1. ✅ **Small Modules (< 30 lines per function)**
   - Each calculation = separate function
   - Example: `calculateMaterialCost()`, `calculateLaborCost()`, `calculateDiscount()`
   - Easy to test, easy to understand, easy to fix

2. ✅ **100% Test Coverage for Financial Logic**
   - Every calculation function MUST have unit tests
   - Test edge cases: 0, negative, very large numbers
   - See `/testing` workflow for examples

3. ✅ **Clear Documentation**
   ```typescript
   /**
    * Calculate discount amount
    * @param subtotal - Amount before discount
    * @param percent - Discount percentage (0-100)
    * @returns Discount amount rounded to 2 decimals
    * @example calculateDiscount(1000, 10) // Returns 100.00
    */
   ```

4. ✅ **Commit After EACH Calculation Function**
   ```bash
   # ✅ Write function + test → Commit immediately
   git commit -m "feat(pricing): add calculateDiscount with tests"
   
   # ❌ DON'T write 5 functions then commit once
   ```

5. ✅ **Financial Accuracy Rules**
   - Round to 2 decimals: `Math.round(value * 100) / 100`
   - Round at the END, not during intermediate steps
   - Use constants for rates: `const VAT_RATE = 0.07`

### 📋 Quick Checklist Before Committing Financial Code:

- [ ] Function < 30 lines?
- [ ] Has unit tests?
- [ ] Has JSDoc with @example?
- [ ] Handles edge cases (0, negative)?
- [ ] Rounds to 2 decimals?
- [ ] Clear variable names?
- [ ] Tested manually?

**See:** [/testing](file:///d:/PrintFlowERP/.agent/workflows/testing.md) workflow for complete standards

---

## ⏰ **Commit Reminder System**

### 🔔 I Will Remind You To Commit When:

1. ✅ 30 minutes passed without commit
2. ✅ New financial calculation added
3. ✅ Changed > 50 lines of code
4. ✅ Before starting new feature

**Example Reminder:**
```
🔔 COMMIT REMINDER!
Time: 30 min | Files: 3 | Lines: ~80

Suggested:
git add apps/api/src/pricing/
git commit -m "feat(pricing): add discount calculation"

Reason: Critical financial logic changes
```

**See:** [COMMIT_REMINDERS.md](file:///d:/PrintFlowERP/COMMIT_REMINDERS.md) for full details

---

## 💡 Pro Tips

### 1. **Batch Similar Tasks**
```
✅ "Create CRUD APIs for: Materials, Products, Customers"
❌ *3 separate conversations*
```

### 2. **Use Task Mode for Complex Work**
AI จะเข้า "Task Mode" เมื่อ:
- งานมีหลายขั้นตอน
- ต้อง update หลายไฟล์
- ต้องการ approval ก่อนทำจริง

### 3. **Keep Conversations Focused**
- 1 conversation = 1 feature
- New feature = New conversation
- Reference previous work: "Continue from the pricing feature we built"

### 4. **Leverage Artifacts**
```
คุณ: "Update task.md to show Material API is complete"
AI: *Updates artifact*
คุณ: "Show remaining tasks"
AI: *Reads from task.md*
```

---

## 🚨 Common Pitfalls & Solutions

| ปัญหา | สาเหตุ | วิธีแก้ |
|-------|--------|---------|
| AI ลืม context | Conversation ยาวเกินไป | Start new conversation, reference old work |
| Error ซ้ำๆ | ไม่ได้ confirm decision | Say "Yes, do it" or "Use option 1" |
| โค้ดไม่ sync | Build types ไม่ทัน | Run `npm run build` in packages/types |
| Port conflict | Service ค้างอยู่ | Kill process or change port |
| **Bug ไม่รู้ต้นเหตุ** | **Commit ไม่บ่อย** | **`git reset --hard` ย้อนกลับ** ✨ |
| **Financial calculation wrong** | **ไม่มี tests** | **Write tests first, see `/testing`** 💰 |

---

## 📚 Additional Resources

- **Project README**: `d:\PrintFlowERP\README.md`
- **Implementation Plan**: `.gemini/antigravity/brain/.../implementation_plan.md`
- **Walkthrough**: `.gemini/antigravity/brain/.../walkthrough.md`
- **Task Progress**: `.gemini/antigravity/brain/.../task.md`

---

## 🎯 Summary

1. ✅ **Commit ทุก 15-30 นาที** - ประหยัด tokens + เวลา (สำคัญที่สุด!)
2. ✅ **Financial code = Small modules + 100% tests** - เกี่ยวกับเงิน ต้องแม่น!
3. ✅ ใช้ **Workflows** (`/dev`, `/prisma`, `/crud-api`, `/git`, `/testing`)
4. ✅ อัพเดท **Artifacts** (`task.md`) บ่อยๆ
5. ✅ สื่อสาร **ชัดเจน** กับ AI
6. ✅ ใช้ **Cloud Database** (Neon/Supabase) เพื่อประหยัด RAM ⭐ NEW!
7. ✅ ใช้ **HeroUI v2.8.0** สำหรับ UI components
8. ✅ **Batch** งานที่คล้ายกัน
9. ✅ เก็บ conversation **โฟกัส** 1 feature

**เมื่อสงสัย → ถาม AI เลย! 🚀**

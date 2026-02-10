# SignageERP SaaS - ClickUp Professional Setup Guide

**Version:** 1.0  
**Purpose:** Transform Phase 1 plan into actionable ClickUp tasks

---

## 🎯 Overview

You will create:
- **4 Sprints** (1.1 to 1.4)
- **20+ Tasks** with time estimates
- **Custom Fields** for tracking
- **Views** for different perspectives

---

## 📋 Step 1: Create Workspace Structure

### In your existing "PrintFlow ERP" workspace:

```
PrintFlow ERP
├── 🚀 Active Development
│   ├── 📦 Sprint 1.1: Multi-Tenant Foundation (List)
│   ├── 📦 Sprint 1.2: Pricing Engine (List)
│   ├── 📦 Sprint 1.3: Quote & Billing (List)
│   └── 📦 Sprint 1.4: Settings & Polish (List)
│
├── 📋 Backlog (List)
│   ├── Phase 2 tasks
│   └── Phase 3 tasks
│
├── 🐛 Bugs (List)
│
└── 📚 Documentation (Folder)
    ├── Implementation Plan
    ├── Database ERD
    └── Workflows
```

### How to create:

1. Click **"+ New List"** in Development space
2. Name: `Sprint 1.1: Multi-Tenant Foundation`
3. Repeat for Sprint 1.2, 1.3, 1.4

---

## 🏷️ Step 2: Setup Custom Fields

### For ALL tasks, add these Custom Fields:

| Field Name | Type | Options | Purpose |
|------------|------|---------|---------|
| **Tech Area** | Dropdown | Backend, Frontend, Database, DevOps, Testing | Filter by technology |
| **Complexity** | Number | 1-10 | Estimate difficulty |
| **Hours Estimate** | Number | 1-20 | Time estimate |
| **Financial Impact** | Checkbox | Yes/No | Flag critical calculations |
| **Needs Testing** | Checkbox | Yes/No | Flag if tests required |
| **Git Commit** | URL | - | Link to commit after done |
| **Sprint** | Dropdown | 1.1, 1.2, 1.3, 1.4 | Which sprint |

### How to add:

1. Click **"+ Add Custom Field"** in top right
2. Fill in name and type
3. Check **"Apply to entire Workspace"** (so all tasks have same fields)

---

## 📝 Step 3: Import Tasks from Phase 1

### Sprint 1.1: Multi-Tenant Foundation (Week 1-2)

Copy-paste these into ClickUp:

---

**Task 1.1.1: Setup PostgreSQL + Prisma**

```
Assignee: [Your name]
Due Date: [Week 1 Friday]
Priority: High
Tech Area: Database
Complexity: 3
Hours Estimate: 4
Financial Impact: No
Needs Testing: Yes

Description:
Setup database and ORM for multi-tenant architecture.

Steps:
1. Install Prisma: npm install prisma @prisma/client
2. Initialize: npx prisma init
3. Configure DATABASE_URL in .env
4. Create schema.prisma with Organization model
5. Run migration: npx prisma migrate dev --name init
6. Generate client: npx prisma generate

Acceptance Criteria:
☐ Prisma connects to PostgreSQL
☐ Can create test Organization

Tags: #setup #database #phase1
```

---

**Task 1.1.2: Organization & BillingProfile Models**

```
Assignee: [Your name]
Due Date: [Week 1 Friday]
Priority: High
Tech Area: Database
Complexity: 3
Hours Estimate: 3
Financial Impact: No
Needs Testing: Yes

Description:
Create Prisma models for multi-tenancy foundation.

Models to create:
- Organization (tenant root)
- BillingProfile (multi-entity killer feature)

Acceptance Criteria:
☐ Migration runs successfully
☐ Can create Organization with 3 Billing Profiles

Dependencies:
- Blocked by: Task 1.1.1

Tags: #database #schema #phase1
```

---

**Task 1.1.3: Tenant Isolation Middleware ⚠️ CRITICAL**

```
Assignee: [Your name]
Due Date: [Week 2 Wednesday]
Priority: Urgent
Tech Area: Backend
Complexity: 8
Hours Estimate: 6
Financial Impact: No
Needs Testing: Yes (MUST HAVE)

Description:
⚠️ SECURITY CRITICAL: Prevent data leakage between organizations.

Create Prisma middleware that auto-injects organizationId filter on ALL queries.

Acceptance Criteria:
☐ Middleware auto-injects organizationId
☐ CANNOT retrieve data from different org
☐ Unit tests prove data isolation
☐ Security audit passed

Dependencies:
- Blocked by: Task 1.1.2

Tags: #security #critical #middleware #phase1
```

---

**Task 1.1.4: User Authentication (NextAuth.js)**

```
Assignee: [Your name]
Due Date: [Week 2 Friday]
Priority: High
Tech Area: Backend
Complexity: 6
Hours Estimate: 8
Financial Impact: No
Needs Testing: Yes

Description:
Implement user authentication with NextAuth.js.

Features:
- Email/Password login
- Google OAuth (optional)
- Session includes organizationId

Steps:
1. Install: npm install next-auth
2. Create /api/auth/[...nextauth]
3. Configure providers
4. Create User model with organizationId
5. Session callback includes organization data

Acceptance Criteria:
☐ Register new user works
☐ Login works
☐ Session contains user.organizationId

Tags: #auth #nextauth #phase1
```

---

**Task 1.1.5: Authorization & RBAC**

```
Assignee: [Your name]
Due Date: [Week 2 Friday]
Priority: Medium
Tech Area: Backend
Complexity: 5
Hours Estimate: 4
Financial Impact: No
Needs Testing: Yes

Description:
Implement role-based access control.

Roles:
- OWNER (full access)
- ADMIN (all except billing)
- SALES (quote/order only)
- DESIGNER (design files only)
- TECHNICIAN (production only)

Acceptance Criteria:
☐ OWNER can do everything
☐ SALES cannot access production
☐ TECH cannot edit quotes

Dependencies:
- Blocked by: Task 1.1.4

Tags: #auth #rbac #phase1
```

---

### Sprint 1.2: Pricing Engine (Week 3)

---

**Task 1.2.1: Product Model with JSONB**

```
Assignee: [Your name]
Due Date: [Week 3 Tuesday]
Priority: High
Tech Area: Database
Complexity: 4
Hours Estimate: 3
Financial Impact: Yes
Needs Testing: Yes

Description:
Create Product model with dynamic pricing formula and JSONB specs.

Schema:
- pricingFormula (String): formula as text
- attributesConfig (Json): dynamic form fields

Acceptance Criteria:
☐ Can create Product with formula
☐ attributesConfig validates correctly

Tags: #database #pricing #phase1
```

---

**Task 1.2.2: GlobalConstant Table**

```
Assignee: [Your name]
Due Date: [Week 3 Tuesday]
Priority: High
Tech Area: Database
Complexity: 2
Hours Estimate: 2
Financial Impact: No
Needs Testing: Yes

Description:
Create table for user-defined variables (electricityRate, markup, etc.)

Seed constants:
- electricityRate: 8.5 baht/kWh
- minimumWage: 350 baht/day
- markup: 0.3 (30%)

Acceptance Criteria:
☐ Can CRUD constants
☐ Unique constraint works (no duplicate keys per org)

Tags: #database #settings #phase1
```

---

**Task 1.2.3: Formula Evaluator Service ⚠️ CRITICAL**

```
Assignee: [Your name]
Due Date: [Week 3 Friday]
Priority: Urgent
Tech Area: Backend
Complexity: 10
Hours Estimate: 8
Financial Impact: Yes (MONEY!)
Needs Testing: Yes (100% COVERAGE REQUIRED)

Description:
⚠️ CRITICAL: This calculates money. Zero tolerance for bugs.

Create service that safely evaluates pricing formulas.

Requirements:
✅ Validate formula is safe (no code injection)
✅ Round to 2 decimal places
✅ Handle division by zero
✅ Handle undefined variables
✅ 100% unit test coverage

Acceptance Criteria:
☐ Can evaluate complex formulas
☐ All tests pass (40+ test cases)
☐ No security vulnerabilities
☐ Performance < 100ms per calculation

Dependencies:
- Blocked by: Task 1.2.1, 1.2.2

Tags: #critical #pricing #financial #security #phase1
```

---

**Task 1.2.4: Pricing Calculation API**

```
Assignee: [Your name]
Due Date: [Week 3 Friday]
Priority: High
Tech Area: Backend
Complexity: 6
Hours Estimate: 6
Financial Impact: Yes
Needs Testing: Yes

Description:
Create REST API endpoint for price calculation.

Endpoint: POST /api/pricing/calculate

Returns breakdown:
- materialCost
- laborCost
- subtotal
- discount
- total

Acceptance Criteria:
☐ API returns correct calculation
☐ Includes breakdown detail
☐ Logs all calculations (audit trail)

Dependencies:
- Blocked by: Task 1.2.3

Tags: #api #pricing #phase1
```

---

### Sprint 1.3: Quote & Billing (Week 4-5)

(คุณสามารถ copy pattern เดียวกันสำหรับ tasks อื่นๆ จาก phase1_detailed.md)

---

## 🎨 Step 4: Create Views

### View 1: **Kanban Board**

1. Click **"+ Add View"**
2. Select **"Board"**
3. Group by: **Status**
4. Columns:
   - 📋 To Do
   - 🏃 In Progress
   - 👀 Review/Testing
   - ✅ Done

### View 2: **Sprint Timeline**

1. Add View → **"Timeline"** (Gantt chart)
2. Group by: **Sprint**
3. Shows task dependencies

### View 3: **By Tech Area**

1. Add View → **"List"**
2. Group by: **Tech Area**
3. Filter: Status != Done

### View 4: **Critical Tasks Only**

1. Add View → **"List"**
2. Filter: 
   - Priority = Urgent
   - OR Financial Impact = Yes
3. Sort by: Due Date

---

## 🔔 Step 5: Setup Automations (Optional)

### Automation 1: When Status → Done

**Trigger:** Status changes to "Done"  
**Action:** 
- Add comment: "Please add Git commit link in Custom Field"
- Move to bottom of list

### Automation 2: Overdue Alert

**Trigger:** Due date passed + Status != Done  
**Action:**
- Set Priority to "Urgent"
- Notify assignee

---

## 📊 Step 6: Dashboard Widgets

Add widgets to see progress:

1. **Sprint Progress** (Pie chart)
   - Done vs To Do by Sprint

2. **Hours Remaining** (Number)
   - Sum of Hours Estimate where Status != Done

3. **Critical Tasks** (List)
   - Filter: Financial Impact = Yes AND Status != Done

---

## ✅ Step 7: Daily Workflow

### 🌅 เช้า (9:00 AM):

1. Open ClickUp
2. Go to **"My Work"** view
3. Check "Assigned to me" + Due today
4. Drag 1-2 tasks to "In Progress"
5. Open Antigravity → Start working

### ⏰ ทุก 30 นาที:

```
Work 30 min → 
Git commit → 
Update ClickUp comment: "Committed: [link]"
```

### 🌙 เย็น (6:00 PM):

1. Final commit + push
2. Mark completed tasks as "Done"
3. Add Git commit link to Custom Field
4. Write summary comment (optional)
5. Plan tomorrow (drag tasks to "To Do")

---

## 📝 Pro Tips

### 1. **Task Templates**

Create template for common task types:

**Bug Fix Template:**
```
Title: [Bug] [Component] Brief description
Priority: High
Tech Area: [Area]
Description:
- Steps to reproduce:
- Expected:
- Actual:
- Root cause:
- Fix:
```

### 2. **Subtasks for Complex Features**

For tasks >8 hours, break into subtasks:

```
Task: Formula Evaluator Service
├── Subtask: Research mathjs library
├── Subtask: Write parser
├── Subtask: Write evaluator
├── Subtask: Write tests
└── Subtask: Security audit
```

### 3. **Use Checklists**

In task description, use checklists:

```
Acceptance Criteria:
☐ Feature works
☐ Tests pass
☐ Code reviewed
☐ Documentation updated
```

ClickUp will show progress: "2/4 completed"

### 4. **Link Related Tasks**

Use "Relationships":
- Blocked by: Can't start until X is done
- Waiting on: Need external input
- Duplicate of: Same as another task

---

## 🎯 Quick Import Checklist

Before you start development:

- [ ] Created 4 Sprint Lists
- [ ] Added all Custom Fields
- [ ] Imported 20+ tasks from Phase 1
- [ ] Set due dates (2 months timeline)
- [ ] Created 4 views (Kanban, Timeline, Tech Area, Critical)
- [ ] Setup 2 automations
- [ ] Added dashboard widgets
- [ ] Read all task descriptions once

**Time to setup:** ~2-3 hours  
**Worth it?** Absolutely! Professional PM = Professional results 🚀

---

## 📚 Next Steps

1. **Today:** Setup ClickUp (2 hours)
2. **Tomorrow:** Start Task 1.1.1
3. **Week 1 goal:** Complete Sprint 1.1 (Multi-Tenant Foundation)

**Remember:**
- Commit every 30 min
- Update ClickUp daily
- Ask for help when stuck
- Celebrate small wins!

Good luck! 💪

# ClickUp Backlog Tasks - Phase 2 & 3

**Purpose:** Tasks to copy-paste into ClickUp Backlog  
**Note:** These are NOT for immediate work. Move to sprint when ready.

---

## 📦 Phase 2: Production Controller (Month 3-4)

### Design File Management

---

**Task 2.1.1: DesignFile Model with Auto-naming**

```
Priority: High
Tech Area: Database
Complexity: 5
Hours Estimate: 4
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Create DesignFile model with automatic file naming system.

Auto-naming format: ORG-JOB-001-V1.ai

Fields:
- fileName (auto-generated)
- externalLink (NAS/Drive path)
- thumbnailUrl (cloud storage)
- version (auto-increment)
- status (draft/customer_approved/production_ready)

Acceptance Criteria:
☐ File name auto-generates correctly
☐ Version increments automatically
☐ Status workflow works

Tags: #phase2 #files #design
```

---

**Task 2.1.2: File Upload to Cloud (Thumbnails)**

```
Priority: High
Tech Area: Backend
Complexity: 6
Hours Estimate: 6
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Setup cloud storage for thumbnail images.

Options:
- Cloudflare R2 (cheap, S3-compatible)
- AWS S3
- Google Cloud Storage

Features:
- Upload thumbnail (max 5MB)
- Generate presigned URL
- Auto-resize to 800px width

Acceptance Criteria:
☐ Upload works
☐ Thumbnail generates correctly
☐ URL returns image

Tags: #phase2 #cloud #storage
```

---

**Task 2.1.3: External Link Storage (NAS Paths)**

```
Priority: Medium
Tech Area: Backend
Complexity: 3
Hours Estimate: 3
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Store large design file links (not files themselves).

Supported formats:
- NAS path: \\\\nas\\designs\\job-001-v1.ai
- Google Drive: https://drive.google.com/...
- OneDrive: https://onedrive.live.com/...

Acceptance Criteria:
☐ Can save external links
☐ Link validation works
☐ Can retrieve file info

Tags: #phase2 #files
```

---

**Task 2.1.4: Version Control Logic**

```
Priority: High
Tech Area: Backend
Complexity: 7
Hours Estimate: 6
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Implement design file version control.

States:
- draft → customer_approved → production_ready
- Can revert to previous version
- Track who approved and when

Acceptance Criteria:
☐ Version increments correctly
☐ Status transitions work
☐ Approval tracking works
☐ Can view version history

Tags: #phase2 #version-control
```

---

**Task 2.1.5: Approval Workflow**

```
Priority: Medium
Tech Area: Frontend + Backend
Complexity: 6
Hours Estimate: 8
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Create UI for design approval workflow.

Features:
- Designer uploads file
- Sales sends to customer
- Customer approves/rejects (optional external link)
- Auto-notify when approved
- Lock file when production_ready

Acceptance Criteria:
☐ Upload UI works
☐ Approval flow works
☐ Notifications sent
☐ File locks correctly

Tags: #phase2 #approval #workflow
```

---

### Production Tracking

---

**Task 2.2.1: ProductionJob & ProductionLog Models**

```
Priority: High
Tech Area: Database
Complexity: 4
Hours Estimate: 4
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Create models for production tracking.

ProductionJob:
- Links to OrderItem
- Status (8 states)
- materialsUsed (JSONB)
- startedAt / completedAt

ProductionLog:
- Action history
- Photo upload
- User who did it

Acceptance Criteria:
☐ Models created
☐ Migration runs
☐ Can create test jobs

Tags: #phase2 #production #database
```

---

**Task 2.2.2: Kanban Board UI (8 Statuses)**

```
Priority: High
Tech Area: Frontend
Complexity: 8
Hours Estimate: 12
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Build Kanban board for production tracking.

Columns (8):
1. New
2. Prep
3. Processing
4. Curing
5. Assembly
6. QC
7. Ready
8. Cancelled

Features:
- Drag & drop cards
- Show job details (specs, deadline)
- Color-coded by priority
- Filter by status

Acceptance Criteria:
☐ Board displays correctly
☐ Drag & drop works
☐ Updates database on move
☐ Real-time updates (optional)

Tags: #phase2 #kanban #ui
```

---

**Task 2.2.3: Tablet-Friendly Interface**

```
Priority: High
Tech Area: Frontend
Complexity: 6
Hours Estimate: 8
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Optimize production board for iPad/tablet.

Requirements:
- Large touch targets (min 44px)
- Horizontal scrolling for columns
- Read-only mode for technicians
- Quick status update buttons

Acceptance Criteria:
☐ Works on iPad (test on real device)
☐ Touch gestures work
☐ No accidental clicks
☐ Performance smooth

Tags: #phase2 #mobile #ux
```

---

**Task 2.2.4: Photo Upload (Proof of Work)**

```
Priority: Medium
Tech Area: Backend + Frontend
Complexity: 5
Hours Estimate: 6
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Allow technicians to upload progress photos.

Features:
- Upload from tablet camera
- Auto-compress to 1MB max
- Store in cloud
- Link to ProductionLog
- Show in job timeline

Acceptance Criteria:
☐ Camera upload works
☐ Compression works
☐ Photos display in timeline

Tags: #phase2 #photos #mobile
```

---

**Task 2.2.5: Status Update API**

```
Priority: High
Tech Area: Backend
Complexity: 4
Hours Estimate: 4
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Create API for production status updates.

Endpoints:
- POST /api/production/:id/start
- POST /api/production/:id/update-status
- POST /api/production/:id/complete
- POST /api/production/:id/upload-photo

Acceptance Criteria:
☐ All endpoints work
☐ Validation works
☐ Creates ProductionLog entries
☐ Returns updated job

Tags: #phase2 #api #backend
```

---

### Inventory

---

**Task 2.3.1: Material CRUD**

```
Priority: High
Tech Area: Backend + Frontend
Complexity: 5
Hours Estimate: 6
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Create Material management.

Features:
- Create material (name, SKU, unit, cost, price)
- Edit material
- Soft delete (set inactive)
- List with search/filter

Acceptance Criteria:
☐ CRUD works
☐ Tenant isolation enforced
☐ Validation works

Tags: #phase2 #inventory #crud
```

---

**Task 2.3.2: Stock Transaction Tracking**

```
Priority: High
Tech Area: Backend
Complexity: 5
Hours Estimate: 5
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Track all stock movements.

Transaction types:
- purchase (เพิ่มสต็อก)
- usage (ใช้ไป)
- adjustment (ปรับยอด)

Acceptance Criteria:
☐ Can create transactions
☐ currentStock updates correctly
☐ Transaction history visible
☐ Audit trail complete

Tags: #phase2 #inventory #tracking
```

---

**Task 2.3.3: Auto-Deduction on Order Confirm**

```
Priority: High
Tech Area: Backend
Complexity: 7
Hours Estimate: 6
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Auto-deduct stock when order confirmed.

Logic:
Order status → confirmed →
  Calculate materials needed →
  Create usage transactions →
  Update currentStock

Acceptance Criteria:
☐ Auto-deduction works
☐ Correct quantities deducted
☐ Transaction logged
☐ Handles errors gracefully

Tags: #phase2 #inventory #automation
```

---

**Task 2.3.4: Negative Stock Alerts**

```
Priority: Medium
Tech Area: Backend
Complexity: 3
Hours Estimate: 3
Financial Impact: No
Needs Testing: Yes
Phase: 2

Description:
Alert when stock goes negative.

Features:
- Allow negative (don't block)
- Send notification
- Show warning in UI

Acceptance Criteria:
☐ Negative stock allowed
☐ Alert triggers
☐ UI shows warning

Tags: #phase2 #alerts
```

---

**Task 2.3.5: Minimum Stock Warnings**

```
Priority: Low
Tech Area: Backend
Complexity: 3
Hours Estimate: 3
Financial Impact: No
Needs Testing: No
Phase: 2

Description:
Warn when stock below minimum.

Features:
- Set minimum per material
- Daily check job
- Email notification

Acceptance Criteria:
☐ Minimum threshold works
☐ Notification sent
☐ Can snooze alert

Tags: #phase2 #alerts
```

---

## 🎯 Phase 3: Launch (Month 5)

### Dashboard & Reports

---

**Task 3.1.1: Sales Dashboard**

```
Priority: High
Tech Area: Frontend
Complexity: 7
Hours Estimate: 10
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Build main dashboard with key metrics.

Widgets:
- Today's sales (฿)
- This month's sales (฿)
- Pending quotes (count)
- In-production jobs (count)
- Recent orders (table)

Acceptance Criteria:
☐ Dashboard loads < 2s
☐ Data accurate
☐ Responsive design

Tags: #phase3 #dashboard #ui
```

---

**Task 3.1.2: Revenue by Billing Profile**

```
Priority: Medium
Tech Area: Backend + Frontend
Complexity: 5
Hours Estimate: 6
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Show revenue breakdown by billing profile.

Chart:
- Pie chart or bar chart
- Filter by date range
- Show top profiles

Acceptance Criteria:
☐ Chart displays correctly
☐ Data aggregates correctly
☐ Export to Excel

Tags: #phase3 #reports
```

---

**Task 3.1.3: Material Usage Reports**

```
Priority: Medium
Tech Area: Backend + Frontend
Complexity: 5
Hours Estimate: 6
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Report on material consumption.

Metrics:
- Total used this month
- Top 10 materials
- Cost analysis
- Waste calculation

Acceptance Criteria:
☐ Report accurate
☐ Filter by date works
☐ Export works

Tags: #phase3 #reports #inventory
```

---

**Task 3.1.4: Production Efficiency Metrics**

```
Priority: Low
Tech Area: Backend + Frontend
Complexity: 6
Hours Estimate: 6
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Track production performance.

Metrics:
- Average time per job
- Bottleneck analysis (which status takes longest)
- On-time completion rate

Acceptance Criteria:
☐ Metrics calculate correctly
☐ Charts display
☐ Actionable insights

Tags: #phase3 #reports #production
```

---

### Finance

---

**Task 3.2.1: Payment Tracking**

```
Priority: High
Tech Area: Backend + Frontend
Complexity: 6
Hours Estimate: 8
Financial Impact: Yes
Needs Testing: Yes
Phase: 3

Description:
Track payments per order.

Features:
- Record payment (cash/transfer/card)
- Upload slip photo
- Mark as verified
- Payment status per order

Acceptance Criteria:
☐ Can record payments
☐ Photo upload works
☐ Status updates correctly

Tags: #phase3 #finance #payments
```

---

**Task 3.2.2: Partial Payment Support**

```
Priority: Medium
Tech Area: Backend
Complexity: 5
Hours Estimate: 5
Financial Impact: Yes
Needs Testing: Yes
Phase: 3

Description:
Support partial payments (deposits).

Logic:
- Order total: ฿10,000
- Payment 1 (deposit): ฿5,000
- Payment 2 (final): ฿5,000
- Status: paid_in_full

Acceptance Criteria:
☐ Multiple payments per order
☐ Balance calculates correctly
☐ Shows remaining amount

Tags: #phase3 #finance
```

---

**Task 3.2.3: Export to Excel/CSV**

```
Priority: High
Tech Area: Backend
Complexity: 4
Hours Estimate: 4
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Export financial data to Excel.

Exports:
- Sales report (orders, revenue)
- Payment report (cash flow)
- Material usage (inventory cost)

Format: Excel (.xlsx) with formatting

Acceptance Criteria:
☐ Export generates correctly
☐ Data accurate
☐ Opens in Excel

Tags: #phase3 #export
```

---

**Task 3.2.4: Individual Limit Tracking (1.8M)**

```
Priority: High
Tech Area: Backend
Complexity: 4
Hours Estimate: 4
Financial Impact: Yes
Needs Testing: Yes
Phase: 3

Description:
Track revenue for Individual billing profiles.

Alert when approaching ฿1.8M (tax threshold).

Features:
- Sum yearlyRevenue per profile
- Show warning at ฿1.65M
- Block orders at ฿1.8M+ (optional)

Acceptance Criteria:
☐ Revenue tracks correctly
☐ Alert shows
☐ Resets annually

Tags: #phase3 #finance #tax
```

---

### Polish

---

**Task 3.3.1: Performance Optimization**

```
Priority: High
Tech Area: Backend + Frontend
Complexity: 7
Hours Estimate: 10
Financial Impact: No
Needs Testing: Yes
Phase: 3

Description:
Optimize system performance.

Targets:
- API response < 500ms
- Page load < 2s
- Database queries optimized
- Caching implemented

Acceptance Criteria:
☐ Lighthouse score >90
☐ No N+1 queries
☐ Bundle size < 500KB

Tags: #phase3 #performance
```

---

**Task 3.3.2: PWA Setup**

```
Priority: Medium
Tech Area: Frontend
Complexity: 5
Hours Estimate: 6
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Convert to Progressive Web App.

Features:
- Install prompt
- Offline mode (limited)
- App icon
- Splash screen

Acceptance Criteria:
☐ PWA installable
☐ Offline page works
☐ Icons display

Tags: #phase3 #pwa #mobile
```

---

**Task 3.3.3: Documentation**

```
Priority: High
Tech Area: Documentation
Complexity: 4
Hours Estimate: 8
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Write user documentation.

Docs:
- Quick start guide
- User manual (PDF)
- API documentation
- Video tutorials (optional)

Acceptance Criteria:
☐ Docs cover all features
☐ Screenshots included
☐ Thai language

Tags: #phase3 #docs
```

---

**Task 3.3.4: Help Center**

```
Priority: Medium
Tech Area: Frontend
Complexity: 5
Hours Estimate: 8
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Build help center for users.

Features:
- FAQ (Thai)
- Search articles
- Contact form
- Video embeds

Acceptance Criteria:
☐ Help center accessible
☐ Search works
☐ 20+ articles

Tags: #phase3 #help
```

---

**Task 3.3.5: Onboarding Flow**

```
Priority: High
Tech Area: Frontend
Complexity: 6
Hours Estimate: 8
Financial Impact: No
Needs Testing: No
Phase: 3

Description:
Create first-time user onboarding.

Steps:
1. Welcome screen
2. Create organization
3. Add billing profiles
4. Add first product
5. Create test quote
6. Tour complete

Acceptance Criteria:
☐ Flow completes smoothly
☐ Help text clear
☐ Can skip steps

Tags: #phase3 #onboarding #ux
```

---

## 📊 Summary

**Phase 2 Tasks:** 15 tasks, ~80 hours (Month 3-4)  
**Phase 3 Tasks:** 13 tasks, ~70 hours (Month 5)  
**Total Backlog:** 28 tasks, ~150 hours

---

## 📝 How to Use This File

1. **Open ClickUp Backlog list**
2. **Create new task** for each item above
3. **Copy-paste** the description block
4. **Set custom fields** (Priority, Tech Area, etc.)
5. **Leave in Backlog** until ready to move to sprint

**When ready:**
- Drag tasks from Backlog → Sprint 1.2 (when starting Phase 2)
- Update due dates
- Assign to yourself

---

**Status:** ✅ READY TO IMPORT

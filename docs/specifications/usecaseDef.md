
📘 ERP Sign Shop — Agent Design Document (Blueprint)Version 1.0 — Designed for AI Agents / Antigravity IntegrationAuthor: Akkapol (Ak3Verse)

#️⃣ 1. Overviewระบบ ERP สำหรับร้านป้ายไวนิลถูกออกแบบเพื่อจัดการงานตั้งแต่รับออเดอร์ → ออกแบบ → พิมพ์ → QC → ส่งมอบ → เก็บเงินBlueprint นี้รวม:

End-to-End Workflow

System Interaction

Order Lifecycle

Database ERD

Module Descriptions

Agent Responsibilities

Skill Mapping

#️⃣ 2. High-Level ArchitectureCustomer → Sales → ERP Core → Production → QC → Delivery → AccountingERP ประกอบด้วย 6 โมดูลหลัก:

CRM & Job Intake

Artwork & Design

Prepress

Production & Finishing

QC & Delivery

Billing & Inventory

Agent จะทำหน้าที่เป็น “Orchestrator” ที่ควบคุมทุกโมดูลผ่าน Skills

#️⃣ 3. End-to-End Workflow (Flowchart)graph TD     A["New Job Request"] --> B["Collect Requirements"]     B --> C["Create Quotation"]     C --> D{"Quotation Approved?"}     D -- "No" --> C     D -- "Yes" --> E["Artwork Design"]     E --> F{"Customer Approves Artwork?"}     F -- "No" --> E     F -- "Yes" --> G["Prepress Check"]     G --> H["Printing"]     H --> I["Finishing (Cut/Laminate/Grommet)"]     I --> J["Quality Check"]     J --> K{"Pass QC?"}     K -- "No" --> I     K -- "Yes" --> L["Delivery / Installation"]     L --> M["Invoice & Payment"]     M --> N["Job Complete"]

#️⃣ 4. System Interaction (Sequence Diagram)sequenceDiagram     participant U as Customer/Sales     participant ERP as ERP System     participant DB as Database      U->>ERP: Submit Job Request     ERP->>DB: Save JobRequest     DB-->>ERP: Job ID Returned      U->>ERP: Request Quotation     ERP->>DB: Fetch Material Prices     DB-->>ERP: Price Data     ERP->>U: Send Quotation      U->>ERP: Approve Artwork     ERP->>DB: Update Artwork Status      ERP->>DB: Create PrintJob     DB-->>ERP: PrintJob ID      ERP->>DB: Log Material Usage     ERP->>DB: Update Stock      ERP->>DB: Create Invoice     DB-->>ERP: Invoice ID     ERP->>U: Send Invoice

#️⃣ 5. Order Lifecycle (State Machine)stateDiagram-v2     [*] --> Pending     Pending --> Quoted: Quotation Created     Quoted --> Approved: Customer Approves     Approved --> Designing: Designer Assigned     Designing --> Prepress: Artwork Approved     Prepress --> Printing: Prepress Complete     Printing --> Finishing: Print Done     Finishing --> QC: Finishing Done     QC --> Ready: QC Passed     QC --> Rework: QC Failed     Rework --> Printing     Ready --> Delivered: Delivered/Installed     Delivered --> Completed: Payment Received     Completed --> [*]

#️⃣ 6. Database ERD (Full ERP Schema)erDiagram     CUSTOMER ||--o{ JOB_REQUEST : places     JOB_REQUEST ||--|{ QUOTATION : has     QUOTATION ||--|{ QUOTATION_ITEM : contains      JOB_REQUEST ||--o{ ARTWORK : has     ARTWORK ||--o{ ARTWORK_REVISION : revises      JOB_REQUEST ||--o{ PREPRESS_TASK : prepares     JOB_REQUEST ||--o{ PRINT_JOB : prints     PRINT_JOB ||--o{ PRINT_MATERIAL_USAGE : uses      JOB_REQUEST ||--o{ FINISHING_TASK : finishes     JOB_REQUEST ||--o{ QC_RECORD : checks     JOB_REQUEST ||--o{ DELIVERY_ORDER : delivers     JOB_REQUEST ||--o{ INSTALLATION_JOB : installs      MATERIAL ||--o{ MATERIAL_STOCK : stores     MATERIAL ||--o{ MATERIAL_TRANSACTION : moves      JOB_REQUEST ||--o{ INVOICE : billed     INVOICE ||--o{ PAYMENT : pays     PAYMENT ||--o{ RECEIPT : receipts      CUSTOMER {         int id PK         string name         string phone         string email         datetime createdAt     }      JOB_REQUEST {         int id PK         int customerId FK         string title         decimal width         decimal height         string material         string status         datetime createdAt     }      QUOTATION {         int id PK         int jobId FK         decimal total         string status     }      MATERIAL {         int id PK         string name         string type         string unit     }

#️⃣ 7. Module Descriptions7.1 CRM & Job Intake

รับงานใหม่

เก็บข้อมูลลูกค้า

สร้างใบเสนอราคา

ติดตามสถานะงาน

7.2 Artwork & Design

มอบหมายงานให้กราฟิก

อัปโหลดแบบร่าง

ระบบแก้ไขงาน (Revision)

อนุมัติแบบ

7.3 Prepress

ตรวจไฟล์ก่อนพิมพ์

Outline ฟอนต์

Convert CMYK

ตรวจขนาด

7.4 Production

สร้างคิวงานพิมพ์

บันทึกการใช้วัสดุ

อัปเดตสถานะเครื่องพิมพ์

7.5 Finishing

ตัด

เคลือบ

เจาะตาไก่

ติดเทป

7.6 QC

ตรวจสี

ตรวจข้อความ

ตรวจขนาด

7.7 Delivery & Installation

สร้างใบงานติดตั้ง

บันทึกสถานะจัดส่ง

อัปโหลดรูปหลังติดตั้ง

7.8 Billing & Inventory

ออกใบแจ้งหนี้

บันทึกการชำระเงิน

จัดการสต็อกวัสดุ

#️⃣ 8. Agent ResponsibilitiesAgent ต้องสามารถ:✔ เข้าใจ Workflow ทั้งระบบ✔ เรียกใช้ Skills ตามสถานะงาน✔ ตรวจสอบความครบถ้วนของข้อมูล✔ ประสานงานระหว่างโมดูล✔ ตัดสินใจตาม State Machine✔ อัปเดตฐานข้อมูลตาม ERD✔ แจ้งเตือนลูกค้าและทีมงาน

#️⃣ 9. Skill Mapping (สำหรับ Antigravity)

Module

Skill Examples

CRM

create_customer, get_customer, update_customer

Job Intake

create_job_request, generate_quotation

Artwork

upload_artwork, approve_artwork

Prepress

prepress_check_outline, prepress_check_cmyk

Production

create_print_job, log_material_usage

Finishing

finishing_cut, finishing_laminate

QC

qc_pass, qc_fail

Delivery

create_delivery_order, update_delivery_status

Billing

create_invoice, record_payment

#️⃣ 10. Blueprint SummaryBlueprint นี้ให้คุณ:

โครงสร้างระบบครบทุกมุมมอง

Diagram ทั้งหมดในไฟล์เดียว

โมดูล + สถานะ + ความสัมพันธ์

พร้อมต่อยอดเป็น Skill JSON, Prisma Schema, หรือ Workflow Automation

# 📋 Specifications

โฟลเดอร์นี้เก็บ specifications, requirements, และ business logic documentation

## ประเภทเอกสาร

- **Feature Specs** - รายละเอียดฟีเจอร์
- **Business Logic** - กฎทางธุรกิจที่ซับซ้อน
- **Requirements** - ความต้องการของระบบ
- **User Stories** - user stories และ acceptance criteria
- **Calculation Rules** - กฎการคำนวณต่างๆ

## Feature Specification Template

```markdown
# Feature: [ชื่อฟีเจอร์]

**วันที่**: YYYY-MM-DD  
**เจ้าของ**: [ชื่อ]  
**สถานะ**: Draft/In Development/Completed

## ภาพรวม
[อธิบายฟีเจอร์คร่าวๆ]

## Business Value
[คุณค่าทางธุรกิจที่ได้รับ]

## User Stories
- As a [role], I want to [action] so that [benefit]

## Acceptance Criteria
- [ ] Criterion 1
- [ ] Criterion 2

## Business Logic
[กฎทางธุรกิจที่สำคัญ]

## Technical Requirements
- [requirement 1]
- [requirement 2]

## UI/UX Requirements
[mockups, wireframes, หรือคำอธิบาย UI]

## API Requirements
[endpoints ที่ต้องสร้าง]

## Testing Requirements
[test cases ที่ต้องมี]

## Dependencies
[ฟีเจอร์หรือระบบอื่นที่ต้องพึ่งพา]
```

## ตัวอย่างหัวข้อ

- `pricing-calculation-rules.md` - กฎการคำนวณราคา
- `quotation-workflow.md` - workflow การทำใบเสนอราคา
- `inventory-management-spec.md` - spec การจัดการสต็อก
- `customer-management-spec.md` - spec การจัดการลูกค้า

---
description: One-command workflow to run all checks before committing
---

# 🚀 Pre-Commit Checklist (All-in-One)

**วัตถุประสงค์:** รันคำสั่งเดียว เช็คทุกอย่างก่อน commit

---

## ⚡ Quick Command

// turbo-all

```bash
# รันจาก root directory
npm run pre-commit
```

---

## 📋 สิ่งที่จะเช็ค

1. ✅ TypeScript type check
2. ✅ ESLint errors
3. ✅ Prisma schema validation
4. ✅ i18n files completeness (th, en, mm)
5. ✅ Build success (optional)

---

## 🛠️ Setup (First Time Only)

### Step 1: เพิ่ม script ใน root package.json

```json
{
  "scripts": {
    "pre-commit": "node .agent/scripts/pre-commit-check.js"
  }
}
```

### Step 2: สร้างไฟล์ check script

**Create:** `.agent/scripts/pre-commit-check.js`

```javascript
#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-commit checks...\n');

let hasErrors = false;

// 1. Type Check
try {
  console.log('1️⃣ Type checking...');
  execSync('cd apps/web && npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed\n');
} catch (error) {
  console.error('❌ Type check failed\n');
  hasErrors = true;
}

// 2. Lint Check
try {
  console.log('2️⃣ Linting...');
  execSync('cd apps/web && npm run lint', { stdio: 'inherit' });
  console.log('✅ Lint check passed\n');
} catch (error) {
  console.error('❌ Lint check failed\n');
  hasErrors = true;
}

// 3. Prisma Schema Validation
try {
  console.log('3️⃣ Validating Prisma schema...');
  execSync('cd apps/api && npx prisma validate', { stdio: 'inherit' });
  console.log('✅ Prisma schema valid\n');
} catch (error) {
  console.error('❌ Prisma schema invalid\n');
  hasErrors = true;
}

// 4. i18n Completeness Check
console.log('4️⃣ Checking i18n files...');
const thKeys = getI18nKeys('apps/web/messages/th.json');
const enKeys = getI18nKeys('apps/web/messages/en.json');
const mmKeys = getI18nKeys('apps/web/messages/mm.json');

const missingEN = thKeys.filter(k => !enKeys.includes(k));
const missingMM = thKeys.filter(k => !mmKeys.includes(k));

if (missingEN.length > 0) {
  console.warn(`⚠️  EN missing ${missingEN.length} translations:`, missingEN.slice(0, 5));
}
if (missingMM.length > 0) {
  console.warn(`⚠️  MM missing ${missingMM.length} translations:`, missingMM.slice(0, 5));
}
if (missingEN.length === 0 && missingMM.length === 0) {
  console.log('✅ All i18n files complete\n');
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.error('❌ Pre-commit checks FAILED');
  console.error('Please fix errors above before committing.');
  process.exit(1);
} else {
  console.log('✅ All checks PASSED - Ready to commit!');
  process.exit(0);
}

// Helper function
function getI18nKeys(filepath) {
  try {
    const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    return getAllKeys(content);
  } catch (error) {
    return [];
  }
}

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}
```

// turbo

### Step 3: Make executable (if on Linux/Mac)

```bash
chmod +x .agent/scripts/pre-commit-check.js
```

---

## 💡 Usage

### ก่อน commit ทุกครั้ง

// turbo

```bash
npm run pre-commit
```

**ถ้าผ่าน:** เห็น "✅ All checks PASSED"

```bash
git add .
git commit -m "your message"
git push
```

**ถ้าไม่ผ่าน:** แก้ error ที่แสดง แล้วรันใหม่

---

## 🔧 Advanced: Git Hook (Auto-run)

**ถ้าอยากให้รันอัตโนมัติก่อน commit:**

// turbo

```bash
# Install husky
npm install -D husky
npx husky init

# Create hook
echo "npm run pre-commit" > .husky/pre-commit
```

**ตอนนี้ทุกครั้งที่คุณ `git commit`** → จะรัน pre-commit check อัตโนมัติ!

---

## 📊 Expected Output

```
🔍 Running pre-commit checks...

1️⃣ Type checking...
✅ Type check passed

2️⃣ Linting...
✅ Lint check passed

3️⃣ Validating Prisma schema...
✅ Prisma schema valid

4️⃣ Checking i18n files...
✅ All i18n files complete

==================================================
✅ All checks PASSED - Ready to commit!
```

---

**ประโยชน์:**

- ⏱️ ประหยัดเวลา - รันคำสั่งเดียวแทนหลายคำสั่ง
- 🛡️ ป้องกัน bugs - จับ errors ก่อน commit
- 📝 ไม่ลืม - เช็ค i18n อัตโนมัติ

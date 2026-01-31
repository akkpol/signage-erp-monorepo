# SignageERP Monorepo

ERP System สำหรับร้านป้าย พร้อม Dynamic Pricing Engine ที่ยืดหยุ่นที่สุด

## 🎯 Project Vision

- **Business**: คำนวณราคาแบบ Custom Order (กว้าง × ยาว × วัสดุ + ค่าแรง) ได้แม่นยำเหมือนถามเจ้าของร้าน
- **UX**: Data-Dense Dashboard สำหรับ PC/Tablet/Mobile (Responsive)
- **Tech**: Solo Dev แต่ Scale ได้ระดับ Enterprise ด้วย Monorepo

## 🏗️ Architecture

```
SignageERP Monorepo
├── apps/
│   ├── web/          # Next.js Frontend (Responsive)
│   └── api/          # NestJS Backend
└── packages/
    └── types/        # Shared TypeScript Types
```

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development servers
npm run dev

# Build all apps
npm run build
```

## 📦 Tech Stack

- **Monorepo**: Turborepo
- **Frontend**: Next.js 14+ (App Router) + TypeScript + TailwindCSS
- **Backend**: NestJS + TypeScript
- **Database**: PostgreSQL
- **Shared**: TypeScript types across apps

## 🎨 Features

- ✅ Dynamic Pricing Engine
- ✅ Quote & Order Management
- ✅ Material & Product Catalog
- ✅ Production Workflow
- ✅ Customer Management
- ✅ Responsive Design (PC/Tablet/Mobile)

## 📝 License

ISC

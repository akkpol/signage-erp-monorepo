---
description: Start development servers for SignageERP
---

# SignageERP Development Workflow

Start all development servers for the SignageERP monorepo.

## Prerequisites
- Node.js 18+ installed
- Dependencies installed (`npm install` from root)

## Steps

### 1. Start All Services (Recommended)
// turbo
```bash
cd d:\PrintFlowERP
npm run dev
```

This will start:
- 🌐 **Frontend (Next.js)** - http://localhost:3000
- 🔧 **Backend API (NestJS)** - http://localhost:3001/api

### 2. Start Individual Services

**Backend API only:**
```bash
cd d:\PrintFlowERP\apps\api
npm run dev
```

**Frontend only:**
```bash
cd d:\PrintFlowERP\apps\web
npm run dev
```

### 3. Build Shared Types (if needed)
```bash
cd d:\PrintFlowERP\packages\types
npm run build
```

## Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | Next.js web app |
| Backend API | http://localhost:3001/api | NestJS REST API |
| API Health | http://localhost:3001/api | Simple health check |
| Pricing API | http://localhost:3001/api/pricing/calculate | POST endpoint |

## Troubleshooting

**Types not found error:**
```bash
cd packages/types && npm run build
```

**Port already in use:**
- Frontend: Change port in `apps/web/package.json` or kill process on 3000
- Backend: Change port in `apps/api/src/main.ts` or kill process on 3001

**Module resolution errors:**
```bash
# Reinstall dependencies
cd d:\PrintFlowERP
rm -rf node_modules package-lock.json
npm install
```

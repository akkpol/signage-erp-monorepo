---
description: Setup and manage Prisma database for SignageERP
---

# SignageERP Prisma Database Workflow

Manage database schema, migrations, and Prisma client for SignageERP.

## Prerequisites
- Prisma installed in API project
- Database connection configured (SQLite/PostgreSQL/MySQL)

## Initial Setup (First Time Only)

### 1. Install Prisma
```bash
cd d:\PrintFlowERP\apps\api
npm install prisma @prisma/client
```

### 2. Initialize Prisma
```bash
npx prisma init --datasource-provider sqlite
```

This creates:
- `prisma/schema.prisma` - Database schema
- `.env` - Database connection string

### 3. Configure Database URL

**For SQLite (Local Development):**
```env
# apps/api/.env
DATABASE_URL="file:./dev.db"
```

**For Cloud PostgreSQL (Supabase/Vercel):**
```env
DATABASE_URL="postgresql://user:password@host:5432/database"
```

## Daily Workflow

### 1. Edit Schema
Edit `apps/api/prisma/schema.prisma` to add/modify models

**Example:**
```prisma
model Material {
  id          String   @id @default(uuid())
  name        String
  pricePerUnit Float
  unit        String
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### 2. Create Migration
// turbo
```bash
cd d:\PrintFlowERP\apps\api
npx prisma migrate dev --name add_materials
```

This will:
- Create migration SQL files
- Apply migration to database
- Generate Prisma Client

### 3. Generate Prisma Client (if schema changed)
```bash
npx prisma generate
```

### 4. View Database (Optional)
```bash
npx prisma studio
```
Opens database GUI at http://localhost:5555

## Common Tasks

### Reset Database (Delete all data)
```bash
npx prisma migrate reset
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Seed Database
```bash
npx prisma db seed
```

### Format Schema
```bash
npx prisma format
```

## Update TypeScript Types

After changing Prisma schema, update `packages/types/src/index.ts` to match:

```typescript
// Sync with Prisma model
export interface Material {
  id: string;
  name: string;
  pricePerUnit: number;
  unit: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## Troubleshooting

**Migration conflicts:**
```bash
# Delete migration folder and recreate
npx prisma migrate reset
npx prisma migrate dev --name initial
```

**Client out of sync:**
```bash
npx prisma generate
```

**Connection errors:**
- Check DATABASE_URL in `.env`
- Verify database is running (if using Docker/Cloud)

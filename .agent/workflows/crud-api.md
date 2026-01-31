---
description: Create CRUD API endpoint for SignageERP resources
---

# SignageERP CRUD API Generator

Standard pattern for creating CRUD endpoints in NestJS backend.

## Pattern Overview

For each resource (e.g., Material, Customer, Order), create:
1. **Module** - Organizes feature
2. **Service** - Business logic + database operations
3. **Controller** - HTTP endpoints
4. **DTOs** - Request validation
5. **Types** - Shared TypeScript interfaces

## Steps to Create New CRUD API

### 1. Create Module Structure

```bash
cd d:\PrintFlowERP\apps\api
mkdir -p src/<resource>
```

### 2. Create Service (`<resource>.service.ts`)

**Template:**
```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // if using Prisma

@Injectable()
export class MaterialService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.material.findMany({
      where: { isActive: true },
    });
  }

  async findOne(id: string) {
    return await this.prisma.material.findUnique({
      where: { id },
    });
  }

  async create(data: CreateMaterialDto) {
    return await this.prisma.material.create({
      data,
    });
  }

  async update(id: string, data: UpdateMaterialDto) {
    return await this.prisma.material.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.material.update({
      where: { id },
      data: { isActive: false }, // Soft delete
    });
  }
}
```

### 3. Create Controller (`<resource>.controller.ts`)

**Template:**
```typescript
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { MaterialService } from './material.service';
import type { Material } from '@signage-erp/types';

@Controller('materials')
export class MaterialController {
  constructor(private readonly service: MaterialService) {}

  @Get()
  async findAll(): Promise<Material[]> {
    return await this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Material> {
    return await this.service.findOne(id);
  }

  @Post()
  async create(@Body() data: CreateMaterialDto): Promise<Material> {
    return await this.service.create(data);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateMaterialDto,
  ): Promise<Material> {
    return await this.service.update(id, data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Material> {
    return await this.service.remove(id);
  }
}
```

### 4. Create Module (`<resource>.module.ts`)

**Template:**
```typescript
import { Module } from '@nestjs/common';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';

@Module({
  controllers: [MaterialController],
  providers: [MaterialService],
  exports: [MaterialService],
})
export class MaterialModule {}
```

### 5. Add to AppModule

Edit `apps/api/src/app.module.ts`:
```typescript
import { MaterialModule } from './material/material.module';

@Module({
  imports: [
    PricingModule,
    MaterialModule, // Add here
  ],
})
export class AppModule {}
```

### 6. Create DTOs (Optional, for validation)

**create-material.dto.ts:**
```typescript
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class CreateMaterialDto {
  @IsString()
  name: string;

  @IsNumber()
  pricePerUnit: number;

  @IsString()
  unit: string;

  @IsBoolean()
  isActive: boolean;
}
```

### 7. Update Types Package

Add to `packages/types/src/index.ts` if not exists:
```typescript
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

## Test Endpoints

**GET all:**
```bash
curl http://localhost:3001/api/materials
```

**GET one:**
```bash
curl http://localhost:3001/api/materials/:id
```

**POST create:**
```bash
curl -X POST http://localhost:3001/api/materials \
  -H "Content-Type: application/json" \
  -d '{"name":"Flex","pricePerUnit":150,"unit":"SQUARE_METER","isActive":true}'
```

**PUT update:**
```bash
curl -X PUT http://localhost:3001/api/materials/:id \
  -H "Content-Type: application/json" \
  -d '{"pricePerUnit":160}'
```

**DELETE:**
```bash
curl -X DELETE http://localhost:3001/api/materials/:id
```

## Checklist

When creating new CRUD API:
- [ ] Create service with CRUD methods
- [ ] Create controller with REST endpoints
- [ ] Create module
- [ ] Add module to AppModule
- [ ] Create DTOs for validation (optional)
- [ ] Update types package
- [ ] Test all endpoints
- [ ] Document in README

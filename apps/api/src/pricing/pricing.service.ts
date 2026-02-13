import { Injectable } from '@nestjs/common';
import {
  PricingInput,
  PricingResult,
  PricingBreakdown,
  LaborCost,
  LaborType,
} from '@signage-erp/types';
import { PrismaService } from '../database/prisma.service';

/**
 * Pricing Engine Service
 *
 * คำนวณราคาแบบ Dynamic โดยรองรับ:
 * - ขนาด (กว้าง × ยาว)
 * - วัสดุ (ราคาต่อหน่วย)
 * - ค่าแรงหลายประเภท
 * - ส่วนลด/มาร์จิ้น
 */
@Injectable()
export class PricingService {
  constructor(private prisma: PrismaService) {}

  /**
   * คำนวณราคาจาก input ที่กำหนด
   */
  async calculatePrice(input: PricingInput): Promise<PricingResult> {
    // 1. คำนวณค่าวัสดุ
    const materialCost = await this.calculateMaterialCost(input);

    // 2. คำนวณค่าแรงรวม
    const laborCost = this.calculateLaborCost(input.laborCosts);

    // 3. คำนวณราคาก่อนส่วนลด
    const subtotal = materialCost + laborCost;

    // 4. คำนวณส่วนลด
    const discount = input.discountPercent
      ? (subtotal * input.discountPercent) / 100
      : 0;

    // 5. คำนวณราคารวม
    let total = subtotal - discount;

    // 6. เพิ่มมาร์จิ้น (ถ้ามี)
    if (input.marginPercent) {
      total = total + (total * input.marginPercent) / 100;
    }

    const breakdown: PricingBreakdown = {
      materialCost,
      laborCost,
      subtotal,
      discount,
      total,
      laborDetails: input.laborCosts,
    };

    return {
      input,
      breakdown,
      calculatedAt: new Date(),
    };
  }

  /**
   * คำนวณค่าวัสดุ
   * - ถ้ามีขนาด (กว้าง × ยาว) = คำนวณจากพื้นที่
   * - ถ้าไม่มี = ใช้ quantity * ราคาต่อหน่วย
   */
  private async calculateMaterialCost(input: PricingInput): Promise<number> {
    // ดึงราคาวัสดุจาก Database
    const material = await this.prisma.material.findUnique({
      where: { id: input.materialId },
    });

    // ถ้าไม่พบใน DB ให้ใช้ค่าจาก Mock เดิมเป็น Fallback หรือใช้ 150 เป็น Default
    const MOCK_MATERIAL_PRICES: Record<string, number> = {
      flex: 150,
      inkjet: 200,
      acrylic: 500,
      sticker: 100,
    };

    const pricePerUnit =
      material?.sellingPrice ||
      MOCK_MATERIAL_PRICES[input.materialId.toLowerCase()] ||
      150;

    // ถ้ามีขนาด = คำนวณจากพื้นที่
    if (input.width && input.height) {
      const area = input.width * input.height; // ตร.ม.
      return area * pricePerUnit * input.quantity;
    }

    // ถ้าไม่มีขนาด = ใช้ quantity เฉยๆ
    return pricePerUnit * input.quantity;
  }

  /**
   * คำนวณค่าแรงรวม
   */
  private calculateLaborCost(laborCosts: LaborCost[]): number {
    return laborCosts.reduce((total, labor) => {
      if (labor.quantity && labor.unit) {
        // ถ้ามีหน่วย เช่น ค่าติดตั้ง 500 บาท/ชั่วโมง × 2 ชั่วโมง
        return total + labor.amount * labor.quantity;
      }
      // ถ้าไม่มีหน่วย เช่น ค่าออกแบบ 1000 บาท
      return total + labor.amount;
    }, 0);
  }

  /**
   * Validate pricing input
   */
  validateInput(input: PricingInput): string[] {
    const errors: string[] = [];

    if (!input.materialId) {
      errors.push('materialId is required');
    }

    if (input.quantity <= 0) {
      errors.push('quantity must be greater than 0');
    }

    if (input.width && input.width <= 0) {
      errors.push('width must be greater than 0');
    }

    if (input.height && input.height <= 0) {
      errors.push('height must be greater than 0');
    }

    if (
      input.discountPercent &&
      (input.discountPercent < 0 || input.discountPercent > 100)
    ) {
      errors.push('discountPercent must be between 0 and 100');
    }

    return errors;
  }
}

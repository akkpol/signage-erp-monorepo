import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { ProductType, LaborType, UnitType, PricingInput } from '@signage-erp/types';

describe('PricingService', () => {
  let service: PricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingService],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePrice', () => {
    it('should calculate price based on area (width * height)', async () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'inkjet',
        width: 2, // 2m
        height: 1, // 1m
        quantity: 1,
        laborCosts: [],
      };

      // inkjet mock price = 200
      // 2 * 1 * 200 * 1 = 400
      const result = await service.calculatePrice(input);
      expect(result.breakdown.materialCost).toBe(400);
      expect(result.breakdown.total).toBe(400);
    });

    it('should calculate price based on quantity only when width/height are missing', async () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'inkjet',
        quantity: 5,
        laborCosts: [],
      };

      // inkjet mock price = 200
      // 200 * 5 = 1000
      const result = await service.calculatePrice(input);
      expect(result.breakdown.materialCost).toBe(1000);
      expect(result.breakdown.total).toBe(1000);
    });

    it('should include labor costs', async () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'sticker', // 100
        quantity: 1,
        laborCosts: [
          {
            type: LaborType.DESIGN,
            amount: 500,
          },
          {
            type: LaborType.INSTALLATION,
            amount: 200,
            unit: UnitType.HOUR,
            quantity: 2,
          }
        ],
      };

      // material: 100 * 1 = 100
      // labor: 500 + (200 * 2) = 900
      // subtotal: 100 + 900 = 1000
      const result = await service.calculatePrice(input);
      expect(result.breakdown.materialCost).toBe(100);
      expect(result.breakdown.laborCost).toBe(900);
      expect(result.breakdown.total).toBe(1000);
    });

    it('should apply discount percentage', async () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'flex', // 150
        quantity: 10,
        laborCosts: [],
        discountPercent: 10,
      };

      // subtotal: 150 * 10 = 1500
      // discount: 1500 * 0.1 = 150
      // total: 1500 - 150 = 1350
      const result = await service.calculatePrice(input);
      expect(result.breakdown.subtotal).toBe(1500);
      expect(result.breakdown.discount).toBe(150);
      expect(result.breakdown.total).toBe(1350);
    });

    it('should apply margin percentage after discount', async () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'flex', // 150
        quantity: 10,
        laborCosts: [],
        discountPercent: 10,
        marginPercent: 20,
      };

      // subtotal: 1500
      // discount: 150
      // after discount: 1350
      // margin: 1350 * 0.2 = 270
      // total: 1350 + 270 = 1620
      const result = await service.calculatePrice(input);
      expect(result.breakdown.total).toBe(1620);
    });
  });

  describe('validateInput', () => {
    it('should return no errors for valid input', () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'flex',
        quantity: 1,
        laborCosts: [],
      };
      const errors = service.validateInput(input);
      expect(errors).toHaveLength(0);
    });

    it('should return error for missing materialId', () => {
      const input: any = {
        productType: ProductType.INKJET,
        quantity: 1,
        laborCosts: [],
      };
      const errors = service.validateInput(input);
      expect(errors).toContain('materialId is required');
    });

    it('should return error for invalid quantity', () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'flex',
        quantity: 0,
        laborCosts: [],
      };
      const errors = service.validateInput(input);
      expect(errors).toContain('quantity must be greater than 0');
    });

    it('should return errors for invalid dimensions', () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'flex',
        quantity: 1,
        width: -1,
        height: 0,
        laborCosts: [],
      };
      const errors = service.validateInput(input);
      expect(errors).toContain('width must be greater than 0');
      expect(errors).toContain('height must be greater than 0');
    });

    it('should return error for invalid discount percentage', () => {
      const input: PricingInput = {
        productType: ProductType.INKJET,
        materialId: 'flex',
        quantity: 1,
        laborCosts: [],
        discountPercent: 110,
      };
      const errors = service.validateInput(input);
      expect(errors).toContain('discountPercent must be between 0 and 100');
    });
  });
});

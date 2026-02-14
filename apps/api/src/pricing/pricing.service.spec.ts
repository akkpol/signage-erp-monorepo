import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import {
  PricingInput,
  ProductType,
  LaborType,
} from '@signage-erp/types';

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

  describe('validateInput', () => {
    it('should validate marginPercent cannot be negative', () => {
      const input: PricingInput = {
        productType: ProductType.FLEX_BANNER,
        materialId: 'flex',
        quantity: 1,
        laborCosts: [],
        marginPercent: -10, // Invalid
      };

      const errors = service.validateInput(input);
      expect(errors).toContain('marginPercent must be greater than or equal to 0');
    });

    it('should validate laborCosts array length limit', () => {
      const input: PricingInput = {
        productType: ProductType.FLEX_BANNER,
        materialId: 'flex',
        quantity: 1,
        laborCosts: Array(21).fill({ // Exceeds limit of 20
          type: LaborType.OTHER,
          amount: 100,
        }),
      };

      const errors = service.validateInput(input);
      expect(errors).toContain('laborCosts cannot exceed 20 items');
    });

    it('should validate laborCost amount cannot be negative', () => {
      const input: PricingInput = {
        productType: ProductType.FLEX_BANNER,
        materialId: 'flex',
        quantity: 1,
        laborCosts: [
          {
            type: LaborType.OTHER,
            amount: -100, // Invalid
          },
        ],
      };

      const errors = service.validateInput(input);
      expect(errors).toContain('Labor cost amount cannot be negative');
    });

    it('should validate laborCost quantity cannot be negative', () => {
      const input: PricingInput = {
        productType: ProductType.FLEX_BANNER,
        materialId: 'flex',
        quantity: 1,
        laborCosts: [
          {
            type: LaborType.INSTALLATION,
            amount: 500,
            quantity: -2, // Invalid
            unit: 'HOUR' as any,
          },
        ],
      };

      const errors = service.validateInput(input);
      expect(errors).toContain('Labor cost quantity cannot be negative');
    });

    it('should allow valid input', () => {
      const input: PricingInput = {
        productType: ProductType.FLEX_BANNER,
        materialId: 'flex',
        quantity: 1,
        width: 1,
        height: 1,
        laborCosts: [
          {
            type: LaborType.INSTALLATION,
            amount: 500,
            quantity: 2,
            unit: 'HOUR' as any,
          },
        ],
        marginPercent: 20,
        discountPercent: 10,
      };

      const errors = service.validateInput(input);
      expect(errors).toHaveLength(0);
    });
  });
});

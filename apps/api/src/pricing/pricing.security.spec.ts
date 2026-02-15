import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PricingInput, ProductType, LaborType } from '@signage-erp/types';

describe('PricingService Security', () => {
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

  it('should reject invalid materialId type (Type Confusion Prevention)', async () => {
    const input = {
      productType: ProductType.FLEX_BANNER,
      materialId: 123 as any, // Malicious input
      quantity: 1,
      laborCosts: [],
    } as PricingInput;

    const errors = service.validateInput(input);
    expect(errors).toContain('materialId must be a valid string');
  });

  it('should reject huge laborCosts array (DoS Prevention)', async () => {
    const hugeLaborCosts = Array(100).fill({
      type: LaborType.OTHER,
      amount: 1,
    });

    const input = {
      productType: ProductType.FLEX_BANNER,
      materialId: 'flex',
      quantity: 1,
      laborCosts: hugeLaborCosts,
    } as PricingInput;

    const errors = service.validateInput(input);
    expect(errors).toContain('laborCosts cannot exceed 20 items');
  });

  it('should reject negative margin (Business Logic Security)', () => {
     const input = {
      productType: ProductType.FLEX_BANNER,
      materialId: 'flex',
      quantity: 1,
      laborCosts: [],
      marginPercent: -50 // Should be blocked
    } as PricingInput;

    const errors = service.validateInput(input);
    expect(errors).toContain('marginPercent must be greater than or equal to 0');
  });

  it('should validate correctly with valid input', () => {
    const input = {
      productType: ProductType.FLEX_BANNER,
      materialId: 'flex',
      quantity: 1,
      laborCosts: [{ type: LaborType.DESIGN, amount: 500 }],
      marginPercent: 10
    } as PricingInput;

    const errors = service.validateInput(input);
    expect(errors).toHaveLength(0);
  });
});

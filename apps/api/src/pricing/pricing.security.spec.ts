import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { ProductType, PricingInput, LaborType } from '@signage-erp/types';

describe('PricingService Security', () => {
  let service: PricingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PricingService],
    }).compile();

    service = module.get<PricingService>(PricingService);
  });

  it('should reject extremely large laborCosts array (DoS prevention)', () => {
    const hugeLaborCosts = Array(1000).fill({
      type: LaborType.INSTALLATION,
      amount: 1,
      quantity: 1,
      unit: 'HOUR',
    });

    const input: PricingInput = {
      productType: ProductType.FLEX_BANNER,
      materialId: 'flex',
      width: 1,
      height: 1,
      quantity: 1,
      laborCosts: hugeLaborCosts,
    };

    const errors = service.validateInput(input);
    expect(errors).toContain('Too many labor costs items (max 20)');
  });

  it('should validate laborCosts length', () => {
     const hugeLaborCosts = Array(21).fill({
      type: LaborType.INSTALLATION,
      amount: 1,
    });

    const input: PricingInput = {
      productType: ProductType.FLEX_BANNER,
      materialId: 'flex',
      width: 1,
      height: 1,
      quantity: 1,
      laborCosts: hugeLaborCosts,
    };

    const errors = service.validateInput(input);
    expect(errors).toContain('Too many labor costs items (max 20)');
  });

  it('should validate labor cost item values', () => {
    const input: PricingInput = {
      productType: ProductType.FLEX_BANNER,
      materialId: 'flex',
      width: 1,
      height: 1,
      quantity: 1,
      laborCosts: [
        {
          type: LaborType.INSTALLATION,
          amount: -100, // Invalid
          quantity: -1, // Invalid
        },
      ],
    };

    const errors = service.validateInput(input);
    expect(errors).toContain('Labor cost #1 amount must be non-negative');
    expect(errors).toContain('Labor cost #1 quantity must be non-negative');
  });
});

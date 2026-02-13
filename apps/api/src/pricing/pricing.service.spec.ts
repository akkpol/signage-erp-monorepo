import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PrismaService } from '../database/prisma.service';
import { ProductType } from '@signage-erp/types';

describe('PricingService', () => {
  let service: PricingService;
  let prisma: PrismaService;

  const mockPrismaService = {
    material: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PricingService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PricingService>(PricingService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePrice', () => {
    it('should calculate price using material price from database', async () => {
      const input = {
        productType: ProductType.FLEX_BANNER,
        materialId: 'some-uuid',
        width: 2,
        height: 1,
        quantity: 1,
        laborCosts: [],
      };

      (mockPrismaService.material.findUnique as jest.Mock).mockResolvedValue({
        id: 'some-uuid',
        sellingPrice: 300,
      });

      const result = await service.calculatePrice(input);

      expect(prisma.material.findUnique).toHaveBeenCalledWith({
        where: { id: 'some-uuid' },
      });
      // Area = 2 * 1 = 2 sqm. Price = 300. Total material cost = 2 * 300 = 600.
      expect(result.breakdown.materialCost).toBe(600);
      expect(result.breakdown.total).toBe(600);
    });

    it('should use fallback price if material not found in database', async () => {
      const input = {
        productType: ProductType.INKJET,
        materialId: 'inkjet',
        width: 1,
        height: 1,
        quantity: 1,
        laborCosts: [],
      };

      (mockPrismaService.material.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.calculatePrice(input);

      // Inkjet fallback is 200. Area = 1 * 1 = 1. Total = 200.
      expect(result.breakdown.materialCost).toBe(200);
    });

    it('should use default 150 if material not found and not in mock', async () => {
      const input = {
        productType: ProductType.CUSTOM,
        materialId: 'unknown-material',
        width: 1,
        height: 1,
        quantity: 1,
        laborCosts: [],
      };

      (mockPrismaService.material.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await service.calculatePrice(input);

      expect(result.breakdown.materialCost).toBe(150);
    });
  });
});

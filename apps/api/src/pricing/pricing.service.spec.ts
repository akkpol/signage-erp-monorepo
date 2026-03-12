import { Test, TestingModule } from '@nestjs/testing';
import { PricingService } from './pricing.service';
import { PrismaService } from '../database/prisma.service';
import { ProductType } from '@signage-erp/types';
import { NotFoundException } from '@nestjs/common';

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
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('calculatePrice', () => {
    it('should calculate price correctly when material is found', async () => {
      const mockMaterial = {
        id: 'mat-123',
        sellingPrice: 200,
      };
      mockPrismaService.material.findUnique.mockResolvedValue(mockMaterial);

      const input = {
        productType: ProductType.INKJET,
        materialId: 'mat-123',
        width: 2,
        height: 3,
        quantity: 1,
        laborCosts: [],
      };

      const result = await service.calculatePrice(input);

      expect(result.breakdown.materialCost).toBe(2 * 3 * 200 * 1);
      expect(result.breakdown.total).toBe(1200);
      expect(prisma.material.findUnique).toHaveBeenCalledWith({
        where: { id: 'mat-123' },
      });
    });

    it('should calculate price correctly without width and height', async () => {
        const mockMaterial = {
          id: 'mat-123',
          sellingPrice: 100,
        };
        mockPrismaService.material.findUnique.mockResolvedValue(mockMaterial);

        const input = {
          productType: ProductType.STICKER,
          materialId: 'mat-123',
          quantity: 5,
          laborCosts: [],
        };

        const result = await service.calculatePrice(input);

        expect(result.breakdown.materialCost).toBe(100 * 5);
        expect(result.breakdown.total).toBe(500);
      });

    it('should throw NotFoundException when material is not found', async () => {
      mockPrismaService.material.findUnique.mockResolvedValue(null);

      const input = {
        productType: ProductType.INKJET,
        materialId: 'non-existent',
        quantity: 1,
        laborCosts: [],
      };

      await expect(service.calculatePrice(input)).rejects.toThrow(NotFoundException);
    });

    it('should include labor costs', async () => {
        const mockMaterial = {
          id: 'mat-123',
          sellingPrice: 200,
        };
        mockPrismaService.material.findUnique.mockResolvedValue(mockMaterial);

        const input = {
          productType: ProductType.INKJET,
          materialId: 'mat-123',
          width: 1,
          height: 1,
          quantity: 1,
          laborCosts: [
            { type: 'DESIGN' as any, amount: 500 },
            { type: 'INSTALLATION' as any, amount: 100, quantity: 2, unit: 'HOUR' as any }
          ],
        };

        const result = await service.calculatePrice(input);

        // material: 1 * 1 * 200 * 1 = 200
        // labor: 500 + (100 * 2) = 700
        // total: 900
        expect(result.breakdown.materialCost).toBe(200);
        expect(result.breakdown.laborCost).toBe(700);
        expect(result.breakdown.total).toBe(900);
      });
  });
});

import { calculateMaterialCost } from './pricing';

describe('Pricing Engine', () => {
    describe('calculateMaterialCost', () => {
        it('should calculate correct cost for standard signage', () => {
            // 2m x 1m @ 500 baht/sqm = 1000 baht
            expect(calculateMaterialCost(2, 1, 500)).toBe(1000);
        });

        it('should handle decimal dimensions correctly', () => {
            // 1.5m x 0.8m @ 250 baht/sqm = 300 baht
            expect(calculateMaterialCost(1.5, 0.8, 250)).toBe(300);
        });

        it('should round to 2 decimal places', () => {
            // 1.3333...m x 1m @ 100 baht = 133.33
            expect(calculateMaterialCost(1.3333, 1, 100)).toBe(133.33);
        });

        it('should return 0 for zero dimensions', () => {
            expect(calculateMaterialCost(0, 5, 500)).toBe(0);
        });

        it('should throw error for negative width', () => {
            expect(() => calculateMaterialCost(-1, 5, 500)).toThrow('Dimensions and price must be non-negative');
        });

        it('should throw error for negative price', () => {
            expect(() => calculateMaterialCost(1, 1, -500)).toThrow('Dimensions and price must be non-negative');
        });
    });

    describe('calculateLaborCost', () => {
        it('should calculate correct labor cost', () => {
            // 5 hours @ 100 baht/hr = 500
            expect(calculateLaborCost(5, 100)).toBe(500);
        });

        it('should handle partial hours', () => {
            // 2.5 hours @ 200 baht/hr = 500
            expect(calculateLaborCost(2.5, 200)).toBe(500);
        });

        it('should throw error for negative inputs', () => {
            expect(() => calculateLaborCost(-1, 100)).toThrow('Values must be non-negative');
        });
    });

    describe('calculateGrandTotal', () => {
        it('should calculate total with VAT correctly', () => {
            // 1000 + 7% VAT = 1070
            expect(calculateGrandTotal(1000, 0.07)).toBe(1070);
        });

        it('should round result to 2 decimal places', () => {
            // 100 + 7% = 107.00
            expect(calculateGrandTotal(99.99, 0.07)).toBe(106.99);
        });

        it('should handle zero VAT', () => {
            expect(calculateGrandTotal(100, 0)).toBe(100);
        });
    });
});

import { calculateLaborCost, calculateGrandTotal } from './pricing';

/**
 * Pricing Engine Logic
 * 
 * Standard:
 * - Round to 2 decimal places
 * - No negative values
 */

/**
 * Calculate material cost based on area (Width x Height)
 * 
 * @param width - Width in meters
 * @param height - Height in meters
 * @param pricePerSqm - Price per square meter (Baht)
 * @returns Total material cost (rounded to 2 decimals)
 */
export function calculateMaterialCost(
    width: number,
    height: number,
    pricePerSqm: number
): number {
    if (width < 0 || height < 0 || pricePerSqm < 0) {
        throw new Error('Dimensions and price must be non-negative');
    }

    const area = width * height;
    const cost = area * pricePerSqm;

    // Round to 2 decimal places: 123.456 -> 123.46
    return Math.round(cost * 100) / 100;
}

/**
 * Calculate labor cost based on time
 * 
 * @param hours - Number of hours
 * @param hourlyRate - Cost per hour
 * @returns Total labor cost
 */
export function calculateLaborCost(hours: number, hourlyRate: number): number {
    if (hours < 0 || hourlyRate < 0) {
        throw new Error('Values must be non-negative');
    }
    const cost = hours * hourlyRate;
    return Math.round(cost * 100) / 100;
}

/**
 * Calculate grand total including VAT
 * 
 * @param netPrice - Price before tax
 * @param vatRate - VAT rate (e.g., 0.07 for 7%)
 * @returns Grand total rounded to 2 decimals
 */
export function calculateGrandTotal(netPrice: number, vatRate: number = 0.07): number {
    if (netPrice < 0 || vatRate < 0) {
        throw new Error('Values must be non-negative');
    }

    const vatAmount = netPrice * vatRate;
    const total = netPrice + vatAmount;

    return Math.round(total * 100) / 100;
}

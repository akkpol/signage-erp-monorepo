---
description: Testing and code quality standards for SignageERP financial calculations
---

# SignageERP Testing & Quality Standards

**CRITICAL:** This system handles MONEY and PRICING - accuracy is non-negotiable!

---

## 🎯 Core Principles

### 1. **Small Modules = Easy Testing**
- ✅ Each function does ONE thing
- ✅ Maximum 20-30 lines per function
- ✅ Pure functions when possible (same input → same output)
- ✅ No side effects in calculation logic

### 2. **Financial Accuracy**
- ✅ Use `number` type (JavaScript handles decimals well for money)
- ✅ Always round to 2 decimal places: `Math.round(value * 100) / 100`
- ✅ Test edge cases (0, negative, very large numbers)
- ✅ Document currency assumptions

### 3. **Readable & Maintainable**
- ✅ Clear variable names (`totalPrice` not `tp`)
- ✅ Comments for complex calculations
- ✅ Examples in docstrings

---

## 📋 Mini-Test Strategy

### Every Function Must Have:

1. **Unit Test** - Test in isolation
2. **Example Usage** - In comments
3. **Edge Cases** - Test extremes

### Example Pattern:

```typescript
/**
 * Calculate material cost based on area
 * 
 * @param width - Width in meters
 * @param height - Height in meters
 * @param pricePerSqm - Price per square meter
 * @returns Total material cost (rounded to 2 decimals)
 * 
 * @example
 * calculateMaterialCost(2, 3, 150) // Returns 900.00
 * calculateMaterialCost(0, 0, 150) // Returns 0.00
 */
export function calculateMaterialCost(
  width: number,
  height: number,
  pricePerSqm: number,
): number {
  // Validate inputs
  if (width < 0 || height < 0 || pricePerSqm < 0) {
    throw new Error('Dimensions and price must be non-negative');
  }

  // Calculate area
  const area = width * height;

  // Calculate and round to 2 decimals
  const cost = area * pricePerSqm;
  return Math.round(cost * 100) / 100;
}

// Mini-test (can be in separate file)
describe('calculateMaterialCost', () => {
  it('should calculate correct cost for normal values', () => {
    expect(calculateMaterialCost(2, 3, 150)).toBe(900);
  });

  it('should handle zero dimensions', () => {
    expect(calculateMaterialCost(0, 3, 150)).toBe(0);
  });

  it('should throw error for negative values', () => {
    expect(() => calculateMaterialCost(-1, 3, 150)).toThrow();
  });

  it('should round to 2 decimals', () => {
    expect(calculateMaterialCost(1.5, 2.5, 10.99)).toBe(41.21);
  });
});
```

---

## 🔍 Code Review Checklist

Before committing ANY financial calculation:

- [ ] Function is < 30 lines?
- [ ] Has clear JSDoc with @example?
- [ ] Handles edge cases (0, negative, very large)?
- [ ] Rounds money to 2 decimals?
- [ ] Has unit tests?
- [ ] Readable variable names?
- [ ] No magic numbers (use constants)?

---

## 🧪 Testing Workflow

### 1. Write Function First (TDD-lite)
```typescript
// Step 1: Write the function
export function calculateDiscount(subtotal: number, percent: number): number {
  // TODO: implement
  return 0;
}
```

### 2. Write Mini-Test
```typescript
// Step 2: Write test cases
describe('calculateDiscount', () => {
  it('10% discount on 1000 should be 100', () => {
    expect(calculateDiscount(1000, 10)).toBe(100);
  });
});
```

### 3. Implement & Run
```bash
npm test -- calculateDiscount
```

### 4. Commit Immediately
```bash
git add .
git commit -m "feat(pricing): add calculateDiscount with tests"
```

---

## 💰 Financial Calculation Best Practices

### ✅ DO:
```typescript
// ✅ Use descriptive names
const materialCost = calculateMaterialCost(width, height, pricePerSqm);
const laborCost = calculateLaborCost(hours, ratePerHour);
const subtotal = materialCost + laborCost;

// ✅ Round at the end
const total = Math.round(subtotal * 100) / 100;

// ✅ Use constants for rates
const VAT_RATE = 0.07; // 7%
const tax = total * VAT_RATE;
```

### ❌ DON'T:
```typescript
// ❌ Unclear variable names
const c = m + l;

// ❌ Magic numbers
const tax = total * 0.07; // What is 0.07?

// ❌ Rounding too early
const a = Math.round(width * pricePerSqm); // WRONG!
const b = Math.round(height * pricePerSqm); // WRONG!
const total = a + b; // Accumulated rounding errors!

// ✅ CORRECT: Round at the end
const total = Math.round(width * pricePerSqm + height * pricePerSqm);
```

---

## 📦 Module Structure Example

### Bad (Too Long):
```typescript
// ❌ 150 lines function - hard to test!
class PricingService {
  calculatePrice(input) {
    // 150 lines of mixed logic...
  }
}
```

### Good (Small Modules):
```typescript
// ✅ Each function is testable
class PricingService {
  calculatePrice(input: PricingInput): PricingResult {
    const materialCost = this.calculateMaterialCost(input);
    const laborCost = this.calculateLaborCost(input.laborCosts);
    const subtotal = materialCost + laborCost;
    const discount = this.calculateDiscount(subtotal, input.discountPercent);
    const total = subtotal - discount;

    return { materialCost, laborCost, subtotal, discount, total };
  }

  // Each small function = easy to test!
  private calculateMaterialCost(input: PricingInput): number { /* 10 lines */ }
  private calculateLaborCost(costs: LaborCost[]): number { /* 10 lines */ }
  private calculateDiscount(subtotal: number, percent?: number): number { /* 5 lines */ }
}
```

---

## 🚨 Critical Functions Must Have:

### 1. Input Validation
```typescript
function calculatePrice(input: PricingInput) {
  // ✅ Validate first!
  if (input.quantity <= 0) {
    throw new Error('Quantity must be positive');
  }
  // ... rest of calculation
}
```

### 2. Error Handling
```typescript
try {
  const price = calculatePrice(input);
} catch (error) {
  // Log error with context
  logger.error('Price calculation failed', { input, error });
  throw new PricingError('Cannot calculate price', error);
}
```

### 3. Audit Trail (for money)
```typescript
// ✅ Log all financial calculations
logger.info('Price calculated', {
  input,
  result: {
    materialCost: 900,
    laborCost: 500,
    total: 1400,
  },
  timestamp: new Date(),
});
```

---

## 📊 Test Coverage Requirements

| Module Type | Min Coverage | Critical? |
|-------------|--------------|-----------|
| **Pricing calculations** | 100% | ✅ YES |
| **Financial logic** | 100% | ✅ YES |
| Controllers | 80% | ⚠️ |
| Utils | 90% | ⚠️ |

### Run Coverage:
```bash
npm test -- --coverage
```

---

## ⏰ Commit Frequency for Financial Code

**STRICTER than normal code:**

- ✅ Commit after EACH calculation function + test
- ✅ Maximum 15 minutes between commits
- ✅ NEVER commit untested financial logic

**Example workflow:**
```bash
# 1. Write calculateMaterialCost + test (10 min)
git commit -m "feat(pricing): add calculateMaterialCost with tests"

# 2. Write calculateLaborCost + test (10 min)
git commit -m "feat(pricing): add calculateLaborCost with tests"

# 3. Integrate both (5 min)
git commit -m "feat(pricing): integrate material and labor costs"
```

---

## 🎯 Summary

1. ✅ **Small functions** (< 30 lines) = Easy testing
2. ✅ **Always test** financial calculations (100% coverage)
3. ✅ **Round properly** (at the end, 2 decimals)
4. ✅ **Clear names** (readability > brevity)
5. ✅ **Commit often** (every function + test)
6. ✅ **Validate inputs** (prevent bad data)
7. ✅ **Document edge cases** (in tests)

**Remember:** This system calculates MONEY. One bug = customer trust lost! 💰

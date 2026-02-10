import { test, expect } from '@playwright/test';

test('Quick Quote Calculation (Thai)', async ({ page }) => {
    // 1. Go to Quote Page (Thai Locale)
    await page.goto('/th/quote');

    // 2. Verify Page Content first
    await expect(page.getByRole('heading', { name: 'เสนอราคาด่วน' })).toBeVisible();

    // 3. Verify Page Title
    await expect(page).toHaveTitle(/PrintFlow ERP/);

    // 3. Enter Dimensions
    await page.getByLabel('ความกว้าง (เมตร)').fill('2');
    await page.getByLabel('ความสูง (เมตร)').fill('1');

    // 4. Enter Prices
    await page.getByLabel('ราคาวัสดุ (ต่อ ตร.ม.)').fill('500');
    await page.getByLabel('ค่าแรง & ติดตั้ง').fill('500');

    // 5. Verify Total Price Calculation
    // Formula: (2 * 1 * 500) + 500 = 1500
    await expect(page.locator('text=฿1,500.00')).toBeVisible();

    // 6. Check Buttons exist (Thai labels)
    await expect(page.getByRole('button', { name: 'เปิดออเดอร์' })).toBeVisible();
});

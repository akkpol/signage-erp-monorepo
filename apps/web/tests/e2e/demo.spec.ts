import { test, expect } from '@playwright/test';

test('Full Feature Demo: Stock -> Pricing -> Order -> Kanban', async ({ page }) => {
    // 1. Stock Management
    await page.goto('http://localhost:3000/th/stock');
    await expect(page.getByText('จัดการสต็อก')).toBeVisible();

    // Add Material
    await page.getByRole('button', { name: 'เพิ่มวัสดุ' }).click();
    await page.getByLabel('ชื่อวัสดุ').fill('Gold Premium Vinyl');
    await page.getByLabel('ราคาทุน').fill('500');
    await page.getByLabel('ราคาขาย').fill('1200');
    await page.getByLabel('หน่วย').fill('sqm');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();

    // Verify & Stock In
    await expect(page.getByText('Gold Premium Vinyl')).toBeVisible();
    // Find the row with Gold Premium Vinyl and click Stock In (first button in actions)
    // Note: This might be tricky with icons, assuming distinct locator or just first one
    // Let's use more specific locator if possible, or just skip if complex UI, 
    // but let's try to find the row.
    const row = page.getByRole('row').filter({ hasText: 'Gold Premium Vinyl' });
    await row.getByRole('button').first().click(); // Stock In button is usually first

    await page.getByLabel('จำนวน').fill('100');
    await page.getByRole('button', { name: 'ยืนยัน' }).click();
    // Verify Chip
    await expect(row.getByText('100')).toBeVisible();

    // 2. Pricing Calculator
    await page.goto('http://localhost:3000/th/pricing');
    await page.getByLabel('เลือกวัสดุ').click();
    await page.getByRole('option', { name: 'Gold Premium Vinyl' }).click();

    await page.getByLabel('ความกว้าง').fill('200'); // 2m
    await page.getByLabel('ความสูง').fill('100');  // 1m = 2sqm
    await page.getByLabel('จำนวน').fill('5');      // Total 10 sqm

    // 2sqm * 1200 = 2400 per piece * 5 = 12000
    await page.getByRole('button', { name: 'คำนวณ' }).click();
    // Note: Calculator auto-calculates on change usually, button might not exist if real-time
    // If real-time, we just wait for text.
    await expect(page.getByText('12,000')).toBeVisible();

    // 3. Order Management
    await page.goto('http://localhost:3000/th/orders');
    await page.getByRole('button', { name: 'New Order (Test)' }).click();

    // Verify Card created in New column
    await expect(page.getByText('JOB-')).toBeVisible();

    // 4. Kanban Drag & Drop (Simulation)
    // Playwright drag and drop
    const card = page.locator('.touch-none').first();
    const designingColumn = page.locator('#DESIGNING');

    await card.dragTo(designingColumn);

    // Wait to see movement
    await page.waitForTimeout(1000);
});

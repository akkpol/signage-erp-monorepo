import { test, expect } from '@playwright/test';

test.describe('SignageERP Dashboard', () => {
    test('should load dashboard with stats cards', async ({ page }) => {
        // Debugging: Log console messages and errors
        page.on('console', msg => console.log(`[Browser Console] ${msg.text()}`));
        page.on('pageerror', err => console.log(`[Browser Error] ${err.message}`));

        // Navigate to dashboard
        await page.goto('/en');

        // Wait for page to load (domcontentloaded is faster/safer than networkidle)
        await page.waitForLoadState('domcontentloaded');

        // Check if dashboard title/stats are visible
        try {
            await expect(page.locator('text=Total Sales').or(page.locator('text=Today Sales'))).toBeVisible({ timeout: 10000 });
        } catch (e) {
            console.log('❌ Dashboard stats not found. Page content:');
            console.log(await page.innerText('body'));
            throw e;
        }
        await expect(page.locator('text=Pending')).toBeVisible();
        await expect(page.locator('text=Urgent')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'test-results/dashboard-loaded.png', fullPage: true });

        console.log('✅ Dashboard loaded successfully');
    });

    test('should navigate to Stock Management page', async ({ page }) => {
        await page.goto('/en/stock');
        await page.waitForLoadState('domcontentloaded');

        // Check if stock page elements are visible
        await expect(page.locator('text=Material').or(page.locator('text=Stock'))).toBeVisible({ timeout: 10000 });

        await page.screenshot({ path: 'test-results/stock-page.png', fullPage: true });

        console.log('✅ Stock page loaded successfully');
    });

    test('should navigate to Orders/Kanban page', async ({ page }) => {
        await page.goto('/en/orders');
        await page.waitForLoadState('domcontentloaded');

        // Check for Kanban board or order management elements
        await expect(page.locator('text=Order').or(page.locator('text=New Order'))).toBeVisible({ timeout: 10000 });

        await page.screenshot({ path: 'test-results/orders-kanban.png', fullPage: true });

        console.log('✅ Orders/Kanban page loaded successfully');
    });
});

import { test, expect } from '@playwright/test';

test.describe('SignageERP Dashboard', () => {
    test('should load dashboard with stats cards', async ({ page }) => {
        // Navigate to dashboard
        await page.goto('/th');

        // Wait for page to load
        await page.waitForLoadState('networkidle');

        // Check if dashboard title/stats are visible
        await expect(page.locator('text=Today Sales')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('text=Pending')).toBeVisible();
        await expect(page.locator('text=Urgent')).toBeVisible();

        // Take screenshot
        await page.screenshot({ path: 'test-results/dashboard-loaded.png', fullPage: true });

        console.log('✅ Dashboard loaded successfully');
    });

    test('should navigate to Stock Management page', async ({ page }) => {
        await page.goto('/th/stock');
        await page.waitForLoadState('networkidle');

        // Check if stock page elements are visible
        await expect(page.locator('text=Material').or(page.locator('text=Stock'))).toBeVisible({ timeout: 10000 });

        await page.screenshot({ path: 'test-results/stock-page.png', fullPage: true });

        console.log('✅ Stock page loaded successfully');
    });

    test('should navigate to Orders/Kanban page', async ({ page }) => {
        await page.goto('/th/orders');
        await page.waitForLoadState('networkidle');

        // Check for Kanban board or order management elements
        await expect(page.locator('text=Order').or(page.locator('text=New Order'))).toBeVisible({ timeout: 10000 });

        await page.screenshot({ path: 'test-results/orders-kanban.png', fullPage: true });

        console.log('✅ Orders/Kanban page loaded successfully');
    });
});

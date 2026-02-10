const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Go to orders page (Thai locale)
    await page.goto('http://localhost:3000/th/orders', { waitUntil: 'networkidle', timeout: 60000 });

    // Create a few test orders first if empty (using the button)
    // But wait, the previous test might represent state? No, browser context is new.
    // The DB is persistent (SQLite). So orders from previous test should appear? 
    // Wait, E2E test runs in separate process? Yes. But same DB file.
    // So orders created by `orders-kanban.spec.ts` should exist if the test passed.
    // But to be safe, let's create one more.

    await page.getByRole('button', { name: 'New Order (Test)' }).click();
    await page.waitForTimeout(1000); // Wait for optimistic update/server action

    await page.screenshot({ path: 'public/kanban-screenshot.png', fullPage: true });

    await browser.close();
})();

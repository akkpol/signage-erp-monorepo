---
description: How to verify the SignageERP app using Playwright E2E tests
---

# Browser Verification Workflow (Automated)

This workflow uses Playwright to automatically verify the application behavior in a real browser environment.

1. **Ensure App is Running**
   - Check if `npm run dev` is active in a terminal.
   - URL: `http://localhost:3000`

2. **Run E2E Tests**
   - Execute the following command in the `apps/web` directory:
   ```bash
   npx playwright test
   ```

3. **Verify Results**
   - Pass: All tests passed (Green tick)
   - Fail: Review error logs

4. **View Report (Optional)**
   - If tests fail, view the report:
   ```bash
   npx playwright show-report
   ```

const { test, expect } = require('@playwright/test');

test('test day card', async ({ page }) => {
  await page.goto('http://localhost:8000');

  // Go to main app
  await page.evaluate(() => go());

  // Wait for animation
  await page.waitForTimeout(500);

  // Take screenshot of days tab
  await page.screenshot({ path: 'days-tab.png' });

  // Assign item to day 1
  await page.evaluate(() => {
    ITEMS[0].dayIds = ['d1'];
    renderAll();
  });

  // Wait for animation
  await page.waitForTimeout(500);

  // Take screenshot of days tab with item
  await page.screenshot({ path: 'days-tab-with-item.png' });
});

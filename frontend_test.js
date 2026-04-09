const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/index.html');

  await page.click('button.setup-cta');
  await page.waitForTimeout(500);

  // Take a screenshot of the day view
  await page.screenshot({ path: 'day_view.png' });

  await page.evaluate(() => openAddItem('day','d1'));
  await page.waitForTimeout(500);
  await page.fill('#ai-inp', 'Testing Add Day');
  await page.screenshot({ path: 'add_day_modal.png' });
  await page.click('.sh-cta:has-text("Add item")');
  await page.waitForTimeout(100);

  await page.screenshot({ path: 'day_toast.png' });

  await browser.close();
})();

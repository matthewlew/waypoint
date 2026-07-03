const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000');

  // Setup trip
  await page.click('.setup-cta');

  await page.evaluate(() => {
    // Add item directly to day 1 for testing Day UI
    ITEMS[0].dayIds = [days[0].id];
    renderDays();
  });

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot3.png' });
  await browser.close();
  console.log("Done test3");
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordVideo: { dir: './videos/' } });
  const page = await context.newPage();

  // Test 1: Setup without strict inputs
  await page.goto('http://localhost:8000');
  await page.fill('#sName', 'Test Trip');
  await page.click('.setup-cta');

  // Wait for app to show
  await page.waitForSelector('.hdr-trip');

  // Test 2: Multi-context UI
  await page.click('text="Packing"');
  await page.waitForSelector('.add-card-btn');

  // Take screenshot
  await page.screenshot({ path: 'frontend-test.png' });

  // Close and record video
  await context.close();
  await browser.close();
  console.log('Playwright test completed.');
})();

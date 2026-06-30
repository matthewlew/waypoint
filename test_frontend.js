const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const path = require('path');
  const fileUrl = 'file://' + path.resolve('index.html');
  await page.goto(fileUrl);

  // Set up trip for Hawaii to trigger weather
  await page.fill('#sName', 'Beach Trip');

  // Need to add hawaii destination
  await page.evaluate(() => {
    document.querySelectorAll('.dest-row input')[0].value = 'Hawaii';
    document.querySelector('button.setup-cta').click();
  });

  await page.waitForTimeout(500);

  // Take screenshot of weather banner
  await page.screenshot({ path: 'test_weather.png' });

  // Go to Packing to drag an item
  await page.evaluate(() => document.querySelector('#nb-pack').click());
  await page.waitForTimeout(500);

  // Drag item from pack list onto day card
  // First, we need to show days and packing at same time, but they are in tabs...
  // In this app, only one tab is visible at a time. So dragging from packing to days isn't possible directly unless we change the UI or we drag onto bags!
  // Let's go to Packing view, set "By Bag", drag uncategorized item to a bag card.
  await page.evaluate(() => document.querySelectorAll('.vpill')[1].click()); // By Bag
  await page.waitForTimeout(500);

  // Take screenshot before dragging
  await page.screenshot({ path: 'test_drag_setup.png' });

  await browser.close();
  console.log("Playwright script finished.");
})();

const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000');

  // Setup trip
  await page.click('.setup-cta');

  await page.click('#nb-pack');

  await page.evaluate(() => {
    openEditItem('item-1');
  });

  await page.waitForTimeout(500);
  await page.screenshot({ path: 'screenshot2.png' });
  await browser.close();
  console.log("Done test2");
})();

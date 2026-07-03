const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000');

  // Setup trip
  await page.click('.setup-cta');

  // Edit first item via DOM evaluation to bypass overlay transitions
  await page.evaluate(() => {
    openEditItem('item-1');
  });

  await page.waitForTimeout(500); // wait for sheet render

  // Check first category logic and close
  await page.evaluate(() => {
    document.querySelector('#ei-name').value = 'Test Modified Item';
    saveEditItem();
  });

  await page.waitForTimeout(500);

  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
  console.log("Done test");
})();

const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/index.html');

  // Click setup button without filling dates
  await page.click('button.setup-cta');

  // Check if App loaded
  const hTrip = await page.locator('#hTrip').textContent();
  console.log("Trip Header:", hTrip);

  await browser.close();
})();

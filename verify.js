const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('http://localhost:8000');

  // Create a trip with no dates
  await page.click('button.setup-cta', { force: true });

  // Navigate to packing view
  await page.click('button#nb-pack', { force: true });

  // Need to open a category card first so items are visible in the DOM
  await page.waitForSelector('.card-hd', { state: 'attached' });
  await page.evaluate(() => {
    // Open the first category card
    const card = document.querySelector('.card-hd');
    if (card) card.click();
  });

  // Wait for the list row edit button and click it to open the edit item sheet
  await page.waitForSelector('.list-row .card-menu-btn', { state: 'attached' });
  await page.evaluate(() => {
    const btn = document.querySelector('.list-row .card-menu-btn');
    if (btn) btn.click();
  });

  // Wait for the overlay to appear
  await page.waitForSelector('#ovEditItem', { state: 'visible' });

  // Toggle a day chip
  await page.evaluate(() => {
    const dayChip = document.querySelector('#ei-days .vpill');
    if (dayChip) dayChip.click();
  });

  // Save the item
  await page.evaluate(() => {
    saveEditItem();
  });

  await page.waitForTimeout(500); // wait for save

  // Navigate back to days view
  await page.click('button#nb-days', { force: true });

  // Open the first day card
  await page.waitForSelector('.card-hd', { state: 'attached' });
  await page.evaluate(() => {
    // Open the first day card
    const card = document.querySelector('#sec-days .card-hd');
    if (card) card.click();
  });

  await page.waitForTimeout(500); // Wait for card expansion

  // Screenshot the days view to verify the packed item shows up
  await page.screenshot({ path: 'frontend_verification_screenshot2.png' });

  await browser.close();
})();

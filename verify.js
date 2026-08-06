const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
  const page = await context.newPage();

  await page.goto('http://localhost:8000/index.html');
  await page.waitForTimeout(1000);

  // Setup screen
  await page.fill('#sName', 'Mammoth Trip');
  await page.fill('#sDepD', '2024-12-25');
  await page.click('button.setup-cta');
  await page.waitForTimeout(1000);

  // Click on Pack navigation
  await page.click('#nb-pack', {force: true});
  await page.waitForTimeout(500);

  // Click on "By day" inside pack-wrap
  await page.click('.view-pills button:has-text("By day")', {force: true});
  await page.waitForTimeout(500);

  // Add an item to Day 1
  await page.evaluate(() => {
    // Open Day 1 card
    document.querySelector('#crd-day-d1 .card-hd').click();
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    document.querySelector('#crd-day-d1 .row-add').click();
  });
  await page.waitForTimeout(500);
  await page.fill('#ai-inp', 'Test Item');
  await page.click('button:has-text("Add item")', {force: true});
  await page.waitForTimeout(500);

  // Click on the new item to open Edit Item sheet
  await page.evaluate(() => {
    // Find the item text containing Test Item inside day 1
    const txts = Array.from(document.querySelectorAll('#crd-day-d1 .item-txt'));
    const t = txts.find(x => x.textContent.includes('Test Item'));
    if(t) t.click();
  });
  await page.waitForTimeout(500);

  // Toggle checkboxes in edit item using evaluate because of the custom label wrapping
  await page.evaluate(() => {
    const labels = Array.from(document.querySelectorAll('#ei-days label, #ei-bags label'));
    const bagLabel = labels.find(l => l.textContent.includes('Main bag'));
    if (bagLabel) bagLabel.click();
  });
  await page.click('text=Save item', {force: true});
  await page.waitForTimeout(500);

  // Go to bag view to see it there
  await page.click('.view-pills button:has-text("By bag")', {force: true});
  await page.waitForTimeout(500);

  // Open the card body for Main bag
  await page.evaluate(() => {
    document.querySelector('#crd-bag-main .card-hd').click();
  });
  await page.waitForTimeout(500);

  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
})();

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://localhost:8000');

  // Create trip
  await page.click('.setup-cta');
  await page.waitForTimeout(500);

  // Navigate to packing view
  await page.click('#nb-pack');
  await page.waitForTimeout(500);

  // Open first category card to make .row-add visible
  await page.evaluate(() => {
    const card = document.querySelector('.card-hd');
    if(card) card.click();
  });
  await page.waitForTimeout(500);

  // Add a new item
  await page.evaluate(() => {
    const addBtn = document.querySelector('.row-add');
    if(addBtn) addBtn.click();
  });
  await page.waitForTimeout(500);
  await page.fill('#ai-inp', 'Test Item');
  await page.evaluate(() => {
    const ctas = document.querySelectorAll('.sh-cta');
    const commitBtn = Array.from(ctas).find(el => el.textContent === 'Add item');
    if (commitBtn) commitBtn.click();
  });
  await page.waitForTimeout(500);

  // Open the card again as it might have closed on re-render
  await page.evaluate(() => {
    const card = document.querySelector('.card-hd');
    if(card) card.click();
  });
  await page.waitForTimeout(500);

  // Click on the item text to open edit
  await page.evaluate(() => {
    const item = Array.from(document.querySelectorAll('.item-txt')).find(el => el.textContent === 'Test Item');
    if(item) item.click();
  });
  await page.waitForTimeout(500);

  // Assign to day 1
  await page.evaluate(() => {
    const cb = document.querySelector('#ei-days input');
    if(cb) cb.click();
  });

  await page.screenshot({ path: 'packing_edit.png', fullPage: true });

  await browser.close();
})();

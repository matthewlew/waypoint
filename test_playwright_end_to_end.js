const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:8000/index.html');

  // Test flexible inputs: leave destination list empty or only partially filled
  await page.click('button.setup-cta');
  await page.waitForTimeout(500);

  // See if days got populated without specific destinations or with default ones
  const count = await page.locator('.card-num').count();
  console.log("Number of days generated without defaults:", count);

  // Add Item to a Day. Execute javascript directly to bypass visibility animations
  await page.evaluate(() => {
     toggleCard('d1');
  });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
     openAddItem('day','d1');
  });
  await page.waitForTimeout(500);

  await page.fill('#ai-inp', 'Test Item in Day 1');
  await page.click('.sh-cta:has-text("Add item")');
  await page.waitForTimeout(100);

  // Check Toast
  const toastClass = await page.locator('#toast').getAttribute('class');
  console.log("Day Toast visible:", toastClass.includes('show'));

  // Navigate to Packing
  await page.click('#nb-pack');
  await page.waitForTimeout(500);

  // Add Item to trigger toast directly
  await page.evaluate(() => {
     openAddItem('cat','skincare');
  });
  await page.waitForTimeout(500);

  await page.fill('#ai-inp', 'Test Item');
  // Click the specific CTA button to commit
  await page.click('.sh-cta:has-text("Add item")');
  await page.waitForTimeout(100);

  const toastClass2 = await page.locator('#toast').getAttribute('class');
  console.log("Pack Toast visible:", toastClass2.includes('show'));

  await browser.close();
})();

const { test, expect } = require('@playwright/test');

test('edit multi-context item check backpack', async ({ page }) => {
  await page.goto('file://' + __dirname + '/../index.html');

  // Wait for the app to initialize
  await page.waitForTimeout(500);

  // Skip the setup flow
  await page.evaluate(() => {
    document.getElementById('sName').value = 'Test Trip';
    go();
  });

  // Go to Packing Tab
  await page.click('button:has-text("Packing")');

  // Make sure we are in category view
  await page.click('button:has-text("By category")');

  await page.waitForTimeout(500);

  // Open the card body (the item list is hidden initially)
  await page.evaluate(() => {
     // Force open all cards
     document.querySelectorAll('.card-hd').forEach(c => c.classList.add('open'));
     document.querySelectorAll('.card-body').forEach(c => c.classList.add('open'));
     document.querySelectorAll('.chevron').forEach(c => c.classList.add('open'));
  });

  await page.waitForTimeout(500);

  // Click on the first item text in the list using page.evaluate to bypass visibility checks completely
  await page.evaluate(() => {
     document.querySelectorAll('.item-txt')[0].click();
  });

  await page.waitForTimeout(500);

  // Wait for the multi-select wrap to be visible
  await page.waitForSelector('#ei-days-wrap');

  // Use evaluate to avoid overlay clicking issues
  await page.evaluate(() => {
    document.getElementById('ei-days-wrap').querySelector('.who-chip').click();
    document.getElementById('ei-cats-wrap').querySelectorAll('.who-chip')[1].click(); // Hair
    document.getElementById('ei-bags-wrap').querySelectorAll('.who-chip')[1].click(); // Backpack
    document.getElementById('ei-purp-wrap').querySelectorAll('.who-chip')[2].click(); // Gear
  });

  await page.waitForTimeout(500);

  // Save Changes
  await page.evaluate(() => {
     commitEditItem();
  });

  await page.waitForTimeout(500);

  // Go to By Bag view
  await page.click('button:has-text("By bag")');
  await page.waitForTimeout(500);

  await page.evaluate(() => {
     document.querySelectorAll('.card-hd').forEach(c => c.classList.add('open'));
     document.querySelectorAll('.card-body').forEach(c => c.classList.add('open'));
  });
  await page.waitForTimeout(500);

  // Scroll to Backpack
  await page.evaluate(() => {
     document.getElementById('crd-bag-backpack').scrollIntoView();
  });
  await page.waitForTimeout(500);

  // Take screenshot of By Bag view scrolled
  await page.screenshot({ path: 'tests/verify_bag_scrolled.png' });
});

const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    // Navigate to local server
    await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
    console.log("Page loaded");

    // Click "Build Trip" to get past setup
    await page.click('button.setup-cta');
    console.log("Clicked Build Trip");

    // Give time to render
    await page.waitForTimeout(500);

    // Verify elements render
    const dayCard = await page.$('.card');
    if (dayCard) console.log("Day cards rendered");
    else throw new Error("Day cards not rendered");

    // Click "Packing" tab
    await page.click('#nb-pack');
    await page.waitForTimeout(500);

    // Check By day view
    const packCards = await page.$$('.card');
    if (packCards.length > 0) console.log("Pack cards rendered in By day view");
    else throw new Error("Pack cards not rendered");

    console.log("Basic UI and interactions tested successfully.");

  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();

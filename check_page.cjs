const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    const html = await page.content();
    console.log("HTML length:", html.length);
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();

const puppeteer = require('puppeteer');
(async () => {
  try {
    const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
    const page = await browser.newPage();
    page.on('requestfailed', request => {
      console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText, request.response()?.status());
    });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    await browser.close();
  } catch(e) {
    console.error(e);
  }
})();

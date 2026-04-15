const { chromium } = require('@playwright/test');
const path = require('path');

const BASE = 'http://localhost:3000';
const OUT = path.join(__dirname);

const pages = [
  { name: 'homepage', url: '/', fullPage: true },
  { name: 'stories-list', url: '/stories', fullPage: true },
  { name: 'authors-list', url: '/authors', fullPage: true },
  { name: 'collections-list', url: '/collections', fullPage: true },
  { name: 'search', url: '/search', fullPage: false },
  { name: 'admin-login', url: '/admin/login', fullPage: false },
  { name: 'admin-dashboard', url: '/admin/dashboard', fullPage: true },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await context.newPage();

  for (const { name, url, fullPage } of pages) {
    try {
      await pg.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 15000 });
      await pg.waitForTimeout(1500);
      await pg.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
      console.log(`✓ ${name}`);
    } catch (e) {
      console.error(`✗ ${name}: ${e.message.split('\n')[0]}`);
    }
  }

  // Try to capture a story reader page
  try {
    await pg.goto(`${BASE}/stories`, { waitUntil: 'networkidle', timeout: 10000 });
    await pg.waitForTimeout(800);
    const storyLink = await pg.$('article a');
    if (storyLink) {
      const href = await storyLink.getAttribute('href');
      if (href && href.startsWith('/stories/')) {
        await pg.goto(`${BASE}${href}`, { waitUntil: 'networkidle', timeout: 10000 });
        await pg.waitForTimeout(1500);
        await pg.screenshot({ path: path.join(OUT, 'story-reader.png'), fullPage: true });
        console.log('✓ story-reader');
      }
    }
  } catch (e) {
    console.error(`✗ story-reader: ${e.message.split('\n')[0]}`);
  }

  await browser.close();
  console.log('\nScreenshots saved to:', OUT);
})();

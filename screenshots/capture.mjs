import { chromium } from '@playwright/test';

const BASE = 'http://localhost:3000';
const OUT = 'C:/Users/hp/Desktop/projects/Kayd Archive/screenshots';

const pages = [
  { name: 'homepage', url: '/', fullPage: true },
  { name: 'stories-list', url: '/stories', fullPage: true },
  { name: 'authors-list', url: '/authors', fullPage: true },
  { name: 'collections-list', url: '/collections', fullPage: true },
  { name: 'search', url: '/search', fullPage: false },
  { name: 'admin-login', url: '/admin/login', fullPage: false },
];

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();

for (const { name, url, fullPage } of pages) {
  try {
    await page.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 15000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage });
    console.log(`✓ ${name}`);
  } catch (e) {
    console.error(`✗ ${name}: ${e.message}`);
  }
}

// Try to get a story page if any exist
try {
  await page.goto(`${BASE}/stories`, { waitUntil: 'networkidle', timeout: 10000 });
  await page.waitForTimeout(500);
  const storyLink = await page.$('article a[href^="/stories/"]');
  if (storyLink) {
    const href = await storyLink.getAttribute('href');
    await page.goto(`${BASE}${href}`, { waitUntil: 'networkidle', timeout: 10000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${OUT}/story-reader.png`, fullPage: true });
    console.log('✓ story-reader');
  }
} catch (e) {
  console.error(`✗ story-reader: ${e.message}`);
}

await browser.close();
console.log('\nAll screenshots saved to:', OUT);

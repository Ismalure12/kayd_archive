const { chromium } = require('@playwright/test');
const path = require('path');

const BASE = 'http://localhost:3000';
const OUT = __dirname;

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const pg = await context.newPage();

  // ── Public pages ──────────────────────────────────────────────
  const publicPages = [
    { name: 'homepage', url: '/', fullPage: true },
    { name: 'stories-list', url: '/stories', fullPage: true },
    { name: 'authors-list', url: '/authors', fullPage: true },
    { name: 'collections-list', url: '/collections', fullPage: true },
    { name: 'search', url: '/search?q=', fullPage: false },
    { name: 'admin-login', url: '/admin/login', fullPage: false },
  ];

  for (const { name, url, fullPage } of publicPages) {
    try {
      await pg.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 15000 });
      await pg.waitForTimeout(1000);
      await pg.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
      console.log(`✓ ${name}`);
    } catch (e) {
      console.error(`✗ ${name}: ${e.message.split('\n')[0]}`);
    }
  }

  // ── Story reader ──────────────────────────────────────────────
  try {
    await pg.goto(`${BASE}/stories`, { waitUntil: 'networkidle', timeout: 10000 });
    await pg.waitForTimeout(800);
    const storyLink = await pg.$('article a[href^="/stories/"]');
    if (storyLink) {
      const href = await storyLink.getAttribute('href');
      await pg.goto(`${BASE}${href}`, { waitUntil: 'networkidle', timeout: 10000 });
      await pg.waitForTimeout(1500);
      await pg.screenshot({ path: path.join(OUT, 'story-reader.png'), fullPage: true });
      console.log('✓ story-reader');
    }
  } catch (e) {
    console.error(`✗ story-reader: ${e.message.split('\n')[0]}`);
  }

  // ── Admin — login then capture ────────────────────────────────
  try {
    await pg.goto(`${BASE}/admin/login`, { waitUntil: 'networkidle', timeout: 10000 });
    await pg.fill('input[type="email"]', 'admin@kayd.so');
    await pg.fill('input[type="password"]', 'admin123');
    await pg.click('button[type="submit"]');
    await pg.waitForURL(`${BASE}/admin/dashboard`, { timeout: 10000 });
    await pg.waitForTimeout(4000); // wait for stats API fetch
    await pg.screenshot({ path: path.join(OUT, 'admin-dashboard.png'), fullPage: true });
    console.log('✓ admin-dashboard');

    const adminPages = [
      { name: 'admin-stories', url: '/admin/stories', fullPage: true },
      { name: 'admin-authors', url: '/admin/authors', fullPage: true },
      { name: 'admin-collections', url: '/admin/collections', fullPage: true },
      { name: 'admin-tags', url: '/admin/tags', fullPage: true },
      { name: 'admin-new-story', url: '/admin/stories/new', fullPage: true },
    ];

    for (const { name, url, fullPage } of adminPages) {
      await pg.goto(`${BASE}${url}`, { waitUntil: 'networkidle', timeout: 10000 });
      await pg.waitForTimeout(3000);
      await pg.screenshot({ path: path.join(OUT, `${name}.png`), fullPage });
      console.log(`✓ ${name}`);
    }
  } catch (e) {
    console.error(`✗ admin section: ${e.message.split('\n')[0]}`);
  }

  await browser.close();
  console.log('\nAll done. Screenshots in:', OUT);
})();

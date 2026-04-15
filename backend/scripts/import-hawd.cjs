/**
 * One-time import script: Ibraahin Hawd Yuusuf stories
 * Usage: node scripts/import-hawd.cjs
 */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const PDF_DIR = path.join(__dirname, '../../Ibraahin-Hawd');
const API = 'http://localhost:5000/api';
const PDFTOTEXT = 'pdftotext'; // in PATH via Git for Windows

// ── Helpers ────────────────────────────────────────────────────────────────

function extractText(pdfPath) {
  try {
    const text = execSync(`"${PDFTOTEXT}" "${pdfPath}" -`, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    return text;
  } catch (e) {
    console.warn(`  ⚠ pdftotext failed for ${path.basename(pdfPath)}: ${e.message.split('\n')[0]}`);
    return null;
  }
}

function textToHtml(text, authorName) {
  // Normalise line endings
  let t = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // Split into paragraphs (blank-line separated)
  const paragraphs = t.split(/\n{2,}/);

  const html = paragraphs
    .map(p => p.trim())
    .filter(p => {
      if (!p) return false;
      // Drop leading lines that are just the author name / repeated header
      const lower = p.toLowerCase().replace(/[^a-z]/g, '');
      const authorLower = authorName.toLowerCase().replace(/[^a-z]/g, '');
      if (lower === authorLower) return false;
      if (p.length < 3) return false;
      return true;
    })
    .map(p => {
      // Preserve internal single newlines as spaces
      const line = p.replace(/\n/g, ' ').trim();
      return `<p>${line}</p>`;
    })
    .join('\n');

  return html;
}

function cleanTitle(filename) {
  // Remove .pdf, replace underscores/hyphens with spaces, trim
  return filename
    .replace(/\.pdf$/i, '')
    .replace(/_/g, ' ')
    .trim();
}

async function apiPost(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('=== Ibraahin Hawd Yuusuf — Story Import ===\n');

  // 1. Login
  console.log('1. Logging in…');
  const loginRes = await apiPost('/admin/login', { email: 'admin@kayd.so', password: 'admin123' });
  if (!loginRes.success) {
    console.error('Login failed:', loginRes.error);
    process.exit(1);
  }
  const token = loginRes.data.token;
  console.log('   ✓ Token obtained\n');

  // 2. Create author
  console.log('2. Creating author…');
  const authorRes = await apiPost('/admin/authors', {
    name: 'Ibraahin Hawd Yuusuf',
    nameSomali: 'Ibraahin Hawd Yuusuf',
    bio: 'Qoraa Soomaali ah oo ka tirsan suugaanta Soomaalida. Wuxuu qoray sheekooyin, maqaallo iyo buugaag badan oo ku saabsan bulshada, dhaqanka iyo siyaasadda Soomaaliyeed.',
    slug: 'ibraahin-hawd-yuusuf',
  }, token);

  let authorId;
  if (authorRes.success) {
    authorId = authorRes.data.id;
    console.log(`   ✓ Author created: ${authorId}\n`);
  } else if (authorRes.error && authorRes.error.includes('already')) {
    // Already exists — fetch their ID
    const listRes = await fetch(`${API}/admin/authors?limit=100`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const list = await listRes.json();
    const existing = list.data?.find(a => a.slug === 'ibraahin-hawd-yuusuf');
    if (!existing) {
      console.error('Author exists but could not find ID:', authorRes.error);
      process.exit(1);
    }
    authorId = existing.id;
    console.log(`   ℹ Author already exists: ${authorId}\n`);
  } else {
    console.error('Author creation failed:', authorRes.error);
    process.exit(1);
  }

  // 3. Get all PDFs
  const pdfs = fs.readdirSync(PDF_DIR)
    .filter(f => f.toLowerCase().endsWith('.pdf'))
    .sort();

  console.log(`3. Processing ${pdfs.length} PDFs…\n`);

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const pdf of pdfs) {
    const pdfPath = path.join(PDF_DIR, pdf);
    const title = cleanTitle(pdf);

    process.stdout.write(`   [${created + skipped + failed + 1}/${pdfs.length}] ${title}… `);

    // Extract text
    const text = extractText(pdfPath);
    if (!text || text.trim().length < 50) {
      console.log('SKIP (no text)');
      skipped++;
      continue;
    }

    // Convert to HTML
    const content = textToHtml(text, 'Ibraahin Hawd Yuusuf');
    if (!content || content.length < 50) {
      console.log('SKIP (empty content)');
      skipped++;
      continue;
    }

    // Create story
    const storyRes = await apiPost('/admin/stories', {
      title,
      content,
      authorId,
      language: 'SOMALI',
      isPublished: true,
      tagIds: [],
    }, token);

    if (storyRes.success) {
      console.log('✓');
      created++;
    } else if (storyRes.error && storyRes.error.includes('already')) {
      console.log('(already exists)');
      skipped++;
    } else {
      console.log(`✗ ${storyRes.error}`);
      failed++;
    }

    // Small delay to avoid hammering the DB
    await new Promise(r => setTimeout(r, 100));
  }

  console.log(`
=== Done ===
  Created : ${created}
  Skipped : ${skipped}
  Failed  : ${failed}
  Total   : ${pdfs.length}
`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});

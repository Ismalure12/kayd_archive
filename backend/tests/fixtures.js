const STORY_HTML = `
<h2>Sheekada Tijaabada</h2>
<p>Nin dheer oo <strong>xoog leh</strong> ayaa socday.</p>
<blockquote><p>Nabad iyo caano.</p></blockquote>
<ul><li>Midda koowaad</li><li>Midda labaad</li></ul>
`;

const XSS_HTML = `
<p>Good content</p>
<script>alert('xss')</script>
<img src="x" onerror="alert('xss')">
<a href="javascript:void(0)">bad link</a>
`;

const AUTHOR_DATA = (slug) => ({
  name: 'Cabdiraxmaan Faarax',
  nameSomali: 'Cabdiraxmaan Faarax',
  slug,
  bio: 'Qoraa Soomaali ah oo caanka ah.',
  birthYear: 1970,
});

const STORY_DATA = (slug, authorId) => ({
  authorId,
  title: 'Sheekada Tijaabada',
  titleSomali: 'Sheekada Tijaabada',
  slug,
  description: 'Sheeko gaaban oo tijaabo ah.',
  content: STORY_HTML,
  language: 'SOMALI',
  isPublished: true,
});

module.exports = { STORY_HTML, XSS_HTML, AUTHOR_DATA, STORY_DATA };

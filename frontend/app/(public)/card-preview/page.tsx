// Temporary preview page — delete after choosing card styles
import { StoryCardB } from '@/components/reader/StoryCardB';
import { StoryCardC } from '@/components/reader/StoryCardC';
import { AuthorCardB } from '@/components/reader/AuthorCardB';
import { AuthorCardC } from '@/components/reader/AuthorCardC';
import { AuthorCardD } from '@/components/reader/AuthorCardD';

const MOCK_STORIES = [
  {
    slug: 'demo-story-1',
    title: 'Hooyo iyo Dhulka Hooyo',
    titleSomali: 'Hooyo iyo Dhulka Hooyo',
    excerpt: 'Hablihii ugu da\' yaryihiin ayaa weli xasuusta meesha ay laayihiin markii ay tageen. Hooyadood ayaa ku tiri: dhulkaan waxaa lagu noolaa…',
    readingTime: 8,
    language: 'SOMALI',
    tags: [
      { tag: { name: 'Family', slug: 'family' } },
      { tag: { name: 'Diaspora', slug: 'diaspora' } },
    ],
    author: { name: 'Fadumo Osman', slug: 'fadumo-osman' },
  },
  {
    slug: 'demo-story-2',
    title: 'The Last Camel',
    titleSomali: 'Gaylaha Dambe',
    excerpt: 'The last camel had not drunk in four days. Hassan knew this the way he knew the sky — without looking, without thinking, just knowing…',
    readingTime: 12,
    language: 'ENGLISH',
    tags: [
      { tag: { name: 'War', slug: 'war' } },
      { tag: { name: 'Pastoral', slug: 'pastoral' } },
    ],
    author: { name: 'Abdullahi Nur', slug: 'abdullahi-nur' },
  },
  {
    slug: 'demo-story-3',
    title: 'Letters from Hargeisa',
    titleSomali: undefined,
    excerpt: 'Dear Hargeisa, I am writing from a city that smells of snow and diesel. The children here have never seen a camel. I tell them about you anyway…',
    readingTime: 6,
    language: 'ENGLISH',
    tags: [
      { tag: { name: 'Poetry', slug: 'poetry' } },
    ],
    author: { name: 'Sahra Jama', slug: 'sahra-jama' },
  },
];

const MOCK_AUTHORS = [
  {
    slug: 'fadumo-osman',
    name: 'Fadumo Osman',
    nameSomali: 'Faadumo Cismaan',
    bio: 'Born in Mogadishu, raised in London. Her stories explore memory, migration, and the Somali diaspora experience with unflinching honesty.',
    _count: { stories: 7 },
  },
  {
    slug: 'abdullahi-nur',
    name: 'Abdullahi Nur',
    nameSomali: undefined,
    bio: 'A pastoral poet turned prose writer. His work draws on oral tradition and the landscapes of northern Somalia.',
    _count: { stories: 12 },
  },
  {
    slug: 'sahra-jama',
    name: 'Sahra Jama',
    nameSomali: 'Sacda Jaamac',
    bio: 'Poet and short story writer based in Minneapolis. Her debut collection won the 2022 Nomadic Voices Prize.',
    _count: { stories: 4 },
  },
  {
    slug: 'hassan-ali',
    name: 'Hassan Ali',
    nameSomali: undefined,
    bio: 'Writes in both Somali and English. Known for sharp, spare prose about urban life in Nairobi and Mogadishu.',
    _count: { stories: 9 },
  },
];

function Section({ label, note, children }: { label: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="mb-16">
      <div className="flex items-center gap-4 mb-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-terracotta" style={{ fontVariant: 'small-caps' }}>
          {label}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>
      {note && <p className="text-sm text-text-secondary mb-6">{note}</p>}
      {!note && <div className="mb-6" />}
      {children}
    </section>
  );
}

export default function CardPreviewPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <p className="text-xs text-terracotta font-medium uppercase tracking-widest mb-2">Preview</p>
        <h1 className="font-serif text-3xl font-bold text-text">Card Style Preview</h1>
        <p className="text-text-secondary mt-2">
          Story cards: Option C is live on the site. Choose B or C for author cards (or D as a third option).
        </p>
      </div>

      {/* Story cards — just showing B and C since A is deleted */}
      <Section
        label="Story Card — Option B (text-first, drop-cap initial)"
        note="No image required. Clean literary feel. Good for a text-heavy archive."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_STORIES.map((s) => <StoryCardB key={s.slug} story={s} />)}
        </div>
      </Section>

      <Section
        label="Story Card — Option C ✓ (currently live)"
        note="shadcn Card structure: tags → title → author rule → excerpt → footer with thumbnail."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_STORIES.map((s) => <StoryCardC key={s.slug} story={s} />)}
        </div>
      </Section>

      <div className="h-px bg-border mb-16" />

      {/* Author cards */}
      <Section
        label="Author Card — Option B (minimal / literary, square initial)"
        note="Horizontal layout, square initial block, story count in terracotta. Matches StoryCardB feel."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {MOCK_AUTHORS.map((a) => <AuthorCardB key={a.slug} author={a} />)}
        </div>
      </Section>

      <Section
        label="Author Card — Option C (shadcn Card, centered, circular initial)"
        note="Centered layout, large circular avatar, decorative rule, bio, story count footer. Matches StoryCardC feel."
      >
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {MOCK_AUTHORS.map((a) => <AuthorCardC key={a.slug} author={a} />)}
        </div>
      </Section>

      <Section
        label="Author Card — Option D (masthead / byline, terracotta header band)"
        note="Header band with overlapping circular avatar. Most distinctive of the three — editorial magazine feel."
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {MOCK_AUTHORS.map((a) => <AuthorCardD key={a.slug} author={a} />)}
        </div>
      </Section>
    </div>
  );
}

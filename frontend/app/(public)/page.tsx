import type { Metadata } from 'next';
import Link from 'next/link';
import { StoryRow } from '@/components/reader/StoryRow';
import { AuthorCard } from '@/components/reader/AuthorCard';
import { SearchBar } from '@/components/reader/SearchBar';

export const metadata: Metadata = {
  title: 'Kayd — Somali Literary Archive',
  description: 'Discover and preserve Somali short stories and literary works.',
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listStories } = require('@/lib/services/stories.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listAuthors } = require('@/lib/services/authors.service');

async function getData() {
  try {
    const [storiesData, authorsData] = await Promise.all([
      listStories({ page: 1, limit: 8, skip: 0 }),
      listAuthors({ page: 1, limit: 6, skip: 0 }),
    ]);
    return { stories: storiesData, authors: authorsData };
  } catch {
    return { stories: null, authors: null };
  }
}

export default async function HomePage() {
  const { stories, authors } = await getData();
  const storyList = stories?.stories || [];
  const authorList = authors?.authors || [];
  const totalStories = stories?.total || storyList.length;
  const totalAuthors = authors?.total || authorList.length;

  return (
    <div>
      {/* Hero — editorial two-column */}
      <section className="border-b border-ink py-12 pb-16">
        <div className="max-w-[1240px] mx-auto px-8 sm:px-6">
          <div
            className="hero-grid-responsive"
            style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'end' }}
          >
            {/* Left: Title */}
            <h1 className="font-display font-normal text-ink leading-[0.95] tracking-[-0.035em]"
              style={{ fontSize: 'clamp(56px, 10vw, 140px)' }}
            >
              An archive of<br />Somali{' '}
              <em className="italic text-accent-ink">short</em>
              <br />fiction.
            </h1>

            {/* Right: Lede + stats */}
            <div>
              <p className="font-body text-[18px] leading-[1.55] text-ink-2 max-w-[38ch] mb-4">
                Kayd gathers short stories written, transcribed, and translated across a century of Somali literary life — from pastoral parable to diaspora letter. Free to read. No account.
              </p>

              {/* Stats */}
              <div className="flex gap-8 pt-4 border-t border-rule font-mono text-[11px] tracking-[0.12em] uppercase text-ink-3">
                {[
                  { val: totalStories, label: 'stories' },
                  { val: totalAuthors, label: 'authors' },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div className="block font-display italic font-normal text-[28px] text-ink tracking-[-0.01em] mb-0.5">
                      {val}
                    </div>
                    {label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search + tag row */}
      <section className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-8">
        <SearchBar />
      </section>

      {/* Authors section */}
      {authorList.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-10">
          <div className="section-head">
            <h2>Authors</h2>
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-3">
              {totalAuthors} total
              <Link href="/authors" className="text-accent-ink ml-1">
                View all ⟶
              </Link>
            </div>
          </div>
          <div
            className="author-grid-responsive"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px 24px' }}
          >
            {authorList.slice(0, 6).map((author: any) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
        </section>
      )}

      {/* Stories section */}
      {storyList.length > 0 && (
        <section className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-16 pb-8">
          <div className="section-head">
            <h2>Stories</h2>
            <div className="flex items-center gap-4 font-mono text-[10px] tracking-[0.14em] uppercase text-ink-3">
              {totalStories} total
              <Link href="/stories" className="text-accent-ink ml-1">
                View all ⟶
              </Link>
            </div>
          </div>
          <div className="story-list">
            {storyList.map((story: any, i: number) => (
              <StoryRow key={story.slug} story={story} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {storyList.length === 0 && (
        <section className="max-w-[1240px] mx-auto px-8 sm:px-6 py-24 text-center">
          <div className="font-display text-[40px] italic text-ink-3 mb-3">
            The archive is being assembled.
          </div>
          <Link href="/admin/stories/new" className="btn" style={{ display: 'inline-flex' }}>
            Add first story ⟶
          </Link>
        </section>
      )}
    </div>
  );
}

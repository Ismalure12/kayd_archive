import type { Metadata } from 'next';
import { StoryRow } from '@/components/reader/StoryRow';
import { AuthorCard } from '@/components/reader/AuthorCard';
import { SearchBar } from '@/components/reader/SearchBar';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Somali stories and authors on Kayd.',
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { search: searchService } = require('@/lib/services/search.service');

async function search(q: string) {
  if (!q.trim()) return null;
  return await searchService(q);
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const q = sp.q || '';
  const results = q ? await search(q) : null;

  const hasResults =
    results && (results.stories?.length > 0 || results.authors?.length > 0);

  return (
    <div className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-12">
      <div className="mb-6">
        <div className="mono mb-3">Search</div>
        <h1
          className="font-display font-normal leading-[0.95] tracking-[-0.025em] mb-6"
          style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
        >
          Find{' '}
          <em className="italic text-accent-ink">anything</em>
        </h1>
        <SearchBar defaultValue={q} />
      </div>

      {q && !hasResults && (
        <div className="text-center py-16 font-body text-ink-2">
          No results for <strong>&ldquo;{q}&rdquo;</strong>.
        </div>
      )}

      {results?.stories?.length > 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-baseline mb-2 pb-3 border-b border-ink font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3">
            <span>Stories</span>
            <span>{results.stories.length} found</span>
          </div>
          <div className="story-list">
            {results.stories.map((story: any, i: number) => (
              <StoryRow key={story.slug} story={story} index={i} />
            ))}
          </div>
        </section>
      )}

      {results?.authors?.length > 0 && (
        <section className="mb-10">
          <div className="flex justify-between items-baseline mb-8 pb-3 border-b border-ink font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3">
            <span>Authors</span>
            <span>{results.authors.length} found</span>
          </div>
          <div
            className="author-grid-responsive"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 24px' }}
          >
            {results.authors.map((author: any) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
        </section>
      )}

      {!q && (
        <div className="text-center py-16 font-body italic text-ink-3">
          Type something to search stories and authors.
        </div>
      )}
    </div>
  );
}

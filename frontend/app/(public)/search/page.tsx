import type { Metadata } from 'next';
import { StoryCard } from '@/components/reader/StoryCard';
import { AuthorCard } from '@/components/reader/AuthorCard';
import { SearchBar } from '@/components/reader/SearchBar';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search Somali stories and authors on Kayd.',
};

async function search(q: string) {
  if (!q.trim()) return null;
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const res = await fetch(`${API}/search?q=${encodeURIComponent(q)}`, {
    next: { revalidate: 0 },
  });
  const json = await res.json();
  return json.success ? json.data : null;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-serif text-3xl font-bold text-text mb-6">Search</h1>

      <SearchBar defaultValue={q} className="max-w-2xl mb-8" />

      {q && !hasResults && (
        <div className="text-center py-16">
          <p className="text-text-secondary">
            No results for <strong>&ldquo;{q}&rdquo;</strong>.
          </p>
        </div>
      )}

      {results?.stories?.length > 0 && (
        <section className="mb-10">
          <h2 className="font-serif text-xl font-bold text-text mb-4">
            Stories ({results.stories.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.stories.map((story: any) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        </section>
      )}

      {results?.authors?.length > 0 && (
        <section>
          <h2 className="font-serif text-xl font-bold text-text mb-4">
            Authors ({results.authors.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {results.authors.map((author: any) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
        </section>
      )}

      {!q && (
        <div className="text-center py-16 text-text-secondary">
          <p>Type something to search stories and authors.</p>
        </div>
      )}
    </div>
  );
}

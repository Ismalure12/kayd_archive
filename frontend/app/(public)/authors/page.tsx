import type { Metadata } from 'next';
import { AuthorCard } from '@/components/reader/AuthorCard';
import { SearchBar } from '@/components/reader/SearchBar';
import { Pagination } from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Discover Somali authors in the Kayd archive.',
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listAuthors } = require('@/lib/services/authors.service');

async function getData(page: number, search?: string) {
  const limit = 12;
  const skip = (page - 1) * limit;
  const { authors, total } = await listAuthors({ page, limit, skip, search });
  return { data: authors, total, totalPages: Math.ceil(total / limit) };
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AuthorsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = parseInt(sp.page || '1');
  const data = await getData(page, sp.search);
  const total = data?.total || 0;

  return (
    <div className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-12">
      {/* Header */}
      <div className="mb-6">
        <div className="mono mb-3">The Writers</div>
        <h1
          className="font-display font-normal leading-[0.95] tracking-[-0.025em] mb-6"
          style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
        >
          All{' '}
          <em className="italic text-accent-ink">authors</em>
        </h1>
        <SearchBar placeholder="Search by name, era, or region…" />
      </div>

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="flex justify-between items-baseline mb-8 pb-3 border-b border-ink font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3">
            <span>Authors</span>
            <span>{total} total</span>
          </div>

          <div
            className="author-grid-responsive"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '48px 24px' }}
          >
            {data.data.map((author: any) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>

          <div className="py-10">
            <Pagination
              page={page}
              totalPages={data.totalPages || 1}
              buildHref={(p) => `/authors?page=${p}`}
            />
          </div>
        </>
      ) : (
        <div className="py-20 text-center">
          <div className="font-display text-[40px] italic text-ink-3">No authors found.</div>
        </div>
      )}
    </div>
  );
}

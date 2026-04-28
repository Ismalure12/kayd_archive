import type { Metadata } from 'next';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated collections of Somali stories on Kayd.',
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listCollections } = require('@/lib/services/collections.service');

async function getData(page: number) {
  const limit = 12;
  const skip = (page - 1) * limit;
  const { collections, total } = await listCollections({ page, limit, skip });
  return { data: collections, total, totalPages: Math.ceil(total / limit) };
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function CollectionsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = parseInt(sp.page || '1');
  const data = await getData(page);

  return (
    <div className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-12">
      <div className="mb-6">
        <div className="mono mb-3">The Archive</div>
        <h1
          className="font-display font-normal leading-[0.95] tracking-[-0.025em] mb-6"
          style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
        >
          All{' '}
          <em className="italic text-accent-ink">collections</em>
        </h1>
      </div>

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="flex justify-between items-baseline mb-8 pb-3 border-b border-ink font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3">
            <span>Collections</span>
            <span>{data.total} total</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((collection: any) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="bg-paper-2 border border-rule p-6 hover:bg-paper-3 transition-colors group no-underline"
              >
                {collection.isFeatured && (
                  <span className="inline-block font-mono text-[10px] text-accent-ink uppercase tracking-[0.12em] mb-2">
                    Featured
                  </span>
                )}
                <h2 className="font-display text-[22px] leading-[1.15] text-ink group-hover:text-accent-ink transition-colors">
                  {collection.title}
                </h2>
                {collection.titleSomali && collection.titleSomali !== collection.title && (
                  <p className="font-display italic text-[15px] text-ink-3 mt-1">
                    {collection.titleSomali}
                  </p>
                )}
                {collection.description && (
                  <p className="font-body text-[14px] text-ink-2 mt-2 leading-[1.5] line-clamp-3">
                    {collection.description}
                  </p>
                )}
                <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mt-4">
                  {collection._count?.stories || 0}{' '}
                  {(collection._count?.stories || 0) === 1 ? 'story' : 'stories'}
                </p>
              </Link>
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data.totalPages || 1}
            buildHref={(p) => `/collections?page=${p}`}
          />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="font-display italic text-[40px] text-ink-3">No collections yet.</p>
        </div>
      )}
    </div>
  );
}

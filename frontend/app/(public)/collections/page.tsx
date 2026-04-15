import type { Metadata } from 'next';
import Link from 'next/link';
import { Pagination } from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Collections',
  description: 'Curated collections of Somali stories on Kayd.',
};

async function getData(page: number) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const res = await fetch(`${API}/collections?page=${page}&limit=12`, {
    next: { revalidate: 300 },
  });
  const json = await res.json();
  return json;
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function CollectionsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = parseInt(sp.page || '1');
  const data = await getData(page);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-text">Collections</h1>
        <p className="text-text-secondary mt-2">
          Curated groupings of stories by theme, period, or style.
        </p>
      </div>

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.data.map((collection: any) => (
              <Link
                key={collection.slug}
                href={`/collections/${collection.slug}`}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow group"
              >
                {collection.isFeatured && (
                  <span className="inline-block text-xs text-terracotta font-medium uppercase tracking-wider mb-2">
                    Featured
                  </span>
                )}
                <h2 className="font-serif text-xl font-semibold text-text group-hover:text-terracotta transition-colors leading-snug">
                  {collection.title}
                </h2>
                {collection.titleSomali && collection.titleSomali !== collection.title && (
                  <p className="font-serif text-sm text-text-secondary mt-1">
                    {collection.titleSomali}
                  </p>
                )}
                {collection.description && (
                  <p className="text-sm text-text-secondary mt-2 leading-relaxed line-clamp-3">
                    {collection.description}
                  </p>
                )}
                <p className="text-xs text-muted mt-4">
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
          <p className="text-text-secondary">No collections yet.</p>
        </div>
      )}
    </div>
  );
}

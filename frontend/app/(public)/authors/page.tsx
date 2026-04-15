import type { Metadata } from 'next';
import { AuthorCard } from '@/components/reader/AuthorCard';
import { Pagination } from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Authors',
  description: 'Discover Somali authors in the Kayd archive.',
};

async function getData(page: number) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const res = await fetch(`${API}/authors?page=${page}&limit=12`, {
    next: { revalidate: 300 },
  });
  const json = await res.json();
  return json;
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function AuthorsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = parseInt(sp.page || '1');
  const data = await getData(page);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-text">Authors</h1>
        <p className="text-text-secondary mt-2">
          {data?.total || 0} authors in the archive
        </p>
      </div>

      {data?.data && data.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data.data.map((author: any) => (
              <AuthorCard key={author.slug} author={author} />
            ))}
          </div>
          <Pagination
            page={page}
            totalPages={data.totalPages || 1}
            buildHref={(p) => `/authors?page=${p}`}
          />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-secondary">No authors yet.</p>
        </div>
      )}
    </div>
  );
}

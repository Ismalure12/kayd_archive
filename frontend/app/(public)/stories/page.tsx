import type { Metadata } from 'next';
import { StoryCardC } from '@/components/reader/StoryCardC';
import { Pagination } from '@/components/ui/Pagination';
import { TagPill } from '@/components/reader/TagPill';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Browse the full collection of Somali short stories.',
};

async function getData(searchParams: Record<string, string>) {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const params = new URLSearchParams({
    page: searchParams.page || '1',
    limit: '12',
    ...(searchParams.tag && { tag: searchParams.tag }),
    ...(searchParams.language && { language: searchParams.language }),
  });

  const [storiesRes, tagsRes] = await Promise.all([
    fetch(`${API}/stories?${params}`, { next: { revalidate: 60 } }),
    fetch(`${API}/tags`, { next: { revalidate: 3600 } }),
  ]);

  const [stories, tags] = await Promise.all([storiesRes.json(), tagsRes.json()]);
  return { stories, tags };
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function StoriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { stories, tags } = await getData(sp);

  const page = parseInt(sp.page || '1');
  const totalPages = stories?.totalPages || 1;
  const activeTag = sp.tag;

  function buildHref(p: number) {
    const params = new URLSearchParams({ page: String(p) });
    if (activeTag) params.set('tag', activeTag);
    return `/stories?${params}`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-text">Stories</h1>
        <p className="text-text-secondary mt-2">
          {stories?.total || 0} stories in the archive
        </p>
      </div>

      {/* Tags filter */}
      {tags?.data && tags.data.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <a
            href="/stories"
            className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
              !activeTag
                ? 'bg-terracotta text-white'
                : 'bg-terracotta-light text-terracotta border border-terracotta/30 hover:bg-transparent hover:border-terracotta'
            }`}
          >
            All
          </a>
          {tags.data.map((tag: any) => (
            <a
              key={tag.slug}
              href={`/stories?tag=${tag.slug}`}
              className={`text-xs px-3 py-1 rounded-full font-medium transition-colors ${
                activeTag === tag.slug
                  ? 'bg-terracotta text-white'
                  : 'bg-terracotta-light text-terracotta border border-terracotta/30 hover:bg-transparent hover:border-terracotta'
              }`}
            >
              {tag.name}
            </a>
          ))}
        </div>
      )}

      {stories?.data && stories.data.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stories.data.map((story: any) => (
              <StoryCardC key={story.slug} story={story} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
        </>
      ) : (
        <div className="text-center py-20">
          <p className="text-text-secondary">No stories found.</p>
        </div>
      )}
    </div>
  );
}

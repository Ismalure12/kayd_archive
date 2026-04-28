import type { Metadata } from 'next';
import { StoryRow } from '@/components/reader/StoryRow';
import { SearchBar } from '@/components/reader/SearchBar';
import { Pagination } from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Stories',
  description: 'Browse the full collection of Somali short stories.',
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listStories } = require('@/lib/services/stories.service');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listTags } = require('@/lib/services/tags.service');

async function getData(searchParams: Record<string, string>) {
  const page = Math.max(1, parseInt(searchParams.page) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;

  const [storiesData, tagsData] = await Promise.all([
    listStories({
      page, limit, skip,
      tag: searchParams.tag,
      language: searchParams.language,
    }),
    listTags(),
  ]);

  return {
    stories: {
      data: storiesData.stories,
      total: storiesData.total,
      totalPages: Math.ceil(storiesData.total / limit),
    },
    tags: { data: tagsData },
  };
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
  const total = stories?.total || 0;

  function buildHref(p: number) {
    const params = new URLSearchParams({ page: String(p) });
    if (activeTag) params.set('tag', activeTag);
    return `/stories?${params}`;
  }

  return (
    <div className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-12">
      {/* Page header */}
      <div className="mb-6">
        <div className="mono mb-3">The Archive</div>
        <h1
          className="font-display font-normal leading-[0.95] tracking-[-0.025em] mb-6"
          style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
        >
          All{' '}
          <em className="italic text-accent-ink">stories</em>
        </h1>
        <SearchBar defaultValue={sp.q} />
      </div>

      {/* Tag filter */}
      {tags?.data && tags.data.length > 0 && (
        <div className="flex flex-wrap gap-2 py-4">
          <a href="/stories" className={'tag' + (!activeTag ? ' active' : '')}>
            All
          </a>
          {tags.data.map((tag: any) => (
            <a
              key={tag.slug}
              href={`/stories?tag=${tag.slug}`}
              className={'tag' + (activeTag === tag.slug ? ' active' : '')}
            >
              {tag.name}
            </a>
          ))}
        </div>
      )}

      {/* Story list */}
      {stories?.data && stories.data.length > 0 ? (
        <>
          <div className="flex justify-between items-baseline mb-2 pb-3 border-b border-ink font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3">
            <span>Stories</span>
            <span>{total} total</span>
          </div>
          <div className="story-list">
            {stories.data.map((story: any, i: number) => (
              <StoryRow
                key={story.slug}
                story={story}
                index={(page - 1) * 20 + i}
              />
            ))}
          </div>
          <div className="py-8">
            <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-ink-3">
          <div className="font-display text-[40px] italic mb-3">Nothing found.</div>
          <div className="font-mono text-[11px] tracking-[0.1em]">
            Try a different search term or remove some filters.
          </div>
        </div>
      )}
    </div>
  );
}

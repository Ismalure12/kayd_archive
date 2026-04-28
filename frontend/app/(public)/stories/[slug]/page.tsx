import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StoryRow } from '@/components/reader/StoryRow';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getStoryBySlug, listStories } = require('@/lib/services/stories.service');

async function getStory(slug: string) {
  try {
    return await getStoryBySlug(slug);
  } catch {
    return null;
  }
}

async function getMoreByAuthor(authorSlug: string, excludeSlug: string) {
  try {
    const { stories } = await listStories({ page: 1, limit: 10, skip: 0, authorSlug });
    return (stories as any[]).filter((s) => s.slug !== excludeSlug).slice(0, 3);
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: 'Story not found' };
  return {
    title: story.title,
    description: story.description || `Read "${story.title}" on Kayd Archive`,
  };
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();

  const moreStories = story.author
    ? await getMoreByAuthor(story.author.slug, slug)
    : [];

  const year = story.publishedDate
    ? new Date(story.publishedDate).getFullYear()
    : null;

  const langLabel =
    story.language === 'BOTH' ? 'SO · EN' :
    story.language === 'SOMALI' ? 'SO' : 'EN';

  const tagList = story.tags?.map((t: any) => t.tag.name).join(' · ') || '';

  return (
    <div>
      {/* Reader column */}
      <article className="reader">
        {/* Kicker */}
        <div className="mono mb-6 flex gap-4 items-center text-[11px]">
          {story.author && (
            <Link href={`/authors/${story.author.slug}`} className="text-accent-ink">
              {story.author.name}
            </Link>
          )}
          {year && <><span>·</span><span>{year}</span></>}
          {story.readingTime && <><span>·</span><span>{story.readingTime} min</span></>}
        </div>

        {/* Title */}
        <h1
          className="font-display font-normal text-ink leading-[0.98] tracking-[-0.025em] mb-4"
          style={{ fontSize: 'clamp(44px, 6vw, 76px)' }}
        >
          {story.title}
        </h1>

        {/* Somali title */}
        {story.titleSomali && story.titleSomali !== story.title && (
          <div className="font-display italic text-ink-3 text-[28px] mb-8">
            {story.titleSomali}
          </div>
        )}

        {/* Byline */}
        <div className="flex justify-between items-baseline py-4 border-t border-ink border-b mb-12">
          <div>
            <div className="mono mb-1 text-[10px]">By</div>
            {story.author && (
              <Link
                href={`/authors/${story.author.slug}`}
                className="font-display italic text-[20px] text-ink no-underline"
              >
                {story.author.name}
              </Link>
            )}
          </div>
          <div className="mono flex gap-4 text-[11px] text-ink-3">
            <span>{langLabel}</span>
            {tagList && <><span>·</span><span>{tagList}</span></>}
          </div>
        </div>

        {/* Story body — drop cap on first paragraph */}
        <div
          className="story-body"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* End ornament */}
        <div className="text-center font-mono text-[11px] tracking-[0.3em] text-ink-3 mt-12">
          ❦ · End · ❦
        </div>
      </article>

      {/* Author bio */}
      {story.author && (
        <div className="max-w-[720px] mx-auto px-6 pb-12">
          <div className="border-t border-rule pt-8 flex gap-4 items-start">
            {/* Portrait */}
            <div className="portrait shrink-0" style={{ width: '60px', height: '78px' }}>
              <div className="portrait-initials" style={{ fontSize: '20px' }}>
                {story.author.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>
            </div>
            <div>
              <Link
                href={`/authors/${story.author.slug}`}
                className="font-display text-[20px] text-ink no-underline block mb-1.5"
              >
                {story.author.name}
              </Link>
              {story.author.bio && (
                <p className="font-body text-[15px] text-ink-2 leading-[1.6] mb-2">
                  {story.author.bio}
                </p>
              )}
              <Link href={`/authors/${story.author.slug}`} className="mono text-accent-ink text-[10px]">
                All stories ⟶
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* More from this author */}
      {moreStories.length > 0 && story.author && (
        <section className="border-t border-rule bg-paper-2">
          <div className="max-w-[1240px] mx-auto px-8 sm:px-6 py-12">
            <div className="section-head">
              <h2 className="font-display text-[24px] font-normal">
                More by {story.author.name}
              </h2>
              <Link href={`/authors/${story.author.slug}`} className="mono text-accent-ink text-[10px]">
                View profile ⟶
              </Link>
            </div>
            <div className="story-list">
              {moreStories.map((s: any, i: number) => (
                <StoryRow key={s.slug} story={{ ...s, author: story.author }} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

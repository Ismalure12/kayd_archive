import Link from 'next/link';

interface Story {
  slug: string;
  title: string;
  titleSomali?: string;
  excerpt?: string;
  description?: string;
  readingTime?: number;
  publishedDate?: string;
  language?: string;
  author?: { name: string; slug: string };
  tags?: { tag: { name: string; slug: string } }[];
}

interface StoryRowProps {
  story: Story;
  index: number;
}

export function StoryRow({ story, index }: StoryRowProps) {
  const excerpt = story.excerpt || story.description || '';
  const year = story.publishedDate
    ? new Date(story.publishedDate).getFullYear()
    : null;

  const langLabel =
    story.language === 'BOTH' ? 'SO · EN' :
    story.language === 'SOMALI' ? 'SO' :
    story.language === 'ENGLISH' ? 'EN' : null;

  return (
    <Link href={`/stories/${story.slug}`} className="story-row block">
      {/* Number */}
      <div className="font-mono text-[11px] tracking-[0.1em] text-ink-3 pt-1.5">
        №{String(index + 1).padStart(2, '0')}
      </div>

      {/* Title + excerpt + tags */}
      <div>
        <div className="font-display text-[26px] leading-[1.05] tracking-[-0.01em] text-ink">
          {story.title}
        </div>
        {story.titleSomali && story.titleSomali !== story.title && (
          <div className="font-display italic text-ink-3 text-[17px] mt-0.5 tracking-normal">
            {story.titleSomali}
          </div>
        )}
        {excerpt && (
          <p className="mt-2 text-ink-2 font-body text-[15px] leading-[1.5] max-w-[62ch]">
            {excerpt}
          </p>
        )}
        {(langLabel || (story.tags && story.tags.length > 0)) && (
          <div className="flex flex-wrap gap-2 mt-2.5">
            {langLabel && <span className="tag lang">{langLabel}</span>}
            {story.tags?.slice(0, 3).map(({ tag }) => (
              <Link key={tag.slug} href={`/stories?tag=${tag.slug}`} className="tag">
                {tag.name}
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Author column */}
      <div className="story-row-author font-body text-[14px] text-ink-2 italic">
        {story.author?.name}
        {year && (
          <span className="block not-italic font-mono text-[10px] tracking-[0.1em] text-ink-3 uppercase mt-1">
            {year}
          </span>
        )}
      </div>

      {/* Read time */}
      <div className="story-row-read font-mono text-[10px] tracking-[0.1em] uppercase text-ink-3 text-right">
        {story.readingTime ? `${story.readingTime} min` : ''}
      </div>
    </Link>
  );
}

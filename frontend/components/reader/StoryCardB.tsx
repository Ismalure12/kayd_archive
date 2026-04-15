// Option B — Minimal / Literary (text-first, no image required)
// Drop-cap initial, generous type, print-journal feel
import Link from 'next/link';

interface Story {
  slug: string;
  title: string;
  titleSomali?: string;
  excerpt?: string;
  readingTime?: number;
  author?: { name: string; slug: string };
  tags?: { tag: { name: string; slug: string } }[];
}

export function StoryCardB({ story }: { story: Story }) {
  const initial = story.title[0].toUpperCase();

  return (
    <article className="group bg-card border border-border p-6 flex flex-col gap-4 hover:shadow-sm transition-shadow duration-150">
      <div className="flex gap-4 items-start">
        {/* Drop-cap initial */}
        <div
          className="shrink-0 w-14 h-14 flex items-center justify-center bg-terracotta/10 border border-terracotta/20"
          aria-hidden
        >
          <span className="font-serif text-3xl font-bold text-terracotta leading-none">
            {initial}
          </span>
        </div>

        {/* Title block */}
        <div className="flex-1 min-w-0">
          <Link href={`/stories/${story.slug}`}>
            <h3 className="font-serif text-lg font-bold text-text leading-snug group-hover:text-terracotta transition-colors line-clamp-2">
              {story.title}
            </h3>
          </Link>
          {story.titleSomali && story.titleSomali !== story.title && (
            <p className="font-serif text-sm text-text-secondary italic mt-0.5 line-clamp-1">
              {story.titleSomali}
            </p>
          )}
        </div>
      </div>

      {/* Excerpt */}
      {story.excerpt && (
        <p className="text-sm text-text-secondary leading-[1.75] line-clamp-2 pl-[4.5rem]">
          {story.excerpt}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center gap-3 pt-3 border-t border-border mt-auto">
        {story.author && (
          <Link
            href={`/authors/${story.author.slug}`}
            className="text-xs font-semibold text-terracotta hover:text-text transition-colors uppercase tracking-wider shrink-0"
            style={{ fontVariant: 'small-caps' }}
          >
            {story.author.name}
          </Link>
        )}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 min-w-0">
            {story.tags.slice(0, 2).map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/stories?tag=${tag.slug}`}
                className="text-[10px] px-2 py-0.5 rounded-sm bg-bg border border-border text-muted hover:text-terracotta hover:border-terracotta transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}
        {story.readingTime && (
          <span className="text-xs text-muted ml-auto shrink-0">{story.readingTime} min</span>
        )}
      </div>
    </article>
  );
}

import Link from 'next/link';
import Image from 'next/image';

interface Story {
  slug: string;
  title: string;
  titleSomali?: string;
  description?: string;
  coverImageUrl?: string;
  readingTime?: number;
  language?: string;
  author?: {
    name: string;
    nameSomali?: string;
    slug: string;
    photoUrl?: string;
  };
  tags?: { tag: { name: string; slug: string } }[];
}

export function StoryCard({ story }: { story: Story }) {
  return (
    <article className="bg-card border border-border flex flex-col hover:shadow-sm transition-shadow">
      {story.coverImageUrl && (
        <Link href={`/stories/${story.slug}`} className="block aspect-[16/9] overflow-hidden">
          <Image
            src={story.coverImageUrl}
            alt={story.title}
            width={640}
            height={360}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </Link>
      )}

      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Tags */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {story.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/stories?tag=${tag.slug}`}
                className="text-xs px-2.5 py-0.5 rounded-full border border-terracotta text-terracotta hover:bg-terracotta/10 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div>
          <Link href={`/stories/${story.slug}`}>
            <h3 className="font-serif text-lg font-semibold text-text leading-snug hover:text-terracotta transition-colors line-clamp-2">
              {story.title}
            </h3>
          </Link>
          {story.titleSomali && story.titleSomali !== story.title && (
            <p className="text-sm text-text-secondary font-serif mt-0.5 italic">{story.titleSomali}</p>
          )}
        </div>

        {story.description && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {story.description}
          </p>
        )}

        {/* Author + reading time — small-caps style */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          {story.author ? (
            <Link
              href={`/authors/${story.author.slug}`}
              className="text-xs font-medium text-text-secondary hover:text-terracotta transition-colors tracking-wide uppercase"
              style={{ fontVariant: 'small-caps' }}
            >
              {story.author.name}
            </Link>
          ) : (
            <span />
          )}
          {story.readingTime && (
            <span className="text-xs text-muted">{story.readingTime} min</span>
          )}
        </div>
      </div>
    </article>
  );
}

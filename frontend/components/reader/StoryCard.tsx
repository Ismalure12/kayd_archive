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
    <article className="bg-paper-2 border border-rule flex flex-col hover:bg-paper-3 transition-colors">
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
              <Link key={tag.slug} href={`/stories?tag=${tag.slug}`} className="tag">
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        <div>
          <Link href={`/stories/${story.slug}`}>
            <h3 className="font-display text-[20px] leading-[1.15] text-ink hover:text-accent-ink transition-colors line-clamp-2">
              {story.title}
            </h3>
          </Link>
          {story.titleSomali && story.titleSomali !== story.title && (
            <p className="font-display italic text-[14px] text-ink-3 mt-0.5">{story.titleSomali}</p>
          )}
        </div>

        {story.description && (
          <p className="font-body text-[14px] text-ink-2 leading-[1.5] line-clamp-2">
            {story.description}
          </p>
        )}

        {/* Author + reading time */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-rule">
          {story.author ? (
            <Link
              href={`/authors/${story.author.slug}`}
              className="font-mono text-[10px] text-ink-2 hover:text-accent-ink transition-colors tracking-[0.12em] uppercase"
            >
              {story.author.name}
            </Link>
          ) : (
            <span />
          )}
          {story.readingTime && (
            <span className="font-mono text-[10px] text-ink-3">{story.readingTime} min</span>
          )}
        </div>
      </div>
    </article>
  );
}

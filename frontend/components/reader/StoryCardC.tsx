// Option C — shadcn Card base, structured layout
// Tags top, title + author rule, excerpt body, small thumbnail + meta footer
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';

interface Story {
  slug: string;
  title: string;
  titleSomali?: string;
  excerpt?: string;
  coverImageUrl?: string;
  readingTime?: number;
  language?: string;
  author?: { name: string; slug: string; photoUrl?: string };
  tags?: { tag: { name: string; slug: string } }[];
}

export function StoryCardC({ story }: { story: Story }) {
  return (
    <Card className="group flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="gap-3">
        {/* Tags row */}
        {story.tags && story.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {story.tags.slice(0, 3).map(({ tag }) => (
              <Link
                key={tag.slug}
                href={`/stories?tag=${tag.slug}`}
                className="text-[10px] font-semibold uppercase tracking-widest text-terracotta hover:text-text transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/stories/${story.slug}`}>
          <h3 className="font-serif text-xl font-bold text-text leading-snug group-hover:text-terracotta transition-colors line-clamp-2">
            {story.title}
          </h3>
        </Link>

        {/* Author line with rule */}
        {story.author && (
          <div className="flex items-center gap-3">
            <Link
              href={`/authors/${story.author.slug}`}
              className="text-xs font-medium text-text-secondary hover:text-text transition-colors uppercase tracking-widest shrink-0"
              style={{ fontVariant: 'small-caps' }}
            >
              {story.author.name}
            </Link>
            <div className="flex-1 h-px bg-border" />
          </div>
        )}
      </CardHeader>

      <CardContent className="flex-1">
        {story.excerpt && (
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {story.excerpt}
          </p>
        )}
      </CardContent>

      <CardFooter className="gap-3 border-t border-border pt-4">
        {/* Small thumbnail */}
        {story.coverImageUrl ? (
          <Link href={`/stories/${story.slug}`} className="shrink-0">
            <Image
              src={story.coverImageUrl}
              alt={story.title}
              width={52}
              height={52}
              className="w-13 h-13 object-cover"
            />
          </Link>
        ) : (
          <div className="w-10 h-10 shrink-0 bg-terracotta/10 flex items-center justify-center">
            <span className="font-serif text-lg font-bold text-terracotta">{story.title[0]}</span>
          </div>
        )}

        <div className="flex flex-col gap-0.5 min-w-0">
          {story.readingTime && (
            <span className="text-xs text-muted">{story.readingTime} min read</span>
          )}
          {story.language && (
            <span className="text-xs text-muted capitalize">{story.language.toLowerCase()}</span>
          )}
        </div>

        <Link
          href={`/stories/${story.slug}`}
          className="ml-auto text-xs font-medium text-terracotta border border-terracotta px-3 py-1.5 hover:bg-transparent transition-colors shrink-0"
        >
          Read →
        </Link>
      </CardFooter>
    </Card>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { StoryCard } from '@/components/reader/StoryCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getStory(slug: string) {
  const res = await fetch(`${API}/stories/${slug}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.success ? json.data : null;
}

async function getMoreByAuthor(authorSlug: string, excludeSlug: string) {
  const res = await fetch(`${API}/stories?limit=6`, { next: { revalidate: 300 } });
  const json = await res.json();
  if (!json.success) return [];
  return (json.data as any[]).filter((s) => s.slug !== excludeSlug && s.author?.slug === authorSlug).slice(0, 3);
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

  const authorInitials = story.author?.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div>
      {/* Story header — full width */}
      <div className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-muted mb-6 font-sans">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link href="/stories" className="hover:text-text transition-colors">Stories</Link>
            {story.tags?.[0] && (
              <>
                <span>/</span>
                <Link href={`/stories?tag=${story.tags[0].tag.slug}`} className="hover:text-text transition-colors">
                  {story.tags[0].tag.name}
                </Link>
              </>
            )}
          </nav>

          {/* Tags */}
          {story.tags && story.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {story.tags.map(({ tag }: any) => (
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

          {/* Title */}
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-text leading-tight mb-2">
            {story.title}
          </h1>
          {story.titleSomali && story.titleSomali !== story.title && (
            <p className="font-serif text-xl text-text-secondary italic mb-4">{story.titleSomali}</p>
          )}
          {story.description && (
            <p className="text-lg text-text-secondary leading-relaxed mb-6">
              {story.description}
            </p>
          )}

          {/* Separator */}
          <div className="h-px bg-border mb-6" />

          {/* Author attribution — small-caps */}
          <div className="flex items-center justify-between">
            {story.author && (
              <Link href={`/authors/${story.author.slug}`} className="flex items-center gap-3 group">
                {story.author.photoUrl ? (
                  <Image
                    src={story.author.photoUrl}
                    alt={story.author.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-terracotta flex items-center justify-center text-white font-serif text-xs font-semibold">
                    {authorInitials}
                  </div>
                )}
                <span
                  className="text-sm font-medium text-terracotta group-hover:underline tracking-wide"
                  style={{ fontVariant: 'small-caps' }}
                >
                  {story.author.name}
                </span>
              </Link>
            )}
            <div className="flex items-center gap-3 text-xs text-muted">
              {story.readingTime && <span>{story.readingTime} min read</span>}
              {story.language && (
                <span className="capitalize">{story.language.toLowerCase()}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {story.coverImageUrl && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
          <Image
            src={story.coverImageUrl}
            alt={story.title}
            width={680}
            height={382}
            className="w-full object-cover"
          />
        </div>
      )}

      {/* Story content — 680px measure, drop cap on first paragraph */}
      <article className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        <div
          className="story-body prose prose-lg max-w-none
            prose-headings:font-serif prose-headings:text-text
            prose-p:text-text prose-p:leading-[1.8]
            prose-a:text-terracotta prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-terracotta prose-blockquote:text-text-secondary
            prose-strong:text-text"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* End ornament */}
        <div className="mt-12 text-center">
          <span className="text-terracotta text-xl">✦</span>
        </div>
      </article>

      {/* Author bio card */}
      {story.author && (
        <div className="max-w-2xl mx-auto px-4 sm:px-6 pb-10">
          <div className="border-l-4 border-terracotta bg-card p-5 rounded-r-lg">
            <div className="flex items-start gap-4">
              {story.author.photoUrl ? (
                <Image
                  src={story.author.photoUrl}
                  alt={story.author.name}
                  width={48}
                  height={48}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-terracotta flex items-center justify-center text-white font-serif font-semibold shrink-0">
                  {authorInitials}
                </div>
              )}
              <div>
                <Link href={`/authors/${story.author.slug}`}>
                  <p className="font-serif font-semibold text-text hover:text-terracotta transition-colors">
                    {story.author.name}
                  </p>
                </Link>
                {story.author.bio && (
                  <p className="text-sm text-text-secondary mt-1 leading-relaxed">
                    {story.author.bio}
                  </p>
                )}
                <Link
                  href={`/authors/${story.author.slug}`}
                  className="text-xs text-terracotta hover:underline mt-2 inline-block"
                >
                  More stories →
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* More by this author */}
      {moreStories.length > 0 && story.author && (
        <section className="border-t border-border bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex items-center gap-4 mb-8">
              <span className="text-xs font-medium uppercase tracking-widest text-terracotta" style={{ fontVariant: 'small-caps' }}>
                More by {story.author.name}
              </span>
              <div className="flex-1 h-px bg-border" />
              <Link href={`/authors/${story.author.slug}`} className="text-sm text-terracotta hover:underline whitespace-nowrap">
                View profile →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {moreStories.map((s: any) => (
                <StoryCard key={s.slug} story={s} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StoryRow } from '@/components/reader/StoryRow';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getCollectionBySlug } = require('@/lib/services/collections.service');

async function getCollection(slug: string) {
  try {
    return await getCollectionBySlug(slug);
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) return { title: 'Collection not found' };
  return {
    title: collection.title,
    description: collection.description || `Stories in the "${collection.title}" collection`,
  };
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) notFound();

  const publishedStories = collection.stories
    ?.filter((cs: any) => cs.story.isPublished)
    .map((cs: any) => cs.story) || [];

  return (
    <div>
      {/* Header */}
      <div className="bg-paper-2 border-b border-rule">
        <div className="max-w-[1240px] mx-auto px-8 sm:px-6 py-10">
          <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mb-6">
            <Link href="/" className="hover:text-ink transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-ink transition-colors">Collections</Link>
          </nav>

          {collection.isFeatured && (
            <span className="inline-block font-mono text-[10px] text-accent-ink uppercase tracking-[0.12em] mb-2">
              Featured Collection
            </span>
          )}

          <h1 className="font-display text-[40px] leading-[1.05] tracking-[-0.02em] font-normal text-ink">
            {collection.title}
          </h1>
          {collection.titleSomali && collection.titleSomali !== collection.title && (
            <p className="font-display italic text-[22px] text-ink-3 mt-1">{collection.titleSomali}</p>
          )}
          {collection.description && (
            <p className="font-body text-[17px] text-ink-2 mt-3 leading-[1.6] max-w-[56ch]">
              {collection.description}
            </p>
          )}
          <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-ink-3 mt-3">
            {publishedStories.length}{' '}
            {publishedStories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-8 sm:px-6 py-10">
        {publishedStories.length > 0 ? (
          <div className="story-list">
            {publishedStories.map((story: any, i: number) => (
              <StoryRow key={story.slug} story={story} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display italic text-[32px] text-ink-3">No published stories yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

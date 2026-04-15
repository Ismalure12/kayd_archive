import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StoryCard } from '@/components/reader/StoryCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getCollection(slug: string) {
  const res = await fetch(`${API}/collections/${slug}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.success ? json.data : null;
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
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-6">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link href="/collections" className="hover:text-text transition-colors">Collections</Link>
          </nav>

          {collection.isFeatured && (
            <span className="inline-block text-xs text-terracotta font-medium uppercase tracking-wider mb-2">
              Featured Collection
            </span>
          )}

          <h1 className="font-serif text-3xl font-bold text-text">{collection.title}</h1>
          {collection.titleSomali && collection.titleSomali !== collection.title && (
            <p className="font-serif text-xl text-text-secondary mt-1">{collection.titleSomali}</p>
          )}
          {collection.description && (
            <p className="text-text-secondary mt-3 leading-relaxed max-w-2xl">
              {collection.description}
            </p>
          )}
          <p className="text-sm text-muted mt-3">
            {publishedStories.length}{' '}
            {publishedStories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {publishedStories.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {publishedStories.map((story: any) => (
              <StoryCard key={story.slug} story={story} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-secondary">No published stories in this collection yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

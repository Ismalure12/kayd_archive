import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { StoryCard } from '@/components/reader/StoryCard';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function getAuthor(slug: string) {
  const res = await fetch(`${API}/authors/${slug}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  const json = await res.json();
  return json.success ? json.data : null;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) return { title: 'Author not found' };
  return {
    title: author.name,
    description: author.bio || `Stories by ${author.name} on Kayd Archive`,
  };
}

export default async function AuthorPage({ params }: PageProps) {
  const { slug } = await params;
  const author = await getAuthor(slug);
  if (!author) notFound();

  const initials = author.name
    .split(' ')
    .map((n: string) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div>
      {/* Author header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <nav className="flex items-center gap-2 text-sm text-muted mb-6">
            <Link href="/" className="hover:text-text transition-colors">Home</Link>
            <span>/</span>
            <Link href="/authors" className="hover:text-text transition-colors">Authors</Link>
          </nav>

          <div className="flex items-start gap-6">
            {author.photoUrl ? (
              <Image
                src={author.photoUrl}
                alt={author.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-terracotta flex items-center justify-center text-white font-serif text-2xl font-bold shrink-0">
                {initials}
              </div>
            )}

            <div>
              <h1 className="font-serif text-3xl font-bold text-text">{author.name}</h1>
              {author.nameSomali && author.nameSomali !== author.name && (
                <p className="font-serif text-lg text-text-secondary">{author.nameSomali}</p>
              )}
              {author.bio && (
                <p className="text-text-secondary mt-3 leading-relaxed max-w-2xl">{author.bio}</p>
              )}
              <p className="text-sm text-muted mt-3">
                {author.stories?.length || 0} published{' '}
                {(author.stories?.length || 0) === 1 ? 'story' : 'stories'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {author.stories && author.stories.length > 0 ? (
          <>
            <h2 className="font-serif text-xl font-bold text-text mb-6">Stories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {author.stories.map((story: any) => (
                <StoryCard key={story.slug} story={{ ...story, author }} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-text-secondary">No published stories yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

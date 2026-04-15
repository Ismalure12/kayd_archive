import type { Metadata } from 'next';
import Link from 'next/link';
import { StoryCardC } from '@/components/reader/StoryCardC';
import { AuthorCard } from '@/components/reader/AuthorCard';
import { SearchBar } from '@/components/reader/SearchBar';

export const metadata: Metadata = {
  title: 'Kayd — Somali Literary Archive',
  description: 'Discover and preserve Somali short stories and literary works.',
};

async function getData() {
  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const [storiesRes, authorsRes] = await Promise.all([
      fetch(`${API}/stories?limit=6`, { next: { revalidate: 300 } }),
      fetch(`${API}/authors?limit=4`, { next: { revalidate: 300 } }),
    ]);
    const [stories, authors] = await Promise.all([storiesRes.json(), authorsRes.json()]);
    return { stories, authors };
  } catch {
    return { stories: null, authors: null };
  }
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-8">
      <span className="text-xs font-medium uppercase tracking-widest text-terracotta" style={{ fontVariant: 'small-caps' }}>
        {children}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  );
}

export default async function HomePage() {
  const { stories, authors } = await getData();
  const featuredStory = stories?.data?.[0];
  const remainingStories = stories?.data?.slice(1) || [];

  return (
    <div>
      {/* Hero — one featured story */}
      <section className="border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="max-w-3xl">
            <p className="text-xs font-medium uppercase tracking-widest text-terracotta mb-6" style={{ fontVariant: 'small-caps' }}>
              Somali Literary Archive
            </p>

            {featuredStory ? (
              <>
                <Link href={`/stories/${featuredStory.slug}`}>
                  <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight mb-4 hover:text-terracotta transition-colors">
                    {featuredStory.title}
                  </h1>
                </Link>
                {featuredStory.description && (
                  <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-6 max-w-2xl">
                    {featuredStory.description}
                  </p>
                )}
                <div className="flex items-center gap-6">
                  <Link
                    href={`/stories/${featuredStory.slug}`}
                    className="inline-flex items-center gap-2 px-6 py-3 border border-terracotta text-terracotta rounded-lg text-sm font-medium hover:bg-transparent transition-colors"
                  >
                    Read Story
                  </Link>
                  {featuredStory.author && (
                    <Link
                      href={`/authors/${featuredStory.author.slug}`}
                      className="text-sm text-text-secondary hover:text-text transition-colors tracking-wide"
                      style={{ fontVariant: 'small-caps' }}
                    >
                      {featuredStory.author.name}
                    </Link>
                  )}
                </div>
              </>
            ) : (
              <>
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-text leading-tight mb-6">
                  Somali stories,<br />preserved.
                </h1>
                <p className="text-lg sm:text-xl text-text-secondary leading-relaxed mb-8 max-w-2xl">
                  Kayd collects and preserves Somali short stories — from diaspora voices to
                  classic literature. Read freely, explore deeply.
                </p>
                <div className="flex items-center gap-4">
                  <Link
                    href="/stories"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-terracotta text-white border border-transparent rounded-lg text-sm font-medium hover:bg-transparent hover:border-terracotta hover:text-terracotta transition-colors"
                  >
                    Browse Stories
                  </Link>
                  <Link
                    href="/collections"
                    className="text-sm text-terracotta hover:underline"
                  >
                    Explore Collections →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Search bar */}
      <section className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SearchBar className="max-w-2xl" placeholder="Search stories, authors, tags…" />
        </div>
      </section>

      {/* Recent Stories */}
      {remainingStories.length > 0 && (
        <section className="border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>From the Archive</SectionLabel>
            </div>
            <div className="flex justify-end -mt-8 mb-8">
              <Link href="/stories" className="text-sm text-terracotta hover:underline">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {remainingStories.map((story: any) => (
                <StoryCardC key={story.slug} story={story} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Author Spotlight */}
      {authors?.data && authors.data.length > 0 && (
        <section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-2">
              <SectionLabel>Authors</SectionLabel>
            </div>
            <div className="flex justify-end -mt-8 mb-8">
              <Link href="/authors" className="text-sm text-terracotta hover:underline">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authors.data.slice(0, 4).map((author: any) => (
                <AuthorCard key={author.slug} author={author} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

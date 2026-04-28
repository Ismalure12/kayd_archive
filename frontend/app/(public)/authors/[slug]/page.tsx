import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { StoryRow } from '@/components/reader/StoryRow';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getAuthorBySlug } = require('@/lib/services/authors.service');

async function getAuthor(slug: string) {
  try {
    return await getAuthorBySlug(slug);
  } catch {
    return null;
  }
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
    .join('');

  const years = author.birthYear
    ? `${author.birthYear}${author.deathYear ? `–${author.deathYear}` : '–'}`
    : null;

  const stories = author.stories || [];

  return (
    <div>
      {/* Author header */}
      <section className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-12">
        <Link href="/authors" className="mono text-accent-ink inline-block mb-6">
          ⟵ All authors
        </Link>

        <div
          className="author-detail-grid-responsive"
          style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '48px', alignItems: 'start' }}
        >
          {/* Large portrait */}
          <div className="portrait" style={{ width: '180px', height: '240px' }}>
            <div className="portrait-initials" style={{ fontSize: '64px' }}>
              {initials}
            </div>
          </div>

          {/* Meta */}
          <div>
            <h1
              className="font-display font-normal leading-[0.95] tracking-[-0.03em] text-ink mb-1"
              style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
            >
              {author.name}
            </h1>

            {author.nameSomali && author.nameSomali !== author.name && (
              <div className="font-display italic text-ink-3 text-[28px] mb-5">
                {author.nameSomali}
              </div>
            )}

            <div className="mono mb-6 text-[11px]">
              {years && `${years} · `}
              {author.era && `${author.era} · `}
              {stories.length} {stories.length === 1 ? 'story' : 'stories'}
            </div>

            {author.bio && (
              <p className="font-body text-[20px] leading-[1.6] max-w-[56ch] text-ink-2">
                {author.bio}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Stories */}
      <section className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-16 pb-12">
        <div className="section-head">
          <h2>Stories</h2>
          <div className="mono text-[10px]">{stories.length} total</div>
        </div>

        {stories.length > 0 ? (
          <div className="story-list">
            {stories.map((story: any, i: number) => (
              <StoryRow key={story.slug} story={{ ...story, author }} index={i} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-ink-3 font-body italic">
            No published stories yet.
          </div>
        )}
      </section>
    </div>
  );
}

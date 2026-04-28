import Link from 'next/link';

interface Author {
  slug: string;
  name: string;
  nameSomali?: string;
  birthYear?: number;
  deathYear?: number;
  era?: string;
  _count?: { stories: number };
}

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  const initials = author.name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('');

  const storyCount = author._count?.stories ?? 0;
  const years = author.birthYear
    ? `${author.birthYear}${author.deathYear ? `–${author.deathYear}` : '–'}`
    : null;

  return (
    <Link
      href={`/authors/${author.slug}`}
      className="author-card-hover flex gap-4 items-start p-3 -m-3 rounded-sm transition-colors cursor-pointer no-underline text-inherit"
    >
      {/* Rectangular portrait with stripe + initials */}
      <div className="portrait">
        <div className="portrait-initials">{initials}</div>
      </div>

      {/* Meta */}
      <div className="flex flex-col min-w-0">
        <div className="font-display text-[22px] leading-[1.15] tracking-[-0.01em] text-ink mb-1">
          {author.name}
        </div>

        {author.nameSomali && author.nameSomali !== author.name && (
          <div className="italic text-ink-3 text-[14px] font-display leading-[1.3] mb-2.5">
            {author.nameSomali}
          </div>
        )}

        {(years || author.era) && (
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3 leading-[1.4] mb-0.5">
            {years && years}
            {years && author.era && ' · '}
            {author.era}
          </div>
        )}

        {storyCount > 0 && (
          <div className="font-mono text-[10px] tracking-[0.12em] uppercase text-accent-ink leading-[1.4]">
            {storyCount} {storyCount === 1 ? 'story' : 'stories'}
          </div>
        )}
      </div>
    </Link>
  );
}

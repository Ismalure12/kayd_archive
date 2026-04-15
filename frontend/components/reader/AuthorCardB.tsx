// Author Option B — Minimal / Literary
// Square initial block, horizontal layout, bio + story count footer
import Link from 'next/link';
import Image from 'next/image';

interface Author {
  slug: string;
  name: string;
  nameSomali?: string;
  bio?: string;
  photoUrl?: string;
  _count?: { stories: number };
}

export function AuthorCardB({ author }: { author: Author }) {
  const initials = author.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Link
      href={`/authors/${author.slug}`}
      className="group bg-card border border-border p-5 flex gap-4 items-start hover:shadow-sm transition-shadow"
    >
      {/* Square initial / photo */}
      <div className="shrink-0">
        {author.photoUrl ? (
          <Image
            src={author.photoUrl}
            alt={author.name}
            width={52}
            height={52}
            className="w-13 h-13 object-cover"
          />
        ) : (
          <div className="w-13 h-13 bg-terracotta/10 border border-terracotta/20 flex items-center justify-center">
            <span className="font-serif text-xl font-bold text-terracotta">{initials}</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-serif font-bold text-text group-hover:text-terracotta transition-colors leading-snug">
          {author.name}
        </h3>
        {author.nameSomali && author.nameSomali !== author.name && (
          <p className="font-serif text-sm italic text-text-secondary">{author.nameSomali}</p>
        )}
        {author.bio && (
          <p className="text-sm text-text-secondary mt-2 line-clamp-2 leading-relaxed">
            {author.bio}
          </p>
        )}
        {author._count !== undefined && (
          <p className="text-xs text-terracotta font-medium mt-2 uppercase tracking-wide">
            {author._count.stories} {author._count.stories === 1 ? 'story' : 'stories'}
          </p>
        )}
      </div>
    </Link>
  );
}

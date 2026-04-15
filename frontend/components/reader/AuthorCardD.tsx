// Author Option D — Masthead / Byline style
// Terracotta header band with large initial overlapping, name + bio below
// Most visually distinctive of the three
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

export function AuthorCardD({ author }: { author: Author }) {
  const initials = author.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Link href={`/authors/${author.slug}`} className="group block">
      <article className="bg-card border border-border overflow-hidden hover:shadow-md transition-shadow duration-200">
        {/* Header band */}
        <div className="h-16 bg-terracotta/10 border-b border-terracotta/20 relative" />

        {/* Avatar — overlaps band */}
        <div className="px-5 -mt-8 mb-3">
          {author.photoUrl ? (
            <Image
              src={author.photoUrl}
              alt={author.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-full object-cover border-4 border-card"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-terracotta border-4 border-card flex items-center justify-center">
              <span className="font-serif text-xl font-bold text-white">{initials}</span>
            </div>
          )}
        </div>

        {/* Name + bio */}
        <div className="px-5 pb-5">
          <h3 className="font-serif font-bold text-lg text-text group-hover:text-terracotta transition-colors leading-snug">
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
            <p className="text-xs text-muted mt-3 uppercase tracking-wide">
              {author._count.stories} {author._count.stories === 1 ? 'story' : 'stories'}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}

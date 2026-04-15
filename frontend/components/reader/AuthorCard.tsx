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

export function AuthorCard({ author }: { author: Author }) {
  const initials = author.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <Link
      href={`/authors/${author.slug}`}
      className="bg-card border border-border rounded-lg p-5 flex gap-4 items-start hover:shadow-sm transition-shadow group"
    >
      <div className="shrink-0">
        {author.photoUrl ? (
          <Image
            src={author.photoUrl}
            alt={author.name}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full object-cover"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-terracotta flex items-center justify-center text-white font-serif font-semibold text-lg">
            {initials}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-serif font-semibold text-text group-hover:text-terracotta transition-colors">
          {author.name}
        </h3>
        {author.nameSomali && author.nameSomali !== author.name && (
          <p className="text-sm text-text-secondary font-serif">{author.nameSomali}</p>
        )}
        {author.bio && (
          <p className="text-sm text-text-secondary mt-1 line-clamp-2 leading-relaxed">
            {author.bio}
          </p>
        )}
        {author._count !== undefined && (
          <p className="text-xs text-muted mt-2">
            {author._count.stories} {author._count.stories === 1 ? 'story' : 'stories'}
          </p>
        )}
      </div>
    </Link>
  );
}

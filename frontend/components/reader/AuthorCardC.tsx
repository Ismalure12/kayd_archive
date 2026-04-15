// Author Option C — shadcn Card, centered layout
// Large circular initial, centered name + bio, story count link footer
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface Author {
  slug: string;
  name: string;
  nameSomali?: string;
  bio?: string;
  photoUrl?: string;
  _count?: { stories: number };
}

export function AuthorCardC({ author }: { author: Author }) {
  const initials = author.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase();

  return (
    <Link href={`/authors/${author.slug}`} className="group block">
      <Card className="h-full hover:shadow-md transition-shadow duration-200 text-center">
        <CardContent className="pt-8 pb-4 flex flex-col items-center gap-3">
          {/* Circular photo / initial */}
          {author.photoUrl ? (
            <Image
              src={author.photoUrl}
              alt={author.name}
              width={72}
              height={72}
              className="w-18 h-18 rounded-full object-cover ring-2 ring-terracotta/20"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-terracotta flex items-center justify-center ring-4 ring-terracotta/10">
              <span className="font-serif text-2xl font-bold text-white">{initials}</span>
            </div>
          )}

          {/* Name */}
          <div>
            <h3 className="font-serif font-bold text-text group-hover:text-terracotta transition-colors">
              {author.name}
            </h3>
            {author.nameSomali && author.nameSomali !== author.name && (
              <p className="font-serif text-sm italic text-text-secondary mt-0.5">{author.nameSomali}</p>
            )}
          </div>

          {/* Divider */}
          <div className="w-8 h-px bg-terracotta/40" />

          {/* Bio */}
          {author.bio && (
            <p className="text-sm text-text-secondary leading-relaxed line-clamp-3">
              {author.bio}
            </p>
          )}
        </CardContent>

        <CardFooter className="justify-center border-t border-border pt-4">
          {author._count !== undefined && (
            <span className="text-xs font-semibold text-terracotta uppercase tracking-widest">
              {author._count.stories} {author._count.stories === 1 ? 'story' : 'stories'} →
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}

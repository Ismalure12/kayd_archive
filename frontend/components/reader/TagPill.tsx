import Link from 'next/link';

interface TagPillProps {
  name: string;
  slug: string;
  size?: 'sm' | 'md';
}

export function TagPill({ name, slug, size = 'md' }: TagPillProps) {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-3 py-1';
  return (
    <Link
      href={`/stories?tag=${slug}`}
      className={`inline-block rounded-full border border-terracotta/30 bg-terracotta-light text-terracotta font-medium hover:bg-transparent hover:border-terracotta transition-colors ${sizeClass}`}
    >
      {name}
    </Link>
  );
}

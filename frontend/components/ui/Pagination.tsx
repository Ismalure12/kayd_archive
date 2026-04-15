import Link from 'next/link';

interface PaginationProps {
  page: number;
  totalPages: number;
  buildHref: (page: number) => string;
}

export function Pagination({ page, totalPages, buildHref }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  const withEllipsis: (number | 'ellipsis')[] = [];
  let prev: number | undefined;
  for (const p of visible) {
    if (prev && p - prev > 1) withEllipsis.push('ellipsis');
    withEllipsis.push(p);
    prev = p;
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      {page > 1 && (
        <Link
          href={buildHref(page - 1)}
          className="px-3 py-2 text-sm rounded-lg text-text-secondary hover:bg-card border border-border transition-colors"
          aria-label="Previous page"
        >
          ←
        </Link>
      )}

      {withEllipsis.map((p, i) =>
        p === 'ellipsis' ? (
          <span key={`e-${i}`} className="px-3 py-2 text-muted text-sm">
            …
          </span>
        ) : (
          <Link
            key={p}
            href={buildHref(p)}
            className={`px-3 py-2 text-sm rounded-lg transition-colors ${
              p === page
                ? 'bg-terracotta text-white'
                : 'text-text-secondary hover:bg-card border border-border'
            }`}
            aria-current={p === page ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {page < totalPages && (
        <Link
          href={buildHref(page + 1)}
          className="px-3 py-2 text-sm rounded-lg text-text-secondary hover:bg-card border border-border transition-colors"
          aria-label="Next page"
        >
          →
        </Link>
      )}
    </nav>
  );
}

import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="bg-bg border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <span className="font-serif italic text-xl font-bold text-text tracking-tight">Kayd</span>
            <span className="hidden sm:block text-xs text-muted border-l border-border pl-3 leading-none">
              Somali Literary Archive
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/stories"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text transition-colors"
            >
              Stories
            </Link>
            <Link
              href="/authors"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text transition-colors"
            >
              Authors
            </Link>
            <Link
              href="/collections"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text transition-colors"
            >
              Collections
            </Link>
            <Link
              href="/search"
              className="px-3 py-2 text-sm text-text-secondary hover:text-text transition-colors"
              aria-label="Search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

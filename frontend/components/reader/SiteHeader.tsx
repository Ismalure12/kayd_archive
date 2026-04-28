import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export function SiteHeader() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-rule"
      style={{
        background: 'color-mix(in oklch, var(--paper) 92%, transparent)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div className="max-w-[1240px] mx-auto px-8 sm:px-6">
        <div className="flex items-baseline justify-between py-4 gap-12">
          {/* Wordmark */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--ff-display)',
                fontSize: '28px',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'var(--ink)',
              }}
            >
              K<em style={{ fontStyle: 'italic', color: 'var(--accent-ink)' }}>ay</em>d
            </span>
            <span
              style={{
                width: 6, height: 6,
                borderRadius: '50%',
                background: 'var(--accent)',
                display: 'inline-block',
                transform: 'translateY(-5px)',
                flexShrink: 0,
              }}
            />
            <span
              className="hidden sm:block"
              style={{
                fontFamily: 'var(--ff-mono)',
                fontSize: '9px',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--ink-3)',
                marginLeft: 2,
              }}
            >
              Digital Somali Literary Archive
            </span>
          </Link>

          {/* Nav */}
          <nav
            className="flex items-center gap-8"
            style={{
              fontFamily: 'var(--ff-mono)',
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
            }}
          >
            {[
              { href: '/stories', label: 'Stories' },
              { href: '/authors', label: 'Authors' },
              { href: '/collections', label: 'Collections' },
              { href: '/murti', label: 'Murti' },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="nav-link">
                {label}
              </Link>
            ))}
            <Link href="/admin/dashboard" className="nav-link-muted">
              Admin
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}

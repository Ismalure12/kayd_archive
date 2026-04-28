import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-ink mt-24 pt-12 pb-10 font-mono text-[11px] tracking-[0.1em] uppercase text-ink-3">
      <div className="max-w-[1240px] mx-auto px-8 sm:px-6">
        <div className="flex items-start justify-between gap-8 flex-wrap">
          {/* Wordmark + copyright */}
          <div>
            <div className="mb-2">
              <span
                className="font-display text-[22px] tracking-[-0.03em] leading-none normal-case text-ink"
              >
                K<em className="italic text-accent-ink">ay</em>d
              </span>
              <span
                className="inline-block w-[5px] h-[5px] rounded-full bg-accent ml-1.5"
                style={{ transform: 'translateY(-3px)' }}
              />
            </div>
            <div>© {new Date().getFullYear()} · Preserved for the public record</div>
          </div>

          {/* Links */}
          <div className="flex gap-10">
            <div>
              <div className="text-ink-2 mb-2">Archive</div>
              <div className="flex flex-col gap-1.5">
                {[
                  { href: '/stories', label: 'Stories' },
                  { href: '/authors', label: 'Authors' },
                  { href: '/collections', label: 'Collections' },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} className="foot-link">{label}</Link>
                ))}
              </div>
            </div>
            <div>
              <div className="text-ink-2 mb-2">About</div>
              <div className="flex flex-col gap-1.5">
                <span className="text-ink-3">Mission</span>
                <span className="text-ink-3">Submissions</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

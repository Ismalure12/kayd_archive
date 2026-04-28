'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', hint: 'Overview' },
  { href: '/admin/stories', label: 'Stories', hint: '' },
  { href: '/admin/authors', label: 'Authors', hint: '' },
  { href: '/admin/collections', label: 'Collections', hint: '' },
  { href: '/admin/murti', label: 'Murti', hint: '' },
  { href: '/admin/tags', label: 'Tags', hint: '' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('kayd_token');
    router.push('/admin/login');
  }

  return (
    <aside className="border-r border-rule p-4 flex flex-col bg-paper-2 sticky top-0 h-screen">
      {/* Brand */}
      <div className="pb-6 border-b border-rule mb-4">
        <Link href="/" className="no-underline">
          <span className="font-display text-[24px] tracking-[-0.03em] text-ink">
            K<em className="italic text-accent-ink">ay</em>d
          </span>
          <span
            className="inline-block w-[5px] h-[5px] rounded-full bg-accent ml-1.5"
            style={{ transform: 'translateY(-4px)' }}
          />
        </Link>
        <div className="mono mt-1.5 text-[9px] text-ink-3">
          Admin Console
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 flex-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? '' : 'admin-nav-link-item'}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 12px',
                fontFamily: 'var(--ff-display)',
                fontSize: '18px',
                color: active ? 'var(--ink)' : 'var(--ink-2)',
                borderLeft: `2px solid ${active ? 'var(--accent)' : 'transparent'}`,
                background: active ? 'var(--paper-3)' : 'transparent',
                textDecoration: 'none',
                transition: 'all 0.15s',
              }}
            >
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-rule pt-4 mt-2">
        <button
          onClick={handleLogout}
          className="mono text-[10px] text-ink-3 inline-block cursor-pointer bg-transparent border-none"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--accent-ink)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--ink-3)'; }}
        >
          ⎋ Sign out
        </button>
      </div>
    </aside>
  );
}

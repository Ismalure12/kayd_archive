'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '◎' },
  { href: '/admin/stories', label: 'Stories', icon: '✦' },
  { href: '/admin/authors', label: 'Authors', icon: '◈' },
  { href: '/admin/collections', label: 'Collections', icon: '◻' },
  { href: '/admin/tags', label: 'Tags', icon: '⬡' },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem('kayd_token');
    router.push('/admin/login');
  }

  return (
    <aside className="w-56 bg-dark-bg text-white flex flex-col min-h-screen shrink-0">
      <div className="px-5 py-6 border-b border-white/10">
        <Link href="/" className="font-serif text-lg font-bold text-white hover:text-terracotta transition-colors">
          Kayd
        </Link>
        <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? 'bg-terracotta text-white font-medium'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="text-xs">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-white/10 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <span className="text-xs">→</span>
          Logout
        </button>
      </div>
    </aside>
  );
}

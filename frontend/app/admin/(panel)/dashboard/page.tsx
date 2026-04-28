'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import Link from 'next/link';

interface Stats {
  authors: number;
  stories: number;
  publishedStories: number;
  tags: number;
  collections: number;
  totalViews: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.dashboard
      .stats()
      .then((res: any) => setStats(res.data))
      .catch((err: any) => setError(err.message));
  }, []);

  const statItems = stats
    ? [
        { label: 'Stories', val: stats.stories, sub: `${stats.publishedStories} published`, href: '/admin/stories' },
        { label: 'Authors', val: stats.authors, sub: 'In the archive', href: '/admin/authors' },
        { label: 'Collections', val: stats.collections, sub: 'Curated sets', href: '/admin/collections' },
        { label: 'Total views', val: stats.totalViews.toLocaleString(), sub: 'All time', href: '/admin/stories' },
      ]
    : null;

  return (
    <div className="px-12 py-8">
      {/* Page head */}
      <div className="flex justify-between items-end pb-6 border-b border-ink mb-12">
        <div>
          <div className="mono mb-1">Overview</div>
          <h1 className="font-display text-[56px] tracking-[-0.02em] leading-none font-normal">
            Dashboard
          </h1>
        </div>
        <Link href="/admin/stories/new" className="btn">+ New story</Link>
      </div>

      {error && (
        <div className="mono text-[10px] mb-8" style={{ color: 'oklch(0.52 0.18 25)' }}>
          {error}
        </div>
      )}

      {/* Stat grid */}
      {statItems ? (
        <div className="stat-grid">
          {statItems.map((s) => (
            <Link key={s.label} href={s.href} className="no-underline">
              <div className="stat-card">
                <div className="mono">{s.label}</div>
                <div className="stat-val">{s.val}</div>
                <div className="mono text-[10px] text-ink-3">{s.sub}</div>
              </div>
            </Link>
          ))}
        </div>
      ) : !error ? (
        <div className="stat-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="stat-card animate-pulse">
              <div className="h-2.5 w-15 bg-rule mb-3" />
              <div className="h-12 w-20 bg-rule" />
            </div>
          ))}
        </div>
      ) : null}

      {/* Quick actions */}
      <div className="mt-12 flex gap-3 flex-wrap">
        <Link href="/admin/stories/new" className="btn">+ New story</Link>
        <Link href="/admin/authors/new" className="btn ghost">+ New author</Link>
        <Link href="/admin/collections/new" className="btn ghost">+ New collection</Link>
        <Link href="/" className="btn ghost">View archive ⟶</Link>
      </div>
    </div>
  );
}

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

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-sm transition-shadow group"
    >
      <p className="text-3xl font-serif font-bold text-text group-hover:text-terracotta transition-colors">
        {value.toLocaleString()}
      </p>
      <p className="text-sm text-text-secondary mt-1">{label}</p>
    </Link>
  );
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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-text-secondary mt-1 text-sm">Archive overview</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-6">
          {error}
        </div>
      )}

      {stats ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4">
          <StatCard label="Authors" value={stats.authors} href="/admin/authors" />
          <StatCard label="Total Stories" value={stats.stories} href="/admin/stories" />
          <StatCard label="Published" value={stats.publishedStories} href="/admin/stories" />
          <StatCard label="Collections" value={stats.collections} href="/admin/collections" />
          <StatCard label="Tags" value={stats.tags} href="/admin/tags" />
          <StatCard label="Total Views" value={stats.totalViews} href="/admin/stories" />
        </div>
      ) : !error ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-6">
              <div className="h-8 w-16 bg-border rounded animate-pulse" />
              <div className="h-4 w-24 bg-border rounded animate-pulse mt-2" />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/admin/stories/new"
          className="px-4 py-2 bg-terracotta text-white rounded-lg text-sm font-medium hover:bg-terracotta-dark transition-colors"
        >
          + New Story
        </Link>
        <Link
          href="/admin/authors/new"
          className="px-4 py-2 bg-card border border-border text-text rounded-lg text-sm font-medium hover:bg-bg transition-colors"
        >
          + New Author
        </Link>
        <Link
          href="/admin/collections/new"
          className="px-4 py-2 bg-card border border-border text-text rounded-lg text-sm font-medium hover:bg-bg transition-colors"
        >
          + New Collection
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

type StatusFilter = 'all' | 'published' | 'draft' | 'review';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  async function load() {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { limit: 50 };
      if (search) params.search = search;
      if (statusFilter !== 'all') params.status = statusFilter;
      const res = await adminApi.stories.list(params);
      setStories(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [search, statusFilter]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete story "${title}"?`)) return;
    setDeleting(id);
    try {
      await adminApi.stories.delete(id);
      setStories((prev) => prev.filter((s) => s.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  const dotClass = (s: any) => {
    const st = s.status || (s.isPublished ? 'PUBLISHED' : 'DRAFT');
    return st === 'PUBLISHED' ? 'published' : st === 'REVIEW' ? 'review' : '';
  };

  const label = (s: any) => {
    const st = s.status || (s.isPublished ? 'PUBLISHED' : 'DRAFT');
    return st.charAt(0) + st.slice(1).toLowerCase();
  };

  return (
    <div className="px-12 py-8">
      <div className="flex justify-between items-end pb-6 border-b border-ink mb-8">
        <div>
          <div className="mono mb-1">Content</div>
          <h1 className="font-display text-[56px] tracking-[-0.02em] leading-none font-normal">Stories</h1>
        </div>
        <Link href="/admin/stories/new" className="btn">+ New story</Link>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <input
          className="flex-1 bg-transparent border border-rule px-3.5 py-2.5 font-body text-[15px] text-ink outline-none focus:border-ink transition-colors"
          placeholder="Search by title, author..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="flex border border-rule">
          {(['all', 'published', 'draft', 'review'] as StatusFilter[]).map((f, i, arr) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className="px-3.5 py-2 font-mono text-[10px] tracking-[0.12em] uppercase cursor-pointer transition-colors"
              style={{
                background: statusFilter === f ? 'var(--ink)' : 'transparent',
                color: statusFilter === f ? 'var(--paper)' : 'var(--ink-2)',
                borderRight: i < arr.length - 1 ? '1px solid var(--rule)' : 'none',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mono py-12 text-center text-ink-3">Loading...</div>
      ) : stories.length === 0 ? (
        <div className="py-20 text-center font-display text-[32px] italic text-ink-3">No stories found.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Title</th>
              <th>Author</th>
              <th>Lang</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stories.map((story) => (
              <tr key={story.id}>
                <td><span className={`dot-status ${dotClass(story)}`} /></td>
                <td>
                  <div className="font-display text-[19px] leading-[1.15] text-ink">{story.title}</div>
                  {story.titleSomali && story.titleSomali !== story.title && (
                    <div className="font-display italic text-ink-3 text-[13px]">{story.titleSomali}</div>
                  )}
                </td>
                <td className="italic text-ink-2 font-body">{story.author?.name || '—'}</td>
                <td><span className="mono text-accent-ink text-[10px]">{story.language === 'BOTH' ? 'SO·EN' : story.language === 'SOMALI' ? 'SO' : 'EN'}</span></td>
                <td><span className="mono text-accent-ink text-[10px]">{label(story)}</span></td>
                <td className="mono text-ink-3 text-[10px]">{story.updatedAt ? new Date(story.updatedAt).toLocaleDateString() : '—'}</td>
                <td className="text-right">
                  <div className="flex gap-3 justify-end items-center">
                    {story.isPublished && (
                      <Link href={`/stories/${story.slug}`} target="_blank" className="mono text-ink-3 text-[10px]">View</Link>
                    )}
                    <Link href={`/admin/stories/${story.id}/edit`} className="mono text-accent-ink text-[10px]">Edit</Link>
                    <button
                      onClick={() => handleDelete(story.id, story.title)}
                      disabled={deleting === story.id}
                      className="mono text-[10px] cursor-pointer bg-transparent border-none"
                      style={{ color: 'oklch(0.52 0.18 25)' }}
                    >
                      {deleting === story.id ? '...' : 'Delete'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

type StatusFilter = 'all' | 'published' | 'draft' | 'review';

export default function AdminMurtiPage() {
  const [murti, setMurti] = useState<any[]>([]);
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
      const res = await adminApi.murti.list(params);
      setMurti(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [search, statusFilter]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete murti "${title}"?`)) return;
    setDeleting(id);
    try {
      await adminApi.murti.delete(id);
      setMurti((prev) => prev.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  const dotClass = (m: any) => {
    const st = m.status || (m.isPublished ? 'PUBLISHED' : 'DRAFT');
    return st === 'PUBLISHED' ? 'published' : st === 'REVIEW' ? 'review' : '';
  };

  const label = (m: any) => {
    const st = m.status || (m.isPublished ? 'PUBLISHED' : 'DRAFT');
    return st.charAt(0) + st.slice(1).toLowerCase();
  };

  return (
    <div className="px-12 py-8">
      <div className="flex justify-between items-end pb-6 border-b border-ink mb-8">
        <div>
          <div className="mono mb-1">Content</div>
          <h1 className="font-display text-[56px] tracking-[-0.02em] leading-none font-normal">Murti</h1>
        </div>
        <Link href="/admin/murti/new" className="btn">+ New murti</Link>
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <input
          className="flex-1 bg-transparent border border-rule px-3.5 py-2.5 font-body text-[15px] text-ink outline-none focus:border-ink transition-colors"
          placeholder="Search by title, narrator…"
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
        <div className="mono py-12 text-center text-ink-3">Loading…</div>
      ) : murti.length === 0 ? (
        <div className="py-20 text-center font-display text-[32px] italic text-ink-3">No murti found.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: 40 }}></th>
              <th>Title</th>
              <th>Narrator</th>
              <th>Location</th>
              <th>Status</th>
              <th>Updated</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {murti.map((m) => (
              <tr key={m.id}>
                <td><span className={`dot-status ${dotClass(m)}`} /></td>
                <td>
                  <div className="font-display text-[19px] leading-[1.15] text-ink">{m.title}</div>
                  {m.titleTranslation && (
                    <div className="font-display italic text-ink-3 text-[13px]">{m.titleTranslation}</div>
                  )}
                </td>
                <td className="italic text-ink-2 font-body">{m.narrator || '—'}</td>
                <td className="mono text-ink-3 text-[10px]">{m.narratorLocation || '—'}</td>
                <td><span className="mono text-accent-ink text-[10px]">{label(m)}</span></td>
                <td className="mono text-ink-3 text-[10px]">{m.updatedAt ? new Date(m.updatedAt).toLocaleDateString() : '—'}</td>
                <td className="text-right">
                  <div className="flex gap-3 justify-end items-center">
                    {m.isPublished && (
                      <Link href={`/murti/${m.slug}`} target="_blank" className="mono text-ink-3 text-[10px]">View</Link>
                    )}
                    <Link href={`/admin/murti/${m.id}/edit`} className="mono text-accent-ink text-[10px]">Edit</Link>
                    <button
                      onClick={() => handleDelete(m.id, m.title)}
                      disabled={deleting === m.id}
                      className="mono text-[10px] cursor-pointer bg-transparent border-none"
                      style={{ color: 'oklch(0.52 0.18 25)' }}
                    >
                      {deleting === m.id ? '…' : 'Delete'}
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

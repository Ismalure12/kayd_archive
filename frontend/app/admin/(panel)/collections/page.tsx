'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function AdminCollectionsPage() {
  const [collections, setCollections] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.collections.list({ limit: 50 });
      setCollections(res.data || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete collection "${title}"?`)) return;
    setDeleting(id);
    try {
      await adminApi.collections.delete(id);
      setCollections((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="px-12 py-8">
      <div className="flex justify-between items-end pb-6 border-b border-ink mb-8">
        <div>
          <div className="mono mb-1">Content</div>
          <h1 className="font-display text-[56px] tracking-[-0.02em] leading-none font-normal">
            Collections
            <span className="mono text-[14px] text-ink-3 ml-4 tracking-[0.1em]">{total} total</span>
          </h1>
        </div>
        <Link href="/admin/collections/new" className="btn">+ New collection</Link>
      </div>

      {loading ? (
        <div className="mono py-12 text-center text-ink-3">Loading...</div>
      ) : collections.length === 0 ? (
        <div className="py-20 text-center font-display text-[32px] italic text-ink-3">No collections yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th className="hidden sm:table-cell">Stories</th>
              <th className="hidden md:table-cell">Featured</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((col) => (
              <tr key={col.id}>
                <td>
                  <div className="font-display text-[17px] text-ink">{col.title}</div>
                  {col.titleSomali && col.titleSomali !== col.title && (
                    <div className="font-display italic text-ink-3 text-[13px]">{col.titleSomali}</div>
                  )}
                </td>
                <td className="mono text-ink-3 text-[10px] hidden sm:table-cell">
                  {col._count?.stories || 0}
                </td>
                <td className="hidden md:table-cell">
                  {col.isFeatured ? (
                    <span className="mono text-[10px] text-accent-ink">Featured</span>
                  ) : (
                    <span className="mono text-[10px] text-ink-3">—</span>
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/collections/${col.slug}`} target="_blank" className="mono text-ink-3 text-[10px]">
                      View
                    </Link>
                    <Link href={`/admin/collections/${col.id}/edit`} className="mono text-accent-ink text-[10px]">
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(col.id, col.title)}
                      disabled={deleting === col.id}
                      className="mono text-[10px] cursor-pointer bg-transparent border-none"
                      style={{ color: 'oklch(0.52 0.18 25)' }}
                    >
                      {deleting === col.id ? '…' : 'Delete'}
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

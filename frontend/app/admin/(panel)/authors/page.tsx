'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.authors.list({ limit: 50 });
      setAuthors(res.data || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete author "${name}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await adminApi.authors.delete(id);
      setAuthors((prev) => prev.filter((a) => a.id !== id));
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
            Authors
            <span className="mono text-[14px] text-ink-3 ml-4 tracking-[0.1em]">{total} total</span>
          </h1>
        </div>
        <Link href="/admin/authors/new" className="btn">+ New author</Link>
      </div>

      {loading ? (
        <div className="mono py-12 text-center text-ink-3">Loading...</div>
      ) : authors.length === 0 ? (
        <div className="py-20 text-center font-display text-[32px] italic text-ink-3">No authors yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Author</th>
              <th className="hidden sm:table-cell">Slug</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => {
              const initials = author.name
                .split(' ')
                .map((n: string) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase();

              return (
                <tr key={author.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center font-mono text-[10px] text-paper shrink-0">
                        {initials}
                      </div>
                      <span className="font-display text-[17px] text-ink">{author.name}</span>
                    </div>
                  </td>
                  <td className="mono text-ink-3 text-[10px] hidden sm:table-cell">{author.slug}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/authors/${author.slug}`} target="_blank" className="mono text-ink-3 text-[10px]">
                        View
                      </Link>
                      <Link href={`/admin/authors/${author.id}/edit`} className="mono text-accent-ink text-[10px]">
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(author.id, author.name)}
                        disabled={deleting === author.id}
                        className="mono text-[10px] cursor-pointer bg-transparent border-none"
                        style={{ color: 'oklch(0.52 0.18 25)' }}
                      >
                        {deleting === author.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

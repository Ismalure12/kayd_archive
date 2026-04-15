'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Collections</h1>
          <p className="text-text-secondary text-sm mt-0.5">{total} total</p>
        </div>
        <Link href="/admin/collections/new">
          <Button>+ New Collection</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : collections.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">No collections yet.</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Title</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium hidden sm:table-cell">Stories</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium hidden md:table-cell">Featured</th>
                <th className="text-right px-4 py-3 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {collections.map((col) => (
                <tr key={col.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text">{col.title}</p>
                    {col.titleSomali && col.titleSomali !== col.title && (
                      <p className="text-xs text-text-secondary">{col.titleSomali}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                    {col._count?.stories || 0}
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {col.isFeatured ? (
                      <span className="text-xs text-terracotta font-medium">Featured</span>
                    ) : (
                      <span className="text-xs text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/collections/${col.slug}`}
                        target="_blank"
                        className="text-terracotta hover:underline text-xs"
                      >
                        View
                      </Link>
                      <Link href={`/admin/collections/${col.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(col.id, col.title)}
                        disabled={deleting === col.id}
                      >
                        {deleting === col.id ? '…' : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

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
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Authors</h1>
          <p className="text-text-secondary text-sm mt-0.5">{total} total</p>
        </div>
        <Link href="/admin/authors/new">
          <Button>+ New Author</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : authors.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">No authors yet.</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Author</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium hidden sm:table-cell">Slug</th>
                <th className="text-right px-4 py-3 text-text-secondary font-medium">Actions</th>
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
                  <tr key={author.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {author.photoUrl ? (
                          <Image
                            src={author.photoUrl}
                            alt={author.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-terracotta flex items-center justify-center text-white text-xs font-semibold">
                            {initials}
                          </div>
                        )}
                        <span className="font-medium text-text">{author.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden sm:table-cell">
                      {author.slug}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/authors/${author.slug}`}
                          target="_blank"
                          className="text-terracotta hover:underline text-xs"
                        >
                          View
                        </Link>
                        <Link href={`/admin/authors/${author.id}/edit`}>
                          <Button variant="secondary" size="sm">Edit</Button>
                        </Link>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(author.id, author.name)}
                          disabled={deleting === author.id}
                        >
                          {deleting === author.id ? '…' : 'Delete'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

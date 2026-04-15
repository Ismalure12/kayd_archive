'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.stories.list({ limit: 50 });
      setStories(res.data || []);
      setTotal(res.total || 0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete story "${title}"? This cannot be undone.`)) return;
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

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl font-bold text-text">Stories</h1>
          <p className="text-text-secondary text-sm mt-0.5">{total} total</p>
        </div>
        <Link href="/admin/stories/new">
          <Button>+ New Story</Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-card border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-16 text-text-secondary">No stories yet.</div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Title</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium hidden md:table-cell">Author</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stories.map((story) => (
                <tr key={story.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-text line-clamp-1">{story.title}</p>
                    {story.titleSomali && story.titleSomali !== story.title && (
                      <p className="text-xs text-text-secondary">{story.titleSomali}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                    {story.author?.name || '—'}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        story.isPublished
                          ? 'bg-green-100 text-green-700'
                          : 'bg-border text-text-secondary'
                      }`}
                    >
                      {story.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {story.isPublished && (
                        <Link
                          href={`/stories/${story.slug}`}
                          target="_blank"
                          className="text-terracotta hover:underline text-xs"
                        >
                          View
                        </Link>
                      )}
                      <Link href={`/admin/stories/${story.id}/edit`}>
                        <Button variant="secondary" size="sm">Edit</Button>
                      </Link>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(story.id, story.title)}
                        disabled={deleting === story.id}
                      >
                        {deleting === story.id ? '…' : 'Delete'}
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

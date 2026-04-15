'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function AdminTagsPage() {
  const [tags, setTags] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');
  const [newNameSomali, setNewNameSomali] = useState('');
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  async function load() {
    setLoading(true);
    try {
      const res = await adminApi.tags.list({ limit: 100 });
      setTags(res.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError('');
    try {
      const res = await adminApi.tags.create({
        name: newName.trim(),
        ...(newNameSomali.trim() && { nameSomali: newNameSomali.trim() }),
      });
      setTags((prev) => [...prev, res.data]);
      setNewName('');
      setNewNameSomali('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete tag "${name}"?`)) return;
    setDeleting(id);
    try {
      await adminApi.tags.delete(id);
      setTags((prev) => prev.filter((t) => t.id !== id));
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-bold text-text mb-6">Tags</h1>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-card border border-border rounded-lg p-5 mb-6 max-w-lg">
        <h2 className="text-sm font-semibold text-text mb-4">Add new tag</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input
            id="tagName"
            label="Name (English) *"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Love"
          />
          <Input
            id="tagNameSomali"
            label="Name (Somali)"
            value={newNameSomali}
            onChange={(e) => setNewNameSomali(e.target.value)}
            placeholder="Jacayl"
          />
        </div>
        {error && <p className="text-xs text-red-600 mb-3">{error}</p>}
        <Button type="submit" disabled={creating || !newName.trim()} size="sm">
          {creating ? 'Creating…' : 'Add Tag'}
        </Button>
      </form>

      {/* Tag list */}
      {loading ? (
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-8 w-24 bg-card border border-border rounded-full animate-pulse" />
          ))}
        </div>
      ) : tags.length === 0 ? (
        <p className="text-text-secondary text-sm">No tags yet.</p>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-bg">
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Name</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Somali Name</th>
                <th className="text-left px-4 py-3 text-text-secondary font-medium">Slug</th>
                <th className="text-right px-4 py-3 text-text-secondary font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags.map((tag) => (
                <tr key={tag.id} className="border-b border-border last:border-0 hover:bg-bg/50">
                  <td className="px-4 py-3 font-medium text-text">{tag.name}</td>
                  <td className="px-4 py-3 text-text-secondary">{tag.nameSomali || '—'}</td>
                  <td className="px-4 py-3 text-text-secondary">{tag.slug}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(tag.id, tag.name)}
                      disabled={deleting === tag.id}
                    >
                      {deleting === tag.id ? '…' : 'Delete'}
                    </Button>
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

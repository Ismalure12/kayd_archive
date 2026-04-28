'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '@/lib/api';
import { Input } from '@/components/ui/Input';

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
    <div className="px-12 py-8">
      <div className="pb-6 border-b border-ink mb-8">
        <div className="mono mb-1">Content</div>
        <h1 className="font-display text-[56px] tracking-[-0.02em] leading-none font-normal">Tags</h1>
      </div>

      {/* Create form */}
      <form onSubmit={handleCreate} className="bg-paper-2 border border-rule p-5 mb-8 max-w-lg">
        <div className="mono text-[10px] text-ink-3 mb-4">Add new tag</div>
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
        <button
          type="submit"
          disabled={creating || !newName.trim()}
          className="btn"
        >
          {creating ? 'Creating…' : 'Add Tag'}
        </button>
      </form>

      {/* Tag list */}
      {loading ? (
        <div className="mono py-12 text-center text-ink-3">Loading...</div>
      ) : tags.length === 0 ? (
        <div className="mono text-ink-3 text-[11px]">No tags yet.</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Somali Name</th>
              <th>Slug</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag) => (
              <tr key={tag.id}>
                <td className="font-display text-[17px] text-ink">{tag.name}</td>
                <td className="font-display italic text-ink-3 text-[15px]">{tag.nameSomali || '—'}</td>
                <td className="mono text-ink-3 text-[10px]">{tag.slug}</td>
                <td className="text-right">
                  <button
                    onClick={() => handleDelete(tag.id, tag.name)}
                    disabled={deleting === tag.id}
                    className="mono text-[10px] cursor-pointer bg-transparent border-none"
                    style={{ color: 'oklch(0.52 0.18 25)' }}
                  >
                    {deleting === tag.id ? '…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

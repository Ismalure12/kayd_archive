'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CollectionFormProps {
  initial?: any;
  mode: 'create' | 'edit';
}

export function CollectionForm({ initial, mode }: CollectionFormProps) {
  const router = useRouter();
  const [stories, setStories] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: initial?.title || '',
    titleSomali: initial?.titleSomali || '',
    description: initial?.description || '',
    isFeatured: initial?.isFeatured ?? false,
    slug: initial?.slug || '',
    selectedStoryIds: (initial?.stories?.map((cs: any) => cs.story?.id || cs.storyId) || []) as string[],
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.stories.list({ limit: 100 }).then((res: any) => {
      setStories(res.data || []);
    });
  }, []);

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleStory(id: string) {
    setForm((f) => ({
      ...f,
      selectedStoryIds: f.selectedStoryIds.includes(id)
        ? f.selectedStoryIds.filter((s) => s !== id)
        : [...f.selectedStoryIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setSaving(true);

    const data: any = {
      title: form.title.trim(),
      isFeatured: form.isFeatured,
      storyIds: form.selectedStoryIds,
    };
    if (form.titleSomali.trim()) data.titleSomali = form.titleSomali.trim();
    if (form.description.trim()) data.description = form.description.trim();
    if (form.slug.trim()) data.slug = form.slug.trim();

    try {
      if (mode === 'create') {
        await adminApi.collections.create(data);
      } else {
        await adminApi.collections.update(initial.id, data);
      }
      router.push('/admin/collections');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <Input
        id="title"
        label="Title *"
        value={form.title}
        onChange={(e) => set('title', e.target.value)}
        placeholder="Collection title"
        required
      />
      <Input
        id="titleSomali"
        label="Title (Somali)"
        value={form.titleSomali}
        onChange={(e) => set('titleSomali', e.target.value)}
        placeholder="Cinwaanka af Soomaali"
      />
      <Textarea
        id="description"
        label="Description"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="What is this collection about?"
        rows={3}
      />
      <Input
        id="slug"
        label="Slug (auto-generated if empty)"
        value={form.slug}
        onChange={(e) => set('slug', e.target.value)}
        placeholder="collection-name"
      />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => set('isFeatured', e.target.checked)}
          className="w-4 h-4 accent-terracotta"
        />
        <span className="text-sm font-medium text-text">Feature this collection on homepage</span>
      </label>

      {stories.length > 0 && (
        <div>
          <label className="text-sm font-medium text-text block mb-2">
            Stories ({form.selectedStoryIds.length} selected)
          </label>
          <div className="border border-border rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            {stories.map((story) => (
              <label
                key={story.id}
                className="flex items-center gap-3 px-4 py-3 hover:bg-bg cursor-pointer border-b border-border last:border-0"
              >
                <input
                  type="checkbox"
                  checked={form.selectedStoryIds.includes(story.id)}
                  onChange={() => toggleStory(story.id)}
                  className="w-4 h-4 accent-terracotta shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text truncate">{story.title}</p>
                  <p className="text-xs text-text-secondary">
                    {story.author?.name || '—'} ·{' '}
                    <span className={story.isPublished ? 'text-green-600' : 'text-muted'}>
                      {story.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : mode === 'create' ? 'Create Collection' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

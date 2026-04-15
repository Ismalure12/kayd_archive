'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TiptapEditor } from './TiptapEditor';

interface StoryFormProps {
  initial?: any;
  mode: 'create' | 'edit';
}

export function StoryForm({ initial, mode }: StoryFormProps) {
  const router = useRouter();
  const [authors, setAuthors] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: initial?.title || '',
    titleSomali: initial?.titleSomali || '',
    description: initial?.description || '',
    content: initial?.content || '',
    authorId: initial?.authorId || initial?.author?.id || '',
    language: initial?.language || 'SOMALI',
    coverImageUrl: initial?.coverImageUrl || '',
    isPublished: initial?.isPublished ?? false,
    slug: initial?.slug || '',
    selectedTagIds: (initial?.tags?.map((t: any) => t.tag.id) || []) as string[],
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([
      adminApi.authors.list({ limit: 100 }),
      adminApi.tags.list({ limit: 100 }),
    ]).then(([authRes, tagRes]: any) => {
      setAuthors(authRes.data || []);
      setTags(tagRes.data || []);
    });
  }, []);

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function toggleTag(id: string) {
    setForm((f) => ({
      ...f,
      selectedTagIds: f.selectedTagIds.includes(id)
        ? f.selectedTagIds.filter((t) => t !== id)
        : [...f.selectedTagIds, id],
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.authorId) { setError('Author is required.'); return; }
    if (!form.content.trim() || form.content === '<p></p>') {
      setError('Content is required.');
      return;
    }
    setSaving(true);

    const data: any = {
      title: form.title.trim(),
      content: form.content,
      authorId: form.authorId,
      language: form.language,
      isPublished: form.isPublished,
      tagIds: form.selectedTagIds,
    };
    if (form.titleSomali.trim()) data.titleSomali = form.titleSomali.trim();
    if (form.description.trim()) data.description = form.description.trim();
    if (form.coverImageUrl.trim()) data.coverImageUrl = form.coverImageUrl.trim();
    if (form.slug.trim()) data.slug = form.slug.trim();

    try {
      if (mode === 'create') {
        await adminApi.stories.create(data);
      } else {
        await adminApi.stories.update(initial.id, data);
      }
      router.push('/admin/stories');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  const authorOptions = [
    { value: '', label: 'Select author…' },
    ...authors.map((a) => ({ value: a.id, label: a.name })),
  ];

  const languageOptions = [
    { value: 'SOMALI', label: 'Somali' },
    { value: 'ENGLISH', label: 'English' },
    { value: 'BOTH', label: 'Both' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="title"
          label="Title (English) *"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Story title"
          required
        />
        <Input
          id="titleSomali"
          label="Title (Somali)"
          value={form.titleSomali}
          onChange={(e) => set('titleSomali', e.target.value)}
          placeholder="Cinwaanka af Soomaali"
        />
      </div>

      <Textarea
        id="description"
        label="Description / Excerpt"
        value={form.description}
        onChange={(e) => set('description', e.target.value)}
        placeholder="A short description of the story…"
        rows={3}
      />

      <div>
        <label className="text-sm font-medium text-text block mb-1">
          Content *
        </label>
        <TiptapEditor
          content={form.content}
          onChange={(html) => set('content', html)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          id="authorId"
          label="Author *"
          value={form.authorId}
          onChange={(e) => set('authorId', e.target.value)}
          options={authorOptions}
        />
        <Select
          id="language"
          label="Language"
          value={form.language}
          onChange={(e) => set('language', e.target.value)}
          options={languageOptions}
        />
      </div>

      <Input
        id="coverImageUrl"
        label="Cover Image URL"
        type="url"
        value={form.coverImageUrl}
        onChange={(e) => set('coverImageUrl', e.target.value)}
        placeholder="https://…"
      />

      <Input
        id="slug"
        label="Slug (auto-generated if empty)"
        value={form.slug}
        onChange={(e) => set('slug', e.target.value)}
        placeholder="story-title-here"
      />

      {tags.length > 0 && (
        <div>
          <label className="text-sm font-medium text-text block mb-2">Tags</label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                  form.selectedTagIds.includes(tag.id)
                    ? 'bg-terracotta text-white'
                    : 'bg-terracotta-light text-terracotta border border-terracotta/30 hover:bg-transparent hover:border-terracotta'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isPublished}
          onChange={(e) => set('isPublished', e.target.checked)}
          className="w-4 h-4 accent-terracotta"
        />
        <span className="text-sm font-medium text-text">Publish this story</span>
      </label>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : mode === 'create' ? 'Create Story' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

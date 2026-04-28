'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface MurtiFormProps {
  initial?: any;
  mode: 'create' | 'edit';
}

const statusOptions = [
  { value: 'DRAFT', label: 'Draft' },
  { value: 'REVIEW', label: 'In Review' },
  { value: 'PUBLISHED', label: 'Published' },
];

export function MurtiForm({ initial, mode }: MurtiFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: initial?.title || '',
    titleTranslation: initial?.titleTranslation || '',
    context: initial?.context || '',
    narrator: initial?.narrator || '',
    narratorLocation: initial?.narratorLocation || '',
    slug: initial?.slug || '',
    status: initial?.status || 'DRAFT',
    isFeatured: initial?.isFeatured ?? false,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function set(key: string, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.context.trim()) { setError('Context is required.'); return; }
    setSaving(true);

    const data: any = {
      title: form.title.trim(),
      context: form.context.trim(),
      status: form.status,
      isPublished: form.status === 'PUBLISHED',
      isFeatured: form.isFeatured,
    };
    if (form.titleTranslation.trim()) data.titleTranslation = form.titleTranslation.trim();
    if (form.narrator.trim()) data.narrator = form.narrator.trim();
    if (form.narratorLocation.trim()) data.narratorLocation = form.narratorLocation.trim();
    if (form.slug.trim()) data.slug = form.slug.trim();

    try {
      if (mode === 'create') {
        await adminApi.murti.create(data);
      } else {
        await adminApi.murti.update(initial.id, data);
      }
      router.push('/admin/murti');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="title"
          label="Title (Somali) *"
          value={form.title}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Maahmaahda af Soomaali"
          required
        />
        <Input
          id="titleTranslation"
          label="Translation (English)"
          value={form.titleTranslation}
          onChange={(e) => set('titleTranslation', e.target.value)}
          placeholder="English translation"
        />
      </div>

      <Textarea
        id="context"
        label="Context (Macnaha) *"
        value={form.context}
        onChange={(e) => set('context', e.target.value)}
        placeholder="Explain when and why this murti is said…"
        rows={5}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          id="narrator"
          label="Narrator"
          value={form.narrator}
          onChange={(e) => set('narrator', e.target.value)}
          placeholder="Name of person who shared it"
        />
        <Input
          id="narratorLocation"
          label="Narrator Location"
          value={form.narratorLocation}
          onChange={(e) => set('narratorLocation', e.target.value)}
          placeholder="Galkacyo, Mudug, Somalia"
        />
      </div>

      <Input
        id="slug"
        label="Slug (auto-generated if empty)"
        value={form.slug}
        onChange={(e) => set('slug', e.target.value)}
        placeholder="murti-slug-here"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Select
          id="status"
          label="Status"
          value={form.status}
          onChange={(e) => set('status', e.target.value)}
          options={statusOptions}
        />
        <div />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(e) => set('isFeatured', e.target.checked)}
          className="w-4 h-4"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono text-[11px] tracking-[0.1em] uppercase text-ink-2">
          Featured murti
        </span>
      </label>

      {error && (
        <div className="font-mono text-[11px] px-3.5 py-2.5" style={{ color: 'oklch(0.52 0.18 25)', border: '1px solid oklch(0.85 0.1 25)', background: 'oklch(0.97 0.03 25)' }}>
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : mode === 'create' ? 'Create Murti' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

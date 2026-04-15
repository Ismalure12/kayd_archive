'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi } from '@/lib/api';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface AuthorFormProps {
  initial?: any;
  mode: 'create' | 'edit';
}

export function AuthorForm({ initial, mode }: AuthorFormProps) {
  const router = useRouter();
  const [form, setForm] = useState({
    name: initial?.name || '',
    nameSomali: initial?.nameSomali || '',
    bio: initial?.bio || '',
    bioSomali: initial?.bioSomali || '',
    photoUrl: initial?.photoUrl || '',
    slug: initial?.slug || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) { setError('Name is required.'); return; }
    setSaving(true);

    const data: any = { name: form.name.trim() };
    if (form.nameSomali.trim()) data.nameSomali = form.nameSomali.trim();
    if (form.bio.trim()) data.bio = form.bio.trim();
    if (form.bioSomali.trim()) data.bioSomali = form.bioSomali.trim();
    if (form.photoUrl.trim()) data.photoUrl = form.photoUrl.trim();
    if (form.slug.trim()) data.slug = form.slug.trim();

    try {
      if (mode === 'create') {
        await adminApi.authors.create(data);
      } else {
        await adminApi.authors.update(initial.id, data);
      }
      router.push('/admin/authors');
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
        id="name"
        label="Name (English) *"
        value={form.name}
        onChange={(e) => set('name', e.target.value)}
        placeholder="Nuruddin Farah"
        required
      />
      <Input
        id="nameSomali"
        label="Name (Somali)"
        value={form.nameSomali}
        onChange={(e) => set('nameSomali', e.target.value)}
        placeholder="Nuuruddiin Faarax"
      />
      <Textarea
        id="bio"
        label="Bio (English)"
        value={form.bio}
        onChange={(e) => set('bio', e.target.value)}
        placeholder="Short biography…"
        rows={4}
      />
      <Textarea
        id="bioSomali"
        label="Bio (Somali)"
        value={form.bioSomali}
        onChange={(e) => set('bioSomali', e.target.value)}
        placeholder="Taariikh gaaban…"
        rows={4}
      />
      <Input
        id="photoUrl"
        label="Photo URL"
        type="url"
        value={form.photoUrl}
        onChange={(e) => set('photoUrl', e.target.value)}
        placeholder="https://…"
      />
      <Input
        id="slug"
        label="Slug (auto-generated if empty)"
        value={form.slug}
        onChange={(e) => set('slug', e.target.value)}
        placeholder="nuruddin-farah"
      />

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : mode === 'create' ? 'Create Author' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

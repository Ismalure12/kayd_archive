'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { adminApi } from '@/lib/api';
import { AuthorForm } from '@/components/admin/AuthorForm';

export default function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [author, setAuthor] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.authors
      .get(id)
      .then((res: any) => setAuthor(res.data))
      .catch((err: any) => setError(err.message));
  }, [id]);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!author) return (
    <div className="p-8">
      <div className="h-8 w-48 bg-border rounded animate-pulse mb-6" />
      <div className="space-y-4 max-w-xl">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-12 bg-card border border-border rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <h1 className="font-serif text-2xl font-bold text-text mb-6">Edit {author.name}</h1>
      <AuthorForm initial={author} mode="edit" />
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { adminApi } from '@/lib/api';
import { CollectionForm } from '@/components/admin/CollectionForm';

export default function EditCollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [collection, setCollection] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.collections
      .get(id)
      .then((res: any) => setCollection(res.data))
      .catch((err: any) => setError(err.message));
  }, [id]);

  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!collection) return (
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
      <h1 className="font-serif text-2xl font-bold text-text mb-6">Edit {collection.title}</h1>
      <CollectionForm initial={collection} mode="edit" />
    </div>
  );
}

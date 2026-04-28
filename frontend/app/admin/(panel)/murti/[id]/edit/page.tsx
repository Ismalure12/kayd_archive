'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { adminApi } from '@/lib/api';
import { MurtiForm } from '@/components/admin/MurtiForm';

export default function EditMurtiPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [murti, setMurti] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.murti
      .get(id)
      .then((res: any) => setMurti(res.data))
      .catch((err: any) => setError(err.message));
  }, [id]);

  if (error) return <div style={{ padding: '32px 48px', color: 'oklch(0.52 0.18 25)', fontFamily: 'var(--ff-mono)', fontSize: '13px' }}>{error}</div>;
  if (!murti) return (
    <div style={{ padding: '32px 48px' }}>
      <div className="mono" style={{ color: 'var(--ink-3)', fontSize: '11px' }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ padding: '32px 48px' }}>
      <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--ink)', marginBottom: '32px' }}>
        <div className="mono" style={{ marginBottom: '4px' }}>Content</div>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '56px', letterSpacing: '-0.02em', lineHeight: 1, fontWeight: 400 }}>
          Edit Murti
        </h1>
      </div>
      <MurtiForm initial={murti} mode="edit" />
    </div>
  );
}

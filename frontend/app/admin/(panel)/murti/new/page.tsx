import { MurtiForm } from '@/components/admin/MurtiForm';

export default function NewMurtiPage() {
  return (
    <div style={{ padding: '32px 48px' }}>
      <div style={{ paddingBottom: '24px', borderBottom: '1px solid var(--ink)', marginBottom: '32px' }}>
        <div className="mono" style={{ marginBottom: '4px' }}>Content</div>
        <h1 style={{ fontFamily: 'var(--ff-display)', fontSize: '56px', letterSpacing: '-0.02em', lineHeight: 1, fontWeight: 400 }}>
          New Murti
        </h1>
      </div>
      <MurtiForm mode="create" />
    </div>
  );
}

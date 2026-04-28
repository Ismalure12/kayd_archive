import { AdminNav } from '@/components/admin/AdminNav';
import { AuthGuard } from '@/components/admin/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="admin-shell">
        <AdminNav />
        <div className="bg-paper overflow-x-auto">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}

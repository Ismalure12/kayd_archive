import { AdminNav } from '@/components/admin/AdminNav';
import { AuthGuard } from '@/components/admin/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <AdminNav />
        <div className="flex-1 bg-bg overflow-auto">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}

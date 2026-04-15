'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('kayd_token');
    if (!token) {
      router.replace('/admin/login');
    }
  }, [router]);

  return <>{children}</>;
}

import { SiteHeader } from '@/components/reader/SiteHeader';
import { SiteFooter } from '@/components/reader/SiteFooter';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}

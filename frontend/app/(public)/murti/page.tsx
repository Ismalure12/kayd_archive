import type { Metadata } from 'next';
import { MurtiRow } from '@/components/reader/MurtiRow';
import { Pagination } from '@/components/ui/Pagination';

export const metadata: Metadata = {
  title: 'Murti',
  description: 'Browse the collection of Somali proverbs and their meanings.',
};

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { listMurti } = require('@/lib/services/murti.service');

async function getData(searchParams: Record<string, string>) {
  const page = Math.max(1, parseInt(searchParams.page) || 1);
  const limit = 20;
  const skip = (page - 1) * limit;
  const { murti, total } = await listMurti({ page, limit, skip });
  return { murti, total, totalPages: Math.ceil(total / limit) };
}

interface PageProps {
  searchParams: Promise<Record<string, string>>;
}

export default async function MurtiPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const { murti, total, totalPages } = await getData(sp);
  const page = parseInt(sp.page || '1');

  function buildHref(p: number) {
    return `/murti?page=${p}`;
  }

  return (
    <div className="max-w-[1240px] mx-auto px-8 sm:px-6 pt-12">
      {/* Page header */}
      <div className="mb-6">
        <div className="mono mb-3">The Archive</div>
        <h1
          className="font-display font-normal leading-[0.95] tracking-[-0.025em] mb-6"
          style={{ fontSize: 'clamp(48px, 7vw, 88px)' }}
        >
          Somali{' '}
          <em className="italic text-accent-ink">proverbs</em>
        </h1>
      </div>

      {/* Murti list */}
      {murti.length > 0 ? (
        <>
          <div className="flex justify-between items-baseline mb-2 pb-3 border-b border-ink font-mono text-[10px] tracking-[0.12em] uppercase text-ink-3">
            <span>Murti</span>
            <span>{total} total</span>
          </div>
          <div className="story-list">
            {murti.map((m: any, i: number) => (
              <MurtiRow key={m.slug} murti={m} index={(page - 1) * 20 + i} />
            ))}
          </div>
          <div className="py-8">
            <Pagination page={page} totalPages={totalPages} buildHref={buildHref} />
          </div>
        </>
      ) : (
        <div className="py-20 text-center text-ink-3">
          <div className="font-display text-[40px] italic mb-3">No murti yet.</div>
          <div className="font-mono text-[11px] tracking-[0.1em]">Check back soon.</div>
        </div>
      )}
    </div>
  );
}

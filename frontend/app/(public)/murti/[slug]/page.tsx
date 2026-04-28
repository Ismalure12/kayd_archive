import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { getMurtiBySlug } = require('@/lib/services/murti.service');

async function getMurti(slug: string) {
  try {
    return await getMurtiBySlug(slug);
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const murti = await getMurti(slug);
  if (!murti) return { title: 'Murti not found' };
  return {
    title: murti.title,
    description: murti.titleTranslation || murti.context?.slice(0, 160) || `Read "${murti.title}" on Kayd Archive`,
  };
}

export default async function MurtiDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const murti = await getMurti(slug);
  if (!murti) notFound();

  return (
    <div>
      <article className="reader">
        {/* Kicker */}
        {(murti.narrator || murti.narratorLocation) && (
          <div className="mono mb-6 flex gap-4 items-center text-[11px] text-ink-3">
            {murti.narrator && <span className="text-accent-ink">{murti.narrator}</span>}
            {murti.narrator && murti.narratorLocation && <span>·</span>}
            {murti.narratorLocation && <span>{murti.narratorLocation}</span>}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-display font-normal text-ink leading-[0.98] tracking-[-0.025em] mb-4"
          style={{ fontSize: 'clamp(44px, 6vw, 76px)' }}
        >
          {murti.title}
        </h1>

        {/* Translation */}
        {murti.titleTranslation && (
          <div className="font-display italic text-ink-3 text-[28px] mb-10">
            {murti.titleTranslation}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-ink mb-12" />

        {/* Context / Meaning */}
        <div className="mb-10">
          <div className="mono text-[10px] tracking-[0.14em] uppercase text-ink-3 mb-4">
            Macnaha
          </div>
          <p
            className="font-body text-[19px] leading-[1.7] text-ink"
            style={{ textWrap: 'pretty' } as React.CSSProperties}
          >
            {murti.context}
          </p>
        </div>

        {/* Narrator attribution */}
        {murti.narrator && (
          <div className="border-t border-rule pt-6 mb-12">
            <span className="font-display italic text-[17px] text-ink-3">
              — {murti.narrator}
              {murti.narratorLocation && (
                <span className="font-mono not-italic text-[11px] tracking-[0.1em] text-ink-3 ml-2.5">
                  · {murti.narratorLocation}
                </span>
              )}
            </span>
          </div>
        )}

        {/* End ornament */}
        <div className="text-center font-mono text-[11px] tracking-[0.3em] text-ink-3 mt-12">
          ❦ · Dhamaad · ❦
        </div>
      </article>
    </div>
  );
}

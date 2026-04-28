import Link from 'next/link';

interface Murti {
  slug: string;
  title: string;
  titleTranslation?: string;
  context?: string;
  narrator?: string;
  narratorLocation?: string;
  publishedDate?: string;
}

interface MurtiRowProps {
  murti: Murti;
  index: number;
}

export function MurtiRow({ murti, index }: MurtiRowProps) {
  const excerpt = murti.context
    ? murti.context.slice(0, 140) + (murti.context.length > 140 ? '…' : '')
    : '';

  return (
    <Link href={`/murti/${murti.slug}`} className="story-row block">
      {/* Number */}
      <div className="font-mono text-[11px] tracking-[0.1em] text-ink-3 pt-1.5">
        №{String(index + 1).padStart(2, '0')}
      </div>

      {/* Title + translation + excerpt */}
      <div>
        <div className="font-display text-[26px] leading-[1.05] tracking-[-0.01em] text-ink">
          {murti.title}
        </div>
        {murti.titleTranslation && (
          <div className="font-display italic text-ink-3 text-[17px] mt-0.5 tracking-normal">
            {murti.titleTranslation}
          </div>
        )}
        {excerpt && (
          <p className="mt-2 text-ink-2 font-body text-[15px] leading-[1.5] max-w-[62ch]">
            {excerpt}
          </p>
        )}
      </div>

      {/* Narrator column */}
      <div className="story-row-author font-body text-[14px] text-ink-2 italic">
        {murti.narrator}
        {murti.narratorLocation && (
          <span className="block not-italic font-mono text-[10px] tracking-[0.1em] text-ink-3 mt-1">
            {murti.narratorLocation}
          </span>
        )}
      </div>

      {/* Empty 4th col */}
      <div className="story-row-read" />
    </Link>
  );
}

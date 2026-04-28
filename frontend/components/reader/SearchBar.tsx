'use client';

import { useRef } from 'react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  resultCount?: number;
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'Search stories, authors, tags…',
  resultCount,
}: SearchBarProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputRef.current?.value?.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-ink-3 mr-6 whitespace-nowrap">
        Search ⟶
      </span>
      <input
        ref={inputRef}
        type="search"
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-label="Search"
      />
      {resultCount !== undefined && (
        <span className="font-mono text-[11px] tracking-[0.1em] text-ink-3 ml-6 whitespace-nowrap">
          {resultCount} {resultCount === 1 ? 'match' : 'matches'}
        </span>
      )}
    </form>
  );
}

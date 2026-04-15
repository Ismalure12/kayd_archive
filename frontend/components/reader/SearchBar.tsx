'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

interface SearchBarProps {
  defaultValue?: string;
  placeholder?: string;
  className?: string;
  autoNavigate?: boolean;
}

export function SearchBar({
  defaultValue = '',
  placeholder = 'Search stories and authors…',
  className = '',
  autoNavigate = false,
}: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const debounced = useDebounce(value, 300);

  useEffect(() => {
    if (!autoNavigate) return;
    if (debounced.trim()) {
      router.push(`/search?q=${encodeURIComponent(debounced.trim())}`);
    }
  }, [debounced, autoNavigate, router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-text placeholder:text-muted
          focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent text-base"
      />
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
      </span>
    </form>
  );
}

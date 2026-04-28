import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', id, ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3 py-2 text-sm bg-paper-2 border text-ink placeholder:text-ink-3
          focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : 'border-rule'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = '', id, ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full px-3 py-2 text-sm bg-paper-2 border text-ink placeholder:text-ink-3
          focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink
          disabled:opacity-50 resize-y min-h-24
          ${error ? 'border-red-500' : 'border-rule'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, options, className = '', id, ...props }: SelectProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-3">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full px-3 py-2 text-sm bg-paper-2 border text-ink
          focus:outline-none focus:ring-1 focus:ring-ink focus:border-ink
          disabled:opacity-50 cursor-pointer
          ${error ? 'border-red-500' : 'border-rule'}
          ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

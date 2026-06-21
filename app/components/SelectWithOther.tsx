'use client';

import { useState } from 'react';

const Chevron = () => (
  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--rh-stone)' }}>
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
  customPlaceholder?: string;
  required?: boolean;
}

export default function SelectWithOther({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  customPlaceholder = 'Type custom value…',
  required,
}: Props) {
  const [otherMode, setOtherMode] = useState(() => value !== '' && !options.includes(value));

  const selectValue = otherMode ? '__other__' : value;

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === '__other__') {
      setOtherMode(true);
      onChange('');
    } else {
      setOtherMode(false);
      onChange(e.target.value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <select
          value={selectValue}
          onChange={handleSelect}
          required={required && !otherMode}
          className="rh-field rh-field--select"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
          <option value="__other__">Other…</option>
        </select>
        <Chevron />
      </div>

      {otherMode && (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={customPlaceholder}
          required={required}
          autoFocus
          className="rh-field"
        />
      )}
    </div>
  );
}

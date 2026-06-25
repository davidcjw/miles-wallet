'use client';

interface Props {
  value: string;
  onChange: (v: string) => void;
  /** Forwarded to the native input (e.g. for label association). */
  id?: string;
}

/**
 * Native `<input type="date">` shows no placeholder on iOS Safari (and an
 * inconsistent one on desktop), so an empty optional date field looks blank
 * and broken. This overlays a muted `dd/mm/yyyy` hint while empty; the styling
 * in `globals.css` left-aligns the value and hides the browser's own
 * empty-state text so the field reads like every other input.
 */
export default function DateField({ value, onChange, id }: Props) {
  return (
    <div className="rh-date">
      <input
        id={id}
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rh-field rh-field--date${value ? ' has-value' : ''}`}
      />
      {!value && (
        <span className="rh-date__ph" aria-hidden="true">
          dd/mm/yyyy
        </span>
      )}
    </div>
  );
}

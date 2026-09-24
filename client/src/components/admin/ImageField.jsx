import { useRef } from 'react';

export default function ImageField({ label, helper, previewUrl, buttonLabel, onChange, rounded = 'rounded-lg' }) {
  const inputRef = useRef(null);
  const previewSize = rounded === 'rounded-full' ? 'h-20 w-20' : 'h-20 w-28';

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink">{label}</p>
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-ink/10 bg-white p-4">
        <div
          className={`flex ${previewSize} shrink-0 items-center justify-center overflow-hidden ${rounded} bg-cream-dark`}
        >
          {previewUrl ? (
            <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
          ) : (
            <span className="px-2 text-center text-xs text-ink/40">Sin imagen</span>
          )}
        </div>

        <div className="flex-1">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold/20"
          >
            {buttonLabel}
          </button>
          {helper && <p className="mt-2 text-xs text-ink/50">{helper}</p>}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onChange(file);
            e.target.value = '';
          }}
        />
      </div>
    </div>
  );
}

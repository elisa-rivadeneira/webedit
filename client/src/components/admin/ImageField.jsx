import { useRef, useState } from 'react';

export default function ImageField({
  label,
  helper,
  sizeHint,
  aiPrompt,
  previewUrl,
  buttonLabel,
  onChange,
  rounded = 'rounded-lg',
}) {
  const inputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const previewSize = rounded === 'rounded-full' ? 'h-20 w-20' : 'h-20 w-28';

  async function copyPrompt() {
    try {
      await navigator.clipboard.writeText(aiPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Si el navegador bloquea el portapapeles, el texto sigue visible para copiarlo a mano.
    }
  }

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
          {sizeHint && (
            <p className="mt-1 text-xs font-medium text-ink/60">📐 {sizeHint}</p>
          )}
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

      {aiPrompt && (
        <div className="mt-2 rounded-lg border border-dashed border-gold/40 bg-gold/5 p-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-ink/70">
                💡 Prompt sugerido para pedirle esta imagen a una IA:
              </p>
              <p className="mt-1 text-xs italic text-ink/60">"{aiPrompt}"</p>
            </div>
            <button
              type="button"
              onClick={copyPrompt}
              className="shrink-0 rounded-md border border-ink/15 bg-white px-2.5 py-1 text-xs font-medium text-ink/70 transition hover:bg-ink/5"
            >
              {copied ? '¡Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

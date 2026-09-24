import { useState } from 'react';

const NAV_LINKS = [
  { href: '#inicio', label: 'Inicio' },
  { href: '#promociones', label: 'Promociones' },
  { href: '#contacto', label: 'Contacto' },
];

export default function Header({ businessName, logoUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="relative bg-ink text-cream">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#inicio" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-light text-lg font-bold text-ink">
              {businessName?.charAt(0)?.toUpperCase() || 'M'}
            </span>
          )}
          <span className="font-display text-lg font-semibold leading-tight tracking-wide">
            {businessName}
          </span>
        </a>

        <nav className="hidden gap-8 text-sm font-medium tracking-wide sm:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-gold-light">
              {link.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 sm:hidden"
        >
          <span className={`h-0.5 w-6 bg-cream transition ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-cream transition ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-cream transition ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-5 pb-4 text-sm font-medium sm:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 transition hover:bg-white/5 hover:text-gold-light"
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

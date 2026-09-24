export default function Footer({ businessName, logoUrl, footerTagline }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ink/10 bg-cream-dark px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-3">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-white">
              {businessName?.charAt(0)?.toUpperCase() || 'M'}
            </span>
          )}
          <div>
            <p className="font-display text-sm font-semibold text-ink">{businessName}</p>
            {footerTagline && <p className="text-xs text-ink/60">{footerTagline}</p>}
          </div>
        </div>

        <p className="text-xs text-ink/50">
          © {year} {businessName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

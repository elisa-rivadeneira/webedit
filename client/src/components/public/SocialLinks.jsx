import { SOCIAL_META } from '../icons/SocialIcons';

export default function SocialLinks({ socials }) {
  const entries = Object.entries(socials || {}).filter(([, url]) => url);
  if (entries.length === 0) return null;

  return (
    <section id="contacto" className="bg-cream px-5 pb-16 sm:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
          Síguenos en nuestras redes
        </p>

        <div className="mt-6 flex flex-wrap items-start justify-center gap-8">
          {entries.map(([platform, url]) => {
            const meta = SOCIAL_META[platform];
            if (!meta) return null;
            const { Icon, label, bg } = meta;
            return (
              <a
                key={platform}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 text-sm font-medium text-ink/80 transition hover:text-ink"
              >
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow-md transition group-hover:scale-105"
                  style={{ background: bg }}
                >
                  <Icon className="h-7 w-7" />
                </span>
                {label}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

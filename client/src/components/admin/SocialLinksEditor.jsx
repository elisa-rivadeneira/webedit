import { SOCIAL_META } from '../icons/SocialIcons';

const ORDER = ['whatsapp', 'instagram', 'facebook', 'tiktok'];

export default function SocialLinksEditor({ socials, onChange }) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-ink">Enlaces a redes sociales</p>
      <div className="space-y-3 rounded-xl border border-ink/10 bg-white p-4">
        {ORDER.map((platform) => {
          const meta = SOCIAL_META[platform];
          const { Icon, label, bg } = meta;
          return (
            <div key={platform} className="flex items-center gap-3">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: bg }}
              >
                <Icon className="h-4.5 w-4.5" />
              </span>
              <span className="w-20 shrink-0 text-sm font-medium text-ink/80">{label}</span>
              <input
                type="url"
                inputMode="url"
                placeholder={`https://...`}
                value={socials[platform] || ''}
                onChange={(e) => onChange(platform, e.target.value)}
                className="flex-1 rounded-lg border border-ink/15 px-3 py-2 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

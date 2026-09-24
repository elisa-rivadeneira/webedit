import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function IconHome(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 11.5 12 4l8 7.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 10v9h12v-9" />
    </svg>
  );
}

function IconEye(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="2.7" />
    </svg>
  );
}

function IconLogout(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 16l4-4-4-4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H9" />
    </svg>
  );
}

export default function Sidebar({ businessName, logoUrl }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/admin');
  }

  return (
    <aside className="flex w-full shrink-0 flex-col bg-navy text-cream sm:w-64">
      <div className="flex items-center gap-3 px-5 py-6">
        {logoUrl ? (
          <img src={logoUrl} alt={businessName} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-light text-sm font-bold text-ink">
            {businessName?.charAt(0)?.toUpperCase() || 'M'}
          </span>
        )}
        <span className="font-display text-sm font-semibold leading-tight">{businessName}</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        <span className="flex items-center gap-3 rounded-lg bg-gold px-3 py-2.5 text-sm font-semibold text-ink">
          <IconHome className="h-5 w-5" />
          Editar contenido
        </span>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-cream/80 transition hover:bg-white/5"
        >
          <IconEye className="h-5 w-5" />
          Ver sitio
        </a>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-cream/80 transition hover:bg-white/5"
        >
          <IconLogout className="h-5 w-5" />
          Cerrar sesión
        </button>
      </nav>
    </aside>
  );
}

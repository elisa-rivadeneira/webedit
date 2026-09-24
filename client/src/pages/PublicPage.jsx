import { useSiteContent } from '../hooks/useSiteContent';
import Header from '../components/public/Header';
import Hero from '../components/public/Hero';
import Promotions from '../components/public/Promotions';
import SocialLinks from '../components/public/SocialLinks';
import Footer from '../components/public/Footer';

export default function PublicPage() {
  const { content, loading, error } = useSiteContent();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-ink/60">
        Cargando…
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream text-ink/60">
        No se pudo cargar la página.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream">
      <Header businessName={content.businessName} logoUrl={content.logoUrl} />
      <Hero
        heroTitle={content.heroTitle}
        heroDescription={content.heroDescription}
        heroImageUrl={content.heroImageUrl}
      />
      <Promotions promo1ImageUrl={content.promo1ImageUrl} promo2ImageUrl={content.promo2ImageUrl} />
      <SocialLinks socials={content.socials} />
      <Footer
        businessName={content.businessName}
        logoUrl={content.logoUrl}
        footerTagline={content.footerTagline}
      />
    </div>
  );
}

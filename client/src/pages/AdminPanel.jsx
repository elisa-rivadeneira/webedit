import { useEffect, useState } from 'react';
import { api } from '../api';
import { useSiteContent } from '../hooks/useSiteContent';
import { useFilePreview } from '../hooks/useFilePreview';
import Sidebar from '../components/admin/Sidebar';
import ImageField from '../components/admin/ImageField';
import SocialLinksEditor from '../components/admin/SocialLinksEditor';

export default function AdminPanel() {
  const { content, loading, reload } = useSiteContent();
  const [form, setForm] = useState(null);
  const [files, setFiles] = useState({ logo: null, heroImage: null, promo1: null, promo2: null });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [savedAt, setSavedAt] = useState(null);

  useEffect(() => {
    if (content && !form) {
      setForm({
        heroTitle: content.heroTitle,
        heroDescription: content.heroDescription,
        socials: { ...content.socials },
      });
    }
  }, [content, form]);

  const logoPreview = useFilePreview(files.logo, content?.logoUrl);
  const heroPreview = useFilePreview(files.heroImage, content?.heroImageUrl);
  const promo1Preview = useFilePreview(files.promo1, content?.promo1ImageUrl);
  const promo2Preview = useFilePreview(files.promo2, content?.promo2ImageUrl);

  if (loading || !form || !content) {
    return <div className="flex min-h-screen items-center justify-center text-ink/50">Cargando…</div>;
  }

  function updateSocial(platform, url) {
    setForm((f) => ({ ...f, socials: { ...f.socials, [platform]: url } }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaveError('');

    if (!form.heroTitle.trim() || !form.heroDescription.trim()) {
      setSaveError('El título principal y el texto descriptivo son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('heroTitle', form.heroTitle.trim());
      fd.append('heroDescription', form.heroDescription.trim());
      fd.append('businessName', content.businessName);
      fd.append('footerTagline', content.footerTagline);
      fd.append('socials', JSON.stringify(form.socials));
      if (files.logo) fd.append('logo', files.logo);
      if (files.heroImage) fd.append('heroImage', files.heroImage);
      if (files.promo1) fd.append('promo1', files.promo1);
      if (files.promo2) fd.append('promo2', files.promo2);

      await api.put('/content', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setFiles({ logo: null, heroImage: null, promo1: null, promo2: null });
      await reload();
      setSavedAt(Date.now());
    } catch (err) {
      setSaveError(err.response?.data?.error || 'No se pudieron guardar los cambios.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream-dark sm:flex-row">
      <Sidebar businessName={content.businessName} logoUrl={logoPreview} />

      <main className="flex-1 px-5 py-8 sm:px-10">
        <form onSubmit={handleSave} className="mx-auto max-w-3xl">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">Editar contenido del sitio</h1>
              <p className="mt-1 text-sm text-ink/60">
                Aquí puedes actualizar la información que se muestra en tu página web.
              </p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-accent-green px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-105 disabled:opacity-60"
            >
              {saving ? 'Guardando…' : '✓ Guardar cambios'}
            </button>
          </div>

          {saveError && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {saveError}
            </div>
          )}
          {savedAt && !saveError && (
            <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              Cambios guardados correctamente. La página pública ya está actualizada.
            </div>
          )}

          <div className="space-y-8">
            <ImageField
              label="Logo"
              helper="Recomendado: imagen en formato PNG y fondo transparente."
              sizeHint="Tamaño ideal: 500 × 500 px (cuadrada)"
              aiPrompt="Logo minimalista y profesional para el negocio [nombre de tu negocio], diseño plano, fondo transparente, colores dorado y crema, estilo elegante y sencillo, formato cuadrado 500x500 px"
              previewUrl={logoPreview}
              buttonLabel="Seleccionar imagen"
              rounded="rounded-full"
              onChange={(file) => setFiles((f) => ({ ...f, logo: file }))}
            />

            <div>
              <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="heroTitle">
                Texto principal (título)
              </label>
              <input
                id="heroTitle"
                type="text"
                value={form.heroTitle}
                onChange={(e) => setForm((f) => ({ ...f, heroTitle: e.target.value }))}
                className="w-full rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-ink" htmlFor="heroDescription">
                Texto secundario (descripción)
              </label>
              <textarea
                id="heroDescription"
                rows={3}
                value={form.heroDescription}
                onChange={(e) => setForm((f) => ({ ...f, heroDescription: e.target.value }))}
                className="w-full resize-none rounded-lg border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <ImageField
              label="Imagen principal"
              helper="Foto de ambiente o producto que se muestra de fondo en la sección principal."
              sizeHint="Tamaño ideal: 1600 × 900 px (horizontal, formato panorámico)"
              aiPrompt="Fotografía profesional y realista de [tu producto o el ambiente de tu negocio], iluminación cálida, alta resolución, formato horizontal panorámico 1600x900 px, espacio libre y oscuro del lado izquierdo para colocar texto encima"
              previewUrl={heroPreview}
              buttonLabel="Cambiar imagen"
              onChange={(file) => setFiles((f) => ({ ...f, heroImage: file }))}
            />

            <ImageField
              label="Promoción 1"
              helper="Sube una imagen completa de tu promoción. La imagen ya debe incluir el diseño, texto y precio."
              sizeHint="Tamaño ideal: 1200 × 900 px (formato 4:3)"
              aiPrompt="Diseño de flyer promocional para [tu producto o servicio], formato 4:3 (1200x900 px), incluye el texto '[nombre de la promoción]' y el precio '[S/ XX.XX]', fondo oscuro elegante, tipografía dorada, estilo profesional y comercial"
              previewUrl={promo1Preview}
              buttonLabel="Cambiar imagen"
              onChange={(file) => setFiles((f) => ({ ...f, promo1: file }))}
            />

            <ImageField
              label="Promoción 2"
              helper="Sube una imagen completa de tu promoción. La imagen ya debe incluir el diseño, texto y precio."
              sizeHint="Tamaño ideal: 1200 × 900 px (formato 4:3)"
              aiPrompt="Diseño de flyer promocional para [tu producto o servicio], formato 4:3 (1200x900 px), incluye el texto '[nombre de la promoción]' y el precio '[S/ XX.XX]', fondo oscuro elegante, tipografía dorada, estilo profesional y comercial"
              previewUrl={promo2Preview}
              buttonLabel="Cambiar imagen"
              onChange={(file) => setFiles((f) => ({ ...f, promo2: file }))}
            />

            <SocialLinksEditor socials={form.socials} onChange={updateSocial} />
          </div>
        </form>
      </main>
    </div>
  );
}

const express = require('express');
const { supabase } = require('../supabase');
const { upload, uploadToSupabase, safeDeleteFromSupabase } = require('../upload');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

const SOCIAL_PLATFORMS = ['whatsapp', 'instagram', 'facebook', 'tiktok'];

async function getContent() {
  const { data: row, error: contentError } = await supabase
    .from('site_content')
    .select('*')
    .eq('id', 1)
    .single();
  if (contentError) throw contentError;

  const { data: socialsRows, error: socialsError } = await supabase
    .from('social_links')
    .select('platform, url');
  if (socialsError) throw socialsError;

  const socials = {};
  for (const platform of SOCIAL_PLATFORMS) {
    const found = socialsRows.find((s) => s.platform === platform);
    socials[platform] = found ? found.url : '';
  }

  return {
    businessName: row.business_name,
    logoUrl: row.logo_url,
    heroTitle: row.hero_title,
    heroDescription: row.hero_description,
    heroImageUrl: row.hero_image_url,
    promo1ImageUrl: row.promo1_image_url,
    promo2ImageUrl: row.promo2_image_url,
    footerTagline: row.footer_tagline,
    socials,
  };
}

router.get('/', async (req, res) => {
  try {
    res.json(await getContent());
  } catch (e) {
    console.error('GET /api/content failed:', e);
    res.status(500).json({ error: 'No se pudo cargar el contenido' });
  }
});

const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'promo1', maxCount: 1 },
  { name: 'promo2', maxCount: 1 },
]);

router.put('/', requireAuth, (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message || 'Error al subir la imagen' });
    }

    const { businessName, heroTitle, heroDescription, footerTagline } = req.body;

    if (!heroTitle || !heroTitle.trim()) {
      return res.status(400).json({ error: 'El título principal es obligatorio' });
    }
    if (!heroDescription || !heroDescription.trim()) {
      return res.status(400).json({ error: 'El texto descriptivo es obligatorio' });
    }

    let socials = {};
    if (req.body.socials) {
      try {
        socials = JSON.parse(req.body.socials);
      } catch {
        return res.status(400).json({ error: 'Enlaces de redes sociales inválidos' });
      }
    }

    try {
      const { data: current, error: currentError } = await supabase
        .from('site_content')
        .select('*')
        .eq('id', 1)
        .single();
      if (currentError) throw currentError;

      const files = req.files || {};

      const [nextLogo, nextHero, nextPromo1, nextPromo2] = await Promise.all([
        files.logo ? uploadToSupabase(files.logo[0]) : current.logo_url,
        files.heroImage ? uploadToSupabase(files.heroImage[0]) : current.hero_image_url,
        files.promo1 ? uploadToSupabase(files.promo1[0]) : current.promo1_image_url,
        files.promo2 ? uploadToSupabase(files.promo2[0]) : current.promo2_image_url,
      ]);

      if (files.logo) safeDeleteFromSupabase(current.logo_url);
      if (files.heroImage) safeDeleteFromSupabase(current.hero_image_url);
      if (files.promo1) safeDeleteFromSupabase(current.promo1_image_url);
      if (files.promo2) safeDeleteFromSupabase(current.promo2_image_url);

      const { error: updateError } = await supabase
        .from('site_content')
        .update({
          business_name: (businessName || '').trim(),
          logo_url: nextLogo,
          hero_title: heroTitle.trim(),
          hero_description: heroDescription.trim(),
          hero_image_url: nextHero,
          promo1_image_url: nextPromo1,
          promo2_image_url: nextPromo2,
          footer_tagline: (footerTagline || '').trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', 1);
      if (updateError) throw updateError;

      for (const platform of SOCIAL_PLATFORMS) {
        if (Object.prototype.hasOwnProperty.call(socials, platform)) {
          const { error: socialError } = await supabase
            .from('social_links')
            .update({ url: (socials[platform] || '').trim() })
            .eq('platform', platform);
          if (socialError) throw socialError;
        }
      }

      res.json(await getContent());
    } catch (e) {
      res.status(500).json({ error: e.message || 'No se pudieron guardar los cambios' });
    }
  });
});

module.exports = router;

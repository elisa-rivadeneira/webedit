const express = require('express');
const fs = require('fs');
const path = require('path');
const { db, SOCIAL_PLATFORMS } = require('../db');
const { upload, uploadsDir } = require('../upload');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();

function getContent() {
  const row = db.prepare('SELECT * FROM site_content WHERE id = 1').get();
  const socialsRows = db.prepare('SELECT platform, url FROM social_links').all();
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

function safeUnlink(url) {
  if (!url || !url.startsWith('/uploads/')) return;
  const filePath = path.join(uploadsDir, path.basename(url));
  fs.unlink(filePath, () => {});
}

router.get('/', (req, res) => {
  res.json(getContent());
});

const uploadFields = upload.fields([
  { name: 'logo', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'promo1', maxCount: 1 },
  { name: 'promo2', maxCount: 1 },
]);

router.put('/', requireAuth, (req, res) => {
  uploadFields(req, res, (err) => {
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

    const current = db.prepare('SELECT * FROM site_content WHERE id = 1').get();
    const files = req.files || {};

    const nextLogo = files.logo ? `/uploads/${files.logo[0].filename}` : current.logo_url;
    const nextHero = files.heroImage ? `/uploads/${files.heroImage[0].filename}` : current.hero_image_url;
    const nextPromo1 = files.promo1 ? `/uploads/${files.promo1[0].filename}` : current.promo1_image_url;
    const nextPromo2 = files.promo2 ? `/uploads/${files.promo2[0].filename}` : current.promo2_image_url;

    if (files.logo) safeUnlink(current.logo_url);
    if (files.heroImage) safeUnlink(current.hero_image_url);
    if (files.promo1) safeUnlink(current.promo1_image_url);
    if (files.promo2) safeUnlink(current.promo2_image_url);

    db.prepare(
      `UPDATE site_content SET
        business_name = ?,
        logo_url = ?,
        hero_title = ?,
        hero_description = ?,
        hero_image_url = ?,
        promo1_image_url = ?,
        promo2_image_url = ?,
        footer_tagline = ?,
        updated_at = datetime('now')
      WHERE id = 1`
    ).run(
      (businessName || '').trim(),
      nextLogo,
      heroTitle.trim(),
      heroDescription.trim(),
      nextHero,
      nextPromo1,
      nextPromo2,
      (footerTagline || '').trim()
    );

    const updateSocial = db.prepare('UPDATE social_links SET url = ? WHERE platform = ?');
    for (const platform of SOCIAL_PLATFORMS) {
      if (Object.prototype.hasOwnProperty.call(socials, platform)) {
        updateSocial.run((socials[platform] || '').trim(), platform);
      }
    }

    res.json(getContent());
  });
});

module.exports = router;

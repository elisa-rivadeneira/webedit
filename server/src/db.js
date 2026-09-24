const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new Database(path.join(dataDir, 'app.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    business_name TEXT NOT NULL DEFAULT '',
    logo_url TEXT NOT NULL DEFAULT '',
    hero_title TEXT NOT NULL DEFAULT '',
    hero_description TEXT NOT NULL DEFAULT '',
    hero_image_url TEXT NOT NULL DEFAULT '',
    promo1_image_url TEXT NOT NULL DEFAULT '',
    promo2_image_url TEXT NOT NULL DEFAULT '',
    footer_tagline TEXT NOT NULL DEFAULT '',
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS social_links (
    platform TEXT PRIMARY KEY,
    url TEXT NOT NULL DEFAULT ''
  );
`);

const contentRow = db.prepare('SELECT id FROM site_content WHERE id = 1').get();
if (!contentRow) {
  db.prepare(
    `INSERT INTO site_content (id, business_name, hero_title, hero_description, footer_tagline)
     VALUES (1, 'Mi Negocio', 'Bienvenido a nuestro negocio', 'Cuéntanos qué ofreces en pocas palabras.', 'Gracias por visitarnos.')`
  ).run();
}

const SOCIAL_PLATFORMS = ['whatsapp', 'instagram', 'facebook', 'tiktok'];
const insertSocial = db.prepare(
  'INSERT OR IGNORE INTO social_links (platform, url) VALUES (?, ?)'
);
for (const platform of SOCIAL_PLATFORMS) {
  insertSocial.run(platform, '');
}

module.exports = { db, SOCIAL_PLATFORMS };

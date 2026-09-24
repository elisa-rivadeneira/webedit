const crypto = require('crypto');
const path = require('path');
const multer = require('multer');
const { supabase, UPLOADS_BUCKET } = require('./supabase');

const ALLOWED_TYPES = new Set(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml']);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_TYPES.has(file.mimetype)) {
      return cb(new Error('Formato de imagen no permitido'));
    }
    cb(null, true);
  },
});

async function uploadToSupabase(file) {
  const ext = path.extname(file.originalname).toLowerCase() || '';
  const fileName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;

  const { error } = await supabase.storage
    .from(UPLOADS_BUCKET)
    .upload(fileName, file.buffer, { contentType: file.mimetype, upsert: false });

  if (error) throw new Error(`No se pudo subir la imagen: ${error.message}`);

  const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(fileName);
  return data.publicUrl;
}

function safeDeleteFromSupabase(publicUrl) {
  if (!publicUrl || !publicUrl.includes(`/${UPLOADS_BUCKET}/`)) return;
  const fileName = publicUrl.split(`/${UPLOADS_BUCKET}/`).pop();
  if (!fileName) return;
  supabase.storage
    .from(UPLOADS_BUCKET)
    .remove([fileName])
    .catch(() => {});
}

module.exports = { upload, uploadToSupabase, safeDeleteFromSupabase };

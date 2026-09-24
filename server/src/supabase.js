const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    'Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno (server/.env).'
  );
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
  realtime: { transport: WebSocket },
});

const UPLOADS_BUCKET = 'uploads';

module.exports = { supabase, UPLOADS_BUCKET };

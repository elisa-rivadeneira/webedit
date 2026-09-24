require('dotenv').config();
const bcrypt = require('bcryptjs');
const { supabase } = require('./supabase');

async function main() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  const hash = bcrypt.hashSync(password, 10);

  const { data: existing, error: findError } = await supabase
    .from('admin_users')
    .select('id')
    .eq('username', username)
    .maybeSingle();
  if (findError) throw findError;

  if (existing) {
    const { error } = await supabase
      .from('admin_users')
      .update({ password_hash: hash })
      .eq('username', username);
    if (error) throw error;
    console.log(`Admin user "${username}" password updated.`);
  } else {
    const { error } = await supabase
      .from('admin_users')
      .insert({ username, password_hash: hash });
    if (error) throw error;
    console.log(`Admin user "${username}" created.`);
  }

  console.log(`Login credentials -> usuario: ${username} / contraseña: ${password}`);
}

main().catch((err) => {
  console.error('Error al crear el usuario administrador:', err.message);
  console.error('¿Ya ejecutaste server/supabase-schema.sql en Supabase y llenaste server/.env?');
  process.exit(1);
});

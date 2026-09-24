const bcrypt = require('bcryptjs');
const { db } = require('./db');

const username = process.env.ADMIN_USERNAME || 'admin';
const password = process.env.ADMIN_PASSWORD || 'admin123';

const existing = db.prepare('SELECT id FROM admin_users WHERE username = ?').get(username);
const hash = bcrypt.hashSync(password, 10);

if (existing) {
  db.prepare('UPDATE admin_users SET password_hash = ? WHERE username = ?').run(hash, username);
  console.log(`Admin user "${username}" password updated.`);
} else {
  db.prepare('INSERT INTO admin_users (username, password_hash) VALUES (?, ?)').run(username, hash);
  console.log(`Admin user "${username}" created.`);
}

console.log(`Login credentials -> usuario: ${username} / contraseña: ${password}`);

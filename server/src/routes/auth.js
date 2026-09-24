const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { supabase } = require('../supabase');

const router = express.Router();

const COOKIE_NAME = 'session';
const COOKIE_MAX_AGE = 1000 * 60 * 60 * 8; // 8 horas

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: COOKIE_MAX_AGE,
  };
}

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const { data: user, error } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  if (error) return res.status(500).json({ error: 'Error del servidor' });
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '8h',
  });
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.json({ username: user.username });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.json({ ok: true });
});

router.get('/me', (req, res) => {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.json({ authenticated: false });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ authenticated: true, username: payload.username });
  } catch {
    res.json({ authenticated: false });
  }
});

module.exports = router;

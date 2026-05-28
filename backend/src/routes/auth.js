import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not set');
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body ?? {};
  if (!username?.trim() || !email?.trim() || !password) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
  }
  if (!EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen haben.' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.create({ username: username.trim(), email: email.trim(), passwordHash });
    const token = signToken(user);
    res.status(201).json({ token, user });
  } catch (err) {
    if (err.code === 'DUPLICATE') {
      return res.status(409).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email?.trim() || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' });
  }
  const row = User.findByEmail(email.trim());
  const valid = row && await bcrypt.compare(password, row.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Ungültige Anmeldedaten.' });
  }
  const { password_hash: _, ...user } = row;
  const token = signToken(user);
  res.json({ token, user });
});

router.get('/me', requireAuth, (req, res) => {
  const user = User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'Nicht gefunden.' });
  res.json({ user });
});

router.patch('/me', requireAuth, async (req, res) => {
  const { username, email, password } = req.body ?? {};
  if (email !== undefined && email.trim() && !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
  }
  try {
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const updates = {
      ...(username !== undefined && { username: username.trim() }),
      ...(email !== undefined && { email: email.trim() }),
      ...(passwordHash !== undefined && { passwordHash }),
    };
    const user = User.update(req.user.id, updates);
    res.json({ user });
  } catch (err) {
    if (err.code === 'DUPLICATE') {
      return res.status(409).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

export default router;

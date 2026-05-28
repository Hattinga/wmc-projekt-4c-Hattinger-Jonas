import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';

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
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Alle Felder sind erforderlich.' });
  }
  if (password.length < 8) {
    return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen haben.' });
  }
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = User.create({ username, email, passwordHash });
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
  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort erforderlich.' });
  }
  const row = User.findByEmail(email);
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
  try {
    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = User.update(req.user.id, { username, email, passwordHash });
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

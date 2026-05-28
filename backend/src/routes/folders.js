import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Folder } from '../models/Folder.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json({ folders: Folder.findAll(req.user.id) });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
  const folder = Folder.findById(id, req.user.id);
  if (!folder) return res.status(404).json({ error: 'Ordner nicht gefunden.' });
  res.json({ folder });
});

router.post('/', (req, res) => {
  const { name, parentId } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Name erforderlich.' });
  const folder = Folder.create({ name: name.trim(), userId: req.user.id, parentId: parentId ?? null });
  res.status(201).json({ folder });
});

router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
  const { name } = req.body ?? {};
  if (name !== undefined && !name?.trim()) {
    return res.status(400).json({ error: 'Name darf nicht leer sein.' });
  }
  try {
    const folder = Folder.update(id, req.user.id, req.body);
    if (!folder) return res.status(404).json({ error: 'Ordner nicht gefunden.' });
    res.json({ folder });
  } catch (err) {
    if (err.message === 'CIRCULAR') {
      return res.status(400).json({ error: 'Zirkulärer Eltern-Pfad nicht erlaubt.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Interner Serverfehler.' });
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
  const changes = Folder.delete(id, req.user.id);
  if (!changes) return res.status(404).json({ error: 'Ordner nicht gefunden.' });
  res.status(204).end();
});

export default router;

import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Tag } from '../models/Tag.js';
import { Note } from '../models/Note.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  res.json({ tags: Tag.findAll(req.user.id) });
});

router.post('/', (req, res) => {
  const { name } = req.body ?? {};
  if (!name?.trim()) return res.status(400).json({ error: 'Name erforderlich.' });
  try {
    const tag = Tag.create({ name: name.trim(), userId: req.user.id });
    res.status(201).json({ tag });
  } catch (err) {
    if (err.status === 409) {
      return res.status(409).json({ error: 'Tag already exists.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
  const changes = Tag.delete(id, req.user.id);
  if (!changes) return res.status(404).json({ error: 'Tag nicht gefunden.' });
  res.status(204).end();
});

router.post('/notes/:noteId', (req, res) => {
  const noteId = Number(req.params.noteId);
  const { tagId } = req.body ?? {};
  if (!noteId || !tagId) return res.status(400).json({ error: 'noteId und tagId erforderlich.' });
  if (!Note.findById(noteId, req.user.id)) return res.status(404).json({ error: 'Notiz nicht gefunden.' });
  Tag.addToNote(Number(tagId), noteId);
  res.status(201).end();
});

router.delete('/notes/:noteId/:tagId', (req, res) => {
  const noteId = Number(req.params.noteId);
  const tagId = Number(req.params.tagId);
  if (!noteId || !tagId) return res.status(400).json({ error: 'Ungültige IDs.' });
  if (!Note.findById(noteId, req.user.id)) return res.status(404).json({ error: 'Notiz nicht gefunden.' });
  Tag.removeFromNote(tagId, noteId);
  res.status(204).end();
});

export default router;

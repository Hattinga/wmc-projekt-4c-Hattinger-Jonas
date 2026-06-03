import { Router } from 'express';
import { Note } from '../models/Note.js';
import { Folder } from '../models/Folder.js';
import { requireAuth } from '../middleware/auth.js';
import { emitNoteUpdated, emitNoteDeleted } from '../websocket/handler.js';

export default function createNotesRouter(io) {
  const router = Router();

  router.use(requireAuth);

  router.get('/', (req, res) => {
    res.json({ notes: Note.findAll(req.user.id) });
  });

  router.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
    const note = Note.findById(id, req.user.id);
    if (!note) return res.status(404).json({ error: 'Notiz nicht gefunden.' });
    res.json({ note });
  });

  router.post('/', (req, res) => {
    const { title, content, folderId } = req.body ?? {};
    if (title !== undefined && !title?.trim()) {
      return res.status(400).json({ error: 'Titel darf nicht leer sein.' });
    }
    if (folderId != null) {
      const folder = Folder.findById(Number(folderId), req.user.id);
      if (!folder) return res.status(400).json({ error: 'Ordner nicht gefunden.' });
    }
    const note = Note.create({ userId: req.user.id, title, content, folderId: folderId ?? null });
    res.status(201).json({ note });
  });

  router.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
    const { title, content, folderId } = req.body ?? {};
    if (title !== undefined && !title?.trim()) {
      return res.status(400).json({ error: 'Titel darf nicht leer sein.' });
    }
    if (folderId != null) {
      const folder = Folder.findById(Number(folderId), req.user.id);
      if (!folder) return res.status(400).json({ error: 'Ordner nicht gefunden.' });
    }
    const updates = { content };
    if (title !== undefined) updates.title = title;
    if ('folderId' in (req.body ?? {})) updates.folderId = folderId ?? null;
    const note = Note.update(id, req.user.id, updates);
    if (!note) return res.status(404).json({ error: 'Notiz nicht gefunden.' });
    res.json({ note });
    emitNoteUpdated(io, req.user.id, note);
  });

  router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
    const changes = Note.delete(id, req.user.id);
    if (!changes) return res.status(404).json({ error: 'Notiz nicht gefunden.' });
    emitNoteDeleted(io, req.user.id, id);
    res.status(204).end();
  });

  return router;
}

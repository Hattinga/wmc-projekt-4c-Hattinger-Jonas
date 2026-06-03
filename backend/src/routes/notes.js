import { Router } from 'express';
import { Note } from '../models/Note.js';
import { Folder } from '../models/Folder.js';
import { requireAuth } from '../middleware/auth.js';
import { syncLinks } from '../utils/linkExtractor.js';
import { emitNoteUpdated, emitNoteDeleted } from '../websocket/handler.js';
import db from '../config/database.js';

const stmtBacklinks = db.prepare(`
  SELECT n.id, n.title, n.content, f.name AS folder
  FROM note_links nl
  JOIN notes n ON nl.source_id = n.id
  LEFT JOIN folders f ON n.folder_id = f.id
  WHERE nl.target_id = ? AND n.user_id = ?
`);

export default function createNotesRouter(io) {
  const router = Router();

  router.use(requireAuth);

  router.get('/', (req, res) => {
    res.json({ notes: Note.findAll(req.user.id) });
  });

  router.get('/:id/backlinks', (req, res) => {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: 'Ungültige ID.' });
    const backlinks = stmtBacklinks.all(id, req.user.id);
    res.json({ backlinks });
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
    syncLinks(note.id, content || '', req.user.id);
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
    syncLinks(id, content ?? note.content ?? '', req.user.id);
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

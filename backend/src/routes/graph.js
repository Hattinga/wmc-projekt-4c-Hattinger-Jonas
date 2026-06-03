import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import db from '../config/database.js';

const router = Router();

const stmtNodes = db.prepare('SELECT id, title FROM notes WHERE user_id = ?');
const stmtEdges = db.prepare(`
  SELECT nl.source_id AS source, nl.target_id AS target
  FROM note_links nl
  JOIN notes n ON nl.source_id = n.id
  WHERE n.user_id = ?
`);

router.get('/', requireAuth, (req, res) => {
  const nodes = stmtNodes.all(req.user.id);
  const edges = stmtEdges.all(req.user.id);
  res.json({ nodes, edges });
});

export default router;

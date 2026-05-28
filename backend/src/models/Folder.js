import db from '../config/database.js';

const stmtFindAll = db.prepare(`
  SELECT f.id, f.name, f.parent_id, f.created_at,
         (SELECT COUNT(*) FROM notes WHERE folder_id = f.id) AS count
  FROM folders f
  WHERE f.user_id = ?
  ORDER BY f.name ASC
`);

const stmtFindById = db.prepare(`
  SELECT f.id, f.name, f.parent_id, f.created_at,
         (SELECT COUNT(*) FROM notes WHERE folder_id = f.id) AS count
  FROM folders f
  WHERE f.id = ? AND f.user_id = ?
`);

const stmtInsert = db.prepare(
  `INSERT INTO folders (name, user_id, parent_id) VALUES (?, ?, ?)`
);

const stmtDelete = db.prepare(
  `DELETE FROM folders WHERE id = ? AND user_id = ?`
);

export const Folder = {
  findAll(userId) {
    return stmtFindAll.all(userId);
  },
  findById(id, userId) {
    return stmtFindById.get(id, userId) ?? null;
  },
  create({ name, userId, parentId = null }) {
    const { lastInsertRowid } = stmtInsert.run(name, userId, parentId);
    return this.findById(lastInsertRowid, userId);
  },
  // Dynamic update: supports parent_id = null, detects circular chains
  update(id, userId, updates = {}) {
    if ('parentId' in updates && updates.parentId != null) {
      let cur = updates.parentId;
      const seen = new Set([id]);
      while (cur != null) {
        if (seen.has(cur)) throw new Error('CIRCULAR');
        seen.add(cur);
        const row = db.prepare('SELECT parent_id FROM folders WHERE id = ?').get(cur);
        cur = row?.parent_id ?? null;
      }
    }
    const sets = [];
    const vals = [];
    if (updates.name !== undefined) {
      sets.push('name = COALESCE(?, name)');
      vals.push(updates.name?.trim() || null);
    }
    if ('parentId' in updates) {
      sets.push('parent_id = ?');
      vals.push(updates.parentId ?? null);
    }
    if (sets.length > 0) {
      db.prepare(`UPDATE folders SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`)
        .run(...vals, id, userId);
    }
    return this.findById(id, userId);
  },
  delete(id, userId) {
    return stmtDelete.run(id, userId).changes;
  },
};

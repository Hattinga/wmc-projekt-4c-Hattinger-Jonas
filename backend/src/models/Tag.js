import db from '../config/database.js';

const stmtFindAll = db.prepare(`
  SELECT t.id, t.name, t.user_id,
         COUNT(nt.note_id) AS note_count
  FROM tags t
  LEFT JOIN note_tags nt ON nt.tag_id = t.id
  WHERE t.user_id = ?
  GROUP BY t.id
  ORDER BY t.name ASC
`);

const stmtInsert = db.prepare(
  'INSERT INTO tags (name, user_id) VALUES (?, ?)'
);

const stmtDelete = db.prepare(
  'DELETE FROM tags WHERE id = ? AND user_id = ?'
);

const stmtAddToNote = db.prepare(
  'INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)'
);

const stmtRemoveFromNote = db.prepare(
  'DELETE FROM note_tags WHERE note_id = ? AND tag_id = ?'
);

export const Tag = {
  findAll(userId) {
    return stmtFindAll.all(userId);
  },

  create({ name, userId }) {
    try {
      const { lastInsertRowid } = stmtInsert.run(name, userId);
      return { id: Number(lastInsertRowid), name, user_id: userId, note_count: 0 };
    } catch (err) {
      if (err.message?.includes('UNIQUE constraint failed')) {
        const conflict = new Error('Tag already exists');
        conflict.status = 409;
        throw conflict;
      }
      throw err;
    }
  },

  delete(id, userId) {
    return stmtDelete.run(id, userId).changes;
  },

  addToNote(tagId, noteId) {
    stmtAddToNote.run(noteId, tagId);
  },

  removeFromNote(tagId, noteId) {
    stmtRemoveFromNote.run(noteId, tagId);
  },
};

import db from '../config/database.js';

const stmtFindAll = db.prepare(`
  SELECT n.id, n.title, n.content, n.folder_id,
         n.created_at, n.updated_at,
         f.name AS folder,
         (SELECT COUNT(*) FROM note_links WHERE target_id = n.id) AS backlinks,
         (SELECT json_group_array(json_object('id', t.id, 'name', t.name))
          FROM note_tags nt JOIN tags t ON nt.tag_id = t.id
          WHERE nt.note_id = n.id) AS tags_json
  FROM notes n
  LEFT JOIN folders f ON n.folder_id = f.id
  WHERE n.user_id = ?
  ORDER BY n.updated_at DESC
`);

const stmtFindById = db.prepare(`
  SELECT n.id, n.title, n.content, n.folder_id,
         n.created_at, n.updated_at,
         f.name AS folder,
         (SELECT COUNT(*) FROM note_links WHERE target_id = n.id) AS backlinks,
         (SELECT json_group_array(json_object('id', t.id, 'name', t.name))
          FROM note_tags nt JOIN tags t ON nt.tag_id = t.id
          WHERE nt.note_id = n.id) AS tags_json
  FROM notes n
  LEFT JOIN folders f ON n.folder_id = f.id
  WHERE n.id = ? AND n.user_id = ?
`);

const stmtInsert = db.prepare(
  'INSERT INTO notes (title, content, user_id, folder_id) VALUES (?, ?, ?, ?)'
);

const stmtDelete = db.prepare('DELETE FROM notes WHERE id = ? AND user_id = ?');

function withTags(row) {
  if (!row) return null;
  const { tags_json, ...rest } = row;
  return { ...rest, tags: JSON.parse(tags_json || '[]') };
}

export const Note = {
  findAll(userId) {
    return stmtFindAll.all(userId).map(withTags);
  },

  findById(id, userId) {
    return withTags(stmtFindById.get(id, userId));
  },

  create({ userId, title = 'Neue Notiz', content = '', folderId = null }) {
    const { lastInsertRowid } = stmtInsert.run(title, content, userId, folderId);
    return this.findById(lastInsertRowid, userId);
  },

  // Dynamic update so folder_id can explicitly be set to null (COALESCE can't clear it)
  update(id, userId, updates = {}) {
    const sets = [];
    const vals = [];
    if (updates.title !== undefined) {
      sets.push('title = ?');
      vals.push(updates.title ?? null);
    }
    if (updates.content !== undefined) {
      sets.push('content = ?');
      vals.push(updates.content ?? null);
    }
    if ('folderId' in updates) {
      sets.push('folder_id = ?');
      vals.push(updates.folderId ?? null);
    }
    if (sets.length > 0) {
      db.prepare(`UPDATE notes SET ${sets.join(', ')} WHERE id = ? AND user_id = ?`)
        .run(...vals, id, userId);
    }
    return this.findById(id, userId);
  },

  delete(id, userId) {
    return stmtDelete.run(id, userId).changes;
  },
};

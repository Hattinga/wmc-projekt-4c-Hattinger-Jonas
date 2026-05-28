import db from '../config/database.js';

const stmtInsert = db.prepare(
  'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
);
const stmtByEmail = db.prepare('SELECT * FROM users WHERE email = ?');
const stmtById = db.prepare(
  'SELECT id, username, email, created_at FROM users WHERE id = ?'
);
const stmtUpdate = db.prepare(
  `UPDATE users SET
    username      = COALESCE(?, username),
    email         = COALESCE(?, email),
    password_hash = COALESCE(?, password_hash)
  WHERE id = ?`
);
const stmtDelete = db.prepare('DELETE FROM users WHERE id = ?');

export const User = {
  create({ username, email, passwordHash }) {
    try {
      const { lastInsertRowid } = stmtInsert.run(username, email, passwordHash);
      return stmtById.get(lastInsertRowid);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const e = new Error('Benutzername oder E-Mail bereits vergeben.');
        e.code = 'DUPLICATE';
        throw e;
      }
      throw err;
    }
  },

  findByEmail(email) {
    return stmtByEmail.get(email) ?? null;
  },

  findById(id) {
    return stmtById.get(id) ?? null;
  },

  update(id, { username, email, passwordHash } = {}) {
    try {
      stmtUpdate.run(username ?? null, email ?? null, passwordHash ?? null, id);
      return this.findById(id);
    } catch (err) {
      if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
        const e = new Error('Benutzername oder E-Mail bereits vergeben.');
        e.code = 'DUPLICATE';
        throw e;
      }
      throw err;
    }
  },

  delete(id) {
    stmtDelete.run(id);
  },
};

import db from '../config/database.js';

const stmtResolveTitle = db.prepare(
  'SELECT id FROM notes WHERE lower(title) = ? AND user_id = ?'
);
const stmtDeleteLinks = db.prepare('DELETE FROM note_links WHERE source_id = ?');
const stmtInsertLink = db.prepare(
  'INSERT OR IGNORE INTO note_links (source_id, target_id) VALUES (?, ?)'
);

/**
 * Extrahiert alle [[Titel]]-Links aus Markdown-Content.
 * @param {string} content
 * @returns {string[]} Deduplizierte lowercase Titelliste
 */
export function extractTitles(content) {
  if (!content) return [];
  const matches = [...content.matchAll(/\[\[([^\]]+)\]\]/g)];
  return [...new Set(matches.map(m => m[1].toLowerCase()))];
}

/**
 * Synchronisiert die note_links-Tabelle für eine Note nach dem Speichern.
 * Löscht alle alten Links der Note und legt neue an (in einer Transaktion).
 * @param {number} noteId - ID der Quell-Note
 * @param {string} content - Aktueller Inhalt der Note
 * @param {number} userId - User-ID (nur Notizen desselben Users werden verlinkt)
 */
export const syncLinks = db.transaction((noteId, content, userId) => {
  const titles = extractTitles(content);
  stmtDeleteLinks.run(noteId);
  for (const title of titles) {
    const target = stmtResolveTitle.get(title, userId);
    if (target && target.id !== noteId) {
      stmtInsertLink.run(noteId, target.id);
    }
  }
});

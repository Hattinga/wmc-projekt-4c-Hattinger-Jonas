// [[Note Title]]-Syntax Parser
// Wird client-seitig für Live-Preview und server-seitig für Backlink-Updates verwendet.

/**
 * Extrahiert alle verlinkten Notiz-Titel aus einem Markdown-Text.
 * @param {string} content - Markdown-Text
 * @returns {string[]} - Deduplizierte Liste der verlinkten Titel
 */
export function extractLinks(content) {
  if (!content) return [];
  const matches = [...content.matchAll(/\[\[([^\]]+)\]\]/g)];
  return [...new Set(matches.map(m => m[1]))];
}

/**
 * Ersetzt [[Titel]]-Links durch Markdown-Links basierend auf bekannten Notizen.
 * @param {string} content - Markdown-Text mit [[Links]]
 * @param {Array} notes - Array von { id, title }
 * @returns {string} - Markdown mit ersetzten Links
 */
export function replaceLinks(content, notes) {
  if (!content) return '';
  return content.replace(/\[\[([^\]]+)\]\]/g, (match, title) => {
    const note = notes.find(n => n.title === title);
    return note ? `[${title}](/note/${note.id})` : match;
  });
}

/**
 * Prüft ob ein Text einen bestimmten Notiz-Titel verlinkt.
 * @param {string} content
 * @param {string} title
 * @returns {boolean}
 */
export function linksTo(content, title) {
  return extractLinks(content).includes(title);
}

// Markdown → HTML Parser
// Konvertiert [[Note]]-Links zu klickbaren Wiki-Links.

export function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Rendert Markdown-Content zu HTML.
 * XSS-sicher: Code-Blöcke und Wiki-Links werden via Platzhalter geschützt,
 * danach wird der gesamte restliche Text HTML-escaped bevor Markdown angewendet wird.
 *
 * @param {string} content - Markdown-Text
 * @param {Array} notes - Liste aller Notizen für [[Link]]-Auflösung (case-insensitive)
 * @returns {string} - sicherer HTML-String
 */
export function renderMarkdown(content, notes = []) {
  if (!content) return '';

  const htmlStore = [];
  const ph = (html) => {
    const idx = htmlStore.length;
    htmlStore.push(html);
    return `\x00${idx}\x00`;
  };

  // Step 1: Code-Blöcke und Inline-Code extrahieren + escapen, als Platzhalter sichern
  let text = content
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      ph(`<pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`)
    )
    .replace(/`([^`]+)`/g, (_, code) =>
      ph(`<code>${escapeHtml(code)}</code>`)
    );

  // Step 2: Wiki-Links vor dem Escaping auflösen (case-insensitive); Titel wird escaped
  text = text.replace(/\[\[([^\]]+)\]\]/g, (_, title) => {
    const lower = title.toLowerCase();
    const note = notes.find(n => n.title?.toLowerCase() === lower);
    const href = note ? `/note/${note.id}` : '#';
    return ph(`<a href="${escapeHtml(href)}" class="wiki-link">${escapeHtml(title)}</a>`);
  });

  // Step 3: Gesamten verbleibenden Text HTML-escapen (verhindert XSS)
  text = escapeHtml(text);

  // Step 4: Markdown-Formatierung auf dem escapten Text anwenden
  // Blockquote: > wurde zu &gt; durch escapeHtml
  let html = text
    .replace(/^&gt; (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Step 5: Platzhalter durch echtes HTML ersetzen
  html = html.replace(/\x00(\d+)\x00/g, (_, idx) => htmlStore[+idx]);

  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<pre') && !html.startsWith('<blockquote')) {
    html = `<p>${html}</p>`;
  }

  return html;
}

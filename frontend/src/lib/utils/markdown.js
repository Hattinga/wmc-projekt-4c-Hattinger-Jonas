// Markdown → HTML Parser
// Konvertiert [[Note]]-Links zu klickbaren Wiki-Links.

/**
 * Rendert Markdown-Content zu HTML.
 * @param {string} content - Markdown-Text
 * @param {Array} notes - Liste aller Notizen für [[Link]]-Auflösung
 * @returns {string} - HTML-String
 */
export function renderMarkdown(content, notes = []) {
  if (!content) return '';

  // Einfacher Markdown-Parser (wird später durch marked.js ersetzt)
  let html = content
    // Code-Blöcke (vor allem anderen)
    .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
      `<pre><code class="language-${lang || ''}">${escapeHtml(code.trim())}</code></pre>`
    )
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote><p>$1</p></blockquote>')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Listen
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Bold + Italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // [[Wiki-Links]]
    .replace(/\[\[([^\]]+)\]\]/g, (_, title) => {
      const note = notes.find(n => n.title === title);
      const href = note ? `/note/${note.id}` : '#';
      return `<a href="${href}" class="wiki-link">${title}</a>`;
    })
    // Paragraphen
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');

  // Wrap in paragraph wenn kein Block-Element
  if (!html.startsWith('<h') && !html.startsWith('<ul') && !html.startsWith('<pre') && !html.startsWith('<blockquote')) {
    html = `<p>${html}</p>`;
  }

  return html;
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

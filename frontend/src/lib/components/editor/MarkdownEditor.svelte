<script>
  import Icon from '$lib/components/ui/Icon.svelte';
  import { appState } from '$lib/stores/appState.svelte.js';
  import { renderMarkdown } from '$lib/utils/markdown.js';
  import { extractLinks } from '$lib/utils/linkParser.js';

  let { content = $bindable(''), notes = [] } = $props();

  let textarea;
  let autocompleteOpen = $state(false);
  let autocompleteFilter = $state('');
  let wordCount = $derived(content.trim().split(/\s+/).filter(Boolean).length);

  let suggestions = $derived(
    autocompleteFilter
      ? notes.filter(n => n.title.toLowerCase().includes(autocompleteFilter.toLowerCase())).slice(0, 6)
      : []
  );

  let renderedHtml = $derived(renderMarkdown(content, notes));

  function onInput(e) {
    content = e.currentTarget.value;
    const pos = e.currentTarget.selectionStart;
    const before = content.slice(0, pos);
    const match = before.match(/\[\[([^\]]+)$/);
    if (match) {
      autocompleteFilter = match[1];
      autocompleteOpen = true;
    } else {
      autocompleteOpen = false;
      autocompleteFilter = '';
    }
  }

  function insertLink(noteTitle) {
    const pos = textarea.selectionStart;
    const before = content.slice(0, pos);
    const after = content.slice(pos);
    const newBefore = before.replace(/\[\[([^\]]+)$/, `[[${noteTitle}]]`);
    content = newBefore + after;
    autocompleteOpen = false;
    autocompleteFilter = '';
    // Cursor nach dem eingefügten Link setzen
    const newPos = newBefore.length;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newPos, newPos);
    }, 0);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') autocompleteOpen = false;
  }

  function closeAutocomplete() {
    autocompleteOpen = false;
    autocompleteFilter = '';
  }

  export function applyFormat(tool) {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);
    let newContent = content;
    let newCursorStart = start;
    let newCursorEnd = end;

    if (tool.syntax) {
      const wrapped = `${tool.syntax}${selected || 'Text'}${tool.syntax}`;
      newContent = content.slice(0, start) + wrapped + content.slice(end);
      newCursorStart = start + tool.syntax.length;
      newCursorEnd = newCursorStart + (selected || 'Text').length;
    } else if (tool.prefix) {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      newContent = content.slice(0, lineStart) + tool.prefix + content.slice(lineStart);
      newCursorStart = start + tool.prefix.length;
      newCursorEnd = newCursorStart;
    }
    content = newContent;
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorStart, newCursorEnd);
    }, 0);
  }

  export function insertLinkSyntax() {
    if (!textarea) return;
    const pos = textarea.selectionStart;
    content = content.slice(0, pos) + '[[' + content.slice(pos);
    autocompleteOpen = true;
    autocompleteFilter = '';
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(pos + 2, pos + 2);
    }, 0);
  }
</script>

<!-- Linke Seite: Markdown-Source -->
<div class="flex-1 flex flex-col min-w-0 min-h-0 border-b sm:border-b-0 sm:border-r border-[rgba(26,26,46,0.08)]">
  <!-- Pane header -->
  <div style="height:36px;padding:0 18px;display:flex;align-items:center;border-bottom:1px solid rgba(26,26,46,0.06);background:#fafaf8;flex-shrink:0;">
    <span style="font-size:10.5px;font-weight:600;color:#888899;letter-spacing:0.8px;text-transform:uppercase;">Markdown</span>
    <span style="flex:1;"></span>
    <span style="font-size:11px;color:#888899;">{wordCount} Wörter</span>
  </div>

  <!-- Textarea -->
  <div style="flex:1;overflow:auto;padding:20px 28px;position:relative;min-height:0;">
    <textarea
      bind:this={textarea}
      value={content}
      oninput={onInput}
      onkeydown={handleKeydown}
      onblur={closeAutocomplete}
      spellcheck="true"
      style="width:100%;height:100%;border:none;outline:none;resize:none;font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;font-size:13px;line-height:1.65;color:#1a1a2e;background:transparent;box-sizing:border-box;"
    ></textarea>

    <!-- [[Note]] Autocomplete -->
    {#if autocompleteOpen && suggestions.length > 0}
      <div class="max-w-[calc(100vw-2rem)]" style="position:absolute;top:218px;left:188px;background:#fff;border:1px solid rgba(26,26,46,0.10);border-radius:8px;padding:4px;min-width:240px;box-shadow:0 10px 30px rgba(26,26,46,0.12);z-index:3;">
        <div style="font-size:10.5px;font-weight:600;color:#888899;padding:6px 10px;letter-spacing:0.5px;text-transform:uppercase;">Notiz einfügen</div>
        {#each suggestions as note, i}
          <button
            onmousedown={(e) => { e.preventDefault(); insertLink(note.title); }}
            style="display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:5px;cursor:pointer;background:{i === 0 ? 'rgba(233,69,96,0.08)' : 'transparent'};border:none;width:100%;font-family:inherit;text-align:left;"
          >
            <Icon name="fileText" size={13} color={note.color || '#7c9eb2'} />
            <span style="font-size:12.5px;color:#1a1a2e;font-weight:500;">{note.title}</span>
            <span style="flex:1;"></span>
            <span style="font-size:10.5px;color:#888899;">{note.folder}</span>
          </button>
        {/each}
      </div>
    {/if}
  </div>
</div>

<!-- Rechte Seite: Rendered Preview -->
<div class="flex-1 flex flex-col min-w-0 min-h-0">
  <div style="height:36px;padding:0 18px;display:flex;align-items:center;border-bottom:1px solid rgba(26,26,46,0.06);background:#fafaf8;flex-shrink:0;">
    <span style="font-size:10.5px;font-weight:600;color:#888899;letter-spacing:0.8px;text-transform:uppercase;">Vorschau</span>
    <span style="flex:1;"></span>
    <button style="width:28px;height:28px;border-radius:6px;border:none;background:transparent;color:#6b6b80;cursor:pointer;display:flex;align-items:center;justify-content:center;">
      <Icon name="maximize" size={13} />
    </button>
  </div>
  <div style="flex:1;overflow:auto;padding:24px 32px;background:#fafaf8;">
    <div style="max-width:560px;font-size:14.5px;line-height:1.7;color:#1a1a2e;" class="prose">
      {@html renderedHtml}
    </div>
  </div>
</div>

<style>
  :global(.prose h1) { font-size: 30px; font-weight: 700; letter-spacing: -0.8px; margin: 0 0 18px; }
  :global(.prose h2) { font-size: 20px; font-weight: 700; margin-top: 24px; margin-bottom: 10px; letter-spacing: -0.4px; }
  :global(.prose h3) { font-size: 17px; font-weight: 600; margin-top: 20px; margin-bottom: 8px; }
  :global(.prose p) { margin: 0 0 14px; }
  :global(.prose ul, .prose ol) { padding-left: 22px; margin: 0 0 16px; }
  :global(.prose li) { margin-bottom: 4px; }
  :global(.prose code) { font-family: 'JetBrains Mono', ui-monospace, Menlo, monospace; font-size: 0.9em; background: #f1f0ec; padding: 1px 5px; border-radius: 4px; color: #1a1a2e; }
  :global(.prose pre) { background: #1a1a2e; color: #e6e6f0; padding: 14px 16px; border-radius: 8px; font-size: 12.5px; line-height: 1.6; margin: 0 0 16px; overflow: auto; }
  :global(.prose pre code) { background: none; padding: 0; color: inherit; }
  :global(.prose blockquote) { margin: 16px 0; padding: 12px 16px; background: rgba(78,168,222,0.08); border-left: 3px solid #4ea8de; border-radius: 4px; color: #1a1a2e; }
  :global(.prose a.wiki-link) { color: #e94560; text-decoration: none; font-weight: 500; background: rgba(233,69,96,0.10); padding: 1px 5px; border-radius: 4px; border-bottom: 1px dashed rgba(233,69,96,0.50); }
  :global(.prose strong) { font-weight: 700; }
</style>

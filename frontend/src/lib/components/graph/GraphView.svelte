<script>
  import { goto } from '$app/navigation';

  let { nodes = [], edges = [] } = $props();
  let hovered = $state(null);
  let svgEl;

  let hoveredNode = $derived(nodes.find(n => n.id === hovered));

  function isConnected(nodeId) {
    if (!hovered) return true;
    if (nodeId === hovered) return true;
    return edges.some(([a, b]) => (a === hovered && b === nodeId) || (b === hovered && a === nodeId));
  }

  function isEdgeHighlighted(a, b) {
    return hovered === a || hovered === b;
  }
</script>

<svg
  bind:this={svgEl}
  width="100%"
  height="100%"
  style="display:block;position:absolute;inset:0;"
>
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="20" cy="20" r="0.8" fill="rgba(26,26,46,0.07)" />
    </pattern>
    <radialGradient id="hoverGlow">
      <stop offset="0%" stop-color="rgba(233,69,96,0.25)" />
      <stop offset="100%" stop-color="rgba(233,69,96,0)" />
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#grid)" />

  <!-- Edges -->
  <g>
    {#each edges as [a, b], i}
      {@const na = nodes.find(n => n.id === a)}
      {@const nb = nodes.find(n => n.id === b)}
      {#if na && nb}
        <line
          x1="{na.x * 100}%" y1="{na.y * 100}%"
          x2="{nb.x * 100}%" y2="{nb.y * 100}%"
          stroke={isEdgeHighlighted(a, b) ? '#e94560' : 'rgba(26,26,46,0.18)'}
          stroke-width={isEdgeHighlighted(a, b) ? 1.6 : 1}
          opacity={hovered && !isEdgeHighlighted(a, b) ? 0.3 : 1}
        />
      {/if}
    {/each}
  </g>

  <!-- Nodes -->
  <g>
    {#each nodes as n (n.id)}
      <g
        onmouseenter={() => hovered = n.id}
        onmouseleave={() => hovered = null}
        onclick={() => goto(`/note/${n.id}`)}
        style="cursor:pointer;"
      >
        {#if hovered === n.id}
          <circle cx="{n.x * 100}%" cy="{n.y * 100}%" r={n.r + 18} fill="url(#hoverGlow)" />
        {/if}
        <circle
          cx="{n.x * 100}%" cy="{n.y * 100}%"
          r={n.r}
          fill={n.color}
          opacity={isConnected(n.id) ? 1 : 0.3}
          stroke={hovered === n.id ? '#fff' : 'rgba(26,26,46,0.08)'}
          stroke-width={hovered === n.id ? 3 : 1.5}
        />
        <text
          x="{n.x * 100}%" y="{n.y * 100}%"
          dy={n.r + 14}
          text-anchor="middle"
          font-size={n.r > 18 ? 12 : 11}
          font-weight={hovered === n.id ? 600 : 500}
          fill={hovered === n.id ? '#1a1a2e' : 'rgba(26,26,46,0.75)'}
          opacity={isConnected(n.id) ? 1 : 0.4}
          style="pointer-events:none;font-family:Inter,system-ui,sans-serif;"
        >{n.label}</text>
      </g>
    {/each}
  </g>
</svg>

<!-- Tooltip -->
{#if hoveredNode}
  <div style="position:absolute;left:calc({hoveredNode.x * 100}% + 28px);top:calc({hoveredNode.y * 100}% - 30px);background:#1a1a2e;color:#fff;padding:10px 12px;border-radius:8px;font-size:12px;box-shadow:0 8px 24px rgba(26,26,46,0.30);min-width:200px;max-width:240px;z-index:4;pointer-events:none;font-family:Inter,system-ui,sans-serif;">
    <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
      <div style="width:6px;height:6px;border-radius:3px;background:{hoveredNode.color};"></div>
      <span style="font-size:10.5px;opacity:0.6;text-transform:uppercase;letter-spacing:0.5px;">{hoveredNode.folder}</span>
    </div>
    <div style="font-weight:600;font-size:13px;margin-bottom:{hoveredNode.preview ? 4 : 0}px;">{hoveredNode.label}</div>
    {#if hoveredNode.preview}
      <div style="font-size:11.5px;color:rgba(255,255,255,0.7);line-height:1.45;">{hoveredNode.preview}</div>
    {/if}
  </div>
{/if}

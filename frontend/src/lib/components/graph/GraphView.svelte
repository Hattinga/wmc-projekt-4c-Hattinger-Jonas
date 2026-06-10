<script>
  import { goto } from '$app/navigation';
  import { t } from '$lib/i18n/index.js';
  import * as d3 from 'd3';

  let { nodes = [], edges = [] } = $props();

  let svgEl = $state(null);
  let gEl = $state(null);
  let svgWidth = $state(800);
  let svgHeight = $state(600);

  let simulationNodes = $state([]);
  let simulationEdges = $state([]);

  let hovered = $state(null);

  let simulation = null;

  /** Resolve D3's source/target after link resolution (objects) or before (IDs) */
  function edgeEndpointId(ep) {
    return ep?.id ?? ep;
  }

  /** Degree map: nodeId → number of edges. Recomputed only when edges change. */
  let degreeMap = $derived.by(() => {
    const m = new Map();
    for (const e of edges) {
      const s = edgeEndpointId(e.source);
      const t = edgeEndpointId(e.target);
      m.set(s, (m.get(s) ?? 0) + 1);
      m.set(t, (m.get(t) ?? 0) + 1);
    }
    return m;
  });

  function nodeRadius(node) {
    return Math.min(12 + (degreeMap.get(node.id) ?? 0) * 2.5, 28);
  }

  function nodeColor(node) {
    return d3.schemeTableau10[node.id % 10];
  }

  let hoveredNode = $derived(simulationNodes.find(n => n.id === hovered) ?? null);

  let hoveredDegree = $derived(
    hoveredNode ? (degreeMap.get(hoveredNode.id) ?? 0) : 0
  );

  function isConnected(nodeId) {
    if (!hovered) return true;
    if (nodeId === hovered) return true;
    return simulationEdges.some(e =>
      (edgeEndpointId(e.source) === hovered && edgeEndpointId(e.target) === nodeId) ||
      (edgeEndpointId(e.target) === hovered && edgeEndpointId(e.source) === nodeId)
    );
  }

  function isEdgeHighlighted(e) {
    if (!hovered) return false;
    return edgeEndpointId(e.source) === hovered || edgeEndpointId(e.target) === hovered;
  }

  export function reheat() {
    if (simulation) simulation.alpha(0.8).restart();
  }

  $effect(() => {
    const nodesCopy = nodes.map(n => ({ ...n }));
    const edgesCopy = edges.map(e => ({ source: e.source, target: e.target }));

    if (simulation) simulation.stop();

    if (nodesCopy.length === 0) {
      simulationNodes = [];
      simulationEdges = [];
      return;
    }

    simulation = d3.forceSimulation(nodesCopy)
      .force('link', d3.forceLink(edgesCopy).id(d => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(svgWidth / 2, svgHeight / 2))
      .force('collide', d3.forceCollide(d => nodeRadius(d) + 5))
      .on('tick', () => {
        simulationNodes = [...simulation.nodes()];
      });

    simulationEdges = simulation.force('link').links();

    return () => simulation.stop();
  });

  $effect(() => {
    if (!svgEl || !gEl) return;

    const zoom = d3.zoom()
      .scaleExtent([0.1, 5])
      .on('zoom', event => d3.select(gEl).attr('transform', event.transform));

    d3.select(svgEl).call(zoom);

    return () => d3.select(svgEl).on('.zoom', null);
  });

  function attachDrag(el, node) {
    d3.select(el).call(
      d3.drag()
        .on('start', event => {
          if (!simulation) return;
          if (!event.active) simulation.alphaTarget(0.3).restart();
          node.fx = node.x;
          node.fy = node.y;
        })
        .on('drag', event => {
          node.fx = event.x;
          node.fy = event.y;
          simulationNodes = [...simulation.nodes()];
        })
        .on('end', event => {
          if (!simulation) return;
          if (!event.active) simulation.alphaTarget(0);
          node.fx = null;
          node.fy = null;
        })
    );
  }
</script>

<svg
  bind:this={svgEl}
  bind:clientWidth={svgWidth}
  bind:clientHeight={svgHeight}
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

  <g bind:this={gEl}>
    {#each simulationEdges as e}
      {#if e.source?.x != null && e.target?.x != null}
        <line
          x1={e.source.x} y1={e.source.y}
          x2={e.target.x} y2={e.target.y}
          stroke={isEdgeHighlighted(e) ? '#e94560' : 'rgba(26,26,46,0.18)'}
          stroke-width={isEdgeHighlighted(e) ? 1.6 : 1}
          opacity={hovered && !isEdgeHighlighted(e) ? 0.3 : 1}
        />
      {/if}
    {/each}

    {#each simulationNodes as n (n.id)}
      {#if n.x != null}
        {@const r = nodeRadius(n)}
        {@const color = nodeColor(n)}
        <g
          use:attachDrag={n}
          onmouseenter={() => hovered = n.id}
          onmouseleave={() => hovered = null}
          onclick={() => goto(`/note/${n.id}`)}
          style="cursor:pointer;"
        >
          {#if hovered === n.id}
            <circle cx={n.x} cy={n.y} r={r + 18} fill="url(#hoverGlow)" />
          {/if}
          <circle
            cx={n.x} cy={n.y}
            r={r}
            fill={color}
            opacity={isConnected(n.id) ? 1 : 0.3}
            stroke={hovered === n.id ? '#fff' : 'rgba(26,26,46,0.08)'}
            stroke-width={hovered === n.id ? 3 : 1.5}
          />
          <text
            x={n.x} y={n.y}
            dy={r + 14}
            text-anchor="middle"
            font-size={r > 18 ? 12 : 11}
            font-weight={hovered === n.id ? 600 : 500}
            fill={hovered === n.id ? '#1a1a2e' : 'rgba(26,26,46,0.75)'}
            opacity={isConnected(n.id) ? 1 : 0.4}
            style="pointer-events:none;font-family:Inter,system-ui,sans-serif;"
          >{n.title}</text>
        </g>
      {/if}
    {/each}
  </g>
</svg>

{#if hoveredNode && hoveredNode.x != null}
  <div style="position:absolute;left:{hoveredNode.x + 28}px;top:{hoveredNode.y - 30}px;background:#1a1a2e;color:#fff;padding:10px 12px;border-radius:8px;font-size:12px;box-shadow:0 8px 24px rgba(26,26,46,0.30);min-width:160px;max-width:220px;z-index:4;pointer-events:none;font-family:Inter,system-ui,sans-serif;">
    <div style="font-weight:600;font-size:13px;">{hoveredNode.title}</div>
    <div style="font-size:11px;color:rgba(255,255,255,0.55);margin-top:3px;">{hoveredDegree} {t('graph.connections')}</div>
  </div>
{/if}

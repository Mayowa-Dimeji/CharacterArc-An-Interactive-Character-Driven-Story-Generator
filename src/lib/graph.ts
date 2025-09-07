import type { Choice, Scene, StoryGraph } from "../contracts";

const KEY = "story-graph-v1";

export function loadGraph(): StoryGraph {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as StoryGraph;
  } catch {
    /* ignore */
  }
  return { nodes: [], edges: [] };
}

export function saveGraph(g: StoryGraph) {
  try {
    localStorage.setItem(KEY, JSON.stringify(g));
  } catch {
    /* ignore */
  }
}

export function addSceneAndEdge(
  g: StoryGraph,
  newScene: Scene,
  opts: { prev?: Scene | null; choice?: Choice | null }
): StoryGraph {
  const next: StoryGraph = {
    nodes: [...g.nodes],
    edges: [...g.edges],
  };

  // add node if not present
  if (!next.nodes.find((n) => n.id === newScene.id)) {
    next.nodes.push(newScene);
  }

  // add edge from prev -> new with choice label
  if (opts.prev && opts.choice) {
    next.edges.push({
      from: opts.prev.id,
      to: newScene.id,
      choiceId: opts.choice.id,
      label: opts.choice.label,
    });
  }

  return next;
}

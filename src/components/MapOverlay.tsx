import { Button, Card } from "./UI";
import type { StoryGraph } from "../contracts";

type Props = {
  open: boolean;
  onClose: () => void;
  graph: StoryGraph;
  currentId?: string | null;
};

function clip(s: string, words = 14) {
  const parts = s.split(/\s+/);
  return parts.length > words ? parts.slice(0, words).join(" ") + "…" : s;
}

export default function MapOverlay({ open, onClose, graph, currentId }: Props) {
  if (!open) return null;

  return (
    // Make the whole overlay scrollable
    <div className="fixed inset-0 z-50 bg-black/40 overflow-y-auto">
      {/* vertical padding so content can breathe when scrolling */}
      <div className="min-h-full py-8 px-4 flex items-start justify-center">
        <div className="w-full max-w-4xl">
          <Card>
            {/* Sticky header so the Close button never scrolls away */}
            <div className="sticky top-0 bg-white z-10 -mx-4 -mt-4 px-4 pt-4 pb-3 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Story Map</h2>
                <Button onClick={onClose}>Close</Button>
              </div>
            </div>

            {/* Scrollable content area (max height) */}
            <div className="max-h-[75vh] overflow-y-auto mt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Beats</h3>
                  <ol className="list-decimal ml-5 space-y-2">
                    {graph.nodes.map((n) => (
                      <li
                        key={n.id}
                        className={currentId === n.id ? "font-semibold" : ""}
                      >
                        <div className="text-sm leading-snug">
                          {clip(n.text)}
                        </div>
                        {currentId === n.id && (
                          <div className="text-xs text-indigo-600">current</div>
                        )}
                      </li>
                    ))}
                  </ol>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Edges</h3>
                  <div className="text-sm space-y-2">
                    {graph.edges.length === 0 && (
                      <div className="text-gray-500">No branches yet.</div>
                    )}
                    {graph.edges.map((e, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-gray-400">→</span>
                        <span className="flex-1">
                          <span className="font-mono">
                            {e.from.slice(0, 6)}
                          </span>{" "}
                          <span className="text-gray-500">—[{e.label}]→</span>{" "}
                          <span className="font-mono">{e.to.slice(0, 6)}</span>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useRef, useState } from "react";
import { useCharacter } from "../CharacterContext"; // or ../useCharacter
import { Link } from "react-router-dom";
import type { BeatResponse, Choice, Scene, StoryGraph } from "../contracts";
import { requestBeat } from "../api";
import { applyStateDelta } from "../lib/state";
import { Button, Card } from "../components/UI";
import MapOverlay from "../components/MapOverlay";
import { addSceneAndEdge, loadGraph, saveGraph } from "../lib/graph";

const FEAR_WARNING_THRESHOLD = 0.8;

export default function Play() {
  const { character, setCharacter } = useCharacter();
  const [scene, setScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const [graph, setGraph] = useState<StoryGraph>(() => loadGraph());
  const [mapOpen, setMapOpen] = useState(false);
  const seed = useMemo(() => Math.floor(Math.random() * 100000), []);
  const mounted = useRef(false);
  const prevSceneRef = useRef<Scene | null>(null);

  if (!character) {
    return (
      <div>
        <p className="mb-4">No character found. Create one first.</p>
        <Link to="/create" className="underline">
          Go to Create
        </Link>
      </div>
    );
  }

  const highFear =
    (character.fears?.[0]?.intensity ?? 0) >= FEAR_WARNING_THRESHOLD;

  async function fetchBeat(lastChoice?: Choice) {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        state: character!,
        lastChoice: lastChoice?.id,
        transcript,
        seed,
      };
      const res: BeatResponse = await requestBeat(payload);
      setScene(res.scene);

      // transcript summary
      const summary = res.scene.text.split(".")[0] + ".";
      setTranscript((t) => [...t, summary]);

      // state merge
      if (character) {
        const nextState = applyStateDelta(character, res.stateDelta || {});
        setCharacter(nextState);
      }

      // update graph
      setGraph((g) => {
        const updated = addSceneAndEdge(g, res.scene, {
          prev: prevSceneRef.current,
          choice: lastChoice ?? null,
        });
        saveGraph(updated);
        return updated;
      });

      prevSceneRef.current = res.scene;
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function onChoose(c: Choice) {
    if (!scene) return;
    fetchBeat(c);
  }

  function restart() {
    setScene(null);
    setTranscript([]);
    prevSceneRef.current = null;
    setGraph({ nodes: [], edges: [] });
    saveGraph({ nodes: [], edges: [] });
    // reset just story history, keep identity
    setCharacter({ ...(character as any), history: [] });
    fetchBeat(undefined);
  }

  // first beat + keyboard shortcuts
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchBeat(undefined);
    }
    const onKey = (e: KeyboardEvent) => {
      if (!scene || loading) return;
      if (e.key === "1" && scene.choices[0]) onChoose(scene.choices[0]);
      if (e.key === "2" && scene.choices[1]) onChoose(scene.choices[1]);
      if (e.key === "3" && scene.choices[2]) onChoose(scene.choices[2]);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scene, loading]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Play</h1>
        <div className="flex gap-2">
          <Button type="button" onClick={() => setMapOpen(true)}>
            Open Map
          </Button>
          <Button type="button" onClick={restart}>
            Restart
          </Button>
          <Link to="/create" className="underline text-sm self-center">
            Edit character
          </Link>
        </div>
      </div>

      {/* HUD */}
      <Card>
        <div className="grid md:grid-cols-3 gap-2 text-sm">
          <div>
            👤 <b>{character.name}</b> — {character.archetype}
          </div>
          <div>
            🎯 Goal: <i>{character.goals?.[0]?.text ?? "—"}</i>
          </div>
          <div>
            😟 Fear: <i>{character.fears?.[0]?.text ?? "—"}</i>
          </div>
          <div className="md:col-span-3 text-gray-600">
            Traits: {character.traits.join(", ") || "—"}
          </div>
        </div>
        {highFear && (
          <div className="mt-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-2 py-1 inline-block">
            Content note: heightened fear themes in this arc.
          </div>
        )}
      </Card>

      {/* Scene */}
      <Card>
        {loading && <p className="animate-pulse">Generating the next beat…</p>}
        {error && <p className="text-red-600">Error: {error}</p>}

        {!loading && scene && (
          <div className="grid gap-4">
            <div className="whitespace-pre-wrap leading-relaxed">
              {scene.text}
            </div>

            <div className="flex flex-wrap gap-2">
              {scene.choices.map((c, idx) => (
                <Button key={c.id} onClick={() => onChoose(c)}>
                  {idx + 1}. {c.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Transcript */}
      {transcript.length > 0 && (
        <Card>
          <div className="text-sm text-gray-600">
            <div className="font-medium mb-1">Transcript (summary)</div>
            <ol className="list-decimal ml-5 space-y-1">
              {transcript.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ol>
          </div>
        </Card>
      )}

      {/* Map overlay */}
      <MapOverlay
        open={mapOpen}
        onClose={() => setMapOpen(false)}
        graph={graph}
        currentId={scene?.id ?? null}
      />
    </div>
  );
}

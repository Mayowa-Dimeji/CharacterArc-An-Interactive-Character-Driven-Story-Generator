/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useMemo, useRef, useState } from "react";
import { useCharacter } from "../CharacterContext"; // or ../useCharacter if split
import { Link } from "react-router-dom";
import type { BeatResponse, Choice, Scene } from "../contracts";
import { requestBeat } from "../api";
import { applyStateDelta } from "../lib/state";
import { Button, Card } from "../components/UI";

export default function Play() {
  const { character, setCharacter } = useCharacter();
  const [scene, setScene] = useState<Scene | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string[]>([]);
  const seed = useMemo(() => Math.floor(Math.random() * 100000), []);
  const mounted = useRef(false);

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

  async function fetchBeat(lastChoice?: string) {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        state: character,
        lastChoice,
        transcript,
        seed,
      };
      const res: BeatResponse = await requestBeat(payload as any);
      setScene(res.scene);
      // Update transcript with compact summary (scene id or first sentence)
      const summary = res.scene.text.split(".")[0] + ".";
      setTranscript((t) => [...t, summary]);

      // Merge stateDelta into character
      const next = applyStateDelta(character as any, res.stateDelta || {});
      setCharacter(next);
    } catch (e: any) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  function onChoose(c: Choice) {
    fetchBeat(c.id);
  }

  function restart() {
    setScene(null);
    setTranscript([]);
    // keep character as-is, or soft reset its history:
    setCharacter({ ...(character as any), history: [] });
    // fetch first beat fresh
    fetchBeat(undefined);
  }

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      fetchBeat(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Play</h1>
        <div className="flex gap-2">
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
              {scene.choices.map((c) => (
                <Button key={c.id} onClick={() => onChoose(c)}>
                  {c.label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Transcript (optional) */}
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
    </div>
  );
}

import type { CharacterState } from "../contracts";

const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));

export function applyStateDelta(
  state: CharacterState,
  delta: Partial<CharacterState> & { historyAppend?: string }
): CharacterState {
  const next: CharacterState = { ...state };

  if (delta.name) next.name = delta.name;
  if (delta.archetype) next.archetype = delta.archetype;
  if (delta.traits) next.traits = [...delta.traits];
  if (delta.worldview) next.worldview = delta.worldview;
  if (delta.growth_theme) next.growth_theme = delta.growth_theme;

  if (delta.goals)
    next.goals = delta.goals.map((g) => ({
      ...g,
      priority: clamp(g.priority, 1, 5),
    }));
  if (delta.fears)
    next.fears = delta.fears.map((f) => ({
      ...f,
      intensity: clamp(f.intensity, 0, 1),
    }));
  if (delta.relationships)
    next.relationships = delta.relationships.map((r) => ({
      ...r,
      trust: clamp(r.trust, 0, 1),
    }));

  // history handling
  next.history = [...(state.history ?? [])];
  if (delta.history) next.history = [...delta.history]; // full replace if provided
  if (delta.historyAppend) next.history.push(delta.historyAppend);

  return next;
}

import type { z } from "zod";
import { characterSchema } from "./validation";

export type CharacterState = z.infer<typeof characterSchema>;

export type Choice = { id: string; label: string };
export type Scene = { id: string; text: string; choices: Choice[] };

export type BeatRequest = {
  state: CharacterState;
  lastChoice?: string;
  transcript: string[];
  seed?: number;
};

export type StateDelta = Partial<CharacterState> & { historyAppend?: string };

export type BeatResponse = {
  scene: Scene;
  stateDelta: StateDelta;
};
export type Edge = {
  from: string;
  to: string;
  choiceId: string;
  label: string;
};
export type StoryGraph = { nodes: Scene[]; edges: Edge[] };

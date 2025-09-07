export type Trait = string;

export type Goal = {
  id: string;
  text: string;
  priority: number; // 1..5
};

export type Fear = {
  id: string;
  text: string;
  intensity: number; // 0..1
};

export type Relationship = {
  id: string;
  name: string;
  stance: "ally" | "rival" | "unknown";
  trust: number; // 0..1
};

export type CharacterState = {
  id: string;
  name: string;
  archetype: string;
  traits: Trait[];
  goals: Goal[];
  fears: Fear[];
  relationships: Relationship[];
  worldview: string;
  growth_theme: string;
  history: string[];
};

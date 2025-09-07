import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CharacterState } from "./types";

type Ctx = {
  character: CharacterState | null;
  setCharacter: (c: CharacterState) => void;
  reset: () => void;
};

const CharacterCtx = createContext<Ctx | undefined>(undefined);
const KEY = "character-state-v1";

export function CharacterProvider({ children }: { children: React.ReactNode }) {
  const [character, setCharacterState] = useState<CharacterState | null>(null);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setCharacterState(parsed);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const setCharacter = (c: CharacterState) => {
    setCharacterState(c);
    try {
      localStorage.setItem(KEY, JSON.stringify(c));
    } catch {
      // intentionally ignore errors
    }
  };

  const reset = () => {
    setCharacterState(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      // intentionally ignore errors
    }
  };

  const value = useMemo(
    () => ({ character, setCharacter, reset }),
    [character]
  );
  return (
    <CharacterCtx.Provider value={value}>{children}</CharacterCtx.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCharacter() {
  const ctx = useContext(CharacterCtx);
  if (!ctx)
    throw new Error("useCharacter must be used within CharacterProvider");
  return ctx;
}

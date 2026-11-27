import { DIN_5008 } from "./din5008";
import type { LetterStandard } from "./types";

const STANDARDS: ReadonlyArray<LetterStandard> = [DIN_5008];

export function listStandards(): ReadonlyArray<LetterStandard> {
  return STANDARDS;
}

export function getStandard(id: string): LetterStandard {
  const found = STANDARDS.find((s) => s.id === id);
  if (!found) throw new Error(`Unknown standard: ${id}`);
  return found;
}

export function defaultStandard(): LetterStandard {
  return DIN_5008;
}

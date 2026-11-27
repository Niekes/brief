export const FIELDS = ["address", "additional information", "reference", "text"] as const;

export type LetterField = (typeof FIELDS)[number];

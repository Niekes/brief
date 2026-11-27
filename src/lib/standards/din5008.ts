import type { LetterStandard } from "./types";

export const DIN_5008: LetterStandard = {
  id: "din-5008",
  label: "DIN 5008",
  pageSize: "A4",
  margins: { top: 10, right: 20, bottom: 10, left: 25 },
  addressBlock: { top: 45, left: 25, width: 85 },
  additionalInfo: { top: 45, right: 20 },
  referenceLine: { top: 98.5 },
  bodyStart: { top: 105 },
  foldMarks: [
    { y: 105, length: 5 },
    { y: 210, length: 5 },
  ],
  holeMark: { y: 148.5 },
  logo: { top: 10, right: 20, size: 30 },
};

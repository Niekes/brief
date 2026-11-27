import type { LetterStandard } from "@/lib/standards/types";

export interface LetterContent {
  address: string;
  additionalInfo: string;
  reference: string;
  body: string;
  image?: { src: string; width: number; height: number } | null;
}

export interface LetterDocument {
  standardId: string;
  standard: LetterStandard;
  content: LetterContent;
  fileName: string;
}

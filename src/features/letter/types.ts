import type { LetterStandard } from "@/lib/standards/types";

export interface LetterImage {
  src: string;
  width: number;
  height: number;
}

export interface LetterContent {
  address: string;
  additionalInfo: string;
  reference: string;
  body: string;
  image?: LetterImage | null;
}

export interface LetterDocument {
  standardId: string;
  standard: LetterStandard;
  content: LetterContent;
  fileName: string;
}

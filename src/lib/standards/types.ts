export type PageSize = "A4" | "Letter";

export interface PageDimensions {
  width: number; // mm
  height: number; // mm
}

export const PAGE_SIZES: Record<PageSize, PageDimensions> = {
  A4: { width: 210, height: 297 },
  Letter: { width: 216, height: 279 },
};

export interface Margins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface LetterStandard {
  id: string;
  label: string;
  pageSize: PageSize;
  margins: Margins;
  addressBlock: { top: number; left: number; width: number };
  additionalInfo: { top: number; right: number };
  referenceLine: { top: number };
  bodyStart: { top: number };
  foldMarks: Array<{ y: number; length: number }>;
  holeMark: { y: number };
  logo: { top: number; right: number; size: number };
}

export function pageDimensions(standard: LetterStandard): PageDimensions {
  return PAGE_SIZES[standard.pageSize];
}

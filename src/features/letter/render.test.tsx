import { vi } from "vitest";

vi.mock("takumi-pdf", () => ({ render: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3])) }));
vi.mock("@takumi-rs/helpers", () => ({ googleFonts: vi.fn().mockResolvedValue([]) }));

import { describe, expect, it } from "vitest";
import { renderLetterToBytes } from "./render";
import { DIN_5008 } from "@/lib/standards/din5008";
import type { LetterStandard } from "@/lib/standards/types";
import type { LetterDocument } from "./types";

const doc: LetterDocument = {
  standardId: "din-5008",
  standard: DIN_5008,
  content: { address: "a", additionalInfo: "b", reference: "c", body: "d", image: null },
  fileName: "x",
};

const docWithImage: LetterDocument = {
  ...doc,
  content: { ...doc.content, image: { src: "data:image/png;base64,AAAA", width: 10, height: 10 } },
};

describe("renderLetterToBytes", () => {
  it("returns bytes", async () => {
    const bytes = await renderLetterToBytes(doc);
    expect(bytes).toBeInstanceOf(Uint8Array);
  });
  it("renders with image", async () => {
    const bytes = await renderLetterToBytes(docWithImage);
    expect(bytes).toBeInstanceOf(Uint8Array);
  });
  it("renders letter size", async () => {
    const letterStandard: LetterStandard = { ...DIN_5008, pageSize: "Letter" };
    const d = { ...doc, standard: letterStandard };
    const bytes = await renderLetterToBytes(d);
    expect(bytes).toBeInstanceOf(Uint8Array);
  });
});

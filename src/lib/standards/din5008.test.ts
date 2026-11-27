import { describe, expect, it } from "vitest";
import { DIN_5008 } from "./din5008";

describe("DIN 5008", () => {
  it("is A4", () => {
    expect(DIN_5008.pageSize).toBe("A4");
  });
  it("has fold marks", () => {
    expect(DIN_5008.foldMarks).toHaveLength(2);
  });
});

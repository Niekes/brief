import { describe, expect, it } from "vitest";
import { PAGE_SIZES, pageDimensions } from "./types";
import { DIN_5008 } from "./din5008";

describe("standards types", () => {
  it("pageDimensions returns A4 for DIN", () => {
    expect(pageDimensions(DIN_5008)).toEqual({ width: 210, height: 297 });
  });
  it("PAGE_SIZES has A4 and Letter", () => {
    expect(PAGE_SIZES.A4).toEqual({ width: 210, height: 297 });
    expect(PAGE_SIZES.Letter).toEqual({ width: 216, height: 279 });
  });
});

import { describe, expect, it } from "vitest";
import { defaultStandard, getStandard, listStandards } from "./registry";

describe("standards registry", () => {
  it("lists at least DIN 5008", () => {
    expect(listStandards().map((s) => s.id)).toContain("din-5008");
  });
  it("returns DIN 5008 by default", () => {
    expect(defaultStandard().id).toBe("din-5008");
  });
  it("getStandard throws for unknown id", () => {
    expect(() => getStandard("nope")).toThrow();
  });
  it("getStandard returns the matching standard", () => {
    expect(getStandard("din-5008").label).toBe("DIN 5008");
  });
});

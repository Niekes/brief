/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

vi.mock("@/lib/pdf/preview", () => ({
  renderPdfToCanvas: vi.fn().mockRejectedValue(new Error("boom")),
}));

import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Preview } from "./Preview";

describe("Preview", () => {
  it("renders canvas", () => {
    render(<Preview bytes={null} />);
    expect(document.querySelector("canvas")).toBeTruthy();
  });

  it("renders with bytes", async () => {
    render(<Preview bytes={new Uint8Array([1])} />);
    await new Promise((r) => setTimeout(r, 10));
    expect(document.querySelector("canvas")).toBeTruthy();
  });

  it("handles render error", async () => {
    const { renderPdfToCanvas } = await import("@/lib/pdf/preview");
    render(<Preview bytes={new Uint8Array([1])} />);
    await new Promise((r) => setTimeout(r, 50));
    expect(renderPdfToCanvas).toHaveBeenCalled();
    expect(document.querySelector("canvas")).toBeTruthy();
  });
});

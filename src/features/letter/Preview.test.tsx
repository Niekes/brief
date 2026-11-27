/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

vi.mock("@/lib/pdf/preview", () => ({
  renderPdfToCanvas: vi.fn().mockRejectedValue(new Error("boom")),
}));

import { render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Preview } from "./Preview";

describe("Preview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders a canvas", () => {
    render(<Preview bytes={null} />);
    expect(document.querySelector("canvas")).toBeTruthy();
  });

  it("attempts to render real pdf bytes", async () => {
    const { renderPdfToCanvas } = await import("@/lib/pdf/preview");
    render(<Preview bytes={new Uint8Array([1])} />);
    await new Promise((r) => setTimeout(r, 10));
    expect(renderPdfToCanvas).toHaveBeenCalled();
  });

  it("clears the canvas on error", async () => {
    const clearRect = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      clearRect,
    } as unknown as CanvasRenderingContext2D);
    render(<Preview bytes={new Uint8Array([1])} />);
    await new Promise((r) => setTimeout(r, 20));
    expect(clearRect).toHaveBeenCalled();
  });

  it("clears stale pixels when bytes are removed", async () => {
    const clearRect = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      clearRect,
    } as unknown as CanvasRenderingContext2D);
    const { rerender } = render(<Preview bytes={new Uint8Array([1])} />);
    await new Promise((r) => setTimeout(r, 10));
    clearRect.mockClear();
    rerender(<Preview bytes={null} />);
    const canvas = document.querySelector("canvas")!;
    expect(clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
  });
});

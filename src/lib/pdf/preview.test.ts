/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

vi.mock("pdfjs-dist", () => {
  const render = vi.fn().mockReturnValue({ promise: Promise.resolve() });
  const getPage = vi.fn().mockResolvedValue({
    getViewport: () => ({ width: 100, height: 200 }),
    render,
  });
  const destroy = vi.fn().mockResolvedValue(undefined);
  const getDocument = vi.fn().mockReturnValue({
    promise: Promise.resolve({ getPage, destroy }),
    destroy: vi.fn().mockResolvedValue(undefined),
  });
  return {
    GlobalWorkerOptions: { workerSrc: "" },
    getDocument,
  };
});

import { describe, expect, it } from "vitest";
import { renderPdfToCanvas } from "./preview";

describe("renderPdfToCanvas", () => {
  it("renders to canvas", async () => {
    const canvas = document.createElement("canvas");
    const ctx = {} as CanvasRenderingContext2D;
    vi.spyOn(canvas, "getContext").mockReturnValue(ctx);
    await renderPdfToCanvas(new Uint8Array([1]), canvas);
    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(200);
  });

  it("throws when no context", async () => {
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getContext").mockReturnValue(null);
    await expect(renderPdfToCanvas(new Uint8Array([1]), canvas)).rejects.toThrow();
  });
});

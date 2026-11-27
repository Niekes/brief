/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

const mocks = vi.hoisted(() => {
  const viewport = vi.fn(() => ({ width: 100, height: 200 }));
  const render = vi.fn().mockReturnValue({ promise: Promise.resolve() });
  const getPage = vi.fn().mockResolvedValue({ getViewport: viewport, render });
  const loadingTaskDestroy = vi.fn().mockResolvedValue(undefined);
  const getDocument = vi.fn().mockReturnValue({
    promise: Promise.resolve({ getPage, destroy: vi.fn().mockResolvedValue(undefined) }),
    destroy: loadingTaskDestroy,
  });
  return { viewport, render, getPage, loadingTaskDestroy, getDocument };
});

vi.mock("pdfjs-dist", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: mocks.getDocument,
}));

import { beforeEach, describe, expect, it } from "vitest";
import { renderPdfToCanvas } from "./preview";

describe("renderPdfToCanvas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders at 1:1 and destroys the loading task", async () => {
    const canvas = document.createElement("canvas");
    const ctx = {} as CanvasRenderingContext2D;
    vi.spyOn(canvas, "getContext").mockReturnValue(ctx);

    await renderPdfToCanvas(new Uint8Array([1]), canvas);

    expect(mocks.viewport).toHaveBeenCalledWith({ scale: 1 });
    expect(canvas.width).toBe(100);
    expect(canvas.height).toBe(200);
    expect(mocks.render).toHaveBeenCalledWith({
      canvas,
      canvasContext: ctx,
      viewport: { width: 100, height: 200 },
    });
    expect(mocks.loadingTaskDestroy).toHaveBeenCalledTimes(1);
  });

  it("destroys the loading task when no canvas context is available", async () => {
    const canvas = document.createElement("canvas");
    vi.spyOn(canvas, "getContext").mockReturnValue(null);

    await expect(renderPdfToCanvas(new Uint8Array([1]), canvas)).rejects.toThrow();

    expect(mocks.loadingTaskDestroy).toHaveBeenCalledTimes(1);
  });

  it("destroys the loading task when the pdf fails to load", async () => {
    mocks.getDocument.mockReturnValueOnce({
      promise: Promise.reject(new Error("broken pdf")),
      destroy: mocks.loadingTaskDestroy,
    });
    const canvas = document.createElement("canvas");

    await expect(renderPdfToCanvas(new Uint8Array([1]), canvas)).rejects.toThrow("broken pdf");

    expect(mocks.loadingTaskDestroy).toHaveBeenCalledTimes(1);
  });
});

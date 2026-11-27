import * as pdfjsLib from "pdfjs-dist";

// Use the bundled worker so preview works offline.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export interface RenderPreviewOptions {
  scale?: number;
}

export async function renderPdfToCanvas(
  bytes: Uint8Array,
  canvas: HTMLCanvasElement,
  options: RenderPreviewOptions = {},
): Promise<void> {
  const scale = options.scale ?? 1.5;
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  const pdf = await loadingTask.promise;
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale });
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas 2D context unavailable");
  canvas.width = Math.floor(viewport.width);
  canvas.height = Math.floor(viewport.height);
  await page.render({ canvas, canvasContext: context, viewport }).promise;
  await loadingTask.destroy();
}

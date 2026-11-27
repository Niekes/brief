import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

export async function renderPdfToCanvas(
  bytes: Uint8Array,
  canvas: HTMLCanvasElement,
): Promise<void> {
  const loadingTask = pdfjsLib.getDocument({ data: bytes });
  try {
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1 });
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 2D context unavailable");
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);
    await page.render({ canvas, canvasContext: context, viewport }).promise;
  } finally {
    await loadingTask.destroy();
  }
}

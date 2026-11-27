import { useEffect, useRef } from "react";
import { renderPdfToCanvas } from "@/lib/pdf/preview";

export interface PreviewProps {
  bytes: Uint8Array | null;
}

export function Preview({ bytes }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!bytes) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    void (async () => {
      try {
        await renderPdfToCanvas(bytes, canvas);
      } catch {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    })();
  }, [bytes]);

  return <canvas ref={canvasRef} className="border" />;
}

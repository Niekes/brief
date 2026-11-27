import { useEffect, useRef } from "react";
import { renderPdfToCanvas } from "@/lib/pdf/preview";

export interface PreviewProps {
  bytes: Uint8Array | null;
}

export function Preview({ bytes }: PreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bytes) return;
    void (async () => {
      try {
        await renderPdfToCanvas(bytes, canvas);
      } catch {
        const ctx = canvas.getContext("2d");
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      }
    })();
  }, [bytes]);

  return <canvas ref={canvasRef} className="border" />;
}

import { useEffect, useRef, useState } from "react";
import type { LetterDocument } from "./types";
import { renderLetterToBytes } from "./render";

export interface UsePdfPreviewResult {
  bytes: Uint8Array | null;
  loading: boolean;
  error: string | null;
}

export function usePdfPreview(doc: LetterDocument, delay = 300): UsePdfPreviewResult {
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    const id = ++requestId.current;
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);
      void (async () => {
        try {
          const result = await renderLetterToBytes(doc);
          if (requestId.current !== id) return;
          setBytes(result);
        } catch (e) {
          if (requestId.current !== id) return;
          setError(String(e));
        } finally {
          if (requestId.current === id) setLoading(false);
        }
      })();
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [doc, delay]);

  return { bytes, loading, error };
}

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      void (async () => {
        try {
          const result = await renderLetterToBytes(doc);
          setBytes(result);
          setError(null);
        } catch (e) {
          setError(String(e));
        } finally {
          setLoading(false);
        }
      })();
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [doc, delay]);

  return { bytes, loading, error };
}

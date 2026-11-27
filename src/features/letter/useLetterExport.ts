import { useCallback, useState } from "react";
import type { LetterDocument } from "./types";
import { renderLetterToBytes } from "./render";

export function useLetterExport(doc: LetterDocument, fileName: string) {
  const [status, setStatus] = useState("");

  const exportPdf = useCallback(async () => {
    setStatus("Generiere PDF…");
    try {
      const bytes = await renderLetterToBytes(doc);
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setStatus("Fertig.");
    } catch (e) {
      setStatus(`Fehler: ${String(e)}`);
    }
  }, [doc, fileName]);

  return { status, exportPdf };
}

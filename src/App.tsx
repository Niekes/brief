import { useCallback, useEffect, useMemo, useState } from "react";
import { getStandard, listStandards } from "@/lib/standards/registry";
import type { LetterDocument } from "@/features/letter/types";
import { renderLetterToBytes } from "@/features/letter/render";
import { usePdfPreview } from "@/features/letter/usePdfPreview";
import { Preview } from "@/features/letter/Preview";
import { saveSnippet, loadSnippet, listSnippetKeys } from "@/lib/storage/snippets";

const FIELDS = ["address", "additional information", "reference", "text"] as const;

// fallow-ignore-next-line complexity
export default function App() {
  const [standardId, setStandardId] = useState("din-5008");
  const [fileName, setFileName] = useState("brief");
  const [values, setValues] = useState<Record<string, string>>({});
  const [image, setImage] = useState<{ src: string; width: number; height: number } | null>(null);
  const [snippetKeys, setSnippetKeys] = useState<Record<string, string[]>>({});
  const [status, setStatus] = useState("");

  const standard = getStandard(standardId);

  const letterDoc = useMemo<LetterDocument>(
    () => ({
      standardId,
      standard,
      content: {
        address: values.address ?? "",
        additionalInfo: values["additional information"] ?? "",
        reference: values.reference ?? "",
        body: values.text ?? "",
        image,
      },
      fileName,
    }),
    [standardId, standard, values, image, fileName],
  );

  const { bytes: previewBytes, loading, error: previewError } = usePdfPreview(letterDoc);

  useEffect(() => {
    void (async () => {
      const keys: Record<string, string[]> = {};
      for (const f of FIELDS) keys[f] = await listSnippetKeys(f);
      setSnippetKeys(keys);
    })();
  }, []);

  const handleImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = typeof e.target?.result === "string" ? e.target.result : "";
      const img = new Image();
      img.onload = () => setImage({ src, width: img.width, height: img.height });
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const saveSnip = async (field: string) => {
    const key = window.prompt(`Name für Snippet (${field})?`);
    if (!key || !values[field]) return;
    await saveSnippet(field, key, values[field]);
    setSnippetKeys((prev) => ({ ...prev, [field]: [...(prev[field] ?? []), key] }));
  };

  const loadSnip = async (field: string, key: string) => {
    const v = await loadSnippet(field, key);
    if (v !== undefined) setValues((prev) => ({ ...prev, [field]: v }));
  };

  const exportPdf = useCallback(async () => {
    setStatus("Generiere PDF…");
    try {
      const bytes = previewBytes ?? (await renderLetterToBytes(letterDoc));
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
  }, [letterDoc, previewBytes, fileName]);

  const previewPdf = useCallback(async () => {
    setStatus("Generiere Vorschau…");
    try {
      const bytes = previewBytes ?? (await renderLetterToBytes(letterDoc));
      const blob = new Blob([bytes as BlobPart], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
      setStatus("Vorschau geöffnet.");
    } catch (e) {
      setStatus(`Fehler: ${String(e)}`);
    }
  }, [letterDoc, previewBytes]);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">brief</h1>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <label className="flex items-center gap-2">
          Norm:
          <select
            value={standardId}
            onChange={(e) => setStandardId(e.target.value)}
            className="rounded border px-2 py-1"
          >
            {listStandards().map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          Dateiname:
          <input
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="rounded border px-2 py-1"
          />
          .pdf
        </label>
        <input
          type="file"
          accept="image/jpeg"
          onChange={(e) => e.target.files?.[0] && handleImage(e.target.files[0])}
        />
      </div>

      {FIELDS.map((field) => (
        <div key={field} className="mb-3">
          <label className="mb-1 block font-medium">{field}</label>
          <textarea
            value={values[field] ?? ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [field]: e.target.value }))}
            rows={field === "text" ? 8 : field === "address" ? 5 : 2}
            className="w-full rounded border p-2"
          />
          <div className="mt-1 flex gap-2">
            <button
              type="button"
              onClick={() => void saveSnip(field)}
              className="rounded bg-gray-200 px-2 py-1 text-sm"
            >
              Speichern
            </button>
            <select
              onChange={(e) => e.target.value && void loadSnip(field, e.target.value)}
              className="rounded border px-2 py-1 text-sm"
              defaultValue=""
            >
              <option value="">Laden…</option>
              {(snippetKeys[field] ?? []).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => void previewPdf()}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Vorschau (PDF)
        </button>
        <button
          type="button"
          onClick={() => void exportPdf()}
          className="rounded bg-black px-4 py-2 text-white"
        >
          Speichern als PDF
        </button>
      </div>
      <div className="mt-4">
        {loading ? <p className="text-sm text-gray-500">Vorschau wird generiert…</p> : null}
        {previewError ? <p className="text-sm text-red-600">{previewError}</p> : null}
        <Preview bytes={previewBytes} />
      </div>
      {status ? <p className="mt-2 text-sm text-gray-600">{status}</p> : null}
    </div>
  );
}

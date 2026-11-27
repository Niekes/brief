import { useMemo, useState } from "react";
import { getStandard } from "@/lib/standards/registry";
import type { LetterDocument, LetterImage } from "@/features/letter/types";
import { readImage } from "@/features/letter/read-image";
import { usePdfPreview } from "@/features/letter/usePdfPreview";
import { useSnippets } from "@/features/letter/useSnippets";
import { useLetterExport } from "@/features/letter/useLetterExport";
import { ExportPanel } from "@/features/letter/ExportPanel";
import { LetterFields } from "@/features/letter/LetterFields";
import { Toolbar } from "@/features/letter/Toolbar";
import { Preview } from "@/features/letter/Preview";

export default function App() {
  const [standardId, setStandardId] = useState("din-5008");
  const [fileName, setFileName] = useState("brief");
  const [image, setImage] = useState<LetterImage | null>(null);

  const { values, setValues, snippetKeys, save, load } = useSnippets();
  const standard = getStandard(standardId);

  const handleImage = (file: File) => readImage(file, setImage);

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
  const { status, exportPdf } = useLetterExport(letterDoc, fileName);

  return (
    <div className="mx-auto max-w-4xl p-4">
      <h1 className="mb-4 text-2xl font-bold">brief</h1>
      <Toolbar
        standardId={standardId}
        onStandardChange={setStandardId}
        fileName={fileName}
        onFileNameChange={setFileName}
        onImage={handleImage}
      />
      <LetterFields
        values={values}
        setValues={setValues}
        snippetKeys={snippetKeys}
        save={save}
        load={load}
      />
      <ExportPanel status={status} onExport={() => void exportPdf()} />
      {loading ? <p className="mt-2 text-sm text-gray-500">Vorschau wird generiert…</p> : null}
      {previewError ? <p className="mt-2 text-sm text-red-600">{previewError}</p> : null}
      <div className="mt-4">
        <Preview bytes={previewBytes} />
      </div>
    </div>
  );
}

export interface ExportPanelProps {
  status: string;
  onExport: () => void;
}

export function ExportPanel({ status, onExport }: ExportPanelProps) {
  return (
    <>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={onExport} className="rounded bg-black px-4 py-2 text-white">
          Speichern als PDF
        </button>
      </div>
      {status ? <p className="mt-2 text-sm text-gray-600">{status}</p> : null}
    </>
  );
}

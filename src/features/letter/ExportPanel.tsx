import { AppButton } from "@/components/app-button";

export interface ExportPanelProps {
  status: string;
  onExport: () => void;
}

export function ExportPanel({ status, onExport }: ExportPanelProps) {
  return (
    <>
      <div className="mt-4 flex gap-3">
        <AppButton onClick={onExport}>Speichern als PDF</AppButton>
      </div>
      {status ? <p className="mt-2 text-sm text-muted-foreground">{status}</p> : null}
    </>
  );
}

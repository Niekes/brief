import { listStandards } from "@/lib/standards/registry";

export interface ToolbarProps {
  standardId: string;
  onStandardChange: (id: string) => void;
  fileName: string;
  onFileNameChange: (name: string) => void;
  onImage: (file: File) => void;
}

export function Toolbar({
  standardId,
  onStandardChange,
  fileName,
  onFileNameChange,
  onImage,
}: ToolbarProps) {
  return (
    <div className="mb-4 flex flex-wrap items-center gap-3">
      <label className="flex items-center gap-2">
        Norm:
        <select
          value={standardId}
          onChange={(e) => onStandardChange(e.target.value)}
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
          onChange={(e) => onFileNameChange(e.target.value)}
          className="rounded border px-2 py-1"
        />
        .pdf
      </label>
      <input
        type="file"
        accept="image/jpeg"
        onChange={(e) => e.target.files?.[0] && onImage(e.target.files[0])}
      />
    </div>
  );
}

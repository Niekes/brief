import { AppFileInput, AppInput } from "@/components/app-input";
import { AppSelect } from "@/components/app-select";
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
    <div className="mb-4 flex flex-wrap items-end gap-3">
      <AppSelect
        label="Norm"
        options={listStandards().map((s) => ({ value: s.id, label: s.label }))}
        value={standardId}
        onValueChange={onStandardChange}
      />
      <div className="flex items-end gap-1">
        <AppInput label="Dateiname" value={fileName} onChange={onFileNameChange} />
        <span className="pb-2 text-sm">.pdf</span>
      </div>
      <AppFileInput label="Logo" accept="image/jpeg" onFile={onImage} />
    </div>
  );
}

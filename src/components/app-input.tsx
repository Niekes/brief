import { useId } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface AppInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export function AppInput({ label, value, onChange }: AppInputProps) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export interface AppFileInputProps {
  label: string;
  accept: string;
  onFile: (file: File) => void;
}

export function AppFileInput({ label, accept, onFile }: AppFileInputProps) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
    </div>
  );
}

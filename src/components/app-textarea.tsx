import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface AppTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}

export function AppTextarea({ label, value, onChange, rows }: AppTextareaProps) {
  const id = useId();
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {/* The primitive's field-sizing-content ignores `rows`; fixed sizing restores it. */}
      <Textarea
        id={id}
        rows={rows}
        className="field-sizing-fixed"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

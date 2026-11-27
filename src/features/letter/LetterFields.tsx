import type { Dispatch, SetStateAction } from "react";
import { AppButton } from "@/components/app-button";
import { AppDropdownMenu } from "@/components/app-dropdown-menu";
import { AppTextarea } from "@/components/app-textarea";
import { FIELDS, type LetterField } from "./fields";

export interface LetterFieldsProps {
  values: Record<string, string>;
  setValues: Dispatch<SetStateAction<Record<string, string>>>;
  snippetKeys: Record<string, string[]>;
  save: (field: LetterField) => Promise<void>;
  load: (field: LetterField, key: string) => Promise<void>;
}

export function LetterFields({ values, setValues, snippetKeys, save, load }: LetterFieldsProps) {
  return (
    <>
      {FIELDS.map((field) => (
        <div key={field} className="mb-3">
          <AppTextarea
            label={field}
            value={values[field] ?? ""}
            onChange={(value) => setValues((prev) => ({ ...prev, [field]: value }))}
            rows={field === "text" ? 8 : field === "address" ? 5 : 2}
          />
          <div className="mt-1 flex gap-2">
            <AppButton variant="secondary" onClick={() => void save(field)}>
              Speichern
            </AppButton>
            <AppDropdownMenu
              label="Laden…"
              items={snippetKeys[field] ?? []}
              onSelect={(key) => void load(field, key)}
            />
          </div>
        </div>
      ))}
    </>
  );
}

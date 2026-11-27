import type { Dispatch, SetStateAction } from "react";
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
              onClick={() => void save(field)}
              className="rounded bg-gray-200 px-2 py-1 text-sm"
            >
              Speichern
            </button>
            <select
              onChange={(e) => e.target.value && void load(field, e.target.value)}
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
    </>
  );
}

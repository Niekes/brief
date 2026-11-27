import { useEffect, useState } from "react";
import { listSnippetKeys, loadSnippet, saveSnippet } from "@/lib/storage/snippets";
import { FIELDS, type LetterField } from "./fields";

export function useSnippets() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [snippetKeys, setSnippetKeys] = useState<Record<string, string[]>>({});

  useEffect(() => {
    void (async () => {
      const keys: Record<string, string[]> = {};
      for (const field of FIELDS) keys[field] = await listSnippetKeys(field);
      setSnippetKeys(keys);
    })();
  }, []);

  const save = async (field: LetterField) => {
    const key = window.prompt(`Name für Snippet (${field})?`);
    if (!key || !values[field]) return;
    await saveSnippet(field, key, values[field]);
    setSnippetKeys((prev) => ({ ...prev, [field]: [...(prev[field] ?? []), key] }));
  };

  const load = async (field: LetterField, key: string) => {
    const value = await loadSnippet(field, key);
    if (value !== undefined) setValues((prev) => ({ ...prev, [field]: value }));
  };

  return { values, setValues, snippetKeys, save, load };
}

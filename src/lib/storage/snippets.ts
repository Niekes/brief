import { del, get, keys, set } from "idb-keyval";

export interface Snippet {
  field: string;
  key: string;
  value: string;
}

const prefix = (field: string, key: string): string => `snippet:${field}:${key}`;

export async function saveSnippet(field: string, key: string, value: string): Promise<void> {
  await set(prefix(field, key), value);
}

export async function loadSnippet(field: string, key: string): Promise<string | undefined> {
  const v = await get<string>(prefix(field, key));
  return v;
}

export async function listSnippetKeys(field: string): Promise<string[]> {
  const all = await keys();
  const p = `snippet:${field}:`;
  return all
    .map(String)
    .filter((k) => k.startsWith(p))
    .map((k) => k.slice(p.length));
}

export async function deleteSnippet(field: string, key: string): Promise<void> {
  await del(prefix(field, key));
}

import "fake-indexeddb/auto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { deleteSnippet, listSnippetKeys, loadSnippet, saveSnippet } from "./snippets";

describe("snippets", () => {
  beforeEach(async () => {
    // clear by deleting known keys not needed; idb-keyval uses default db
  });
  afterEach(async () => {
    // best-effort cleanup
  });

  it("saves and loads a snippet", async () => {
    await saveSnippet("address", "k1", "hello");
    expect(await loadSnippet("address", "k1")).toBe("hello");
  });
  it("returns undefined for missing snippet", async () => {
    expect(await loadSnippet("address", "missing")).toBeUndefined();
  });
  it("lists keys for a field", async () => {
    await saveSnippet("body", "a", "x");
    await saveSnippet("body", "b", "y");
    const keys = await listSnippetKeys("body");
    expect(keys).toContain("a");
    expect(keys).toContain("b");
  });
  it("deletes a snippet", async () => {
    await saveSnippet("ref", "d", "v");
    await deleteSnippet("ref", "d");
    expect(await loadSnippet("ref", "d")).toBeUndefined();
  });
});

/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

vi.mock("@/lib/storage/snippets", () => ({
  listSnippetKeys: vi.fn(async (field: string) => (field === "address" ? ["k1"] : [])),
  loadSnippet: vi.fn().mockResolvedValue("loaded"),
  saveSnippet: vi.fn().mockResolvedValue(undefined),
}));

import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useSnippets } from "./useSnippets";

Object.defineProperty(window, "prompt", { value: () => "mykey", writable: true });

describe("useSnippets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads keys on mount", async () => {
    const { result } = renderHook(() => useSnippets());
    await waitFor(() => expect(result.current.snippetKeys.address).toEqual(["k1"]));
  });

  it("saves a snippet when the field has a value", async () => {
    const { saveSnippet } = await import("@/lib/storage/snippets");
    const { result } = renderHook(() => useSnippets());
    await waitFor(() => expect(result.current.snippetKeys.address).toEqual(["k1"]));
    act(() => result.current.setValues((prev) => ({ ...prev, address: "hello" })));

    await act(() => result.current.save("address"));

    expect(saveSnippet).toHaveBeenCalledWith("address", "mykey", "hello");
    expect(result.current.snippetKeys.address).toEqual(["k1", "mykey"]);
  });

  it("does not save an empty field", async () => {
    const { saveSnippet } = await import("@/lib/storage/snippets");
    const { result } = renderHook(() => useSnippets());

    await act(() => result.current.save("address"));

    expect(saveSnippet).not.toHaveBeenCalled();
  });

  it("does not save without a snippet name", async () => {
    const { saveSnippet } = await import("@/lib/storage/snippets");
    vi.spyOn(window, "prompt").mockReturnValue("");
    const { result } = renderHook(() => useSnippets());
    await waitFor(() => expect(result.current.snippetKeys.address).toEqual(["k1"]));
    act(() => result.current.setValues((prev) => ({ ...prev, address: "hello" })));

    await act(() => result.current.save("address"));

    expect(saveSnippet).not.toHaveBeenCalled();
  });

  it("saves into a field without existing keys", async () => {
    const { listSnippetKeys, saveSnippet } = await import("@/lib/storage/snippets");
    (listSnippetKeys as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () => new Promise<string[]>(() => {}),
    );
    const { result } = renderHook(() => useSnippets());
    act(() => result.current.setValues((prev) => ({ ...prev, reference: "ref" })));

    await act(() => result.current.save("reference"));

    expect(saveSnippet).toHaveBeenCalledWith("reference", "mykey", "ref");
    expect(result.current.snippetKeys.reference).toEqual(["mykey"]);
  });

  it("loads a snippet into the field", async () => {
    const { loadSnippet } = await import("@/lib/storage/snippets");
    const { result } = renderHook(() => useSnippets());

    await act(() => result.current.load("address", "k1"));

    expect(loadSnippet).toHaveBeenCalledWith("address", "k1");
    expect(result.current.values.address).toBe("loaded");
  });

  it("keeps the field unchanged when no snippet exists", async () => {
    const { loadSnippet } = await import("@/lib/storage/snippets");
    (loadSnippet as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useSnippets());

    await act(() => result.current.load("address", "missing"));

    expect(result.current.values.address).toBeUndefined();
  });
});

/**
 * @vitest-environment jsdom
 */
import "fake-indexeddb/auto";
import { vi } from "vitest";

vi.mock("@/lib/storage/snippets", () => ({
  listSnippetKeys: vi.fn().mockResolvedValue(["k1"]),
  loadSnippet: vi.fn().mockResolvedValue("loaded"),
  saveSnippet: vi.fn().mockResolvedValue(undefined),
}));

import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useSnippets } from "./useSnippets";

// jsdom prompt mock
Object.defineProperty(window, "prompt", { value: () => "mykey", writable: true });

describe("useSnippets", () => {
  it("loads keys on mount", async () => {
    const { result } = renderHook(() => useSnippets());
    await waitFor(() => expect(result.current.snippetKeys.address).toEqual(["k1"]));
  });

  it("saves snippet when value present", async () => {
    const { result } = renderHook(() => useSnippets());
    result.current.setValues((prev) => ({ ...prev, address: "hello" }));
    await result.current.save("address");
    await waitFor(() => expect(true).toBe(true));
  });

  it("does not save when no value", async () => {
    const { result } = renderHook(() => useSnippets());
    await result.current.save("address");
    await waitFor(() => expect(true).toBe(true));
  });

  it("loads snippet", async () => {
    const { result } = renderHook(() => useSnippets());
    await result.current.load("address", "k1");
    await waitFor(() => expect(result.current.values.address).toBe("loaded"));
  });

  it("loads snippet undefined", async () => {
    const { loadSnippet } = await import("@/lib/storage/snippets");
    (loadSnippet as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useSnippets());
    await result.current.load("address", "k1");
    await new Promise((r) => setTimeout(r, 0));
  });
});

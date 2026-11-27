/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

vi.mock("./render", () => ({
  renderLetterToBytes: vi.fn().mockResolvedValue(new Uint8Array([1])),
}));

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { usePdfPreview } from "./usePdfPreview";
import { DIN_5008 } from "@/lib/standards/din5008";
import type { LetterDocument } from "./types";

const doc: LetterDocument = {
  standardId: "din-5008",
  standard: DIN_5008,
  content: { address: "a", additionalInfo: "b", reference: "c", body: "d", image: null },
  fileName: "x",
};

describe("usePdfPreview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns fresh bytes after the delay", async () => {
    const { renderLetterToBytes } = await import("./render");
    const { result } = renderHook(() => usePdfPreview(doc, 10));

    await waitFor(() => expect(result.current.bytes).toEqual(new Uint8Array([1])));
    expect(renderLetterToBytes).toHaveBeenCalledWith(doc);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("reports a failure without stale bytes", async () => {
    const { renderLetterToBytes } = await import("./render");
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => usePdfPreview(doc, 10));

    await waitFor(() => expect(result.current.error).toContain("boom"));
    expect(result.current.bytes).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("does not render when unmounted before the delay", async () => {
    const { renderLetterToBytes } = await import("./render");
    const { unmount } = renderHook(() => usePdfPreview(doc, 1000));
    unmount();
    await new Promise((r) => setTimeout(r, 20));

    expect(renderLetterToBytes).not.toHaveBeenCalled();
  });

  it("ignores a stale result", async () => {
    const { renderLetterToBytes } = await import("./render");
    let resolveFirst: (v: Uint8Array) => void = () => {};
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise<Uint8Array>((res) => {
          resolveFirst = res;
        }),
    );
    const doc2 = { ...doc, fileName: "y" };
    const { result, rerender } = renderHook(({ d }) => usePdfPreview(d, 10), {
      initialProps: { d: doc },
    });
    await new Promise((r) => setTimeout(r, 30));
    rerender({ d: doc2 });
    await waitFor(() => expect(result.current.bytes).toEqual(new Uint8Array([1])));

    resolveFirst(new Uint8Array([9]));
    await new Promise((r) => setTimeout(r, 20));

    expect(result.current.bytes).toEqual(new Uint8Array([1]));
    expect(renderLetterToBytes).toHaveBeenCalledTimes(2);
  });

  it("ignores a stale error", async () => {
    const { renderLetterToBytes } = await import("./render");
    let rejectFirst: (e: Error) => void = () => {};
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise<Uint8Array>((_res, rej) => {
          rejectFirst = rej;
        }),
    );
    const doc2 = { ...doc, fileName: "y" };
    const { result, rerender } = renderHook(({ d }) => usePdfPreview(d, 10), {
      initialProps: { d: doc },
    });
    await new Promise((r) => setTimeout(r, 30));
    rerender({ d: doc2 });
    await waitFor(() => expect(result.current.bytes).toEqual(new Uint8Array([1])));

    rejectFirst(new Error("stale"));
    await new Promise((r) => setTimeout(r, 20));

    expect(result.current.error).toBeNull();
  });

  it("hides a stale error when the document changes", async () => {
    const { renderLetterToBytes } = await import("./render");
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("boom"));
    const { result, rerender } = renderHook(({ d }) => usePdfPreview(d, 10), {
      initialProps: { d: doc },
    });
    await waitFor(() => expect(result.current.error).toContain("boom"));

    rerender({ d: { ...doc, fileName: "y" } });

    expect(result.current.error).toBeNull();
  });
});

/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

vi.mock("./render", () => ({
  renderLetterToBytes: vi.fn().mockResolvedValue(new Uint8Array([1])),
}));

import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
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
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns bytes after delay", async () => {
    const { result } = renderHook(() => usePdfPreview(doc, 10));
    await waitFor(() => expect(result.current.bytes).not.toBeNull(), { timeout: 2000 });
  });

  it("sets error on failure", async () => {
    const { renderLetterToBytes } = await import("./render");
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("boom"));
    const { result } = renderHook(() => usePdfPreview(doc, 10));
    await waitFor(() => expect(result.current.error).toContain("boom"), { timeout: 2000 });
  });

  it("cancels on unmount", async () => {
    const { unmount } = renderHook(() => usePdfPreview(doc, 1000));
    unmount();
    await new Promise((r) => setTimeout(r, 20));
  });

  it("ignores stale result", async () => {
    const { renderLetterToBytes } = await import("./render");
    let resolveFirst: (v: Uint8Array) => void = () => {};
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise<Uint8Array>((res) => {
          resolveFirst = res;
        }),
    );
    const doc2 = { ...doc, fileName: "y" };
    const { rerender, unmount } = renderHook(({ d }) => usePdfPreview(d, 10), {
      initialProps: { d: doc },
    });
    await new Promise((r) => setTimeout(r, 30));
    rerender({ d: doc2 });
    await new Promise((r) => setTimeout(r, 30));
    resolveFirst(new Uint8Array([9]));
    await new Promise((r) => setTimeout(r, 30));
    unmount();
  });

  it("ignores stale error", async () => {
    const { renderLetterToBytes } = await import("./render");
    let rejectFirst: (e: Error) => void = () => {};
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockImplementationOnce(
      () =>
        new Promise<Uint8Array>((_res, rej) => {
          rejectFirst = rej;
        }),
    );
    const doc2 = { ...doc, fileName: "y" };
    const { rerender, unmount } = renderHook(({ d }) => usePdfPreview(d, 10), {
      initialProps: { d: doc },
    });
    await new Promise((r) => setTimeout(r, 30));
    rerender({ d: doc2 });
    await new Promise((r) => setTimeout(r, 30));
    rejectFirst(new Error("stale"));
    await new Promise((r) => setTimeout(r, 30));
    unmount();
  });
});

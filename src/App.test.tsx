/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

const previewState = {
  bytes: null as Uint8Array | null,
  loading: true,
  error: "preview-err" as string | null,
};

vi.mock("@/features/letter/render", () => ({
  renderLetterToBytes: vi.fn().mockResolvedValue(new Uint8Array([1])),
}));
vi.mock("@/features/letter/usePdfPreview", () => ({
  usePdfPreview: vi.fn(() => previewState),
}));

vi.mock("@/lib/storage/snippets", () => ({
  saveSnippet: vi.fn().mockResolvedValue(undefined),
  loadSnippet: vi.fn().mockResolvedValue("loaded"),
  listSnippetKeys: vi.fn().mockResolvedValue(["k1"]),
  deleteSnippet: vi.fn().mockResolvedValue(undefined),
}));

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import App from "./App";

const createObjectURL = vi.fn(() => "blob:url");
const revokeObjectURL = vi.fn();
URL.createObjectURL = createObjectURL;
URL.revokeObjectURL = revokeObjectURL;
const anchorClick = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
Object.defineProperty(window, "prompt", { value: () => "mykey", writable: true });

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    previewState.loading = true;
    previewState.error = "preview-err";
  });

  it("renders heading and standard selector", () => {
    render(<App />);
    expect(screen.getByText("brief")).toBeInTheDocument();
    expect(screen.getByDisplayValue("DIN 5008")).toBeInTheDocument();
  });

  it("types into fields", () => {
    render(<App />);
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "hello" } });
    expect(ta.value).toBe("hello");
  });

  it("changes the standard", () => {
    render(<App />);
    const select = screen.getByDisplayValue("DIN 5008");
    fireEvent.change(select, { target: { value: "din-5008" } });
    expect(select).toHaveValue("din-5008");
  });

  it("handles image upload", async () => {
    const origFileReader = global.FileReader;
    const origImage = global.Image;
    class MockFR {
      onload: ((e: { target: { result: string } }) => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.({ target: { result: "data:image/jpeg;base64,AAAA" } }), 0);
      }
    }
    class MockImage {
      onload: (() => void) | null = null;
      set src(_v: string) {
        setTimeout(() => this.onload?.(), 0);
      }
      width = 10;
      height = 10;
    }
    // @ts-expect-error mock
    global.FileReader = MockFR;
    // @ts-expect-error mock
    global.Image = MockImage;

    try {
      render(<App />);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(["x"], "a.jpg", { type: "image/jpeg" });
      fireEvent.change(input, { target: { files: [file] } });

      const { usePdfPreview } = await import("@/features/letter/usePdfPreview");
      await waitFor(() =>
        expect(usePdfPreview).toHaveBeenLastCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({
              image: { src: "data:image/jpeg;base64,AAAA", width: 10, height: 10 },
            }),
          }),
        ),
      );
    } finally {
      global.FileReader = origFileReader;
      global.Image = origImage;
    }
  });

  it("ignores non-string image results", async () => {
    const origFileReader = global.FileReader;
    const origImage = global.Image;
    class MockFR {
      onload: ((e: { target: { result: unknown } }) => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.({ target: { result: null } }), 0);
      }
    }
    class MockImage {
      onload: (() => void) | null = null;
      set src(_v: string) {
        setTimeout(() => this.onload?.(), 0);
      }
      width = 10;
      height = 10;
    }
    // @ts-expect-error mock
    global.FileReader = MockFR;
    // @ts-expect-error mock
    global.Image = MockImage;

    try {
      render(<App />);
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      const file = new File(["x"], "a.jpg", { type: "image/jpeg" });
      fireEvent.change(input, { target: { files: [file] } });

      const { usePdfPreview } = await import("@/features/letter/usePdfPreview");
      await waitFor(() =>
        expect(usePdfPreview).toHaveBeenLastCalledWith(
          expect.objectContaining({
            content: expect.objectContaining({ image: { src: "", width: 10, height: 10 } }),
          }),
        ),
      );
    } finally {
      global.FileReader = origFileReader;
      global.Image = origImage;
    }
  });

  it("saves a snippet with a name", async () => {
    const { saveSnippet } = await import("@/lib/storage/snippets");
    render(<App />);
    await waitFor(() => expect(screen.getAllByText("k1").length).toBeGreaterThan(0));
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "hello" } });
    fireEvent.click(screen.getAllByText("Speichern")[0]!);

    await waitFor(() => expect(saveSnippet).toHaveBeenCalledWith("address", "mykey", "hello"));
    expect(screen.getAllByText("mykey").length).toBeGreaterThan(0);
  });

  it("does not save an empty snippet", async () => {
    const { saveSnippet } = await import("@/lib/storage/snippets");
    render(<App />);
    fireEvent.click(screen.getAllByText("Speichern")[0]!);
    await waitFor(() => expect(saveSnippet).not.toHaveBeenCalled());
  });

  it("loads a snippet into the field", async () => {
    const { loadSnippet } = await import("@/lib/storage/snippets");
    render(<App />);
    await waitFor(() => expect(screen.getAllByText("k1").length).toBeGreaterThan(0));
    const loadSelect = screen.getAllByRole("combobox")[1]!;
    fireEvent.change(loadSelect, { target: { value: "k1" } });

    await waitFor(() => expect(loadSnippet).toHaveBeenCalledWith("address", "k1"));
    await waitFor(() =>
      expect((document.querySelector("textarea") as HTMLTextAreaElement).value).toBe("loaded"),
    );
  });

  it("exports a fresh pdf", async () => {
    const { renderLetterToBytes } = await import("@/features/letter/render");
    render(<App />);
    fireEvent.click(screen.getByText("Speichern als PDF"));

    await waitFor(() => expect(screen.getByText("Fertig.")).toBeInTheDocument());
    expect(renderLetterToBytes).toHaveBeenCalledWith(
      expect.objectContaining({ fileName: "brief" }),
    );
    expect(createObjectURL).toHaveBeenCalled();
    expect(anchorClick).toHaveBeenCalled();
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:url");
  });

  it("reports export errors", async () => {
    const { renderLetterToBytes } = await import("@/features/letter/render");
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("boom"));
    render(<App />);
    fireEvent.click(screen.getByText("Speichern als PDF"));

    await waitFor(() => expect(screen.getByText("Fehler: Error: boom")).toBeInTheDocument());
  });

  it("changes the filename", () => {
    render(<App />);
    const input = screen.getByDisplayValue("brief");
    fireEvent.change(input, { target: { value: "x" } });
    expect(input).toHaveValue("x");
  });

  it("hides loading and error when idle", () => {
    previewState.loading = false;
    previewState.error = null;
    render(<App />);
    expect(screen.queryByText("Vorschau wird generiert…")).not.toBeInTheDocument();
    expect(screen.queryByText("preview-err")).not.toBeInTheDocument();
  });
});

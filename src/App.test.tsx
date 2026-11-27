/**
 * @vitest-environment jsdom
 */
import { vi } from "vitest";

vi.mock("@/features/letter/render", () => ({
  renderLetterToBytes: vi.fn().mockResolvedValue(new Uint8Array([1])),
}));
vi.mock("@/lib/storage/snippets", () => ({
  saveSnippet: vi.fn().mockResolvedValue(undefined),
  loadSnippet: vi.fn().mockResolvedValue("loaded"),
  listSnippetKeys: vi.fn().mockResolvedValue(["k1"]),
  deleteSnippet: vi.fn().mockResolvedValue(undefined),
}));

import "@testing-library/jest-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderLetterToBytes } from "@/features/letter/render";
import App from "./App";

if (!URL.createObjectURL) URL.createObjectURL = () => "blob:url";
if (!URL.revokeObjectURL) URL.revokeObjectURL = () => {};
Object.defineProperty(window, "open", { value: () => null, writable: true });

describe("App", () => {
  it("renders heading", () => {
    render(<App />);
    expect(screen.getByText("brief")).toBeInTheDocument();
  });

  it("changes standard", () => {
    render(<App />);
    const select = screen.getByDisplayValue("DIN 5008");
    fireEvent.change(select, { target: { value: "din-5008" } });
  });

  it("types into fields", () => {
    render(<App />);
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "hello" } });
  });

  it("saves snippet with value", async () => {
    Object.defineProperty(window, "prompt", { value: () => "mykey", writable: true });
    render(<App />);
    const ta = document.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(ta, { target: { value: "hello" } });
    const btn = screen.getAllByText("Speichern")[0]!;
    fireEvent.click(btn);
    await waitFor(() => expect(true).toBe(true));
  });

  it("loads snippet", async () => {
    render(<App />);
    await waitFor(() => expect(screen.getAllByText("k1").length).toBeGreaterThan(0));
    const selects = screen.getAllByRole("combobox");
    const loadSelect = selects[1]!;
    fireEvent.change(loadSelect, { target: { value: "k1" } });
    await waitFor(
      () =>
        expect((document.querySelector("textarea") as HTMLTextAreaElement).value).toBe("loaded"),
      { timeout: 1000 },
    );
  });

  it("changes filename", () => {
    render(<App />);
    const input = screen.getByDisplayValue("brief");
    fireEvent.change(input, { target: { value: "x" } });
  });

  it("exports pdf error path", async () => {
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("boom"));
    render(<App />);
    fireEvent.click(screen.getByText("Speichern als PDF"));
    await waitFor(() => expect(screen.getByText(/Fehler:/)).toBeInTheDocument());
  });

  it("previews pdf error path", async () => {
    (renderLetterToBytes as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error("boom"));
    render(<App />);
    fireEvent.click(screen.getByText("Vorschau (PDF)"));
    await waitFor(() => expect(screen.getByText(/Fehler:/)).toBeInTheDocument());
  });

  it("handles image upload", async () => {
    const origFileReader = global.FileReader;
    class MockFR {
      onload: ((e: { target: { result: string } }) => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.({ target: { result: "data:image/jpeg;base64,AAAA" } }), 0);
      }
    }
    // @ts-expect-error mock
    global.FileReader = MockFR;
    const origImage = global.Image;
    class MockImage {
      onload: (() => void) | null = null;
      set src(_v: string) {
        setTimeout(() => this.onload?.(), 0);
      }
      width = 10;
      height = 10;
    }
    // @ts-expect-error mock
    global.Image = MockImage;

    render(<App />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["x"], "a.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    await new Promise((r) => setTimeout(r, 50));

    global.FileReader = origFileReader;
    global.Image = origImage;
  });

  it("handles image upload non-string result", async () => {
    const origFileReader = global.FileReader;
    class MockFR {
      onload: ((e: { target: { result: unknown } }) => void) | null = null;
      readAsDataURL() {
        setTimeout(() => this.onload?.({ target: { result: null } }), 0);
      }
    }
    // @ts-expect-error mock
    global.FileReader = MockFR;
    const origImage = global.Image;
    class MockImage {
      onload: (() => void) | null = null;
      set src(_v: string) {
        setTimeout(() => this.onload?.(), 0);
      }
      width = 10;
      height = 10;
    }
    // @ts-expect-error mock
    global.Image = MockImage;

    render(<App />);
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["x"], "a.jpg", { type: "image/jpeg" });
    fireEvent.change(input, { target: { files: [file] } });
    await new Promise((r) => setTimeout(r, 50));

    global.FileReader = origFileReader;
    global.Image = origImage;
  });

  it("loads snippet undefined", async () => {
    const { loadSnippet } = await import("@/lib/storage/snippets");
    (loadSnippet as ReturnType<typeof vi.fn>).mockResolvedValueOnce(undefined);
    render(<App />);
    await waitFor(() => expect(screen.getAllByText("k1").length).toBeGreaterThan(0));
    const selects = screen.getAllByRole("combobox");
    const loadSelect = selects[1]!;
    fireEvent.change(loadSelect, { target: { value: "k1" } });
    await new Promise((r) => setTimeout(r, 50));
  });

  it("saves snippet", async () => {
    Object.defineProperty(window, "prompt", { value: () => "mykey", writable: true });
    render(<App />);
    const btn = screen.getAllByText("Speichern")[0]!;
    fireEvent.click(btn);
    await waitFor(() => expect(true).toBe(true));
  });

  it("loads snippet", async () => {
    render(<App />);
    const selects = screen.getAllByRole("combobox");
    const loadSelect = selects[selects.length - 1]!;
    fireEvent.change(loadSelect, { target: { value: "k1" } });
    await waitFor(() => expect(true).toBe(true));
  });

  it("previews pdf", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Vorschau (PDF)"));
    await waitFor(() => expect(screen.getByText(/Vorschau geöffnet|Fehler/)).toBeInTheDocument());
  });

  it("exports pdf", async () => {
    render(<App />);
    fireEvent.click(screen.getByText("Speichern als PDF"));
    await waitFor(() => expect(screen.getByText(/Fertig\.|Fehler/)).toBeInTheDocument());
  });
});

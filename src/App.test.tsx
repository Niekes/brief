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

// Radix opens menus and selects on pointerdown, not click.
const open = (trigger: HTMLElement) =>
  fireEvent.pointerDown(trigger, { button: 0, ctrlKey: false, pointerType: "mouse" });
const loadMenus = () => screen.getAllByRole("button", { name: "Laden…" });

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
    expect(screen.getByRole("combobox", { name: "Norm" })).toHaveTextContent("DIN 5008");
  });

  it("types into fields", () => {
    render(<App />);
    const ta = screen.getByLabelText("address");
    fireEvent.change(ta, { target: { value: "hello" } });
    expect(ta).toHaveValue("hello");
  });

  it("changes the standard", () => {
    render(<App />);
    const select = screen.getByRole("combobox", { name: "Norm" });
    open(select);
    fireEvent.click(screen.getByRole("option", { name: "DIN 5008" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(select).toHaveTextContent("DIN 5008");
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
      const input = screen.getByLabelText("Logo");
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
      const input = screen.getByLabelText("Logo");
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
    await waitFor(() => expect(loadMenus()[0]).toBeEnabled());
    fireEvent.change(screen.getByLabelText("address"), { target: { value: "hello" } });
    fireEvent.click(screen.getAllByRole("button", { name: "Speichern" })[0]!);

    await waitFor(() => expect(saveSnippet).toHaveBeenCalledWith("address", "mykey", "hello"));
    open(loadMenus()[0]!);
    expect(await screen.findByRole("menuitem", { name: "mykey" })).toBeInTheDocument();
  });

  it("does not save an empty snippet", async () => {
    const { saveSnippet } = await import("@/lib/storage/snippets");
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", { name: "Speichern" })[0]!);
    await waitFor(() => expect(saveSnippet).not.toHaveBeenCalled());
  });

  it("loads a snippet into the field", async () => {
    const { loadSnippet } = await import("@/lib/storage/snippets");
    render(<App />);
    await waitFor(() => expect(loadMenus()[0]).toBeEnabled());
    open(loadMenus()[0]!);
    fireEvent.click(await screen.findByRole("menuitem", { name: "k1" }));

    await waitFor(() => expect(loadSnippet).toHaveBeenCalledWith("address", "k1"));
    await waitFor(() => expect(screen.getByLabelText("address")).toHaveValue("loaded"));
  });

  it("disables Laden… for fields without snippets", async () => {
    const { listSnippetKeys } = await import("@/lib/storage/snippets");
    (listSnippetKeys as ReturnType<typeof vi.fn>).mockResolvedValue([]);
    try {
      render(<App />);
      await waitFor(() => expect(listSnippetKeys).toHaveBeenCalledTimes(4));
      for (const menu of loadMenus()) expect(menu).toBeDisabled();
    } finally {
      (listSnippetKeys as ReturnType<typeof vi.fn>).mockResolvedValue(["k1"]);
    }
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
    const input = screen.getByLabelText("Dateiname");
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

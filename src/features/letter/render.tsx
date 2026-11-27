import { render } from "takumi-pdf";
import { googleFonts } from "@takumi-rs/helpers";
import { Document, Page } from "@/lib/pdf-primitives";
import { PdfcnThemeProvider } from "@/components/pdf/theme-provider";
import { Text } from "@/components/pdf/text/text";
import type { LetterDocument } from "./types";
import { pageDimensions } from "@/lib/standards/types";

export async function renderLetterToBytes(doc: LetterDocument): Promise<Uint8Array> {
  const dims = pageDimensions(doc.standard);
  const size = dims.width === 210 && dims.height === 297 ? "a4" : "letter";
  const element = (
    <Document>
      <Page size={size} style={{ width: dims.width, height: dims.height, padding: 0 }}>
        <PdfcnThemeProvider>
          <div
            style={{
              padding: `${doc.standard.margins.top}px ${doc.standard.margins.right}px ${doc.standard.margins.bottom}px ${doc.standard.margins.left}px`,
            }}
          >
            {doc.content.image?.src ? (
              <img
                alt=""
                src={doc.content.image.src}
                style={{
                  width: doc.standard.logo.size,
                  height: doc.standard.logo.size,
                  float: "right",
                }}
              />
            ) : null}
            <Text>{doc.content.address}</Text>
            <Text align="right">{doc.content.additionalInfo}</Text>
            <Text weight="bold">{doc.content.reference}</Text>
            <Text>{doc.content.body}</Text>
          </div>
        </PdfcnThemeProvider>
      </Page>
    </Document>
  );
  const bytes = await render(element, {
    size,
    margin: 0,
    fonts: await googleFonts(["Inter"]),
    lang: "de",
  });
  return bytes;
}

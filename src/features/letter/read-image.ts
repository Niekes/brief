import type { LetterImage } from "./types";

export function readImage(file: File, onLoad: (image: LetterImage) => void): void {
  const reader = new FileReader();
  reader.onload = (e) => {
    const src = typeof e.target?.result === "string" ? e.target.result : "";
    const img = new Image();
    img.onload = () => onLoad({ src, width: img.width, height: img.height });
    img.src = src;
  };
  reader.readAsDataURL(file);
}

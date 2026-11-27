// Radix Select calls pointer-capture and scrollIntoView, which jsdom lacks.
if (typeof Element !== "undefined") {
  Element.prototype.hasPointerCapture = () => false;
  Element.prototype.releasePointerCapture = () => {};
  Element.prototype.scrollIntoView = () => {};
}

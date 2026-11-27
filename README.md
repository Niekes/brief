<p align="center">
  <a href="https://github.com/sponsors/niekes"><img src="https://img.shields.io/badge/Sponsor_brief-EA4AAA?logo=githubsponsors&logoColor=white&style=for-the-badge" alt="Sponsor brief"></a>
</p>

<p align="center">
  <strong>A browser-based DIN 5008 letter writer: fill in the fields, drop in a JPEG logo, and export a pixel-exact PDF.</strong><br>
  No account, no upload, no backend. Free and open source, kept alive by one maintainer and the people who sponsor the work.
</p>

<p align="center">
  <a href="https://github.com/Niekes/brief/stargazers"><img src="https://img.shields.io/github/stars/Niekes/brief" alt="GitHub stars"></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-Ready-blue" alt="TypeScript"></a>
  <a href="https://en.wikipedia.org/wiki/DIN_5008"><img src="https://img.shields.io/badge/DIN_5008-supported-blue" alt="DIN 5008"></a>
  <img src="https://img.shields.io/badge/backend-none-brightgreen" alt="Client-side only">
</p>

<p align="center">
  <a href="https://react.dev/"><img src="https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB" alt="React 19"></a>
  <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite_8-646CFF?logo=vite&logoColor=white" alt="Vite 8"></a>
  <a href="https://vitest.dev/"><img src="https://img.shields.io/badge/Vitest_4-6E9F18?logo=vitest&logoColor=white" alt="Vitest 4"></a>
  <a href="https://pnpm.io/"><img src="https://img.shields.io/badge/pnpm-12-F9AD00?logo=pnpm&logoColor=white" alt="pnpm"></a>
  <a href="https://pdfcn.dev/"><img src="https://img.shields.io/badge/Takumi-PDF-1F6FEB" alt="Takumi"></a>
  <a href="https://mozilla.github.io/pdf.js/"><img src="https://img.shields.io/badge/pdf.js-preview-1F6FEB" alt="pdf.js"></a>
  <a href="https://fallow.tools/"><img src="https://img.shields.io/badge/fallow-1F6FEB" alt="fallow"></a>
</p>

<p align="center">
  <a href="https://brief.niekes.com/">Live app</a> ·
  <a href="https://github.com/Niekes/brief">Source</a> ·
  <a href="https://github.com/Niekes/brief/issues">Issues</a>
</p>

---

## Sponsor brief

**brief** is free, and it always will be. There is no company behind it — just one maintainer working in spare time — so the cost of keeping it alive is paid for by the people who depend on it.

If brief saves you time, [become a sponsor](https://github.com/sponsors/niekes).

| Tier        | What you get                                                                                |
| ----------- | ------------------------------------------------------------------------------------------- |
| **$5/mo**   | Your name in the [sponsors list](#sponsors) and my sincere thanks                           |
| **$25/mo**  | The above, plus your logo in this README and priority issue triage                          |
| **$100/mo** | The above, plus direct email access for feature requests and a mention in the release notes |

Where the money goes:

- **Issue triage and bug fixes.** Sponsorship buys a reply within a couple of days instead of whenever I get to it.
- **A renderer that stays correct.** Keeping the DIN 5008 layout, the Takumi PDF output and the pdf.js preview in shape as browser APIs and dependencies move on.
- **More letter standards.** US and Portuguese norms behind the same `LetterStandard` interface.
- **Time for new work.** Better snippet handling, more layout options, and whatever the community dreams up.

Prefer a one-off? The [sponsor page](https://github.com/sponsors/niekes) also takes one-time contributions.

**Need a company sponsorship or an invoice?** [Get in touch](mailto:s@niekes.com).

## Sponsors

Thank you to the people who make this possible. Sponsors at $25/mo and above get their logo in this README; everyone gets their name below.

<!-- New sponsors go below this line, one per line. -->

## Using brief

No install — it runs in the browser at [brief.niekes.com](https://brief.niekes.com/).

Everything is client-side: letters and snippets never leave the browser.

To work on it locally:

```bash
pnpm install
pnpm dev
```

`pnpm dev` serves the app at `http://localhost:3000`. Build with `pnpm build` and run all checks with `pnpm verify`.

## How it works

- The editor holds one `LetterDocument`: the chosen standard, the field values, an optional JPEG logo and the filename.
- DIN 5008 is the first `LetterStandard`; page size and layout come from the norm, not from hardcoded values.
- Takumi/pdfcn turns the document into real PDF bytes. The live preview renders a debounced generation; **export always renders fresh bytes**, so a download can never contain a stale preview.
- pdf.js paints those bytes onto a canvas at scale 1.0 — the preview is 1:1 with the exported PDF.
- Saved snippets are field values in IndexedDB via `idb-keyval`.

## Quality gates

| Gate             | Command                                      | Result                   |
| ---------------- | -------------------------------------------- | ------------------------ |
| Typecheck        | `pnpm typecheck`                             | ✓                        |
| Format + lint    | `vp check`                                   | ✓                        |
| Tests + coverage | `pnpm exec vitest run --coverage`            | 47 tests, 100 % coverage |
| Dead code        | `fallow dead-code`                           | no findings              |
| Architecture     | `fallow architecture`                        | no findings              |
| Health           | `fallow health --coverage … --min-score 100` | 100 A                    |
| Production build | `pnpm build`                                 | ✓                        |

`pnpm verify` runs the typecheck, lint, tests with coverage and the fallow checks in one go.

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=niekes/brief&type=date&legend=bottom-right)](https://www.star-history.com/#niekes/brief&type=date&legend=bottom-right)

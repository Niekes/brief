# shadcn primitives stay untouched and are only reachable through app-* components

The UI is built from shadcn primitives in `src/components/ui/`. They are never edited by hand and are only changed with `pnpm dlx shadcn@latest add <name> --overwrite`, so a registry update can always be pulled in cleanly. Features and `App.tsx` never import them directly: they use the `App*` components in `src/components/app-*.tsx`. Those components have small APIs shaped for this app, wire up their own labels and do not pass `className` through, so the look of the app is decided in one place.

## Considered options

- **Edit primitives in place** (the usual shadcn workflow): rejected, because local edits get lost or conflict on the next `--overwrite`.
- **Thin re-exports** (`export { Button as AppButton }`): rejected, because they satisfy the rule on paper but give no app-specific API.
- **Block the imports with a lint rule** (`no-restricted-imports`): rejected in favour of fallow boundaries, which follow the import graph and so also catch relative imports.

## Consequences

The rule is enforced in four places:

- **fallow zones:** `ui` may only be imported by `app-components`, and `pnpm verify` runs `fallow architecture`.
- **oxlint `react/forbid-elements`:** raw `button`, `input`, `select`, `textarea` and `label` elements are rejected outside `app-*`.
- **Excluded from checks:** `ui/**` is left out of lint, formatting, coverage, fallow health and dupes.
- **Claude Code hook:** a PreToolUse hook in `.claude/settings.json` refuses agent edits under `src/components/ui/`.

The shadcn registry currently leaves some dependencies out (`class-variance-authority`, `lucide-react`, `tw-animate-css`), so they are added by hand. When you add a new primitive, run `pnpm typecheck` to catch any that are missing.

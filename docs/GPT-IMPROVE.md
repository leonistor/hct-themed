# GPT‑IMPROVE – Roadmap for Repository Refactoring

## Overview
The repo currently works as a monorepo with three workspaces (`admin`, `web`, `e2e`).  Several areas are duplicated or loosely coupled, making new feature work harder than necessary.  The following roadmap groups improvements by impact and effort.  All items are **planned**; implementation can happen incrementally.

---

## 1. Centralised tooling & configuration
| Item | Description | Benefit |
|------|-------------|---------|
| **Root ESLint / Prettier** | Add `eslint.config.mjs`, `prettier.config.mjs` at the repo root and have each workspace `extends` them. | Consistent linting/formatting across workspaces, single source of truth. | ❌ Postponed, closed |
| **Root TypeScript base config** | Create `tsconfig.base.json` with common `compilerOptions` (strict mode, `moduleResolution: "bundler"`, path aliases, etc.). `admin/tsconfig.json` extends this file; `web/tsconfig.json` keeps `astro/tsconfigs/strict` (no change). | Guarantees identical TypeScript behaviour, reduces duplication. **✅ Done** (commit `3bdb89b`). |
| **Unified npm scripts** | In the root `package.json` add scripts that forward to workspaces using `bun run --filter <workspace> <script>`. Example: `"lint": "bun run --filter admin lint && bun run --filter web lint"`. | One place to run lint/type‑check/tests for the whole monorepo. | ❌ Postponed, closed |

---

## 2. Shared payload typings
1. Move `admin/src/payload-types.ts` to a new shared package, e.g. `shared/types/payload-types.ts`.
2. Export the types from that location.
3. Update imports in **admin** (`admin/src/...`) and **web** (`web/src/...`) to reference the shared types.

*Why*: Prevents type drift when collections change; a single source of truth for collection shapes.

**✅ Done** (branch `feat/shared-payload-types`, merged to `main` at `7c99cd3`). Implementation notes:
- New `shared/` workspace (`shared/package.json`, exports `./types/payload-types.ts`; `payload@3.88.0` as a devDependency so the generated `declare module 'payload'` augmentation resolves). It is registered in the root `workspaces` array and added as a `workspace:*` dependency in `admin` and `web`.
- The file was `git mv`'d from `admin/src/payload-types.ts` to `shared/types/payload-types.ts`. `admin/src/payload.config.ts` `outputFile` points there, and `admin/src/index.ts` does `export * from 'shared'`.
- Web type imports now read from `shared`; **runtime `config` imports stay `from "admin"`** (they pull the live Payload config, not just types).
- Regenerate after collection changes with `bun run generate:types` in `admin` (writes into `shared/types`).

---

## 3. Core utilities package
Create a lightweight package (e.g. `packages/core` or `libs/common`) that provides:
- `getPayloadClient()` – the bootstrap used by scripts (`import { config as payloadConfig } from "admin"; const payload = await getPayload({ config: payloadConfig })`).
- Helpers for file‑system ops (`pathExists`, `atomicWrite`).
- Debounce implementation used by the TOML watcher.
- Any other small reusable helpers (e.g., logging utility).

All data‑generation scripts (`toml-watcher.mjs`, `generate‑menus.ts`, multilingual generators, etc.) should import from this core package instead of duplicating code.

*Adjustment*: A `shared/` workspace now exists (Task 2) and already owns the generated Payload types. Prefer adding the core utilities as exports of `shared` (e.g. `shared/payloadClient.ts`, `shared/fs.ts`) rather than creating a separate `packages/core`/`libs/common` workspace, to avoid extra workspace sprawl. Update Quick win #3 accordingly.

**✅ Done** (branch `feat/core-utils`). Implementation:
- Core utilities live in `shared/src/` as Node- and Bun-compatible `*.mjs` + `*.d.mts` pairs (so they load both under the `node`-invoked `toml-watcher`/multilingual scripts and the Bun/tsx-run `.ts` data scripts). Exposed via `shared/package.json` subpath exports: `shared/fs` (`pathExists`, `ensureDir`, `atomicWrite`), `shared/debounce`, `shared/payload` (`getPayloadClient(config)`), `shared/logger`.
- `getPayloadClient` takes `config` as a parameter (callers still `import { config as payloadConfig } from "admin"`) to avoid a `shared` → `admin` circular import.
- Refactored: `toml-watcher.mjs`, `generate-multilingual-content.mjs`, `remove-multilingual.mjs`, `remove-draft-from-sitemap.mjs` (drop local `pathExists`/`debounce`/atomic-write), and `generate-menus.ts` / `generate-prods-ctas.ts` (use `getPayloadClient`).
- Web API routes and admin seed scripts were left untouched (out of scope).

---

## 4. I18n utilities
**✅ Done** (branch `feat/i18n-utilities`, merged to `main` at `f69b8fe`). Implementation:
- New `web/src/lib/i18n.ts` facade exposing `defaultLocale`, `supportedLocales` (codes array), `localeFromPath`, `localizedPath`, `langParam`, `getLanguageName`, and re-exporting `useTranslations`/`getLocaleUrlCTM` from `i18nUtils.ts` (which stays the single source of truth). Reading `language.json` and `config.settings.multilingual` keeps locale config in one place.
- Replaced the duplicated `lang.languageCode === defaultLanguage && !showDefaultLangInUrl ? undefined : lang.languageCode` `getStaticPaths` expression in the six `[single]`/`[tag]`/`[category]`/`[slug]` routes with `langParam(...)`, and switched `LanguageSwitcher.astro` to `localizedPath` + `getLanguageName`.
- Adding a language remains a config-only change (edit `language.json` + add the per-locale JSON files).

1. Add `src/lib/i18n.ts` exposing:
   - `supportedLocales`, `defaultLocale`
   - `localeFromPath(path: string): string`
   - `localizedPath(base: string, locale: string): string`
2. Replace ad‑hoc locale handling in page routes (`[...lang]/*.astro`) with calls to this module.
3. Centralise translation loading so new language JSON files can be added without touching page code.

*Why*: Adding a new language or changing routing rules will be a one‑line change in the utility module.

---

## 5. Component registry
**✅ Done** (branch `feat/component-registry`, see `web/src/lib/componentRegistry.ts`). Implementation:
- New `web/src/lib/componentRegistry.ts` exports `componentRegistry: string[]` listing every auto‑imported component.
- `astro.config.mjs` imports it and passes `imports: componentRegistry` to `patchedAutoImport`, removing the inline list.
- Adding a new UI component is now a one‑line addition to the registry file instead of editing the Astro config.

1. Create `src/lib/componentRegistry.ts` (or JSON) that lists shared UI components to be auto‑imported.
2. Update `astro.config.mjs` to import this registry and pass it to `patchedAutoImport`.
3. Adding a new UI component becomes a simple entry in the registry file rather than editing the Astro config.

---

## 6. Styling strategy
**✅ Done** (branch `feat/styling-strategy`). Implementation:
- Renamed the single web entry `src/styles/global.css` → `src/styles/tailwind.css` and updated `Base.astro` to import it once (matches the planned single entry point).
- `tailwind.css` composes everything from Tailwind `@layer` partials (`base.css`, `animation.css`, `navigation.css`, `components.css` via `@layer components`, plus `safe.css` → `buttons.css`/`utilities.css` which already use `@utility`), the site theme (`theme.css` `@theme inline`), and the required plugins. A header comment documents its role as the single entry.
- Removed a stray duplicate `@import "tailwindcss";` inside `ProductVariants.astro`'s scoped `<style>`. That style relied on the import to supply the `sm` variant, which diverged from the site's custom breakpoints in `theme.css`. Replaced the custom `.td-class`/`.tr-class` with Tailwind utility classes applied directly to the table markup (aligns with "prefer utility classes directly").
- `admin.css` is intentionally retained as a separate entry for the standalone admin scaffold pages (`/admin`, `/admin/login`), which bypass `Base.astro` and need the shared Basecoat/Tailwind entry.

*Result*: One canonical Tailwind entry for the site, no duplicate framework imports, and component styles now resolve against the site's real breakpoint theme.

*Note*: The earlier build failure on the `ImageItem` MDX shortcode was caused by `componentRegistry.ts` (Task 5) dropping `@/shortcodes/ImageItem.astro` / `@/shortcodes/ImageList.astro` that the previous inline auto‑import list contained. Re‑added them to the registry; `bun run build` now passes.

---

## 7. Web‑side testing
**❌ Postponed, closed.** No web test runner is wired up and there is no current demand for unit tests on the utility modules; revisit if the web codebase grows or regressions appear.

1. Add a Vitest config in `web/vitest.config.ts`.
2. Write unit tests for core utilities:
   - `toml-watcher` conversion logic
   - i18n helper functions
   - component registry generation
3. Add a root script `"test:web": "cd web && bun run test"`.
4. Include web tests in CI.

---

## 8. Unified CLI entry point
**❌ Postponed, closed.** The existing `bun run` scripts per workspace are sufficient for current workflows; a unified CLI adds indirection without clear near-term benefit.

- Add `scripts/cli.ts` using `commander` (or `yargs`).
- Expose commands such as:
  - `generate:menus`
  - `generate:config --watch`
  - `watch:config`
- The CLI consumes the core utilities package, so each command stays tiny.

*Benefit*: No more ad‑hoc `node ./script.ts` calls; developers get `bun run cli -- help`.

---

## 9. CI / GitHub Actions
**❌ Postponed, closed.** No CI pipeline is configured for this repo yet and there is no immediate need; the local `astro-check` + `build` steps cover the current verification needs.

Create `.github/workflows/ci.yml` that runs on push/PR:
- `bun install`
- `bun run lint`
- `bun run typecheck` (via `tsc --noEmit` using the shared tsconfig)
- `bun run test` (admin & web)
- `bun run astro-check` (web) and a quick production build check.

---

## 10. Documentation
- Add `DEVELOPMENT.md` at the repo root covering:
  - Workspace layout & shared packages.
  - How to add a new Payload collection (including type propagation).
  - How to add a new UI component (registry flow).
  - How to run scripts via the unified CLI.
  - How to run the full test suite and CI locally.

---

## High‑impact quick wins (≤30 min each)
| # | Quick win | Steps |
|---|-----------|-------|
| 1 | **Root tsconfig.base.json** | Create `tsconfig.base.json` with common compiler options, add `extends` in `admin/tsconfig.json` (web keeps `astro/tsconfigs/strict`). | ✅ Done (`3bdb89b`) |
| 2 | **Move payload types** | Create `shared/types/payload-types.ts` as a `shared` workspace, move the file, update imports in both workspaces (runtime `config` stays `from "admin"`). | ✅ Done (`7c99cd3`) |
| 3 | **Core payload client** | Add `shared/payloadClient.ts` (see Task 3 adjustment) containing the bootstrap code, replace the three scripts to import it. | ✅ Done (see Task 3) |
| 4 | **Component registry** | Add `src/lib/componentRegistry.ts` (JSON array), adjust `astro.config.mjs` to read it. | ✅ Done (`feat/component-registry`) |
| 5 | **Add Vitest test for toml‑watcher** | Write a test that feeds a sample `config.toml` and asserts the generated JSON matches a fixture. | ❌ Postponed, closed (see Task 7) |
| 6 | **Create DEVELOPER.md** | Summarise the monorepo workflow, commands, and how to add new workspaces. |

---

## Next steps
1. Open a PR titled **"Add GPT‑IMPROVE roadmap"** containing this `GPT-IMPROVE.md` file.
2. Prioritise the quick‑win items in the PR description.
3. After the PR lands, start implementing items in the order of impact (centralised tooling → shared types → core utilities).

---

*This document serves as a living backlog; each action can be turned into an issue or a task in the project board.*

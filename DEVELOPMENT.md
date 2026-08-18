# Development Guide

Monorepo for the Hațegan Consulting & Trading marketing site. Built with [Bun](https://bun.sh), never `npm`/`pnpm`/`node`/`vite` directly (see `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`).

## Workspace layout

| Workspace | Stack | Role |
|-----------|-------|------|
| `admin` | Payload CMS 3.88 + Next.js 16 (port 3000) | Content backend, SQLite DB at `../db/hct.db`. Dev auto-login `admin@test.com` / `test1234`. |
| `web` | Astro 7 | Public marketing site (the deliverable). Build output is `server/` (Node standalone adapter), not `dist/`. |
| `shared` | TypeScript modules | Single source of truth for generated Payload types (`shared/types/payload-types.ts`) and core utilities (`shared/src/*`). |
| `e2e` | Playwright | End-to-end tests against production `https://hct.vitrina.promo` (has its own nested `node_modules`). |

`shared` is registered in the root `workspaces` array and added as a `workspace:*` dependency in `admin` and `web`.

### Root scripts (run from repo root with `bun run <script>`)

| Script | What it does |
|--------|--------------|
| `dev` | Runs both `web` and `admin` in parallel. |
| `build` | Builds both `web` and `admin` in parallel. |
| `prod` | Starts the production `web` server and `admin`. |
| `e2e` | Runs the Playwright e2e suite. |
| `e2e:admin` | Runs the admin-specific Playwright e2e suite. |

## Environment variables

Configuration is centralized in a dotenv file at the repo root (`.env`, gitignored;
copy `.env.example` to create it). Consumers load it explicitly:

| Variable | Default | Consumed by |
|----------|---------|-------------|
| `NODE_ENV` | `development` | `admin/src/payload.config.ts` (autoLogin). Next sets its own value on dev/build/start; the `.env` value applies to non-Next runs (payload CLI). |
| `BASE_URL` | `https://hct.vitrina.promo` | The toml-watcher overrides `site.baseUrl` in `config.generated.json` (site, sitemap, OpenGraph, navigation) and `e2e/playwright.config.ts`. |
| `DATABASE_URL` | `file:../db/hct.db` | `admin/src/payload.config.ts` (SQLite). |
| `PAYLOAD_SECRET` | `your-secret-here` | `admin/src/payload.config.ts`. |
| `E2E_BASE_URL` | `http://localhost:4321` | `e2e/playwright.admin.config.ts`. |

Loading happens in three places: `web/scripts/toml-watcher.mjs` reads `.env` via
`dotenv` and regenerates `config.generated.json` (gitignored, regenerated on `web`
dev/build), `admin/src/payload.config.ts` loads it with `dotenv.config`, and the e2e
Playwright configs load it relative to the `e2e` workspace. Use `BASE_URL` for local
dev and the production URL on the server.

## Shared package

`shared` exposes two kinds of modules via subpath exports in `shared/package.json`:

- **Types**: `shared` (the root export) re-exports `shared/types/payload-types.ts`, the generated Payload collection types.
- **Core utilities** (`shared/src/*`, Node- and Bun-compatible `*.mjs` + `*.d.mts`):
  - `shared/fs` — `pathExists`, `ensureDir`, `atomicWrite`
  - `shared/debounce` — debounce used by the TOML watcher
  - `shared/payload` — `getPayloadClient(config)` bootstrap
  - `shared/logger` — logging helper

`web` type imports read from `shared`. Runtime `config` imports stay `from "admin"` (they pull the live Payload config, not just types).

## Adding a Payload collection

1. Create a new file in `admin/src/collections/` (e.g. `Products.ts`), following the pattern of existing collections. Shared field helpers live in `admin/src/collections/common.ts`.
2. Import it in `admin/src/payload.config.ts` and add it to the `collections` array. The `outputFile` there points the generated types into `shared/types/payload-types.ts`.
3. After editing the collection (or any collection), regenerate types and the import map from the `admin` workspace:

   ```sh
   bun run generate:types      # writes shared/types/payload-types.ts
   bun run generate:importmap
   ```

4. Types now propagate automatically to `web` (which imports from `shared`). No manual type editing is needed elsewhere.

## Adding a UI component

The web project auto-imports a fixed set of components into every Astro page, so they can be used in frontmatter/templates without an explicit import.

1. Create the component under `web/src/components/` (or `web/src/shortcodes/` for MDX shortcodes).
2. Add its path as a single entry to `web/src/lib/componentRegistry.ts` (e.g. `"@/components/MyComponent.astro"`).
3. `web/astro.config.mjs` imports `componentRegistry` and passes it to `patchedAutoImport`, so no Astro config edit is required.

## Running scripts

There is no unified CLI (that item is intentionally postponed). Scripts run per workspace via `bun run`:

| Workspace | Script | Purpose |
|-----------|--------|---------|
| `web` | `dev` | Runs the TOML watcher (`scripts/toml-watcher.mjs`) + `astro dev`. |
| `web` | `build` | Regenerates config JSON then `astro build`. |
| `web` | `toml:watch` | Watches `src/config/config.toml`, regenerating `src/config/config.generated.json`. |
| `web` | `astro-check` | Type/lint check via Astro. |
| `web` | `generate-favicons` | Regenerates favicons. |
| `web` | `generate-multilingual-content` / `remove-multilingual` | Multilingual content generation/cleanup. |
| `admin` | `generate:types` / `generate:importmap` | Regenerate Payload types (into `shared`) and the import map. |
| `admin` | `lint` | ESLint. |
| `admin` | `test` | Runs integration (vitest) + e2e (playwright) tests. |

> Note: `web` package.json scripts call `npm run` / `astro` directly, so always invoke them through `bun run <script>` rather than calling `node`/`astro` yourself.

## Tests and CI

- **`admin`**: has a full suite — `bun run test` runs vitest integration tests then Playwright e2e. Also `bun run lint` (ESLint).
- **`web`**: no test runner is wired up (unit tests for utilities are intentionally postponed). Verify with `bun run astro-check` and a production build.
- **`e2e`**: Playwright, run from the root with `bun run e2e` / `bun run e2e:admin`.
- **CI**: no GitHub Actions pipeline is configured yet (postponed). Local verification is `astro-check` + `build` for `web`, and `lint` + `test` for `admin`.

# hct-themed

Marketing site for Hațegan Consulting & Trading. Bun monorepo with three workspaces: `admin`
(Payload CMS 3.85 + Next.js 16), `web` (Astro 6, the deliverable), `e2e` (Playwright).
Use `bun`, never `npm`/`pnpm`/`node`/`vite` (see `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc`).

## Commands
- Root: `bun run dev`, `bun run build`, `bun run e2e`.
- admin (port 3000): `bun run dev`, `bun run lint`. After editing a collection: `bun run generate:types` then `bun run generate:importmap`.
- web: `bun run dev` (runs toml-watcher + astro dev), `bun run build`, `bun run astro-check`, `bun run format`. package.json scripts call `npm run`/`astro` directly, so always invoke via `bun run <script>`.

## Architecture
- `admin`: Payload CMS + SQLite at `../db/payload.db` (src `payload.config.ts`). Dev auto-login `admin@test.com`/`test1234`.
- `web` (Astro): config-driven — `src/config/config.toml` regenerates `src/config/config.generated.json` via the toml-watcher on dev/build; many modules import the generated JSON. Bilingual: `ro` is default, `en` second, configured in `src/config/language.json`.
- Content is stored in `web/src/content/<collection>/{english,romanian}/`.
- `astro.config.mjs` sets `outDir: "server"` for the Node standalone adapter — build output is `server/`, not `dist/`.
- Dynamic pages (`products`, `categories`, `partners`, `customer`, `product`, `vsu`, `solutions`) are `prerender = false` and pull data at runtime via `getPayload` from the `admin` workspace against the same SQLite DB — web needs the admin/db present for these.
- Don't hardcode visible strings or URLs — use `t()` keys (`src/i18n/{en,ro}.json`) and menus (`src/config/menu.{en,ro}.json`).

## Testing / checks
- `admin`: `bun run test` runs vitest then playwright; `bun run lint` (eslint).
- `web`: `bun run test` runs jest (watch), `bun run astro-check`, `cspell`.
- `e2e`: playwright baseURL targets production `https://hct.vitrina.promo`; it has its own nested `e2e/node_modules`.

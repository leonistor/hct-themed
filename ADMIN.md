# ADMIN

Administrative pages served by `web` (Astro), as opposed to the Payload CMS admin UI running in
the `admin` workspace on port 3000. These live under `web/src/pages/` and are standalone pages
that do not use the public `Base.astro` layout.

## Admin products list

Route: `/admin` (`web/src/pages/admin/index.astro`), served on port 4321.

A read-only catalogue table of the `products` collection from Payload. It is the current
reference implementation for admin pages in this repo.

### Files

| Path | Role |
|---|---|
| `web/src/pages/admin/index.astro` | Page shell: title, per-page `<Select>` (10/50/all), renders the table. `prerender = false`. |
| `web/src/layouts/components/admin/AdminProductsTable.astro` | Fetches products via `getPayload` against `admin` (same connection as the public dynamic routes; needs `admin` + `db/payload.db` running). |
| `web/src/styles/admin.css` | Standalone stylesheet: imports Tailwind + Bearnie tokens only for this page. |
| `web/src/layouts/components/bearnie/{table,select,checkbox,pagination}/` | Bearnie UI components installed for the admin UI. |

### Behavior

- Query params: `?page=N` (1-based, default 1) and `?limit=10|50|all` (default 10).
- `limit=all` requests `limit: 0` with `pagination: false`; the pager and page count are hidden.
- Table columns: image thumbnail (via `PayloadImage`, `main_image.sizes.thumbnail`), code (links
  to the public `/product/{code}` page), published (`<Checkbox disabled checked>`), name,
  variants count, partner name, category name, materials (joined names).
- Query uses `depth: 1` so partner/category/materials resolve inline, `sort: "_order"`, and
  excludes the heavy `folder`/`images` fields via `select`.
- Pagination links are generated with `makeUrl()` which mutates the current `URLSearchParams`.
- The per-page `<Select>` navigates on change and resets `page`.

### Theming

The admin page is standalone and does not use `Base.astro`, so it imports Tailwind and the
Bearnie stylesheet directly via `web/src/styles/admin.css`. Bearnie maps its design tokens to
Tailwind colors (`--color-primary` etc.) inside its own `@theme` block, so only the admin
page's CSS includes Bearnie colors. Public pages build with the existing global stylesheet and
keep their brand colors (e.g. `--color-primary: #216869`) unchanged.

`astro.config.mjs` maps `@/components/*` to `src/layouts/components/*`, so admin imports use
`@/components/bearnie/...` exactly like the public sections.

### Usage constraints

- `prerender` must stay `false` (runtime Payload fetch).
- All visible strings are hardcoded English for now (admin-only, `noindex`), not routed through
  `t()`.
- When adding Bearnie components via the Bearnie MCP, they land in `src/components/bearnie/` by
  default; move them to `src/layouts/components/bearnie/` so the `@/components` alias resolves
  and fix icon import paths. The generated `barrel` may reference uninstalled components —
  delete it unless every named component is installed.
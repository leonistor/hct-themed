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
| `web/src/pages/admin/index.astro` | Page shell: fixed left sidebar, sticky header with a sidebar toggle and theme toggle, per-page `<Select>` (10/50/all), fetches filter option lists (partners/categories/materials) and passes them to the table. `prerender = false`. |
| `web/src/layouts/components/admin/AdminSidebar.astro` | Nav rail: Bearnie `Sidebar` (id `admin-sidebar`) with HCT logo, separator and menu (Products/Categories/Partners/Materials). Products is active on `/admin`; link `href`s for the other sections are `#` placeholders. `currentPath` prop drives the active item. |
| `web/src/layouts/components/admin/AdminProductsTable.astro` | Fetches products via `getPayload` against `admin` (same connection as the public static routes; needs `admin` + `db/payload.db` running). Renders the filter bar and product table. Accepts `partners`, `categories`, `materials` props for filter dropdowns. |
| `web/src/styles/admin.css` | Standalone stylesheet: Tailwind + Bearnie tokens only for this page. |
| `web/src/layouts/components/bearnie/{sidebar,table,select,checkbox,pagination}/` | Bearnie UI components installed for the admin UI. |

### Layout

- Two-column flex: the `AdminSidebar` (`h-screen`) on the left, a `flex-1` column on the right.
- The header is sticky (`z-30`) and holds the `SidebarTrigger` (`for="admin-sidebar"`, matching the
  sidebar id) plus the page title; the sidebar handles collapse and mobile behavior in its own
  script.
- The per-page `<Select>` script is plain, per-page JS living in `index.astro` (not in a shared
  `<script>` chunk), since the page is standalone.

### Behavior

- Query params: `?page=N` (1-based, default 1) and `?limit=10|50|all` (default 10).
- Filter params: `?search=<text>`, `?partner=<id>`, `?category=<id>`, `?material=<id>`,
  `?published=true|false`. Filters are combined with Payload's `AND` operator.
- The filter bar renders a search input, three `<Select>` dropdowns (partner, category, material),
  a published `<Select>` (Any/Yes/No), an Apply button, and a Clear link (shown when any filter
  is active). A hidden `limit` field preserves the current page size across filter submissions.
- `limit=all` requests `limit: 0` with `pagination: false`; the pager and page count are hidden.
- Table columns: image thumbnail (via `PayloadImage`, `main_image.sizes.thumbnail`), code (links
  to the public `/product/{code}` page), published (`<Checkbox disabled checked>`), name,
  variants count, partner name, category name, materials (joined names).
- Query uses `depth: 1` so partner/category/materials resolve inline, `sort: "_order"`, and
  excludes the heavy `folder`/`images` fields via `select`.
- Pagination links are generated with `makeUrl()` which preserves existing filter params from the
  current URL and only overrides `page`.
- The per-page `<Select>` navigates on change and resets `page`.
- `index.astro` fetches all partners, categories, and materials via `payload.find()` with
  `limit: 0` and `sort: "name"` to populate the filter dropdowns.

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
# ADMIN

Administrative pages served by `web` (Astro), as opposed to the Payload CMS admin UI running in
the `admin` workspace on port 3000. These live under `web/src/pages/` and are standalone pages
that do not use the public `Base.astro` layout.

## Admin products list

Route: `/admin` (`web/src/pages/admin/index.astro`), served on port 4321.

A read-only catalogue table of the `products` collection from Payload, with inline editing via a
slide-out sheet. It is the current reference implementation for admin pages in this repo.

### Files

| Path | Role |
|---|---|
| `web/src/pages/admin/index.astro` | Page shell: fixed left sidebar, sticky header with a sidebar toggle and theme toggle, fetches filter option lists (partners/categories/materials) and passes them to the table. `prerender = false`. |
| `web/src/layouts/components/admin/AdminSidebar.astro` | Nav rail: Bearnie `Sidebar` (id `admin-sidebar`) with HCT logo, separator and menu (Products/Categories/Partners/Materials). Products is active on `/admin`; link `href`s for the other sections are `#` placeholders. `currentPath` prop drives the active item. |
| `web/src/layouts/components/admin/AdminProductsTable.astro` | Fetches products via `getPayload` against `admin` (same connection as the public static routes; needs `admin` + `db/payload.db` running). Renders the filter panel (card with distinct background) containing the filter form, product count, and per-page select, then the sortable product table and bottom-right pagination. Includes a Bearnie Sheet for editing products (2/3 width, right side). The sheet form is always rendered in the DOM (empty by default); the client script populates it via the API on row click. Accepts `partners`, `categories`, `materials` props for filter dropdowns. |
| `web/src/pages/api/products/[id].ts` | GET endpoint returning a product as JSON (excludes `folder`/`images` fields). PUT endpoint for updating a product. Uses Payload local API to update code, name, description, published, promoted, category, and materials fields. Both use `depth: 2`. Returns updated doc as JSON. |
| `web/src/styles/admin.css` | Standalone stylesheet: Tailwind + Bearnie tokens only for this page. |
| `web/src/layouts/components/bearnie/{sidebar,table,select,checkbox,pagination,sheet,input,textarea,button,label}/` | Bearnie UI components installed for the admin UI. |
| `web/src/layouts/components/bearnie/lib/hugeicons.ts` | Barrel re-export of Hugeicons free (stroke-rounded) icon data with official Hugeicons names (same identifiers as `@hugeicons/core-free-icons` / hugeicons.com), for use with `HugeIcon.astro`. Import icons from here (e.g. `import { ArrowUpRight01Icon } from "@/components/bearnie/lib/hugeicons"`), never from `@hugeicons/core-free-icons` directly. |

### Layout

- Two-column flex: the `AdminSidebar` (`h-screen`) on the left, a `flex-1` column on the right.
- The header is sticky (`z-30`) and holds the `SidebarTrigger` (`for="admin-sidebar"`, matching the
  sidebar id) plus the page title and theme toggle; the sidebar handles collapse and mobile
  behavior in its own script.
- The filter panel is a `bg-muted/50 rounded-lg border p-4` card containing the filter form,
  a product count label, and a per-page `<select>` (10/50/all). The panel visually groups all
  controls above the table.
- Pagination sits at the bottom right of the page, below the table.

### Behavior

- Query params: `?page=N` (1-based, default 1), `?limit=10|50|all` (default 10), and
  `?sort=field|dir` (default no sort, Payload `_order`).
- Filter params: `?search=<text>`, `?partner=<id>`, `?category=<id>`, `?material=<id>`,
  `?published=true|false`. Filters are combined with Payload's `AND` operator.
- The filter bar renders a search input, three `<Select>` dropdowns (partner, category, material),
  a published `<Select>` (Any/Yes/No), an Apply button, and a Clear link (shown when any filter
  is active). A hidden `limit` field preserves the current page size across filter submissions.
- `limit=all` requests `limit: 0` with `pagination: false`; the pager and page count are hidden.
- Table columns: image (`PayloadImage`, `main_image.sizes.medium`, 300×300), code (plain
  text), published (`CheckmarkCircle01Icon` header, `<Checkbox disabled checked>` cell), name,
  variants count (`Layers01Icon` header), partner name, category name, materials (joined names).
  Column widths are explicit via `style` (12.5%, 8.33%, 4.17%, 20.83%, 4.17%, 8.33%, 20.83%,
  20.83%; sum 100%). Long text is not truncated.
- Query uses `depth: 1` so partner/category/materials resolve inline, and excludes the heavy
  `folder`/`images` fields via `select`. Sort defaults to `_order` when no `sort` param is present.
- Sortable columns: Code, Published, Name, Partner, Category (Materials not sortable — array
  relationship). `sort` param format: `field|asc` or `field|desc`. Clicking a header toggles
  asc → desc → unsorted (param removed). Hugeicons `ArrowUpDown`/`ArrowUp02`/`ArrowDown02`
  icons on each header (dimmed when unsorted, highlighted when active). Partner and Category
  sort by their related `name` field via Payload dot notation (`partner.name`, `category.name`).
- Pagination links are generated with `makeUrl()` which preserves existing filter and sort params
  from the current URL and only overrides `page`.
- The per-page `<select>` (native HTML, `data-per-page`) lives inside the filter panel in
  `AdminProductsTable` and navigates on change, resetting `page`. Its script is a small inline
  `<script>` at the bottom of the component.
- `index.astro` fetches all partners, categories, and materials via `payload.find()` with
  `limit: 0` and `sort: "name"` to populate the filter dropdowns.
- Edit sheet: the sheet form (2/3 width, right side) edits code, name, description, published,
  promoted (Checkbox), category (single select), and materials (checkbox list). The sheet title
  shows the product name (falls back to "Edit Product" when no product is loaded); it is set
  server-side on `?edit` loads and updated client-side in `populateForm`. The form is grouped: a
  `bg-muted/50` panel card at the top holds code, name, main image, description, published,
  promoted, and url; a Bearnie `Accordion` (single-open) below groups the rest into "Category &
  Materials", "Variants", and "Other images" (empty placeholder for now). Read-only sections show
  url, variants (name, feature, description, url), and main image. Product and variant URLs render
  as external link icons only (Hugeicons `ArrowUpRight01Icon` in an `<a>` with `target="_blank"`,
  `rel="noopener"` and a `title` holding the URL); the client reuses a
  `<template id="sheet-link-icon">`, so the icon markup lives in one place. Accordion triggers use a
  compact `PlusSignIcon` via the `icon`/`iconSize` props on `AccordionTrigger` (defaults unchanged
  for the public VSU accordions). The main image uses the
  API returned `main_image.sizes.medium.url` (resolved via
  `/api/product-images/file/…`, the admin media proxy) rather than the `/payload/products/…` path
  that only resolves through the server-rendered `PayloadImage` component. The sheet form is always
  rendered in the DOM; on initial page load with `?edit`, fields are populated server-side. On row
  click, the URL is
  updated via `history.pushState`, product data is fetched from `GET /api/products/<id>`, the
  form is populated, and the sheet opens client-side. No full page reload, so scroll position is
  preserved. The active row gets `bg-accent` highlighting; all rows have `hover:bg-muted/50`.
  Save calls `PUT /api/products/<id>`, updates the row cells in-place, and closes the sheet.
  Cancel/close removes the `?edit` param via `history.replaceState` and closes the sheet.
  Browser back/forward is handled via `popstate` (opens sheet if `?edit` present, closes if
  not). The PUT endpoint uses Payload local API to update the product and returns the updated
  doc as JSON. The sheet content is a flex column and the form scrolls (`overflow-y-auto`), so
  the footer buttons stay reachable with long product data.

### Theming

The admin page is standalone and does not use `Base.astro`, so it imports Tailwind and the
Bearnie stylesheet directly via `web/src/styles/admin.css`. Bearnie maps its design tokens to
Tailwind colors (`--color-primary` etc.) inside its own `@theme` block, so only the admin
page's CSS includes Bearnie colors. Public pages build with the existing global stylesheet and
keep their brand colors (e.g. `--color-primary: #216869`) unchanged.

`astro.config.mjs` maps `@/components/*` to `src/layouts/components/*`, so admin imports use
`@/components/bearnie/...` exactly like the public sections.

### Icons

Admin components render icons via the Bearnie `HugeIcon.astro` component. The icon data (Svelte
components from `@hugeicons/core-free-icons`) is re-exported from the barrel
`web/src/layouts/components/bearnie/lib/hugeicons.ts`, which maps each official Hugeicons name
(e.g. `ArrowUpRight01Icon`, `PlusSignIcon`, `Layers01Icon`) to an `HugeIcon`-compatible prop.
Always import icons from this barrel, never directly from `@hugeicons/core-free-icons`. To add a
new icon, append its `export { default as <Name>Icon } from "@hugeicons/core-free-icons/<Name>Icon"`
line to the barrel. Size and color come from the `class` prop on `HugeIcon` (e.g. `size-4`,
`text-primary`).

### Usage constraints

- `prerender` must stay `false` (runtime Payload fetch).
- All visible strings are hardcoded English for now (admin-only, `noindex`), not routed through
  `t()`.
- When adding Bearnie components via the Bearnie MCP, they land in `src/components/bearnie/` by
  default; move them to `src/layouts/components/bearnie/` so the `@/components` alias resolves
  and fix icon import paths. The generated `barrel` may reference uninstalled components —
  delete it unless every named component is installed.
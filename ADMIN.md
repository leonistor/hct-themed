# ADMIN

Administrative pages served by `web` (Astro), separate from Payload's admin UI. These standalone
pages live under `web/src/pages/admin/` and do not use `Base.astro`.

## Authentication

Admin pages and the products API use cookie-based sessions against Payload's `users` collection.
Login is handled by `web/src/pages/api/users/login.ts`, logout by
`web/src/pages/api/users/logout.ts`, and the current user by `web/src/pages/api/users/me.ts`.
`web/src/utils/adminAuth.ts` contains the shared Payload authentication helpers.

`admin/index.astro` redirects unauthenticated users to `/admin/login`. The products API returns 401
without a valid session. Logout is available in the Basecoat sidebar footer.

## Products List

Route: `/admin`, served on port 4321. The page is a read-only product catalogue with inline editing
through a Basecoat drawer dialog.

### Files

| Path | Role |
|---|---|
| `web/src/pages/admin/index.astro` | Authenticated page shell, Basecoat sidebar toggle, theme toggle, and Payload filter options. `prerender = false`. |
| `web/src/pages/admin/login.astro` | Standalone Basecoat-styled login form. |
| `web/src/layouts/components/admin/AdminSidebar.astro` | Native Basecoat sidebar with HCT branding, navigation, active route, account email, and logout. |
| `web/src/layouts/components/admin/AdminProductsTable.astro` | Payload query orchestration, URL filters/sorting/pagination, and the client-side drawer controller. |
| `web/src/layouts/components/admin/AdminProductsFilters.astro` | Filter form, native Basecoat selects, product count, and page-size control. |
| `web/src/layouts/components/admin/AdminProductsGrid.astro` | Basecoat-styled semantic product table. |
| `web/src/layouts/components/admin/AdminProductsPagination.astro` | Semantic pagination links using Basecoat button styles. |
| `web/src/layouts/components/admin/AdminProductSheet.astro` | Basecoat native `<dialog class="drawer">` for editing products. |
| `web/src/pages/api/products/[id].ts` | Authenticated product GET and PUT endpoints. |
| `web/src/styles/admin.css` | Standalone entry that imports the shared Tailwind/Basecoat stylesheet. |
| `web/src/layouts/components/ui/basecoat/` | Basecoat wrappers, icon renderer, and Hugeicons barrel. |

### Behavior

- Query parameters are `page`, `limit`, `sort`, `search`, `partner`, `category`, `material`, and `published`.
- Filters are submitted as a GET form and preserve the current page size and sort order.
- `limit=all` disables pagination and requests all products.
- The table supports sorting by published state, name, partner, and category.
- Clicking a row updates the URL with `?edit=<id>`, fetches the product, populates the form, and opens the drawer without reloading.
- Save calls `PUT /api/products/<id>`, updates the row in place, and closes the drawer.
- Cancel, Escape, backdrop click, browser navigation, and direct `?edit` loads are supported.
- Form IDs, names, and `data-*` selectors are stable because the client controller uses them directly.

## Theming And Runtime

Standalone admin pages import `web/src/styles/admin.css`, which uses the same Tailwind and Basecoat
entry as the public site. Basecoat runtime modules are initialized for standalone pages and the
public layout, including sidebar, drawer, accordion, select, dropdown, and tabs.

Icons are rendered with `web/src/layouts/components/ui/basecoat/Icon.astro`. Icon data is imported
from `web/src/layouts/components/ui/basecoat/hugeicons.ts`, never directly from the Hugeicons package.

## VSU Accordion

The VSU page uses Basecoat native accordion markup: `.accordion`, `<details>`, `<summary>`, and a
nested content `<section>`. The root uses `data-multiple` so multiple stages can be open.

## Constraints

- `prerender` must remain `false` for runtime Payload fetches.
- The admin UI currently uses hardcoded English strings.
- Use Basecoat's documented native HTML structures and preserve client-facing form selectors when
  changing dynamic admin markup.

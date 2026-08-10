# e2e

End-to-end tests for the HCT marketing site, running against the production
deployment `https://hct.vitrina.promo`. Playwright with a single headless
Chromium project for speed.

## Run

From the repo root:

```sh
bun run e2e
```

From this directory:

```sh
bunx --bun playwright test
```

## Screenshots

`scripts/screenshot.js` boots the web dev server (port 4321), then captures
full-page screenshots of the homepage in headless Chromium after a slow scroll
to the bottom, in both light and dark mode.

```sh
bun run screenshot
```

Outputs `home-{light,dark}-{YYYY-MM-DD-HH-MM}.png` to `e2e/test-results/`. The
script kills whatever is on port 4321 on exit, so don't run it while a dev
server is already up.

## Test files

- `tests/homepage-links.spec.ts`: loads the homepage, collects all internal
  links from the rendered DOM (`utils/menuLinks.ts`), then checks each via
  `page.request.get` without rendering each page, keeping the suite fast.
- `tests/admin-login.spec.ts`: signs in to the Astro admin
  (`web/src/pages/admin/`) at `http://localhost:4321` with the `test@test.com`
  test user and asserts the products page renders. Run via the dedicated admin
  config:

  ```sh
  bun run e2e:admin
  ```

  The config boots (or reuses) the local dev servers with `bun run dev`, so the
  `db/payload.db` must be present.

## Console error coverage

`fixtures.ts` attaches console and page error listeners to every page and
fails any test that observes an error. Every navigation in this suite
therefore also asserts there are no JavaScript console or page errors.

## Notes

- Only the default locale (`ro`) is tested.
- Local runs use multiple workers (`workers` is only capped on CI); the
  Chromium project is headless by default.

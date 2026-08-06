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

## Test files

- `tests/homepage-links.spec.ts`: loads the homepage, collects all internal
  links from the rendered DOM (`utils/menuLinks.ts`), then checks each via
  `page.request.get` without rendering each page, keeping the suite fast.

## Console error coverage

`fixtures.ts` attaches console and page error listeners to every page and
fails any test that observes an error. Every navigation in this suite
therefore also asserts there are no JavaScript console or page errors.

## Notes

- Only the default locale (`ro`) is tested.
- Local runs use multiple workers (`workers` is only capped on CI); the
  Chromium project is headless by default.

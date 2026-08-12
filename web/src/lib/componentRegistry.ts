/**
 * Central registry of components that are auto-imported into every Astro page,
 * so they can be used in frontmatter/templates without an explicit import.
 *
 * Adding a new UI component to the auto-import set is a one-line change here;
 * `astro.config.mjs` reads this list and feeds it to `patchedAutoImport`, so the
 * Astro config no longer needs editing when the set of auto-imported components
 * changes.
 */
export const componentRegistry: string[] = [
  "@/components/Button.astro",
  "@/shortcodes/Accordion.astro",
  "@/shortcodes/Notice.astro",
  "@/shortcodes/Tabs.astro",
  "@/shortcodes/Tab.astro",
  "@/shortcodes/Testimonial.astro",
  "@/shortcodes/ListCheck.astro",
  "@/shortcodes/VideoInline.astro",
  "@/shortcodes/CardWrapper.astro",
  "@/shortcodes/Card.astro",
  "@/shortcodes/BlockQuoteCard.astro",
];

import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import rehypeExternalLinks from "rehype-external-links";
import remarkParseContent from "./src/lib/utils/remarkParseContent.ts";
import config from "./.astro/config.generated.json";
import fontsJson from "./src/config/fonts.json";
import { generateAstroFontsConfig } from "./src/lib/utils/AstroFont.ts";
import { enabledLanguages } from "./src/lib/utils/i18nUtils.ts";

import node from "@astrojs/node";
import astroInspectClip from "astro-inspect-clip";

const fonts = generateAstroFontsConfig(fontsJson);
let {
  seo: { sitemap: sitemapConfig },
  settings: {
    multilingual: { showDefaultLangInUrl, defaultLanguage },
  },
} = config;

// https://astro.build/config
export default defineConfig({
  site: config.site.baseUrl ? config.site.baseUrl : "http://examplesite.com",
  trailingSlash: config.site.trailingSlash ? "always" : "never",
  image: {
    layout: "constrained",
    domains: ["localhost"],
    remotePatterns: [{ port: "4321" }, { port: "3000" }],
  },
  server: { allowedHosts: true },
  devToolbar: {
    enabled: true,
    placement: "bottom-right",
  },
  outDir: "server",
  adapter: node({
    mode: "standalone",
  }),
  fonts,
  i18n: {
    locales: enabledLanguages,
    defaultLocale: defaultLanguage,
    routing: {
      prefixDefaultLocale: showDefaultLangInUrl,
    },
  },
  integrations: [
    sitemapConfig.enable ? sitemap() : null,
    AutoImport({
      imports: [
        "@/components/Button.astro",
        "@/shortcodes/Accordion.astro",
        "@/shortcodes/Notice.astro",
        "@/shortcodes/Tabs.astro",
        "@/shortcodes/Tab.astro",
        "@/shortcodes/Testimonial.astro",
        "@/shortcodes/ListCheck.astro",
        "@/shortcodes/ImageList.astro",
        "@/shortcodes/ImageItem.astro",
        "@/shortcodes/VideoInline.astro",
        "@/shortcodes/CardWrapper.astro",
        "@/shortcodes/Card.astro",
        "@/shortcodes/BlockQuoteCard.astro",
      ],
    }),
    mdx(),
    astroInspectClip(),
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          rel: "noopener noreferrer nofollow",
          target: "_blank",
        },
      ],
    ],
    remarkPlugins: [
      remarkParseContent, // Parse markdown content and add classes in heading and loading="lazy" to images
      remarkToc,
    ],

    // Code Highlighter https://github.com/shikijs/shiki
    shikiConfig: {
      theme: "light-plus", // https://shiki.style/themes
      wrap: false,
    },
    extendDefaultPlugins: true,
  },
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["astro-leaflet > leaflet"],
      // exclude: ["astro/runtime/client/dev-toolbar/entrypoint.js"],
    },
  },
});

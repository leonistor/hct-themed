import mdx from "@astrojs/mdx";
import remarkToc from "remark-toc";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import AutoImport from "astro-auto-import";
import { defineConfig } from "astro/config";
import fontsJson from "./src/config/fonts.json";
import rehypeExternalLinks from "rehype-external-links";
import { enabledLanguages } from "./src/lib/utils/i18nUtils.ts";
import remarkParseContent from "./src/lib/utils/remarkParseContent.ts";
import { generateAstroFontsConfig } from "./src/lib/utils/AstroFont.ts";
import config from "./.astro/config.generated.json" with { type: "json" };
import bun from "@wyattjoh/astro-bun-adapter";

const fonts = generateAstroFontsConfig(fontsJson);

let {
  seo: { sitemap: sitemapConfig },
  settings: {
    multilingual: { defaultLanguage, showDefaultLangInUrl },
  },
} = config;

// https://astro.build/config
export default defineConfig({
  site: config.site.baseUrl ? config.site.baseUrl : "http://examplesite.com",
  trailingSlash: config.site.trailingSlash ? "always" : "never",
  fonts,
  devToolbar: { enabled: false },
  adapter: bun(),
  server: { host: "0.0.0.0" },
  output: "static",
  security: { checkOrigin: false },
  image: {
    domains: ["localhost"],
  },
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
        "@/components/CustomButton.astro",
        "@/shortcodes/Accordion.astro",
        "@/shortcodes/Notice.astro",
        "@/shortcodes/Tabs.astro",
        "@/shortcodes/Tab.astro",
        "@/shortcodes/Testimonial.astro",
        "@/shortcodes/ListCheck.astro",
        "@/shortcodes/StatsWrapper.astro",
        "@/shortcodes/ImageList.astro",
        "@/shortcodes/ImageItem.astro",
        "@/shortcodes/StatsItem.astro",
        "@/shortcodes/VideoInline.astro",
      ],
    }),
    mdx(),
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
    clearScreen: false,
    build: {
      chunkSizeWarningLimit: 700,
    },
    // server: {
    //   watch: {
    //     ignored: ["pocket/**", "*.txt", "TODO.md", "import_data/*"],
    //   },
    //   proxy: {
    //     "/pocket": {
    //       target: "http://localhost:8090",
    //       changeOrigin: true,
    //       rewrite: (path) => path.replace(/^\/pocket/, ""),
    //     },
    //   },
    // },
  },
});

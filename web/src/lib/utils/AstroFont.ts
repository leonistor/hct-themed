import { fontProviders } from "astro/config";

type FontVariant = {
  weight?: number | string;
  style?: string;
  src?: string[] | string;
  [key: string]: unknown;
};

type FontConfigInput = {
  name: string;
  provider?: string;
  cssVariable: string;
  fallbacks?: string[];
  fallback?: string;
  weights?: Array<number | string>;
  styles?: string[];
  subsets?: string[];
  formats?: string[];
  display?: string;
  optimizedFallbacks?: boolean;
  unicodeRange?: string[];
  options?: Record<string, unknown>;
  variants?: FontVariant[];
};

const normalizeArray = <T>(values: T[] | undefined) =>
  values ? [...new Set(values.filter(Boolean))] : [];

const getWeights = (font: FontConfigInput) =>
  normalizeArray(
    font.weights ??
      font.variants?.map((variant) => variant.weight).filter(Boolean),
  );

const getStyles = (font: FontConfigInput) =>
  normalizeArray(
    font.styles ??
      font.variants?.map((variant) => variant.style).filter(Boolean),
  );

const normalizeCssVariable = (cssVariable: string) =>
  cssVariable.startsWith("--") ? cssVariable : `--${cssVariable}`;

const resolveProvider = (provider?: string) => {
  switch ((provider || "google").toLowerCase()) {
    case "google":
    case "google-fonts":
      return fontProviders.google();
    case "google-icons":
    case "googleicons":
      return fontProviders.googleIcons?.() ?? fontProviders.google();
    case "bunny":
      return fontProviders.bunny();
    case "fontshare":
      return fontProviders.fontshare();
    case "fontsource":
    case "npm":
      return fontProviders.npm();
    case "local":
      return fontProviders.local();
    default:
      return fontProviders.google();
  }
};

/**
 * Generates Astro-compatible font configuration from custom font JSON
 * @param {Array} fontsJson - Array of font objects from fonts.json
 * @returns {Array} Astro-compatible font configuration array
 */
export function generateAstroFontsConfig(fontsJson: FontConfigInput[]): any[] {
  return fontsJson.map((font) => {
    const provider = resolveProvider(font.provider);
    const cssVariable = normalizeCssVariable(font.cssVariable);
    const fallbacks = font.fallbacks?.length
      ? font.fallbacks
      : [font.fallback || "sans-serif"];

    const astroFont: Record<string, unknown> = {
      provider,
      name: font.name,
      cssVariable,
      fallbacks,
    };

    if (font.display) astroFont.display = font.display;
    if (font.optimizedFallbacks !== undefined) {
      astroFont.optimizedFallbacks = font.optimizedFallbacks;
    }
    if (font.subsets?.length) astroFont.subsets = font.subsets;
    if (font.formats?.length) astroFont.formats = font.formats;
    if (font.unicodeRange?.length) astroFont.unicodeRange = font.unicodeRange;

    const isLocal = (font.provider || "").toLowerCase() === "local";
    if (!isLocal) {
      const weights = getWeights(font);
      const styles = getStyles(font);
      if (weights.length) astroFont.weights = weights;
      if (styles.length) astroFont.styles = styles;
    } else {
      const variants = font.options?.variants ?? font.variants;
      if (variants && Array.isArray(variants)) {
        astroFont.options = {
          ...(font.options || {}),
          variants,
        };
      }
    }

    if (!isLocal && font.options && Object.keys(font.options).length > 0) {
      astroFont.options = font.options;
    }

    return astroFont;
  });
}

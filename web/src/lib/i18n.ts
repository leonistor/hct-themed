import config from "../config/config.generated.json";
import languagesJSON from "../config/language.json";
import {
  useTranslations,
  getLocaleUrlCTM,
  getEntrySlugCTM,
  supportedLanguages,
  generatePaths,
  getEnabledLocales,
} from "./utils/i18nUtils";

export {
  useTranslations,
  getLocaleUrlCTM,
  getEntrySlugCTM,
  supportedLanguages,
  generatePaths,
  getEnabledLocales,
};

const { defaultLanguage, showDefaultLangInUrl } = config.settings.multilingual;

// The default locale code (e.g. "ro"). This is the single source of truth for
// the fallback locale across the app.
export const defaultLocale: string = defaultLanguage;

// All enabled locale codes, derived from language.json filtered by the
// multilingual config. Adding a language means editing language.json + the
// per-locale JSON files, no page code changes required.
export const supportedLocales: string[] = getEnabledLocales();

/**
 * Extracts the locale code from a URL path.
 * Returns the default locale when no enabled code is present in the path
 * (e.g. prefixDefaultLocale is false and the path is unprefixed).
 */
export function localeFromPath(path: string): string {
  const segments = path.split("/").filter(Boolean);
  const code = segments.find((seg) => supportedLocales.includes(seg));
  return code ?? defaultLocale;
}

/**
 * Builds a localized URL for a base path and a target locale.
 * Thin wrapper over getLocaleUrlCTM so callers get the cleaner (base, locale)
 * signature and centralised routing rules.
 */
export function localizedPath(base: string, locale: string): string {
  return getLocaleUrlCTM(base, locale);
}

/**
 * Computes the `lang` route param for getStaticPaths.
 * Mirrors Astro's i18n routing: the default locale is omitted from the URL
 * when prefixDefaultLocale is disabled.
 */
export function langParam(locale: string): string | undefined {
  return locale === defaultLocale && !showDefaultLangInUrl ? undefined : locale;
}

/**
 * Resolves a human-readable language name for a locale code,
 * reading from language.json.
 */
export function getLanguageName(locale: string): string {
  const found = languagesJSON.find((lang) => lang.languageCode === locale);
  return found?.languageName ?? locale;
}

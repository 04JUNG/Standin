export type Locale = "ko" | "ja";

export function localeFromPath(path: string): Locale {
  return path === "/ja" || path.startsWith("/ja/") ? "ja" : "ko";
}

export const homePath = (locale: Locale) => locale === "ja" ? "/ja/" : "/";

/** Switch only between the two published home pages. Preserve campaign and section. */
export function languageHref(locale: Locale, search = "", hash = "") {
  return `${homePath(locale)}${search}${hash}`;
}

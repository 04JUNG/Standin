import { useEffect, useState } from "react";
import { useI18n } from "../../i18n/context";
import { languageHref, type Locale } from "../../i18n/locale";

const preferenceKey = "standin.language";

export function LanguageSwitcher() {
  const { locale } = useI18n();
  const [suffix, setSuffix] = useState({ search: "", hash: "" });
  const [suggestJapanese, setSuggestJapanese] = useState(false);
  useEffect(() => {
    const update = () => setSuffix({ search: window.location.search, hash: window.location.hash });
    update();
    window.addEventListener("hashchange", update);
    let saved: string | null = null;
    try { saved = window.localStorage.getItem(preferenceKey); } catch { /* Storage is optional. */ }
    setSuggestJapanese(locale === "ko" && saved !== "ko" &&
      (navigator.languages?.[0] ?? navigator.language).toLowerCase().startsWith("ja"));
    return () => window.removeEventListener("hashchange", update);
  }, [locale]);

  function choose(next: Locale) {
    try { window.localStorage.setItem(preferenceKey, next); } catch { /* Navigation still works. */ }
    setSuggestJapanese(false);
  }

  return <div className="language-control">
    <nav className="language-switcher" aria-label={locale === "ja" ? "表示言語" : "언어 선택"}>
      {(["ko", "ja"] as const).map(language => <a
        key={language} lang={language} hrefLang={language}
        href={languageHref(language, suffix.search, suffix.hash)}
        aria-current={language === locale ? "page" : undefined}
        onClick={() => choose(language)}
      >{language === "ko" ? "한국어" : "日本語"}</a>)}
    </nav>
    {suggestJapanese && <div className="language-suggestion" lang="ja">
      <a href={languageHref("ja", suffix.search, suffix.hash)} onClick={() => choose("ja")}>日本語ページを見る →</a>
      <button type="button" aria-label="言語の案内を閉じる" onClick={() => choose("ko")}>×</button>
    </div>}
  </div>;
}

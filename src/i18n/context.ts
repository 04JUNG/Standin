import { createContext, useContext } from "react";
import type { Locale } from "./locale";
import { japaneseMessages } from "./messages-ja";

export const LocaleContext = createContext<Locale>("ko");
export type Translator = (source: string, ...values: (string | number)[]) => string;

export function translate(locale: Locale, source: string, ...values: (string | number)[]) {
  const message = locale === "ja" ? japaneseMessages[source] ?? source : source;
  return message.replace(/\{(\d+)\}/g, (match, index: string) => String(values[Number(index)] ?? match));
}

const translators: Record<Locale, Translator> = {
  ko: (source, ...values) => translate("ko", source, ...values),
  ja: (source, ...values) => translate("ja", source, ...values),
};

export function useI18n() {
  const locale = useContext(LocaleContext);
  return { locale, t: translators[locale] };
}

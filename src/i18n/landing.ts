import { nav, hero, flow, beta, footer } from "../data/content";
import { faqItems } from "../data/faq";
import { japaneseLanding } from "./landing-ja";
import { useI18n } from "./context";
import type { Locale } from "./locale";

export const koreanLanding = { nav, hero, flow, beta, footer, faqItems };
export type LandingContent = typeof koreanLanding;
export const landingContent = (locale: Locale): LandingContent => locale === "ja" ? japaneseLanding : koreanLanding;
export function useLandingContent() {
  return landingContent(useI18n().locale);
}

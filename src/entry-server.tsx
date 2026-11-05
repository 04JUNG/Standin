import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { GuidePage } from "./pages/GuidePage";
import { guidePath, guides } from "./data/guides";
import { landingContent } from "./i18n/landing";
import { localeFromPath } from "./i18n/locale";
import { translate } from "./i18n/context";
import { site } from "./data/site";
import { LegalPage } from "./pages/LegalPage";
import { legalDocuments, legalPath, operator } from "./data/legal";
import { legalContent } from "./data/legalContent";

const origin = site.origin;
export const publicPaths = ["/", "/ja/", ...guides.map(guidePath)];
export const legalPaths = legalDocuments.map(legalPath);
export const prerenderPaths = [...publicPaths, ...legalPaths];

export function render(path: string) {
  const locale = localeFromPath(path);
  const { beta, footer, hero, faqItems } = landingContent(locale);
  const modifiedAt = locale === "ja" ? "2026-11-05" : site.modifiedAt;
  const guide = guides.find((item) => guidePath(item) === path);
  const legal = legalDocuments.find((item) => legalPath(item) === path);
  if (path !== "/" && path !== "/ja/" && !guide && !legal) throw new Error(`Unknown public page: ${path}`);
  const url = `${origin}${path}`;
  const organization = {
    "@type": "Organization", "@id": `${origin}/#organization`, name: translate(locale, site.team), alternateName: site.name, url: `${origin}/`,
    description: footer.tagline,
    sameAs: [operator.xUrl],
    logo: `${origin}/favicon.svg`,
    email: site.supportEmail,
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.supportEmail, availableLanguage: "ko" },
  };
  const website = { "@type": "WebSite", "@id": `${origin}/#website`, name: "Standin", url: `${origin}/`, inLanguage: ["ko", "ja"], publisher: { "@id": organization["@id"] } };
  const graph: Record<string, unknown>[] = guide ? [organization, website, {
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.modifiedAt,
    ...(guide.references ? { citation: guide.references.map((reference) => reference.url) } : {}),
    inLanguage: "ko",
    image: `${origin}${guide.video.poster}`,
    author: { "@id": organization["@id"] },
    publisher: { "@id": organization["@id"] },
    mainEntityOfPage: url,
    isPartOf: { "@id": website["@id"] },
  }, {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "홈", item: `${origin}/` },
      { "@type": "ListItem", position: 2, name: guide.title, item: url },
    ],
  }] : [organization, website, {
    "@type": "WebPage", "@id": `${url}#page`, url,
    name: legal ? legal.label : hero.title,
    description: legal ? legal.description : footer.tagline,
    inLanguage: locale, isPartOf: { "@id": website["@id"] },
    ...(!legal ? {
      dateModified: modifiedAt,
      author: { "@id": organization["@id"] },
      mainEntity: { "@id": `${origin}/#application` },
      hasPart: { "@id": `${url}#faq` },
    } : {}),
  }];

  if (path === "/" || path === "/ja/") {
    graph.push({
      "@type": "SoftwareApplication", "@id": `${origin}/#application`,
      name: site.name, url, description: footer.tagline,
      applicationCategory: "MultimediaApplication",
      operatingSystem: ["Windows", "macOS"],
      featureList: beta.updates.filter((update) => !update.upcoming).map((update) => update.title),
      installUrl: `${url}#beta`,
      softwareHelp: guides.map((item) => ({ "@type": "WebPage", url: `${origin}${guidePath(item)}`, name: item.title })),
      provider: { "@id": organization["@id"] },
      mainEntityOfPage: { "@id": `${url}#page` },
      inLanguage: "ko",
    }, {
      "@type": "FAQPage", "@id": `${url}#faq`, url: `${url}#faq`,
      name: locale === "ja" ? "Standin よくある質問" : "Standin 자주 묻는 질문", inLanguage: locale,
      isPartOf: { "@id": `${url}#page` }, dateModified: modifiedAt,
      mainEntity: faqItems.map((item) => ({
        "@type": "Question", "@id": `${url}#faq-${item.id}`,
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: item.answer },
      })),
    });
  }

  return {
    title: legal ? `${legal.label} | Standin` : guide ? `${guide.title} | Standin` : hero.title,
    description: legal ? legal.description : guide ? guide.description : footer.tagline,
    html: renderToString(<StrictMode>{legal ? <LegalPage document={legal} /> : guide ? <GuidePage guide={guide} /> : <App locale={locale} />}</StrictMode>),
    legalText: legal ? legalContent[legal.slug] : undefined,
    structuredData: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
  };
}

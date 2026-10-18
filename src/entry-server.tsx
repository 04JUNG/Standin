import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { GuidePage } from "./pages/GuidePage";
import { guidePath, guides } from "./data/guides";
import { footer, hero } from "./data/content";
import { site } from "./data/site";

const origin = site.origin;
export const publicPaths = ["/", ...guides.map(guidePath)];

export function render(path: string) {
  const guide = guides.find((item) => guidePath(item) === path);
  if (path !== "/" && !guide) throw new Error(`Unknown public page: ${path}`);
  const url = `${origin}${path}`;
  const organization = {
    "@type": "Organization", "@id": `${origin}/#organization`, name: site.team, alternateName: site.name, url: `${origin}/`,
    description: footer.tagline,
    contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: site.supportEmail, availableLanguage: "ko" },
  };
  const website = { "@type": "WebSite", "@id": `${origin}/#website`, name: "Standin", url: `${origin}/`, inLanguage: "ko", publisher: { "@id": organization["@id"] } };
  const graph = guide ? [organization, website, {
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
    name: hero.title,
    description: footer.tagline,
    inLanguage: "ko", isPartOf: { "@id": website["@id"] },
  }];

  return {
    title: guide ? `${guide.title} | Standin` : hero.title,
    description: guide ? guide.description : footer.tagline,
    html: renderToString(<StrictMode>{guide ? <GuidePage guide={guide} /> : <App />}</StrictMode>),
    structuredData: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
  };
}

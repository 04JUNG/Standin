import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { App } from "./App";
import { GuidePage } from "./pages/GuidePage";
import { guidePath, guides } from "./data/guides";
import { footer } from "./data/content";

const origin = "https://www.standinpose.com";
export const publicPaths = ["/", ...guides.map(guidePath)];

export function render(path: string) {
  const guide = guides.find((item) => guidePath(item) === path);
  if (path !== "/" && !guide) throw new Error(`Unknown public page: ${path}`);
  const url = `${origin}${path}`;
  const organization = { "@type": "Organization", "@id": `${origin}/#organization`, name: "Standin", url: `${origin}/` };
  const website = { "@type": "WebSite", "@id": `${origin}/#website`, name: "Standin", url: `${origin}/`, inLanguage: "ko", publisher: { "@id": organization["@id"] } };
  const graph = guide ? [organization, website, {
    "@type": "Article",
    "@id": `${url}#article`,
    url,
    headline: guide.title,
    description: guide.description,
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
    name: "Standin — 러프 이미지로 찾는 웹툰 3D 포즈",
    description: footer.tagline,
    inLanguage: "ko", isPartOf: { "@id": website["@id"] },
  }];

  return {
    html: renderToString(<StrictMode>{guide ? <GuidePage guide={guide} /> : <App />}</StrictMode>),
    structuredData: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\\u003c"),
  };
}

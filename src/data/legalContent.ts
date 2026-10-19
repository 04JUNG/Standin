import terms from "../content/legal/terms.md?raw";
import privacy from "../content/legal/privacy.md?raw";
import contentLicense from "../content/legal/content-license.md?raw";
import beta from "../content/legal/beta.md?raw";
import type { LegalDocument } from "./legal";

export const legalContent: Record<LegalDocument["slug"], string> = {
  terms, privacy, "content-license": contentLicense, beta,
};

export function legalSections(markdown: string) {
  return [...markdown.matchAll(/^## (.+)$/gm)].map((match, index) => ({ id: `section-${index + 1}`, title: match[1] }));
}

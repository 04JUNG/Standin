import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { LegalPage } from "./pages/LegalPage";
import { legalDocuments, legalPath } from "./data/legal";
import "./styles/globals.css";

const path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/?$/, "/");
const document = legalDocuments.find((item) => legalPath(item) === path);
if (document) {
  const root = window.document.getElementById("root")!;
  const page = <StrictMode><LegalPage document={document} /></StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, page);
  else createRoot(root).render(page);
}

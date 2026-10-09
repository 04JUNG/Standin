import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { GuidePage } from "./pages/GuidePage";
import { guidePath, guides } from "./data/guides";
import "./styles/globals.css";

const path = window.location.pathname.replace(/\/index\.html$/, "/").replace(/\/?$/, "/");
const guide = guides.find((item) => guidePath(item) === path);
if (guide) {
  const root = document.getElementById("root")!;
  const page = <StrictMode><GuidePage guide={guide} /></StrictMode>;
  if (root.hasChildNodes()) hydrateRoot(root, page);
  else createRoot(root).render(page);
}

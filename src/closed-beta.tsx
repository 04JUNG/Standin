import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { ClosedBetaPage } from "./pages/ClosedBetaPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClosedBetaPage />
  </StrictMode>,
);

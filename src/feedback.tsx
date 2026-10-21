import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { FeedbackPage } from "./pages/FeedbackPage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FeedbackPage />
  </StrictMode>,
);

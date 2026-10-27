import { createMeasurement } from "./measurement";

// Keep off until the account IDs, policy publication and live-event checks are complete.
export const measurement = createMeasurement({
  enabled: import.meta.env.VITE_MEASUREMENT_ENABLED === "true",
  ga4Id: import.meta.env.VITE_GA4_MEASUREMENT_ID ?? "",
  pixelId: import.meta.env.VITE_META_PIXEL_ID ?? "",
}, typeof window === "undefined" ? undefined : window);

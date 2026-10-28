import { createMeasurement } from "./measurement";

// Public destination IDs. Provider loading still requires separate visitor opt-in.
// Set VITE_MEASUREMENT_ENABLED=false to disable without changing consent records.
export const measurement = createMeasurement({
  enabled: import.meta.env.VITE_MEASUREMENT_ENABLED !== "false",
  ga4Id: import.meta.env.VITE_GA4_MEASUREMENT_ID ?? "G-5T9S4VY5G5",
  pixelId: import.meta.env.VITE_META_PIXEL_ID ?? "1083310858018893",
}, typeof window === "undefined" ? undefined : window);

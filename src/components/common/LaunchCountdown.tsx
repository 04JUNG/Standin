import { useSyncExternalStore } from "react";
import { openBeta, openBetaCountdown } from "../../lib/openBeta";

function subscribe(onChange: () => void) {
  const timer = window.setInterval(onChange, 30_000);
  window.addEventListener("focus", onChange);
  document.addEventListener("visibilitychange", onChange);
  return () => {
    window.clearInterval(timer);
    window.removeEventListener("focus", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}

export function LaunchCountdown() {
  const label = useSyncExternalStore(subscribe, () => openBetaCountdown(new Date()), () => openBeta.fallbackLabel);
  return <span data-launch-countdown="" title="2026년 10월 21일 공개 예정 · 한국 시간 기준">{label}</span>;
}

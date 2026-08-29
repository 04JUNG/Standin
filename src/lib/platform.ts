/**
 * "mobile"은 데스크톱 설치 파일을 실행할 수 없는 기기,
 * "unknown"은 Linux·ChromeOS처럼 지원 대상이 아니거나 판별이 안 된 경우다.
 * 둘 다 추천 없이 두 OS 버튼을 그대로 보여준다.
 */
export type DesktopPlatform = "windows" | "mac" | "mobile" | "unknown";

/**
 * 방문자의 OS를 추정한다.
 *
 * 추정은 어디까지나 '어느 버튼을 먼저 보여줄지'에만 쓴다. 틀려도 두 OS 버튼이
 * 모두 노출되므로 막히는 사람이 없어야 한다는 것이 이 함수의 전제다.
 */
export function detectPlatform(): DesktopPlatform {
  if (typeof navigator === "undefined") return "unknown";

  // 1) Client Hints. UA 문자열 축약(UA reduction)의 영향을 받지 않는다.
  const hinted = navigator.userAgentData;
  if (hinted) {
    if (hinted.mobile) return "mobile";
    if (hinted.platform === "Windows") return "windows";
    if (hinted.platform === "macOS") return "mac";
  }

  const ua = navigator.userAgent;

  // 2) 모바일을 먼저 걸러낸다.
  //    iPadOS는 "데스크톱용 사이트"가 기본값이라 UA에 Macintosh가 들어간다.
  //    터치 포인트 수로만 데스크톱 맥과 구분할 수 있다.
  if (/Android|iPhone|iPod|iPad/i.test(ua)) return "mobile";
  if (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1) return "mobile";

  // 3) navigator.platform은 deprecated지만 아직 모든 브라우저가 채운다.
  const legacy = navigator.platform ?? "";
  if (/Win/i.test(legacy) || /Windows|Win64|WOW64/i.test(ua)) return "windows";
  if (/Mac/i.test(legacy) || /Mac OS X/i.test(ua)) return "mac";

  return "unknown";
}

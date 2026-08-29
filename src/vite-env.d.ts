/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Formspree 폼 ID (예: "xmyzabcd"). .env에 VITE_FORMSPREE_ID로 설정 */
  readonly VITE_FORMSPREE_ID?: string;
  /** BFF(앱 서버) base URL (예: "http://localhost:8080"). 없으면 가입 폼이 데모 모드로 동작 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

/**
 * User-Agent Client Hints. Chromium 계열만 채우고 TS 기본 lib에는 아직 없다.
 * OS 판별에 UA 문자열보다 정확해 detectPlatform이 가장 먼저 본다.
 */
interface NavigatorUABrandVersion {
  readonly brand: string;
  readonly version: string;
}

interface NavigatorUAData {
  readonly brands: readonly NavigatorUABrandVersion[];
  readonly mobile: boolean;
  readonly platform: string;
}

interface Navigator {
  readonly userAgentData?: NavigatorUAData;
}

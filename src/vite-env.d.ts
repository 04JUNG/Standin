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

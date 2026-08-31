/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 사전등록 폼 수신 엔드포인트(Apps Script 웹앱 URL).
   * 없으면 폼이 데모(검증만) 모드로 동작한다. 설정: server/beta-form/README.md
   */
  readonly VITE_BETA_ENDPOINT?: string;
  /** BFF(앱 서버) base URL (예: "http://localhost:8080"). 없으면 가입 폼이 데모 모드로 동작 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

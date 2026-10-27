/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Set true only after policy publication and measurement QA. */
  readonly VITE_MEASUREMENT_ENABLED?: string;
  readonly VITE_GA4_MEASUREMENT_ID?: string;
  readonly VITE_META_PIXEL_ID?: string;
  /**
   * 오픈베타 사전등록 폼 수신 엔드포인트(Apps Script 웹앱 URL).
   * 없으면 폼이 데모(검증만) 모드로 동작한다. 설정: server/beta-form/README.md
   */
  readonly VITE_BETA_ENDPOINT?: string;
  /** 새 오픈베타 설문 전용 수신기. 없으면 설문 제출을 비활성화한다. */
  readonly VITE_FEEDBACK_ENDPOINT?: string;
  /** BFF(앱 서버) base URL (예: "http://localhost:8080"). 없으면 가입 폼이 데모 모드로 동작 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

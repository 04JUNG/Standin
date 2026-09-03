/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * 사전등록 폼 수신 엔드포인트(Apps Script 웹앱 URL).
   * 없으면 폼이 데모(검증만) 모드로 동작한다. 설정: server/beta-form/README.md
   */
  readonly VITE_BETA_ENDPOINT?: string;
  /** 클로즈베타 피드백 수신 엔드포인트. 없으면 VITE_BETA_ENDPOINT를 함께 사용 */
  readonly VITE_FEEDBACK_ENDPOINT?: string;
  /** 클로즈베타 Windows 설치 파일 주소 */
  readonly VITE_WINDOWS_DOWNLOAD_URL?: string;
  /** 클로즈베타 macOS 설치 파일 주소 */
  readonly VITE_MACOS_DOWNLOAD_URL?: string;
  /** BFF(앱 서버) base URL (예: "http://localhost:8080"). 없으면 가입 폼이 데모 모드로 동작 */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

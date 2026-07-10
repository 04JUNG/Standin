/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Formspree 폼 ID (예: "xmyzabcd"). .env에 VITE_FORMSPREE_ID로 설정 */
  readonly VITE_FORMSPREE_ID?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

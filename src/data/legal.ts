import { site } from "./site";

export const legalDate = "2026-10-19";
export const legalDateLabel = "2026년 10월 19일";
export const legalVersion = "2026-10-19";

export const operator = {
  team: site.team,
  representative: "박보라",
  email: site.supportEmail,
  xUrl: "https://x.com/standin_asm",
};

export const legalDocuments = [
  { slug: "terms", label: "이용약관", description: "Standin 서비스 이용 조건과 운영자·이용자의 권리 및 의무를 안내합니다." },
  { slug: "privacy", label: "개인정보처리방침", description: "Standin이 처리하는 개인정보의 목적, 보관기간과 이용자의 권리를 안내합니다." },
  { slug: "content-license", label: "콘텐츠 라이선스 약관", description: "입력 이미지, 제공 자산, 출력 파일과 완성 작품의 이용 범위를 안내합니다." },
  { slug: "beta", label: "오픈베타 운영정책", description: "Standin 오픈베타의 이용 대상, 무료 범위, 사용 한도와 운영 일정을 안내합니다." },
] as const;

export type LegalDocument = (typeof legalDocuments)[number];
export const legalPath = (document: LegalDocument) => `/legal/${document.slug}/`;

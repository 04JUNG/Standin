import { Container } from "../common/Container";
import { BrandMark } from "../common/BrandMark";
import { footer } from "../../data/content";
import { legalDocuments, legalPath, operator } from "../../data/legal";

export function Footer() {
  return (
    <footer id="site-footer" className="site-footer">
      <Container wide>
        <div className="site-footer__top">
          <a href="/" aria-label="Standin 홈" className="site-footer__brand">
            <BrandMark className="text-xl" />
          </a>
          <nav aria-label="약관 및 정책" className="site-footer__links">
            <a href="/feedback/">오픈베타 설문</a>
            {legalDocuments.map((document) => (
              <a key={document.slug} href={legalPath(document)} className={document.slug === "privacy" ? "site-footer__privacy" : undefined}>
                {document.label}
              </a>
            ))}
            <a href={operator.xUrl} target="_blank" rel="noopener noreferrer" aria-label="Standin X 계정 (새 창)" className="site-footer__social">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3L12 14.6 5.5 22H2.3l7.4-8.5L1 2h6.5l4.4 6.7L18.9 2Zm-1.1 18h1.7L6.6 3.9H4.8L17.8 20Z" />
              </svg>
            </a>
          </nav>
        </div>
        <div className="site-footer__info">
          <p><span>운영: {operator.team}</span><span>운영 대표자: {operator.representative}</span><span>개인정보 보호책임자: {operator.representative}</span></p>
          <p><span>고객지원·개인정보 문의: <a href={`mailto:${operator.email}`}>{operator.email}</a></span></p>
        </div>
        <p className="site-footer__copyright">{footer.copyright}</p>
      </Container>
    </footer>
  );
}

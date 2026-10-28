import { BrandMark } from "../components/common/BrandMark";
import { Container } from "../components/common/Container";
import { Footer } from "../components/layout/Footer";
import { legalDate, legalDateLabel, legalDocuments, legalPath, legalVersion, type LegalDocument } from "../data/legal";
import { legalContent, legalSections } from "../data/legalContent";
import { LegalMarkdown } from "../lib/legalMarkdown";

export function LegalPage({ document }: { document: LegalDocument }) {
  const markdown = legalContent[document.slug];
  const pending = markdown.includes("[확정 필요");
  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <header className="legal-header">
        <Container wide><div className="legal-header__inner">
          <a href="/" aria-label="Standin 홈"><BrandMark className="text-xl" /></a>
          <a href="/">홈으로 돌아가기 <span aria-hidden="true">↗</span></a>
        </div></Container>
      </header>
      <main id="main-content" className="legal-main">
        <Container wide>
          <div className="legal-heading">
            <p className="eyebrow">STANDIN · LEGAL</p>
            <h1>{document.label}</h1>
            <p className="legal-description">{document.description}</p>
            <dl className="legal-meta">
              <div><dt>게시일</dt><dd><time dateTime={legalDate}>{legalDateLabel}</time></dd></div>
              <div><dt>적용일</dt><dd><time dateTime={legalDate}>{legalDateLabel}</time></dd></div>
              <div><dt>버전</dt><dd>{legalVersion}</dd></div>
            </dl>
            {pending && <aside className="legal-review-notice">검토용 미리보기입니다. 아래 내용에는 아직 적용되지 않은 보관·동의 정책과 확인이 필요한 항목이 포함되어 있습니다. 현재 앱 동작을 보장하는 최종 개인정보처리방침이 아닙니다.</aside>}
            {document.slug === "privacy" && <aside className="legal-review-notice">웹사이트 측정에 대해서는 2026년 10월 29일 공개한 <a href="/legal/measurement/">웹사이트 측정 개인정보 고지</a>가 아래 검토본 제11항의 미사용 안내를 대체합니다. Google·Meta 측정은 각각 선택 동의 후에만 작동합니다.</aside>}
            <div className="legal-actions">
              <a href={`/legal/${document.slug}/${document.slug}-${legalVersion}.txt`} download>전문 내려받기 (.txt)</a>
              <button type="button" onClick={() => window.print()}>인쇄하기</button>
            </div>
          </div>
          <div className="legal-layout">
            <aside className="legal-sidebar">
              <nav aria-label="약관 문서 선택">
                {legalDocuments.map((item) => <a key={item.slug} href={legalPath(item)} aria-current={item.slug === document.slug ? "page" : undefined}>{item.label}</a>)}
              </nav>
            </aside>
            <article className="legal-article" aria-label={document.label}>
              <details className="legal-toc" open>
                <summary>목차</summary>
                <nav aria-label={`${document.label} 목차`}><ol>{legalSections(markdown).map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.title}</a></li>)}</ol></nav>
              </details>
              <LegalMarkdown markdown={markdown} />
              <a href="#main-content" className="legal-back-top">맨 위로 ↑</a>
            </article>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}

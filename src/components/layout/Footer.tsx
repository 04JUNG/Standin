import { Container } from "../common/Container";
import { footer } from "../../data/content";

export function Footer() {
  return (
    <footer className="border-t border-neutral-250 bg-brand-paper py-14">
      <Container>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <div className="text-xl font-bold tracking-tight text-brand-ink">
              Standin<span className="text-brand-coral">.</span>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {footer.tagline}
            </p>
          </div>

          <nav aria-label="푸터 메뉴" className="flex flex-wrap gap-x-8 gap-y-3">
            {footer.links.map((link) =>
              link.href ? (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[15px] text-neutral-800 hover:text-brand-coral-dark"
                >
                  {link.label}
                </a>
              ) : (
                // 실제 문서 준비 전까지 비활성 텍스트 처리 (docs/02 §2.11)
                <span
                  key={link.label}
                  className="cursor-not-allowed text-[15px] text-neutral-400"
                  title="준비 중"
                >
                  {link.label}
                </span>
              ),
            )}
          </nav>
        </div>

        <div className="mt-10 border-t border-neutral-250 pt-6 text-sm text-neutral-400">
          {footer.copyright}
        </div>
      </Container>
    </footer>
  );
}

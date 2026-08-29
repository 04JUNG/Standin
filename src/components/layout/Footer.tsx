import { ExternalLink } from "lucide-react";
import { Container } from "../common/Container";
import { BrandMark } from "../common/BrandMark";
import { footer } from "../../data/content";

export function Footer() {
  return (
    <footer className="border-t border-neutral-250 bg-brand-paper py-14">
      <Container wide>
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <BrandMark className="text-xl" />
            <p className="mt-3 text-[15px] leading-relaxed text-neutral-600">
              {footer.tagline}
            </p>
          </div>

          <nav aria-label="푸터 메뉴" className="flex flex-wrap gap-x-8 gap-y-3">
            {footer.links.map((link) =>
              link.href && link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[15px] text-neutral-800 hover:text-brand-coral-dark"
                >
                  {link.label}
                  <ExternalLink size={14} aria-hidden="true" />
                  <span className="sr-only">(새 창에서 열림)</span>
                </a>
              ) : link.href ? (
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

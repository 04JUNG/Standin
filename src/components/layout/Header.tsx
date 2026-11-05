import { useI18n } from "../../i18n/context";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "../common/Container";
import { BrandMark } from "../common/BrandMark";
import { LanguageSwitcher } from "../common/LanguageSwitcher";

import { useLandingContent } from "../../i18n/landing";
import { useActiveSection } from "../../hooks/useActiveSection";

const sectionIds = ["input", "process", "result", "features"];

export function Header() {
  const { t } = useI18n();
  const { nav } = useLandingContent();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const active = useActiveSection(sectionIds);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-neutral-250/70 bg-brand-paper/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <Container wide>
        <div className="relative flex h-[72px] items-center justify-between gap-4">
          <a
            href="#main-content"
            aria-label={t("Standin 홈")}
            className="relative z-10 rounded-lg"
          >
            <BrandMark className="text-xl" />
          </a>

          <nav
            aria-label={t("주요 메뉴")}
            className="landing-nav hidden items-center gap-1 lg:flex"
          >
            {nav.links.map((link) => {
              const id = link.href.replace("#", "");
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors ${
                    isActive
                      ? "text-brand-coral-dark"
                      : "text-neutral-800 hover:text-brand-ink"
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="relative z-10 flex items-center gap-2">
            <LanguageSwitcher />
            <a
              href={nav.launchHref}
              className="hidden items-center rounded-full border border-brand-coral/30 bg-brand-coral/12 px-3 py-1 text-[13px] font-semibold whitespace-nowrap text-brand-coral-dark transition-colors hover:border-brand-coral hover:bg-brand-coral hover:text-white md:inline-flex"
            >{t("오픈베타 다운로드")}</a>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-ink lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t("메뉴 닫기") : t("메뉴 열기")}
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </Container>

      {menuOpen && (
        <div
          id="mobile-menu"
          className="border-t border-neutral-250/70 bg-brand-paper/95 backdrop-blur-md lg:hidden"
        >
          <Container wide>
            <nav aria-label={t("모바일 메뉴")} className="flex flex-col py-3">
              {nav.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-neutral-800 hover:bg-neutral-100"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={nav.launchHref}
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center self-start rounded-full border border-brand-coral/30 bg-brand-coral/12 px-3 py-1 text-[13px] font-semibold text-brand-coral-dark"
              >{t("오픈베타 다운로드")}</a>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

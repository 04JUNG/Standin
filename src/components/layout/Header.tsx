import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "../common/Container";
import { Button } from "../common/Button";
import { nav } from "../../data/content";
import { useActiveSection } from "../../hooks/useActiveSection";

const sectionIds = ["workflow", "benefits", "clip-studio", "faq"];

export function Header() {
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
      <Container>
        <div className="flex h-[72px] items-center justify-between gap-4">
          <a
            href="#main-content"
            className="text-xl font-bold tracking-tight text-brand-ink"
          >
            Standin<span className="text-brand-coral">.</span>
          </a>

          <nav aria-label="주요 메뉴" className="hidden items-center gap-1 lg:flex">
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

          <div className="flex items-center gap-2">
            <Button as="a" href={nav.ctaHref} className="hidden sm:inline-flex">
              {nav.cta}
            </Button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-brand-ink lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
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
          <Container>
            <nav aria-label="모바일 메뉴" className="flex flex-col py-3">
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
              <Button
                as="a"
                href={nav.ctaHref}
                onClick={() => setMenuOpen(false)}
                className="mt-2"
              >
                {nav.cta}
              </Button>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}

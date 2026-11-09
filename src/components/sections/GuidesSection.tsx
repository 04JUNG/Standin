import { useI18n } from "../../i18n/context";
import { ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { guidePath, guides } from "../../data/guides";
import { blogPosts, blogPath } from '../../data/blog';

export function GuidesSection() {
  const { t, locale } = useI18n();
  return (
    <section id="guides" className="border-t border-neutral-250 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="GUIDES" title={t("입력부터 작화까지, 사용 가이드")} />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <a key={guide.slug} href={guidePath(guide)} className="rounded-[22px] border border-neutral-250 p-6 transition-colors hover:border-brand-coral">
              <h3 className="text-xl font-semibold text-brand-ink">{t(guide.title)}</h3>
              <p className="mt-3 leading-relaxed text-neutral-600">{t(guide.description)}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-coral-dark">{t("가이드 읽기")}<ArrowRight size={18} /></span>
            </a>
          ))}
        </div>
        {locale === 'ko' ? <div className="mt-12 border-t border-neutral-250 pt-8">
          <div className="flex items-center justify-between gap-4"><h2 className="text-2xl font-bold text-brand-ink">Standin 블로그</h2><a href="/blog/" className="underline underline-offset-4">전체 글 보기 →</a></div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">{blogPosts.map(post => <a key={post.slug} href={blogPath(post)} className="rounded-2xl border border-neutral-250 p-5 hover:border-brand-coral"><p className="text-sm text-neutral-600">{post.category}</p><h3 className="mt-3 text-lg font-semibold leading-relaxed text-brand-ink">{post.title}</h3><p className="mt-4 text-sm text-brand-coral-dark">글 읽기 →</p></a>)}</div>
        </div> : <a href="/blog/" className="mt-8 inline-block underline underline-offset-4">Standin ブログ（韓国語） →</a>}
      </Container>
    </section>
  );
}

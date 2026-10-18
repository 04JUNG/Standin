import { BrandMark } from "../components/common/BrandMark";
import { Container } from "../components/common/Container";
import { Footer } from "../components/layout/Footer";
import { hero } from "../data/content";
import { guidePath, guides, type Guide } from "../data/guides";
import { site } from "../data/site";

export function GuidePage({ guide }: { guide: Guide }) {
  return (
    <>
      <a className="skip-link" href="#main-content">본문으로 바로가기</a>
      <header className="border-b border-neutral-250 py-5">
        <Container>
          <div className="flex items-center justify-between gap-4">
            <a href="/" aria-label="Standin 홈"><BrandMark className="text-xl" /></a>
            <a href={hero.primaryHref} className="text-sm font-semibold text-brand-coral-dark">{hero.primaryCta}</a>
          </div>
        </Container>
      </header>
      <main id="main-content" className="py-12 sm:py-20">
        <Container>
          <article className="mx-auto max-w-3xl">
            <nav aria-label="현재 위치" className="mb-6 text-sm text-neutral-600">
              <a href="/" className="underline">홈</a> / <a href="/#guides" className="underline">사용 가이드</a>
            </nav>
            <h1 className="text-3xl leading-tight font-bold tracking-tight text-brand-ink sm:text-4xl">{guide.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-neutral-800">{guide.description}</p>
            <div className="mt-4 space-y-1 text-sm leading-relaxed text-neutral-600">
              <p>작성: <a href="/" rel="author" className="underline underline-offset-4">{site.team}</a></p>
              <p>게시 <time dateTime={guide.publishedAt}>{guide.publishedAt}</time> · 수정 <time dateTime={guide.modifiedAt}>{guide.modifiedAt}</time></p>
            </div>
            <nav aria-label="이 가이드의 질문" className="mt-8 rounded-[22px] border border-neutral-250 bg-white p-6">
              <h2 className="text-lg font-semibold text-brand-ink">궁금한 내용 바로 찾기</h2>
              <ul className="mt-3 space-y-3">
                {guide.sections.map((section) => (
                  <li key={section.id}><a href={`#${section.id}`} className="text-neutral-800 underline underline-offset-4">{section.title}</a></li>
                ))}
              </ul>
            </nav>
            <figure className="my-10">
              <video className="aspect-[144/85] w-full rounded-[22px] border border-neutral-250 bg-brand-canvas" src={guide.video.src} poster={guide.video.poster} controls playsInline preload="none" aria-label={guide.video.label} />
              <figcaption className="mt-3 text-sm text-neutral-600">{guide.video.label}</figcaption>
            </figure>
            {guide.sections.map((section) => (
              <section key={section.id} id={section.id} className="mt-10 scroll-mt-24">
                <h2 className="text-2xl leading-snug font-bold text-brand-ink"><a href={`#${section.id}`} className="hover:underline">{section.title}</a></h2>
                <p className="mt-4 leading-relaxed text-neutral-800">{section.body}</p>
                {section.checks && (
                  <ul className="mt-4 list-disc space-y-2 pl-6 text-neutral-800">
                    {section.checks.map((check) => <li key={check}>{check}</li>)}
                  </ul>
                )}
              </section>
            ))}
            {guide.references && (
              <section id="references" className="mt-10 scroll-mt-24" aria-labelledby="references-title">
                <h2 id="references-title" className="text-2xl font-bold text-brand-ink">클립스튜디오 조작 참고 문서</h2>
                <p className="mt-4 leading-relaxed text-neutral-800">클립스튜디오 안에서 자세와 카메라를 조정하는 방법은 공식 매뉴얼에서 확인할 수 있습니다. Standin의 파일 형식과 가져오기 방법은 오픈베타 공개 시 제공하는 안내를 확인해 주세요.</p>
                <ul className="mt-4 list-disc space-y-3 pl-6 text-neutral-800">
                  {guide.references.map((reference) => <li key={reference.url}><a href={reference.url} className="underline underline-offset-4">{reference.label}</a></li>)}
                </ul>
              </section>
            )}
            <aside className="mt-12 rounded-[22px] border border-neutral-250 bg-white p-6" aria-label="관련 안내">
              <h2 className="text-xl font-semibold text-brand-ink">함께 읽기</h2>
              {guides.filter((item) => item.slug !== guide.slug).map((item) => (
                <a key={item.slug} href={guidePath(item)} className="mt-3 block text-brand-coral-dark underline">{item.title}</a>
              ))}
              <a href="/#faq" className="mt-3 block underline">Standin 자주 묻는 질문</a>
              <a href={hero.primaryHref} className="mt-6 inline-flex rounded-full bg-brand-coral px-6 py-3 font-semibold text-brand-ink">{hero.primaryCta}</a>
            </aside>
          </article>
        </Container>
      </main>
      <Footer />
    </>
  );
}

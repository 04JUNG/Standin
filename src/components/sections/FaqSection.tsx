import { Plus } from "lucide-react";
import { useEffect } from "react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { faqItems } from "../../data/faq";

// 모집 상태와 참여 방법은 기존 클로즈베타 페이지에서 안내한다.
const productFaqItems = faqItems.filter((item) => item.id !== "availability");

export function FaqSection() {
  useEffect(() => {
    const openLinkedAnswer = () => {
      const id = window.location.hash.slice(1);
      if (!productFaqItems.some((item) => `faq-${item.id}` === id)) return;
      const answer = document.getElementById(id);
      if (answer instanceof HTMLDetailsElement) answer.open = true;
    };
    openLinkedAnswer();
    window.addEventListener("hashchange", openLinkedAnswer);
    return () => window.removeEventListener("hashchange", openLinkedAnswer);
  }, []);

  return (
    <section id="faq" className="py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-16">
          <SectionHeading
            eyebrow="FAQ"
            title="자주 묻는 질문"
            description="현재 범위와 앞으로의 계획을 구분해 정직하게 안내합니다."
          />

          <div className="divide-y divide-neutral-250 border-t border-neutral-250">
            {productFaqItems.map((item) => (
              <details key={item.id} id={`faq-${item.id}`} className="group scroll-mt-24 py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-lg font-semibold text-brand-ink [&::-webkit-details-marker]:hidden">
                  {item.question}
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-brand-ink transition-transform duration-200 group-open:rotate-45">
                    <Plus size={18} />
                  </span>
                </summary>
                <p className="pb-5 pr-12 leading-relaxed text-neutral-600">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

import { ArrowRight } from "lucide-react";
import { Container } from "../common/Container";
import { SectionHeading } from "../common/SectionHeading";
import { guidePath, guides } from "../../data/guides";

export function GuidesSection() {
  return (
    <section id="guides" className="border-t border-neutral-250 bg-white py-20 sm:py-24">
      <Container>
        <SectionHeading eyebrow="GUIDES" title="입력부터 작화까지, 사용 가이드" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {guides.map((guide) => (
            <a key={guide.slug} href={guidePath(guide)} className="rounded-[22px] border border-neutral-250 p-6 transition-colors hover:border-brand-coral">
              <h3 className="text-xl font-semibold text-brand-ink">{guide.title}</h3>
              <p className="mt-3 leading-relaxed text-neutral-600">{guide.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-coral-dark">가이드 읽기 <ArrowRight size={18} /></span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}

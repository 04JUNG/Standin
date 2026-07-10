import { Container } from "../common/Container";
import { BetaSignupForm } from "../forms/BetaSignupForm";
import { beta } from "../../data/content";

export function BetaSection() {
  return (
    <section id="beta" className="bg-brand-ink py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <span className="text-xs font-semibold tracking-[0.12em] text-brand-coral uppercase">
              {beta.eyebrow}
            </span>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
              {beta.title}
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-neutral-250">
              {beta.body}
            </p>
          </div>

          <div className="lg:pl-8">
            <BetaSignupForm />
          </div>
        </div>
      </Container>
    </section>
  );
}

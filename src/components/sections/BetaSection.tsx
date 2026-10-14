import { CalendarClock, Download } from "lucide-react";
import { Container } from "../common/Container";
import { BetaSignupForm } from "../forms/BetaSignupForm";
import { beta } from "../../data/content";

const itemIcons = [CalendarClock, Download];

export function BetaSection() {
  return (
    <section id="beta" className="bg-brand-ink py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="text-xs font-semibold tracking-[0.12em] text-brand-coral uppercase">
                {beta.eyebrow}
              </span>
              <span className="rounded-full border border-brand-coral/40 bg-brand-coral/15 px-3 py-1 text-[13px] font-semibold text-white">
                {beta.status}
              </span>
            </div>
            <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
              {beta.title}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-neutral-250">
              {beta.body}
            </p>
            <ul className="mt-7 grid max-w-lg gap-3">
              {beta.items.map((item, index) => {
                const Icon = itemIcons[index];
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white/10 text-brand-coral">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-semibold text-white">{item.title}</h3>
                      <p className="mt-0.5 text-sm leading-relaxed text-neutral-250">{item.body}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-neutral-400">
              {beta.note}
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

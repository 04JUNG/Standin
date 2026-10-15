import { Gift, ScanLine, SlidersHorizontal, TextSearch } from "lucide-react";
import { Container } from "../common/Container";
import { BetaSignupForm } from "../forms/BetaSignupForm";
import { beta } from "../../data/content";

const updateIcons = [TextSearch, ScanLine, SlidersHorizontal];

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
            <div className="mt-6 inline-flex max-w-lg items-center gap-3 rounded-2xl border border-brand-coral/35 bg-brand-coral/12 px-4 py-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-coral text-brand-ink">
                <Gift size={18} aria-hidden="true" />
              </span>
              <p className="text-[15px] leading-snug text-neutral-250">
                {beta.perkLabel} · <strong className="font-bold text-white">{beta.perk}</strong>
              </p>
            </div>
            <p className="mt-8 text-sm font-semibold text-white">{beta.updatesLabel}</p>
            <ul className="mt-3 grid max-w-lg gap-3">
              {beta.updates.map((item, index) => {
                const Icon = updateIcons[index];
                return (
                  <li key={item.title} className="flex items-start gap-3.5">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] bg-white/10 text-brand-coral">
                      <Icon size={18} aria-hidden="true" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-white">{item.title}</h3>
                        <span
                          className={`rounded-full border px-2 py-0.5 text-[12px] font-semibold ${
                            item.upcoming
                              ? "border-white/20 text-neutral-250"
                              : "border-brand-coral/40 bg-brand-coral/15 text-white"
                          }`}
                        >
                          {item.upcoming ? beta.badges.upcoming : beta.badges.added}
                        </span>
                      </div>
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

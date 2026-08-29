import { Plus } from "lucide-react";
import { download } from "../../data/content";

/**
 * 요구사항은 항상 펼쳐 두고, 문제를 만난 사람만 필요한 해결 절차는 접어 둔다.
 * 클립스튜디오 버전과 베타 동의는 받고 나서 알면 늦기 때문에 접기 밖에 둔다.
 */
export function InstallNotes() {
  return (
    <div className="mx-auto mt-14 max-w-[900px] rounded-[24px] border border-white/12 bg-white/[0.04] p-6 sm:p-8">
      <p className="text-xs font-semibold tracking-[0.12em] text-brand-coral uppercase">
        {download.requirementsTitle}
      </p>

      <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
        {download.requirements.map((item) => (
          <div key={item.term}>
            <dt className="text-[15px] font-semibold text-white">
              {item.term}
            </dt>
            <dd className="mt-1 text-sm leading-relaxed text-neutral-250">
              {item.desc}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-7 border-t border-white/12 pt-5">
        <HelpDetails
          title={download.windowsHelpTitle}
          steps={download.windowsHelpSteps}
          note={download.windowsHelpNote}
        />
        <HelpDetails
          title={download.macHelpTitle}
          steps={download.macHelpSteps}
          note={download.macHelpNote}
        />
      </div>
    </div>
  );
}

type HelpDetailsProps = {
  title: string;
  steps: string[];
  note: string;
};

function HelpDetails({ title, steps, note }: HelpDetailsProps) {
  return (
    <details className="group border-b border-white/10 last:border-b-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left text-[15px] font-semibold text-white marker:content-none">
        {title}
        <Plus
          size={18}
          aria-hidden="true"
          className="shrink-0 text-brand-coral transition-transform duration-200 group-open:rotate-45"
        />
      </summary>
      <div className="pb-5">
        <ol className="ml-4 list-decimal space-y-1.5 text-sm leading-relaxed text-neutral-250">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        <p className="mt-3 text-[13px] leading-relaxed text-neutral-400">
          {note}
        </p>
      </div>
    </details>
  );
}

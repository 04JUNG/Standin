import { Check } from "lucide-react";
import { Mannequin } from "./Mannequin";
import { Badge } from "../common/Badge";
import type { PoseCandidate } from "../../types/landing";

type PoseCandidateCardProps = {
  candidate: PoseCandidate;
  selected: boolean;
  onSelect: (id: PoseCandidate["id"]) => void;
};

export function PoseCandidateCard({
  candidate,
  selected,
  onSelect,
}: PoseCandidateCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(candidate.id)}
      className={`group flex w-full flex-col rounded-2xl p-3 text-left transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] ${
        selected
          ? "bg-[#1a2434] ring-2 ring-brand-coral"
          : "bg-[#1a2434] ring-1 ring-white/10 hover:-translate-y-0.5 hover:ring-white/30"
      }`}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#141d2b]">
        <Mannequin
          pose={candidate.id}
          accent={selected}
          className="h-full w-full"
        />
        {selected && (
          <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-brand-coral text-white">
            <Check size={12} />
          </span>
        )}
        {candidate.confidence === "low" && (
          <span className="absolute bottom-2 left-2">
            <Badge tone="warning">보정 필요</Badge>
          </span>
        )}
      </div>

      <div className="mt-3">
        <p
          className={`text-[15px] font-semibold ${
            selected ? "text-white" : "text-neutral-100"
          }`}
        >
          {candidate.title}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {candidate.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/8 px-2 py-0.5 text-[11px] font-medium text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}

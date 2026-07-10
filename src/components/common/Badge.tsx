import type { ReactNode } from "react";

type Tone = "neutral" | "sky" | "coral" | "warning";

const tones: Record<Tone, string> = {
  neutral: "bg-neutral-100 text-neutral-800 border-neutral-250",
  sky: "bg-brand-sky/20 text-brand-ink border-brand-sky/50",
  coral: "bg-brand-coral/12 text-brand-coral-dark border-brand-coral/30",
  warning: "bg-warning/12 text-warning border-warning/30",
};

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
  className?: string;
};

export function Badge({ children, tone = "neutral", icon, className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-semibold ${tones[tone]} ${className}`}
    >
      {icon}
      {children}
    </span>
  );
}

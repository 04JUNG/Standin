type MediaPlaceholderProps = {
  label: string;
  ariaLabel: string;
  aspect?: "wide" | "standard";
  tone?: "light" | "dark";
};

const aspectClasses = {
  wide: "aspect-[16/10]",
  standard: "aspect-[4/3]",
};

/**
 * 실제 사진·GIF·영상이 준비되면 내부 div만 미디어 요소로 교체한다.
 * 지금은 레이아웃과 반응형 비율만 확정하기 위해 의도적으로 비워 둔다.
 */
export function MediaPlaceholder({
  label,
  ariaLabel,
  aspect = "standard",
  tone = "light",
}: MediaPlaceholderProps) {
  const dark = tone === "dark";

  return (
    <figure>
      <div
        role="img"
        aria-label={ariaLabel}
        className={`${aspectClasses[aspect]} w-full rounded-[24px] border border-dashed ${
          dark
            ? "border-white/20 bg-white/[0.04]"
            : "border-neutral-250 bg-white/45"
        }`}
      />
      <figcaption
        className={`mt-3 text-sm ${dark ? "text-neutral-400" : "text-neutral-600"}`}
      >
        {label}
      </figcaption>
    </figure>
  );
}

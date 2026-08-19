type MediaVideoProps = {
  src: string;
  poster?: string;
  label: string;
  ariaLabel: string;
  /** 영상 원본 비율. 기본값은 화면 녹화(1440×828) 비율. */
  aspect?: string;
  tone?: "light" | "dark";
};

/**
 * MediaPlaceholder와 동일한 프레임 스타일을 유지하면서
 * 실제 영상(자동재생·무음·루프)을 보여 준다.
 */
export function MediaVideo({
  src,
  poster,
  label,
  ariaLabel,
  aspect = "aspect-[40/23]",
  tone = "light",
}: MediaVideoProps) {
  const dark = tone === "dark";

  return (
    <figure>
      <div
        className={`${aspect} w-full overflow-hidden rounded-[24px] border ${
          dark ? "border-white/20 bg-white/[0.04]" : "border-neutral-250 bg-white"
        }`}
      >
        <video
          className="h-full w-full object-cover"
          src={src}
          poster={poster}
          aria-label={ariaLabel}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      </div>
      <figcaption
        className={`mt-3 text-sm ${dark ? "text-neutral-400" : "text-neutral-600"}`}
      >
        {label}
      </figcaption>
    </figure>
  );
}

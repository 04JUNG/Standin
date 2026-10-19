type BrandMarkProps = {
  className?: string;
  showSymbol?: boolean;
};

/** Header, footer, account pages share one brand lockup. */
export function BrandMark({ className = "", showSymbol = true }: BrandMarkProps) {
  return (
    <span
      className={`inline-flex items-center gap-2.5 font-bold tracking-[-0.04em] text-brand-ink ${className}`}
    >
      {showSymbol && (
        <img
          src="/favicon.svg"
          alt=""
          aria-hidden="true"
          width="32"
          height="32"
          className="h-8 w-8 shrink-0"
        />
      )}
      <span aria-label="Standin">
        Stand<span className="text-brand-coral">in.</span>
      </span>
    </span>
  );
}

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
        <span
          aria-hidden="true"
          className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-brand-ink"
        >
          <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none">
            <path
              d="M8.5 6.5h15v19h-15z"
              stroke="#f8f5ef"
              strokeOpacity=".32"
              strokeWidth="1.2"
            />
            <circle cx="17" cy="10" r="2.4" stroke="#ff6b57" strokeWidth="1.8" />
            <path
              d="M17 12.5v6m0-3-4.2 3m4.2-3 4.7 2.2M17 18.5l-3 6m3-6 3.6 6"
              stroke="#ff6b57"
              strokeLinecap="round"
              strokeWidth="1.8"
            />
            <circle cx="17" cy="15.5" r="1.15" fill="#8ed8e8" />
            <circle cx="17" cy="18.5" r="1.15" fill="#8ed8e8" />
          </svg>
        </span>
      )}
      <span aria-label="Standin">
        Stand<span className="text-brand-coral">in.</span>
      </span>
    </span>
  );
}

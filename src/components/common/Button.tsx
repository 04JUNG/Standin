import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "secondary-dark";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] disabled:cursor-not-allowed";

const sizes: Record<Size, string> = {
  md: "h-12 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-coral text-white hover:bg-brand-coral-dark hover:-translate-y-0.5 disabled:bg-neutral-250 disabled:text-neutral-600 disabled:hover:translate-y-0",
  secondary:
    "border border-brand-ink/25 bg-white/60 text-brand-ink hover:bg-white hover:border-brand-ink/50",
  "secondary-dark":
    "border border-white/25 bg-transparent text-white hover:bg-white/10",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type ButtonAsAnchor = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a"; href: string };

export function Button(props: ButtonAsButton | ButtonAsAnchor) {
  const {
    variant = "primary",
    size = "md",
    className = "",
    children,
    ...rest
  } = props;
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if (rest.as === "a") {
    const { as: _as, ...anchorProps } = rest as ButtonAsAnchor;
    return (
      <a className={classes} {...anchorProps}>
        {children}
      </a>
    );
  }

  const { as: _as, ...buttonProps } = rest as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  theme?: "light" | "dark";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  theme = "light",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "text-center mx-auto items-center" : "";
  const titleColor = theme === "dark" ? "text-white" : "text-brand-ink";
  const descColor = theme === "dark" ? "text-neutral-250" : "text-neutral-600";

  return (
    <div className={`flex flex-col gap-4 ${alignment} ${className}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2
        className={`text-3xl leading-tight font-bold tracking-tight sm:text-4xl ${titleColor}`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-2xl text-lg leading-relaxed ${descColor} ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

import type { ReactNode } from "react";
import { useReveal } from "../../hooks/useReveal";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** 지연(ms) — 리스트 순차 등장에 사용 */
  delay?: number;
};

export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

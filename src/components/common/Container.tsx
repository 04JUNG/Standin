import type { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  /** Hero 등 넓은 비주얼은 1360px까지 허용 */
  wide?: boolean;
  className?: string;
};

export function Container({ children, wide = false, className = "" }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${
        wide ? "max-w-[1360px]" : "max-w-[1200px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}

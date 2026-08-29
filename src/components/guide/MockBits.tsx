import type { ReactNode } from "react";

/**
 * 목업 안에서 되풀이되는 조각들.
 * 전부 span/div다 — 목업은 그림이므로 button이나 input을 만들지 않는다.
 */

type MockButtonProps = {
  children: ReactNode;
  tone?: "default" | "primary" | "ghost";
};

export function MockButton({ children, tone = "default" }: MockButtonProps) {
  const toneClass =
    tone === "primary" ? " is-primary" : tone === "ghost" ? " is-ghost" : "";
  return <span className={`mock-button${toneClass}`}>{children}</span>;
}

/** 단축키 표기. keys=["Ctrl","Enter"] → Ctrl + Enter */
export function MockKbd({ keys }: { keys: string[] }) {
  return <span className="mock-kbd">{keys.join(" + ")}</span>;
}

/** 체크된 상태의 체크박스. 목업은 항상 진행된 상태를 보여준다. */
export function MockCheckbox() {
  return (
    <span className="mock-checkbox">
      <CheckGlyph />
    </span>
  );
}

/** lucide 아이콘은 목업 글자 크기(em)를 따라오지 않아 인라인 SVG로 그린다. */
export function CheckGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="0.8em"
      height="0.8em"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function GripGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="currentColor"
      aria-hidden="true"
    >
      <circle cx="9" cy="6" r="1.6" />
      <circle cx="9" cy="12" r="1.6" />
      <circle cx="9" cy="18" r="1.6" />
      <circle cx="15" cy="6" r="1.6" />
      <circle cx="15" cy="12" r="1.6" />
      <circle cx="15" cy="18" r="1.6" />
    </svg>
  );
}

export function UploadGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1.8em"
      height="1.8em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5" />
      <path d="M12 3v12" />
    </svg>
  );
}

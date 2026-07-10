import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";
import { beta } from "../../data/content";
import type { BetaFormValues, SubmitState } from "../../types/landing";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: BetaFormValues) {
  const errors: Partial<Record<keyof BetaFormValues, string>> = {};
  if (!emailPattern.test(values.email)) {
    errors.email = "올바른 이메일 주소를 입력해 주세요.";
  }
  if (!values.role) {
    errors.role = "작업 형태를 선택해 주세요.";
  }
  if (!values.consent) {
    errors.consent = "안내 수신 동의가 필요합니다.";
  }
  return errors;
}

// 백엔드 endpoint 미연결 상태. 실제 수집 기능을 붙이기 전까지 데모로 명시한다.
const HAS_BACKEND = false;

export function BetaSignupForm() {
  const [values, setValues] = useState<BetaFormValues>({
    email: "",
    role: "",
    consent: false,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BetaFormValues, string>>
  >({});
  const [state, setState] = useState<SubmitState>("idle");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setState("idle");
      return;
    }

    if (!HAS_BACKEND) {
      // 실제 등록 성공을 위조하지 않는다. 검증 통과만 로컬로 안내.
      console.info("[데모 폼] 검증 통과 — 실제 수집 endpoint 미연결", values);
      setState("success");
      return;
    }
    // TODO: 실제 endpoint 연결 시 fetch(import.meta.env.VITE_BETA_ENDPOINT) 처리
  }

  if (state === "success") {
    return (
      <div className="rounded-[22px] border border-white/15 bg-white/10 p-6 text-white">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={22} className="text-brand-sky" />
          <p className="text-lg font-semibold">입력이 확인되었습니다</p>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-250">
          {beta.success}
        </p>
        <p className="mt-4 rounded-lg bg-warning/15 px-3 py-2 text-[13px] leading-relaxed text-white/90">
          {beta.demoNotice}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[22px] border border-white/15 bg-white/[0.07] p-6 backdrop-blur-sm"
    >
      {/* 이메일 */}
      <div>
        <label htmlFor="beta-email" className="block text-[14px] font-semibold text-white">
          {beta.emailLabel}
        </label>
        <input
          id="beta-email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          placeholder={beta.emailPlaceholder}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "beta-email-error" : undefined}
          className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-white/95 px-4 text-brand-ink placeholder:text-neutral-400 focus:border-brand-sky"
        />
        {errors.email && (
          <FieldError id="beta-email-error">{errors.email}</FieldError>
        )}
      </div>

      {/* 작업 형태 */}
      <div className="mt-4">
        <label htmlFor="beta-role" className="block text-[14px] font-semibold text-white">
          {beta.roleLabel}
        </label>
        <select
          id="beta-role"
          value={values.role}
          onChange={(e) =>
            setValues((v) => ({
              ...v,
              role: e.target.value as BetaFormValues["role"],
            }))
          }
          aria-invalid={!!errors.role}
          aria-describedby={errors.role ? "beta-role-error" : undefined}
          className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-white/95 px-4 text-brand-ink focus:border-brand-sky"
        >
          {beta.roleOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {errors.role && (
          <FieldError id="beta-role-error">{errors.role}</FieldError>
        )}
      </div>

      {/* 동의 */}
      <div className="mt-4">
        <label className="flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-250">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) =>
              setValues((v) => ({ ...v, consent: e.target.checked }))
            }
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "beta-consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-brand-coral"
          />
          <span>{beta.consent}</span>
        </label>
        {errors.consent && (
          <FieldError id="beta-consent-error">{errors.consent}</FieldError>
        )}
      </div>

      <button
        type="submit"
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-coral px-6 font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand-coral-dark"
      >
        {beta.cta}
        <ArrowRight size={18} />
      </button>

      <p className="mt-4 text-center text-[12px] leading-relaxed text-neutral-400">
        {beta.demoNotice}
      </p>
    </form>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[#ffb4a6]"
    >
      <AlertCircle size={14} />
      {children}
    </p>
  );
}

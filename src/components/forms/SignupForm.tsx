import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  MailCheck,
} from "lucide-react";
import { signup } from "../../data/content";
import type { SignupFormValues, SubmitState } from "../../types/landing";
import { ApiError, HAS_API, postJson } from "../../lib/api";
import { Button } from "../common/Button";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** 앱을 다시 앞으로 가져오는 딥링크. 앱이 꺼져 있으면 OS가 실행한다. */
const APP_DEEP_LINK = "standin://open";

/** 재발송 연타 방지(초). */
const RESEND_COOLDOWN = 60;

type FieldErrors = Partial<Record<keyof SignupFormValues, string>>;

/**
 * 비밀번호 최소 길이는 서버 규칙(8자)과 맞춘다.
 * 클라이언트가 더 강한 정책을 임의로 만들지 않는다 — 통과했는데 서버가 거절하거나
 * 그 반대가 되면 사용자는 이유를 알 수 없다.
 */
function validate(values: SignupFormValues): FieldErrors {
  const errors: FieldErrors = {};
  if (!emailPattern.test(values.email)) {
    errors.email = "올바른 이메일 주소를 입력해 주세요.";
  }
  if (values.password.length < 8) {
    errors.password = "비밀번호는 8자 이상이어야 합니다.";
  }
  if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
  }
  if (!values.consent) {
    errors.consent = "약관 동의가 필요합니다.";
  }
  return errors;
}

/** 오류가 난 첫 필드로 포커스를 옮긴다. 폼이 길어 화면 밖 오류를 놓치기 쉽다. */
const FIELD_ORDER: (keyof SignupFormValues)[] = [
  "email",
  "password",
  "passwordConfirm",
  "displayName",
  "consent",
];

export function SignupForm() {
  const [values, setValues] = useState<SignupFormValues>({
    email: "",
    password: "",
    passwordConfirm: "",
    displayName: "",
    consent: false,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [state, setState] = useState<SubmitState>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  const formRef = useRef<HTMLFormElement>(null);

  function focusFirstError(nextErrors: FieldErrors) {
    const first = FIELD_ORDER.find((key) => nextErrors[key]);
    if (!first) return;
    formRef.current?.querySelector<HTMLElement>(`#signup-${first}`)?.focus();
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setState("idle");
      focusFirstError(nextErrors);
      return;
    }

    if (!HAS_API) {
      // 서버 미연결: 가입 성공을 위조하지 않는다(CLAUDE.md §4).
      setState("error");
      setFormError(signup.demoNotice);
      return;
    }

    setState("submitting");
    try {
      await postJson("/v1/auth/register", {
        email: values.email.trim(),
        password: values.password,
        // 비우면 서버가 이메일 앞부분을 표시 이름으로 쓴다.
        ...(values.displayName.trim() ? { displayName: values.displayName.trim() } : {}),
      });
      setRegisteredEmail(values.email.trim());
      setState("success");
    } catch (err) {
      const apiError = err instanceof ApiError ? err : null;
      if (apiError?.field) {
        // 특정 입력의 문제면 그 입력 아래에 붙인다(이미 가입된 이메일 등).
        setErrors({ [apiError.field]: apiError.message });
        setState("idle");
        focusFirstError({ [apiError.field]: apiError.message });
        return;
      }
      setFormError(apiError?.message ?? "요청을 처리하지 못했습니다.");
      setState("error");
    }
  }

  if (state === "success") {
    return <SignupSuccess email={registeredEmail} />;
  }

  const submitting = state === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[22px] border border-neutral-250 bg-white p-6 shadow-[var(--shadow-card)] sm:p-7"
    >
      <Field
        id="signup-email"
        label={signup.emailLabel}
        error={errors.email}
        input={
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
            placeholder={signup.emailPlaceholder}
            disabled={submitting}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "signup-email-error" : undefined}
            className={inputClass(!!errors.email)}
          />
        }
      />

      <div className="mt-4">
        <Field
          id="signup-password"
          label={signup.passwordLabel}
          error={errors.password}
          input={
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={values.password}
                onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
                placeholder={signup.passwordPlaceholder}
                disabled={submitting}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "signup-password-error" : undefined}
                className={`${inputClass(!!errors.password)} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? signup.hidePassword : signup.showPassword}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-neutral-600 hover:text-neutral-950"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          }
        />
      </div>

      <div className="mt-4">
        <Field
          id="signup-passwordConfirm"
          label={signup.passwordConfirmLabel}
          error={errors.passwordConfirm}
          input={
            <input
              id="signup-passwordConfirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={values.passwordConfirm}
              onChange={(e) => setValues((v) => ({ ...v, passwordConfirm: e.target.value }))}
              disabled={submitting}
              aria-invalid={!!errors.passwordConfirm}
              aria-describedby={
                errors.passwordConfirm ? "signup-passwordConfirm-error" : undefined
              }
              className={inputClass(!!errors.passwordConfirm)}
            />
          }
        />
      </div>

      <div className="mt-4">
        <Field
          id="signup-displayName"
          label={signup.displayNameLabel}
          hint={signup.displayNameHint}
          error={errors.displayName}
          input={
            <input
              id="signup-displayName"
              type="text"
              autoComplete="nickname"
              value={values.displayName}
              onChange={(e) => setValues((v) => ({ ...v, displayName: e.target.value }))}
              placeholder={signup.displayNamePlaceholder}
              disabled={submitting}
              className={inputClass(false)}
            />
          }
        />
      </div>

      {/* 동의 */}
      <div className="mt-5">
        <label className="flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-800">
          <input
            id="signup-consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))}
            disabled={submitting}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? "signup-consent-error" : undefined}
            className="mt-1 h-4 w-4 shrink-0 accent-brand-coral"
          />
          <span>
            {signup.consentPrefix}{" "}
            {/* 실제 문서 준비 전까지 비활성 텍스트 처리(푸터와 같은 관례) */}
            <span className="cursor-not-allowed text-neutral-400 underline" title="준비 중">
              {signup.consentPolicyLabel}
            </span>
            {signup.consentSuffix}
          </span>
        </label>
        {errors.consent && (
          <FieldError id="signup-consent-error">{errors.consent}</FieldError>
        )}
      </div>

      {formError && (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg bg-error/10 px-3 py-2 text-[13px] font-medium leading-relaxed text-error"
        >
          <AlertCircle size={15} className="mt-0.5 shrink-0" />
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-coral px-6 font-semibold text-brand-ink transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#ff806f] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            계정 만드는 중…
          </>
        ) : (
          <>
            {signup.cta}
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {/* 데모 안내는 입력 전에 미리 보여준다. 제출 후에는 위 배너가 같은 말을 하므로 감춘다. */}
      {!HAS_API && !formError && (
        <p className="mt-4 text-center text-[12px] leading-relaxed text-neutral-600">
          {signup.demoNotice}
        </p>
      )}
    </form>
  );
}

/** 가입 완료 — 메일 확인 안내와 앱 복귀 경로. */
function SignupSuccess({ email }: { email: string }) {
  const [resendState, setResendState] = useState<"idle" | "sending" | "sent">("idle");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  async function handleResend() {
    setResendState("sending");
    try {
      await postJson("/v1/auth/resend-verification", { email });
    } catch {
      // 서버는 계정 존재를 숨기려 항상 성공을 돌려준다. 실패해도 사용자가 할 수 있는
      // 일이 같으므로 같은 안내를 보여준다.
    }
    setResendState("sent");
    setCooldown(RESEND_COOLDOWN);
  }

  return (
    <div className="rounded-[22px] border border-neutral-250 bg-white p-6 shadow-[var(--shadow-card)] sm:p-7">
      <div className="flex items-center gap-2.5">
        <MailCheck size={24} className="shrink-0 text-success" />
        <h2 className="text-lg font-bold text-brand-ink">{signup.successTitle}</h2>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-neutral-800">
        <strong className="font-semibold text-brand-ink">{email}</strong> 으로 인증 메일을
        보냈습니다. {signup.successBody}
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">
        {signup.successHint}
      </p>

      <Button as="a" href={APP_DEEP_LINK} className="mt-6 w-full">
        {signup.backToApp}
        <ArrowRight size={18} />
      </Button>
      <p className="mt-2 text-center text-[12px] leading-relaxed text-neutral-600">
        {signup.backToAppHint}
      </p>

      <div className="mt-6 border-t border-neutral-250 pt-5">
        {resendState === "sent" && cooldown > 0 ? (
          <p className="flex items-center justify-center gap-1.5 text-center text-[13px] text-neutral-600">
            <CheckCircle2 size={15} className="shrink-0 text-success" />
            {signup.resendDone} {signup.resendCooldown(cooldown)}
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={resendState === "sending"}
            className="mx-auto block text-[14px] font-medium text-neutral-800 underline hover:text-brand-coral-dark disabled:cursor-not-allowed disabled:text-neutral-400"
          >
            {resendState === "sending" ? signup.resendSending : signup.resend}
          </button>
        )}
      </div>
    </div>
  );
}

function inputClass(hasError: boolean): string {
  const border = hasError ? "border-error" : "border-neutral-250";
  return `h-12 w-full rounded-xl border ${border} bg-white px-4 text-neutral-950 placeholder:text-neutral-400 focus:border-brand-sky disabled:opacity-60`;
}

function Field({
  id,
  label,
  hint,
  error,
  input,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  input: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-[14px] font-semibold text-brand-ink">
        {label}
        {hint && (
          <span className="ml-2 font-normal text-[13px] text-neutral-600">{hint}</span>
        )}
      </label>
      <div className="mt-2">{input}</div>
      {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 flex items-center gap-1.5 text-[13px] font-medium text-error"
    >
      <AlertCircle size={14} className="shrink-0" />
      {children}
    </p>
  );
}

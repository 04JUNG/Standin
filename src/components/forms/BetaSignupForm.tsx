import { useRef, useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { beta } from "../../data/content";
import type { BetaFormValues, SubmitState } from "../../types/landing";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const initialValues: BetaFormValues = {
  email: "",
  role: "",
  workStatus: "",
  clipStudioEdition: "",
  clipStudioVersion: "",
  mannequinExperience: "",
  source: "",
  consent: false,
};

const allowedSources = new Set<BetaFormValues["source"]>([
  "pd-network",
  "ahart",
  "webtoon-academy",
  "bansa",
  "x",
  "postype",
  "kakao",
  "discord",
  "tumblbug",
  "bipa",
  "pinterest",
  "other",
]);

function readCampaign() {
  if (typeof window === "undefined") {
    return { source: "" as BetaFormValues["source"] };
  }

  const params = new URLSearchParams(window.location.search);
  const requestedSource = params.get("source") ?? params.get("utm_source") ?? "";
  const source = allowedSources.has(requestedSource as BetaFormValues["source"])
    ? (requestedSource as BetaFormValues["source"])
    : "";

  return {
    source,
    utmSource: params.get("utm_source") ?? "",
    utmMedium: params.get("utm_medium") ?? "",
    utmCampaign: params.get("utm_campaign") ?? "",
    utmContent: params.get("utm_content") ?? "",
  };
}

function validate(values: BetaFormValues) {
  const errors: Partial<Record<keyof BetaFormValues, string>> = {};

  if (!emailPattern.test(values.email)) {
    errors.email = "올바른 이메일 주소를 입력해 주세요.";
  }
  if (!values.role) errors.role = "작업 형태를 선택해 주세요.";
  if (!values.workStatus) errors.workStatus = "현재 작업 여부를 선택해 주세요.";
  if (!values.clipStudioEdition) {
    errors.clipStudioEdition = "Clip Studio 제품을 선택해 주세요.";
  }
  if (!values.clipStudioVersion) {
    errors.clipStudioVersion = "Clip Studio 버전을 선택해 주세요.";
  }
  if (!values.mannequinExperience) {
    errors.mannequinExperience = "3D 인형 사용 경험을 선택해 주세요.";
  }
  if (!values.source) errors.source = "알게 된 경로를 선택해 주세요.";
  if (!values.consent) errors.consent = "안내 수신 동의가 필요합니다.";

  return errors;
}

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;
const ENDPOINT = FORMSPREE_ID
  ? `https://formspree.io/f/${FORMSPREE_ID}`
  : undefined;
const HAS_BACKEND = Boolean(ENDPOINT);

export function BetaSignupForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [campaign] = useState(readCampaign);
  const [values, setValues] = useState<BetaFormValues>(() => ({
    ...initialValues,
    source: campaign.source,
  }));
  const [errors, setErrors] = useState<
    Partial<Record<keyof BetaFormValues, string>>
  >({});
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setState("idle");
      window.requestAnimationFrame(() => {
        formRef.current
          ?.querySelector<HTMLElement>("[aria-invalid='true']")
          ?.focus();
      });
      return;
    }

    if (!ENDPOINT) {
      console.info("[데모 폼] 검증 통과 — 실제 수집 endpoint 미연결", values);
      setState("success");
      return;
    }

    try {
      setState("submitting");
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          ...values,
          utm_source: campaign.utmSource,
          utm_medium: campaign.utmMedium,
          utm_campaign: campaign.utmCampaign,
          utm_content: campaign.utmContent,
          _subject: "Standin 클로즈베타 사전등록",
        }),
      });

      if (res.ok) {
        setState("success");
        setValues(initialValues);
      } else {
        const data = await res.json().catch(() => null);
        console.error("[Formspree] 제출 실패", res.status, data);
        setState("error");
      }
    } catch (err) {
      console.error("[Formspree] 네트워크 오류", err);
      setState("error");
    }
  }

  if (state === "success") {
    return (
      <div className="rounded-[22px] border border-white/15 bg-white/10 p-6 text-white">
        <div className="flex items-center gap-2.5">
          <CheckCircle2 size={22} className="text-brand-sky" />
          <p className="text-lg font-semibold">
            {HAS_BACKEND ? "사전등록되었습니다" : "입력이 확인되었습니다"}
          </p>
        </div>
        <p className="mt-2 text-[15px] leading-relaxed text-neutral-250">
          {HAS_BACKEND ? beta.success : beta.demoSuccess}
        </p>
        {!HAS_BACKEND && (
          <p className="mt-4 rounded-lg bg-warning/15 px-3 py-2 text-[13px] leading-relaxed text-white/90">
            {beta.demoNotice}
          </p>
        )}
      </div>
    );
  }

  const submitting = state === "submitting";

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      className="rounded-[22px] border border-white/15 bg-white/[0.07] p-5 backdrop-blur-sm sm:p-6"
    >
      <div>
        <FieldLabel htmlFor="beta-email">{beta.emailLabel}</FieldLabel>
        <input
          id="beta-email"
          type="email"
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          placeholder={beta.emailPlaceholder}
          disabled={submitting}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "beta-email-error" : undefined}
          className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-white/95 px-4 text-brand-ink placeholder:text-neutral-400 focus:border-brand-sky disabled:opacity-60"
        />
        {errors.email && <FieldError id="beta-email-error">{errors.email}</FieldError>}
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <SelectField
          id="beta-role"
          label={beta.roleLabel}
          value={values.role}
          options={beta.roleOptions}
          onChange={(value) =>
            setValues((v) => ({ ...v, role: value as BetaFormValues["role"] }))
          }
          error={errors.role}
          disabled={submitting}
        />
        <SelectField
          id="beta-work-status"
          label={beta.workStatusLabel}
          value={values.workStatus}
          options={beta.workStatusOptions}
          onChange={(value) =>
            setValues((v) => ({
              ...v,
              workStatus: value as BetaFormValues["workStatus"],
            }))
          }
          error={errors.workStatus}
          disabled={submitting}
        />
        <SelectField
          id="beta-clip-studio-edition"
          label={beta.clipStudioEditionLabel}
          value={values.clipStudioEdition}
          options={beta.clipStudioEditionOptions}
          onChange={(value) =>
            setValues((v) => ({
              ...v,
              clipStudioEdition: value as BetaFormValues["clipStudioEdition"],
            }))
          }
          error={errors.clipStudioEdition}
          disabled={submitting}
        />
        <SelectField
          id="beta-clip-studio-version"
          label={beta.clipStudioVersionLabel}
          value={values.clipStudioVersion}
          options={beta.clipStudioVersionOptions}
          onChange={(value) =>
            setValues((v) => ({
              ...v,
              clipStudioVersion: value as BetaFormValues["clipStudioVersion"],
            }))
          }
          error={errors.clipStudioVersion}
          disabled={submitting}
        />
        <SelectField
          id="beta-mannequin"
          label={beta.mannequinExperienceLabel}
          value={values.mannequinExperience}
          options={beta.mannequinExperienceOptions}
          onChange={(value) =>
            setValues((v) => ({
              ...v,
              mannequinExperience: value as BetaFormValues["mannequinExperience"],
            }))
          }
          error={errors.mannequinExperience}
          disabled={submitting}
        />
      </div>

      <div className="mt-4">
        <SelectField
          id="beta-source"
          label={beta.sourceLabel}
          value={values.source}
          options={beta.sourceOptions}
          onChange={(value) =>
            setValues((v) => ({ ...v, source: value as BetaFormValues["source"] }))
          }
          error={errors.source}
          disabled={submitting}
        />
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-2.5 text-[14px] leading-relaxed text-neutral-250">
          <input
            type="checkbox"
            checked={values.consent}
            onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))}
            disabled={submitting}
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

      {state === "error" && (
        <p
          role="alert"
          className="mt-4 flex items-center gap-2 rounded-lg bg-error/15 px-3 py-2 text-[13px] font-medium text-[#ffb4a6]"
        >
          <AlertCircle size={15} className="shrink-0" />
          등록 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
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
            등록 중…
          </>
        ) : (
          <>
            {beta.cta}
            <ArrowRight size={18} />
          </>
        )}
      </button>

      {!HAS_BACKEND && (
        <p className="mt-4 text-center text-[12px] leading-relaxed text-neutral-400">
          {beta.demoNotice}
        </p>
      )}
    </form>
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-[14px] font-semibold text-white">
      {children}
    </label>
  );
}

type SelectFieldProps = {
  id: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  error?: string;
  disabled: boolean;
};

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  error,
  disabled,
}: SelectFieldProps) {
  const errorId = `${id}-error`;

  return (
    <div>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className="mt-2 h-12 w-full rounded-xl border border-white/20 bg-white/95 px-4 text-brand-ink focus:border-brand-sky disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <FieldError id={errorId}>{error}</FieldError>}
    </div>
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

import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  FileImage,
  Gift,
  Loader2,
  Lock,
  MessageCircle,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Container } from "../common/Container";
import {
  artifactQuestions,
  closingQuestions,
  commonQuestions,
  completeQuestions,
  dropoffQuestions,
  usageStages,
  type FeedbackQuestion,
} from "../../data/feedbackSurvey";

type AnswerValue = string | string[];
type SurveyPhase = "journey" | "questions" | "success";
type SubmitState = "idle" | "submitting" | "error";
type SurveyMode = "complete" | "dropoff";

const STORAGE_KEY = "standin-feedback-draft-v1";
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_ARTIFACT_BYTES = 20 * 1024 * 1024;
const ENDPOINT =
  import.meta.env.VITE_FEEDBACK_ENDPOINT ?? import.meta.env.VITE_BETA_ENDPOINT;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isAnswered(value: AnswerValue | undefined) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
}

function readableAnswer(
  question: FeedbackQuestion | undefined,
  value: AnswerValue,
) {
  if (!question?.options) return value;
  const labelOf = (item: string) =>
    question.options?.find((option) => option.value === item)?.label ?? item;
  return Array.isArray(value) ? value.map(labelOf) : labelOf(value);
}

function fileToPayload(file: File, key: string) {
  return new Promise<{ key: string; name: string; type: string; data: string }>(
    (resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("파일을 읽지 못했습니다."));
      reader.onload = () => {
        const result = String(reader.result ?? "");
        resolve({
          key,
          name: file.name,
          type: file.type || "application/octet-stream",
          data: result.includes(",") ? result.split(",")[1] : result,
        });
      };
      reader.readAsDataURL(file);
    },
  );
}

function ChoiceField({
  question,
  value,
  otherText,
  onChange,
  onOtherText,
  onLimit,
}: {
  question: FeedbackQuestion;
  value: AnswerValue | undefined;
  otherText: string;
  onChange: (value: AnswerValue) => void;
  onOtherText: (value: string) => void;
  onLimit: () => void;
}) {
  const multiple = question.type === "multi";
  const validOptionValues = new Set(
    question.options?.map((option) => option.value) ?? [],
  );
  const selected = (Array.isArray(value) ? value : value ? [value] : []).filter(
    (item) => validOptionValues.has(item),
  );

  const otherSelected = Boolean(
    question.otherOptionValue && selected.includes(question.otherOptionValue),
  );

  return (
    <div>
      <div className="grid gap-2.5 sm:grid-cols-2" role={multiple ? "group" : "radiogroup"}>
        {question.options?.map((option, index) => {
          const active = selected.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role={multiple ? "checkbox" : "radio"}
              aria-checked={active}
              onClick={() => {
                if (!multiple) {
                  if (
                    question.otherOptionValue &&
                    option.value !== question.otherOptionValue
                  ) {
                    onOtherText("");
                  }
                  onChange(option.value);
                  return;
                }
                if (active) {
                  if (option.value === question.otherOptionValue) {
                    onOtherText("");
                  }
                  onChange(selected.filter((item) => item !== option.value));
                  return;
                }
                if (
                  question.maxSelections &&
                  selected.length >= question.maxSelections
                ) {
                  onLimit();
                  return;
                }
                onChange([...selected, option.value]);
              }}
              className={`group flex min-h-[58px] items-center gap-3 rounded-[16px] border px-4 py-3 text-left text-[15px] font-semibold leading-snug transition-all sm:text-base ${
                active
                  ? "border-brand-coral bg-brand-coral/8 text-brand-ink shadow-[0_8px_24px_rgba(255,107,87,0.12)]"
                  : "border-neutral-250 bg-white text-neutral-800 hover:-translate-y-0.5 hover:border-brand-coral/50 hover:shadow-card"
              }`}
            >
              <span
                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] border text-xs font-bold ${
                  active
                    ? "border-brand-coral bg-brand-coral text-white"
                    : "border-neutral-250 bg-neutral-100 text-neutral-600 group-hover:border-brand-coral/40"
                }`}
              >
                {active ? <Check size={15} strokeWidth={3} /> : index + 1}
              </span>
              <span className="[word-break:keep-all]">{option.label}</span>
            </button>
          );
        })}
      </div>
      {otherSelected && (
        <textarea
          rows={3}
          autoFocus
          value={otherText}
          onChange={(event) => onOtherText(event.target.value)}
          placeholder={question.otherPlaceholder ?? "직접 입력해 주세요."}
          className="mt-3 w-full resize-y rounded-[16px] border border-brand-coral/50 bg-white px-4 py-3 text-base leading-relaxed text-brand-ink shadow-card placeholder:text-neutral-400 focus:border-brand-coral focus:outline-none"
        />
      )}
    </div>
  );
}

function FileField({
  question,
  file,
  onChange,
}: {
  question: FeedbackQuestion;
  file?: File;
  onChange: (file?: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const acceptsClipFile = question.type === "artifact";

  return (
    <div>
      {file ? (
        <div className="flex items-center gap-4 rounded-[18px] border border-success/35 bg-success/8 p-4">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-white text-success shadow-card">
            <FileImage size={23} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-bold text-brand-ink">{file.name}</p>
            <p className="mt-0.5 text-xs text-neutral-600">
              {(file.size / 1024 / 1024).toFixed(1)}MB · 제출할 때 함께 전송됩니다
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange(undefined)}
            aria-label={`${file.name} 삭제`}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-600 hover:bg-white hover:text-error"
          >
            <X size={19} />
          </button>
        </div>
      ) : (
        <label
          onDragEnter={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = "copy";
            setIsDragging(true);
          }}
          onDragLeave={(event) => {
            if (
              event.relatedTarget instanceof Node &&
              event.currentTarget.contains(event.relatedTarget)
            ) {
              return;
            }
            setIsDragging(false);
          }}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);
            onChange(event.dataTransfer.files?.[0]);
          }}
          className={`group flex min-h-[164px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed px-6 py-8 text-center transition-all ${
            isDragging
              ? "scale-[1.01] border-brand-coral bg-brand-coral/8 shadow-[0_14px_35px_rgba(255,107,87,0.14)]"
              : "border-neutral-250 bg-white hover:border-brand-coral/60 hover:bg-brand-coral/3"
          }`}
        >
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-[14px] bg-brand-coral/10 text-brand-coral-dark transition-transform group-hover:-translate-y-0.5">
            <Upload size={22} />
          </span>
          <span className="mt-3 text-[15px] font-bold text-brand-ink">
            {isDragging
              ? "여기에 놓아주세요"
              : acceptsClipFile
                ? "파일을 선택하거나 끌어놓으세요"
                : "이미지를 선택하거나 끌어놓으세요"}
          </span>
          <span className="mt-1 text-xs text-neutral-600">
            {acceptsClipFile
              ? "PNG, JPG, WEBP, CLIP · 최대 20MB"
              : "JPG, PNG, WEBP · 최대 8MB"}
          </span>
          <input
            className="sr-only"
            type="file"
            accept={
              acceptsClipFile
                ? "image/jpeg,image/png,image/webp,.clip"
                : "image/jpeg,image/png,image/webp"
            }
            onChange={(event) => onChange(event.target.files?.[0])}
            aria-label={question.title}
          />
        </label>
      )}
    </div>
  );
}

function PublicCaseConsent({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2.5 rounded-[14px] border border-neutral-250 bg-white px-3.5 py-2.5 text-left transition-colors hover:border-brand-coral/45">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-brand-coral"
      />
      <span>
        <span className="flex flex-wrap items-center gap-1.5 text-[13px] font-bold leading-relaxed text-brand-ink">
          제출한 자료를 Standin 활용 사례로 소개해도 괜찮습니다.
          <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] text-neutral-600">선택</span>
        </span>
        <span className="mt-0.5 block text-[11px] leading-relaxed text-neutral-600">
          공개 전 사용할 이미지와 표기 방식을 이메일로 다시 확인합니다. 선택 여부는 보상에 영향을 주지 않습니다.
        </span>
      </span>
    </label>
  );
}

function QuestionField({
  question,
  answer,
  otherText,
  files,
  artifactLink,
  publicConsent,
  onAnswer,
  onOtherText,
  onFile,
  onArtifactLink,
  onPublicConsent,
  onLimit,
}: {
  question: FeedbackQuestion;
  answer: AnswerValue | undefined;
  otherText: string;
  files: Record<string, File | undefined>;
  artifactLink: string;
  publicConsent: boolean;
  onAnswer: (value: AnswerValue) => void;
  onOtherText: (value: string) => void;
  onFile: (id: string, file?: File) => void;
  onArtifactLink: (value: string) => void;
  onPublicConsent: (checked: boolean) => void;
  onLimit: () => void;
}) {
  if (question.type === "single" || question.type === "multi") {
    return (
      <ChoiceField
        question={question}
        value={answer}
        otherText={otherText}
        onChange={onAnswer}
        onOtherText={onOtherText}
        onLimit={onLimit}
      />
    );
  }

  if (question.type === "email") {
    return (
      <input
        type="email"
        autoComplete="email"
        value={typeof answer === "string" ? answer : ""}
        onChange={(event) => onAnswer(event.target.value)}
        placeholder={question.placeholder}
        className="h-14 w-full rounded-[16px] border border-neutral-250 bg-white px-4 text-lg text-brand-ink shadow-card placeholder:text-neutral-400 focus:border-brand-coral focus:outline-none"
      />
    );
  }

  if (question.type === "textarea") {
    return (
      <textarea
        rows={6}
        value={typeof answer === "string" ? answer : ""}
        onChange={(event) => onAnswer(event.target.value)}
        placeholder={question.placeholder ?? "자유롭게 적어주세요."}
        className="w-full resize-y rounded-[18px] border border-neutral-250 bg-white px-4 py-3 text-base leading-relaxed text-brand-ink shadow-card placeholder:text-neutral-400 focus:border-brand-coral focus:outline-none"
      />
    );
  }

  if (question.type === "images") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {question.fileSlots?.map((slot) => (
            <div key={slot.id}>
              <p className="mb-2 text-sm font-bold text-brand-ink">{slot.label}</p>
              <FileField
                question={{ ...question, title: slot.label }}
                file={files[slot.id]}
                onChange={(file) => onFile(slot.id, file)}
              />
            </div>
          ))}
        </div>
        {question.publicConsentId && (
          <PublicCaseConsent checked={publicConsent} onChange={onPublicConsent} />
        )}
      </div>
    );
  }

  if (question.type === "artifact") {
    return (
      <div className="space-y-4">
        <FileField
          question={question}
          file={files[question.id]}
          onChange={(file) => onFile(question.id, file)}
        />
        <div className="flex items-center gap-3 text-xs font-semibold text-neutral-400 before:h-px before:flex-1 before:bg-neutral-250 after:h-px after:flex-1 after:bg-neutral-250">
          또는 링크
        </div>
        <input
          type="url"
          value={artifactLink}
          onChange={(event) => onArtifactLink(event.target.value)}
          placeholder="https://"
          className="h-14 w-full rounded-[16px] border border-neutral-250 bg-white px-4 text-base text-brand-ink shadow-card placeholder:text-neutral-400 focus:border-brand-coral focus:outline-none"
        />
        {question.publicConsentId && (
          <PublicCaseConsent checked={publicConsent} onChange={onPublicConsent} />
        )}
      </div>
    );
  }

  return (
    <FileField
      question={question}
      file={files[question.id]}
      onChange={(file) => onFile(question.id, file)}
    />
  );
}

type FeedbackSurveyProps = {
  embedded?: boolean;
};

export function FeedbackSurvey({ embedded = false }: FeedbackSurveyProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const questionSectionRef = useRef<HTMLElement>(null);
  const embeddedScrollRef = useRef<number | null>(null);
  const [phase, setPhase] = useState<SurveyPhase>("journey");
  const [stageValue, setStageValue] = useState("");
  const [surveyMode, setSurveyMode] = useState<SurveyMode>("dropoff");
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [files, setFiles] = useState<Record<string, File | undefined>>({});
  const [artifactLink, setArtifactLink] = useState("");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");

  const stage = usageStages.find((item) => item.value === stageValue);
  const activeMode = surveyMode || stage?.branch || "dropoff";
  const questions = useMemo(() => {
    const branchQuestions =
      activeMode === "complete" ? completeQuestions : dropoffQuestions;
    const withArtifact = activeMode === "complete"
      ? [...branchQuestions, ...artifactQuestions]
      : branchQuestions;
    return [...commonQuestions, ...withArtifact, ...closingQuestions];
  }, [activeMode]);

  const current = questions[questionIndex];
  const progress = questions.length
    ? Math.round(((questionIndex + 1) / questions.length) * 100)
    : 0;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as {
        phase?: SurveyPhase;
        stageValue?: string;
        answers?: Record<string, AnswerValue>;
        artifactLink?: string;
        questionIndex?: number;
        surveyMode?: SurveyMode;
      };
      if (saved.stageValue && usageStages.some((item) => item.value === saved.stageValue)) {
        setStageValue(saved.stageValue);
        setAnswers(saved.answers ?? {});
        setArtifactLink(saved.artifactLink ?? "");
        setQuestionIndex(Math.max(0, saved.questionIndex ?? 0));
        setSurveyMode(saved.surveyMode ?? "dropoff");
        // 랜딩의 Feedback 링크로 다시 들어왔을 때 이전 분기로 바로 보내지 않는다.
        // 답변 초안은 보존하되, 사용자가 경로를 다시 고를 수 있도록 여정 화면에서 시작한다.
        setPhase("journey");
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (phase === "success") return;
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        phase,
        stageValue,
        surveyMode,
        answers,
        artifactLink,
        questionIndex,
      }),
    );
  }, [answers, artifactLink, phase, questionIndex, stageValue, surveyMode]);

  useEffect(() => {
    if (phase !== "questions") return;
    setQuestionIndex((index) => Math.min(index, Math.max(questions.length - 1, 0)));
  }, [phase, questions.length]);

  useLayoutEffect(() => {
    if (!questionSectionRef.current) return;

    if (embedded) {
      if (embeddedScrollRef.current !== null) {
        const root = document.documentElement;
        const previousScrollBehavior = root.style.scrollBehavior;
        root.style.scrollBehavior = "auto";
        window.scrollTo({ top: embeddedScrollRef.current, behavior: "auto" });
        root.style.scrollBehavior = previousScrollBehavior;
        embeddedScrollRef.current = null;
      }
      if (phase === "questions") headingRef.current?.focus({ preventScroll: true });
      return;
    }

    if (phase !== "questions" && phase !== "success") return;

    const sectionTop = questionSectionRef.current.getBoundingClientRect().top + window.scrollY;
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    // 질문 높이가 달라도 같은 기준점에서 즉시 전환해 화면이 위아래로 흔들리지 않게 한다.
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: Math.max(0, sectionTop - 88), behavior: "auto" });
    headingRef.current?.focus({ preventScroll: true });
    root.style.scrollBehavior = previousScrollBehavior;
  }, [embedded, phase, questionIndex]);

  function chooseStage(value: string) {
    const selectedStage = usageStages.find((item) => item.value === value);
    if (embedded) embeddedScrollRef.current = window.scrollY;
    setStageValue(value);
    setSurveyMode(selectedStage?.branch ?? "dropoff");
    setAnswers((previous) => ({ ...previous, q4_usage_stage: value }));
    setQuestionIndex(0);
    setMessage("");
    setPhase("questions");
  }

  function setAnswer(id: string, value: AnswerValue) {
    setAnswers((previous) => ({ ...previous, [id]: value }));
    setMessage("");
  }

  function setFile(id: string, file?: File) {
    const isArtifact = id === "q25_artifact";
    const maxBytes = isArtifact ? MAX_ARTIFACT_BYTES : MAX_FILE_BYTES;
    const isClip = Boolean(file && /\.clip$/i.test(file.name));
    if (file && file.size > maxBytes) {
      setMessage(
        isArtifact
          ? "완성 작업물 파일은 20MB 이하로 올려주세요."
          : "이미지는 8MB 이하로 올려주세요.",
      );
      return;
    }
    if (
      file &&
      !["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
      !(isArtifact && isClip)
    ) {
      setMessage(
        isArtifact
          ? "PNG, JPG, WEBP 또는 CLIP 파일만 첨부할 수 있습니다."
          : "JPG, PNG, WEBP 이미지만 첨부할 수 있습니다.",
      );
      return;
    }
    setFiles((previous) => ({ ...previous, [id]: file }));
    setMessage("");
  }

  function validateCurrent() {
    if (!current) return false;
    if (
      current.type === "images" &&
      current.required &&
      current.fileSlots?.some((slot) => !files[slot.id])
    ) {
      setMessage("사용 화면 2장을 모두 첨부해 주세요.");
      return false;
    }
    if (current.type === "image" && current.required && !files[current.id]) {
      setMessage("이 화면 이미지를 첨부해 주세요.");
      return false;
    }
    if (
      current.type === "artifact" &&
      current.required &&
      !files[current.id] &&
      !artifactLink.trim()
    ) {
      setMessage("작업물 이미지 또는 링크 중 하나를 입력해 주세요.");
      return false;
    }
    if (current.required && !["image", "images", "artifact"].includes(current.type)) {
      const rawValue = answers[current.id];
      const validOptions = new Set(
        current.options?.map((option) => option.value) ?? [],
      );
      const value = current.options
        ? Array.isArray(rawValue)
          ? rawValue.filter((item) => validOptions.has(item))
          : typeof rawValue === "string" && validOptions.has(rawValue)
            ? rawValue
            : ""
        : rawValue;
      if (!isAnswered(value)) {
        setMessage("답변을 선택하거나 입력해 주세요.");
        return false;
      }
      const selectedValues = Array.isArray(value) ? value : [String(value)];
      if (
        current.otherOptionValue &&
        selectedValues.includes(current.otherOptionValue) &&
        !isAnswered(answers[`${current.id}_other`])
      ) {
        setMessage("기타 내용을 직접 입력해 주세요.");
        return false;
      }
      if (current.type === "email" && !emailPattern.test(String(value))) {
        setMessage("올바른 이메일 주소를 입력해 주세요.");
        return false;
      }
    }
    return true;
  }

  async function submit() {
    if (!stage || !ENDPOINT) {
      setSubmitState("error");
      setMessage("설문 수집 주소가 아직 연결되지 않았습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }
    try {
      setSubmitState("submitting");
      setMessage("");
      const uploadPayload = await Promise.all(
        Object.entries(files)
          .filter((entry): entry is [string, File] => Boolean(entry[1]))
          .map(([key, file]) => fileToPayload(file, key)),
      );
      const questionMap = new Map(
        [...questions, ...artifactQuestions].map((question) => [
          question.id,
          question,
        ]),
      );
      const readableAnswers = Object.fromEntries(
        Object.entries(answers).map(([key, value]) => [
          key,
          readableAnswer(questionMap.get(key), value),
        ]),
      );
      const roleQuestion = commonQuestions.find((item) => item.id === "role");
      const productionQuestion = commonQuestions.find(
        (item) => item.id === "production",
      );
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          formType: "feedback",
          branch: stage.branch,
          surveyPath: activeMode,
          usageStage: stage.value,
          usageStageLabel: stage.label,
          email: answers.email,
          role: answers.role,
          roleLabel: readableAnswer(roleQuestion, String(answers.role)),
          production: answers.production,
          productionLabel: readableAnswer(
            productionQuestion,
            String(answers.production),
          ),
          answers: {
            ...readableAnswers,
            q25_artifact_link: artifactLink.trim(),
          },
          files: uploadPayload,
          pageUrl: window.location.href,
          userAgent: navigator.userAgent,
          website: "",
        }),
      });
      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        error?: string;
      } | null;
      if (!response.ok || !data?.ok) throw new Error(data?.error ?? "SUBMIT_FAILED");
      window.localStorage.removeItem(STORAGE_KEY);
      setSubmitState("idle");
      if (embedded) embeddedScrollRef.current = window.scrollY;
      setPhase("success");
    } catch (error) {
      console.error("[피드백 설문] 제출 실패", error);
      setSubmitState("error");
      const code = error instanceof Error ? error.message : "SUBMIT_FAILED";
      const errorMessage = code === "UPLOAD_ERROR"
        ? "첨부 파일을 Google Drive에 저장하지 못했습니다. 저장 폴더 설정과 권한을 확인한 뒤 다시 제출해 주세요."
        : code === "SERVER_ERROR"
          ? "구글 시트에 응답을 저장하지 못했습니다. Apps Script의 시트 연결과 실행 기록을 확인해 주세요."
          : code === "INVALID_INPUT"
            ? "필수 응답 정보가 누락되었습니다. 이전 답변을 확인한 뒤 다시 제출해 주세요."
            : "제출 중 문제가 생겼습니다. 입력은 이 브라우저에 남아 있으니 잠시 후 다시 시도해 주세요.";
      setMessage(errorMessage);
    }
  }

  async function goNext() {
    if (!validateCurrent()) return;
    if (questionIndex >= questions.length - 1) {
      await submit();
      return;
    }
    setQuestionIndex((index) => index + 1);
    setMessage("");
  }

  function goBack() {
    setMessage("");
    if (questionIndex === 0) {
      if (embedded) embeddedScrollRef.current = window.scrollY;
      setPhase("journey");
      return;
    }
    setQuestionIndex((index) => Math.max(0, index - 1));
  }

  if (phase === "success") {
    return (
      <section
        ref={questionSectionRef}
        className={embedded ? "relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-20" : ""}
      >
        {embedded && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(142,216,232,0.18),transparent_34%)]" />}
        <Container wide={embedded}>
        <div className={embedded
          ? "relative mx-auto flex max-w-[1160px] flex-col items-center rounded-[28px] border border-neutral-250 bg-white/85 px-6 py-12 text-center shadow-card sm:px-12 sm:py-16"
          : "mx-auto flex min-h-[calc(100vh-73px)] max-w-2xl flex-col items-center justify-center py-16 text-center"
        }>
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-[22px] bg-success text-white shadow-[0_18px_45px_rgba(46,155,115,0.25)]">
            <CheckCircle2 size={32} />
          </span>
          <p className="eyebrow mt-7">FEEDBACK RECEIVED</p>
          <h1 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-brand-ink sm:text-5xl">
            솔직한 경험을 남겨주셔서 감사합니다.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-neutral-600 sm:text-lg">
            평가 내용은 보상에 영향을 주지 않습니다. 남겨주신 의견은 Standin의 개선 우선순위를 정하는 데 활용하겠습니다.
          </p>
          <div className="mt-8 grid w-full gap-3 text-left sm:grid-cols-3">
            {["설문 및 화면 2장 제출 · 정식 출시 후 1개월 무료 이용", "완성 작업물 제출 · 정식 출시 후 총 3개월 무료 이용", "대상자 인터뷰 완료 · 사례비 10만원"].map((item) => (
              <div key={item} className="rounded-[16px] border border-neutral-250 bg-white p-4 text-sm font-semibold text-brand-ink">
                {item}
              </div>
            ))}
          </div>
          {answers.exit_q10_support === "1:1 오픈채팅으로 도움받고 싶다" && (
            <div className="mt-5 w-full rounded-[20px] border border-brand-coral/35 bg-brand-coral/8 p-5 text-left">
              <div className="flex items-start gap-3">
                <MessageCircle size={21} className="mt-0.5 shrink-0 text-brand-coral-dark" />
                <div>
                  <p className="font-bold text-brand-ink">1:1 오픈채팅에서 도움을 받아보세요.</p>
                  <p className="mt-1 text-sm leading-relaxed text-neutral-600">
                    설치나 사용 중 막힌 부분을 남겨주시면 Standin 제품팀이 확인하겠습니다.
                  </p>
                  <a
                    href="https://open.kakao.com/o/sBq53ELi"
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex items-center gap-2 font-bold text-brand-coral-dark underline decoration-brand-coral/40 underline-offset-4 hover:text-brand-coral"
                  >
                    open.kakao.com/o/sBq53ELi <ArrowRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          )}
          <a href="/" className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-ink px-6 font-bold text-white hover:bg-neutral-950">
            Standin 홈으로 <ArrowRight size={17} />
          </a>
        </div>
        </Container>
      </section>
    );
  }

  if (phase === "journey") {
    return (
      <section ref={questionSectionRef} className={`relative overflow-hidden ${embedded ? "pt-4 pb-12 sm:pt-8 sm:pb-20" : "py-12 sm:py-20"}`}>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(142,216,232,0.18),transparent_34%)]" />
        <Container wide>
          <div className="relative mx-auto max-w-[1160px]">
            {!embedded && (
              <div className="mx-auto max-w-3xl text-center">
                <h1 className="text-4xl font-bold tracking-[-0.055em] text-brand-ink sm:text-6xl">
                  Standin, 어디까지 써보셨나요?
                </h1>
              </div>
            )}

            <div className={`relative grid gap-3 sm:grid-cols-2 ${embedded ? "mt-2" : "mt-10"}`}>
              {usageStages.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => chooseStage(item.value)}
                  className="group relative min-h-[142px] cursor-pointer overflow-hidden rounded-[22px] border border-neutral-250 bg-white p-5 text-left shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-coral/70 hover:bg-brand-coral/[0.035] hover:shadow-[0_22px_50px_rgba(16,23,34,0.14)] focus-visible:-translate-y-1 focus-visible:border-brand-coral focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-brand-coral/45 active:translate-y-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="inline-flex items-center rounded-full bg-brand-coral/10 px-3 py-1 text-xs font-bold text-brand-coral-dark transition-colors group-hover:bg-brand-coral group-hover:text-white">
                      선택하기
                    </span>
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-brand-coral group-hover:text-white">
                      <ArrowRight size={17} />
                    </span>
                  </div>
                  <p className="mt-4 text-lg font-bold tracking-[-0.025em] text-brand-ink">{item.label}</p>
                  <p className="mt-1 text-sm text-neutral-600">{item.note}</p>
                  <span className="absolute bottom-0 left-0 h-1.5 w-0 bg-brand-coral transition-all duration-300 group-hover:w-full group-focus-visible:w-full" />
                </button>
              ))}
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <div className="flex items-center gap-3 rounded-[16px] bg-brand-ink px-4 py-3.5 text-sm text-white">
                <Clock3 size={18} className="shrink-0 text-brand-sky" />
                <span><b>예상 소요 시간</b> · 5~7분</span>
              </div>
              <div className="flex items-center gap-3 rounded-[16px] border border-neutral-250 bg-white px-4 py-3.5 text-sm text-neutral-800">
                <Lock size={18} className="shrink-0 text-brand-coral" />
                <span>제출 자료는 <b>동의 없이 공개하지 않음</b></span>
              </div>
              <div className="flex items-center gap-3 rounded-[16px] border border-neutral-250 bg-white px-4 py-3.5 text-sm text-neutral-800">
                <Gift size={18} className="shrink-0 text-brand-coral" />
                <span>화면 2장 제출 시 <b>정식 출시 후 1개월 무료 이용</b></span>
              </div>
            </div>

            <p className="mt-5 text-center text-xs leading-relaxed text-neutral-600">
              미공개 원고·작품명·개인정보는 가려도 됩니다. 제출 자료는 AI 학습에 사용하지 않으며 별도 동의 없이 공개하지 않습니다.
            </p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      ref={questionSectionRef}
      className={embedded ? "relative overflow-hidden pt-4 pb-12 sm:pt-8 sm:pb-20" : "min-h-[calc(100vh-73px)] py-8 sm:py-12"}
    >
      {embedded && <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(142,216,232,0.18),transparent_34%)]" />}
      <Container wide={embedded}>
        <div className={embedded
          ? "relative mx-auto min-h-[620px] max-w-[1160px] rounded-[28px] border border-neutral-250 bg-white/85 p-5 shadow-card sm:p-9"
          : "mx-auto max-w-[820px]"
        }>
          <div className={embedded ? "mx-auto max-w-[820px]" : ""}>
          <div className={embedded ? "pb-5 pt-1" : "sticky top-0 z-10 -mx-2 bg-brand-paper/92 px-2 pb-5 pt-1 backdrop-blur-md"}>
            <div className="flex items-center justify-between gap-4 text-xs font-bold text-neutral-600">
              <span>Standin 피드백</span>
              <span>{questionIndex + 1} / {questions.length} · {progress}%</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-neutral-250/80">
              <div className="h-full rounded-full bg-brand-coral transition-[width] duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>

          <div className="py-7 sm:py-12">
            <p className="eyebrow">{current.eyebrow}</p>
            <h1
              ref={headingRef}
              tabIndex={-1}
              className="mt-3 max-w-3xl [text-wrap:balance] [word-break:keep-all] text-3xl font-bold leading-[1.2] tracking-[-0.045em] text-brand-ink outline-none sm:text-[42px]"
            >
              {current.title}
            </h1>
            {current.description && (
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-neutral-600 sm:text-base">{current.description}</p>
            )}
            {current.type === "multi" && current.maxSelections && (
              <p className="mt-3 inline-flex rounded-full bg-brand-sky/20 px-3 py-1 text-xs font-bold text-brand-ink">최대 {current.maxSelections}개 선택</p>
            )}

            <div className="mt-8">
              <QuestionField
                question={current}
                answer={answers[current.id]}
                otherText={String(answers[`${current.id}_other`] ?? "")}
                files={files}
                artifactLink={artifactLink}
                publicConsent={Boolean(
                  current.publicConsentId && answers[current.publicConsentId],
                )}
                onAnswer={(value) => setAnswer(current.id, value)}
                onOtherText={(value) =>
                  setAnswer(`${current.id}_other`, value)
                }
                onFile={setFile}
                onArtifactLink={(value) => {
                  setArtifactLink(value);
                  setMessage("");
                }}
                onPublicConsent={(checked) => {
                  if (!current.publicConsentId) return;
                  setAnswer(
                    current.publicConsentId,
                    checked ? "동의함" : "",
                  );
                }}
                onLimit={() => setMessage(`최대 ${current.maxSelections}개까지 선택할 수 있습니다.`)}
              />
            </div>

            {message && (
              <div role="alert" className="mt-5 flex items-start gap-2 rounded-[14px] bg-error/8 px-4 py-3 text-sm font-semibold text-error">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                {message}
              </div>
            )}

            {stage?.branch === "dropoff" && current.id === "exit_q10_support" && (
              <div className="mt-5 flex items-start gap-3 rounded-[16px] border border-brand-sky/50 bg-brand-sky/12 p-4 text-sm leading-relaxed text-brand-ink">
                <MessageCircle size={19} className="mt-0.5 shrink-0" />
                설치 지원을 원하면 베타 안내를 받은 1:1 오픈채팅에 오류 화면과 함께 “설치 도움”이라고 남겨주세요.
              </div>
            )}

            <div className="mt-8 flex items-center justify-between gap-3 border-t border-neutral-250 pt-6">
              <button
                type="button"
                onClick={goBack}
                disabled={submitState === "submitting"}
                className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-bold text-neutral-600 hover:bg-white hover:text-brand-ink disabled:opacity-50"
              >
                <ArrowLeft size={18} /> 이전
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={submitState === "submitting"}
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-coral px-6 font-bold text-white shadow-[0_10px_24px_rgba(255,107,87,0.22)] transition-all hover:-translate-y-0.5 hover:bg-brand-coral-dark disabled:translate-y-0 disabled:opacity-60"
              >
                {submitState === "submitting" ? (
                  <><Loader2 size={18} className="animate-spin" /> 제출 중</>
                ) : questionIndex === questions.length - 1 ? (
                  <>피드백 제출 <Check size={18} /></>
                ) : (
                  <>다음 <ArrowRight size={18} /></>
                )}
              </button>
            </div>
            <p className="mt-4 text-center text-xs text-neutral-400">입력 내용은 이 브라우저에 임시 저장됩니다. 첨부 파일은 새로고침 후 다시 선택해 주세요.</p>
          </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

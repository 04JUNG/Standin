import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2 } from "lucide-react";
import { Container } from "../common/Container";
import { getQuestions, SURVEY_VERSION, usageStages, type SurveyMode } from "../../data/feedbackSurvey";

const ENDPOINT = import.meta.env.VITE_FEEDBACK_ENDPOINT?.trim();
const STORAGE_KEY = `standin-feedback-${SURVEY_VERSION}`;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
type Draft = { mode: SurveyMode | ""; answers: Record<string, string>; email: string; reward: boolean; consent: boolean; requestId: string };
const emptyDraft = (): Draft => ({ mode: "", answers: {}, email: "", reward: false, consent: false, requestId: crypto.randomUUID() });
function readDraft(): Draft {
  const empty = emptyDraft();
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    if (!raw || !["complete", "dropoff", ""].includes(raw.mode)) return empty;
    return { ...empty, mode: raw.mode, answers: Object.fromEntries(Object.entries(raw.answers ?? {}).filter((entry) => typeof entry[1] === "string")) as Record<string, string>,
      email: typeof raw.email === "string" ? raw.email : "", reward: raw.reward === true, consent: false,
      requestId: typeof raw.requestId === "string" && /^[\w-]{36}$/.test(raw.requestId) ? raw.requestId : empty.requestId };
  } catch { return empty; }
}
function filePayload(file: File) {
  return new Promise<{ name: string; type: string; data: string }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("FILE_READ"));
    reader.onload = () => resolve({ name: file.name, type: file.type, data: String(reader.result).split(",")[1] });
    reader.readAsDataURL(file);
  });
}

export function FeedbackSurvey() {
  const [draft, setDraft] = useState<Draft>(readDraft);
  const [index, setIndex] = useState(-1);
  const [files, setFiles] = useState<File[]>([]);
  const [message, setMessage] = useState("");
  const [rewardAccepted, setRewardAccepted] = useState(false);
  const [state, setState] = useState<"idle" | "submitting" | "success">("idle");
  const submitting = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const questions = getQuestions(draft.mode || "dropoff");
  const question = questions[index];
  const isLast = index >= questions.length;
  useEffect(() => {
    try { if (state !== "success") localStorage.setItem(STORAGE_KEY, JSON.stringify(draft)); } catch { /* Private mode can disable storage. */ }
  }, [draft, state]);
  useEffect(() => { if (index >= 0) heading.current?.focus(); }, [index]);
  function update(change: Partial<Draft>) { setDraft((previous) => ({ ...previous, ...change })); setMessage(""); }
  function selectFiles(selected: FileList | null) {
    const next = Array.from(selected ?? []);
    if (next.length > 2 || next.some((file) => file.size > MAX_FILE_BYTES || !["image/png", "image/jpeg", "image/webp"].includes(file.type))) {
      setMessage("PNG·JPG·WEBP 이미지를 최대 2장, 한 장당 4MB 이하로 첨부해 주세요."); return;
    }
    setFiles(next); setMessage("");
  }
  function missingAnswer() {
    return questions.findIndex((item) => {
      const answer = draft.answers[item.id]?.trim();
      return (item.required && !answer) || (answer && item.options && !item.options.includes(answer));
    });
  }
  async function submit() {
    if (submitting.current) return;
    if (!ENDPOINT) { setMessage("설문 접수를 준비하고 있습니다. 잠시 후 다시 방문해 주세요."); return; }
    const missing = missingAnswer();
    if (missing >= 0) { setIndex(missing); setMessage("이 질문의 답변을 확인해 주세요."); return; }
    if (!draft.consent) { setMessage("설문 응답 수집·이용 안내를 확인해 주세요."); return; }
    if (draft.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email.trim())) { setMessage("이메일 주소를 확인해 주세요."); return; }
    if (draft.reward && (!draft.email.trim() || !files.length)) { setMessage("이벤트 응모에는 이메일과 사용 화면 1장 이상이 필요합니다."); return; }
    submitting.current = true; setState("submitting"); setMessage("");
    try {
      const attachments = await Promise.all(files.map(filePayload));
      const response = await fetch(ENDPOINT, {
        method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({ formType: "open-beta-feedback", surveyVersion: SURVEY_VERSION, requestId: draft.requestId,
          mode: draft.mode, answers: Object.fromEntries(questions.map((item) => [item.id, draft.answers[item.id]?.trim() ?? ""])),
          email: draft.email.trim(), reward: draft.reward, consent: draft.consent, files: attachments, website: "" }),
        signal: AbortSignal.timeout(60000),
      });
      const data = await response.json();
      if (!response.ok || data?.ok !== true) throw new Error(data?.error ?? "SUBMIT_FAILED");
      setRewardAccepted(data.rewardAccepted === true);
      try { localStorage.removeItem(STORAGE_KEY); } catch { /* Success must not depend on browser storage. */ }
      setState("success");
    } catch {
      setState("idle");
      setMessage("제출을 확인하지 못했습니다. 입력 내용은 유지됩니다. 잠시 후 다시 제출해 주세요. 계속 실패하면 standin.asm@gmail.com으로 문의해 주세요.");
    } finally { submitting.current = false; }
  }
  if (state === "success") return <Container><div className="mx-auto max-w-2xl py-20 text-center">
    <h1 className="text-3xl font-bold">피드백을 보내주셔서 감사합니다.</h1>
    <p className="mt-5 text-neutral-600">응답이 저장되었습니다. 보내주신 경험을 제품 개선에 참고하겠습니다.</p>
    {rewardAccepted && <p className="mt-4">이벤트 응모도 접수되었습니다. 선정·당첨 일정은 홈페이지에서 안내합니다.</p>}
    {draft.reward && !rewardAccepted && <p className="mt-4">이벤트 기간 외 제출로, 제품 피드백만 접수되었습니다.</p>}
    <a href="/#beta" className="mt-8 inline-flex min-h-12 items-center rounded-full bg-brand-ink px-6 font-bold text-white">다운로드 안내로 돌아가기</a>
  </div></Container>;

  return <Container><section className="mx-auto max-w-3xl py-12 sm:py-20">
    {!ENDPOINT && <p role="status" className="mb-6 rounded-xl border border-neutral-250 bg-white p-4">설문 접수를 준비하고 있습니다. 현재는 응답이 전송되지 않습니다.</p>}
    {index < 0 ? <>
      <p className="eyebrow">OPEN BETA FEEDBACK</p>
      <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Standin, 어디까지 써보셨나요?</h1>
      <p className="mt-5 leading-relaxed text-neutral-600">완료하지 못한 경험도 도움이 됩니다. 사용 경험에 따라 필요한 질문만 보여드려요.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">{usageStages.map((stage) => <button key={stage.value} type="button" onClick={() => { update({ mode: stage.value }); setIndex(0); }} className="rounded-2xl border border-neutral-250 bg-white p-6 text-left hover:border-brand-coral">
        <span className="block text-lg font-bold">{stage.label}</span><span className="mt-3 block text-sm text-neutral-600">{stage.note}</span>
      </button>)}</div>
      <div className="mt-8 rounded-2xl bg-brand-ink p-6 text-white">
        <h2 className="font-bold">사용 후기 이벤트 · 2026.10.21–11.11</h2>
        <p className="mt-3 text-sm leading-relaxed">설문과 사용 화면을 제출하고 응모한 분 중 추첨 5명 + 정성 후기 5명, 총 10명에게 배달의민족 모바일 상품권 1만원권을 드립니다. 응모는 선택입니다.</p>
        <p className="mt-3 text-sm text-neutral-250">오픈베타 참여자 전원의 정식 출시 후 1개월 무료 이용 혜택은 설문·이벤트 참여 여부와 관계없습니다.</p>
      </div>
    </> : <>
      <div className="mb-8 text-sm text-neutral-600" aria-live="polite">{Math.min(index + 1, questions.length + 1)} / {questions.length + 1} · {isLast ? "첨부 및 제출" : "사용 경험"}</div>
      <h1 ref={heading} tabIndex={-1} id="survey-question" className="text-2xl font-bold leading-snug outline-none sm:text-3xl">{isLast ? "마지막으로, 사용 화면과 참여 여부를 확인해 주세요." : question.title}</h1>
      <fieldset disabled={state === "submitting"} className="mt-6">
        <legend className="sr-only">{isLast ? "첨부 및 동의" : question.title}</legend>
        {isLast ? <div className="space-y-6">
          <label className="block font-semibold">사용 화면 첨부 (선택)
            <span className="mt-2 block text-sm font-normal leading-relaxed text-neutral-600">미공개 원고·작품명·개인정보는 가려주세요. PNG·JPG·WEBP 최대 2장, 각 4MB. 첨부 없이도 설문을 제출할 수 있습니다.</span>
            <input className="mt-3 block w-full text-sm" type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={(event) => selectFiles(event.target.files)} />
          </label>
          {files.length > 0 && <div className="text-sm"><p className="break-all">{files.map((file) => file.name).join(", ")}</p><button type="button" className="mt-2 underline" onClick={() => setFiles([])}>첨부 해제</button></div>}
          <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-brand-coral" checked={draft.reward} onChange={(event) => update({ reward: event.target.checked })} /><span>사용 후기 이벤트에 응모합니다. (선택)<small className="mt-1 block text-neutral-600">이메일과 사용 화면 1장 이상이 필요합니다. 발표 일정은 홈페이지에서 안내합니다.</small></span></label>
          <label className="block font-semibold">이메일 {draft.reward ? "(이벤트 응모 시 필수)" : "(선택)"}
            <input type="email" autoComplete="email" maxLength={254} className="mt-2 min-h-12 w-full rounded-xl border border-neutral-250 bg-white px-4 font-normal" value={draft.email} onChange={(event) => update({ email: event.target.value })} placeholder="artist@example.com" />
            <small className="mt-2 block font-normal text-neutral-600">답변 확인·이벤트 안내에만 사용합니다. 제품 소식 수신에 자동 동의되지 않습니다.</small>
          </label>
          <div className="rounded-xl bg-white p-5 text-sm leading-relaxed">
            <p>Standin 팀은 제품 개선 및 선택한 이벤트 운영을 위해 설문 응답, 선택한 이메일·첨부 이미지를 수집합니다. 제출일부터 90일 보관 후 일일 삭제 작업으로 정리하며, 별도 허락 없이 자료를 공개하거나 AI 학습에 사용하지 않습니다.</p>
            <p className="mt-3">동의를 거부하면 설문을 제출할 수 있으나 앱 이용에는 영향이 없습니다. 삭제 문의: <a href="mailto:standin.asm@gmail.com" className="underline">standin.asm@gmail.com</a>. <a href="/legal/privacy/" className="underline">개인정보처리방침</a></p>
          </div>
          <label className="flex items-start gap-3"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-brand-coral" checked={draft.consent} onChange={(event) => update({ consent: event.target.checked })} /><span>위 설문 응답 수집·이용에 동의합니다. (필수)</span></label>
        </div> : <>
          {question.hint && <p className="mb-4 text-sm leading-relaxed text-neutral-600">{question.hint}</p>}
          {question.type === "text" ? <textarea aria-labelledby="survey-question" rows={5} maxLength={2000} value={draft.answers[question.id] ?? ""} onChange={(event) => update({ answers: { ...draft.answers, [question.id]: event.target.value } })} className="w-full rounded-2xl border border-neutral-250 bg-white p-4" /> :
            <div className="grid gap-3">{question.options?.map((option) => <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4 ${draft.answers[question.id] === option ? "border-brand-coral" : "border-neutral-250"}`}>
              <input type="radio" name={question.id} value={option} checked={draft.answers[question.id] === option} onChange={() => update({ answers: { ...draft.answers, [question.id]: option } })} className="h-5 w-5 shrink-0 accent-brand-coral" /><span>{option}</span>
            </label>)}</div>}
        </>}
      </fieldset>
      {message && <p role="alert" className="mt-5 text-sm font-semibold text-error">{message}</p>}
      <div className="mt-8 flex justify-between gap-4 border-t border-neutral-250 pt-6">
        <button type="button" disabled={state === "submitting"} onClick={() => { setIndex(index - 1); setMessage(""); }} className="inline-flex min-h-12 items-center gap-2 rounded-full px-4 font-bold"><ArrowLeft size={18} />이전</button>
        <button type="button" disabled={state === "submitting" || (isLast && !ENDPOINT)} onClick={() => {
          if (isLast) { void submit(); return; }
          if (question.required && !draft.answers[question.id]) { setMessage("답변을 선택해 주세요."); return; }
          setIndex(index + 1); setMessage("");
        }} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-coral px-6 font-bold text-brand-ink disabled:opacity-50">
          {state === "submitting" ? <><Loader2 className="animate-spin" size={18} />제출 중</> : isLast ? <>설문 제출<Check size={18} /></> : <>다음<ArrowRight size={18} /></>}
        </button>
      </div>
      <p className="mt-5 text-xs leading-relaxed text-neutral-600">응답은 이 브라우저에 임시 저장됩니다. 새로고침하면 첨부 이미지는 다시 선택해 주세요.</p>
    </>}
  </section></Container>;
}

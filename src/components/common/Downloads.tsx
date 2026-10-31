import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { fallbackRelease, parseRelease, RELEASES_API, type PublicRelease } from "../../lib/releases";
import { measurement } from "../../lib/measurement-client";
import { campaignUrl } from "../../lib/measurement";
import { appCampaignLink, campaignCreative, supportsAcquisition, type Creative } from "../../lib/acquisition";

export function Downloads() {
  const [release, setRelease] = useState<PublicRelease>(fallbackRelease);
  const [latestChecked, setLatestChecked] = useState(false);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [pcUrl, setPcUrl] = useState("");
  const [appLink, setAppLink] = useState<string | null>(null);
  const [creative, setCreative] = useState<Creative | null>(null);
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => {
    setAppLink(appCampaignLink(window.location.href));
    setCreative(campaignCreative(window.location.href));
    setClientReady(true);
  }, []);
  const campaignAssets = creative ? release.campaignAssets?.[creative] : undefined;
  const automaticSource = Boolean(campaignAssets?.length);
  const downloadAssets = campaignAssets ?? release.assets;
  // Resolve an ad's package before exposing a neutral download during hydration/API loading.
  const downloadsReady = clientReady && (!creative || latestChecked || failed);
  async function copyPcLink() {
    const url = campaignUrl(window.location.href, true);
    setPcUrl(url);
    try {
      await navigator.clipboard.writeText(url);
      setCopyStatus("copied");
      measurement.pcLinkCopy();
    } catch { setCopyStatus("error"); }
  }
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let active = true;
    fetch(RELEASES_API, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((response) => { if (!response.ok) throw new Error("RELEASE_UNAVAILABLE"); return response.json(); })
      .then(parseRelease)
      .then((value) => { if (active) { setRelease(value); setLatestChecked(true); } })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, [attempt]);
  return <div className="rounded-[26px] border border-neutral-250 bg-white p-6 text-brand-ink sm:p-8">
    <p className="eyebrow">DOWNLOAD</p>
    <h3 className="mt-3 text-2xl font-bold">Standin 다운로드</h3>
    <p className="mt-3 text-sm leading-relaxed text-neutral-600">컴퓨터의 운영체제에 맞는 설치 파일을 선택하세요.</p>
    <div className="mt-4 rounded-xl bg-neutral-100 p-4 text-sm leading-relaxed">
      <p>Windows·macOS용 프로그램입니다. 모바일에서 보고 있다면 링크를 복사해 PC에서 열어주세요.</p>
      <button type="button" onClick={copyPcLink} className="mt-2 min-h-11 font-semibold underline underline-offset-4">PC에서 열 링크 복사</button>
      <p role="status">{copyStatus === "copied" ? "링크를 복사했습니다. PC에서 열어 설치해 주세요." : copyStatus === "error" ? "자동 복사가 지원되지 않습니다. 아래 주소를 복사해 주세요." : ""}</p>
      {copyStatus === "error" && <input aria-label="PC에서 열 다운로드 주소" value={pcUrl} readOnly onFocus={(event) => event.currentTarget.select()} className="mt-2 min-h-11 w-full rounded border border-neutral-250 bg-white px-2" />}
    </div>
    <div className="mt-6 space-y-3" aria-live="polite">
        <p className="text-sm font-semibold">{latestChecked ? "최신 공개 버전" : "공개 버전"} · {release.tag}</p>
        {!downloadsReady && <p role="status" className="text-sm text-neutral-600">설치 파일을 확인하고 있습니다…</p>}
        {downloadsReady && downloadAssets.map((asset) => <a key={asset.name} href={asset.url} onClick={() => measurement.download(asset.name)} className="flex min-h-14 items-center justify-between gap-3 rounded-xl bg-brand-coral px-4 py-3 font-bold text-brand-ink hover:bg-brand-coral-dark">
          <span>{asset.label} 다운로드<span className="mt-1 block text-xs font-normal">{asset.size ? `${(asset.size / 1_000_000).toFixed(1)} MB` : "설치 파일"}</span></span>
          <Download size={20} aria-hidden="true" />
        </a>)}
        <noscript><p>아래 일반 설치 파일로 사용할 수 있습니다.</p>{fallbackRelease.assets.map(asset => <p key={asset.name}><a href={asset.url}>{asset.label} 다운로드</a></p>)}</noscript>
    </div>
    {automaticSource && <p className="mt-4 text-sm leading-relaxed text-neutral-600">받은 파일을 설치하고 Standin을 실행하세요. 별도로 ‘앱 열기’를 누르지 않아도 새 설치의 소재별 첫 실행·첫 이미지 분석 성공 건수가 집계됩니다. 설치 파일에는 포스터·영상 공통 구분만 포함하며, 설치별 이용 이력 연결은 선택 동의에 따릅니다. <a href="/legal/measurement/#campaign-counts" className="underline">측정 안내</a></p>}
    {appLink && latestChecked && supportsAcquisition(release.tag) && <div className="mt-5 rounded-xl border border-neutral-250 p-4 text-sm leading-relaxed">
      <p className="font-semibold">{automaticSource ? '이미 설치한 앱을 열고 싶다면' : '설치를 마쳤나요?'}</p>
      <a href={appLink} className="mt-2 inline-flex min-h-12 items-center rounded-xl bg-brand-ink px-4 font-bold text-white">{automaticSource ? '이미 설치한 앱 열기 (선택)' : '설치했어요 — 앱 열기'}</a>
      {!automaticSource && <p className="mt-2 text-neutral-600">현재 제공하는 일반 설치 파일은 광고 구분을 포함하지 않습니다. 최신 버전을 설치한 PC에서 위 링크를 눌러주세요. v0.2.7부터 새 등록 앱의 소재별 첫 실행·첫 이미지 분석 성공 건수를 선택 동의와 별도로 집계하며, 설치·작업 식별자는 이 건수 집계에 보내지 않습니다.</p>}
      <p className="mt-2 text-neutral-600">앱이 열리지 않으면 설치한 Standin을 직접 실행하세요. <a href="/legal/measurement/#campaign-counts" className="underline">소재별 건수·선택 연결 안내</a></p>
    </div>}
    {failed && <div className="mt-4 flex flex-wrap items-center gap-4">
      <p className="w-full text-sm text-neutral-600">최신 버전 확인이 지연되고 있습니다. 위 버튼으로 확인된 공개 버전을 받을 수 있습니다.</p>
      <button type="button" onClick={() => { setFailed(false); setAttempt((value) => value + 1); }} className="min-h-11 rounded-xl border border-neutral-250 px-4 text-sm font-semibold">설치 파일 다시 불러오기</button>
      <a href="mailto:standin.asm@gmail.com" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">다운로드 문의</a>
    </div>}
    <div className="mt-6 border-t border-neutral-250 pt-5 text-sm leading-relaxed">
      <a href="/guides/clip-studio-pose-import/" className="font-semibold underline underline-offset-4">설치 후 Clip Studio에 적용하는 방법</a>
      <p className="mt-3">사용 중 막힌 점이나 활용한 경험을 알려주세요.</p>
      <a href="/feedback/" className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-ink px-5 font-bold text-white">오픈베타 설문 작성</a>
    </div>
  </div>;
}

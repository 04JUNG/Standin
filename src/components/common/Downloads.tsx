import { useEffect, useState } from "react";
import { Download, ExternalLink } from "lucide-react";
import { parseRelease, RELEASES_API, RELEASES_URL, type PublicRelease } from "../../lib/releases";

export function Downloads() {
  const [release, setRelease] = useState<PublicRelease | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 12000);
    let active = true;
    fetch(RELEASES_API, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } })
      .then((response) => { if (!response.ok) throw new Error("RELEASE_UNAVAILABLE"); return response.json(); })
      .then(parseRelease)
      .then((value) => { if (active) setRelease(value); })
      .catch(() => { if (active) setFailed(true); })
      .finally(() => window.clearTimeout(timeout));
    return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
  }, []);
  return <div className="rounded-[26px] border border-neutral-250 bg-white p-6 text-brand-ink sm:p-8">
    <p className="eyebrow">DOWNLOAD</p>
    <h3 className="mt-3 text-2xl font-bold">Standin 다운로드</h3>
    <p className="mt-3 text-sm leading-relaxed text-neutral-600">컴퓨터의 운영체제에 맞는 설치 파일을 선택하세요.</p>
    <div className="mt-6 space-y-3" aria-live="polite">
      {release ? <>
        <p className="text-sm font-semibold">최신 공개 버전 · {release.tag}</p>
        {release.assets.map((asset) => <a key={asset.name} href={asset.url} className="flex min-h-14 items-center justify-between gap-3 rounded-xl bg-brand-coral px-4 py-3 font-bold text-brand-ink hover:bg-brand-coral-dark">
          <span>{asset.label}<span className="mt-1 block text-xs font-normal">{asset.size ? `${(asset.size / 1_000_000).toFixed(1)} MB` : "설치 파일"}</span></span>
          <Download size={20} aria-hidden="true" />
        </a>)}
      </> : <p className="text-sm text-neutral-600">{failed ? "설치 파일 목록을 불러오지 못했습니다. 아래 GitHub 다운로드 페이지에서 받을 수 있습니다." : "최신 설치 파일을 확인하고 있습니다."}</p>}
    </div>
    <a href={RELEASES_URL} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">GitHub 다운로드 페이지 <ExternalLink size={15} aria-hidden="true" /></a>
    <div className="mt-6 border-t border-neutral-250 pt-5 text-sm leading-relaxed">
      <a href="/guides/clip-studio-pose-import/" className="font-semibold underline underline-offset-4">설치 후 Clip Studio에 적용하는 방법</a>
      <p className="mt-3">사용 중 막힌 점이나 활용한 경험을 알려주세요.</p>
      <a href="/feedback/" className="mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-brand-ink px-5 font-bold text-white">오픈베타 설문 작성</a>
    </div>
  </div>;
}

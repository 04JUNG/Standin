import { useState } from "react";
import { Container } from "../common/Container";
import { DownloadButtons } from "../download/DownloadButtons";
import { ReleaseMeta } from "../download/ReleaseMeta";
import { InstallNotes } from "../download/InstallNotes";
import { useLatestRelease } from "../../hooks/useLatestRelease";
import { detectPlatform } from "../../lib/platform";
import { download } from "../../data/content";

export function DownloadSection() {
  // 릴리스 조회는 이 섹션에서 한 번만 한다. 헤더·히어로·스티키 CTA는 모두
  // #download 앵커라 훅이 필요 없고, 그래서 중복 요청이 생기지 않는다.
  const { release, state } = useLatestRelease();
  // CSR 전용이라 첫 렌더에 navigator가 이미 있다. lazy initializer로 첫 페인트에
  // 확정해 두면 추천 배지가 나중에 끼어들며 레이아웃을 밀지 않는다.
  const [platform] = useState(detectPlatform);

  return (
    <section id="download" className="bg-brand-ink py-20 sm:py-28 lg:py-32">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold tracking-[0.12em] text-brand-coral uppercase">
            {download.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl leading-tight font-bold tracking-tight text-white sm:text-4xl">
            {download.title}
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-neutral-250">
            {download.body}
          </p>
          <span className="mt-6 inline-flex items-center rounded-full border border-brand-coral/40 bg-brand-coral/15 px-3 py-1 text-[13px] font-semibold text-white">
            {download.badge}
          </span>
        </div>

        <div className="mt-12">
          <DownloadButtons release={release} platform={platform} />
          <ReleaseMeta release={release} state={state} />
        </div>

        <InstallNotes />

        <p className="mx-auto mt-8 max-w-[900px] text-center text-sm leading-relaxed text-neutral-400">
          {download.betaNotice}
        </p>
      </Container>
    </section>
  );
}

import { ExternalLink } from "lucide-react";
import { formatReleaseDate } from "../../lib/format";
import { download } from "../../data/content";
import { RELEASES_PAGE, type ReleaseInfo } from "../../data/download";
import type { ReleaseState } from "../../hooks/useLatestRelease";

type ReleaseMetaProps = {
  release: ReleaseInfo;
  state: ReleaseState;
};

export function ReleaseMeta({ release, state }: ReleaseMetaProps) {
  const released = formatReleaseDate(release.publishedAt);

  return (
    <div className="mt-8 flex flex-col items-center gap-2">
      <p className="text-sm text-neutral-400">
        <span>버전 {release.version}</span>
        <span aria-hidden="true"> · </span>
        {state === "loading" ? (
          <span>{download.checkingVersion}</span>
        ) : (
          released && (
            <span>
              {released} {download.releasedSuffix}
            </span>
          )
        )}
      </p>

      {/* 최신 정보가 아님을 감추지 않는다 — 화면과 실제 상태가 어긋나면 안 된다. */}
      {state === "stale" && (
        <p className="max-w-md text-center text-[13px] text-neutral-400">
          {download.staleNotice}
        </p>
      )}

      <a
        href={RELEASES_PAGE}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm font-medium text-brand-sky underline-offset-4 hover:underline"
      >
        {download.allReleases}
        <ExternalLink size={14} aria-hidden="true" />
        <span className="sr-only">(새 창에서 열림)</span>
      </a>
    </div>
  );
}

import { Apple, Download, Monitor } from "lucide-react";
import { Button } from "../common/Button";
import { formatBytes } from "../../lib/format";
import { download } from "../../data/content";
import type { ReleaseAsset, ReleaseInfo } from "../../data/download";
import type { DesktopPlatform } from "../../lib/platform";

type OsKey = "windows" | "mac";

type DownloadButtonsProps = {
  release: ReleaseInfo;
  platform: DesktopPlatform;
};

const meta: Record<
  OsKey,
  { label: string; ext: string; note: string; icon: typeof Download }
> = {
  windows: {
    label: download.windowsLabel,
    ext: ".exe",
    note: download.windowsInlineNote,
    icon: Monitor,
  },
  mac: {
    label: download.macLabel,
    ext: ".dmg",
    note: download.macInlineNote,
    icon: Apple,
  },
};

export function DownloadButtons({ release, platform }: DownloadButtonsProps) {
  // 추천 OS를 먼저 보여주되 두 버튼을 모두 노출한다.
  // 감지가 틀려도 원하는 파일을 받지 못하는 사람이 없어야 한다.
  const order: OsKey[] =
    platform === "mac" ? ["mac", "windows"] : ["windows", "mac"];

  return (
    <div>
      <div className="mx-auto grid max-w-[720px] gap-4 sm:grid-cols-2">
        {order.map((os) => (
          <OsButton
            key={os}
            os={os}
            asset={release[os]}
            version={release.version}
            recommended={platform === os}
          />
        ))}
      </div>

      {(platform === "unknown" || platform === "mobile") && (
        <p className="mt-5 text-center text-sm text-neutral-400">
          {platform === "mobile"
            ? download.mobileNote
            : download.otherOsNote}
        </p>
      )}
    </div>
  );
}

type OsButtonProps = {
  os: OsKey;
  asset: ReleaseAsset;
  version: string;
  recommended: boolean;
};

function OsButton({ os, asset, version, recommended }: OsButtonProps) {
  const { label, ext, note, icon: Icon } = meta[os];
  const size = formatBytes(asset.sizeBytes);

  return (
    <div className="flex flex-col items-center">
      {/* 배지가 없는 버튼과 높이를 맞춰 레이아웃이 흔들리지 않게 한다. */}
      <div className="flex min-h-[30px] items-center">
        {recommended && (
          <span className="rounded-full border border-brand-sky/50 bg-brand-sky/20 px-3 py-1 text-[13px] font-semibold text-white">
            {download.recommendedBadge}
          </span>
        )}
      </div>

      <Button
        as="a"
        href={asset.url}
        size="lg"
        variant={recommended ? "primary" : "secondary-dark"}
        className="mt-2 w-full"
      >
        <Icon size={18} aria-hidden="true" />
        {label}
        <span className="sr-only">
          {` — 버전 ${version}${size ? `, ${size}` : ""}`}
        </span>
      </Button>

      <p className="mt-2 text-[13px] text-neutral-400">
        {ext}
        {size ? ` · ${size}` : ""}
      </p>
      <p className="mt-1 max-w-[280px] text-center text-[13px] leading-relaxed text-neutral-400">
        {note}
      </p>
    </div>
  );
}

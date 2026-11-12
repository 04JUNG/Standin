import "./styles/supporters-download.css";
import { parseRelease, RELEASES_API, type DownloadAsset } from "./lib/releases";

const pageUrl = "https://www.standinpose.com/supporters/download/";
const copyButton = document.querySelector<HTMLButtonElement>("#copy-link")!;
copyButton.hidden = false;
copyButton.addEventListener("click", async () => {
  const status = document.querySelector<HTMLElement>("#copy-status")!;
  const fallback = document.querySelector<HTMLInputElement>("#copy-fallback")!;
  try {
    await navigator.clipboard.writeText(pageUrl);
    status.textContent = "링크를 복사했습니다. PC에서 열어 주세요.";
    fallback.hidden = true;
  } catch {
    status.textContent = "아래 주소를 복사해 PC에서 열어 주세요.";
    fallback.hidden = false;
    fallback.select();
  }
});

function installerCard(asset: DownloadAsset) {
  const card = document.createElement("a");
  card.className = "installer";
  card.href = asset.url;
  const title = document.createElement("span");
  title.className = "platform";
  title.textContent = asset.label.split(" · ")[0];
  const detail = document.createElement("span");
  detail.className = "platform-detail";
  detail.textContent = `${asset.label.split(" · ")[1]} · ${asset.name.endsWith(".exe") ? "EXE" : "DMG"} · ${(asset.size / 1_000_000).toFixed(1)} MB`;
  const label = document.createElement("span");
  label.className = "download-label";
  label.textContent = "설치 파일 다운로드";
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↓";
  label.append(arrow);
  card.append(title, detail, label);
  return card;
}

async function refreshRelease() {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(RELEASES_API, { signal: controller.signal, headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error("RELEASE_UNAVAILABLE");
    const release = parseRelease(await response.json());
    // Retain both verified fallback installers if the newest release is incomplete.
    if (!release.assets.some(asset => asset.name.endsWith(".exe")) || !release.assets.some(asset => asset.name.endsWith(".dmg"))) throw new Error("INCOMPLETE_RELEASE");
    document.querySelector("#installer-list")!.replaceChildren(...release.assets.map(installerCard));
    document.querySelector("#release-version")!.textContent = release.tag;
    document.querySelector("#release-status")!.textContent = `최신 공개 버전 ${release.tag} · 운영체제에 맞는 파일을 선택해 주세요.`;
  } catch {
    document.querySelector("#release-status")!.textContent = "최신 버전 확인이 지연되고 있습니다. 위 버튼에서 확인된 공개 버전 v2.10.0을 받을 수 있습니다.";
  } finally {
    window.clearTimeout(timeout);
  }
}

void refreshRelease();

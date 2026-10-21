import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./styles/globals.css";
import { App } from "./App";

// 가입·설문 페이지는 별도 문서라 경로 끝의 슬래시를 정규화한다.
// 슬래시가 없으면 정적 호스트가 이 문서(랜딩)로 폴백해 버려서, 가입 링크를 눌렀는데
// 랜딩이 뜨는 조용한 오작동이 된다. 여기서 한 번 정규화한다.
if (["/signup", "/feedback"].includes(window.location.pathname)) {
  window.location.replace(`${window.location.pathname}/${window.location.search}${window.location.hash}`);
} else if (/^\/closed-beta\/?$/.test(window.location.pathname)) {
  // 클로즈베타 종료로 없어진 경로. 예전 링크는 현재 다운로드 안내로 보낸다.
  window.location.replace("/#beta");
} else {
  const root = document.getElementById("root")!;
  const app = (
    <StrictMode>
      <App />
    </StrictMode>
  );
  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
}

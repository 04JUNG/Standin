import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/globals.css";
import { App } from "./App";

// 가입 페이지는 별도 문서(signup/index.html)라 정확한 경로가 "/signup/"이다.
// 슬래시가 없으면 정적 호스트가 이 문서(랜딩)로 폴백해 버려서, 가입 링크를 눌렀는데
// 랜딩이 뜨는 조용한 오작동이 된다. 여기서 한 번 정규화한다.
if (window.location.pathname === "/signup") {
  window.location.replace(`/signup/${window.location.search}${window.location.hash}`);
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

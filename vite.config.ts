import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 랜딩과 가입 페이지를 각각 독립 문서로 빌드한다(MPA).
    // 정적 호스트에서 /signup 이 그대로 열리므로 SPA rewrite 설정이 필요 없고,
    // 랜딩 번들에 가입 폼이 섞이지 않는다.
    // 경로는 root 기준 상대 경로 — node:path/__dirname을 쓰면 @types/node가 필요해진다.
    rollupOptions: {
      input: {
        main: "index.html",
        signup: "signup/index.html",
        feedback: "feedback/index.html",
        closedBeta: "closed-beta/index.html",
      },
    },
  },
});

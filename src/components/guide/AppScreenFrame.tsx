import type { ReactNode } from "react";

type AppScreenFrameProps = {
  /** 상단 앱 바 제목. 실제 앱의 화면 제목과 같은 문자열을 쓴다. */
  title: string;
  /**
   * shell — 사이드바와 탑바가 있는 앱 화면
   * plain — 셸이 없는 온보딩 화면. 실제 앱도 여기서는 셸을 쓰지 않는다.
   */
  chrome?: "shell" | "plain";
  children: ReactNode;
};

/**
 * 데스크톱 앱 화면의 크롬만 담당한다. 본문은 화면별 컴포넌트가 넣는다.
 *
 * 안에는 포커스 가능한 요소를 두지 않는다. 그림이지 조작할 수 있는 UI가 아니고,
 * 버튼처럼 보이는 것을 실제 button으로 만들면 키보드 순서만 어지럽힌다.
 */
export function AppScreenFrame({
  title,
  chrome = "shell",
  children,
}: AppScreenFrameProps) {
  if (chrome === "plain") {
    return <div className="app-screen is-plain">{children}</div>;
  }

  return (
    <div className="app-screen">
      <div className="app-screen__chrome">
        <div className="app-screen__sidebar">
          <span className="app-screen__brand">
            Standin<i>.</i>
          </span>
          <span className="app-screen__nav-item is-active">홈</span>
          <span className="app-screen__nav-item is-disabled">작업 기록</span>
          <span className="app-screen__nav-item">설정</span>
        </div>

        <div className="app-screen__main">
          <div className="app-screen__topbar">
            <span className="app-screen__topbar-title">{title}</span>
            <span className="app-screen__topbar-actions">플로팅 바</span>
          </div>
          <div className="app-screen__body">{children}</div>
        </div>
      </div>
    </div>
  );
}

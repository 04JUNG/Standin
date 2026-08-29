import { AppScreenFrame } from "../AppScreenFrame";
import { MockButton, MockKbd, UploadGlyph } from "../MockBits";

/** 홈 화면. 파일을 놓거나 화면에서 바로 캡처하는 두 가지 입력 경로를 보여준다. */
export function HomeScreen() {
  return (
    <AppScreenFrame title="홈">
      <div>
        <p className="app-screen__topbar-title">
          어떤 장면을 3D 포즈로 바꿔볼까요?
        </p>
        <p className="mock-note">
          파일을 놓거나 화면에서 필요한 부분만 바로 캡처하세요.
        </p>
      </div>

      <div className="mock-dropzone">
        <UploadGlyph />
        <span className="mock-dropzone__title">파일을 여기에 놓으세요</span>
        <span className="mock-row">
          <MockButton>또는 파일 선택</MockButton>
          <MockKbd keys={["Ctrl", "O"]} />
        </span>
        <span className="mock-dropzone__formats">
          PNG · JPG · WEBP · 최대 20 MB
        </span>
      </div>

      <div className="mock-actions">
        <div className="mock-action is-primary">
          <span className="mock-action__title">
            화면 캡처
            <MockKbd keys={["Ctrl", "Alt", "S"]} />
          </span>
          <span className="mock-action__desc">영역을 드래그해 바로 캡처</span>
        </div>
        <div className="mock-action is-muted">
          <span className="mock-action__title">화면 녹화</span>
          <span className="mock-action__desc">준비 중</span>
        </div>
      </div>
    </AppScreenFrame>
  );
}

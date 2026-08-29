import { AppScreenFrame } from "../AppScreenFrame";
import { CheckGlyph, GripGlyph, MockButton, MockKbd } from "../MockBits";

/**
 * 저장 완료 화면.
 * 파일 행 자체가 드래그 소스라, 여기서 클립스튜디오 캔버스로 바로 끌어다 놓는다.
 */
export function SaveScreen() {
  return (
    <AppScreenFrame title="저장 완료">
      <p className="mock-saved-head">
        <CheckGlyph />
        포즈 1개를 저장했습니다.
      </p>
      <p className="mock-note">
        아래 파일을 클립스튜디오 캔버스로 끌어놓으면 데생 인형이 만들어집니다.
      </p>

      <div className="mock-file-row">
        <span className="mock-file-row__grip">
          <GripGlyph />
        </span>
        <span className="mock-file-row__body">
          <span className="mock-file-row__name">
            standin_pose_20260828_1432.bvh
          </span>
          <span className="mock-file-row__path">
            C:\Users\artist\Downloads
          </span>
        </span>
        <span className="mock-file-row__copy">경로 복사</span>
      </div>

      <div className="mock-footer">
        <MockButton>폴더 열기</MockButton>
        <MockKbd keys={["Ctrl", "E"]} />
        <MockButton tone="ghost">다른 폴더에 저장</MockButton>
        <MockButton tone="ghost">새 장면 분석</MockButton>
      </div>
    </AppScreenFrame>
  );
}

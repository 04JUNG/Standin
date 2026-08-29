import { AppScreenFrame } from "../AppScreenFrame";
import { MockButton } from "../MockBits";
import { Mannequin } from "../../demo/Mannequin";

/**
 * 저장 직전 확인 화면.
 *
 * 실제 앱은 여기에 3D 미리보기를 두지 않는다 — 저장되는 것은 BVH라 그려 봐야
 * 실제 자세가 아닌 T자 뼈대가 나오기 때문이다. 목업도 그 판단을 따른다.
 */
export function ReviewScreen() {
  return (
    <AppScreenFrame title="저장할 포즈 확인">
      <p className="mock-dropzone__title">아래 포즈가 저장됩니다.</p>

      <div className="mock-list-row">
        <span className="mock-source__thumb">
          <Mannequin pose="reach" accent />
        </span>
        <div className="mock-file-row__body">
          <p className="mock-file-row__name">인물 1 · 배구 스파이크</p>
          <p className="mock-note">러프에 맞춰 조정 완료</p>
        </div>
      </div>

      <div className="mock-footer">
        <MockButton tone="ghost">후보 다시 고르기</MockButton>
        <MockButton tone="primary">이 포즈로 저장 (1)</MockButton>
      </div>
    </AppScreenFrame>
  );
}

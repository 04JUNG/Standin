import { AppScreenFrame } from "../AppScreenFrame";
import { MockButton, MockCheckbox } from "../MockBits";

/**
 * 첫 실행에서 만나는 베타 데이터 수집 동의 화면.
 * 문구는 앱의 BetaConsentPage에서 그대로 가져왔고, 수집 항목은 대표 두 개만 줄였다.
 */
export function ConsentScreen() {
  return (
    <AppScreenFrame title="베타 동의" chrome="plain">
      <div className="mock-consent">
        <p className="mock-consent__title">
          Standin 클로즈베타 데이터 수집 동의
        </p>
        <ul className="mock-consent__list">
          <li>원본 이미지는 암호화된 비공개 저장소에 90일 보관합니다.</li>
          <li>
            MAC 주소, 디스크 ID, 호스트명, 로컬 파일 경로는 수집하지 않습니다.
          </li>
        </ul>

        <div className="mock-consent__agree">
          <MockCheckbox />
          <span>
            위 수집 목적, 항목, 보유기간 및 거부 시 제한을 확인하고 동의합니다.
          </span>
        </div>

        <div className="mock-consent__buttons">
          <MockButton tone="primary">동의하고 베타 시작</MockButton>
          <MockButton tone="ghost">동의하지 않고 종료</MockButton>
        </div>
      </div>
    </AppScreenFrame>
  );
}

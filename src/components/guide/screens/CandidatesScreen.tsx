import { AppScreenFrame } from "../AppScreenFrame";
import { CheckGlyph, MockButton, MockKbd } from "../MockBits";
import { Mannequin } from "../../demo/Mannequin";
import type { PoseId } from "../../../types/landing";

/**
 * 포즈 후보 화면. 이 가이드의 핵심이다.
 *
 * 배지는 앱과 같은 정성 표현만 쓴다 — 실제 앱도 원시 점수를 사용자에게
 * 보여주지 않고, 검증되지 않은 정확도 수치를 랜딩에 쓰지 않는다.
 */
const candidates: {
  rank: number;
  title: string;
  pose: PoseId;
  badge: string;
  tone: "" | "is-high" | "is-warning";
  selected?: boolean;
}[] = [
  { rank: 1, title: "점프 리치", pose: "reach", badge: "유사", tone: "" },
  { rank: 2, title: "팔 올림", pose: "lean", badge: "유사", tone: "" },
  {
    rank: 3,
    title: "스파이크 준비",
    pose: "side",
    badge: "보정 필요",
    tone: "is-warning",
  },
  { rank: 4, title: "착지", pose: "sit", badge: "유사", tone: "" },
  {
    rank: 5,
    title: "배구 스파이크",
    pose: "reach",
    badge: "높은 일치",
    tone: "is-high",
    selected: true,
  },
];

export function CandidatesScreen() {
  return (
    <AppScreenFrame title="포즈 후보">
      <div className="mock-source">
        <span className="mock-source__thumb">
          <Mannequin pose="reach" />
        </span>
        <div>
          <p className="mock-dropzone__title">원본</p>
          <p className="mock-note">배구 스파이크 러프</p>
        </div>
      </div>

      <div className="mock-person-head">
        <strong>인물 1</strong>
        <span className="mock-note">선택됨: 배구 스파이크</span>
      </div>

      <div className="mock-candidates">
        {candidates.map((candidate) => (
          <div
            key={candidate.rank}
            className={`mock-candidate${candidate.selected ? " is-selected" : ""}`}
          >
            {candidate.selected && (
              <span className="mock-candidate__check">
                <CheckGlyph />
              </span>
            )}
            <span className="mock-candidate__figure">
              <Mannequin pose={candidate.pose} accent={candidate.selected} />
            </span>
            <span className="mock-candidate__rank">
              {candidate.rank}. {candidate.title}
            </span>
            <span className={`mock-candidate__badge ${candidate.tone}`}>
              {candidate.badge}
            </span>
          </div>
        ))}
      </div>

      <div className="mock-footer">
        <MockButton tone="ghost">다른 후보 찾기</MockButton>
        <MockKbd keys={["R"]} />
        <MockButton tone="primary">이 포즈 사용하기 (1/1)</MockButton>
        <MockKbd keys={["Ctrl", "Enter"]} />
      </div>
    </AppScreenFrame>
  );
}

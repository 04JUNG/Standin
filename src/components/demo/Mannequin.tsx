import type { PoseId } from "../../types/landing";

/**
 * 실제 3D 에셋 확정 전 대체 비주얼(docs/03 §7, docs/06 §5~7).
 * 사실적 렌더 대신 중립 회색 관절형 마네킹. 포즈별 관절 좌표만 다르게 둔다.
 */

type Pt = [number, number];
type Joints = {
  head: Pt;
  neck: Pt;
  chest: Pt;
  pelvis: Pt;
  shoulderL: Pt;
  shoulderR: Pt;
  elbowL: Pt;
  elbowR: Pt;
  handL: Pt;
  handR: Pt;
  hipL: Pt;
  hipR: Pt;
  kneeL: Pt;
  kneeR: Pt;
  footL: Pt;
  footR: Pt;
};

const POSES: Record<Exclude<PoseId, "duo">, Joints> = {
  side: {
    head: [100, 42],
    neck: [100, 64],
    chest: [100, 82],
    pelvis: [100, 170],
    shoulderL: [96, 84],
    shoulderR: [104, 82],
    elbowL: [94, 122],
    elbowR: [106, 120],
    handL: [96, 156],
    handR: [108, 154],
    hipL: [96, 172],
    hipR: [104, 170],
    kneeL: [94, 232],
    kneeR: [106, 234],
    footL: [96, 302],
    footR: [110, 300],
  },
  lean: {
    head: [120, 50],
    neck: [113, 68],
    chest: [106, 86],
    pelvis: [100, 170],
    shoulderL: [100, 88],
    shoulderR: [114, 84],
    elbowL: [95, 120],
    elbowR: [122, 116],
    handL: [96, 152],
    handR: [128, 146],
    hipL: [92, 172],
    hipR: [108, 170],
    kneeL: [88, 234],
    kneeR: [112, 232],
    footL: [84, 302],
    footR: [116, 302],
  },
  reach: {
    head: [96, 42],
    neck: [98, 64],
    chest: [100, 82],
    pelvis: [100, 170],
    shoulderL: [84, 84],
    shoulderR: [116, 82],
    elbowL: [76, 120],
    elbowR: [142, 72],
    handL: [74, 154],
    handR: [172, 58],
    hipL: [90, 172],
    hipR: [110, 170],
    kneeL: [86, 234],
    kneeR: [114, 232],
    footL: [82, 302],
    footR: [118, 302],
  },
  sit: {
    head: [100, 58],
    neck: [100, 78],
    chest: [100, 96],
    pelvis: [100, 172],
    shoulderL: [86, 98],
    shoulderR: [114, 96],
    elbowL: [80, 132],
    elbowR: [120, 130],
    handL: [84, 162],
    handR: [116, 160],
    hipL: [86, 174],
    hipR: [114, 172],
    kneeL: [70, 172],
    kneeR: [130, 170],
    footL: [66, 240],
    footR: [134, 238],
  },
};

const BONES: [keyof Joints, keyof Joints][] = [
  ["neck", "chest"],
  ["chest", "pelvis"],
  ["shoulderL", "elbowL"],
  ["elbowL", "handL"],
  ["shoulderR", "elbowR"],
  ["elbowR", "handR"],
  ["pelvis", "hipL"],
  ["hipL", "kneeL"],
  ["kneeL", "footL"],
  ["pelvis", "hipR"],
  ["hipR", "kneeR"],
  ["kneeR", "footR"],
];

const JOINT_POINTS: (keyof Joints)[] = [
  "chest",
  "shoulderL",
  "shoulderR",
  "elbowL",
  "elbowR",
  "handL",
  "handR",
  "pelvis",
  "kneeL",
  "kneeR",
];

function Figure({ j, accent }: { j: Joints; accent: boolean }) {
  const bodyStroke = "#9aa3b0";
  const jointColor = accent ? "var(--color-brand-coral)" : "#b6bdc8";
  return (
    <g>
      {/* 머리 */}
      <ellipse
        cx={j.head[0]}
        cy={j.head[1]}
        rx={14}
        ry={17}
        fill="#aab1bd"
        stroke={bodyStroke}
        strokeWidth={2}
      />
      <line
        x1={j.head[0]}
        y1={j.head[1] + 15}
        x2={j.neck[0]}
        y2={j.neck[1]}
        stroke={bodyStroke}
        strokeWidth={9}
        strokeLinecap="round"
      />
      {/* 어깨/골반 라인 */}
      <line
        x1={j.shoulderL[0]}
        y1={j.shoulderL[1]}
        x2={j.shoulderR[0]}
        y2={j.shoulderR[1]}
        stroke={bodyStroke}
        strokeWidth={10}
        strokeLinecap="round"
      />
      <line
        x1={j.hipL[0]}
        y1={j.hipL[1]}
        x2={j.hipR[0]}
        y2={j.hipR[1]}
        stroke={bodyStroke}
        strokeWidth={10}
        strokeLinecap="round"
      />
      {/* 몸통 채움 */}
      <polygon
        points={`${j.shoulderL[0]},${j.shoulderL[1]} ${j.shoulderR[0]},${j.shoulderR[1]} ${j.hipR[0]},${j.hipR[1]} ${j.hipL[0]},${j.hipL[1]}`}
        fill="#aab1bd"
        opacity={0.9}
      />
      {/* 뼈대 */}
      {BONES.map(([a, b], i) => (
        <line
          key={i}
          x1={j[a][0]}
          y1={j[a][1]}
          x2={j[b][0]}
          y2={j[b][1]}
          stroke={bodyStroke}
          strokeWidth={9}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      {/* 관절점 */}
      {JOINT_POINTS.map((p, i) => (
        <circle key={i} cx={j[p][0]} cy={j[p][1]} r={3.4} fill={jointColor} />
      ))}
    </g>
  );
}

function DuoFigures({ accent }: { accent: boolean }) {
  // 2인 마주 보기: 단순 스탠딩 두 명을 마주 보게 배치
  const left: Joints = {
    head: [62, 70],
    neck: [64, 88],
    chest: [66, 102],
    pelvis: [66, 176],
    shoulderL: [56, 104],
    shoulderR: [76, 102],
    elbowL: [50, 134],
    elbowR: [82, 132],
    handL: [52, 162],
    handR: [86, 158],
    hipL: [58, 178],
    hipR: [74, 176],
    kneeL: [56, 228],
    kneeR: [74, 228],
    footL: [54, 280],
    footR: [78, 280],
  };
  const right: Joints = {
    head: [138, 70],
    neck: [136, 88],
    chest: [134, 102],
    pelvis: [134, 176],
    shoulderL: [124, 102],
    shoulderR: [144, 104],
    elbowL: [118, 132],
    elbowR: [150, 134],
    handL: [114, 158],
    handR: [148, 162],
    hipL: [126, 176],
    hipR: [142, 178],
    kneeL: [126, 228],
    kneeR: [144, 228],
    footL: [122, 280],
    footR: [146, 280],
  };
  return (
    <g transform="translate(0,10) scale(0.94)">
      <Figure j={left} accent={accent} />
      <Figure j={right} accent={accent} />
    </g>
  );
}

type MannequinProps = {
  pose: PoseId;
  /** 선택/미리보기 상태일 때 관절점을 코랄로 강조 */
  accent?: boolean;
  className?: string;
};

export function Mannequin({ pose, accent = false, className = "" }: MannequinProps) {
  return (
    <svg
      viewBox="0 0 200 340"
      className={className}
      role="img"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {pose === "duo" ? (
        <DuoFigures accent={accent} />
      ) : (
        <Figure j={POSES[pose]} accent={accent} />
      )}
    </svg>
  );
}

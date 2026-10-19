import { Container } from "../common/Container";
import { FeatureAnimation } from "../common/FeatureAnimation";

const features = [
  {
    id: "text-search", eyebrow: "01 · TEXT SEARCH", title: "문장으로 찾고,\n마음에 드는 포즈를 고르세요.",
    body: "그림이 없어도 괜찮아요. ‘팔을 뻗어 공을 던지는 자세’처럼 원하는 장면을 적고, 포즈 후보를 비교해 작화의 시작점을 찾으세요.",
    steps: ["자세를 문장으로 입력", "결과를 스크롤하며 비교", "선택한 포즈로 이어 그리기"],
    note: "검색 화면 개편 예정 · 상단 검색창과 스크롤 결과 목록으로 구성한 화면 예시입니다.",
  },
  {
    id: "body-manual", eyebrow: "02 · BODY CONTROL", title: "내 캐릭터의 비율로,\n직접 체형을 다듬으세요.",
    body: "키와 등신부터 어깨, 팔과 다리의 길이까지. 러프를 옆에 두고 원하는 비율로 조절한 뒤, 이름을 붙여 내 체형으로 저장하세요.",
    steps: ["시작 체형 선택", "비율을 직접 조절", "내 체형으로 저장"],
    note: "체형 변경 기능 구현 완료 · 오픈베타에서 제공됩니다.",
  },
  {
    id: "body-auto", eyebrow: "03 · AUTO FIT", title: "러프에 맞는 체형에서\n바로 시작하세요.",
    body: "러프의 인물에 맞춰 자동으로 변경된 체형을 확인하세요. 포즈와 비율을 함께 비교하고, 필요한 부분만 직접 조절해 작업을 이어갈 수 있습니다.",
    steps: ["러프 입력", "자동 체형 확인", "필요한 부분만 조절"],
    note: "자동 체형 변경 기능 구현 완료 · 결과는 러프의 표현과 비율에 따라 달라질 수 있습니다.",
  },
];

export function FeatureShowcaseSection() {
  return <section id="features" className="feature-showcase">
    <Container wide>
      <div className="feature-showcase__intro">
        <p className="eyebrow">MORE WAYS TO START</p>
        <h2>포즈를 찾는 방법도,<br />체형을 맞추는 방법도.</h2>
        <p>문장으로 찾고, 직접 다듬고, 러프에 맞춰 시작하세요.</p>
      </div>
      {features.map((feature, index) => <article id={`feature-${feature.id}`} className="feature-showcase__row" key={feature.id}>
        <div className={`feature-showcase__media ${index % 2 ? "is-right" : ""}`}><FeatureAnimation id={feature.id} label={feature.title.replace("\n", " ")} /></div>
        <div className="feature-showcase__copy">
          <p className="eyebrow">{feature.eyebrow}</p>
          <h3>{feature.title}</h3><p className="feature-showcase__body">{feature.body}</p>
          <ol>{feature.steps.map((step, number) => <li key={step}><span>{number + 1}</span>{step}</li>)}</ol>
          <p className="feature-showcase__note">{feature.note}</p>
        </div>
      </article>)}
    </Container>
  </section>;
}

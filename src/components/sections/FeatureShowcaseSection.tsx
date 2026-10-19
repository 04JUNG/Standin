import { Container } from "../common/Container";
import { FeatureAnimation } from "../common/FeatureAnimation";

const features = [
  {
    id: "text-search", eyebrow: "NEW · TEXT SEARCH", title: "문장으로 찾고,\n마음에 드는 포즈를 고르세요.",
    body: "아직 러프가 없어도 괜찮아요. ‘검을 들고 싸우는 전투 자세’처럼 원하는 장면을 적고, 포즈 후보를 비교해 작화의 시작점을 찾으세요.",
    steps: ["러프 없이 문장으로 검색", "전투 포즈를 스크롤하며 비교", "마음에 드는 포즈 선택"],
    note: "검색 화면 개편 예정 · 상단 검색창과 스크롤 결과 목록을 보여주기 위해 전투 포즈를 선별한 화면 예시입니다.",
    caption: "문장 검색 시연 예시 · 빈 클립스튜디오 캔버스에서 시작",
  },
  {
    id: "body-manual", eyebrow: "NEW · BODY CONTROL", title: "내 캐릭터의 비율로,\n직접 체형을 다듬으세요.",
    body: "Standin의 체형 커스텀에서 시작 체형을 고르고, 키·등신·어깨와 팔다리 비율을 조절하세요. 이름을 붙여 저장하면 내 체형 목록에서 다시 사용할 수 있어요.",
    steps: ["시작 체형 선택", "비율을 직접 조절", "내 체형으로 저장"],
    note: "체형 변경 기능 구현 완료 · 오픈베타에서 제공됩니다.",
    caption: "Standin 앱 실제 사용 화면 · 체형 조절부터 저장까지",
  },
  {
    id: "body-auto", eyebrow: "NEW · AUTO FIT", title: "러프에 맞는 체형에서\n바로 시작하세요.",
    body: "넓은 어깨, 작은 머리까지. 러프 속 캐릭터의 비율에 맞춰 새로 만들어진 체형을 기본 체형과 비교하세요. 마음에 들면 내 체형으로 저장하고, 필요한 부분만 더 다듬을 수 있어요.",
    steps: ["캐릭터 러프 입력", "기본 체형과 새 체형 비교", "내 체형으로 저장"],
    note: "자동 체형 변경 기능 구현 완료 · 결과는 러프의 표현과 비율에 따라 달라질 수 있습니다.",
    caption: "실제 모델·포즈 기반 연출 예시 · 남성 기본 체형에서 내 캐릭터 체형으로",
  },
];

export function FeatureShowcaseSection() {
  return <section id="features" className="feature-showcase">
    <Container wide>
      <div className="feature-showcase__intro">
        <p className="eyebrow">NEW IN OPEN BETA</p>
        <h2>오픈베타에서 만날<br />새로운 기능들.</h2>
        <p>문장으로 포즈를 찾고, 내 캐릭터에 맞는 체형까지 만들어 보세요.</p>
      </div>
      {features.map((feature, index) => <article id={`feature-${feature.id}`} className="feature-showcase__row" key={feature.id}>
        <div className={`feature-showcase__media ${index % 2 ? "is-right" : ""}`}><FeatureAnimation id={feature.id} label={feature.title.replace("\n", " ")} caption={feature.caption} /></div>
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

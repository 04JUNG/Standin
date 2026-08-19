import { ArrowRight } from "lucide-react";

export function StickyBetaCta() {
  return (
    <aside className="sticky-beta" aria-label="오픈베타 신청 안내">
      <div>
        <strong>2026. 8. 31. 오픈베타 시작</strong>
        <span>지금 사전등록하면 오픈 소식을 가장 먼저 보내드립니다. 가격·결제 정보는 받지 않습니다.</span>
      </div>
      <a href="#beta">
        오픈베타 신청하기 <ArrowRight size={17} />
      </a>
    </aside>
  );
}

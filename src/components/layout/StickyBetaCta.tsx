import { ArrowRight } from "lucide-react";

export function StickyBetaCta() {
  return (
    <aside className="sticky-beta" aria-label="오픈베타 신청 안내">
      <div>
        <strong>Standin을 가장 먼저 사용해 보세요.</strong>
        <span>가격·결제 없이 오픈베타 소식만 보내드립니다.</span>
      </div>
      <a href="#beta">
        오픈베타 신청하기 <ArrowRight size={17} />
      </a>
    </aside>
  );
}

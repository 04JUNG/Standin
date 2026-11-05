import { useI18n } from "../../i18n/context";
import {
  ArrowLeft,
  Camera,
  Check,
  GripVertical,
  ImagePlus,
  Maximize2,
  Upload,
} from "lucide-react";
import { useState, type DragEvent, type KeyboardEvent } from "react";

type WorkspacePose = {
  id: string;
  title: string;
  rough: string;
  mannequin: string;
  mannequinCutout: string;
};

type HeroWorkspaceDemoProps = {
  pose: WorkspacePose;
  onBack: () => void;
};

export function HeroWorkspaceDemo({ pose, onBack }: HeroWorkspaceDemoProps) {
  const { t } = useI18n();
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImported, setIsImported] = useState(false);

  const importPose = () => {
    setIsDragOver(false);
    setIsImported(true);
  };

  const handleDragStart = (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = "copy";
    event.dataTransfer.setData("text/plain", pose.id);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.getData("text/plain") !== pose.id) return;
    importPose();
  };

  const handlePoseKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      importPose();
    }
  };

  return (
    <div className="hero-workspace is-clip-reference">
      <div className="hero-workspace__bar">
        <div className="hero-workspace__flow" aria-label={t("작업 흐름")}>
          <span>{t("러프 확인")}</span>
          <i>→</i>
          <span>{t("Standin 포즈 선택")}</span>
          <i>→</i>
          <strong>{t("Clip Studio 배치")}</strong>
        </div>
        <button type="button" onClick={onBack} className="hero-workspace__back">
          <ArrowLeft size={16} />{t("포즈로 돌아가기")}</button>
      </div>

      <div className="clip-reference-shell">
        <img
          className="clip-reference-shell__ui"
          src="/assets/workspace/clip-studio-reference.png"
          alt={t("Clip Studio 작업 화면의 메뉴, 도구, 소재, 레이어 패널")}
        />

        <div
          className={`clip-reference-canvas ${isDragOver ? "is-drag-over" : ""} ${
            isImported ? "is-imported" : ""
          }`}
          onDragEnter={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
          aria-label={t("3D 포즈를 놓을 Clip Studio 캔버스")}
        >
          <img
            className="clip-reference-canvas__pose"
            src={pose.rough}
            alt={t("{0} 러프가 Clip Studio 캔버스에 열린 모습", pose.title)}
          />
          <img
            className={`clip-reference-canvas__pose is-result ${
              isImported ? "is-visible" : ""
            }`}
            src={pose.mannequinCutout}
            alt={t("{0} 3D 인형이 Clip Studio 캔버스에 생성된 모습", pose.title)}
          />

          {!isImported && (
            <div className="clip-reference-canvas__guide">
              <ImagePlus size={21} />
              <span>{t("3D 포즈를 여기에 놓으세요")}</span>
            </div>
          )}
          {isImported && (
            <div className="clip-reference-canvas__success" role="status">
              <Check size={15} />{t("3D 포즈 레이어 생성 완료")}</div>
          )}
        </div>

        <aside className="standin-float" aria-label={t("Standin 앱 미리보기")}>
          <div className="standin-float__titlebar">
            <span className="standin-float__brand">
              <GripVertical size={14} /> Standin
            </span>
            <span aria-hidden="true">— <Maximize2 size={13} /></span>
          </div>

          <div className="standin-float__actions" aria-hidden="true">
            <button type="button" tabIndex={-1}>
              <Camera size={15} />{t("화면 캡처")}</button>
            <button type="button" tabIndex={-1}>
              <Upload size={15} />{t("파일 업로드")}</button>
          </div>

          <div className="standin-float__body">
            <span>{t("찾은 3D 포즈")}</span>
            <div
              className="standin-float__pose"
              draggable
              role="button"
              tabIndex={0}
              onDragStart={handleDragStart}
              onKeyDown={handlePoseKeyDown}
              aria-label={t("{0} 3D 포즈. Clip Studio 캔버스로 드래그하거나 Enter 키를 누르세요.", pose.title)}
            >
              <img src={pose.mannequinCutout} alt={t("{0} 3D 인형", pose.title)} />
              <strong>{pose.title}</strong>
              <small><GripVertical size={13} /> DRAG</small>
            </div>
            <button
              type="button"
              className="standin-float__import"
              aria-disabled="true"
            >{t("FBX로 저장")}</button>
          </div>
        </aside>

      </div>

      <div className="hero-workspace__footer">
        <span>{t("우측 상단 Standin의 3D 포즈를 캔버스로 드래그해 보세요.")}</span>
      </div>

      <p className="hero-workspace__disclaimer">{t("작업 흐름 연출 예시입니다. Standin은 Clip Studio의 공식 플러그인 또는 공식 제휴 서비스가 아닙니다.")}</p>
    </div>
  );
}

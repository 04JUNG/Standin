import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "../../hooks/useReducedMotion";

type Props = { id: string; label: string };

/** GIF masters are also supplied; the page streams the smaller video version. */
export function FeatureAnimation({ id, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  const manuallyPaused = useRef(false);
  const reducedMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (reducedMotion) video.pause();
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) video.pause();
      else if (!reducedMotion && !manuallyPaused.current) void video.play().catch(() => setPlaying(false));
    }, { threshold: 0.2 });
    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);
  return (
    <figure className="feature-animation">
      <div className="feature-animation__frame">
        <video ref={ref} src={`/assets/open-beta/${id}.mp4`} poster={`/assets/open-beta/${id}-poster.jpg`} width="1120" height="700" muted loop playsInline preload="none" aria-label={label}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />
        <button type="button" className="feature-animation__control" onClick={() => {
          manuallyPaused.current = playing;
          if (playing) ref.current?.pause();
          else void ref.current?.play().catch(() => setPlaying(false));
        }} aria-label={`${label} ${playing ? "일시정지" : "재생"}`}>
          {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          {playing ? "일시정지" : "재생"}
        </button>
      </div>
      <figcaption>기능 시연 예시 · 클립스튜디오 작업 흐름</figcaption>
    </figure>
  );
}

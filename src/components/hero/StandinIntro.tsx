import { useEffect, useState } from "react";

export function StandinIntro() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      className="standin-intro"
      onClick={() => setVisible(false)}
      aria-label="Stand in 인트로 건너뛰기"
    >
      <span className="standin-intro__grid" aria-hidden="true" />
      <strong className="standin-intro__wordmark" aria-label="Stand in">
        <span>Stand</span>
        <em>in</em>
      </strong>
      <small>ROUGH POSE TO 3D</small>
    </button>
  );
}

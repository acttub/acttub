/**
 * StoryCaptureCanvas — 인스타 스토리(9:16) 전용 캡처 캔버스.
 *
 * 화면엔 안 보이는 540x960 오프스크린 DOM. 공유 시 html-to-image로
 * 이 노드를 PNG로 변환 → pixelRatio 2 적용해 최종 1080x1920 출력.
 * Story 비율에 맞춰 잘림/여백 없이 깔끔하게 올라가도록.
 */

import { forwardRef } from 'react';
import type { TypeContent } from '../content/schema';
import './StoryCaptureCanvas.css';

type Props = {
  type: TypeContent;
};

const StoryCaptureCanvas = forwardRef<HTMLElement, Props>(function StoryCaptureCanvas(
  { type },
  ref
) {
  return (
    <section
      ref={ref}
      className="story-canvas"
      data-type={String(type.index).padStart(2, '0')}
      aria-hidden="true"
    >
      <header className="story-canvas__header">
        <span className="story-canvas__brand">acttub.com</span>
        <span className="story-canvas__dot">·</span>
        <span className="story-canvas__tag">연기 스타일 MBTI</span>
      </header>

      <div className="story-canvas__hero">
        <img
          src={`/characters/${type.code}.png`}
          alt=""
          className="story-canvas__avatar"
        />
        <div className="story-canvas__badge">{type.code}</div>
      </div>

      <div className="story-canvas__body">
        <h1 className="story-canvas__name">{type.name}</h1>
        <p className="story-canvas__tagline">"{type.tagline}"</p>
        <ul className="story-canvas__traits">
          {type.traits.map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </div>

      <footer className="story-canvas__footer">
        <div className="story-canvas__cta-url">acttub.com</div>
        <div className="story-canvas__cta-sub">너의 연기 결, 1분 진단</div>
      </footer>
    </section>
  );
});

export default StoryCaptureCanvas;

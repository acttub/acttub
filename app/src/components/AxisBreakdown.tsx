/**
 * AxisBreakdown — 결과 페이지의 4축 시각화.
 *
 * 각 축마다 양극(좌/우) 라벨 + 짧은 설명을 보여주고,
 * 현재 유형의 극에 도트를 박아 사용자가 어느 쪽인지 한눈에 보이게 한다.
 */

import { AXES, poleOf, type TypeCode } from '../content/schema';
import './AxisBreakdown.css';

type Props = {
  code: TypeCode;
};

export default function AxisBreakdown({ code }: Props) {
  return (
    <section className="axes" aria-label="4축 해석">
      <h3 className="axes__title">너의 4축</h3>
      <ul className="axes__list">
        {AXES.map((meta, i) => {
          const userPole = poleOf(code, i as 0 | 1 | 2 | 3);
          const isLeft = userPole === meta.left.axis;
          const active = isLeft ? meta.left : meta.right;
          const other  = isLeft ? meta.right : meta.left;
          return (
            <li key={meta.key} className="axes__row">
              <div className="axes__heading">
                <span className="axes__heading-key">{meta.title}</span>
              </div>
              <div className="axes__track">
                <button
                  type="button"
                  disabled
                  className={`axes__pole ${isLeft ? 'axes__pole--active' : ''}`}
                  aria-label={`${meta.left.label}: ${meta.left.desc}`}
                >
                  <span className="axes__pole-letter">{meta.left.axis}</span>
                  <span className="axes__pole-label">{meta.left.label}</span>
                </button>
                <span className="axes__connector" aria-hidden="true" />
                <button
                  type="button"
                  disabled
                  className={`axes__pole ${!isLeft ? 'axes__pole--active' : ''}`}
                  aria-label={`${meta.right.label}: ${meta.right.desc}`}
                >
                  <span className="axes__pole-letter">{meta.right.axis}</span>
                  <span className="axes__pole-label">{meta.right.label}</span>
                </button>
              </div>
              <p className="axes__desc">
                <span className="axes__desc-active">{active.desc}</span>
                <span className="axes__desc-other">↔ {other.desc}</span>
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

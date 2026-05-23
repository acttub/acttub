/**
 * AxisBreakdown — 결과 페이지의 4축 시각화.
 *
 * 각 축을 슬라이더 게이지로 보여준다. 좌·우 극 라벨 사이에
 * 본인 위치를 도트로 표시하고, 선택된 극의 서술 카피를 같이 노출한다.
 */

import { AXES, poleOf, type TypeCode } from '../content/schema';

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
          return (
            <li key={meta.key} className="axes__card">
              <div className="axes__card-top">
                <span className="axes__heading-key">{meta.title}</span>
                <span className="axes__pole-tag">
                  <span className="axes__pole-letter">{active.axis}</span>
                  {active.label}
                </span>
              </div>

              <div
                className={`axes__gauge ${isLeft ? 'axes__gauge--left' : 'axes__gauge--right'}`}
                role="img"
                aria-label={`${active.label} 쪽`}
              >
                <span className="axes__gauge-end axes__gauge-end--left" aria-hidden="true">
                  {meta.left.axis}
                </span>
                <span className="axes__gauge-track" aria-hidden="true">
                  <span className="axes__gauge-fill" />
                  <span className="axes__gauge-dot" />
                </span>
                <span className="axes__gauge-end axes__gauge-end--right" aria-hidden="true">
                  {meta.right.axis}
                </span>
              </div>

              <p className="axes__desc">{active.desc}</p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

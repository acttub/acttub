import Link from 'next/link';
import { ArrowLeft, Clapperboard, Mail, MessageCircle, Sparkles } from 'lucide-react';

const principles = [
  {
    title: '연습이 남는 도구',
    description: '진단, 기록, 피드백이 한 번 쓰고 끝나지 않고 다음 연습으로 이어지게 만듭니다.',
    Icon: Sparkles,
  },
  {
    title: '배우 중심의 기록',
    description: '영상과 글, 결과 링크가 배우의 포트폴리오와 성장 기록으로 쌓이도록 설계합니다.',
    Icon: Clapperboard,
  },
  {
    title: '작은 커뮤니티',
    description: '오디션, 독백, 공연 경험을 편하게 묻고 나눌 수 있는 조용한 공간을 지향합니다.',
    Icon: MessageCircle,
  },
];

export default function TeamPage() {
  return (
    <main className="team-page">
      <div className="team-page__shell">
        <header className="team-page__header">
          <Link href="/" className="team-page__back">
            <ArrowLeft aria-hidden="true" />
            acttub
          </Link>
        </header>

        <section className="team-page__hero" aria-labelledby="team-title">
          <p className="team-page__eyebrow">TEAM</p>
          <h1 id="team-title">연기하는 사람들의 공간을 만듭니다.</h1>
          <p>
            acttub은 배우가 자기 연기를 진단하고, 영상으로 기록하고, 필요한 정보를 한곳에서
            찾을 수 있도록 만드는 통합 웹 서비스입니다.
          </p>
        </section>

        <section className="team-page__section" aria-labelledby="team-work-title">
          <h2 id="team-work-title">지금 집중하는 것</h2>
          <div className="team-page__grid">
            {principles.map(({ title, description, Icon }) => (
              <article key={title} className="team-page__card">
                <span className="team-page__icon" aria-hidden="true">
                  <Icon />
                </span>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="team-page__contact" aria-labelledby="team-contact-title">
          <div>
            <h2 id="team-contact-title">문의</h2>
            <p>서비스 제안, 제휴, 피드백은 메일로 보내주세요.</p>
          </div>
          <a href="mailto:hello@acttub.com" className="team-page__mail">
            <Mail aria-hidden="true" />
            hello@acttub.com
          </a>
        </section>
      </div>
    </main>
  );
}

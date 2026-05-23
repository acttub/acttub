import { useMemo, type MouseEvent } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import landingHtml from '../legacy/landing.html?raw';

function extractLandingMarkup() {
  const styles = Array.from(landingHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
    .map((match) => match[1])
    .join('\n');
  const body = landingHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';

  return { body, styles };
}

export default function LegacyLandingPage() {
  const navigate = useNavigate();
  const { body, styles } = useMemo(() => extractLandingMarkup(), []);

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const link = target.closest('a[href]');
    if (!(link instanceof HTMLAnchorElement)) return;

    const url = new URL(link.href);
    if (url.origin !== window.location.origin) return;

    event.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <>
      <Helmet>
        <title>acttub — 연기하는 사람들의 공간</title>
        <meta
          name="description"
          content="연기하는 사람들의 커뮤니티와 도구들. 자유게시판, 연기 스타일 진단(ACTI), 영상 아카이브(archive), 연극 추천(thea), 연습실(excer)."
        />
        <meta property="og:title" content="acttub" />
        <meta
          property="og:description"
          content="연기하는 사람들이 자기 연기를 기록하고, 진단하고, 이야기 나누는 공간"
        />
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </Helmet>
      <style>{styles}</style>
      <div onClickCapture={handleClick} dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}

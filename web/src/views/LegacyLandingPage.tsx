'use client';

import { useEffect, useState, type MouseEvent } from 'react';
import { useNavigate } from '../lib/router';

function extractLandingMarkup(html: string) {
  const styles = Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi))
    .map((match) => match[1])
    .join('\n');
  const body = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1] ?? '';

  return { body, styles };
}

export default function LegacyLandingPage() {
  const navigate = useNavigate();
  const [markup, setMarkup] = useState({ body: '', styles: '' });

  useEffect(() => {
    let active = true;

    fetch('/legacy/landing.html')
      .then((response) => response.text())
      .then((html) => {
        if (active) setMarkup(extractLandingMarkup(html));
      })
      .catch(() => {
        if (active) setMarkup({ body: '', styles: '' });
      });

    return () => {
      active = false;
    };
  }, []);

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
      <style>{markup.styles}</style>
      <div onClickCapture={handleClick} dangerouslySetInnerHTML={{ __html: markup.body }} />
    </>
  );
}

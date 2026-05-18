/**
 * ShareSuccessModal — 인스타 스토리 공유 후 안내 모달.
 *
 * 인스타는 외부 앱에서 자동으로 Link Sticker를 박지 못해서, 사용자가
 * 스토리 편집 화면에서 직접 추가해야 한다. 그 동선을 안내하는 모달.
 */

import { useState } from 'react';
import { X, Copy, Check } from 'lucide-react';
import './ShareSuccessModal.css';

type Props = {
  url: string;
  onClose: () => void;
};

export default function ShareSuccessModal({ url, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore — 토스트 띄우기엔 부담이라 조용히 실패
    }
  };

  return (
    <div className="share-modal__backdrop" onClick={onClose} role="presentation">
      <div
        className="share-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="share-modal-title"
      >
        <button
          type="button"
          className="share-modal__close"
          onClick={onClose}
          aria-label="닫기"
        >
          <X size={20} />
        </button>

        <h3 id="share-modal-title" className="share-modal__title">
          스토리에 올렸나요?
        </h3>
        <p className="share-modal__body">
          편집 화면에서 <strong>스티커 → 🔗 링크</strong> 를 눌러서 아래 URL을 붙여주세요.
          친구가 스토리를 탭하면 결과 페이지로 바로 들어올 수 있어요.
        </p>

        <div className="share-modal__url">
          <span className="share-modal__url-text">{url}</span>
          <button
            type="button"
            className="share-modal__copy"
            onClick={handleCopy}
            aria-label="URL 복사"
          >
            {copied ? <Check size={16} strokeWidth={3} /> : <Copy size={16} />}
            <span>{copied ? '복사됨' : '복사'}</span>
          </button>
        </div>

        <button type="button" className="share-modal__done" onClick={onClose}>
          확인
        </button>
      </div>
    </div>
  );
}

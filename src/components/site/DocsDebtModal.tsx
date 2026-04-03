import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import styles from './DocsDebtModal.module.css';

const IDLE_MS = 30_000; // 30 seconds of inactivity
const DISMISS_KEY = 'pl_docs_debt_modal_dismissed';

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={styles.pointIcon}
      style={{ color: '#0ea5e9' }}
    >
      <path
        opacity="0.4"
        d="M1.25 12C1.25 6.063 6.063 1.25 12 1.25S22.75 6.063 22.75 12 17.937 22.75 12 22.75 1.25 17.937 1.25 12Z"
        fill="currentColor"
      />
      <path
        d="M12 7a1 1 0 0 1 1 1v3.586l1.707 1.707a1 1 0 0 1-1.414 1.414l-2-2A1 1 0 0 1 11 12V8a1 1 0 0 1 1-1Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={styles.pointIcon}
      style={{ color: '#f59e0b' }}
    >
      <path
        opacity="0.4"
        d="M14.911 3.965C14.083 2.946 13.185 2.25 12 2.25c-1.185 0-2.083.696-2.911 1.715-.618.76-1.27 1.791-2.033 3.06l-.8 1.346-1.925 3.245-.048.08C3.135 13.634 2.228 15.162 1.724 16.395c-.514 1.255-.699 2.41-.1 3.468l.118.192c.619.92 1.651 1.312 2.907 1.499C5.967 21.75 7.747 21.75 10.002 21.75h13.996c2.255 0 4.035 0 5.353-.196 1.339-.2 2.425-.633 3.025-1.691l.103-.2c.472-1.002.279-2.092-.203-3.269-.383-.938-.999-2.046-1.777-3.375l-.83-1.403-1.925-3.245-.046-.078C16.595 6.434 15.723 4.963 14.911 3.965Z"
        fill="currentColor"
      />
      <path
        d="M11 17v-4.5a1 1 0 1 1 2 0V17a1 1 0 1 1-2 0ZM11 9v-.012a1 1 0 1 1 2 0V9a1 1 0 1 1-2 0Z"
        fill="currentColor"
      />
    </svg>
  );
}

function EnvelopeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={styles.pointIcon}
      style={{ color: '#84cc16' }}
    >
      <path
        d="M1.268 10.662c.031-1.466.057-2.677.227-3.658l2.249 1.157c-.1-.035-.178-.038-.248 0-.147.08-.157.283-.176.689a35 35 0 0 0-.057 1.93 68 68 0 0 0 0 2.44c.034 1.56.059 2.619.2 3.434.134.767.356 1.224.737 1.605.377.378.84.604 1.633.742.838.146 1.931.176 3.534.216 1.922.048 3.342.048 5.264 0 1.603-.04 2.696-.07 3.535-.216.793-.138 1.255-.365 1.632-.742.381-.382.603-.838.737-1.606.141-.815.167-1.874.2-3.434.02-.97.02-1.471 0-2.44a35 35 0 0 0-.057-1.93c-.02-.405-.03-.608-.176-.689-.07-.038-.148-.035-.248 0l2.249-1.158c.17.982.196 2.193.227 3.658l.002.075a68 68 0 0 1 0 2.526l-.002.075c-.031 1.466-.057 2.677-.227 3.658-.182 1.045-.541 1.921-1.29 2.672-.754.755-1.643 1.115-2.706 1.3-1.001.174-2.243.205-3.752.243l-.075.002c-1.956.05-3.409.05-5.365 0l-.075-.001c-1.51-.039-2.751-.07-3.752-.244-1.063-.185-1.952-.545-2.706-1.3-.75-.751-1.108-1.627-1.29-2.672-.17-.981-.196-2.192-.227-3.658l-.002-.075a68 68 0 0 1 0-2.526l.002-.075Z"
        fill="currentColor"
      />
      <path
        opacity="0.4"
        d="M9.319 2.787a68 68 0 0 1 5.364 0l.075.001c1.51.039 2.751.07 3.752.244.37.064.72.15 1.05.267a1 1 0 0 1 .25.096c.516.214.982.513 1.406.937.749.751 1.108 1.627 1.29 2.672l-2.25 1.157a1 1 0 0 1-.44.226l-4.235 2.4c-1.3.736-2.4 1.213-3.58 1.213-1.182 0-2.28-.477-3.58-1.213l-4.236-2.4a1 1 0 0 1-.44-.226L1.496 7.004c.182-1.045.54-1.921 1.29-2.672.46-.462.953-.756 1.468-.97a1 1 0 0 1 .24-.09c.33-.117.68-.203 1.05-.267 1.001-.174 2.243-.205 3.752-.243l.075-.002Z"
        fill="currentColor"
      />
    </svg>
  );
}

interface DocsDebtModalProps {
  forceShow?: boolean;
}

export default function DocsDebtModal({ forceShow = false }: DocsDebtModalProps) {
  const [visible, setVisible] = useState(forceShow);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // storage full or unavailable
    }
  }, []);

  // Sync with forceShow prop changes
  useEffect(() => {
    if (forceShow) setVisible(true);
  }, [forceShow]);

  useEffect(() => {
    // Skip idle timer if using forceShow
    if (forceShow) return;

    // Don't show if already dismissed this session
    try {
      if (sessionStorage.getItem(DISMISS_KEY)) return;
    } catch {
      // proceed if storage unavailable
    }

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setVisible(true), IDLE_MS);
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'] as const;
    events.forEach((e) => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [forceShow]);

  // Close on Escape
  useEffect(() => {
    if (!visible) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [visible, dismiss]);

  // Lock body scroll
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  if (!visible) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get('email') as string;
    const params = email ? `?email=${encodeURIComponent(email.trim())}` : '';
    dismiss();
    window.location.href = `/free-tools/docs-debt-quiz${params}`;
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) dismiss();
  };

  return createPortal(
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className={styles.wrapper}>
        <div className={styles.card}>
          <button
            className={styles.close}
            onClick={dismiss}
            aria-label="Close"
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <span className={styles.kicker}>Docs health check</span>
          <h1 className={styles.heading}>
            Your help center is out of date.
          </h1>
          <p className={styles.bodyText}>
            You know it. Your support team knows it. Your customers definitely
            know it.
          </p>
          <p className={styles.bodyText}>
            Take a minute to find out how bad it is, and get a free checklist to
            fix it.
          </p>

          <div className={styles.points}>
            <div className={styles.point}>
              <ClockIcon />
              <span className={styles.pointText}>7 questions, 1 minute</span>
            </div>
            <div className={styles.point}>
              <WarningIcon />
              <span className={styles.pointText}>
                See where you actually stand
              </span>
            </div>
            <div className={styles.point}>
              <EnvelopeIcon />
              <span className={styles.pointText}>
                Get a checklist to fix it this week
              </span>
            </div>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="you@company.com"
              required
              className={styles.emailInput}
              autoComplete="email"
            />
            <button type="submit" className={styles.cta}>
              Take the Quiz
            </button>
          </form>

          <p className={styles.disclaimer}>
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}

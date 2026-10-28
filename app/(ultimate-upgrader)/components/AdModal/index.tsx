'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

// ID ютуб-видео для «рекламы». Поменяй на свой: youtu.be/XXXX -> XXXX.
const YT_ID = 'DQa3seN3IKM';

interface YTPlayer {
  destroy?: () => void;
}
interface YTNamespace {
  Player: new (
    el: string | HTMLElement,
    opts: { events: { onStateChange: (e: { data: number }) => void } }
  ) => YTPlayer;
}
type YTWindow = Window & { YT?: YTNamespace; onYouTubeIframeAPIReady?: () => void };

/**
 * Рекламная модалка (гэг): всплывает при «займе у бабушки».
 * Пользователь её не закрывает (ни крестика, ни клика по фону), перемотки нет —
 * она закрывается сама, когда видео досмотрено до конца.
 */
export default function AdModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [title, setTitle] = useState('Реклама');
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // название видео через oEmbed (с фолбэком)
  useEffect(() => {
    if (!open) return;
    let alive = true;
    fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${YT_ID}&format=json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (alive && d && typeof d.title === 'string') setTitle(d.title);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [open]);

  // автозакрытие по окончании видео (IFrame Player API)
  useEffect(() => {
    if (!open) return;
    const w = window as YTWindow;
    let player: YTPlayer | undefined;
    const setup = () => {
      if (!w.YT) return;
      try {
        player = new w.YT.Player('ad-yt-frame', {
          events: {
            onStateChange: (e) => {
              if (e.data === 0) onCloseRef.current(); // 0 = ENDED
            },
          },
        });
      } catch {}
    };
    if (w.YT && w.YT.Player) {
      setup();
    } else {
      const prev = w.onYouTubeIframeAPIReady;
      w.onYouTubeIframeAPIReady = () => {
        prev?.();
        setup();
      };
      if (!document.getElementById('yt-iframe-api')) {
        const s = document.createElement('script');
        s.id = 'yt-iframe-api';
        s.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(s);
      }
    }
    return () => {
      try {
        player?.destroy?.();
      } catch {}
    };
  }, [open]);

  if (!open) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const src =
    `https://www.youtube.com/embed/${YT_ID}` +
    `?autoplay=1&mute=1&controls=0&disablekb=1&modestbranding=1&rel=0&playsinline=1&enablejsapi=1` +
    `&origin=${encodeURIComponent(origin)}`;

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Реклама">
      <div className={styles.box}>
        <div className={styles.label}>Реклама от спонсоров</div>
        <div className={styles.vidTitle}>{title}</div>
        <div className={styles.video}>
          <iframe
            id="ad-yt-frame"
            className={styles.frame}
            src={src}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
          {/* прозрачный блокер: нельзя поставить на паузу / кликнуть логотип ютуба */}
          <div className={styles.block} aria-hidden="true" />
        </div>
        <div className={styles.note}>Перемотки нет. Закроется сама, когда досмотришь.</div>
      </div>
    </div>
  );
}

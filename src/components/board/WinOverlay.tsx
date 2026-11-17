import { useEffect, useRef } from 'react';
import { tr } from '../../i18n/tr';
interface Props {
  stars: number;
  moves: number;
  hints: number;
  nextLabel?: string;
  completed: boolean;
  solvedCount: number;
  total: number;
  onNext?: () => void;
  onBack: () => void;
  onReplay: () => void;
}
export function WinOverlay({
  stars,
  moves,
  hints,
  nextLabel,
  completed,
  solvedCount,
  total,
  onNext,
  onBack,
  onReplay,
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (dialog?.showModal) dialog.showModal();
    else dialog?.setAttribute('open', '');
    return () => dialog?.close?.();
  }, []);
  return (
    <dialog ref={ref} className="win-dialog card" aria-labelledby="win-title" onCancel={onBack}>
      <div className="win__emoji" aria-hidden>
        🎉
      </div>
      <h2 id="win-title">{completed ? 'Bütün bulmacalar tamamlandı!' : tr.win.title}</h2>
      <p>
        {completed
          ? 'Aile bir arada, bayram sofrası hazır. Bayramın kutlu olsun! ☕'
          : 'Herkes yerini buldu. Bütün ipuçları sağlandı! ☕'}
      </p>
      <div className="win__stars" aria-label={`${stars} yıldız`}>
        {[1, 2, 3].map((i) => (
          <span key={i} className={i <= stars ? 'star star--on' : 'star'}>
            ★
          </span>
        ))}
      </div>
      <p className="muted win__moves">
        Hamle: {moves} · Yardım: {hints}
        <br />
        Tamamlanan: {solvedCount}/{total}
      </p>
      <div className="win__actions">
        {onNext && (
          <button className="btn btn--block" onClick={onNext} autoFocus>
            {nextLabel ?? tr.win.nextLevel}
          </button>
        )}
        <button className="btn btn--ghost btn--block" onClick={onBack} autoFocus={!onNext}>
          {tr.win.backToLevels}
        </button>
        <button className="btn btn--ghost btn--block" onClick={onReplay}>
          Yeniden oyna
        </button>
      </div>
    </dialog>
  );
}

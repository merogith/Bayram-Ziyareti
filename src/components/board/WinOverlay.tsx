import { tr } from '../../i18n/tr';

interface Props {
  stars: number;
  moves: number;
  onNext?: () => void;
  onBack: () => void;
}

export function WinOverlay({ stars, moves, onNext, onBack }: Props) {
  return (
    <div className="win" role="dialog" aria-label={tr.win.title}>
      <div className="win__card card">
        <div className="win__emoji" aria-hidden>
          🎉
        </div>
        <h2>{tr.win.title}</h2>
        <p className="muted">{tr.win.subtitle}</p>
        <div className="win__stars" aria-label={`${stars} yıldız`}>
          {[1, 2, 3].map((i) => (
            <span key={i} className={i <= stars ? 'star star--on' : 'star'}>
              ★
            </span>
          ))}
        </div>
        <p className="muted win__moves">
          {tr.movesLabel}: {moves}
        </p>
        <div className="win__actions">
          {onNext && (
            <button className="btn btn--block" onClick={onNext}>
              {tr.win.nextLevel}
            </button>
          )}
          <button className="btn btn--ghost btn--block" onClick={onBack}>
            {tr.win.backToLevels}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useNavigate, useParams } from 'react-router-dom';
import { chapterById, getLevel } from '../../content';
import { useProgress, isLevelUnlocked } from '../../store/progressStore';
import { tr } from '../../i18n/tr';
import './nav.css';

export function LevelSelect() {
  const { chapterId = '' } = useParams();
  const navigate = useNavigate();
  const solved = useProgress((s) => s.solvedLevels);
  const chapter = chapterById.get(chapterId);

  if (!chapter) {
    return (
      <div className="screen center">
        <p>Bölüm bulunamadı.</p>
        <button className="btn" onClick={() => navigate('/modes')}>
          {tr.back}
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="appbar">
        <button className="iconbtn" onClick={() => navigate('/modes')} aria-label={tr.back}>
          ‹
        </button>
        <h1>
          {chapter.emoji} {chapter.title}
        </h1>
        <span style={{ width: 44 }} />
      </header>
      <div className="screen">
        <div className="levelgrid">
          {chapter.levelIds.map((id, i) => {
            const level = getLevel(id);
            const unlocked = isLevelUnlocked(chapter.levelIds, i, solved);
            const rec = solved[id];
            return (
              <button
                key={id}
                className={`levelcard card ${unlocked ? '' : 'levelcard--locked'}`}
                disabled={!unlocked}
                onClick={() => unlocked && navigate(`/play/${id}`)}
                aria-label={`${tr.level} ${i + 1}: ${level?.title ?? ''}${unlocked ? '' : ' — ' + tr.locked}`}
              >
                <span className="levelcard__num">{i + 1}</span>
                <span className="levelcard__title">{level?.title}</span>
                {unlocked ? (
                  <span className="levelcard__stars">
                    {[1, 2, 3].map((s) => (
                      <span key={s} className={rec && s <= rec.stars ? 'star star--on' : 'star'}>
                        ★
                      </span>
                    ))}
                  </span>
                ) : (
                  <span className="levelcard__lock" aria-hidden>
                    🔒
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

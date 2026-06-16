import { useNavigate } from 'react-router-dom';
import { chapters } from '../../content';
import { useProgress } from '../../store/progressStore';
import { tr } from '../../i18n/tr';
import './nav.css';

export function ChapterList() {
  const navigate = useNavigate();
  const solved = useProgress((s) => s.solvedLevels);

  return (
    <>
      <header className="appbar">
        <button className="iconbtn" onClick={() => navigate('/')} aria-label={tr.back}>
          ‹
        </button>
        <h1>{tr.pickMode}</h1>
        <span style={{ width: 44 }} />
      </header>
      <div className="screen">
        {chapters.map((c) => {
          const done = c.levelIds.filter((id) => id in solved).length;
          return (
            <button key={c.id} className="chaptercard card" onClick={() => navigate(`/chapter/${c.id}`)}>
              <span className="chaptercard__emoji" aria-hidden>
                {c.emoji}
              </span>
              <span className="chaptercard__body">
                <span className="chaptercard__title">{c.title}</span>
                <span className="chaptercard__blurb muted">{c.blurb}</span>
                <span className="chaptercard__prog">
                  {done}/{c.levelIds.length} {tr.solved.toLowerCase()}
                </span>
              </span>
              <span className="chaptercard__chevron">›</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

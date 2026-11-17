import { useNavigate } from 'react-router-dom';
import { allLevels } from '../../content';
import { useProgress, progressStorageAvailable } from '../../store/progressStore';
import { tr } from '../../i18n/tr';
import './nav.css';

export function HomeScreen() {
  const navigate = useNavigate();
  const solved = useProgress((s) => s.solvedLevels);
  const drafts = useProgress((s) => s.drafts);
  const completed = allLevels.filter((l) => solved[l.id]).length;
  const resume = allLevels.find((l) => drafts[l.id]) ?? allLevels.find((l) => !solved[l.id]);
  return (
    <div className="home">
      <div className="home__hero">
        <div className="home__emoji" aria-hidden>
          🏡☕️
        </div>
        <h1 className="home__title">{tr.appName}</h1>
        <p className="home__tagline">{tr.tagline}</p>
        <p className="home__intro muted">{tr.home.intro}</p>
      </div>
      <p>
        {completed === allLevels.length
          ? 'Bütün bulmacalar tamamlandı! Bayramın kutlu olsun. ☕'
          : `Tamamlanan: ${completed}/${allLevels.length}`}
      </p>
      <div className="home__actions">
        {resume && (
          <button
            className="btn btn--gold btn--block"
            onClick={() => navigate(`/play/${resume.id}`)}
          >
            {completed || Object.keys(drafts).length
              ? 'Kaldığın yerden devam'
              : 'İlk bulmacayı dene'}
          </button>
        )}
        <button className="btn btn--block" onClick={() => navigate('/modes')}>
          {tr.play} ▶
        </button>
        <button className="btn btn--ghost btn--block" onClick={() => navigate('/glossary')}>
          📖 Akrabalık Sözlüğü
        </button>
        <button className="btn btn--ghost btn--block" onClick={() => navigate('/settings')}>
          ⚙️ {tr.settings}
        </button>
      </div>
      {!progressStorageAvailable && (
        <p role="status">Tarayıcı kaydetmeye izin vermiyor. İlerleme bu oturumda tutulur.</p>
      )}
      <p className="home__foot muted">
        Bayramda herkes bir araya gelir, iş kime ne dendiğini bilmekte!
      </p>
    </div>
  );
}

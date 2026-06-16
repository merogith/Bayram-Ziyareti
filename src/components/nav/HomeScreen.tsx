import { useNavigate } from 'react-router-dom';
import { tr } from '../../i18n/tr';
import './nav.css';

export function HomeScreen() {
  const navigate = useNavigate();
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
      <div className="home__actions">
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
      <p className="home__foot muted">Bayramda herkes bir araya gelir, iş kime ne dendiğini bilmekte!</p>
    </div>
  );
}

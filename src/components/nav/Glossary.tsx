import { useNavigate } from 'react-router-dom';
import { kinshipLabels, tr } from '../../i18n/tr';
import type { KinshipTerm } from '../../types/puzzle';
import './nav.css';

const order: KinshipTerm[] = [
  'anne', 'baba', 'ogul', 'kiz', 'kardes', 'yegen', 'kuzen',
  'dede', 'nine', 'babaanne', 'anneanne', 'torun',
  'amca', 'dayi', 'hala', 'teyze', 'yenge', 'eniste',
  'gelin', 'damat', 'kayinvalide', 'kayinpeder', 'kayinco', 'gorumce', 'baldiz',
  'elti', 'bacanak', 'dunur',
];

export function Glossary() {
  const navigate = useNavigate();
  return (
    <>
      <header className="appbar">
        <button className="iconbtn" onClick={() => navigate('/')} aria-label={tr.back}>
          ‹
        </button>
        <h1>📖 Akrabalık Sözlüğü</h1>
        <span style={{ width: 44 }} />
      </header>
      <div className="screen">
        <ul className="glossary">
          {order.map((t) => (
            <li key={t} className="glossary__item card">
              <span className="glossary__term">{kinshipLabels[t].label}</span>
              <span className="glossary__desc muted">{kinshipLabels[t].desc}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

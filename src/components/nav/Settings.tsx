import { useNavigate } from 'react-router-dom';
import { useProgress } from '../../store/progressStore';
import { tr } from '../../i18n/tr';
import './nav.css';

export function Settings() {
  const navigate = useNavigate();
  const settings = useProgress((s) => s.settings);
  const update = useProgress((s) => s.updateSettings);
  const reset = useProgress((s) => s.reset);

  const rows: { key: keyof typeof settings; label: string }[] = [
    { key: 'sound', label: tr.settingsLabels.sound },
    { key: 'haptics', label: tr.settingsLabels.haptics },
    { key: 'reduceMotion', label: tr.settingsLabels.reduceMotion },
    { key: 'liveCheck', label: tr.settingsLabels.liveCheck },
  ];

  return (
    <>
      <header className="appbar">
        <button className="iconbtn" onClick={() => navigate('/')} aria-label={tr.back}>
          ‹
        </button>
        <h1>{tr.settings}</h1>
        <span style={{ width: 44 }} />
      </header>
      <div className="screen">
        <div className="card settings-list">
          {rows.map((r) => (
            <label key={r.key} className="settings-row">
              <span>{r.label}</span>
              <input
                type="checkbox"
                className="switch"
                checked={settings[r.key]}
                onChange={(e) => update({ [r.key]: e.target.checked })}
              />
            </label>
          ))}
        </div>
        <button
          className="btn btn--nar btn--block"
          onClick={() => {
            if (confirm(tr.settingsLabels.resetConfirm)) reset();
          }}
        >
          {tr.settingsLabels.reset}
        </button>
      </div>
    </>
  );
}

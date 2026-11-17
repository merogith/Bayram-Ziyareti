import { useEffect, useRef } from 'react';
import { kinshipLabels, tr } from '../../i18n/tr';
import { progressStorageAvailable, useProgress } from '../../store/progressStore';

export type HelpPanel = 'how' | 'glossary' | 'settings';
export function PlayHelp({ panel, onClose }: { panel: HelpPanel; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const settings = useProgress((s) => s.settings);
  const update = useProgress((s) => s.updateSettings);
  const title =
    panel === 'how' ? 'Nasıl oynanır?' : panel === 'glossary' ? 'Akrabalık Sözlüğü' : tr.settings;
  useEffect(() => {
    const dialog = ref.current;
    if (dialog?.showModal) dialog.showModal();
    else dialog?.setAttribute('open', '');
    return () => dialog?.close?.();
  }, []);
  return (
    <dialog
      ref={ref}
      className="play-help card"
      aria-labelledby="play-help-title"
      onCancel={onClose}
    >
      <h2 id="play-help-title">{title}</h2>
      {panel === 'how' && (
        <>
          <ol className="instructions">
            <li>İpuçlarını oku. Sarı çizgi eşleri, mavi çizgi ebeveyn ile çocuğunu bağlar.</li>
            <li>
              Bir kişiye, sonra bir kutuya dokun. Klavyede Tab ile ilerle, Enter veya Boşluk ile
              seç. Sürükleyip bırakmak da mümkün.
            </li>
            <li>
              Dolu kutuya tepsiden birini yerleştirirsen önceki kişi tepsiye döner. İki kutu
              arasında taşırken kişiler yer değiştirir. 📌 işaretli kişiler sabittir. Seçimi Escape
              ile iptal edebilirsin.
            </li>
            <li>
              “Kontrol et” doğru ve yanlış yerleri gösterir. “Bir yeri göster” bir kişiyi doğru
              konuma yerleştirir; yardım kullanımı yıldızı azaltır.
            </li>
          </ol>
          <p>
            Her ipucu sağlandığında bölüm tamamlanır. Yarım kalan bulmaca bu tarayıcıda kaydedilir.
            “Baştan” yalnızca bu bulmacayı temizler.
          </p>
          <p lang="en" className="english-guide">
            A Turkish kinship puzzle. Read the clues, select a person, then select a numbered slot.
            You can also drag. Gold lines join spouses; blue lines connect parents and children.
            Pinned people stay fixed. The glossary explains the family terms.
          </p>
        </>
      )}
      {panel === 'glossary' && (
        <ul className="glossary">
          {Object.entries(kinshipLabels).map(([term, item]) => (
            <li key={term} className="glossary__item">
              <strong>{item.label}</strong>
              <span>{item.desc}</span>
            </li>
          ))}
        </ul>
      )}
      {panel === 'settings' && (
        <>
          <div className="settings-list">
            {(['sound', 'haptics', 'reduceMotion', 'liveCheck'] as const).map((key) => (
              <label className="settings-row" key={key}>
                <span>{tr.settingsLabels[key]}</span>
                <input
                  type="checkbox"
                  className="switch"
                  checked={settings[key]}
                  onChange={(e) => update({ [key]: e.target.checked })}
                />
              </label>
            ))}
          </div>
          <p className="muted">
            İlerleme ve ayarlar bu tarayıcıya kaydedilir. Ana menüdeki Ayarlar bölümünden tüm
            ilerlemeyi sıfırlayabilirsin.
          </p>
        </>
      )}
      {!progressStorageAvailable && (
        <p role="status">
          Tarayıcı kaydetmeye izin vermiyor. Oynayabilirsin; ilerleme bu oturumda tutulur.
        </p>
      )}
      <button className="btn btn--block" onClick={onClose} autoFocus>
        {panel === 'how' ? 'Anladım, oynayalım' : 'Oyuna dön'}
      </button>
    </dialog>
  );
}

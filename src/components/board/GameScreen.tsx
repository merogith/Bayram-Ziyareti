import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { allLevels, getLevel, chapterById } from '../../content';
import { useGame } from '../../store/gameStore';
import { useProgress } from '../../store/progressStore';
import { playableSlots } from '../../engine/validate';
import { sfx } from '../../lib/feedback';
import { tr } from '../../i18n/tr';
import { Avatar } from '../Avatar';
import { PuzzleBoard, boardSize } from './PuzzleBoard';
import { TileTray } from './TileTray';
import { CluePanel } from './CluePanel';
import { WinOverlay } from './WinOverlay';
import { PlayHelp, type HelpPanel } from './PlayHelp';
import { useElementSize } from '../../hooks/useElementSize';
import './board.css';

const starsFor = (moves: number, slots: number, hints: number): number =>
  Math.max(1, Math.min(moves <= slots + 1 ? 3 : moves <= slots + 4 ? 2 : 1, 3 - hints));

export function GameScreen() {
  const { levelId = '' } = useParams();
  const navigate = useNavigate();
  const level = getLevel(levelId);
  const {
    level: loadedLevel,
    load,
    place,
    hint,
    reset,
    assignment,
    result,
    moves,
    hints,
  } = useGame();
  const settings = useProgress((s) => s.settings);
  const solved = useProgress((s) => s.solvedLevels);
  const recordSolve = useProgress((s) => s.recordSolve);
  const acknowledgeInstructions = useProgress((s) => s.acknowledgeInstructions);
  const [panel, setPanel] = useState<HelpPanel | null>(() =>
    useProgress.getState().hasSeenInstructions ? null : 'how',
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [message, setMessage] = useState('Bir kişi, sonra bir kutu seç.');
  const suppressClick = useRef(false);
  const recorded = useRef(false);
  const { ref: stageRef, size: stageSize } = useElementSize<HTMLDivElement>();

  useEffect(() => {
    if (level) {
      load(level);
      recorded.current = false;
      setSelectedId(null);
      setRevealed(false);
      setMessage('Bir kişi, sonra bir kutu seç.');
    }
  }, [level, load]);
  useEffect(() => {
    setRevealed(settings.liveCheck);
  }, [moves, settings.liveCheck]);
  useEffect(() => {
    if (result?.solved && level && loadedLevel?.id === level.id && !recorded.current) {
      recorded.current = true;
      sfx.win();
      recordSolve(level.id, starsFor(moves, playableSlots(level).length, hints), moves);
    }
  }, [result?.solved, level, loadedLevel, moves, hints, recordSolve]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
  );
  const scale = useMemo(
    () =>
      !level || !stageSize.width
        ? 1
        : Math.min((stageSize.width - 8) / boardSize(level).width, 1.1),
    [level, stageSize.width],
  );
  const trayPeople = useMemo(() => {
    if (!level) return [];
    const placed = new Set(Object.values(assignment));
    const fixed = new Set(level.slots.map((s) => s.fixedPersonId));
    return level.people.filter((p) => !placed.has(p.id) && !fixed.has(p.id));
  }, [level, assignment]);
  if (!level)
    return (
      <div className="screen center">
        <p>Bölüm bulunamadı.</p>
        <button className="btn" onClick={() => navigate('/modes')}>
          {tr.back}
        </button>
      </div>
    );

  const nextLevel = allLevels[allLevels.findIndex((l) => l.id === level.id) + 1];
  const nextChapter =
    nextLevel && nextLevel.chapterId !== level.chapterId
      ? chapterById.get(nextLevel.chapterId)
      : undefined;
  const activePerson = level.people.find((p) => p.id === activeId);
  const choosePerson = (id: string) => {
    if (suppressClick.current) return;
    setSelectedId(selectedId === id ? null : id);
    setMessage(
      selectedId === id
        ? 'Seçim iptal edildi.'
        : `${level.people.find((p) => p.id === id)?.name} seçildi. Şimdi bir kutu seç.`,
    );
  };
  const chooseSlot = (slotId: string) => {
    if (suppressClick.current) return;
    if (selectedId) {
      const changed = place(selectedId, slotId);
      if (changed) {
        sfx.drop();
        setMessage('Yerleşim güncellendi.');
      }
      setSelectedId(null);
    } else if (assignment[slotId]) choosePerson(assignment[slotId]);
    else setMessage('Önce aşağıdan bir kişi seç.');
  };
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    setSelectedId(null);
    const target = e.over?.id;
    if (target && place(String(e.active.id), target === 'tray' ? null : String(target))) {
      sfx.drop();
      setMessage('Yerleşim güncellendi.');
    } else setMessage('Yerleşim değişmedi. Numaralı, sabit olmayan bir kutuya bırak.');
    window.setTimeout(() => {
      suppressClick.current = false;
    }, 0);
  };
  const restart = () => {
    reset();
    recorded.current = false;
    setSelectedId(null);
    setRevealed(false);
    setMessage('Bulmaca baştan başladı.');
  };
  const closePanel = () => {
    acknowledgeInstructions();
    setPanel(null);
  };
  const solvedCount = allLevels.filter((l) => solved[l.id]).length;

  return (
    <div
      className="game"
      onKeyDown={(e) => {
        if (e.key === 'Escape' && !panel) {
          setSelectedId(null);
          setMessage('Seçim iptal edildi.');
        }
      }}
    >
      <header className="appbar">
        <button
          className="iconbtn"
          onClick={() => navigate(`/chapter/${level.chapterId}`)}
          aria-label={tr.back}
        >
          ‹
        </button>
        <h1>{level.title}</h1>
        <button
          className="iconbtn"
          onClick={() => {
            if (
              !moves ||
              confirm('Bu bulmacadaki yerleşim temizlensin mi? Kazandığın yıldızlar kalır.')
            )
              restart();
          }}
          aria-label={tr.retry}
        >
          ↻
        </button>
      </header>
      <nav className="game__tools" aria-label="Oyun yardımı">
        <button onClick={() => setPanel('how')}>Nasıl oynanır?</button>
        <button onClick={() => setPanel('glossary')}>Sözlük</button>
        <button onClick={() => setPanel('settings')}>Ayarlar</button>
      </nav>
      <DndContext
        accessibility={{
          screenReaderInstructions: {
            draggable:
              'Kişiyi Enter veya Boşluk ile seç. Tab ile bir kutuya ilerle ve Enter ile yerleştir. Escape seçimi iptal eder.',
          },
        }}
        sensors={sensors}
        collisionDetection={(args) =>
          args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args)
        }
        onDragStart={(e) => {
          suppressClick.current = true;
          setActiveId(String(e.active.id));
          sfx.pick();
        }}
        onDragEnd={onDragEnd}
        onDragCancel={() => {
          setActiveId(null);
          suppressClick.current = false;
        }}
      >
        <div className="game__stage" ref={stageRef}>
          {level.intro && <p className="game__intro">{level.intro}</p>}
          <div className="game__board-wrap">
            <PuzzleBoard
              level={level}
              assignment={assignment}
              perSlot={result?.perSlot ?? {}}
              showCheck={revealed}
              scale={scale}
              selectedId={selectedId}
              onChoose={chooseSlot}
            />
          </div>
        </div>
        <div className="game__bottom">
          <p className="game__status" role="status">
            {message}
          </p>
          <TileTray
            people={trayPeople}
            selectedId={selectedId}
            onSelect={choosePerson}
            canReturn={!!selectedId && Object.values(assignment).includes(selectedId)}
            onReturn={() => {
              if (selectedId) place(selectedId, null);
              setSelectedId(null);
              setMessage('Kişi geri alındı.');
            }}
          />
          <div className="game__actions">
            <button
              className="btn btn--gold game__check"
              onClick={() => {
                setRevealed(true);
                setMessage(
                  result?.solved
                    ? 'Bütün yerler doğru!'
                    : '✓ doğru, × yanlış. İpuçlarını kullanarak tekrar dene.',
                );
              }}
            >
              {tr.check}
            </button>
            <button
              className="btn btn--ghost game__check"
              onClick={() => {
                setSelectedId(null);
                setMessage(hint() ?? 'Bütün kişiler doğru konumda.');
              }}
            >
              Bir yeri göster
            </button>
          </div>
          <p className="game__stats">
            Hamle: {moves} · Yardım: {hints} ·{' '}
            {settings.liveCheck ? 'Anlık kontrol açık' : 'Kontrol etmek yıldızı etkilemez'}
          </p>
          <CluePanel clues={level.clues} satisfied={result?.satisfiedClues ?? {}} />
        </div>
        <DragOverlay dropAnimation={null}>
          {activePerson && (
            <div className="drag-overlay">
              <Avatar avatar={activePerson.avatar} size={60} name={activePerson.name} />
            </div>
          )}
        </DragOverlay>
      </DndContext>
      {result?.solved && loadedLevel?.id === level.id && !panel && (
        <WinOverlay
          stars={starsFor(moves, playableSlots(level).length, hints)}
          moves={moves}
          hints={hints}
          completed={solvedCount === allLevels.length}
          solvedCount={solvedCount}
          total={allLevels.length}
          nextLabel={nextChapter ? `Sıradaki: ${nextChapter.title}` : undefined}
          onNext={nextLevel ? () => navigate(`/play/${nextLevel.id}`) : undefined}
          onBack={() => navigate(`/chapter/${level.chapterId}`)}
          onReplay={restart}
        />
      )}
      {panel && <PlayHelp panel={panel} onClose={closePanel} />}
    </div>
  );
}

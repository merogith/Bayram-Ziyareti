import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  TouchSensor,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { getLevel, chapterById } from '../../content';
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
import { useElementSize } from '../../hooks/useElementSize';
import './board.css';

const starsFor = (moves: number, slots: number): number => {
  if (moves <= slots + 1) return 3;
  if (moves <= slots + 4) return 2;
  return 1;
};

export function GameScreen() {
  const { levelId = '' } = useParams();
  const navigate = useNavigate();
  const level = getLevel(levelId);

  const { load, place, reset, assignment, result, moves } = useGame();
  const settings = useProgress((s) => s.settings);
  const recordSolve = useProgress((s) => s.recordSolve);

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const recorded = useRef(false);
  // Suppress the click that some browsers fire right after a real drag.
  const justDragged = useRef(false);

  const { ref: stageRef, size: stageSize } = useElementSize<HTMLDivElement>();

  useEffect(() => {
    if (level) {
      load(level);
      recorded.current = false;
      setRevealed(false);
      setSelected(null);
    }
  }, [level, load]);

  useEffect(() => {
    setRevealed(settings.liveCheck);
  }, [moves, settings.liveCheck]);

  useEffect(() => {
    if (result?.solved && level && !recorded.current) {
      recorded.current = true;
      const stars = starsFor(moves, playableSlots(level).length);
      sfx.win();
      recordSolve(level.id, stars, moves);
    }
  }, [result?.solved, level, moves, recordSolve]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 60, tolerance: 6 } }),
    useSensor(KeyboardSensor),
  );

  // Pointer-first collision: a face dropped over a slot lands there; a face
  // dropped in empty space returns to the tray instead of snapping to the
  // nearest far slot (the old closestCenter behaviour).
  const collision: CollisionDetection = (args) => {
    const within = pointerWithin(args);
    return within.length ? within : rectIntersection(args);
  };

  const scale = useMemo(() => {
    if (!level || !stageSize.width) return 1;
    const { width, height } = boardSize(level);
    const padW = stageSize.width - 8;
    const padH = stageSize.height - 8;
    return Math.min(padW / width, padH / height, 1.15);
  }, [level, stageSize]);

  const trayPeople = useMemo(() => {
    if (!level) return [];
    const placed = new Set(Object.values(assignment));
    const fixed = new Set(level.slots.map((s) => s.fixedPersonId).filter(Boolean));
    return level.people.filter((p) => !placed.has(p.id) && !fixed.has(p.id));
  }, [level, assignment]);

  if (!level) {
    return (
      <div className="screen center">
        <p>Bölüm bulunamadı.</p>
        <button className="btn" onClick={() => navigate('/')}>
          {tr.back}
        </button>
      </div>
    );
  }

  const chapter = chapterById.get(level.chapterId);
  const idx = chapter ? chapter.levelIds.indexOf(level.id) : -1;
  const nextId = chapter && idx >= 0 ? chapter.levelIds[idx + 1] : undefined;
  const activePerson = activeId ? level.people.find((p) => p.id === activeId) : undefined;
  const showCheck = revealed;

  const onDragStart = (e: DragStartEvent) => {
    setActiveId(String(e.active.id));
    setSelected(null);
    sfx.pick();
  };
  const onDragEnd = (e: DragEndEvent) => {
    setActiveId(null);
    justDragged.current = true;
    setTimeout(() => (justDragged.current = false), 200);
    const personId = String(e.active.id);
    const over = e.over?.id ? String(e.over.id) : null;
    if (!over) return;
    if (over === 'tray') {
      place(personId, null);
    } else {
      place(personId, over);
      sfx.drop();
    }
  };

  // ---- Tap-to-place (coexists with drag; both funnel through place()) ----
  const selectPerson = (personId: string) => {
    if (justDragged.current) return;
    setSelected((cur) => (cur === personId ? null : personId));
    if (selected !== personId) sfx.pick();
  };
  const tapSlot = (slotId: string) => {
    if (justDragged.current) return;
    if (selected) {
      place(selected, slotId);
      sfx.drop();
      setSelected(null);
    } else {
      const occupant = assignment[slotId];
      if (occupant) {
        setSelected(occupant);
        sfx.pick();
      }
    }
  };
  const tapTray = () => {
    if (justDragged.current) return;
    if (selected) {
      place(selected, null);
      setSelected(null);
    }
  };

  return (
    <div className="game">
      <header className="appbar">
        <button className="iconbtn" onClick={() => navigate(`/chapter/${level.chapterId}`)} aria-label={tr.back}>
          ‹
        </button>
        <h1>{level.title}</h1>
        <button className="iconbtn" onClick={reset} aria-label={tr.retry}>
          ↻
        </button>
      </header>

      <DndContext
        sensors={sensors}
        collisionDetection={collision}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      >
        <div className="game__stage" ref={stageRef}>
          {level.intro && <p className="game__intro">{level.intro}</p>}
          <div className="game__board-wrap">
            <PuzzleBoard
              level={level}
              assignment={assignment}
              perSlot={result?.perSlot ?? {}}
              showCheck={showCheck}
              scale={scale}
              selectedPersonId={selected}
              onSlotTap={tapSlot}
            />
          </div>
        </div>

        <div className="game__bottom">
          <TileTray
            people={trayPeople}
            selectedPersonId={selected}
            onSelect={selectPerson}
            onTrayTap={tapTray}
          />
          {!settings.liveCheck && (
            <button className="btn btn--gold game__check" onClick={() => setRevealed(true)}>
              {tr.check} ({moves} {tr.movesLabel.toLowerCase()})
            </button>
          )}
          <CluePanel clues={level.clues} satisfied={result?.satisfiedClues ?? {}} />
        </div>

        <DragOverlay dropAnimation={null}>
          {activePerson ? (
            <div className="drag-overlay">
              <Avatar
                avatar={activePerson.avatar}
                size={Math.round(58 * scale)}
                name={activePerson.name}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {result?.solved && (
        <WinOverlay
          stars={starsFor(moves, playableSlots(level).length)}
          moves={moves}
          onNext={nextId ? () => navigate(`/play/${nextId}`) : undefined}
          onBack={() => navigate(`/chapter/${level.chapterId}`)}
        />
      )}
    </div>
  );
}

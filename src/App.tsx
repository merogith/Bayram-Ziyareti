import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HomeScreen } from './components/nav/HomeScreen';
import { ChapterList } from './components/nav/ChapterList';
import { LevelSelect } from './components/nav/LevelSelect';
import { Settings } from './components/nav/Settings';
import { Glossary } from './components/nav/Glossary';
import { GameScreen } from './components/board/GameScreen';

export default function App() {
  return (
    <HashRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/modes" element={<ChapterList />} />
          <Route path="/chapter/:chapterId" element={<LevelSelect />} />
          <Route path="/play/:levelId" element={<GameScreen />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

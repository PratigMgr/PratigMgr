import React, { useRef, useState } from 'react';
import ScrollProgress from './components/ScrollProgress';
import IconSprite from './components/IconSprite';
import Loader from './components/Loader';
import Sidebar from './components/Sidebar';
import About from './components/About';
import AboutMe from './components/AboutMe';
import Capabilities from './components/Capabilities';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Writing from './components/Writing';
import Contact from './components/Contact';
import Footer from './components/Footer';
import SnakeGame from './components/SnakeGame';
import './App.css';

// Top-level layout — a fixed sidebar (desktop) / top bar (mobile) owns
// navigation and identity, the rest is a stack of sections in one column.
// The site is dark-mode only now — no theme switching — with a "Game mode"
// toggle in its place that overlays a playable snake game on top of the page.
function App() {
  const [sidebarHidden, setSidebarHidden] = useState(false);
  const [gameMode, setGameMode] = useState(false);
  // Remembers whatever the sidebar's visibility was right before entering
  // game mode, so exiting restores it instead of always forcing it open.
  const sidebarHiddenBeforeGame = useRef(false);
  // Gates the headline typing + ASCII portrait entrance so they don't fire
  // until the Loader overlay has actually finished, instead of racing it.
  const [introDone, setIntroDone] = useState(false);

  const enterGameMode = () => {
    sidebarHiddenBeforeGame.current = sidebarHidden;
    setSidebarHidden(true);
    setGameMode(true);
  };

  const exitGameMode = () => {
    setGameMode(false);
    setSidebarHidden(sidebarHiddenBeforeGame.current);
  };

  return (
    <div className="app" data-sidebar={sidebarHidden ? 'hidden' : 'visible'}>
      <Loader onDone={() => setIntroDone(true)} />
      <IconSprite />
      <ScrollProgress />
      <div className="layout">
        <Sidebar
          gameMode={gameMode}
          onToggleGameMode={() => (gameMode ? exitGameMode() : enterGameMode())}
          sidebarHidden={sidebarHidden}
          onToggleSidebar={() => setSidebarHidden((current) => !current)}
        />
        <div className="layout__content">
          <main>
            <About start={introDone} />
            <AboutMe />
            <Capabilities />
            <Skills />
            <Experience />
            <Projects />
            <Writing />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
      <SnakeGame active={gameMode} onExit={exitGameMode} />
    </div>
  );
}

export default App;

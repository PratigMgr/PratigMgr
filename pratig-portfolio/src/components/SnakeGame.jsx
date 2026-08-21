import React, { useEffect, useReducer, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './SnakeGame.css';

const CELL = 20; // px per grid cell
const TICK_MS = 130; // ms per snake step
const TOTAL_APPLES = 10;
const SPAWN_CLEAR = { x0: 2, x1: 13, y0: 3, y1: 9 }; // grid cells force-cleared for a safe spawn
const LASER_COUNT_BASE = 4; // beams on the first activation
const LASER_COUNT_MAX = 14; // hard cap so it never gets absurd
const LASER_TICK_MS = 100; // resolution of the laser-schedule/countdown clock
const LASER_WARN_MS = 1800; // red alert glow + countdown before beams fire
const LASER_ON_MS = 2200; // how long the beams stay live once fired
const LASER_PERIOD_START_MS = 30000; // 1st countdown runs 30s...
const LASER_PERIOD_STEP_MS = 5000; // ...each full countdown after that starts 5s shorter...
const LASER_PERIOD_MIN_MS = 5000; // ...down to a floor of 5s, where it then repeats forever.
const SCROLL_EASE = 0.18; // smooth-scroll catch-up rate, applied every animation frame

// How long, in ms, a laser cycle's countdown runs for, given how many
// full countdown rounds have already completed this run.
function currentLaserPeriodMs(cyclesCompleted) {
  const period = LASER_PERIOD_START_MS - cyclesCompleted * LASER_PERIOD_STEP_MS;
  return Math.max(LASER_PERIOD_MIN_MS, period);
}

// Walks every visible text node on the page (skipping the game overlay,
// and anything marked as an icon/logo/image rather than readable copy —
// e.g. the split-flap "airport board" title, which is built out of
// character spans but reads as a logo) and turns each individual WORD's
// pixel box into wall cells. Only the actual ink of the letters counts —
// not full line-height, not the gaps between words, not surrounding
// boxes — so the snake only dies when it hits an exact word.
// Rasterizes a single DOM Range (one character) into grid cells and adds
// them to the given wall set. Shared by the static page-text pass and the
// live marquee pass so both use identical, letter-accurate hitboxes.
function addRangeToWalls(range, cellSize, scrollX, scrollY, walls) {
  const rects = range.getClientRects();
  for (const rect of rects) {
    if (rect.width < 1 || rect.height < 1) continue;
    // Trim a sliver off each glyph's box so the wall hugs the visible
    // letter shape rather than its full advance width/line-height.
    const insetY = rect.height * 0.16;
    const insetX = Math.min(rect.width * 0.16, 2.5);
    const left = rect.left + scrollX + insetX;
    const top = rect.top + scrollY + insetY;
    const right = rect.right + scrollX - insetX;
    const bottom = rect.bottom + scrollY - insetY;
    const gx0 = Math.floor(left / cellSize);
    const gx1 = Math.floor((right - 1) / cellSize);
    const gy0 = Math.floor(top / cellSize);
    const gy1 = Math.floor((bottom - 1) / cellSize);
    for (let gy = gy0; gy <= gy1; gy += 1) {
      for (let gx = gx0; gx <= gx1; gx += 1) {
        walls.add(`${gx},${gy}`);
      }
    }
  }
}

function computeWalls(cellSize) {
  const walls = new Set();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const docWidth = document.documentElement.scrollWidth;
  const docHeight = document.documentElement.scrollHeight;

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (
        parent.closest(
          '.snake-game-root, script, style, svg, [role="img"], [aria-hidden="true"]'
        )
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      const cs = window.getComputedStyle(parent);
      if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') {
        return NodeFilter.FILTER_REJECT;
      }
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const range = document.createRange();
  let node = walker.nextNode();
  while (node) {
    const text = node.nodeValue;
    // Letter-by-letter, not word-by-word: every individual character gets
    // its own hitbox, so the wall follows the true shape of the text.
    for (let i = 0; i < text.length; i += 1) {
      if (/\s/.test(text[i])) continue;
      range.setStart(node, i);
      range.setEnd(node, i + 1);
      addRangeToWalls(range, cellSize, scrollX, scrollY, walls);
    }
    node = walker.nextNode();
  }

  mergeIconWalls(walls, cellSize);

  return { walls, docWidth, docHeight };
}

// The skills marquee scrolls continuously via CSS animation, so its letters
// never sit still — there's no fixed position to bake into the static wall
// set above. Instead this gets called fresh on every game tick to rasterize
// each letter's *current* on-screen position into a live, letter-accurate
// wall set (aria-hidden is intentionally ignored here — it's decorative for
// screen readers, but very much solid for the snake).
function computeMarqueeWalls(cellSize) {
  const walls = new Set();
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const spans = document.querySelectorAll('.marquee__group span');
  if (!spans.length) return walls;

  const range = document.createRange();
  spans.forEach((span) => {
    const textNode = span.firstChild;
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) return;
    const text = textNode.nodeValue || '';
    for (let i = 0; i < text.length; i += 1) {
      if (/\s/.test(text[i])) continue;
      range.setStart(textNode, i);
      range.setEnd(textNode, i + 1);
      addRangeToWalls(range, cellSize, scrollX, scrollY, walls);
    }
  });
  return walls;
}

// The "Hi, Pratig, Here" headline types itself out letter-by-letter via
// TextType, which (for good reason — screen readers should read the
// aria-label, not a pile of per-letter spans) wraps every rendered glyph in
// an aria-hidden block. That's exactly why the static pass above skips it.
// This targets those glyph spans directly so the headline is just as solid
// as any other text on the page. Kept in the "live" pool (recomputed every
// tick, not baked into the static set) since it's still typing/settling
// when the game can start.
function computeGreetingWalls(cellSize, walls) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const chars = document.querySelectorAll(
    '.greeting .texttype__char, .greeting .greeting__i-stem'
  );
  chars.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width < 1 || rect.height < 1) return;
    const cs = window.getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.opacity === '0') return;
    const insetY = rect.height * 0.16;
    const insetX = Math.min(rect.width * 0.16, 2.5);
    const left = rect.left + scrollX + insetX;
    const top = rect.top + scrollY + insetY;
    const right = rect.left + scrollX + rect.width - insetX;
    const bottom = rect.top + scrollY + rect.height - insetY;
    const gx0 = Math.floor(left / cellSize);
    const gx1 = Math.floor((right - 1) / cellSize);
    const gy0 = Math.floor(top / cellSize);
    const gy1 = Math.floor((bottom - 1) / cellSize);
    for (let gy = gy0; gy <= gy1; gy += 1) {
      for (let gx = gx0; gx <= gx1; gx += 1) {
        walls.add(`${gx},${gy}`);
      }
    }
  });
}

// Everything that keeps moving or changing after the game starts — the
// scrolling marquee, the typing/settling greeting headline — gets its
// walls rebuilt fresh every tick instead of once at game start.
function computeLiveWalls(cellSize) {
  const walls = computeMarqueeWalls(cellSize);
  computeGreetingWalls(cellSize, walls);
  return walls;
}
// etc.) count as solid obstacles too — touching one kills the snake just
// like touching a word does. Skips anything inside the game overlay itself
// and the invisible 0x0 <svg> that only exists to hold <symbol> defs.
function mergeIconWalls(walls, cellSize) {
  const scrollX = window.scrollX;
  const scrollY = window.scrollY;
  const nodes = document.querySelectorAll('img, svg');

  nodes.forEach((el) => {
    if (el.closest('.snake-game-root')) return;
    const rect = el.getBoundingClientRect();
    if (rect.width < 4 || rect.height < 4) return;
    const cs = window.getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || cs.opacity === '0') return;

    // Trim a small inset so the wall hugs the visible glyph/artwork rather
    // than its full padded bounding box.
    const insetX = rect.width * 0.12;
    const insetY = rect.height * 0.12;
    const left = rect.left + scrollX + insetX;
    const top = rect.top + scrollY + insetY;
    const right = rect.left + scrollX + rect.width - insetX;
    const bottom = rect.top + scrollY + rect.height - insetY;
    const gx0 = Math.floor(left / cellSize);
    const gx1 = Math.floor((right - 1) / cellSize);
    const gy0 = Math.floor(top / cellSize);
    const gy1 = Math.floor((bottom - 1) / cellSize);
    for (let gy = gy0; gy <= gy1; gy += 1) {
      for (let gx = gx0; gx <= gx1; gx += 1) {
        walls.add(`${gx},${gy}`);
      }
    }
  });
}

// A laser beam picks a random open cell, then shoots out in both directions
// along a random axis (horizontal or vertical) until it hits a wall (a
// letter) or the edge of the world — so beams always run wall-to-wall
// through open space and never cut through the page's own text.
function castBeam(game) {
  for (let attempt = 0; attempt < 150; attempt += 1) {
    const gx = Math.floor(Math.random() * game.cols);
    const gy = Math.floor(Math.random() * game.rows);
    if (game.walls.has(`${gx},${gy}`)) continue;

    const horizontal = Math.random() < 0.5;
    const cells = [{ x: gx, y: gy }];
    if (horizontal) {
      let x = gx - 1;
      while (x >= 0 && !game.walls.has(`${x},${gy}`)) {
        cells.push({ x, y: gy });
        x -= 1;
      }
      x = gx + 1;
      while (x < game.cols && !game.walls.has(`${x},${gy}`)) {
        cells.push({ x, y: gy });
        x += 1;
      }
    } else {
      let y = gy - 1;
      while (y >= 0 && !game.walls.has(`${gx},${y}`)) {
        cells.push({ x: gx, y });
        y -= 1;
      }
      y = gy + 1;
      while (y < game.rows && !game.walls.has(`${gx},${y}`)) {
        cells.push({ x: gx, y });
        y += 1;
      }
    }
    if (cells.length >= 4) return { horizontal, cells };
  }
  return null;
}

function generateLasers(game, count) {
  const beams = [];
  for (let i = 0; i < count; i += 1) {
    const beam = castBeam(game);
    if (beam) beams.push(beam);
  }
  return beams;
}

// True if any laser beam currently overlaps any segment of the snake.
function laserHitsSnake(game) {
  if (!game.lasersOn || !game.lasers.length) return false;
  for (const beam of game.lasers) {
    for (const cell of beam.cells) {
      for (const seg of game.snake) {
        if (seg.x === cell.x && seg.y === cell.y) return true;
      }
    }
  }
  return false;
}
// Once every apple is gone, a single exit door appears at a random open
// cell somewhere on the page — not on a wall, not on the snake itself.
// Nothing marks it in advance; the player has to go find it.
function placeDoor(game) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const gx = Math.floor(Math.random() * game.cols);
    const gy = Math.floor(Math.random() * game.rows);
    const key = `${gx},${gy}`;
    if (game.walls.has(key)) continue;
    if (game.snake.some((seg) => seg.x === gx && seg.y === gy)) continue;
    return { x: gx, y: gy };
  }
  return null;
}

function keyToDirection(key) {
  switch (key) {
    case 'ArrowUp':
    case 'w':
    case 'W':
      return { x: 0, y: -1 };
    case 'ArrowDown':
    case 's':
    case 'S':
      return { x: 0, y: 1 };
    case 'ArrowLeft':
    case 'a':
    case 'A':
      return { x: -1, y: 0 };
    case 'ArrowRight':
    case 'd':
    case 'D':
      return { x: 1, y: 0 };
    default:
      return null;
  }
}

function buildInitialState(cellSize) {
  const { walls, docWidth, docHeight } = computeWalls(cellSize);
  const cols = Math.max(4, Math.floor(docWidth / cellSize));
  const rows = Math.max(4, Math.floor(docHeight / cellSize));

  // Force-clear a safe pocket near the top of the page so the snake never
  // spawns inside a wall, regardless of what copy happens to sit there.
  for (let gy = SPAWN_CLEAR.y0; gy <= SPAWN_CLEAR.y1; gy += 1) {
    for (let gx = SPAWN_CLEAR.x0; gx <= SPAWN_CLEAR.x1; gx += 1) {
      walls.delete(`${gx},${gy}`);
    }
  }

  const startY = 6;
  const snake = [
    { x: 8, y: startY },
    { x: 7, y: startY },
    { x: 6, y: startY },
    { x: 5, y: startY },
  ];
  const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));

  // Spread the 10 apples across bands from the top of the page to the
  // bottom, so collecting them all pulls the snake down the whole page.
  const apples = [];
  const bandHeight = rows / TOTAL_APPLES;
  for (let i = 0; i < TOTAL_APPLES; i += 1) {
    const bandStart = Math.floor(i * bandHeight);
    const bandEnd = Math.max(bandStart + 1, Math.floor((i + 1) * bandHeight) - 1);
    let placed = null;
    for (let attempt = 0; attempt < 300 && !placed; attempt += 1) {
      const gx = 1 + Math.floor(Math.random() * Math.max(1, cols - 2));
      const gy = Math.min(
        rows - 1,
        bandStart + Math.floor(Math.random() * Math.max(1, bandEnd - bandStart + 1))
      );
      const key = `${gx},${gy}`;
      if (walls.has(key) || occupied.has(key) || apples.some((a) => a.x === gx && a.y === gy)) {
        continue;
      }
      placed = { x: gx, y: gy };
    }
    if (!placed) {
      // Fallback: force a clear cell so we always end up with 10 apples.
      const gx = 2 + (i % Math.max(1, cols - 4));
      const gy = Math.min(rows - 1, bandStart + 1);
      walls.delete(`${gx},${gy}`);
      placed = { x: gx, y: gy };
    }
    apples.push(placed);
  }

  return {
    cellSize,
    cols,
    rows,
    worldWidth: docWidth,
    worldHeight: docHeight,
    walls,
    dynamicWalls: new Set(),
    snake,
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    apples,
    score: 0,
    status: 'intro', // 'intro' | 'playing' | 'won' | 'dead'
    door: null,
    playStartTime: 0,
    laserCycleStart: 0,
    laserCyclesCompleted: 0,
    laserPeriodMs: LASER_PERIOD_START_MS,
    laserPhase: 'calm', // 'calm' | 'warning' | 'active'
    laserCountdownSec: Math.round(LASER_PERIOD_START_MS / 1000),
    laserActivationCount: 0,
    lasersOn: false,
    lasers: [],
    scrollTarget: null,
  };
}

function SnakeGame({ active, onExit }) {
  const gameRef = useRef(null);
  const gameLoopRafRef = useRef(null);
  const toastTimeoutRef = useRef(null);
  const [, forceRender] = useReducer((n) => n + 1, 0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!active) {
      gameRef.current = null;
      return undefined;
    }

    gameRef.current = buildInitialState(CELL);
    gameRef.current.playStartTime = performance.now();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setToast(null);
    forceRender();

    const step = () => {
      const game = gameRef.current;
      if (!game || game.status !== 'playing') return;

      const dir = game.nextDirection;
      game.direction = dir;
      const head = game.snake[0];
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      // Out of the page's bounds — the edge of the world is a wall too.
      if (newHead.x < 0 || newHead.x >= game.cols || newHead.y < 0 || newHead.y >= game.rows) {
        game.status = 'dead';
        forceRender();
        return;
      }

      // The marquee keeps scrolling and the greeting keeps typing, so
      // their letters' positions are recomputed fresh every tick — this
      // is where "touching a moving/typed word" gets checked.
      game.dynamicWalls = computeLiveWalls(game.cellSize);

      // Text on the page — static or scrolling in the marquee — is a wall.
      const headKey = `${newHead.x},${newHead.y}`;
      if (game.walls.has(headKey) || game.dynamicWalls.has(headKey)) {
        game.status = 'dead';
        forceRender();
        return;
      }

      const appleIndex = game.apples.findIndex((a) => a.x === newHead.x && a.y === newHead.y);
      const isEating = appleIndex !== -1;

      // Self-collision — the tail cell is safe to move into since it will
      // vacate this same tick, unless the snake is growing this tick.
      const bodyToCheck = isEating ? game.snake : game.snake.slice(0, -1);
      if (bodyToCheck.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        game.status = 'dead';
        forceRender();
        return;
      }

      const newSnake = [newHead, ...game.snake];
      if (!isEating) {
        newSnake.pop();
      } else {
        game.apples = game.apples.filter((_, i) => i !== appleIndex);
        game.score += 1;
      }
      game.snake = newSnake;

      // Every apple is gone — drop a single exit door somewhere random on
      // the page. Nothing points to it; the player has to explore to find
      // it, and reaching it is what actually wins the game.
      if (game.score >= TOTAL_APPLES && !game.door) {
        game.door = placeDoor(game);
        setToast('🚪 All apples collected — now find the exit door!');
        window.clearTimeout(toastTimeoutRef.current);
        toastTimeoutRef.current = window.setTimeout(() => setToast(null), 2400);
      }

      if (game.door && newHead.x === game.door.x && newHead.y === game.door.y) {
        game.status = 'won';
      }

      // A laser touching any part of the snake ends the run.
      if (laserHitsSnake(game)) {
        game.status = 'dead';
      }

      // Camera follow: the page scrolls when the snake is nearing either
      // the bottom edge (moving down) or the top edge (moving up) of the
      // viewport. The actual scrolling happens smoothly in the rAF loop
      // above — this just updates the target it eases toward.
      if (dir.y === 1) {
        const headPxY = newHead.y * game.cellSize + game.cellSize / 2;
        const threshold = window.scrollY + window.innerHeight * 0.72;
        if (headPxY > threshold) {
          const maxScroll = Math.max(0, game.worldHeight - window.innerHeight);
          const target = Math.min(maxScroll, headPxY - window.innerHeight * 0.72);
          game.scrollTarget = target;
        }
      } else if (dir.y === -1) {
        const headPxY = newHead.y * game.cellSize + game.cellSize / 2;
        const threshold = window.scrollY + window.innerHeight * 0.28;
        if (headPxY < threshold) {
          const target = Math.max(0, headPxY - window.innerHeight * 0.28);
          game.scrollTarget = target;
        }
      }

      forceRender();
    };

    // Lasers fire on a schedule that speeds up each time a countdown round
    // completes — 30s, then 5s faster each round, down to a floor of 5s,
    // where it then just keeps repeating. Each cycle is calm -> warning
    // (red alert glow + visible countdown) -> active (beams live) -> calm.
    const laserTick = () => {
      const game = gameRef.current;
      if (!game || game.status !== 'playing') return;

      const elapsed = performance.now() - game.playStartTime;
      const period = game.laserPeriodMs;
      const cycleElapsed = elapsed - game.laserCycleStart;
      const warnStart = Math.max(0, period - LASER_WARN_MS - LASER_ON_MS);
      const fireStart = warnStart + LASER_WARN_MS;
      const fireEnd = fireStart + LASER_ON_MS;

      if (cycleElapsed >= fireEnd) {
        // Countdown round complete — the next one starts 5s shorter (down
        // to the 5s floor, where it then just keeps repeating). The next
        // tick picks up the fresh countdown.
        game.laserCycleStart = elapsed;
        game.laserCyclesCompleted += 1;
        game.laserPeriodMs = currentLaserPeriodMs(game.laserCyclesCompleted);
        game.laserPhase = 'calm';
        game.lasersOn = false;
        game.lasers = [];
      } else if (cycleElapsed >= fireStart) {
        if (game.laserPhase !== 'active') {
          game.laserPhase = 'active';
          game.lasersOn = true;
          const count = Math.min(LASER_COUNT_MAX, LASER_COUNT_BASE + game.laserActivationCount);
          game.lasers = generateLasers(game, count);
          game.laserActivationCount += 1;
          if (laserHitsSnake(game)) {
            game.status = 'dead';
          }
          setToast('🚨 LASER GRID ACTIVE — avoid the beams!');
          window.clearTimeout(toastTimeoutRef.current);
          toastTimeoutRef.current = window.setTimeout(() => setToast(null), 1800);
        }
        game.laserCountdownSec = 0;
      } else if (cycleElapsed >= warnStart) {
        game.laserPhase = 'warning';
        game.laserCountdownSec = Math.max(0, Math.ceil((fireStart - cycleElapsed) / 1000));
      } else {
        game.laserPhase = 'calm';
        game.laserCountdownSec = Math.max(0, Math.ceil((fireStart - cycleElapsed) / 1000));
      }

      forceRender();
    };

    // A single requestAnimationFrame loop drives everything — movement,
    // the laser schedule, and scroll easing — instead of separate
    // setIntervals stepping on each other. setInterval callbacks aren't
    // synced to the browser's paint cycle, so two independent timers
    // firing at slightly different, drifting cadences was the main
    // source of the stutter; one loop ticking in lockstep with paint
    // fixes it.
    let lastStepAt = performance.now();
    let lastLaserAt = performance.now();

    const loop = (now) => {
      const game = gameRef.current;
      if (game) {
        if (game.status === 'playing' && game.scrollTarget != null) {
          const current = window.scrollY;
          const diff = game.scrollTarget - current;
          if (Math.abs(diff) > 0.5) {
            window.scrollTo({ top: current + diff * SCROLL_EASE, left: window.scrollX, behavior: 'auto' });
          } else if (current !== game.scrollTarget) {
            window.scrollTo({ top: game.scrollTarget, left: window.scrollX, behavior: 'auto' });
          }
        }

        if (game.status === 'playing') {
          if (now - lastStepAt >= TICK_MS) {
            lastStepAt = now;
            step();
          }
          if (now - lastLaserAt >= LASER_TICK_MS) {
            lastLaserAt = now;
            laserTick();
          }
        }
      }
      gameLoopRafRef.current = window.requestAnimationFrame(loop);
    };
    gameLoopRafRef.current = window.requestAnimationFrame(loop);

    const handleKeyDown = (e) => {
      const game = gameRef.current;
      if (!game || game.status !== 'playing') return;
      const dir = keyToDirection(e.key);
      if (dir) {
        e.preventDefault();
        const cur = game.direction;
        // Ignore direct 180-degree reversals.
        if (game.snake.length > 1 && dir.x === -cur.x && dir.y === -cur.y) return;
        game.nextDirection = dir;
        return;
      }
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
      }
    };

    // Lock manual scrolling while playing — the only scrolling that
    // should happen is the automatic downward camera-follow above.
    const blockScroll = (e) => {
      const game = gameRef.current;
      if (game && game.status === 'playing') e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });

    return () => {
      window.cancelAnimationFrame(gameLoopRafRef.current);
      window.clearTimeout(toastTimeoutRef.current);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
    };
  }, [active]);

  const startGame = () => {
    const game = gameRef.current;
    if (!game) return;
    game.status = 'playing';
    game.playStartTime = performance.now();
    forceRender();
  };

  const restart = () => {
    gameRef.current = buildInitialState(CELL);
    gameRef.current.status = 'playing';
    gameRef.current.playStartTime = performance.now();
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    setToast(null);
    forceRender();
  };

  if (!active || !gameRef.current) return null;

  const game = gameRef.current;
  const {
    cellSize,
    snake,
    apples,
    score,
    status,
    worldWidth,
    worldHeight,
    lasersOn,
    lasers,
    laserPhase,
    laserCountdownSec,
    door,
  } = game;
  const laserDanger = laserPhase === 'warning' || laserPhase === 'active';

  return createPortal(
    <div className="snake-game-root">
      {laserDanger && (
        <div
          className={`snake-game-alert-glow ${laserPhase === 'active' ? 'is-active' : ''}`}
          aria-hidden="true"
        />
      )}
      {laserPhase === 'warning' && (
        <div className="snake-game-countdown" aria-hidden="true">
          <span key={laserCountdownSec} className="snake-game-countdown__num">
            {laserCountdownSec}
          </span>
        </div>
      )}
      <div className="snake-game-board" style={{ width: worldWidth, height: worldHeight }}>
        {door && (
          <div
            className="snake-game-door"
            style={{
              left: door.x * cellSize,
              top: door.y * cellSize,
              width: cellSize,
              height: cellSize,
            }}
          >
            🚪
          </div>
        )}
        {apples.map((a) => (
          <div
            key={`apple-${a.x}-${a.y}`}
            className="snake-game-apple"
            style={{
              left: a.x * cellSize,
              top: a.y * cellSize,
              width: cellSize,
              height: cellSize,
            }}
          >
            🍎
          </div>
        ))}
        {snake.map((seg, i) => (
          <div
            key={i === 0 ? 'head' : `seg-${i}`}
            className={`snake-game-segment ${i === 0 ? 'is-head' : ''}`}
            style={{
              left: seg.x * cellSize,
              top: seg.y * cellSize,
              width: cellSize,
              height: cellSize,
            }}
          />
        ))}
        {lasersOn &&
          lasers.map((beam, bi) =>
            beam.cells.map((c, ci) => (
              <div
                key={`laser-${bi}-${ci}`}
                className={`snake-game-laser ${beam.horizontal ? 'is-horizontal' : 'is-vertical'}`}
                style={{
                  left: c.x * cellSize,
                  top: c.y * cellSize,
                  width: cellSize,
                  height: cellSize,
                }}
              />
            ))
          )}
      </div>

      <div className="snake-game-hud">
        <span className="snake-game-hud__label">🍎 {score}/{TOTAL_APPLES}</span>
        {door && (
          <span className="snake-game-hud__door">🚪 Find the exit door!</span>
        )}
        <span className={`snake-game-hud__laser ${laserDanger ? 'is-on' : ''}`}>
          {laserPhase === 'active'
            ? '🔴 Laser active!'
            : laserPhase === 'warning'
            ? `⚠ Incoming in ${laserCountdownSec}s`
            : `Next laser in ${laserCountdownSec}s`}
        </span>
        <span className="snake-game-hud__hint">Arrow keys or WASD to move</span>
        <button type="button" className="snake-game-hud__exit" onClick={onExit}>
          Exit
        </button>
      </div>

      {toast && <div className="snake-game-toast">{toast}</div>}

      {status !== 'playing' && (
        <div className="snake-game-modal-wrap">
          <div className={`snake-game-modal ${status === 'intro' ? 'snake-game-modal--intro' : ''}`}>
            {status === 'intro' && (
              <>
                <h3>🐍 Snake: Page Crawler</h3>
                <p>
                  Steer with the <strong>arrow keys</strong> or <strong>WASD</strong>.
                  The snake grows as it goes, and the page scrolls along with it.
                </p>
                <ul className="snake-game-modal__list">
                  <li>Eat all {TOTAL_APPLES} apples hidden around the page.</li>
                  <li>The page's own text is solid — don't run into it, yourself, or the edge.</li>
                  <li>Every so often a laser grid sweeps the board — clear out before it fires.</li>
                  <li>Once every apple's gone, a hidden exit door appears somewhere random. Find it to win.</li>
                </ul>
                <div className="snake-game-modal__actions">
                  <button type="button" className="btn btn--primary" onClick={startGame}>
                    Start game
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={onExit}>
                    Exit game mode
                  </button>
                </div>
              </>
            )}

            {status !== 'intro' && (
              <>
                <h3>{status === 'won' ? 'You found the exit!' : 'Game over'}</h3>
                <p>
                  {status === 'won'
                    ? 'All 10 apples collected and the door found — nice run.'
                    : 'The snake ran into a wall of text, itself, or a laser.'}
                </p>
                <div className="snake-game-modal__actions">
                  <button type="button" className="btn btn--primary" onClick={restart}>
                    Play again
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={onExit}>
                    Exit game mode
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

export default SnakeGame;

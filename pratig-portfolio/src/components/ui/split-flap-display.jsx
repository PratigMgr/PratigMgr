import React, { useEffect, useMemo, useRef, useState } from 'react';
import './split-flap-display.css';

// Airport-departure-board style flap display. Each column cycles through
// the character set before settling on its target letter, staggered
// left-to-right so the whole word "resolves" rather than snapping in.
const CHARS = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,:/-';

const SIZES = {
  sm: { cell: 22, font: 13, gap: 3 },
  md: { cell: 34, font: 20, gap: 4 },
  lg: { cell: 48, font: 28, gap: 6 },
};

function charIndex(ch) {
  const i = CHARS.indexOf(ch.toUpperCase());
  return i === -1 ? 0 : i;
}

function useFlapColumn(target, delay, active) {
  const [display, setDisplay] = useState(' ');
  const rafRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!active) return undefined;
    const targetIdx = charIndex(target);
    let cancelled = false;

    timeoutRef.current = setTimeout(() => {
      let step = 0;
      const totalSteps = targetIdx + 6; // loop past a few chars before landing
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (reduceMotion) {
        setDisplay(target === ' ' ? '\u00A0' : target);
        return;
      }

      function tick() {
        if (cancelled) return;
        const idx = step % CHARS.length;
        setDisplay(CHARS[idx] === ' ' ? '\u00A0' : CHARS[idx]);
        if (step >= totalSteps) {
          setDisplay(target === ' ' ? '\u00A0' : target);
          return;
        }
        step += 1;
        const speed = 55 + step * 6; // ease out as it approaches the target — raise both numbers to slow further
        rafRef.current = setTimeout(tick, speed);
      }
      tick();
    }, delay);

    return () => {
      cancelled = true;
      clearTimeout(timeoutRef.current);
      clearTimeout(rafRef.current);
    };
  }, [target, delay, active]);

  return display;
}

function Flap({ char, size }) {
  return (
    <span className="sfd__cell" style={{ width: size.cell, height: size.cell * 1.3, fontSize: size.font }}>
      <span className="sfd__char">{char}</span>
      <span className="sfd__hinge" aria-hidden="true" />
    </span>
  );
}

function Column({ target, delay, size, active }) {
  const display = useFlapColumn(target, delay, active);
  return <Flap char={display} size={size} />;
}

export function SplitFlapDisplay({ text = '', columns, size = 'md', className = '' }) {
  const sizing = SIZES[size] || SIZES.md;
  const cols = columns || text.length;

  const chars = useMemo(() => {
    const padded = text
      .toUpperCase()
      .slice(0, cols)
      .padEnd(cols, ' ');
    return padded.split('');
  }, [text, cols]);

  return (
    <div
      className={`sfd ${className}`.trim()}
      style={{ gap: sizing.gap }}
      role="img"
      aria-label={text}
    >
      {chars.map((ch, i) => (
        <Column key={i} target={ch} delay={i * 110} size={sizing} active />
      ))}
    </div>
  );
}

export default SplitFlapDisplay;

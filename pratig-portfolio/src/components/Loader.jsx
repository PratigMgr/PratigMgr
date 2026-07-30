import React, { useEffect, useState } from 'react';
import { SplitFlapDisplay } from '@/components/ui/split-flap-display';

const SHOW_MS = 4800;
const FADE_MS = 600;

// Full-screen intro that plays once per visit, then fades to reveal the
// real page underneath. Uses the split-flap board as the "reveal" moment.
function Loader({ onDone }) {
  const [fading, setFading] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const showTime = reduceMotion ? 500 : SHOW_MS;
    const fadeTimer = setTimeout(() => setFading(true), showTime);
    // onDone fires once the loader has fully finished (faded out and
    // unmounted) — this is the signal the rest of the page waits on
    // before it starts typing/animating in.
    const hideTimer = setTimeout(() => {
      setHidden(true);
      if (onDone) onDone();
    }, showTime + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (hidden) return null;

  return (
    <div className={`loader${fading ? ' loader--fading' : ''}`} aria-hidden="true">
      <SplitFlapDisplay text="PRATIG MAGAR" columns={12} size="md" />
      <p className="loader__caption">loading portfolio…</p>
    </div>
  );
}

export default Loader;

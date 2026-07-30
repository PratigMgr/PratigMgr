import React, { useEffect, useState } from 'react';

// A thin fixed bar that fills left-to-right as the person scrolls —
// styled like the scale ruler on a drafting sheet, and doubles as a
// genuinely useful "how far through the page am I" indicator
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setProgress(pct);
      ticking = false;
    };

    // rAF-throttled scroll handler avoids flooding React with updates
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress(); // set the initial value on mount
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-ruler" role="presentation" aria-hidden="true">
      <div className="scroll-ruler__fill" style={{ width: `${progress}%` }} />
    </div>
  );
}

export default ScrollProgress;

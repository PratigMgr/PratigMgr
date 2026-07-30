import { useEffect, useRef, useState } from 'react';

// Attaches an IntersectionObserver to the returned ref and flips
// `isVisible` to true the first time the element scrolls into view,
// then stops watching — a one-time reveal, not a repeating animation
export default function useReveal(threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node); // reveal once, then stop watching
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect(); // cleanup on unmount
  }, [threshold]);

  return [ref, isVisible];
}

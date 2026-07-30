import React, { useEffect, useRef, useState } from 'react';
import './TextType.css';

// Generic typewriter component: types one or more strings out character by
// character, optionally deleting and cycling to the next when given more
// than one, with a blinking cursor. Pass a single string (or a one-item
// array) with loop={false} for a headline that types once and stays put.
function TextType({
  text,
  texts,
  typingSpeed = 65,
  deletingSpeed = 40,
  pauseDuration = 1500,
  loop = true,
  active = true,
  showCursor = true,
  cursorCharacter = '|',
  cursorBlinkDuration = 0.5,
  variableSpeedEnabled = false,
  variableSpeedMin = 60,
  variableSpeedMax = 120,
  shiny = false,
  renderChar,
  as: Tag = 'span',
  className = '',
  textClassName = '',
  cursorClassName = '',
  onComplete,
}) {
  const items = (texts && texts.length ? texts : text ? [text] : ['']);
  const [textIndex, setTextIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [finished, setFinished] = useState(false);
  const completedRef = useRef(false);

  useEffect(() => {
    // Gated by `active` rather than unmounting the whole component — lets a
    // paragraph sit fully mounted-but-idle until its turn, so the very first
    // character it types isn't competing with mount/layout work.
    if (finished || !active) return undefined;
    const current = items[textIndex] || '';
    const atFullText = !isDeleting && subIndex === current.length;
    const atEmpty = isDeleting && subIndex === 0;
    const canCycle = loop || items.length > 1;

    if (atFullText && !canCycle) {
      setFinished(true);
      if (!completedRef.current) {
        completedRef.current = true;
        if (onComplete) onComplete();
      }
      return undefined;
    }

    let delay;
    if (atFullText) {
      delay = pauseDuration;
    } else if (atEmpty && isDeleting) {
      delay = typingSpeed;
    } else {
      const base = isDeleting
        ? deletingSpeed
        : variableSpeedEnabled
          ? Math.random() * (variableSpeedMax - variableSpeedMin) + variableSpeedMin
          : typingSpeed;
      delay = base;
    }

    const timeout = setTimeout(() => {
      if (atFullText) {
        setIsDeleting(true);
      } else if (atEmpty) {
        setIsDeleting(false);
        setTextIndex((i) => (i + 1) % items.length);
      } else {
        setSubIndex((s) => s + (isDeleting ? -1 : 1));
      }
    }, delay);

    return () => clearTimeout(timeout);
  }, [subIndex, isDeleting, textIndex, finished, active]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = items[textIndex] || '';
  const visible = current.slice(0, subIndex);
  const shinyClass = shiny ? 'texttype__text--shiny' : '';

  return (
    <Tag className={`texttype ${className}`} aria-label={items.join(' / ')}>
      <span className={`texttype__text ${textClassName}`} aria-hidden="true">
        {visible.split('').map((ch, i) => {
          if (renderChar) {
            const custom = renderChar(ch, i);
            if (custom !== undefined && custom !== null) return custom;
          }
          return (
            <span
              key={i}
              className={`texttype__char ${shinyClass}`}
              style={{ '--i': i, animationDelay: shiny ? `${0.4 + i * 0.03}s` : undefined }}
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          );
        })}
      </span>
      {showCursor && (
        <span
          className={`texttype__cursor ${cursorClassName}`}
          style={{ animationDuration: `${cursorBlinkDuration}s` }}
          aria-hidden="true"
        >
          {cursorCharacter}
        </span>
      )}
    </Tag>
  );
}

export default TextType;

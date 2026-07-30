import React from 'react';
import TextType from './TextType';
import './greeting.css';

// "Hi, Pratig, Here" headline.
// - Typed out character by character with a blinking cursor (TextType),
//   with a glossy shine painted directly onto the real letters — not a
//   separate overlay — rippling across the word as it types and looping.
// - Every "i" loses its dot: the dot is replaced by a small flat (2D),
//   solid-fill water drop that falls into place and settles, looping.
function IDrop({ index }) {
  return (
    <span className="greeting__i" style={{ '--i': index }} aria-hidden="true">
      {/* dotless "ı" gives the letter its normal stem shape without a dot,
          so the drop below reads as the dot rather than sitting beside it */}
      <span
        className="greeting__i-stem texttype__char texttype__text--shiny"
        style={{ animationDelay: `${0.4 + index * 0.03}s` }}
      >
        {'\u0131'}
      </span>
      <span className="greeting__i-drop" />
    </span>
  );
}

function Greeting({ words = ['Hi,', 'Pratig,', 'Here'], active = true, showCursor = true, onComplete }) {
  const sentence = words.join(' ');

  return (
    <h1 className="greeting">
      <TextType
        text={sentence}
        loop={false}
        active={active}
        showCursor={showCursor}
        cursorCharacter="_"
        typingSpeed={80}
        shiny
        as="span"
        className="greeting__typed"
        textClassName="greeting__typed-text"
        renderChar={(ch, i) => (ch === 'i' ? <IDrop key={i} index={i} /> : undefined)}
        onComplete={onComplete}
      />
    </h1>
  );
}

export default Greeting;

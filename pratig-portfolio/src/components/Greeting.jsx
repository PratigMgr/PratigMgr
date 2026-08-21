import React from 'react';
import TextType from './TextType';
import './greeting.css';

// "Hi, Pratig, Here" headline.
// - Typed out character by character with a blinking cursor (TextType),
//   with a glossy shine painted directly onto the real letters — not a
//   separate overlay — rippling across the word as it types and looping.
// - Every "i" loses its dot: the dot is replaced by a small flat (2D),
//   solid-fill water drop that falls into place and settles, looping.
function IDrop({ index, name }) {
  return (
    <span className="greeting__i" style={{ '--i': index }} aria-hidden="true">
      {/* dotless "ı" gives the letter its normal stem shape without a dot,
          so the drop below reads as the dot rather than sitting beside it */}
      <span
        className={`greeting__i-stem texttype__char texttype__text--shiny ${name ? 'greeting__name' : ''}`}
        style={{ animationDelay: `${0.4 + index * 0.03}s` }}
      >
        {'\u0131'}
      </span>
      <span className={`greeting__i-drop ${name ? 'greeting__i-drop--name' : ''}`} />
    </span>
  );
}

function Greeting({
  words = ['hi,', 'pratig', 'here.'],
  nameWord = 'pratig',
  active = true,
  showCursor = true,
  onComplete,
}) {
  const sentence = words.join(' ');
  // Index range of the name within the joined sentence, found by summing
  // the lengths of whatever words come before it — works regardless of
  // how many words surround the name or in what order.
  const nameIndex = words.indexOf(nameWord);
  const nameStart = words.slice(0, nameIndex).reduce((acc, w) => acc + w.length + 1, 0);
  const nameEnd = nameStart + words[nameIndex].length;

  return (
    <h1 className="greeting">
      <TextType
        text={sentence}
        loop={false}
        active={active}
        showCursor={showCursor}
        cursorCharacter="|"
        typingSpeed={80}
        shiny
        as="span"
        className="greeting__typed"
        textClassName="greeting__typed-text"
        renderChar={(ch, i) => {
          const isName = i >= nameStart && i < nameEnd;
          if (ch === 'i') {
            return <IDrop key={i} index={i} name={isName} />;
          }
          if (isName) {
            return (
              <span
                key={i}
                className="texttype__char greeting__name texttype__text--shiny"
                style={{ '--i': i, animationDelay: `${0.4 + i * 0.03}s` }}
              >
                {ch}
              </span>
            );
          }
          return undefined;
        }}
        onComplete={onComplete}
      />
    </h1>
  );
}

export default Greeting;

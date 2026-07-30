import React, { useState } from 'react';
import useReveal from '../hooks/useReveal';
import AsciiPortrait from './AsciiPortrait';
import Greeting from './Greeting';

// Skills shown in the scrolling marquee strip — duplicated once in the
// JSX below so the CSS animation can loop seamlessly at -50% translateX
const MARQUEE_SKILLS = [
  'React', 'TypeScript', 'Node.js', 'Express', 'JavaScript',
  'REST APIs', 'MongoDB', 'Git', 'Figma', 'Python', 'Java',
];

const LEDE_1 = "Full-stack developer with a diploma in Computer Programming, building end-to-end web apps with React, Node.js, and TypeScript from database and API design through to the interface people actually touch.";
const LEDE_2 = "I started on the design side, sketching wireframes and prototypes in Figma, before moving into building the interfaces and the logic behind them myself. so I design with an eye on how something will actually be built, and build with an eye on how it should feel to use.";

function About({ start = true }) {
  const [revealRef, isVisible] = useReveal(0.2);
  // Only the greeting line types out letter by letter. Once it finishes
  // (stage 1), the two lede paragraphs and the buttons just fade in as
  // plain static text — no typing effect on them.
  const [stage, setStage] = useState(0);

  return (
    <section id="profile" className="section about">
      <div className={`section__inner about__grid reveal ${isVisible ? 'is-visible' : ''}`} ref={revealRef}>
        <div className="about__copy">
          <Greeting active={start} showCursor={stage === 0} onComplete={() => setStage(1)} />

          <p className={`about__lede about__lede--fade ${stage >= 1 ? 'is-visible' : ''}`}>
            {LEDE_1}
          </p>
          <p className={`about__lede about__lede--fade ${stage >= 1 ? 'is-visible' : ''}`}>
            {LEDE_2}
          </p>

          <div className={`about__actions ${stage >= 1 ? 'is-visible' : ''}`}>
            <a href="#work" className="btn btn--primary">View the work</a>
            <a href="#contact" className="btn btn--ghost">Get in touch</a>
          </div>
        </div>

        <div className="about__portrait">
          <AsciiPortrait src="/img/pratig-cutout.png" alt="Portrait of Pratig Magar, rendered as ASCII art" cols={80} start={start} />
          <span className="about__badge">
            <span className="about__badge-dot" aria-hidden="true" />
            Available for junior roles
          </span>
        </div>
      </div>

      {/* Infinite marquee of core skills — the track renders the list twice
          back to back so the -50% loop is seamless with no visible jump */}
      <div className="marquee" aria-hidden="true">
        <div className="marquee__track">
          <div className="marquee__group">
            {MARQUEE_SKILLS.map((skill) => <span key={skill}>{skill}</span>)}
          </div>
          <div className="marquee__group">
            {MARQUEE_SKILLS.map((skill) => <span key={`${skill}-repeat`}>{skill}</span>)}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;

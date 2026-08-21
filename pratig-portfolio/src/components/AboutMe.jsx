import React from 'react';
import useReveal from '../hooks/useReveal';
import SectionHeading from './SectionHeading';

const TECH_LIST = ['React', 'TypeScript', 'Node.js', 'JavaScript ES6+', 'Python', 'MongoDB'];

function AboutMe() {
  const [revealRef, isVisible] = useReveal(0.15);

  return (
    <section id="about-me" className="section">
      <div className="section__inner" ref={revealRef}>
        <SectionHeading label="about me" />

        <div className={`about-me__layout reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="about-me__copy">
            <p>
              A quick snapshot: I'm based in Ontario, Canada, and hold a{' '}
              <strong className="about-me__accent">Diploma in Computer Programming</strong>.
              My day-to-day toolkit centers on the stack below, with a growing focus
              on integrating LLMs into real products rather than one-off demos.
            </p>
            <p>Technologies I reach for most:</p>
            <ul className="about-me__tech">
              {TECH_LIST.map((tech) => (
                <li key={tech}>{tech}</li>
              ))}
            </ul>
            <p>
              Outside of client work, I'm into tech gadgets, sketching product ideas
              in Figma for fun, and spending more time than I'd admit in battle
              royale games.
            </p>
          </div>

          <div className="about-me__portrait">
            <img src="/img/pratig-photo.jpg" alt="Portrait of Pratig" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default AboutMe;

import React from 'react';
import useReveal from '../hooks/useReveal';
import SectionHeading from './SectionHeading';

const CAPABILITIES = [
  {
    id: 'ai-tooling',
    title: 'AI & LLM Integration',
    detail: 'RAG pipelines, vector search, and eval harnesses — building AI-powered tools that are measurable and production-ready, not just demos.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V10a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4Z" />
        <circle cx="9" cy="13" r="1" fill="currentColor" />
        <circle cx="15" cy="13" r="1" fill="currentColor" />
        <path d="M9 17c.83.65 2 1 3 1s2.17-.35 3-1" />
      </svg>
    ),
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    detail: 'Responsive, accessible interfaces built with React and TypeScript that hold up across devices — designed with an eye on how they\'ll actually feel to use.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 5.5l-3 13" />
      </svg>
    ),
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    detail: 'REST APIs, business logic, and databases (MongoDB, MySQL) that keep the frontend honest — plus headless automation with Playwright.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" />
        <path d="M4.5 5.5V12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V5.5" />
        <path d="M4.5 12v6.5c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V12" />
      </svg>
    ),
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    detail: 'Wireframes and prototypes in Figma, grounded in real usability research — designs that account for how they\'ll be built, not just how they look.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" />
        <path d="M14.06 6.19 16.5 3.75l3.75 3.75-2.44 2.44" />
      </svg>
    ),
  },
];

function Capabilities() {
  const [revealRef, isVisible] = useReveal(0.15);

  return (
    <section id="capabilities" className="section section--alt">
      <div className="section__inner" ref={revealRef}>
        <SectionHeading label="capabilities" />
        <h2>What I offer</h2>
        <p className="section__lede">
          Four things I keep coming back to, whatever the project.
        </p>

        <div className={`capabilities__grid reveal ${isVisible ? 'is-visible' : ''}`}>
          {CAPABILITIES.map((item) => (
            <div key={item.id} className="capability-card">
              <span className="capability-card__icon" aria-hidden="true">{item.icon}</span>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Capabilities;

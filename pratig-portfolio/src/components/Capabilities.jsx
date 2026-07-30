import React from 'react';
import useReveal from '../hooks/useReveal';

const CAPABILITIES = [
  {
    id: 'ui-ux',
    title: 'UI/UX Design',
    detail: 'Wireframes and prototypes in Figma, grounded in how people actually use the thing — not just how it looks.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25Z" />
        <path d="M14.06 6.19 16.5 3.75l3.75 3.75-2.44 2.44" />
      </svg>
    ),
  },
  {
    id: 'frontend',
    title: 'Frontend Development',
    detail: 'Responsive, accessible interfaces built with React and vanilla JavaScript that hold up across devices.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m8 9-4 3 4 3M16 9l4 3-4 3M13.5 5.5l-3 13" />
      </svg>
    ),
  },
  {
    id: 'backend',
    title: 'Backend & Data',
    detail: 'APIs, business logic, and databases (MySQL, MongoDB) that keep the frontend honest.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5.5" rx="7.5" ry="2.5" />
        <path d="M4.5 5.5V12c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V5.5" />
        <path d="M4.5 12v6.5c0 1.38 3.36 2.5 7.5 2.5s7.5-1.12 7.5-2.5V12" />
      </svg>
    ),
  },
  {
    id: 'full-stack',
    title: 'Full-Stack Delivery',
    detail: "Comfortable across the whole stack — from a Figma file to a deployed, working app.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 3 9 4.5-9 4.5-9-4.5L12 3Z" />
        <path d="m3 12 9 4.5 9-4.5M3 16.5 12 21l9-4.5" />
      </svg>
    ),
  },
];

function Capabilities() {
  const [revealRef, isVisible] = useReveal(0.15);

  return (
    <section id="capabilities" className="section section--alt">
      <div className="section__inner" ref={revealRef}>
        <p className="eyebrow"><span className="eyebrow__index">02</span> Capabilities</p>
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

import React from 'react';
import useReveal from '../hooks/useReveal';

const EXPERIENCE = [
  {
    id: 'yeti-digital',
    role: 'Jr. UI/UX Designer',
    company: 'Yeti Private Digital Pvt. Ltd — Chitwan, Nepal',
    period: 'Jan 2023 — Aug 2024',
    highlights: [
      'Designed UI layouts and wireframes for web and mobile applications.',
      'Created prototypes and visual designs using Figma / Adobe XD.',
      'Assisted in user research and translated insights into design improvements.',
      'Collaborated with developers to ensure accurate implementation of designs.',
    ],
  },
];

function Experience() {
  const [revealRef, isVisible] = useReveal(0.15);

  return (
    <section id="experience" className="section">
      <div className="section__inner" ref={revealRef}>
        <p className="eyebrow"><span className="eyebrow__index">04</span> Experience</p>
        <h2>Where I've worked</h2>
        <p className="section__lede">
          A brief timeline of roles that shaped how I design and build.
        </p>

        <div className={`experience__list reveal reveal--left ${isVisible ? 'is-visible' : ''}`}>
          {EXPERIENCE.map((job) => (
            <article key={job.id} className="experience__item">
              <span className="experience__period">{job.period}</span>
              <div className="experience__content">
                <h3>{job.role}</h3>
                <p className="experience__company">{job.company}</p>
                <ul className="experience__highlights">
                  {job.highlights.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Experience;

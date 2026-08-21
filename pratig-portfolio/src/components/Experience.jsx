import React from 'react';
import useReveal from '../hooks/useReveal';

const EXPERIENCE = [
    {
    id: 'yeti-digital',
    role: 'Jr. UI/UX Designer',
    company: 'Yeti Private Digital Pvt. Ltd — Chitwan, Nepal',
    period: 'Jan 2023 — Aug 2024',
    highlights: [
      'Designed UI layouts, wireframes, and interactive prototypes for web and mobile products in Figma and Adobe XD; collaborated directly with developers to ensure pixel-faithful implementation.',
      'Conducted user research, synthesized findings into concrete design improvements, and ran iterative usability testing sessions to validate changes.',
      'Maintained and evolved a shared design system and style guide used across multiple live products.',
    ],
  },
  {
    id: 'wendys',
    role: 'Crew Member',
    company: 'Wendy\'s — Oshawa, ON',
    period: 'Jan 2025 — Present',
    highlights: [
      'Coordinate tasks in a fast-paced team environment, consistently meeting deadlines under pressure.',
      'Adapt quickly to shifting priorities while maintaining accuracy and attention to detail.',
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

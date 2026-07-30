import React from 'react';
import useReveal from '../hooks/useReveal';

const PROJECTS = [
  {
    id: 'portfolio-site',
    name: 'Personal Portfolio Website',
    summary:
      'This site — built to showcase my skills and projects with a fully custom design and smooth scroll-driven interactions.',
    stack: ['HTML', 'CSS', 'JavaScript', 'React'],
    repoUrl: '#',
    liveUrl: 'https://Pratig_mgr.com',
    featured: true,
  },
  {
    id: 'library-management',
    name: 'Library Management System',
    summary: 'A desktop application to manage books and borrowers efficiently.',
    stack: ['Python', 'Java'],
    repoUrl: '#',
    liveUrl: '#',
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    summary: 'A mobile app to record and analyze daily expenses at a glance.',
    stack: ['Mobile', 'JavaScript'],
    repoUrl: '#',
    liveUrl: '#',
  },
  {
    id: 'student-info-system',
    name: 'Student Information System',
    summary: 'A system backed by a MySQL database to securely manage student records.',
    stack: ['MySQL', 'Java'],
    repoUrl: '#',
    liveUrl: '#',
  },
  {
    id: 'quiz-app',
    name: 'Dynamic Quiz Application',
    summary: 'A quiz app that provides real-time scoring and instant user feedback.',
    stack: ['JavaScript', 'React'],
    repoUrl: '#',
    liveUrl: '#',
  },
];

function Projects() {
  const [revealRef, isVisible] = useReveal(0.1);

  return (
    <section id="work" className="section section--alt">
      <div className="section__inner" ref={revealRef}>
        <p className="eyebrow"><span className="eyebrow__index">05</span> Build log</p>
        <h2>Selected work</h2>
        <p className="section__lede">
          A few projects that shipped end to end — interface, logic, and
          the data underneath.
        </p>

        <div className="projects__grid">
          {PROJECTS.map((project, index) => (
            <article
              key={project.id}
              className={`project-card reveal ${project.featured ? 'project-card--featured' : ''} ${isVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${index * 0.07}s` }}
            >
              <span className="project-card__index">{String(index + 1).padStart(2, '0')}</span>
              <h3>{project.name}</h3>
              <p className="project-card__summary">{project.summary}</p>

              <ul className="project-card__stack">
                {project.stack.map((tech) => (
                  <li key={tech}>{tech}</li>
                ))}
              </ul>

              <div className="project-card__links">
                <a href={project.repoUrl} className="project-card__link">
                  Source
                  <svg aria-hidden="true"><use href="#external-link-icon" /></svg>
                </a>
                <a href={project.liveUrl} className="project-card__link">
                  Live
                  <svg aria-hidden="true"><use href="#external-link-icon" /></svg>
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;

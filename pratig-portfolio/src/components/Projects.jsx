import React from 'react';
import useReveal from '../hooks/useReveal';

const PROJECTS = [
  {
    id: 'ai-code-review',
    name: 'AI Code Review Agent',
    summary:
      'Retrieval-augmented GitHub PR review agent that grounds feedback in the repo\'s own codebase — surfaces similar existing code via a self-built JSON vector store before generating review comments. Includes a labeled eval harness with planted-bug test cases and an automated grader to score review quality across prompt/model changes.',
    stack: ['TypeScript', 'Node.js', 'Express', 'Groq LLM', 'transformers.js', 'Octokit'],
    repoUrl: 'https://github.com/PratigMgr/code-review-agent',
    liveUrl: '#',
    featured: true,
  },
  {
    id: 'accessibility-dashboard',
    name: 'Accessibility Compliance Dashboard',
    summary:
      'Headless-browser crawler (Playwright) that runs automated WCAG/AODA checks via axe-core and feeds a React dashboard with plain-language fix suggestions. Stores historical scan results in MongoDB to track a site\'s accessibility score over time — targeting AODA-regulated businesses that need audit trails, not just one-off reports.',
    stack: ['React', 'Node.js', 'Express', 'Playwright', 'axe-core', 'MongoDB'],
    repoUrl: 'https://github.com/PratigMgr',
    liveUrl: '#',
    featured: true,
    inProgress: true,
  },
  {
    id: 'component-library',
    name: 'Figma-Synced Accessible Component Library',
    summary:
      'Publishable npm component library that pulls design tokens (color, spacing, typography) directly from Figma via the Figma API, keeping design and code automatically in sync. Components are accessibility-first — ARIA roles, keyboard navigation — validated with axe-core and documented in Storybook with CI/CD for automated versioning and npm publishing.',
    stack: ['React', 'TypeScript', 'Storybook', 'Figma API', 'axe-core'],
    repoUrl: 'https://github.com/PratigMgr',
    liveUrl: '#',
    inProgress: true,
  },
  {
    id: 'portfolio-site',
    name: 'Personal Portfolio Website',
    summary:
      'This site — a responsive React/Vite portfolio with a custom dark-theme toggle, scroll-based reveal animations, and a component-driven layout with hand-written CSS design tokens. Includes a playable Snake mini-game Easter egg where live DOM text acts as dynamic walls and collision detection runs against real-time page layout.',
    stack: ['React', 'Vite', 'JavaScript', 'CSS'],
    repoUrl: '#',
    liveUrl: 'https://pratigmgr.com',
    featured: false,
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
              {project.inProgress && (
                <span className="project-card__badge">In Progress</span>
              )}
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

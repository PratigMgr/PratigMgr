import React from 'react';
import useReveal from '../hooks/useReveal';
import SectionHeading from './SectionHeading';

// A small, glanceable flow diagram for the featured project card — breaks
// up the text wall and shows the pipeline at a glance instead of making
// visitors parse it out of the summary paragraph.
function ReviewAgentDiagram() {
  const steps = ['GitHub PR', 'Vector search', 'Groq LLM', 'Review comment'];

  return (
    <div className="project-diagram" aria-hidden="true">
      {steps.map((step, i) => (
        <React.Fragment key={step}>
          <span className="project-diagram__node">{step}</span>
          {i < steps.length - 1 && (
            <svg className="project-diagram__arrow" viewBox="0 0 24 12" fill="none">
              <path d="M0 6h20M14 1l6 5-6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

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
    diagram: true,
  },
  {
    id: 'accessibility-dashboard',
    name: 'Accessibility Compliance Dashboard',
    summary:
      'Headless-browser crawler (Playwright) that runs automated WCAG 2.1 AA checks via axe-core and feeds a React dashboard tracking each site\'s compliance score over time. Crawls via both link-following and sitemap.xml discovery, flags score regressions between scans, and sends an email alert when a site\'s score drops. Deployed across three services — Vercel, Render, and MongoDB Atlas.',
    stack: ['React', 'Node.js', 'Express', 'Playwright', 'axe-core', 'MongoDB', 'Docker'],
    repoUrl: 'https://github.com/PratigMgr/a11y-dashboard',
    liveUrl: 'https://a11y-dashboard-one.vercel.app',
    featured: true,
  },
  {
    id: 'yatra-companion',
    name: 'YatraCompanion',
    summary:
      'Android app in Kotlin that helps tourists in Nepal budget their trips and discover cultural, historical, and natural-beauty locations through location detection. Adds AI-guided recommendations on the best time to visit and expected local costs. A self-directed project, and my first real-world product built in Kotlin.',
    stack: ['Kotlin', 'Android', 'Location Services', 'AI Integration'],
    repoUrl: '#',
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
        <SectionHeading label="build log" />
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

              {project.diagram && <ReviewAgentDiagram />}

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

import React from "react";
import useReveal from "../hooks/useReveal";

const STACK_LAYERS = [
  {
    id: "frontend",
    title: "Frontend",
    detail: "Typed React apps that hold up on real devices",
    tools: ["React", "TypeScript", "JavaScript", "Responsive Design"],
  },
  {
    id: "backend",
    title: "Backend",
    detail: "Node.js & TypeScript APIs powering the frontend",
    tools: ["Node.js", "TypeScript", "Express", "MongoDB"],
  },
  {
    id: "data",
    title: "Also comfortable in",
    detail: "Broader exposure beyond the core stack",
    tools: ["Python", "Java", "MySQL", "Git / GitHub"],
  },
  {
    id: "practices",
    title: "How I build",
    detail: "Habits behind the code",
    tools: [
      "Git branching",
      "OOP",
      "Agile",
      "Debugging",
      "Clean, organized code",
      "Responsive-first",
    ],
  },
];

function Skills() {
  const [revealRef, isVisible] = useReveal(0.15);

  return (
    <section id="stack" className="section section--alt">
      <div className="section__inner" ref={revealRef}>
        <p className="eyebrow">
          <span className="eyebrow__index">03</span> Component stack
        </p>
        <h2>What I build with</h2>
        <p className="section__lede">
          Every layer of a product is a component in the same system — here's
          how mine is wired.
        </p>

        <div className={`skills__grid reveal ${isVisible ? "is-visible" : ""}`}>
          {STACK_LAYERS.map((layer, index) => (
            <div key={layer.id} className="skills__panel">
              <span className="skills__panel-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3>{layer.title}</h3>
              <p>{layer.detail}</p>
              <ul className="skills__tags">
                {layer.tools.map((tool) => (
                  <li key={tool} className="skills__tag">
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Skills;

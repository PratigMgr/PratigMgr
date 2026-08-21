import React from 'react';

// Small heading used at the top of every section: "/ label ————————"
// — a slash, the label, and a rule that stretches to fill the row.
function SectionHeading({ label }) {
  return (
    <div className="section-heading">
      <p className="section-heading__label">
        <span className="section-heading__slash" aria-hidden="true">/</span> {label}
      </p>
      <span className="section-heading__rule" aria-hidden="true" />
    </div>
  );
}

export default SectionHeading;

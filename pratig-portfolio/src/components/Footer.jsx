import React from 'react';

// Bump this whenever you make a meaningful content update — shows up as
// a small "last updated" stamp in the footer so visitors (and you) can
// see the site is actively maintained, not a one-and-done.
const LAST_UPDATED = '2026-08-21';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {year} Pratig Thapa Magar</span>
        <span className="footer__updated">Last updated {LAST_UPDATED}</span>
        <a href="#profile">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default Footer;

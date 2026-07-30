import React from 'react';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <span>© {year} Pratig Thapa Magar</span>
        <a href="#profile">Back to top ↑</a>
      </div>
    </footer>
  );
}

export default Footer;

import React, { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '#profile', label: 'About' },
  { href: '#capabilities', label: 'Capabilities' },
  { href: '#stack', label: 'Stack' },
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#writing', label: 'Writing' },
  { href: '#contact', label: 'Contact' },
];

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/PratigMgr', icon: 'github-icon' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pratig-mgr', icon: 'linkedin-icon' },
  { label: 'Email', href: 'mailto:Pratigthapa54504@gmail.com', icon: 'mail-icon' },
];

function GameModeToggle({ active, onToggle }) {
  const [hasBeenUsed, setHasBeenUsed] = useState(
    () => typeof window !== 'undefined' && window.localStorage.getItem('game-mode-tried') === '1'
  );

  const handleClick = () => {
    if (!hasBeenUsed) {
      window.localStorage.setItem('game-mode-tried', '1');
      setHasBeenUsed(true);
    }
    onToggle();
  };

  return (
    <button
      type="button"
      className={`theme-toggle game-mode-toggle ${active ? 'is-active' : ''}`}
      onClick={handleClick}
      aria-pressed={active}
      aria-label="Toggle game mode"
    >
      <svg aria-hidden="true"><use href="#game-icon" /></svg>
      <span className="toggle-label">{active ? 'Exit game mode' : 'Game mode'}</span>
      {!hasBeenUsed && <span className="game-mode-toggle__nudge" aria-hidden="true" />}
    </button>
  );
}

function Sidebar({ gameMode, onToggleGameMode, sidebarHidden, onToggleSidebar }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    const sections = NAV_LINKS
      .map((link) => document.getElementById(link.href.slice(1)))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const isActive = (href) => activeSection === href.slice(1);

  return (
    <>
      {/* Desktop-only identity block — lives outside the sliding <aside> so
          it (and the menu toggle inside it) stay reachable in the same spot
          whether the sidebar is shown or hidden */}
      <div className="profile-bar">
        <button
          type="button"
          className="profile-bar__toggle profile-bar__toggle--photo"
          onClick={onToggleSidebar}
          aria-label={sidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
          aria-expanded={!sidebarHidden}
        >
          <img
            className="sidebar__avatar"
            src="/img/pratig-casual.jpg"
            alt="Pratig Magar"
            width="64"
            height="64"
          />
        </button>
      </div>

      {/* Desktop fixed sidebar — identity, nav, socials */}
      <aside
        className={`sidebar ${sidebarHidden ? 'sidebar--hidden' : ''}`}
        aria-label="Primary"
        aria-hidden={sidebarHidden}
      >
        <div className="sidebar__top">
          <p className="sidebar__role sidebar__role--offset">
            Full-Stack Developer &amp; UI/UX Designer
          </p>
          <p className="sidebar__tagline">
            Building user-focused web and mobile apps.
          </p>

          <nav className="sidebar__nav">
            <ul>
              {NAV_LINKS.map((link, index) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={isActive(link.href) ? 'is-active' : ''}
                    aria-current={isActive(link.href) ? 'true' : undefined}
                  >
                    <span className="nav-rule" aria-hidden="true" />
                    <span className="nav-index">{String(index + 1).padStart(2, '0')}</span>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="sidebar__bottom">
          <GameModeToggle active={gameMode} onToggle={onToggleGameMode} />
          <div className="sidebar__socials">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} aria-label={link.label} title={link.label}>
                <svg aria-hidden="true"><use href={`#${link.icon}`} /></svg>
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile top bar — collapses into a dropdown menu */}
      <header className="topbar">
        <div className="topbar__inner">
          <a href="#profile" className="topbar__logo" onClick={() => setIsMenuOpen(false)}>
            <img
              className="topbar__avatar"
              src="/img/pratig-casual.jpg"
              alt="Pratig Magar"
              width="32"
              height="32"
            />
            Pratig Magar
          </a>
          <div className="topbar__actions">
            <GameModeToggle active={gameMode} onToggle={onToggleGameMode} />
            <button
              className={`topbar__toggle ${isMenuOpen ? 'is-open' : ''}`}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        <nav className={`topbar__menu ${isMenuOpen ? 'is-open' : ''}`} aria-label="Mobile">
          {NAV_LINKS.map((link, index) => (
            <a
              key={link.href}
              href={link.href}
              className={isActive(link.href) ? 'is-active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              <span>{String(index + 1).padStart(2, '0')}</span>
              {link.label}
            </a>
          ))}
          <div className="topbar__menu-socials">
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} href={link.href} aria-label={link.label} title={link.label}>
                <svg aria-hidden="true"><use href={`#${link.icon}`} /></svg>
              </a>
            ))}
          </div>
        </nav>
      </header>
    </>
  );
}

export default Sidebar;

import React from 'react';
import useReveal from '../hooks/useReveal';
import SectionHeading from './SectionHeading';

// Add real posts here as you publish them — each renders as a row with
// the date, title, and a link out. Leave the array empty and the section
// shows a friendly placeholder instead of fake entries.
// Example:
// { id: 'my-post', title: 'How I built X', date: '2026-08-01', href: 'https://...' }
const POSTS = [];

function Writing() {
  const [revealRef, isVisible] = useReveal(0.15);

  return (
    <section id="writing" className="section">
      <div className="section__inner" ref={revealRef}>
        <SectionHeading label="writing" />
        <h2>Notes &amp; write-ups</h2>
        <p className="section__lede">
          Short posts on things I've built or learned along the way.
        </p>

        <div className={`reveal ${isVisible ? 'is-visible' : ''}`}>
          {POSTS.length > 0 ? (
            <div className="writing__list">
              {POSTS.map((post) => (
                <a key={post.id} href={post.href} className="writing__item">
                  <span className="writing__date">{post.date}</span>
                  <span className="writing__title">{post.title}</span>
                  <span className="writing__arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="writing__empty">
              <p>
                Nothing published yet — this section is wired up and ready
                for your first post whenever you write one.
              </p>
              <a href="mailto:Pratigthapa54504@gmail.com" className="btn btn--ghost">
                Have something to share instead? Say hello
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Writing;

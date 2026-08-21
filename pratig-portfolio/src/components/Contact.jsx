import React, { useState } from 'react';
import useReveal from '../hooks/useReveal';
import SectionHeading from './SectionHeading';

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/PratigMgr' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/pratig-mgr' },
  { label: 'Portfolio', href: 'https://pratigmgr.com' },
  { label: 'Phone', href: 'tel:+19059227880' },
];

// TODO: replace with your own Formspree endpoint.
// 1. Go to https://formspree.io and sign up (free) with Pratigthapa54504@gmail.com
// 2. Create a new form — Formspree will ask you to verify that email address
// 3. Copy the endpoint it gives you (looks like https://formspree.io/f/xxxxxxxx)
// 4. Paste it below in place of the placeholder
const FORM_ENDPOINT = 'https://formspree.io/f/xqerwadn';

function Contact() {
  const [revealRef, isVisible] = useReveal(0.15);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Form submission failed');
      setStatus('sent');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Contact form error:', err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="section">
      <div className="section__inner" ref={revealRef}>
        <SectionHeading label="contact" />

        <h2 className="contact__headline">
          Let's build something —{' '}
          <a href="mailto:Pratigthapa54504@gmail.com">say hello</a>
        </h2>

        <div className={`contact__grid reveal ${isVisible ? 'is-visible' : ''}`}>
          <div className="contact__meta-list">
            <span><span>Based in</span><span>Oshawa, ON, Canada</span></span>
            {SOCIAL_LINKS.map((link) => (
              <a key={link.label} href={link.href}>
                <span>{link.label}</span>
                <span>↗</span>
              </a>
            ))}
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} />

            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} />

            <label htmlFor="message">Message</label>
            <textarea id="message" name="message" rows="4" required value={formData.message} onChange={handleChange} />

            <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : 'Send message'}
            </button>

            {status === 'sent' && (
              <p className="contact-form__status" role="status">
                Message received — I'll reply within a day or two.
              </p>
            )}
            {status === 'error' && (
              <p className="contact-form__status contact-form__status--error" role="status">
                Something went wrong sending that — try again, or email me directly at{' '}
                <a href="mailto:Pratigthapa54504@gmail.com">Pratigthapa54504@gmail.com</a>.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;

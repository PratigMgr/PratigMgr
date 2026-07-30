# Pratig Thapa Magar — Portfolio

A ready-to-run React + Vite portfolio site. This zip already includes the
full project setup (package.json, Vite config, etc.) — you don't need to
scaffold anything yourself.

## Run it

Open a terminal **inside this folder** (the one with `package.json` in it)
and run:

```bash
npm install
npm run dev
```

Then open the local URL it prints (usually `http://localhost:5173`).

## Two themes, one toggle

The site ships with two looks behind the sun/moon button in the sidebar
(desktop) or top bar (mobile):

- **Dark** (default) — a fixed sidebar with your name/nav/socials, warm
  amber accent, structured after brittanychiang.com's layout.
- **Light** — your original warm-paper editorial theme, unchanged, just
  reflowed into the new sidebar layout.

The choice is remembered in the browser (`localStorage`) between visits.
All colors live as CSS variables in `src/App.css` — `:root` is the dark
theme, `[data-theme='light']` overrides it back to the warm palette.

## Structure

```
index.html
package.json
vite.config.js
src/
  main.jsx              # Vite entry point — mounts App, don't need to touch this
  App.jsx                # theme state + assembles all sections
  App.css                # all styles (design tokens, layout, components)
  index.css               # minimal global reset
  components/
    IconSprite.jsx        # inline <symbol> defs used by <use href="#..."/> icons
    Sidebar.jsx            # 01 — desktop fixed sidebar / mobile top bar + nav + socials
    About.jsx               # 01 — intro + skills marquee (formerly Hero.jsx)
    Capabilities.jsx         # 02 — "what I offer" cards
    Skills.jsx                # 03 — component stack by layer
    Experience.jsx             # 04 — work history timeline
    Projects.jsx                 # 05 — build log / project cards
    Writing.jsx                   # 06 — blog/notes list (empty-state until you add posts)
    Contact.jsx                    # 07 — contact form + socials
    Footer.jsx
```

## Customize

- Name, role, tagline, nav, socials — `src/components/Sidebar.jsx`
- Intro copy — `src/components/About.jsx`
- Capabilities cards — the `CAPABILITIES` array in `src/components/Capabilities.jsx`
- Tech stack — the `STACK_LAYERS` array in `src/components/Skills.jsx`
- Work history — the `EXPERIENCE` array in `src/components/Experience.jsx`
- Projects — the `PROJECTS` array in `src/components/Projects.jsx`
- Blog posts — the `POSTS` array in `src/components/Writing.jsx` (empty by
  default — shows a placeholder until you add real entries)
- Contact links — `SOCIAL_LINKS` in `src/components/Sidebar.jsx` and
  `src/components/Contact.jsx` (the GitHub link is a placeholder `#` —
  paste your real profile URL in both places)
- Colors, fonts, spacing — defined once at the top of `src/App.css` under
  `:root` (dark) and `[data-theme='light']` (warm), so a single edit
  updates the whole site

## Build for deployment

```bash
npm run build
```

This outputs a production-ready `dist/` folder you can deploy to Vercel,
Netlify, GitHub Pages, or any static host.

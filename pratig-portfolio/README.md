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

## Dark mode + Game mode

The site is dark-mode only — no theme toggle. A fixed sidebar (desktop)
or top bar (mobile) holds your name, nav, and socials, with a warm amber
accent. All colors live as CSS variables in `src/App.css` under `:root`.

In place of a theme switch, the sidebar/top bar has a **Game mode**
toggle. Turning it on hides the sidebar and overlays a playable Snake
game on top of the page, using live DOM text as the walls. Turning it
off restores whatever the sidebar's visibility was beforehand.

## Structure

```
index.html
package.json
vite.config.js
src/
  main.jsx              # Vite entry point — mounts App, don't need to touch this
  App.jsx                # sidebar/game-mode state + assembles all sections
  App.css                # all styles (design tokens, layout, components)
  index.css               # minimal global reset
  components/
    IconSprite.jsx        # inline <symbol> defs used by <use href="#..."/> icons
    Sidebar.jsx            # 01 — desktop fixed sidebar / mobile top bar + nav + socials
    Loader.jsx              # intro loading overlay, gates the entrance animations
    ScrollProgress.jsx       # top scroll-progress bar
    About.jsx                 # 01 — intro + skills marquee (formerly Hero.jsx)
    Greeting.jsx                # typing-effect greeting line used in About
    AsciiPortrait.jsx             # ASCII-art render of the portrait photo
    Capabilities.jsx                # 02 — "what I offer" cards
    Skills.jsx                       # 03 — component stack by layer
    Experience.jsx                    # 04 — work history timeline
    Projects.jsx                       # 05 — build log / project cards
    Writing.jsx                         # 06 — blog/notes list (empty-state until you add posts)
    Contact.jsx                          # 07 — contact form + socials
    Footer.jsx
    SnakeGame.jsx                         # Game mode overlay — Snake, using live DOM text as walls
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
  `src/components/Contact.jsx` (GitHub, LinkedIn, email, and portfolio
  domain are already filled in — update all instances together if any
  of these change)
- Colors, fonts, spacing — defined once at the top of `src/App.css`
  under `:root`, so a single edit updates the whole site

## Build for deployment

```bash
npm run build
```

This outputs a production-ready `dist/` folder you can deploy to Vercel,
Netlify, GitHub Pages, or any static host.

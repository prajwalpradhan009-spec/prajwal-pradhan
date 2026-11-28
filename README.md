# Prajwal Pradhan’s portfolio

A six-section React portfolio with a layered portrait hero, scrolling skill cards, four project showcases, a biography, GitHub activity and a contact form. The site uses React 18, Vite, Tailwind CSS, Framer Motion, GSAP ScrollTrigger, Lenis and Lucide.

## Run locally

Use Node.js 22.12 or later. From the repository root, run:

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`. The command also starts Express on port 3000 and proxies requests to `/api`. To run the production version locally, use `npm run build` followed by `npm start`, then open `http://localhost:3000`. The production frontend is in `dist/`.

## Personalize

| File | What to edit |
| --- | --- |
| `Frontend/src/data/profile.js` | Name, introduction, location, services, availability, GitHub username, social links and media paths |
| `Frontend/src/data/projects.js` | Project titles, descriptions, technologies, repository URLs and optional live links |
| `Frontend/src/data/skills.js` | Skill groups and tools |
| `Frontend/src/data/timeline.js` | Education and experience |
| `Frontend/src/data/assistant.js` | Portfolio-specific local replies and the context used by Claude |
| `Frontend/src/styles/index.css` | Palette, layout, typography, breakpoints and CSS motion |
| `Frontend/static/` | WebP assets in `media/`, the downloadable `cv.pdf`, favicon and crawler files |

The hero uses the original portrait and a matching CSS silhouette in `Frontend/src/portrait.css`. To use another photo, save a transparent portrait in `Frontend/static/media/`, update `profile.portrait` and set the `.cutout` clip path to `none`. Set `profile.workspace` for the About photo. The downloadable PDF and the existing printable résumé at `/resume.html` can be updated independently.

## Motion controls

| Section | Effect | Where to adjust it |
| --- | --- | --- |
| Hero | Staggered type, portrait entrance, pointer parallax, scroll split and zoom | `sections/Hero.jsx` and `hooks/usePageMotion.js` |
| Skills | Pinned horizontal track, per-card fills and outlined marquee | `sections/Skills.jsx`, `hooks/usePageMotion.js` and `.marquee` in CSS |
| Projects | Sticky stack, outgoing card scale and dim | `.project-card` in CSS and `hooks/usePageMotion.js` |
| About | Scrubbed bio, portrait mask and timeline line | `sections/About.jsx` and `hooks/usePageMotion.js` |
| GitHub | Contribution wave, count-ups and staggered repositories | `sections/GithubLive.jsx`, `components/Chrome.jsx` and the `cell-in` keyframes |
| Contact | Curtain reveal and responsive lettering | `hooks/usePageMotion.js` and `.contact-title` in CSS |

The paths in this table start at `Frontend/src/`. Desktop pinning requires at least 900px of width and 620px of height. Smaller screens use normal page scrolling and a swipeable skill list. Reduced-motion preferences disable scroll pinning, parallax, decorative motion and the intro curtain.

## Data and delivery

The Express service runs alongside the frontend locally and on Render. The `api/` directory adapts the chat, GitHub and contact routes for Vercel. The GitHub section reads public profile and repository data, caches it in the browser session and checks for updates every five minutes. With a server token it displays GitHub’s contribution graph. Without a token it uses the public contribution service provided by `react-github-calendar`.

Chat uses Claude when configured, supports the existing Gemini setup on Render and answers common portfolio questions locally when offline. Conversation history stays in browser local storage. The contact form uses an optional Formspree ID, or the existing same-origin contact endpoint. On Express that endpoint stores messages in MongoDB, with a local file fallback for development.

See [deployment and environment settings](DEPLOYMENT.md) for Render and Vercel.
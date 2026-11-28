# Build and deployment

Use the repository root as the project directory and Node.js 22.12 or later. Run `npm ci --include=dev` and `npm run build` to produce `dist/`. Vite builds the main page and the existing standalone résumé and profile pages.

## Render

The included `render.yaml` builds the frontend and checks the homepage at `/` before routing traffic. For a manually configured service, use the repository root, build with `npm ci --include=dev && npm run build` and start with `npm start`. A service that still runs `npm start` from `backend/` builds the frontend before starting Express if its deployment is missing `dist/index.html`. Moving the build to the build command saves that work on cold starts.

The server handles the frontend, section URLs and same-origin APIs. Use `/api/health` to check the database connection. It reports a degraded database when the local-file contact fallback is active.

## Vercel

Import this repository with the root directory set to the repository root. The included `vercel.json` uses `npm run build`, serves `dist/` and maps the existing section routes to the React page. The files in `api/` provide Node functions for chat, GitHub and contact. Configure a Formspree form ID to enable email delivery on Vercel.

## Environment

For local development, frontend build variables are read from the root `.env`. Express reads server variables from `backend/.env`. The provided example files list the supported names. In production, use the host’s environment settings.

| Variable | Used by | Purpose |
| --- | --- | --- |
| `VITE_FORMSPREE_ID` | Frontend build | Optional public Formspree form ID for direct form delivery |
| `FORMSPREE_ID` | Vercel contact function | Formspree delivery through the same-origin API |
| `MONGODB_URI` | Express | Persistent contact storage. Without a database, local development writes to `backend/data/contacts.json`. Local disk on hosted instances may be ephemeral. |
| `GITHUB_USERNAME` | GitHub API | Optional account override. The default comes from the portfolio profile. |
| `GITHUB_TOKEN` | GitHub API | Optional server-side token for the contribution graph and authenticated rate limits |
| `GITHUB_CACHE_MINUTES` | GitHub API | Server-side cache lifetime |
| `ANTHROPIC_API_KEY` | Chat API | Claude provider credential |
| `ANTHROPIC_MODEL` | Chat API | Optional Claude model override |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Chat API | Existing Gemini integration when Claude is unconfigured |
| `CHAT_RATE_LIMIT` | Chat API | Per-visitor request limit per ten minutes |
| `PORT` | Express | Listening port, normally 3000 locally |

Only the public Formspree form ID uses a `VITE_` variable. Store provider tokens and database credentials on the server. Rebuild after changing a frontend variable. For a new production hostname, update the Open Graph image URL in `Frontend/index.html` and the hostnames in `Frontend/static/sitemap.xml` and `robots.txt`.

## API routes

| Route | Response or action |
| --- | --- |
| `GET /api/github` | Public profile, repository activity, contribution data when available and cache metadata |
| `POST /api/chat` | A portfolio answer for a message and optional bounded conversation history |
| `POST /api/contact` | Accepts name, email, subject and message |
| `GET /api/health`, `/api/projects`, `/api/skills` | Existing Express service endpoints |

The local form and chatbot use the same paths in development and production. Vite’s development proxy points them to Express. To host the frontend separately, set `window.PORTFOLIO_API_URL` in `Frontend/config.js` to the backend URL including `/api` and rebuild.

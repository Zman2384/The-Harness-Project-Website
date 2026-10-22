# theharnessproject.org

Static multi-page site. No build step: every folder's index.html is a page.

- `/index.html` home; `/cape/`, `/harness/`, `/partners/`, `/hub/` ... one folder per page
- `/blog/<post>/` one folder per blog post (post text lives in `assets/js/site-1.js`, POSTS list)
- `assets/site.css` all styles; `assets/js/` scripts; `assets/img/` images; `assets/kits/` downloadable PDFs
- `sitemap.xml`, `robots.txt`, `404.html`

Old links like theharnessproject.org/#/cape redirect to /cape automatically.

## Deploy (Cloudflare Pages)
Workers & Pages -> your project -> Settings -> Builds -> Connect to Git -> pick this repo.
Framework preset: None. Build command: (leave empty). Build output directory: /
Every push to main publishes in about a minute.

## Lil Z live guide (`/api/lil-z`)
`functions/api/lil-z.js` is a Cloudflare Pages Function that powers live replies in the MATCH Flow app.
It deploys with the site. One-time setup: Workers & Pages -> this project -> Settings -> Variables and Secrets ->
add a **Secret** `ANTHROPIC_API_KEY` (from console.anthropic.com), then redeploy. Optional variable `LILZ_MODEL`
(default `claude-sonnet-5-5`). Without the key the app keeps using its on-device answers.
Persona and rules: `functions/api/_lilz-persona.js`. Nothing is stored or logged.

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

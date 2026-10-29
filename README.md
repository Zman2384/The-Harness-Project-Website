# theharnessproject.org

Static multi-page site. No build step: every folder's index.html is a page.

- `/index.html` home; `/cape/`, `/harness/`, `/partners/`, `/hub/` ... one folder per page
- `/blog/<post>/` one folder per blog post (post text lives in `assets/js/site-1.js`, POSTS list)
  - The script re-renders each post when it loads; the post's `index.html` holds the same markup for search engines and no-JS visitors, so update both together.
  - When a published post's text changes, set `updated: "YYYY-MM-DD"` on it (shows "Updated <date>" in the byline) and add the same `dateModified` to the post's structured data.
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

## Educators Hub library (`/educators-hub/`)
The paid library facilitators sign in to. `/hub` is the public page that describes it.
The site is static, so the gate is encryption: every file in `educators-hub/vault/` is AES-256-GCM
ciphertext, and the data key that opens them is itself encrypted with a key derived from the access
code (PBKDF2-SHA256, 310,000 rounds). The browser does the unlocking; the key stays on that device
for 30 days or until **Sign out**. Nothing secret is in this repo: not the code, not the data key.

- `educators-hub/catalog.json` lists what's in the library (titles and descriptions are public).
- `tools/hub_vault.py` encrypts the files. It reads the code from `HUB_CODE` (or asks for it).
  - Add or update files: put the source files in one folder, list them in `catalog.json`
    (`src` = file name), then `HUB_CODE=... python3 tools/hub_vault.py build path/to/folder`.
  - Change the code for everyone: `HUB_CODE=old HUB_CODE_NEW=new python3 tools/hub_vault.py rekey`.
  - A code leaked: `HUB_CODE=old HUB_CODE_NEW=new python3 tools/hub_vault.py rotate path/to/folder`
    (new key, every file re-encrypted).
  - `python3 tools/hub_vault.py check` confirms the code opens every file. `newcode` prints a fresh code.
- Keep the source files and the code outside this repo. Send the code to licensees directly.
- One shared code means anyone who has it can open the library. Rotate it when a license ends.

## Sitemap dates
`.github/workflows/sitemap.yml` runs `tools/update_sitemap.py` after every push to main and
commits new `<lastmod>` dates. A page's date only moves when what a reader sees changes (words, links, images);
menu, footer, `<head>` and markup-only edits don't count. `/hub` stays out of the sitemap on purpose (noindex).

## Agent discovery
`/.well-known/api-catalog`, `/api/` (docs, `openapi.json`, `status.json`), `/auth.md`.
Content types and the sitewide `Link` header are set in `_headers`.

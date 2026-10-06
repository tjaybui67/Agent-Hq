# Backrooms HQ — static site

A plain static replica of the Backrooms HQ dashboard, built for free hosting on
GitHub Pages. No build step, no backend, no external dependencies — just open
`index.html` or serve the folder.

## Deploy to GitHub Pages

1. Create a new **public** repo on github.com named `backrooms-hq`.
2. Upload everything in this folder (`index.html`, `styles.css`, `app.js`,
   `assets/`, `README.md`) to the repo root via the GitHub web UI
   (Add file → Upload files).
3. Go to **Settings → Pages**, set Source to **Deploy from a branch**,
   branch `main`, folder `/ (root)`.
4. Your site goes live at `https://<username>.github.io/backrooms-hq/`.

## Custom domain (later)

Buy `backroomshq.ca` (~$15/yr, needs a parent/guardian for purchase), then in
the repo's **Settings → Pages → Custom domain** enter `backroomshq.ca` and add
the DNS records GitHub shows you (A records + CNAME). GitHub provisions HTTPS
automatically.

## Notes

- Lead data is baked into `app.js` (19 leads, snapshot 2026-10-05).
- Kanban drag-and-drop positions persist per-browser via `localStorage`.
- The monthly goal tracker is in-session only (resets on refresh) — static
  hosting can't persist user-entered data.
- All asset paths are relative (`./assets/...`), so the site works from
  `file://` and from a GitHub Pages subpath.

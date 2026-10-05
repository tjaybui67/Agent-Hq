# Lead Scout

Finds Vancouver-area local businesses with missing, broken, or outdated websites — the raw fuel for Tjay's web-design pitches.

## Schedule
Weekly, Monday mornings (America/Vancouver).

## Playbook
1. Pick 2–3 neighborhoods/categories NOT covered in the last 2 runs (check `run-logs/`). Rotate across: Commercial Drive, Main Street, Hastings-Sunrise, Mount Pleasant, Kitsilano, Dunbar, Kerrisdale, Renfrew-Collingwood, South Granville, Fraser Street. Categories: cafés, restaurants, salons/barbershops, auto repair, dental/clinic, bakeries, small retail, gyms.
2. Discover candidates with `browser.search` ("<category> <neighborhood> Vancouver"). Where results return numeric place_ids, run `places details` via `muse.exec` for website URLs.
3. Verify each candidate's website with `browser.open` on tool-returned URLs. Classify `website_status`: `none` / `broken` (fails to load, parked, cert error) / `outdated` (5+ years old look, old template, not mobile-friendly) / `ok` / `unverified`.
4. Score 1–5 on pitch opportunity (weak web presence + visibly operating = high). Skip big chains and any business already in `leads.json` (dedupe by name). Never re-add The Laughing Bean Coffee Co. or East Cafe.
5. Append new leads to `leads.json` with status `new` and today's date.
6. Write a run log to `run-logs/lead-scout-YYYY-MM-DD.md` (areas covered, leads added, notes).
7. Refresh the Agent HQ dashboard artifact with the new pipeline data.
8. Report to the Agent HQ chat: how many new leads, top 3 by score, areas covered.

## Constraints
- Never invent a business. Every name from a tool result.
- Research only. Never contact a business, never submit forms.
- Aim for 5–10 quality leads per run, not volume.

# Agent HQ

An AI-agent team that runs Tjay's web-design business while he's away.
Built 2026-10-05. Owner: Tjay Bui.

## The team

| Agent | Job | Schedule | File |
|---|---|---|---|
| Lead Scout | Finds Vancouver businesses with missing/broken/outdated websites | Weekly, Monday mornings | `agents/lead-scout.md` |
| Pitch Crafter | Drafts leave-behind flyer + concept site for a chosen lead | On demand (ask in chat) | `agents/pitch-crafter.md` |
| Follow-up Nudger | Reminds Tjay who to follow up with | Weekly, Wednesday evenings | `agents/followup-nudger.md` |
| Money Tracker | Logs revenue, reports pipeline vs goal | Weekly digest, Sunday evenings | `agents/money-tracker.md` |
| Brand Builder | Drafts 3 social posts for his web-design brand | Weekly, Friday afternoons | `agents/brand-builder.md` |
| Pitch Coach | Preps him for in-person pitches: opener scripts, objection handling, owner roleplay | On demand (ask in chat) | `agents/pitch-coach.md` |

## Iron rules

1. **Nothing goes out without Tjay's approval.** No emails, DMs, posts, form submissions, or purchases — ever. Agents research, draft, remind, and track. Tjay sends.
2. **No invented businesses.** Every lead name must come from a tool result (search / places details).
3. **Pipeline is the source of truth.** `leads.json` holds every lead and its status. The dashboard mirrors it.
4. **He's 17.** Client contracts, payouts, and age-gated accounts go through a parent. The agents never set those up.

## Files

- `leads.json` — the pipeline. Every lead: id, name, category, neighborhood, website, website_status (`none`/`broken`/`outdated`/`ok`/`unverified`), evidence, score (1–5), date_found, status (`new`/`researched`/`pitched`/`negotiating`/`won`/`lost`), last_contact, notes.
- `revenue.json` — closed deals: date, business, package, amount.
- `PIPELINE.md` — how a lead moves through the stages.
- `agents/` — each agent's playbook (also used as cron job instructions).
- `run-logs/` — one log per agent run.
- `content/` — Brand Builder drafts, awaiting approval.

## Talking to the team

From the Agent HQ chat, Tjay can say things like:
- "Scout 10 more leads in Kitsilano"
- "Draft a pitch for <business>"
- "I pitched <business> today" / "Closed <business> for $95"
- "Mark <business> as lost"
- "Pause the Follow-up Nudger"

## Scale story

Phase 1 (now): the team runs Tjay's own web-design hustle — leads, pitches, follow-ups, money tracking.
Phase 2 (later): the system itself becomes the product — a done-for-you "agent team in a box" sold to other freelancers and small agencies. Same playbooks, new customers.

## Code

- `hq.py` — pipeline CLI that works on `leads.json` / `revenue.json` sitting next to it:
  - `python hq.py stats` — pipeline counts by stage, revenue total, top new leads
  - `python hq.py leads [--stage new]` — list leads, optionally filtered by stage
  - `python hq.py move <id> <stage>` — move a lead (stages: new, researched, pitched, negotiating, won, lost)
  - `python hq.py close <id> <amount>` — mark won and log the revenue
- `leads.schema.json` — the data model for a lead entry.
- `leads.example.json` — the schema in action, with two sample leads. Your live `leads.json` stays private (see `.gitignore`).

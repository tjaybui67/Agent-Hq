# Follow-up Nudger

Makes sure no pitched lead goes cold. Money is in the follow-up.

## Schedule
Weekly, Wednesday evenings (America/Vancouver).

## Playbook
1. Read `leads.json`. Find leads with status `pitched` or `negotiating` where `last_contact` is 5+ days ago.
2. For each, message the Agent HQ chat: business name, days since last contact, and a suggested follow-up line Tjay can use in person or by phone.
3. If a lead has been nudged 3 times with no movement, suggest marking it `lost` and moving on.
4. Write a run log to `run-logs/followup-YYYY-MM-DD.md`.

## Constraints
- Nudges Tjay only. Never contacts the business directly.
- One message per lead per run — no spam.

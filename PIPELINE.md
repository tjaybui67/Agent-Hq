# Pipeline

How a lead moves through Agent HQ. Stored in `leads.json`.

```
new → researched → pitched → negotiating → won
                                  ↘ lost
```

- **new** — Lead Scout found it. Weak or missing website, scored 1–5.
- **researched** — Pitch Crafter built the flyer + concept site. Ready to pitch.
- **pitched** — Tjay pitched in person. `last_contact` = pitch date. Follow-up Nudger watches these.
- **negotiating** — They're interested. Tjay is talking numbers.
- **won** — Deal closed. Money Tracker logs it in `revenue.json`.
- **lost** — Dead lead. Note why in `notes`, move on.

Update rule: Tjay reports what happened in chat ("pitched X today", "closed X for $95", "X said no"), the agent on duty updates the files and the dashboard. The pipeline is only as good as its updates — report outcomes.

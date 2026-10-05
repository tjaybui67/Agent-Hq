# Pitch Crafter

Turns a pipeline lead into a ready-to-pitch package: a one-page leave-behind flyer and a concept demo site, in the style of the Laughing Bean / East Café packages.

## Trigger
On demand — Tjay says "draft a pitch for <business>" in the Agent HQ chat.

## Playbook
1. Read the lead from `leads.json`. Research the business (search, reviews, photos, vibe, menu/services, current web presence).
2. Build the package:
   - One-page leave-behind flyer (PDF) — what their new site would do for them, before/after framing, packages ($45/$95/$195), contact: (778) 938-4838.
   - Concept demo site (web artifact or files) — glassmorphism style, their branding, real copy about their business.
3. Present both to Tjay for approval with a blunt verdict: strong pitch or weak lead, and why.
4. On approval, mark the lead `researched` in `leads.json`. When Tjay confirms he pitched in person, mark `pitched` with today's date as `last_contact`.
5. Refresh the Agent HQ dashboard artifact.

## Constraints
- The concept site is an **unsolicited demo** — never present it as the business's official site.
- Never send anything to the business. Tjay pitches in person.
- No fabricated testimonials, stats, or claims the business can't verify.

## Cluster pitches (scale mechanic)

When the pipeline holds 3+ leads in the same category + area with the same weakness (e.g. the four Hastings-Sunrise pho spots, all on zomi.menu pages only), build ONE flyer template and localize it per shop (name, address, one tailored line each) instead of starting from zero each time. Same for concept sites: one layout, reskinned per shop. Log cluster runs in the run log. This is how one afternoon of work covers four prospects.

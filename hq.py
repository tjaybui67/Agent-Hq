#!/usr/bin/env python3
"""Agent HQ pipeline CLI — manage leads.json and revenue.json from the terminal.

Usage:
    python hq.py stats                     # pipeline counts, revenue, top leads
    python hq.py leads [--stage new]       # list leads, optionally filtered
    python hq.py move lead-003 pitched     # move a lead to a new stage
    python hq.py close lead-001 95         # mark won and log $95 revenue

Stages: new → researched → pitched → negotiating → won / lost
"""
import argparse
import json
import sys
from datetime import date
from pathlib import Path

DATA = Path(__file__).parent
STAGES = ["new", "researched", "pitched", "negotiating", "won", "lost"]


def load(name):
    p = DATA / name
    return json.loads(p.read_text(encoding="utf-8")) if p.exists() else []


def save(name, data):
    (DATA / name).write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def find(leads, lead_id):
    for l in leads:
        if l["id"] == lead_id:
            return l
    return None


def cmd_stats(a):
    leads, rev = load("leads.json"), load("revenue.json")
    print("PIPELINE")
    for s in STAGES:
        print(f"  {s:12} {sum(1 for l in leads if l['status'] == s)}")
    total = sum(r["amount"] for r in rev)
    print(f"\nRevenue: ${total:.0f} CAD across {len(rev)} deal(s)")
    top = sorted((l for l in leads if l["status"] == "new"), key=lambda l: -l["score"])[:3]
    if top:
        print("\nTop new leads:")
        for l in top:
            print(f"  [{l['score']}/5] {l['name']} — {l['neighborhood']}")


def cmd_leads(a):
    for l in load("leads.json"):
        if a.stage and l["status"] != a.stage:
            continue
        print(f"{l['id']}  [{l['score']}/5] {l['name']} ({l['category']}, {l['neighborhood']}) — {l['status']}")


def cmd_move(a):
    if a.stage not in STAGES:
        sys.exit(f"error: stage must be one of {STAGES}")
    leads = load("leads.json")
    lead = find(leads, a.id)
    if not lead:
        sys.exit(f"error: lead not found: {a.id}")
    lead["status"] = a.stage
    if a.stage in ("pitched", "negotiating"):
        lead["last_contact"] = date.today().isoformat()
    save("leads.json", leads)
    print(f"{lead['name']} → {a.stage}")


def cmd_close(a):
    leads, rev = load("leads.json"), load("revenue.json")
    lead = find(leads, a.id)
    if not lead:
        sys.exit(f"error: lead not found: {a.id}")
    lead["status"] = "won"
    lead["last_contact"] = date.today().isoformat()
    rev.append({
        "date": date.today().isoformat(),
        "business": lead["name"],
        "package": a.package,
        "amount": a.amount,
    })
    save("leads.json", leads)
    save("revenue.json", rev)
    print(f"Closed {lead['name']} for ${a.amount:.0f} — nice.")


def main():
    p = argparse.ArgumentParser(prog="hq", description="Agent HQ pipeline CLI")
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("stats", help="pipeline counts, revenue, top leads")
    pl = sub.add_parser("leads", help="list leads")
    pl.add_argument("--stage", choices=STAGES, help="filter by stage")
    pm = sub.add_parser("move", help="move a lead to a stage")
    pm.add_argument("id", help="lead id, e.g. lead-003")
    pm.add_argument("stage", help="one of: " + ", ".join(STAGES))
    pc = sub.add_parser("close", help="mark a lead won and log revenue")
    pc.add_argument("id", help="lead id, e.g. lead-001")
    pc.add_argument("amount", type=float, help="deal amount in CAD")
    pc.add_argument("--package", default="", help="package name, e.g. $95 one-pager")
    a = p.parse_args()
    {"stats": cmd_stats, "leads": cmd_leads, "move": cmd_move, "close": cmd_close}[a.cmd](a)


if __name__ == "__main__":
    main()

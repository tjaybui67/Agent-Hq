/* Backrooms HQ — client-side dashboard logic. No backend, no build step. */
"use strict";

/* ---------------- lead data (baked in from leads.json, 2026-10-05) ---------------- */
const LEADS = [
  { id: "lead-001", name: "Uptown Barber", category: "Barber shop", neighborhood: "Mount Pleasant", score: 5, status: "researched", website_status: "none", evidence: "Listed website is a Facebook page only (Uptown-Barbers-Mount-Pleasant); active shop at 2341 Main St with no standalone website.", notes: "Pitch package built 2026-10-05: leave-behind flyer + concept demo site. Ready for in-person pitch." },
  { id: "lead-002", name: "Welcome Nails", category: "Nail salon", neighborhood: "Hastings-Sunrise", score: 5, status: "new", website_status: "none", evidence: "Listed website is a mobile Facebook page (m.facebook.com/welcomenailsBC); active salon at 2281 E Hastings St with no standalone website.", notes: "" },
  { id: "lead-003", name: "Khao San Thai Street Food", category: "Thai restaurant", neighborhood: "Commercial Drive", score: 4, status: "new", website_status: "none", evidence: "Listed website is a Google Maps share link (share.google); active restaurant at 2062 Commercial Dr with no website of its own.", notes: "" },
  { id: "lead-004", name: "Got Pho Thien Kim", category: "Pho restaurant", neighborhood: "Kensington", score: 4, status: "new", website_status: "none", evidence: "Only web presence is a zomi.menu ordering/menu page; active pho spot at 2523 Nanaimo St with no standalone website.", notes: "" },
  { id: "lead-005", name: "Pho Win", category: "Pho restaurant", neighborhood: "Hastings-Sunrise", score: 4, status: "new", website_status: "none", evidence: "Only web presence is a phowin.zomi.menu menu page; active restaurant at 2138 E Hastings St with no standalone website.", notes: "" },
  { id: "lead-006", name: "Pho You Vietnamese Restaurant", category: "Vietnamese restaurant", neighborhood: "Hastings-Sunrise", score: 4, status: "new", website_status: "none", evidence: "Only web presence is a phoyou.zomi.menu menu page; active restaurant at 2526 E Hastings St with no standalone website.", notes: "" },
  { id: "lead-007", name: "Indian Village Eatery", category: "Indian restaurant", neighborhood: "Hastings-Sunrise", score: 4, status: "new", website_status: "none", evidence: "Only web presence is an indianvillageeatery.zomi.menu menu page; active eatery at 2745 E Hastings St with no standalone website.", notes: "" },
  { id: "lead-008", name: "Rose's Nail Studio", category: "Nail salon", neighborhood: "Commercial Drive", score: 4, status: "new", website_status: "none", evidence: "Listed website is a Cojilio booking widget (booking.cojilio.com/rosesnails), not a website; active studio at 1428 Commercial Dr.", notes: "" },
  { id: "lead-009", name: "Fantasy Nails", category: "Nail salon", neighborhood: "Hastings-Sunrise", score: 4, status: "new", website_status: "none", evidence: "Listed website is an Instagram location-explore link, not the business's own site; active salon at 2720 E Hastings St with no standalone website.", notes: "" },
  { id: "lead-010", name: "Caffè Soccavo", category: "Café / Italian restaurant", neighborhood: "Commercial Drive", score: 4, status: "new", website_status: "outdated", evidence: "soccavoyvr.com verified live: loads as a bare text-only menu page with no images, design, or online ordering — clearly outdated.", notes: "" },
  { id: "lead-011", name: "Fred's Automotive", category: "Auto repair shop", neighborhood: "Fraser Street", score: 4, status: "new", website_status: "broken", evidence: "Listed site fails to load (DNS probe failure in live browser check); active shop at 5574 Fraser St.", notes: "" },
  { id: "lead-012", name: "DKG Autosport Ltd.", category: "Auto repair shop", neighborhood: "Kingsway corridor", score: 4, status: "new", website_status: "broken", evidence: "Listed site fails to load (DNS probe failure in live browser check); active shop near E 23rd Ave, Vancouver.", notes: "" },
  { id: "lead-013", name: "Kartek Auto Services", category: "Auto repair shop", neighborhood: "Kingsway corridor", score: 4, status: "new", website_status: "broken", evidence: "Site redirects to a parked-domain landing page with no business content; active shop at 3812 Main St.", notes: "" },
  { id: "lead-014", name: "Do Most Auto Repairs", category: "Auto repair shop", neighborhood: "Kingsway corridor", score: 4, status: "new", website_status: "broken", evidence: "Listed site fails to load (browser error page, no content); active shop at 799 Kingsway.", notes: "" },
  { id: "lead-015", name: "Samson Auto Service", category: "Auto repair / body shop", neighborhood: "Kingsway corridor", score: 4, status: "new", website_status: "broken", evidence: "Listed site is an empty Blogspot blog with no posts; active shop at 1122 Kingsway.", notes: "" },
  { id: "lead-016", name: "Luk Clutch Care Centre", category: "Auto repair shop", neighborhood: "Fraser Street", score: 3, status: "new", website_status: "none", evidence: "No website listed anywhere; only a meta.ai placeholder link. Active shop near Fraser St, Vancouver.", notes: "" },
  { id: "lead-017", name: "Amin's Auto Service", category: "Auto repair shop", neighborhood: "Kingsway corridor", score: 4, status: "new", website_status: "none", evidence: "Only web presence is an Instagram location link, not a website; active shop at 204 Kingsway.", notes: "" },
  { id: "lead-018", name: "Vibes Fitness", category: "Gym", neighborhood: "Dunbar", score: 4, status: "new", website_status: "broken", evidence: "Domain is registered and listed as its website but fails to load (HTTPS cert error, HTTP renders blank); active gym at 5628 Dunbar St.", notes: "" },
  { id: "lead-019", name: "Nuan Nuan Beef Noodle House", category: "Beef noodle restaurant", neighborhood: "West End", score: 5, status: "new", website_status: "none", evidence: "Signage up at 805 Denman (corner Denman & Robson, replacing Holy Guacamole); window reads 'Opening Soon / Now Hiring' (kitchen helpers, servers wanted); no website or social media accounts found; no opening date announced yet (The West End Journal, Oct 2026 issue).", notes: "Opening soon = pitch window is before launch." }
];

const STATUSES = ["new", "researched", "pitched", "negotiating", "won", "lost"];
const STORAGE_KEY = "backrooms_hq_pipeline";

const SITE_LABELS = { none: "No website", broken: "Broken site", outdated: "Outdated site" };

/* ---------------- state ---------------- */
let statusOverrides = {};
try {
  statusOverrides = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
} catch (e) { statusOverrides = {}; }

function getStatus(lead) {
  return statusOverrides[lead.id] || lead.status;
}
function saveOverrides() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(statusOverrides)); } catch (e) {}
}

/* ---------------- toast ---------------- */
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById("toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  el.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.classList.remove("show");
    setTimeout(() => el.classList.add("hidden"), 300);
  }, 2200);
}

function copyText(text, msg) {
  const done = () => toast(msg || "Copied");
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); } catch (e) {}
  document.body.removeChild(ta);
  done();
}

/* ---------------- kanban ---------------- */
function leadMatches(lead, query, minScore) {
  if (lead.score < minScore) return false;
  if (!query) return true;
  const hay = (lead.name + " " + lead.category + " " + lead.neighborhood).toLowerCase();
  return hay.includes(query);
}

function renderPipeline() {
  const query = (document.getElementById("search").value || "").toLowerCase().trim();
  const minScore = parseInt(document.getElementById("score-filter").value, 10) || 0;
  STATUSES.forEach(status => {
    const container = document.querySelector('.cards[data-drop="' + status + '"]');
    container.innerHTML = "";
    const leads = LEADS.filter(l => getStatus(l) === status && leadMatches(l, query, minScore));
    leads.forEach(lead => {
      const card = document.createElement("div");
      card.className = "lead-card";
      card.draggable = true;
      card.dataset.id = lead.id;
      card.innerHTML =
        '<div class="lc-name"></div>' +
        '<div class="lc-meta"></div>';
      card.querySelector(".lc-name").textContent = lead.name;
      card.querySelector(".lc-meta").innerHTML = "";
      const meta = document.createElement("span");
      meta.textContent = lead.category + " · " + lead.neighborhood + " · ";
      const sc = document.createElement("span");
      sc.className = "lc-score";
      sc.textContent = "★ " + lead.score + "/5";
      card.querySelector(".lc-meta").appendChild(meta);
      card.querySelector(".lc-meta").appendChild(sc);
      card.addEventListener("click", () => openModal(lead.id));
      card.addEventListener("dragstart", e => {
        e.dataTransfer.setData("text/plain", lead.id);
        e.dataTransfer.effectAllowed = "move";
        setTimeout(() => card.classList.add("dragging"), 0);
      });
      card.addEventListener("dragend", () => card.classList.remove("dragging"));
      container.appendChild(card);
    });
    const countEl = document.querySelector('.count[data-count-for="' + status + '"]');
    if (countEl) countEl.textContent = leads.length;
  });
}

function moveLead(id, status) {
  const lead = LEADS.find(l => l.id === id);
  if (!lead) return;
  if (lead.status === status) delete statusOverrides[id];
  else statusOverrides[id] = status;
  saveOverrides();
  renderPipeline();
}

document.querySelectorAll(".cards").forEach(zone => {
  zone.addEventListener("dragover", e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    zone.closest(".column").classList.add("drag-over");
  });
  zone.addEventListener("dragleave", () => zone.closest(".column").classList.remove("drag-over"));
  zone.addEventListener("drop", e => {
    e.preventDefault();
    zone.closest(".column").classList.remove("drag-over");
    const id = e.dataTransfer.getData("text/plain");
    if (id) moveLead(id, zone.dataset.drop);
  });
});

document.getElementById("search").addEventListener("input", renderPipeline);
document.getElementById("score-filter").addEventListener("change", renderPipeline);

/* ---------------- lead modal ---------------- */
const modal = document.getElementById("lead-modal");
let modalLeadId = null;

function openModal(id) {
  const lead = LEADS.find(l => l.id === id);
  if (!lead) return;
  modalLeadId = id;
  document.getElementById("m-name").textContent = lead.name;
  document.getElementById("m-category").textContent = lead.category;
  document.getElementById("m-neighborhood").textContent = lead.neighborhood;
  document.getElementById("m-score").textContent = lead.score;
  document.getElementById("m-site").textContent = SITE_LABELS[lead.website_status] || lead.website_status;
  document.getElementById("m-evidence").textContent = lead.evidence || "—";
  const notesEl = document.getElementById("m-notes");
  notesEl.textContent = lead.notes || "";
  notesEl.style.display = lead.notes ? "" : "none";
  document.getElementById("m-stage").value = getStatus(lead);
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
  modalLeadId = null;
}
document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });
document.getElementById("m-stage").addEventListener("change", e => {
  if (modalLeadId) {
    moveLead(modalLeadId, e.target.value);
    toast("Moved");
  }
});

/* ---------------- count-ups ---------------- */
function countUp(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || "0", 10);
  const prefix = el.dataset.prefix || "";
  const dur = 1200;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + (target * eased).toFixed(decimals);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* ---------------- typing tagline ---------------- */
const TAGLINES = [
  "6 agents deep in the backrooms.",
  "19 leads. Zero missed follow-ups.",
  "The business runs while you're away."
];
function startTagline() {
  const el = document.getElementById("tagline");
  let li = 0, ci = 0, deleting = false;
  function tick() {
    const line = TAGLINES[li];
    if (!deleting) {
      ci++;
      el.textContent = line.slice(0, ci);
      if (ci === line.length) {
        deleting = true;
        return setTimeout(tick, 2400);
      }
      return setTimeout(tick, 45);
    } else {
      ci--;
      el.textContent = line.slice(0, ci);
      if (ci === 0) {
        deleting = false;
        li = (li + 1) % TAGLINES.length;
        return setTimeout(tick, 400);
      }
      return setTimeout(tick, 22);
    }
  }
  tick();
}

/* ---------------- scroll reveals ---------------- */
function initReveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        en.target.querySelectorAll(".stat-num").forEach(countUp);
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

/* ---------------- card tilt ---------------- */
function initTilt() {
  if (window.matchMedia("(hover: none)").matches) return;
  document.querySelectorAll(".tilt").forEach(card => {
    card.addEventListener("mousemove", e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = "perspective(800px) rotateX(" + (-y * 6) + "deg) rotateY(" + (x * 6) + "deg)";
    });
    card.addEventListener("mouseleave", () => { card.style.transform = ""; });
  });
}

/* ---------------- ripples ---------------- */
document.querySelectorAll(".ripple").forEach(btn => {
  btn.addEventListener("click", function (e) {
    const r = btn.getBoundingClientRect();
    btn.style.setProperty("--rx", (e.clientX - r.left) + "px");
    btn.style.setProperty("--ry", (e.clientY - r.top) + "px");
    btn.classList.remove("rippling");
    void btn.offsetWidth;
    btn.classList.add("rippling");
  });
});

/* ---------------- quote calculator ---------------- */
const TIERS = { Spark: 45, Neon: 95, Afterhours: 195 };
let activeTier = "Neon";
let displayedTotal = 95;

function calcParts() {
  const addons = [];
  document.querySelectorAll(".calc-addons input:checked").forEach(box => {
    addons.push({ name: box.dataset.addon, price: parseInt(box.dataset.price, 10) });
  });
  return { tier: activeTier, base: TIERS[activeTier], addons };
}

function renderCalc() {
  const { tier, base, addons } = calcParts();
  const total = base + addons.reduce((s, a) => s + a.price, 0);
  const el = document.getElementById("calc-total");
  const start = displayedTotal;
  const t0 = performance.now();
  const dur = 500;
  function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = "$" + Math.round(start + (total - start) * eased);
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  displayedTotal = total;
}

document.querySelectorAll(".calc-tier").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".calc-tier").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeTier = btn.dataset.tier;
    renderCalc();
  });
});
document.querySelectorAll(".calc-addons input").forEach(box => {
  box.addEventListener("change", renderCalc);
});

document.getElementById("copy-quote").addEventListener("click", () => {
  const { tier, base, addons } = calcParts();
  const total = base + addons.reduce((s, a) => s + a.price, 0);
  let text = tier + " package ($" + base + ")";
  if (addons.length) {
    text += " + " + addons.map(a => a.name.toLowerCase() + " ($" + a.price + ")").join(" + ");
  }
  text += " = $" + total + ". Domain & hosting separate. — Tjay";
  copyText(text, "Quote copied");
});

/* ---------------- goal tracker ---------------- */
const REVENUE = 0;
let goal = 500;
function renderGoal() {
  document.getElementById("goal-revenue").textContent = "$" + REVENUE;
  document.getElementById("goal-amount-label").textContent = "$" + goal;
  const pct = goal > 0 ? Math.min(100, (REVENUE / goal) * 100) : 0;
  document.getElementById("goal-fill").style.width = pct + "%";
}
document.getElementById("goal-input").addEventListener("change", e => {
  const v = parseInt(e.target.value, 10);
  if (v > 0) {
    goal = v;
    renderGoal();
    toast("Goal set to $" + v);
  } else {
    e.target.value = goal;
  }
});

/* ---------------- command chips ---------------- */
document.querySelectorAll(".chip").forEach(chip => {
  chip.addEventListener("click", () => copyText(chip.dataset.cmd, "Command copied"));
});

/* ---------------- init ---------------- */
renderPipeline();
renderGoal();
startTagline();
initReveals();
initTilt();

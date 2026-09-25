/* ============ KnownLabs v3 — site interactions ============ */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? "" : s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- theme: light default, dark on toggle ---------- */
  const themeToggle = $("#themeToggle");
  function applyTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("kl-theme", t); } catch (e) {}
  }
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }

  /* ---------- mobile menu ---------- */
  const burger = $("#burger"), mmenu = $("#mmenu"), mclose = $("#mclose");
  if (burger && mmenu) {
    burger.addEventListener("click", () => mmenu.classList.add("open"));
    if (mclose) mclose.addEventListener("click", () => mmenu.classList.remove("open"));
    $$("a", mmenu).forEach(a => a.addEventListener("click", () => mmenu.classList.remove("open")));
  }

  /* ---------- navbar: scrolled hairline ---------- */
  const nav = $("#nav");
  function onScroll() {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- scrollspy: underline indicator ---------- */
  const navLinks = $("#navLinks");
  const spyLinks = navLinks ? $$('a[data-spy]', navLinks) : [];
  if (spyLinks.length) {
    const sections = spyLinks.map(a => document.getElementById(a.dataset.spy)).filter(Boolean);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          spyLinks.forEach(a => a.classList.toggle("spy-active", a.dataset.spy === id));
        }
      });
    }, { rootMargin: "-38% 0px -55% 0px" });
    sections.forEach(s => spy.observe(s));
    // highlight based on hash on load
    const fromHash = spyLinks.find(a => a.getAttribute("href") === location.hash);
    if (fromHash) setTimeout(() => {
      spyLinks.forEach(a => a.classList.toggle("spy-active", a === fromHash));
    }, 80);
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => io.observe(el));

  /* ---------- hero entrance ---------- */
  $$(".hero .rise").forEach((el, i) => {
    setTimeout(() => el.classList.add("in"), 100 + i * 110);
  });

  /* ---------- animated counters ---------- */
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, target = parseInt(el.dataset.count || "0", 10);
      if (reduced || !target) { el.textContent = target || el.textContent; return; }
      const t0 = performance.now(), dur = 1300;
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur), ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * ease);
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.6 });
  $$(".count").forEach(el => cio.observe(el));

  /* ---------- accordion (FAQ) + work card toggles + service index (delegated) ---------- */
  function sizeIndexRows(scope) {
    $$(".idx-row", scope || document).forEach(row => {
      const body = $(".idx-body", row);
      if (row.classList.contains("open")) body.style.maxHeight = body.scrollHeight + "px";
      else body.style.maxHeight = "0px";
    });
  }
  document.addEventListener("click", (e) => {
    const q = e.target.closest(".faq-q");
    if (q) {
      const item = q.closest(".faq-item");
      const wasOpen = item.classList.contains("open");
      $$(".faq-item.open", item.parentElement).forEach(i => i.classList.remove("open"));
      if (!wasOpen) item.classList.add("open");
      return;
    }
    const t = e.target.closest(".work-toggle");
    if (t) { t.closest(".work-card").classList.toggle("open"); return; }
    const h = e.target.closest(".idx-head");
    if (h) {
      const row = h.closest(".idx-row");
      const wasOpen = row.classList.contains("open");
      $$(".idx-row.open", row.closest(".idx")).forEach(r => {
        r.classList.remove("open");
        $(".idx-head", r).setAttribute("aria-expanded", "false");
        $(".idx-body", r).style.maxHeight = "0px";
      });
      if (!wasOpen) {
        row.classList.add("open");
        h.setAttribute("aria-expanded", "true");
        const body = $(".idx-body", row);
        body.style.maxHeight = body.scrollHeight + "px";
      }
    }
  });
  window.addEventListener("resize", () => sizeIndexRows());

  /* ---------- footer year ---------- */
  $$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- render helpers ---------- */
  const CHECK = '<span class="ic"><svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5"/></svg></span>';
  const ARROW = '<span class="ic"><svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>';
  const CHEV = '<span class="ic"><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></span>';

  function projectCard(p) {
    const cats = (p.categories || []).map(c => `<span>${esc(c)}</span>`).join("");
    const delivs = (p.deliverables || []).map(d => `<li>${CHECK}${esc(d)}</li>`).join("");
    const img = esc(p.image || p.image_url || "");
    const live = esc(p.live_url || "");
    return `
    <article class="work-card reveal">
      ${cats ? `<div class="work-tags">${cats}</div>` : ""}
      <div class="work-media">
        ${img ? `<img src="${img}" alt="${esc(p.title)}" loading="lazy">` : ""}
      </div>
      <div class="work-body">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        ${delivs ? `<div class="work-more"><ul>${delivs}</ul></div>` : ""}
        <div class="work-meta">
          ${delivs ? `<button class="work-toggle">Details ${CHEV}</button>` : "<span></span>"}
          ${live ? `<a class="work-link" href="${live}" target="_blank" rel="noopener">Visit live site ${ARROW}</a>` : ""}
        </div>
      </div>
    </article>`;
  }

  const SVC_ICONS = [
    '<svg viewBox="0 0 24 24"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z"/><path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18"/><path d="m2.3 2.3 7.286 7.286"/><circle cx="11" cy="11" r="2"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/></svg>',
    '<svg viewBox="0 0 24 24"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>',
    '<svg viewBox="0 0 24 24"><path d="m12.296 3.464 3.02 3.956"/><path d="M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3z"/><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="m6.18 5.276 3.1 3.899"/></svg>'
  ];

  function serviceCard(s, i) {
    const delivs = (s.deliverables || []).map(d => `<li>${CHECK}${esc(d)}</li>`).join("");
    return `
    <div class="svc reveal"><span class="num">0${(i % 6) + 1}</span>
      <div class="svc-icon">${SVC_ICONS[i % SVC_ICONS.length]}</div>
      <h3>${esc(s.title)}</h3>
      <p>${esc(s.description)}</p>
      ${delivs ? `<ul style="list-style:none;display:grid;gap:8px;margin-top:16px">${delivs}</ul>` : ""}
    </div>`;
  }

  function faqItem(f, i) {
    const n = String((i || 0) + 1).padStart(2, "0");
    return `
    <div class="faq-item">
      <button class="faq-q"><span class="fq-num">${n}</span><span class="fq-t">${esc(f.question)}</span> ${CHEV}</button>
      <div class="faq-a"><p>${esc(f.answer)}</p></div>
    </div>`;
  }

  const IDX_TAGS = ["Design & Build", "Design", "Build", "Growth", "Growth", "Content"];

  function serviceMenuRow(s, i) {
    return `
    <a class="menurow reveal" href="services.html">
      <span class="mnum">0${(i % 6) + 1}</span>
      <span class="mtitle">${esc(s.title)}</span>
      <span class="mdesc">${esc(s.description)}</span>
      <span class="marrow"><svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></span>
    </a>`;
  }

  function projectFeature(p, i) {
    const cats = (p.categories || []).map(c => `<span>${esc(c)}</span>`).join("");
    const delivs = (p.deliverables || []).map(d => `<li>${CHECK}${esc(d)}</li>`).join("");
    const img = esc(p.image || p.image_url || "");
    const live = esc(p.live_url || "");
    return `
    <article class="feat reveal${i % 2 ? " flip" : ""}">
      <div class="fcol">
        ${cats ? `<div class="work-tags">${cats}</div>` : ""}
        <div class="fmedia">
          ${img ? `<img src="${img}" alt="${esc(p.title)}" loading="lazy">` : ""}
        </div>
      </div>
      <div class="fbody">
        <div class="kicker">Case 0${i + 1}</div>
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        ${delivs ? `<ul class="fdelivs">${delivs}</ul>` : ""}
        <div class="fmeta">
          ${live ? `<a class="work-link" href="${live}" target="_blank" rel="noopener">Visit live site ${ARROW}</a>` : ""}
          <a class="work-link" href="projects.html">More work ${ARROW}</a>
        </div>
      </div>
    </article>`;
  }
  function serviceIndexRow(s, i) {
    const delivs = (s.deliverables || []).map(d => `<span><i></i>${esc(d)}</span>`).join("");
    const wa = "https://wa.me/919835059241?text=" + encodeURIComponent("Hi KnownLabs! I'm interested in your " + s.title + " service.");
    return `
    <div class="idx-row${i === 0 ? " open" : ""}">
      <button class="idx-head" aria-expanded="${i === 0 ? "true" : "false"}">
        <span class="idx-num">/ 0${(i % 6) + 1}</span>
        <span class="idx-title">${esc(s.title)}</span>
        <span class="idx-tag">${IDX_TAGS[i % IDX_TAGS.length]}</span>
        <span class="idx-plus"><svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg></span>
      </button>
      <div class="idx-body">
        <div class="idx-body-in">
          <span class="sp"></span>
          <div>
            <p class="idx-desc">${esc(s.description)}</p>
            ${delivs ? `<div class="idx-delivs">${delivs}</div>` : ""}
            <a class="idx-cta" href="${wa}" target="_blank" rel="noopener">Enquire about ${esc(s.title)} <svg viewBox="0 0 24 24"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg></a>
          </div>
        </div>
      </div>
    </div>`;
  }

  function testimonialCard(t) {
    const initials = esc((t.name || "?").trim().split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase());
    const n = Math.max(1, Math.min(5, t.rating || 5));
    const star = '<svg viewBox="0 0 24 24"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';
    return `
    <div class="testi reveal">
      <div class="stars">${star.repeat(n)}</div>
      <p>“${esc(t.quote)}”</p>
      <div class="who"><div class="ava">${initials}</div>
        <div><b>${esc(t.name)}</b><span>${esc([t.role, t.company].filter(Boolean).join(" · "))}</span></div>
      </div>
    </div>`;
  }

  /* ---------- hydrate dynamic sections (Supabase or static fallback) ---------- */
  async function hydrate() {
    try { KL.initSupabase(); } catch (e) { /* static fallback */ }

    const projMount = $("[data-projects]");
    if (projMount) {
      try {
        const limit = parseInt(projMount.dataset.projects || "0", 10);
        let projects = await KL.getProjects();
        if (limit > 0) projects = projects.slice(0, limit);
        if (projects.length) {
          const variant = projMount.dataset.projects;
          projMount.innerHTML = variant === "feature"
            ? projects.map(projectFeature).join("")
            : projects.map(projectCard).join("");
          $$(".reveal", projMount).forEach(el => io.observe(el));
        }
      } catch (e) { console.warn("projects:", e); }
    }

    const svcMount = $("[data-services]");
    if (svcMount) {
      try {
        const services = await KL.getServices();
        if (services.length) {
          const variant = svcMount.dataset.services;
          if (variant === "index") {
            svcMount.innerHTML = `<div class="idx reveal">${services.map(serviceIndexRow).join("")}</div>`;
            sizeIndexRows(svcMount);
          } else if (variant === "menu") {
            const mlimit = parseInt(svcMount.dataset.limit || "0", 10);
            const list = mlimit > 0 ? services.slice(0, mlimit) : services;
            svcMount.innerHTML = `<div class="menulist reveal">${list.map(serviceMenuRow).join("")}</div>`;
          } else {
            svcMount.innerHTML = services.map(serviceCard).join("");
          }
          $$(".reveal", svcMount).forEach(el => io.observe(el));
        }
      } catch (e) { console.warn("services:", e); }
    }

    const faqMount = $("[data-faqs]");
    if (faqMount) {
      try {
        const limit = parseInt(faqMount.dataset.faqs || "0", 10);
        let faqs = await KL.getFaqs();
        if (limit > 0) faqs = faqs.slice(0, limit);
        if (faqs.length) faqMount.innerHTML = faqs.map(faqItem).join("");
      } catch (e) { console.warn("faqs:", e); }
    }

    const tMount = $("[data-testimonials]");
    if (tMount) {
      try {
        const testimonials = await KL.getTestimonials();
        const section = tMount.closest("section");
        if (!testimonials.length) { if (section) section.style.display = "none"; }
        else {
          tMount.innerHTML = testimonials.map(testimonialCard).join("");
          $$(".reveal", tMount).forEach(el => io.observe(el));
        }
      } catch (e) {
        const section = tMount.closest("section");
        if (section) section.style.display = "none";
      }
    }
  }

  /* ---------- contact form ---------- */
  const form = $("#contact-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const note = $("#form-note");
      const els = form.elements;
      const contactRaw = els.contact.value.trim();
      const isEmail = contactRaw.includes("@");
      const data = {
        name: els.name.value.trim(),
        email: isEmail ? contactRaw : null,
        phone: isEmail ? null : contactRaw,
        service: els.service.value,
        message: els.message.value.trim()
      };
      const orig = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = "Sending…";
      let saved = false;
      try { saved = await KL.submitInquiry(data); }
      catch (err) { console.warn(err); }
      if (saved) {
        note.textContent = "Thanks " + data.name.split(" ")[0] + "! Your inquiry is in — we'll get back to you soon.";
        form.reset();
      } else {
        const msg = "Hi KnownLabs! I'm " + data.name + " (" + contactRaw + "). I'm interested in: " +
          data.service + ". " + data.message;
        window.open(KL.waLink(msg), "_blank");
        note.textContent = "Opening WhatsApp with your message — just hit send there.";
      }
      btn.disabled = false; btn.innerHTML = orig;
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", hydrate);
  else hydrate();
})();

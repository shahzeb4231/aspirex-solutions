const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');

/* ===== EDIT HERE: one entry per screenshot. Images live in images/progress/ =====
   pos = which part of the screenshot shows in the small card (the full image opens on tap).
   A card whose image file is missing hides itself, so 7 or 8 files both work. */
const PROOFS = [
  { img: 'images/progress/progress1.jpeg', pos: '50% 26%', cat: 'new', tag: 'New account, first 30 days', title: 'EUR 6,120 in the first month',
    text: 'A brand-new account tracked from Sep 15 to Oct 15. Sales grew 158.7% on the period before.',
    facts: [['EUR 6,120', 'last 31 days'], ['EUR 8,486', 'last 90 days'], ['EUR 1,152', 'last 7 days'], ['EUR 174', 'best day']] },
  { img: 'images/progress/progress2.jpeg', pos: '10% 50%', cat: 'new', tag: 'UK store, 100% feedback', title: 'everydayvaluestoreuk',
    text: 'A younger UK account with its own logo, steady views and a clean feedback record.',
    facts: [['£507', 'sales, 90 days'], ['41', 'orders'], ['2,865', 'listing views'], ['100%', 'feedback']] },
  { img: 'images/progress/progress3.jpeg', pos: '72% 50%', cat: 'new', tag: 'Fast growth', title: 'Sales up 207% in a month',
    text: 'A small UK store with 36 active listings. Sales pick up in early November.',
    facts: [['£244', 'last 31 days'], ['+207.7%', 'vs prior period'], ['33', 'orders, 90 days'], ['36', 'active listings']] },
  { img: 'images/progress/progress4.jpeg', pos: '75% 50%', cat: 'established', tag: 'Established UK store', title: '£8,059 and 889 orders in 90 days',
    text: 'A busy account with 160 active listings and sales on almost every day of the period.',
    facts: [['£8,059', 'sales, 90 days'], ['889', 'orders'], ['22,721', 'listing views'], ['98.3%', 'feedback']] },
  { img: 'images/progress/progress7.jpeg', pos: '70% 50%', cat: 'established', tag: 'Established EUR store', title: 'EUR 9,506 and 542 orders in 90 days',
    text: 'A large account with 218 active listings, shown for Oct 18 to Nov 17.',
    facts: [['EUR 9,506', 'sales, 90 days'], ['542', 'orders'], ['22,150', 'listing views'], ['218', 'active listings']] },
  { img: 'images/progress/progress5.jpeg', pos: '50% 50%', cat: 'trust', tag: 'Seller level', title: 'Top-rated Seller (UK)',
    text: 'eBay rates the account Top-rated. Defect, late delivery and case rates are all well under 1%.',
    facts: [['0.18%', 'transaction defects'], ['0.37%', 'late delivery'], ['0.18%', 'cases unresolved'], ['Top-rated', 'seller level']] },
  { img: 'images/progress/progress6.jpeg', pos: '45% 40%', cat: 'trust', tag: 'Live from our workspace', title: 'Seller Hub on a real desk',
    text: 'A photo of the performance page open at our working desk, with 31 days of daily sales.',
    facts: [['31 days', 'daily sales chart'], ['£571', 'selling costs']] },
  /* Optional 8th: save the £1,471 screenshot as images/progress/progress8.jpeg and it appears by itself */
  { img: 'images/progress/progress8.jpeg', pos: '78% 50%', cat: 'new', tag: 'UK store, 203 listings', title: '£1,471 in 90 days, climbing fast',
    text: 'A UK account with 203 active listings. The last 31 days are up over 1,000% from a very small starting base.',
    facts: [['£1,471', 'sales, 90 days'], ['122', 'orders'], ['7,483', 'listing views'], ['£450', 'last 7 days']] }
];

// Missing optional images are removed so fallbacks show
addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.classList.contains('opt')) e.target.remove(); }, true);

// Headline: word-by-word entrance, second sentence in gold
const h1 = $('#h1'), split = +h1.dataset.split;
h1.innerHTML = h1.textContent.split(' ').map((w, i) =>
  `<span class="${i >= split ? 'g' : ''}" style="animation-delay:${0.25 + i * 0.09}s">${w}</span>`).join('');

// "Dashboards shown" counter always matches the cards that really exist
const kpi = $('[data-count="8"]');
const syncCount = () => { const n = $$('.pcard').length; kpi.dataset.count = n; if (kpi.textContent !== '0') kpi.textContent = n; };

// Build the screenshot cards
const ZOOM = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3M11 8v6M8 11h6"/></svg>';
const grid = $('#pgrid');
grid.innerHTML = PROOFS.map((p, i) => `
  <article class="pcard reveal" data-cat="${p.cat}">
    <button class="pshot" data-i="${i}" aria-label="Enlarge: ${p.title}">
      <img src="${p.img}" alt="${p.title}" style="object-position:${p.pos || 'top center'}" loading="lazy"><span class="zoom">${ZOOM}</span>
    </button>
    <div class="pinfo">
      <span class="ptag">${p.tag}</span><h3>${p.title}</h3><p>${p.text}</p>
      <ul class="pfacts">${p.facts.map(f => `<li><b>${f[0]}</b>${f[1]}</li>`).join('')}</ul>
    </div>
  </article>`).join('');
$$('.pshot img').forEach(img => {
  const drop = () => { img.closest('.pcard').remove(); syncCount(); };
  img.addEventListener('error', drop);
  if (img.complete && img.naturalWidth === 0) drop();
});
syncCount();

// Scroll: progress bar, nav state
addEventListener('scroll', () => {
  const h = document.documentElement;
  $('#progress').style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100 + '%';
  nav.classList.toggle('scrolled', scrollY > 40);
  $('.aurora').style.transform = `translateY(${scrollY * 0.2}px)`;
}, { passive: true });

// Mobile menu
burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
$$('#menu a').forEach(a => a.addEventListener('click', () => menu.classList.remove('open')));

// Staggered reveal on scroll
$$('.kpi-grid,.pgrid,.steps').forEach(g => $$('.reveal', g).forEach((el, i) => el.style.setProperty('--d', (i % 4) * 0.09 + 's')));
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
$$('.reveal').forEach(el => io.observe(el));

// Counters
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const tick = t => { const p = Math.min((t - t0) / 1500, 1); el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
  requestAnimationFrame(tick); co.unobserve(el);
}), { threshold: 0.6 });
$$('[data-count]').forEach(el => co.observe(el));

if (matchMedia('(hover:hover)').matches) {
  $$('.spot').forEach(el => el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', e.clientX - r.left + 'px'); el.style.setProperty('--y', e.clientY - r.top + 'px');
  }));
  $$('.mag').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
}

// Filters
$$('.fchip').forEach(c => c.addEventListener('click', () => {
  $$('.fchip').forEach(x => x.classList.toggle('on', x === c));
  $$('.pcard').forEach(k => k.classList.toggle('hide', c.dataset.f !== 'all' && k.dataset.cat !== c.dataset.f));
}));

// Lightbox: arrows, keyboard, swipe, respects the active filter
const lb = $('#plb'); let cur = 0, lastFocus;
const visible = () => $$('.pcard:not(.hide) .pshot').map(b => +b.dataset.i);
function show(i) {
  const p = PROOFS[i]; cur = i;
  $('#plbImg').src = p.img; $('#plbImg').alt = p.title; $('#plbT').textContent = p.title; $('#plbD').textContent = p.text;
  if (!lb.classList.contains('open')) { lastFocus = document.activeElement; lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); $('#plbX').focus(); }
}
function step(d) { const v = visible(), n = v.length; if (n) show(v[(v.indexOf(cur) + d + n) % n]); }
function closeLb() { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); if (lastFocus) lastFocus.focus(); }
grid.addEventListener('click', e => { const b = e.target.closest('.pshot'); if (b) show(+b.dataset.i); });
$('#plbX').onclick = closeLb; $('#plbP').onclick = () => step(-1); $('#plbN').onclick = () => step(1);
lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
addEventListener('keydown', e => {
  if (!lb.classList.contains('open')) return;
  if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1);
});
let tx = null;
lb.addEventListener('touchstart', e => tx = e.touches[0].clientX, { passive: true });
lb.addEventListener('touchend', e => { if (tx === null) return; const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) step(d < 0 ? 1 : -1); tx = null; });

// WhatsApp "Need help?" hint
const wa = $('#wa');
setTimeout(() => { wa.classList.add('show'); setTimeout(() => wa.classList.remove('show'), 4500); }, 5000);
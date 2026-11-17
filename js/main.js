const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const nav = $('#nav'), menu = $('#menu'), burger = $('#burger');

// Missing optional images are removed so fallbacks show
addEventListener('error', e => { if (e.target.tagName === 'IMG' && e.target.classList.contains('opt')) e.target.remove(); }, true);

// Hero headline: word-by-word entrance, second sentence in gold
const h1 = $('#h1'), split = +h1.dataset.split;
h1.innerHTML = h1.textContent.split(' ').map((w, i) =>
  `<span class="${i >= split ? 'g' : ''}" style="animation-delay:${0.25 + i * 0.09}s">${w}</span>`).join('');

// Scroll: progress bar, nav state, aurora parallax
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
$$('.bento,.feat,.steps,.team').forEach(g => $$('.reveal', g).forEach((el, i) => el.style.setProperty('--d', i * 0.09 + 's')));
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
  // Cursor spotlight on cards
  $$('.spot').forEach(el => el.addEventListener('mousemove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--x', e.clientX - r.left + 'px'); el.style.setProperty('--y', e.clientY - r.top + 'px');
  }));
  // 3D tilt on mentor cards
  $$('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
  // Magnetic buttons
  $$('.mag').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.2}px,${(e.clientY - r.top - r.height / 2) * 0.3}px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
}

// Course details popup
const modal = $('#modal'); let lastFocus;
const openM = () => { lastFocus = document.activeElement; modal.classList.add('open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('lock'); $('.x', modal).focus(); };
const closeM = () => { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('lock'); if (lastFocus) lastFocus.focus(); };
document.addEventListener('click', e => {
  if (e.target.closest('[data-close]') || e.target === modal) return closeM();
  if (e.target.closest('[data-open]') && !e.target.closest('a')) openM();
});
addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeM(); });

// WhatsApp "Need help?" hint appears briefly so touch users see it too
const wa = $('#wa');
setTimeout(() => { wa.classList.add('show'); setTimeout(() => wa.classList.remove('show'), 4500); }, 5000);

// Office photo slider arrows
const gal = $('#gallery'), gPrev = $('#gPrev'), gNext = $('#gNext');
const gStep = () => gal.querySelector('figure').getBoundingClientRect().width + 16;
const gUpdate = () => { gPrev.disabled = gal.scrollLeft < 4; gNext.disabled = gal.scrollLeft + gal.clientWidth >= gal.scrollWidth - 4; };
gPrev.onclick = () => gal.scrollBy({ left: -gStep(), behavior: 'smooth' });
gNext.onclick = () => gal.scrollBy({ left: gStep(), behavior: 'smooth' });
gal.addEventListener('scroll', gUpdate, { passive: true });
addEventListener('resize', gUpdate); addEventListener('load', gUpdate); gUpdate();
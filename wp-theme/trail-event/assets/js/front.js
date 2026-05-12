/* ── Reveal on scroll ──────────────────────────────────────────────────── */
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── Mobile nav ────────────────────────────────────────────────────────── */
const toggle = document.querySelector('.nav-toggle');
const nav    = document.querySelector('#site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

/* ── Sticky header shadow ──────────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  document.querySelector('.site-header')?.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

/* ── Compte à rebours ──────────────────────────────────────────────────── */
const cntEl = document.querySelector('.countdown[data-date]');
if (cntEl) {
  const target = new Date(cntEl.dataset.date).getTime();
  function updateCnt() {
    const diff = target - Date.now();
    if (diff <= 0) { cntEl.innerHTML = "<p>C'est parti !</p>"; return; }
    const j = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const pad = n => String(n).padStart(2, '0');
    const el = id => document.getElementById(id);
    if (el('cnt-j')) el('cnt-j').textContent = pad(j);
    if (el('cnt-h')) el('cnt-h').textContent = pad(h);
    if (el('cnt-m')) el('cnt-m').textContent = pad(m);
    if (el('cnt-s')) el('cnt-s').textContent = pad(s);
  }
  updateCnt();
  setInterval(updateCnt, 1000);
}

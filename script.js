/**
 * Dr. Louati Moataz – script.js
 * Loader · Navbar · Scroll reveal · Form → Supabase · Back to top
 */

'use strict';

/* ══ CONFIG SUPABASE ════════════════════════════════════════ */
const SUPABASE_URL = 'https://pthptzlydtoioiqguool.supabase.co';
const SUPABASE_KEY = 'sb_publishable_tnV3FxLwr1qtyDayS_j2-Q_sWdHwjHd';

/* ══ 1. LOADER ═════════════════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('done');
  }, 2000);
});

/* ══ 2. NAVBAR ═════════════════════════════════════════════ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const btt = document.getElementById('btt');
  if (btt) btt.classList.toggle('show', window.scrollY > 400);
  highlightNav();
}, { passive: true });

hamburger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  });
});

document.addEventListener('click', e => {
  if (navLinks.classList.contains('open') &&
      !navLinks.contains(e.target) &&
      !hamburger.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    document.body.style.overflow = '';
  }
});

/* ══ 3. SMOOTH SCROLL ══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ══ 4. ACTIVE NAV HIGHLIGHT ═══════════════════════════════ */
function highlightNav() {
  const sections = document.querySelectorAll('section[id]');
  const mid = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    if (mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight) {
      document.querySelectorAll('.nl-link').forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${sec.id}`);
      });
    }
  });
}

/* ══ 5. SCROLL REVEAL ══════════════════════════════════════ */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealObs.observe(el));

/* ══ 6. BACK TO TOP ════════════════════════════════════════ */
const bttBtn = document.getElementById('btt');
if (bttBtn) {
  bttBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ══ 7. CONTACT FORM → SUPABASE ════════════════════════════ */
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const successEl = document.getElementById('cfSuccess');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('[name="name"]')?.value.trim();
    const phone   = form.querySelector('[name="phone"]')?.value.trim();
    const email   = form.querySelector('[name="email"]')?.value.trim();
    const service = form.querySelector('[name="service"]')?.value;
    const message = form.querySelector('[name="message"]')?.value.trim();

    if (!name || !phone) {
      showFormError('Veuillez remplir au moins votre nom et téléphone.');
      return;
    }

    // Loading state
    setLoading(true);

    try {
      // Send to Supabase
      const response = await fetch(`${SUPABASE_URL}/rest/v1/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type':  'application/json',
          'apikey':        SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Prefer':        'return=minimal'
        },
        body: JSON.stringify({
          name,
          phone,
          email:     email    || null,
          service:   service  || null,
          message:   message  || null,
          status:    'pending',
          appt_date: null,
          appt_time: null,
          created_at: new Date().toISOString()
        })
      });

      if (response.ok || response.status === 201) {
        // Success
        form.reset();
        setLoading(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 6000);
      } else {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || `Erreur ${response.status}`);
      }

    } catch (err) {
      console.error('Form error:', err);
      setLoading(false);

      // Fallback: if Supabase table doesn't exist yet, show helpful message
      if (err.message.includes('42P01') || err.message.includes('does not exist')) {
        showFormError('La table n\'existe pas encore dans Supabase. Consultez le README pour la créer.');
      } else {
        showFormError('Erreur d\'envoi. Veuillez me contacter directement par téléphone ou WhatsApp.');
      }
    }
  });
}

function setLoading(loading) {
  if (!submitBtn) return;
  submitBtn.disabled = loading;
  submitBtn.innerHTML = loading
    ? '<i class="bi bi-hourglass-split"></i><span>Envoi en cours…</span>'
    : '<i class="bi bi-send"></i><span>Envoyer la Demande</span>';
}

function setSuccess(show) {
  if (!successEl) return;
  successEl.style.display = show ? 'flex' : 'none';
}

function showFormError(msg) {
  const note = form.querySelector('.cf-note');
  if (!note) return;
  const old = form.querySelector('.cf-error-msg');
  if (old) old.remove();
  const el = document.createElement('p');
  el.className = 'cf-error-msg';
  el.style.cssText = 'color:#ff9999;font-size:.8rem;display:flex;align-items:center;gap:8px;margin-top:8px';
  el.innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${msg}`;
  note.after(el);
  setTimeout(() => el.remove(), 6000);
}

/* ══ 8. HERO PARTICLES ═════════════════════════════════════ */
(function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 18; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size    = Math.random() * 3 + 1.5;
    const left    = Math.random() * 100;
    const delay   = Math.random() * 10;
    const duration= Math.random() * 10 + 8;
    const opacity = Math.random() * 0.4 + 0.1;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: ${Math.random() * 30}%;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: ${delay}s;
    `;
    container.appendChild(p);
  }
})();

/* ══ 9. ACTIVE LINK STYLE IN NAV ═══════════════════════════ */
document.querySelector('style') || document.head.insertAdjacentHTML('beforeend', `
  <style>
    .nl-link.active { color: var(--gold) !important; }
    .nl-link.active::after { transform: scaleX(1) !important; }
  </style>
`);

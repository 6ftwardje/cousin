const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let menuOpen = false;

function closeMenu(restoreFocus = false) {
  menuOpen = false;
  mobileNav.hidden = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menu openen');
  document.body.classList.remove('menu-open');
  document.querySelector('main').inert = false;
  document.querySelector('footer').inert = false;
  if (restoreFocus) menuButton.focus();
}

menuButton.addEventListener('click', () => {
  if (menuOpen) { closeMenu(true); return; }
  menuOpen = true;
  mobileNav.hidden = false;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Menu sluiten');
  document.body.classList.add('menu-open');
  document.querySelector('main').inert = true;
  document.querySelector('footer').inert = true;
  mobileNav.querySelector('a').focus();
});

window.matchMedia('(min-width: 901px)').addEventListener('change', e => {
  if (e.matches && menuOpen) closeMenu();
});

document.addEventListener('keydown', e => {
  if (!menuOpen) return;
  if (e.key === 'Escape') { closeMenu(true); return; }
  if (e.key !== 'Tab') return;
  const targets = [...header.querySelectorAll('a, button')].filter(el => el.getClientRects().length);
  const first = targets[0];
  const last = targets.at(-1);
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
});

function openDialog(dialog) {
  if (menuOpen) closeMenu();
  dialog.showModal();
  document.body.classList.add('modal-open');
}

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => dialog.close()));
  dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom) dialog.close();
  });
});

document.querySelectorAll('[data-booking]').forEach(button => button.addEventListener('click', () => openDialog(document.querySelector('#booking-dialog'))));
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => openDialog(document.querySelector('#preview-dialog'))));

const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  lightbox.querySelector('img').src = button.dataset.image;
  lightbox.querySelector('img').alt = button.dataset.alt;
  lightbox.querySelector('p').textContent = button.dataset.caption;
  openDialog(lightbox);
}));

document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(option => {
    const selected = option === button;
    option.setAttribute('aria-pressed', String(selected));
    option.classList.toggle('active', selected);
  });
  let count = 0;
  document.querySelectorAll('[data-category]').forEach(item => {
    const visible = filter === 'all' || item.dataset.category === filter;
    item.hidden = !visible;
    if (visible) { count++; item.classList.add('in-view'); }
  });
  document.querySelector('.gallery-count').textContent = `${count} ${count === 1 ? 'beeld' : 'beelden'}`;
}));

if ('IntersectionObserver' in window && !reduceMotion.matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.documentElement.classList.add('js-reveal');
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

const hero = document.querySelector('.hero');
const heroImage = document.querySelector('.hero-image');
let ticking = false;
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
  if (heroImage && !reduceMotion.matches && window.innerWidth > 600 && window.scrollY < hero.offsetHeight) {
    heroImage.style.transform = `translateY(${Math.min(window.scrollY * 0.14, hero.offsetHeight * 0.08)}px)`;
  } else if (heroImage) heroImage.style.transform = '';
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
reduceMotion.addEventListener('change', updateScroll);
updateScroll();

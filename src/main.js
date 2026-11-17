const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const main = document.querySelector('main');
const footer = document.querySelector('footer');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ease = 'cubic-bezier(.16, 1, .3, 1)';
let menuOpen = false;
let menuAnimation;
let menuItems = [];

function animate(element, keyframes, options = {}) {
  if (reduceMotion.matches || !element.animate) return null;
  return element.animate(keyframes, { duration: 280, easing: ease, ...options });
}

function closeMenu(restoreFocus = false, immediate = false) {
  menuOpen = false;
  menuAnimation?.cancel();
  menuItems.forEach(animation => animation?.cancel());
  if (restoreFocus || mobileNav.contains(document.activeElement)) {
    const target = menuButton.getClientRects().length ? menuButton : header.querySelector('.brand');
    target.focus({ preventScroll: true });
  }
  mobileNav.inert = true;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Menu openen');
  document.body.classList.remove('menu-open');
  main.inert = false;
  footer.inert = false;
  const finish = () => { if (!menuOpen) mobileNav.hidden = true; };
  menuAnimation = immediate ? null : animate(mobileNav,
    [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }],
    { duration: 160, easing: 'ease-out' });
  if (menuAnimation) menuAnimation.finished.then(finish, finish);
  else finish();
}

menuButton.addEventListener('click', () => {
  if (menuOpen) { closeMenu(true); return; }
  menuAnimation?.cancel();
  menuOpen = true;
  mobileNav.hidden = false;
  mobileNav.inert = false;
  menuButton.setAttribute('aria-expanded', 'true');
  menuButton.setAttribute('aria-label', 'Menu sluiten');
  document.body.classList.add('menu-open');
  main.inert = true;
  footer.inert = true;
  menuAnimation = animate(mobileNav,
    [{ opacity: 0, transform: 'translateY(-12px)' }, { opacity: 1, transform: 'translateY(0)' }]);
  menuItems = [...mobileNav.querySelectorAll('a')].map((item, index) => animate(item,
    [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 320, delay: index * 22, fill: 'backwards' }));
  (mobileNav.querySelector('[aria-current]') || mobileNav.querySelector('a')).focus({ preventScroll: true });
});

window.matchMedia('(min-width: 901px)').addEventListener('change', event => {
  if (event.matches && menuOpen) closeMenu(false, true);
});

mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu(false, true)));

document.addEventListener('keydown', event => {
  if (!menuOpen) return;
  if (event.key === 'Escape') { closeMenu(true); return; }
  if (event.key !== 'Tab') return;
  const targets = [...header.querySelectorAll('a, button')].filter(element => element.getClientRects().length);
  const first = targets[0];
  const last = targets.at(-1);
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

const closingDialogs = new WeakMap();

function closeDialog(dialog) {
  if (closingDialogs.has(dialog)) return;
  const animation = animate(dialog,
    [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(8px)' }],
    { duration: 150, easing: 'ease-out' });
  if (!animation) { dialog.close(); return; }
  closingDialogs.set(dialog, animation);
  const finish = () => {
    if (closingDialogs.get(dialog) !== animation) return;
    closingDialogs.delete(dialog);
    dialog.close();
  };
  animation.finished.then(finish, finish);
}

function openDialog(dialog) {
  if (menuOpen) closeMenu(false, true);
  const previous = closingDialogs.get(dialog);
  closingDialogs.delete(dialog);
  previous?.cancel();
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('modal-open');
}

document.querySelectorAll('dialog').forEach(dialog => {
  dialog.querySelectorAll('[data-close]').forEach(button => button.addEventListener('click', () => closeDialog(dialog)));
  dialog.addEventListener('cancel', event => { event.preventDefault(); closeDialog(dialog); });
  dialog.addEventListener('close', () => {
    closingDialogs.delete(dialog);
    document.body.classList.toggle('modal-open', Boolean(document.querySelector('dialog[open]')));
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeDialog(dialog);
  });
});

document.querySelectorAll('[data-booking]').forEach(button => button.addEventListener('click', () => openDialog(document.querySelector('#booking-dialog'))));
document.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => openDialog(document.querySelector('#preview-dialog'))));

const lightbox = document.querySelector('#lightbox');
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  let image = lightbox.querySelector('img');
  if (!image) {
    image = new Image();
    lightbox.insertBefore(image, lightbox.querySelector('p'));
  }
  const thumbnail = button.querySelector('img');
  image.src = button.dataset.image;
  image.alt = button.dataset.alt;
  if (thumbnail.naturalWidth) {
    image.width = thumbnail.naturalWidth;
    image.height = thumbnail.naturalHeight;
  }
  lightbox.querySelector('p').textContent = button.dataset.caption;
  openDialog(lightbox);
}));

const galleryItems = [...document.querySelectorAll('[data-category]')];
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  if (button.getAttribute('aria-pressed') === 'true') return;
  galleryItems.forEach(item => item.getAnimations().forEach(animation => animation.cancel()));
  const previous = new Map();
  if (!reduceMotion.matches) galleryItems.forEach(item => {
    if (!item.hidden) previous.set(item, item.getBoundingClientRect());
  });
  const filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(option => {
    const selected = option === button;
    option.setAttribute('aria-pressed', String(selected));
    option.classList.toggle('active', selected);
  });
  let count = 0;
  galleryItems.forEach(item => {
    item.hidden = filter !== 'all' && item.dataset.category !== filter;
    if (!item.hidden) count++;
  });
  if (!reduceMotion.matches) {
    // Read the final layout as one batch before starting any animations.
    const positions = galleryItems.filter(item => !item.hidden).map(item => [item, item.getBoundingClientRect()]);
    positions.forEach(([item, current]) => {
      const old = previous.get(item);
      animate(item, old
        ? [{ transform: `translate(${old.left - current.left}px, ${old.top - current.top}px)` }, { transform: 'translate(0, 0)' }]
        : [{ opacity: 0 }, { opacity: 1 }], { duration: 320 });
    });
  }
  document.querySelector('.gallery-count').textContent = `${count} ${count === 1 ? 'foto' : 'foto’s'}`;
}));

// Content is visible by default, including when JavaScript or motion is unavailable.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animate(entry.target, [{ opacity: 0.45 }, { opacity: 1 }], { duration: 480 });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

document.querySelectorAll('.faq details').forEach(details => details.addEventListener('toggle', () => {
  if (details.open) animate(details.querySelector('p'), [{ opacity: 0 }, { opacity: 1 }], { duration: 220 });
}));

// Scroll work only updates the header state; photography stays on the compositor.
let ticking = false;
function updateScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); }
}, { passive: true });
reduceMotion.addEventListener('change', () => {
  if (reduceMotion.matches) document.getAnimations().forEach(animation => animation.cancel());
});
updateScroll();

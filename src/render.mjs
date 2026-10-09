const escape = (value = '') => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const arrow = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>';
const northeast = '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12" stroke="currentColor" stroke-width="1.5"/></svg>';
const star = '<svg class="asterisk" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 0v100M0 50h100M15 15l70 70M15 85l70-70" stroke="currentColor" stroke-width="11"/></svg>';
const lines = (parts) => parts.map(escape).join('<br>');
const image = (src, alt, className = '', eager = false) => `<img src="/images/${escape(src)}" alt="${escape(alt)}" class="${className}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
const link = (href, label, extra = '') => `<a class="text-link ${extra}" href="${escape(href)}">${escape(label)}${arrow}</a>`;
const safeExternal = value => { try { const u = new URL(value); return u.protocol === 'https:' ? u.href : null; } catch { return null; } };

const routes = [
  { id: 'home', href: '/', label: 'Home' },
  { id: 'cousin', href: '/cousin/', label: 'Cousin' },
  { id: 'services', href: '/services/', label: 'Services & prijzen' },
  { id: 'team', href: '/team/', label: 'Team' },
  { id: 'gallery', href: '/gallery/', label: 'Gallery' },
  { id: 'contact', href: '/contact/', label: 'Contact' }
];
export { routes };

function booking(data, label = 'Boek je afspraak', className = 'button') {
  const url = safeExternal(data.brand.bookingUrl);
  return url
    ? `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}${northeast}</a>`
    : `<button class="${className}" type="button" data-booking>${escape(label)}${northeast}</button>`;
}

function header(page, data) {
  return `<a href="#main" class="skip-link">Naar de inhoud</a><header class="site-header"><a class="brand" href="/" aria-label="Cousin, naar home">${image('cousin-logo.png', 'Cousin', '', true)}</a><nav class="desktop-nav" aria-label="Hoofdnavigatie">${routes.slice(1).map(r => `<a href="${r.href}" ${r.id === page ? 'aria-current="page"' : ''}>${r.label}</a>`).join('')}</nav><div class="header-actions">${booking(data, 'Boek je afspraak', 'button button-dark header-booking')}<button class="menu-toggle" aria-label="Menu openen" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button></div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobiele navigatie" hidden>${routes.map((r, i) => `<a href="${r.href}" ${r.id === page ? 'aria-current="page"' : ''}><span class="nav-number">0${i + 1}</span>${r.label}${arrow}</a>`).join('')}<span class="eyebrow">GOOD HAIR. BETTER MOOD.</span></nav></header>`;
}

function footer(data) {
  return `<footer class="site-footer"><div class="footer-top"><p>Good hair. Better mood.<br><span>Kapsalon in ${escape(data.brand.location)}.</span></p><div class="footer-nav">${routes.slice(1).map(r => `<a href="${r.href}">${r.label}</a>`).join('')}</div><div class="footer-contact"><a href="mailto:${escape(data.brand.email)}">${escape(data.brand.email)}</a><a href="tel:${escape(data.brand.phoneHref)}">${escape(data.brand.phone)}</a>${safeExternal(data.brand.instagramUrl) ? `<a href="${escape(data.brand.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram ${northeast}</a>` : ''}</div></div><a class="footer-wordmark" href="/" aria-label="Cousin, terug naar home">${image('cousin-logo.png', 'Cousin')}</a><div class="footer-bottom"><span>© ${new Date().getFullYear()} Cousin</span><button class="preview-trigger" data-preview>${escape(data.preview.label)} ${northeast}</button><span>Made with care by Office6</span></div></footer>`;
}

function dialogs(data) {
  return `<dialog class="dialog booking-dialog" id="booking-dialog" aria-labelledby="booking-title"><button class="dialog-close" aria-label="Sluiten" data-close>×</button><span class="eyebrow">SEE YOU IN THE CHAIR</span><h2 id="booking-title">Jouw volgende<br>good hair day.</h2><p>De online boekingslink volgt binnenkort. Bel of mail ons gerust om je afspraak te bespreken.</p><a class="button button-dark" href="tel:${escape(data.brand.phoneHref)}">Bel ${escape(data.brand.phone)}${arrow}</a><a class="text-link" href="mailto:${escape(data.brand.email)}?subject=Afspraak%20bij%20Cousin">Mail voor een afspraak${arrow}</a></dialog><dialog class="dialog preview-dialog" id="preview-dialog" aria-labelledby="preview-title"><button class="dialog-close" aria-label="Sluiten" data-close>×</button><span class="eyebrow">COUSIN × OFFICE6</span><h2 id="preview-title">Een eerste basis.</h2><p>${escape(data.preview.text)}</p><button class="button button-dark" data-close>Verder ontdekken${arrow}</button></dialog><dialog class="lightbox" id="lightbox" aria-label="Sfeerbeeld vergroot"><button class="dialog-close" aria-label="Afbeelding sluiten" data-close>×</button><img alt=""><p></p></dialog>`;
}

function finalCta(data) {
  return `<section class="final-cta" aria-labelledby="cta-title"><div class="cta-art" aria-hidden="true">${star}</div><div class="reveal"><span class="eyebrow">YOUR NEXT GOOD HAIR DAY</span><h2 id="cta-title">${lines(data.home.ctaTitle)}</h2><p>${escape(data.home.ctaText)}</p>${booking(data, 'Boek je afspraak', 'button button-dark')}</div><span class="cta-side">A FRESH CUT. A FRESH START.</span></section>`;
}

function pageHeading(content, number, extra = '') {
  return `<section class="page-heading ${extra}"><div class="page-heading-top"><span class="eyebrow">${escape(content.eyebrow)}</span><span class="page-number">/ 0${number}</span></div><h1>${lines(content.title)}</h1><p>${escape(content.intro)}</p>${star}</section>`;
}

function galleryItem(item, i, extra = '') {
  return `<figure class="gallery-item reveal ${extra}" data-category="${escape(item.category)}"><button class="gallery-open" data-image="/images/${escape(item.src)}" data-alt="${escape(item.alt)}" data-caption="${escape(item.caption)} · Sfeerbeeld" aria-label="Bekijk ${escape(item.caption)} vergroot">${image(item.src, item.alt)}<span class="gallery-expand">${northeast}</span></button><figcaption><span>${escape(item.caption)}</span><span>Sfeerbeeld / 0${i + 1}</span></figcaption></figure>`;
}

function home(data) {
  const h = data.home;
  return `<section class="hero" aria-labelledby="hero-title">${image('hero.webp', 'Sfeerbeeld: natuurlijk golvend haar', 'hero-image', true)}<div class="hero-shade"></div><h1 id="hero-title" class="hero-wordmark">${image('cousin-logo.png', 'Cousin — kapsalon in Aalter', '', true)}</h1><div class="hero-copy"><span class="eyebrow">${escape(h.eyebrow)}</span><h2>${lines(h.headline)}</h2><p>${escape(h.intro)}</p>${booking(data, 'Find your good hair day', 'button button-cream')}</div><a href="#hello" class="hero-scroll"><span>MEER COUSIN</span><span class="scroll-circle">↓</span></a><span class="hero-image-note">SFEERBEELD</span></section><div class="brand-strip"><span>CUT.</span>${star}<span>COLOUR.</span>${star}<span>STYLE.</span>${star}<span>BE YOURSELF.</span>${star}<span class="strip-location">AALTER, BE</span></div><section class="intro-section section-pad" id="hello"><div class="intro-label"><span class="eyebrow">${escape(h.storyEyebrow)}</span><span class="small-index">01 / THE FEELING</span></div><div class="intro-content reveal"><h2>${lines(h.storyTitle)}</h2><div class="intro-bottom"><p>${escape(h.storyText)}</p>${link('/cousin/', 'Leer Cousin kennen')}</div></div></section><section class="atmosphere-section"><figure class="atmosphere-image reveal">${image('studio.webp', 'Sfeerbeeld: ronde spiegels en een modern saloninterieur')}<figcaption>Sfeerbeeld · Het gevoel voor Cousin</figcaption></figure><div class="atmosphere-copy reveal">${star}<p>${escape(h.storyNote)}</p><span class="eyebrow">MAKE YOURSELF AT HOME.</span></div></section><section class="services-section section-pad"><div class="section-heading"><div><span class="eyebrow">02 / WHAT WE DO</span><h2>${lines(h.servicesTitle)}</h2></div><p>Een coupe, een kleur, een goed gevoel.<br>We vinden samen wat bij je past.</p></div><div class="service-list">${data.services.map(s => `<a class="service-row reveal" href="/services/#${s.id}"><span class="service-number">${s.number}</span><h3>${escape(s.name)}</h3><span class="service-label">${escape(s.label)}</span><span class="service-arrow">${northeast}</span></a>`).join('')}</div>${link('/services/', 'Ontdek services & prijzen')}</section><section class="home-gallery section-pad"><div class="section-heading"><div><span class="eyebrow">03 / THE MOODBOARD</span><h2>${lines(h.galleryTitle)}</h2></div>${link('/gallery/', 'Bekijk de gallery')}</div><div class="gallery-preview">${[data.gallery.images[0], data.gallery.images[1], data.gallery.images[3]].map((item, i) => galleryItem(item, i)).join('')}</div><p class="gallery-note">Een eerste sfeerrichting. Binnenkort met eigen werk van Cousin.</p></section><section class="home-team section-pad"><div class="team-symbol" aria-hidden="true"><span>c.</span>${star}</div><div class="reveal"><span class="eyebrow">04 / NICE TO MEET YOU</span><h2>${lines(h.teamTitle)}</h2><p>${escape(h.teamText)}</p>${link('/team/', 'Ontmoet Bjarne')}</div></section>${finalCta(data)}`;
}

function about(data) {
  const a = data.about;
  return `${pageHeading(a, 2)}<section class="about-feature section-pad"><figure class="feature-image reveal">${image('studio.webp', 'Sfeerbeeld van een modern kapsalon')}<figcaption>Tijdelijk sfeerbeeld · Eigen salonfotografie volgt</figcaption></figure><div class="feature-copy reveal"><span class="eyebrow">LOOK. FEEL. BOOK.</span><h2>${lines(a.heading)}</h2>${a.paragraphs.map(p => `<p>${escape(p)}</p>`).join('')}${link('/team/', 'Ontmoet het gezicht achter Cousin')}</div></section><section class="values-section section-pad">${a.values.map((v, i) => `<div class="value reveal"><span class="eyebrow">0${i + 1}</span><h2>${escape(v.title)}</h2><p>${escape(v.text)}</p></div>`).join('')}</section>${finalCta(data)}`;
}

function services(data) {
  return `${pageHeading(data.servicesPage, 3)}<div class="services-intro section-pad"><p class="content-note">${escape(data.servicesPage.priceNote)}</p><nav class="service-jump" aria-label="Ga naar behandeling">${data.services.map(s => `<a href="#${s.id}">${escape(s.name)} ↓</a>`).join('')}</nav></div><div class="services-details">${data.services.map(s => `<section class="service-detail section-pad" id="${s.id}"><div class="service-detail-copy reveal"><span class="eyebrow">${s.number} / ${escape(s.label)}</span><h2>${escape(s.name)}</h2><p>${escape(s.description)}</p><ul>${s.items.map(item => `<li>${escape(item)}${arrow}</li>`).join('')}</ul><div class="service-price">${s.priceFrom === null ? 'Prijzen volgen binnenkort' : `Vanaf € ${Number(s.priceFrom).toFixed(2).replace('.', ',')}`}</div>${booking(data, 'Bespreek jouw look', 'button button-dark')}</div><figure class="service-detail-image reveal">${image(s.image, `Sfeerbeeld bij ${s.label}`)}<figcaption>Sfeerbeeld</figcaption></figure></section>`).join('')}</div><section class="faq section-pad"><span class="eyebrow">HANDIG OM TE WETEN</span><h2>Even praktisch.</h2>${data.servicesPage.faq.map(item => `<details><summary>${escape(item.question)}<span aria-hidden="true">+</span></summary><p>${escape(item.answer)}</p></details>`).join('')}</section>${finalCta(data)}`;
}

function team(data) {
  return `${pageHeading(data.team, 4)}<section class="team-page section-pad">${data.team.members.map(member => `<article class="team-member"><div class="team-portrait-placeholder reveal" aria-label="Portret van ${escape(member.name)} volgt">${member.portrait ? image(member.portrait, member.name) : `<span class="portrait-letter">${escape(member.name[0]).toLowerCase()}.</span><span class="eyebrow">HET GEZICHT VOLGT. HET GEVOEL IS ER AL.</span>`}</div><div class="team-bio reveal"><span class="eyebrow">AANGENAAM.</span><h2>${escape(member.name)}<span class="sage-dot">.</span></h2><h3>${escape(member.role)}</h3><p>${escape(member.bio)}</p>${booking(data, 'Maak kennis in de stoel', 'button button-dark')}</div></article>`).join('')}</section><section class="team-quote section-pad"><span class="eyebrow">THE COUSIN FEELING</span><p>Goed haar is persoonlijk.<br>Dat houden we graag zo.</p>${star}</section>${finalCta(data)}`;
}

function gallery(data) {
  return `${pageHeading(data.gallery, 5)}<section class="gallery-section section-pad"><div class="gallery-toolbar"><div class="gallery-filters" aria-label="Filter sfeerbeelden">${data.gallery.filters.map((f, i) => `<button type="button" data-filter="${f.id}" aria-pressed="${i === 0}" class="${i === 0 ? 'active' : ''}">${escape(f.label)}</button>`).join('')}</div><span class="gallery-count" aria-live="polite">${data.gallery.images.length} beelden</span></div><div class="gallery-grid">${data.gallery.images.map((item, i) => galleryItem(item, i)).join('')}</div><p class="content-note">${escape(data.gallery.note)}</p></section>${finalCta(data)}`;
}

function contact(data) {
  const b = data.brand;
  return `${pageHeading(data.contact, 6)}<section class="contact-section section-pad"><div class="contact-main reveal"><span class="eyebrow">WE HOREN GRAAG VAN JE.</span><a class="contact-email" href="mailto:${escape(b.email)}">${escape(b.email)}${northeast}</a><a class="contact-phone" href="tel:${escape(b.phoneHref)}">${escape(b.phone)}${northeast}</a><div class="contact-booking"><h2>Een afspraak maken?</h2><p>Een nieuwe look begint met een eerste hallo.</p>${booking(data, 'Boek je afspraak', 'button button-dark')}</div></div><div class="contact-practical reveal"><div><span class="eyebrow">HET SALON</span><h2>${escape(b.location)}<span class="sage-dot">.</span></h2><p>${escape(b.publicAddress || data.contact.locationNote)}</p>${b.publicAddress ? link(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.publicAddress)}`, 'Bekijk de route') : ''}</div><div><span class="eyebrow">OPENINGSUREN</span>${Array.isArray(b.openingHours) ? `<dl>${b.openingHours.map(h => `<div><dt>${escape(h.day)}</dt><dd>${escape(h.hours)}</dd></div>`).join('')}</dl>` : `<p>${escape(data.contact.hoursNote)}</p>`}</div></div></section><section class="contact-signoff"><span>SEE YOU</span>${star}<span>IN THE CHAIR.</span></section>`;
}

const renderers = { home, cousin: about, services, team, gallery, contact };
export function renderPage(page, data) {
  const titles = { home: 'Cousin — Good hair. Better mood. | Kapsalon Aalter', cousin: 'Het verhaal van Cousin | Kapsalon Aalter', services: 'Services & prijzen | Cousin Aalter', team: 'Maak kennis met Bjarne | Cousin Aalter', gallery: 'Hair inspiration & salon vibes | Cousin Aalter', contact: 'Contact & afspraak | Cousin Aalter' };
  const descriptions = { home: 'Ontdek Cousin, een nieuwe generatie kapsalon in Aalter. Jouw haar, jouw karakter. Maak kennis en bespreek je volgende look.', cousin: data.about.intro, services: data.servicesPage.intro, team: data.team.intro, gallery: data.gallery.intro, contact: data.contact.intro };
  return `<!doctype html><html lang="nl-BE"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#f5f3ed"><title>${escape(titles[page])}</title><meta name="description" content="${escape(descriptions[page])}"><meta property="og:title" content="${escape(titles[page])}"><meta property="og:description" content="${escape(descriptions[page])}"><meta property="og:type" content="website"><meta property="og:locale" content="nl_BE"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/manrope-regular.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/styles.css"><script src="/main.js" defer></script></head><body class="page-${page}">${header(page, data)}<main id="main">${renderers[page](data)}</main>${footer(data)}${dialogs(data)}</body></html>`;
}

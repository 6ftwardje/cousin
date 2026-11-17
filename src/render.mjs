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

function booking(data, label = 'Maak een afspraak', className = 'button') {
  const url = safeExternal(data.brand.bookingUrl);
  return url
    ? `<a class="${className}" href="${escape(url)}" target="_blank" rel="noopener noreferrer">${escape(label)}${northeast}</a>`
    : `<button class="${className}" type="button" data-booking>${escape(label)}${northeast}</button>`;
}

function header(page, data) {
  return `<a href="#main" class="skip-link">Naar de inhoud</a><header class="site-header"><a class="brand" href="/" aria-label="Cousin, naar home">${image('cousin-logo.png', 'Cousin', '', true)}</a><nav class="desktop-nav" aria-label="Hoofdnavigatie">${routes.slice(1).map(r => `<a href="${r.href}" ${r.id === page ? 'aria-current="page"' : ''}>${r.label}</a>`).join('')}</nav><div class="header-actions">${booking(data, 'Maak een afspraak', 'button button-dark header-booking')}<button class="menu-toggle" aria-label="Menu openen" aria-expanded="false" aria-controls="mobile-nav"><span></span><span></span></button></div><nav id="mobile-nav" class="mobile-nav" aria-label="Mobiele navigatie" hidden>${routes.map(r => `<a href="${r.href}" ${r.id === page ? 'aria-current="page"' : ''}>${r.label}${arrow}</a>`).join('')}<span class="eyebrow">GOOD HAIR. BETTER MOOD.</span></nav></header>`;
}

function footer(data) {
  return `<footer class="site-footer"><div class="footer-top"><p>Good hair. Better mood.<br><span>Kapsalon in ${escape(data.brand.location)}.</span></p><div class="footer-nav">${routes.slice(1).map(r => `<a href="${r.href}">${r.label}</a>`).join('')}</div><div class="footer-contact"><a href="mailto:${escape(data.brand.email)}">${escape(data.brand.email)}</a><a href="tel:${escape(data.brand.phoneHref)}">${escape(data.brand.phone)}</a>${safeExternal(data.brand.instagramUrl) ? `<a href="${escape(data.brand.instagramUrl)}" target="_blank" rel="noopener noreferrer">Instagram ${northeast}</a>` : ''}</div></div><a class="footer-wordmark" href="/" aria-label="Cousin, terug naar home">${image('cousin-logo.png', 'Cousin')}</a><div class="footer-bottom"><span>© ${new Date().getFullYear()} Cousin</span><button class="preview-trigger" data-preview>${escape(data.preview.label)} ${northeast}</button><span>Website door Office6</span></div></footer>`;
}

function dialogs(data) {
  return `<dialog class="dialog booking-dialog" id="booking-dialog" aria-labelledby="booking-title"><button class="dialog-close" aria-label="Sluiten" data-close>×</button><span class="eyebrow">COUSIN · AALTER</span><h2 id="booking-title">Een afspraak<br>maken?</h2><p>Bel of mail ons om een moment af te spreken. Online boeken kan hier nog niet.</p><a class="button button-dark" href="tel:${escape(data.brand.phoneHref)}">Bel ${escape(data.brand.phone)}${arrow}</a><a class="text-link" href="mailto:${escape(data.brand.email)}?subject=Afspraak%20bij%20Cousin">Mail ons${arrow}</a></dialog><dialog class="dialog preview-dialog" id="preview-dialog" aria-labelledby="preview-title"><button class="dialog-close" aria-label="Sluiten" data-close>×</button><span class="eyebrow">COUSIN × OFFICE6</span><h2 id="preview-title">Ontwerp van de website.</h2><p>${escape(data.preview.text)}</p><button class="button button-dark" data-close>Terug naar de website${arrow}</button></dialog><dialog class="lightbox" id="lightbox" aria-label="Foto vergroot"><button class="dialog-close" aria-label="Foto sluiten" data-close>×</button><p></p></dialog>`;
}

function finalCta(data) {
  return `<section class="final-cta" aria-labelledby="cta-title"><div class="cta-art" aria-hidden="true">${star}</div><div class="reveal"><span class="eyebrow">AFSPRAKEN</span><h2 id="cta-title">${lines(data.home.ctaTitle)}</h2><p>${escape(data.home.ctaText)}</p>${booking(data, 'Maak een afspraak', 'button button-dark')}</div><span class="cta-side">COUSIN · AALTER</span></section>`;
}

function pageHeading(content, extra = '') {
  return `<section class="page-heading ${extra}"><div class="page-heading-top"><span class="eyebrow">${escape(content.eyebrow)}</span></div><h1>${lines(content.title)}</h1><p>${escape(content.intro)}</p>${star}</section>`;
}

function galleryItem(item, extra = '') {
  return `<figure class="gallery-item reveal ${extra}" data-category="${escape(item.category)}"><button class="gallery-open" data-image="/images/${escape(item.src)}" data-alt="${escape(item.alt)}" data-caption="${escape(item.caption)}" aria-label="Bekijk ${escape(item.caption)} vergroot">${image(item.src, item.alt)}<span class="gallery-expand">${northeast}</span></button><figcaption><span>${escape(item.caption)}</span></figcaption></figure>`;
}

function pressFeature(press) {
  const url = safeExternal(press.url);
  return `<section class="press-feature" aria-labelledby="press-title">
    <div class="press-copy">
      <div class="press-source"><img class="press-publication" src="/images/${escape(press.logo)}" alt="${escape(press.publication)}" width="146" height="146" loading="lazy" decoding="async"><span>Cousin in de pers<time datetime="${escape(press.dateTime)}">${escape(press.date)}</time></span></div>
      <h2 id="press-title">${lines(press.title)}</h2>
      <blockquote>“${escape(press.quote)}”</blockquote>
      <p>${escape(press.text)}</p>
      <a class="text-link" href="${escape(url)}" target="_blank" rel="noopener noreferrer">Lees het artikel in HLN<span class="sr-only"> (opent in een nieuw tabblad)</span>${northeast}</a>
    </div>
    <figure class="press-image"><img src="/images/${escape(press.image)}" srcset="/images/${escape(press.imageSmall)} 900w, /images/${escape(press.image)} 1800w" sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 900px) 91vw, 50vw" width="1800" height="1112" alt="${escape(press.imageAlt)}" loading="lazy" decoding="async"><figcaption>Fotografie © ${escape(press.credit)}</figcaption></figure>
  </section>`;
}

function home(data) {
  const h = data.home;
  return `<section class="hero" aria-labelledby="hero-title">${image('hero.webp', 'Natuurlijk golvend haar', 'hero-image', true)}<div class="hero-shade"></div><h1 id="hero-title" class="hero-wordmark">${image('cousin-logo.png', 'Cousin — kapsalon in Aalter', '', true)}</h1><div class="hero-copy"><span class="eyebrow">${escape(h.eyebrow)}</span><h2>${lines(h.headline)}</h2><p>${escape(h.intro)}</p>${booking(data, 'Maak een afspraak', 'button button-cream')}</div><a href="#hello" class="hero-scroll" aria-label="Ontdek Cousin"><span>MEER COUSIN</span><span class="scroll-circle">↓</span></a></section><div class="brand-strip"><span>CUT.</span>${star}<span>COLOUR.</span>${star}<span>STYLE.</span>${star}<span>COUSIN.</span>${star}<span class="strip-location">AALTER, BE</span></div><section class="intro-section section-pad" id="hello"><div class="intro-label"><span class="eyebrow">${escape(h.storyEyebrow)}</span></div><div class="intro-content reveal"><h2>${lines(h.storyTitle)}</h2><div class="intro-bottom"><p>${escape(h.storyText)}</p>${link('/cousin/', 'Over Cousin')}</div></div></section><section class="atmosphere-section"><figure class="atmosphere-image reveal">${image('studio.webp', 'Ronde spiegels en een modern saloninterieur')}</figure><div class="atmosphere-copy reveal">${star}<p>${escape(h.storyNote)}</p><span class="eyebrow">COUSIN · AALTER</span></div></section><section class="services-section section-pad"><div class="section-heading"><div><span class="eyebrow">BEHANDELINGEN</span><h2>${lines(h.servicesTitle)}</h2></div><p>Je kan ons ook eerst om advies vragen.</p></div><div class="service-list">${data.services.map(s => `<a class="service-row reveal" href="/services/#${s.id}"><h3>${escape(s.name)}</h3><span class="service-label">${escape(s.label)}</span><span class="service-arrow">${northeast}</span></a>`).join('')}</div>${link('/services/', 'Bekijk de behandelingen')}</section>${pressFeature(h.press)}<section class="home-gallery section-pad"><div class="section-heading"><div><span class="eyebrow">GALLERY</span><h2>${lines(h.galleryTitle)}</h2></div>${link('/gallery/', 'Bekijk de gallery')}</div><div class="gallery-preview">${[data.gallery.images[0], data.gallery.images[1], data.gallery.images[3]].map(item => galleryItem(item)).join('')}</div></section>${finalCta(data)}`;
}

function about(data) {
  const a = data.about;
  return `${pageHeading(a)}<section class="about-feature section-pad"><figure class="feature-image reveal">${image('studio.webp', 'Modern kapsalon')}</figure><div class="feature-copy reveal"><span class="eyebrow">IN HET SALON</span><h2>${lines(a.heading)}</h2>${a.paragraphs.map(p => `<p>${escape(p)}</p>`).join('')}${link('/team/', 'Meer over Bjarne')}</div></section><section class="values-section section-pad">${a.values.map(v => `<div class="value reveal"><h2>${escape(v.title)}</h2><p>${escape(v.text)}</p></div>`).join('')}</section>${finalCta(data)}`;
}

function services(data) {
  return `${pageHeading(data.servicesPage)}<div class="services-intro section-pad"><p class="content-note">${escape(data.servicesPage.priceNote)}</p><nav class="service-jump" aria-label="Ga naar behandeling">${data.services.map(s => `<a href="#${s.id}">${escape(s.name)} ↓</a>`).join('')}</nav></div><div class="services-details">${data.services.map(s => `<section class="service-detail section-pad" id="${s.id}"><div class="service-detail-copy reveal"><span class="eyebrow">${escape(s.label)}</span><h2>${escape(s.name)}</h2><p>${escape(s.description)}</p><ul>${s.items.map(item => `<li>${escape(item)}${arrow}</li>`).join('')}</ul><div class="service-price">${s.priceFrom === null ? 'Vraag ons naar de prijs.' : `Vanaf € ${Number(s.priceFrom).toFixed(2).replace('.', ',')}`}</div>${booking(data, 'Maak een afspraak', 'button button-dark')}</div><figure class="service-detail-image reveal">${image(s.image, s.label)}</figure></section>`).join('')}</div><section class="faq section-pad"><span class="eyebrow">HANDIG OM TE WETEN</span><h2>Even praktisch.</h2>${data.servicesPage.faq.map(item => `<details><summary>${escape(item.question)}<span aria-hidden="true">+</span></summary><p>${escape(item.answer)}</p></details>`).join('')}</section>${finalCta(data)}`;
}

function team(data) {
  return `${pageHeading(data.team)}<section class="team-page section-pad">${data.team.members.map(member => `<article class="team-member"><div class="team-portrait reveal" ${member.portrait ? '' : `aria-label="Portret van ${escape(member.name)} volgt"`}>${member.portrait ? image(member.portrait, `Portret van ${member.name}`) : `<span class="portrait-letter">${escape(member.name[0]).toLowerCase()}.</span><span class="eyebrow">PORTRET VOLGT</span>`}</div><div class="team-bio reveal"><span class="eyebrow">${escape(member.name).toUpperCase()} VAN COUSIN</span><h2>${escape(member.name)}<span class="sage-dot">.</span></h2><h3>${escape(member.role)}</h3><p>${escape(member.bio)}</p>${booking(data, 'Maak een afspraak', 'button button-dark')}</div></article>`).join('')}</section><section class="team-quote section-pad"><span class="eyebrow">COUSIN · AALTER</span><p>Tot binnenkort<br>in het salon.</p>${star}</section>${finalCta(data)}`;
}

function gallery(data) {
  return `${pageHeading(data.gallery)}<section class="gallery-section section-pad"><div class="gallery-toolbar"><div class="gallery-filters" aria-label="Filter foto’s">${data.gallery.filters.map((f, i) => `<button type="button" data-filter="${f.id}" aria-pressed="${i === 0}" class="${i === 0 ? 'active' : ''}">${escape(f.label)}</button>`).join('')}</div><span class="gallery-count" aria-live="polite">${data.gallery.images.length} foto’s</span></div><div class="gallery-grid">${data.gallery.images.map(item => galleryItem(item)).join('')}</div></section>${finalCta(data)}`;
}

function contact(data) {
  const b = data.brand;
  return `${pageHeading(data.contact)}<section class="contact-section section-pad"><div class="contact-main reveal"><span class="eyebrow">TELEFOON & E-MAIL</span><a class="contact-email" href="mailto:${escape(b.email)}">${escape(b.email)}${northeast}</a><a class="contact-phone" href="tel:${escape(b.phoneHref)}">${escape(b.phone)}${northeast}</a><div class="contact-booking"><h2>Een afspraak maken?</h2><p>Bel of mail ons. Dan spreken we een moment af.</p>${booking(data, 'Maak een afspraak', 'button button-dark')}</div></div><div class="contact-practical reveal"><div><span class="eyebrow">HET SALON</span><h2>${escape(b.location)}<span class="sage-dot">.</span></h2><p>${escape(b.publicAddress || data.contact.locationNote)}</p>${b.publicAddress ? link(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.publicAddress)}`, 'Bekijk de route') : ''}</div><div><span class="eyebrow">OPENINGSUREN</span>${Array.isArray(b.openingHours) ? `<dl>${b.openingHours.map(h => `<div><dt>${escape(h.day)}</dt><dd>${escape(h.hours)}</dd></div>`).join('')}</dl>` : `<p>${escape(data.contact.hoursNote)}</p>`}</div></div></section><section class="contact-signoff"><span>TOT SNEL</span>${star}<span>BIJ COUSIN.</span></section>`;
}

const renderers = { home, cousin: about, services, team, gallery, contact };
export function renderPage(page, data) {
  const titles = { home: 'Cousin — Good hair. Better mood. | Kapsalon Aalter', cousin: 'Het verhaal van Cousin | Kapsalon Aalter', services: 'Services & prijzen | Cousin Aalter', team: 'Bjarne van Cousin | Kapsalon Aalter', gallery: 'Foto’s en inspiratie | Cousin Aalter', contact: 'Contact en afspraken | Cousin Aalter' };
  const descriptions = { home: 'Knippen, kleuren en stylen bij Bjarne en Gilles in Aalter. Maak een afspraak bij Cousin of bekijk de behandelingen.', cousin: data.about.intro, services: data.servicesPage.intro, team: data.team.intro, gallery: data.gallery.intro, contact: data.contact.intro };
  return `<!doctype html><html lang="nl-BE"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><meta name="theme-color" content="#f5f3ed"><title>${escape(titles[page])}</title><meta name="description" content="${escape(descriptions[page])}"><meta property="og:title" content="${escape(titles[page])}"><meta property="og:description" content="${escape(descriptions[page])}"><meta property="og:type" content="website"><meta property="og:locale" content="nl_BE"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preload" href="/fonts/manrope-regular.ttf" as="font" type="font/ttf" crossorigin><link rel="stylesheet" href="/styles.css"><script src="/main.js" defer></script></head><body class="page-${page}">${header(page, data)}<main id="main" tabindex="-1">${renderers[page](data)}</main>${footer(data)}${dialogs(data)}</body></html>`;
}

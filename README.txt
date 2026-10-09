COUSIN — EERSTE WEBSITEBASIS
9 oktober 2026 · Office6

STARTEN
Vanuit deze map: npm run dev
Preview: http://localhost:4173
Productiebestanden bouwen: npm run build
Structuur, links en assets controleren: npm run check
Node.js 22 of nieuwer. Geen npm-installatie of externe runtime-dependencies nodig.

WAT ER STAAT
Zes echte HTML-pagina's, volgens het websitevoorstel van 28 augustus 2026:
Home (/), Cousin (/cousin/), Services & prijzen (/services/), Team (/team/),
Gallery (/gallery/), Contact (/contact/).

De home is de eerste uitgewerkte visuele richting. De vijf vervolgpagina's
hebben een samenhangende basis. De gallery heeft filters en een vergroting.
Services heeft ankerlinks en FAQ-accordions. Het mobiele menu werkt met
toetsenbordbediening en Escape. Dialogen hebben native focusbeheer.
Scroll- en binnenkomstanimaties respecteren prefers-reduced-motion.

CMS-KEUZE BLIJFT OPEN
De huidige site genereert statische HTML uit content/site.json.
Pagina-inhoud, services, teamleden, beelden en praktische gegevens staan daar.
src/render.mjs bevat de pagina-templates; src/styles.css de vormgeving;
src/main.js de browserinteracties. scripts/build.mjs bevat loadContent():
de grens waar later een CMS-adapter dezelfde gegevensstructuur kan leveren.
Een CMS is niet gekozen, geïnstalleerd of vereist. Hosting blijft eveneens open.
Een CMS-koppeling vereist later nog implementatie; deze structuur bereidt ze voor.

ONTWERPRICHTING
Visuele these: warm en editorial, met het saliegroen van het Cousin-logo,
gebroken wit, donkere fotografie en grote rustige typografie.
Inhoud: openingsbeeld / merk -> verhaal -> sfeer -> services -> gallery ->
persoonlijke kennismaking -> afspraak.
Interactie: gelaagde hero-binnenkomst, subtiele beeldbeweging bij scrollen,
beeldvergroting en hover-reacties. Geen carrousel of automatische video.
Manrope wordt lokaal geladen. Het aangeleverde logo staat in public/images/cousin-logo.png.

BRONNEN EN ONDERZOEK
Oorspronkelijke offerte (bewaard in het aparte klantdossier):
Cousin × Office6 _ Websitevoorstel 2026.pdf
Gebruikte onderdelen: pagina's 2–5 (Look / Feel / Book, doelen, zes kernpagina's,
Salonkee-flow, responsive design, beheerbare content en lokale SEO).
De gebruikersinstructie om de CMS-keuze uit te stellen gaat voor op het voorstel.

SALT — https://www.saltsalonlondon.com/
Bekeken op 9 oktober 2026, inclusief browserweergave.
Observatie: vrijwel beeldvullende fotografie/video onder een compacte navigatie.
Vertaling naar Cousin: één groot openingsbeeld, prominent merk, weinig ruis.

RE:CREATE — https://www.recreatehair.com/
Bekeken op 9 oktober 2026, inclusief browserweergave.
Observatie: groot salonbeeld, organische merkpresentatie, ontspannen persoonlijke
positionering en een direct vindbare boekingslink.
Vertaling: warm groen, ruimte in de compositie, korte menselijke teksten.

Butchers — https://www.butcherssalon.com/
Bekeken op 9 oktober 2026, inclusief browserweergave.
Observatie: services en prijzen zijn aparte routes, met boeking in de navigatie
en herhaalde CTA's. Hun duurzaamheids- en productclaims zijn eigen aan die zaak.
Vertaling: duidelijke services, één consistente afspraakactie, mensen achter het merk.

Designpatronen zijn voor Cousin opnieuw uitgewerkt. Er is geen broncode,
fotografie, logo of tekst van deze salons overgenomen. Onderzoeksscreenshots
staan in het aparte klantdossier en zijn niet opgenomen in deze repository.

BEELDEN EN TYPOGRAFIE
Fotografie: tijdelijke Unsplash-sfeerbeelden. Geen beelden van Cousin zelf.
Herkomst: ASSETS.txt. Vervang ze vóór definitieve oplevering door aangeleverde
salon-, team- en werkfotografie. WebP-versies zijn lokaal geoptimaliseerd.
Typografie: Manrope (Google Fonts), SIL Open Font License, zie public/fonts/OFL.txt.

NOG TE BEVESTIGEN
- Definitieve teksten, behandelingen en tarieven: huidige inhoud is een voorstel.
- Bjarne: definitieve bio en eigen portret; nu een typografische plaatsaanduiding.
- Salonkee-boekingslink: brand.bookingUrl staat op null. CTA's openen daarom
  een contactvenster, zonder een boeking of beschikbaarheid te simuleren.
  Zet bookingUrl op de bevestigde HTTPS-link en bouw opnieuw: alle CTA's linken
  dan rechtstreeks naar die boekingsomgeving.
- Instagram: brand.instagramUrl is null; er wordt geen social profiel verzonnen.
- Publiek salonadres: brand.publicAddress is null. Het bekende factuuradres
  wordt niet als salonadres gepubliceerd. Maps-route verschijnt na invulling.
- Openingsuren: brand.openingHours is null. Later [{"day":"...","hours":"..."}].
- Eigen fotografie, juridische teksten, analytics/consent en launchconfiguratie.

NIET LIVE
De basis wordt alleen lokaal getoond. De HTML en robots.txt staan bewust op
noindex / Disallow. Er is geen deployment, tracking, formulierbackend of CMS.
SEO-titels, descriptions en OG-basismetadata zijn aanwezig. Canonical, sitemap,
OG-image en volledige HairSalon structured data volgen met het definitieve
domein en bevestigde publieke gegevens. Contact verloopt via tel: en mailto:.

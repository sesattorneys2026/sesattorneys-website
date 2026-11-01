// Builds the static website into /docs (the folder GitHub Pages publishes).
// Run: node build.js
// Sources: src/pages/*.html (page content), src/static/ (css, js, fonts, images), src/static/js/data.js (all content).
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'docs');

global.window = {};
require(path.join(SRC, 'static', 'js', 'data.js'));
const S = global.window.SITE;
if (process.env.SES_NO_POPUP) S.disclaimerPopup = false; // only for screenshot previews; never set when publishing
const SITE_URL = 'https://' + S.domain;
const YEAR = new Date().getFullYear();

/* ---------- helpers ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const tel = (p) => 'tel:' + (String(p).replace(/[^\d+]/g, '') || p);
const mail = (e) => 'mailto:' + e;
const img = (f) => '/images/' + f;
const thumb = (f) => '/images/thumbs/' + f;
const areaUrl = (a) => '/practice-areas/' + a.slug + '/';
const waBase = 'https://wa.me/' + String(S.whatsappNumber).replace(/\D/g, '');
const pad2 = (n) => String(n).padStart(2, '0');

const WA_PATH = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z';
const waIcon = (size) => `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="${WA_PATH}"/></svg>`;
const PIN_ICON = '<svg class="floc__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M12 22s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12Z"/><circle cx="12" cy="10" r="2.6"/></svg>';

const NAV = [
  { label: 'Home', key: 'home', href: '/' },
  { label: 'About Us', key: 'about', href: '/about/' },
  { label: 'Practice Areas', key: 'services', href: '/practice-areas/', dropdown: true },
  { label: 'Careers', key: 'careers', href: '/careers/' },
  { label: 'Contact', key: 'contact', href: '/contact/' }
];

/* ---------- shared blocks ---------- */
function head(p) {
  const url = SITE_URL + p.url;
  const ld = p.jsonld ? `\n<script type="application/ld+json">${JSON.stringify(p.jsonld)}</script>` : '';
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(p.title)}</title>
<meta name="description" content="${esc(p.description)}">
${p.noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${url}">`}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(S.firm)}">
<meta property="og:title" content="${esc(p.title)}">
<meta property="og:description" content="${esc(p.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${SITE_URL}/images/${p.ogImage || 'About_B.jpg'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#14213a">
<link rel="icon" href="/favicon.png" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="stylesheet" href="/css/fonts.css">
<link rel="stylesheet" href="/css/styles.css">${ld}
</head>`;
}

function header(key) {
  const c = S.contact;
  const navHtml = NAV.map((n) => {
    const on = n.key === key;
    const drop = n.dropdown ? `<div class="dropdown">${S.areas.map((a) => `<a href="${areaUrl(a)}">${esc(a.title)}</a>`).join('')}</div>` : '';
    return `<div class="nav__item"><a class="nav__link${on ? ' is-active' : ''}" href="${n.href}"${on ? ' aria-current="page"' : ''}>${esc(n.label)}${n.dropdown ? '<span class="nav__caret" aria-hidden="true">▾</span>' : ''}</a>${drop}</div>`;
  }).join('');
  const mobile = NAV.map((n) => {
    const cls = `mobile-menu__link${n.key === key ? ' is-active' : ''}`;
    if (!n.dropdown) return `<a class="${cls}" href="${n.href}">${esc(n.label)}<span aria-hidden="true">→</span></a>`;
    return `<div class="mobile-menu__row"><a class="${cls}" href="${n.href}">${esc(n.label)}</a><button class="mobile-menu__expand" type="button" aria-expanded="false" aria-controls="mobile-areas" aria-label="Show practice areas"><span aria-hidden="true">▾</span></button></div>
    <div class="mobile-menu__sub" id="mobile-areas" hidden>${S.areas.map((a) => `<a href="${areaUrl(a)}">${esc(a.title)}</a>`).join('')}</div>`;
  }).join('');
  return `
<a class="skip-link" href="#main">Skip to content</a>
<div class="topbar"><div class="container topbar__inner">
  <span>${esc(S.addressShort)}</span>
  <span class="topbar__contacts"><span class="name">${esc(c.name)}</span><a href="${tel(c.phone)}">${esc(c.phone)}</a><a class="gold" href="${mail(c.email)}">${esc(c.email)}</a></span>
</div></div>
<header class="site-header">
  <div class="container site-header__inner">
    <a class="brand" href="/" aria-label="${esc(S.firm)} home">
      <img class="brand__logo" src="/images/logo.png" width="720" height="184" alt="${esc(S.firm)}, ${esc(S.firmSub)}">
    </a>
    <nav class="nav" aria-label="Main">${navHtml}<a class="btn btn--gold" href="/contact/">Contact Us</a></nav>
    <button class="menu-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="mobile-menu"><span></span><span></span><span></span></button>
  </div>
  <div class="mobile-menu" id="mobile-menu">${mobile}
    <div class="mobile-menu__contact"><span class="name">${esc(c.name)}</span><a href="${tel(c.phone)}">${esc(c.phone)}</a><a class="gold" href="${mail(c.email)}">${esc(c.email)}</a></div>
    <a class="btn btn--gold" href="/contact/">Contact Us</a>
  </div>
</header>`;
}

function banner(b) {
  return `
<section class="photo-section page-banner">
  <img src="${img(b.img)}" alt="" fetchpriority="high">
  <div class="photo-section__overlay"></div>
  <div class="container photo-section__content">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${b.crumbs.map((c) => '<span aria-hidden="true">/</span>' + (c.href ? `<a href="${c.href}">${esc(c.label)}</a>` : `<span aria-current="page">${esc(c.label)}</span>`)).join('')}</nav>
    <h1>${esc(b.title)}</h1>
    <div class="page-banner__rule"></div>
  </div>
</section>`;
}

function cta() {
  const c = S.contact;
  return `
<section class="photo-section cta">
  <img src="${img('Contact_B.jpg')}" alt="" loading="lazy">
  <div class="photo-section__overlay"></div>
  <div class="container photo-section__content cta__inner">
    <div><h2>Contact the firm.</h2><p>${esc(c.name)}: ${esc(c.phone)} · ${esc(c.email)}</p></div>
    <a class="btn btn--navy" href="/contact/">Contact details</a>
  </div>
</section>`;
}

function footer() {
  const c = S.contact;
  const links = NAV.map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join('');
  const keyAreas = S.areas.slice(0, 5).map((a) => `<a href="${areaUrl(a)}">${esc(a.title)}</a>`).join('');
  const locs = S.locations.map((l) => `<div class="floc">${PIN_ICON}<div><div class="floc__head"><span class="floc__label">${esc(l.footerLabel)}</span><a href="${esc(l.directions)}" target="_blank" rel="noopener">View map →</a></div><p>${esc(l.footerAddress || l.address).replace(/ (\d{6})/, '&nbsp;$1')}</p></div></div>`).join('');
  return `
<footer class="site-footer"><div class="container site-footer__inner">
  <div class="site-footer__grid">
    <div><div class="site-footer__brand">${esc(S.firm)}</div><p>${esc(S.tagline)}</p></div>
    <div class="site-footer__col"><div class="site-footer__heading">Quick links</div>${links}</div>
    <div class="site-footer__col"><div class="site-footer__heading">Key practices</div>${keyAreas}</div>
    <div class="site-footer__col site-footer__contact"><div class="site-footer__heading">Get in touch</div><span class="name">${esc(c.name)}</span><a href="${tel(c.phone)}">${esc(c.phone)}</a><a class="gold" href="${mail(c.email)}">${esc(c.email)}</a><a href="${waBase}" target="_blank" rel="noopener">WhatsApp us →</a></div>
  </div>
  <div class="site-footer__locations">${locs}</div>
  <div class="site-footer__bottom"><span>© <span data-year>${YEAR}</span> ${esc(S.firm)}. All rights reserved.</span><nav aria-label="Legal"><a href="/disclaimer/">Disclaimer</a><a href="/privacy/">Privacy Policy</a><a href="/careers/">Careers</a></nav></div>
</div></footer>`;
}

function disclaimerModal() {
  if (!S.disclaimerPopup) return '';
  return `
<div class="disclaimer-modal" id="disclaimer-modal" role="dialog" aria-modal="true" aria-labelledby="dm-title" hidden>
  <div class="disclaimer-modal__box">
    <img class="disclaimer-modal__brand" src="/images/logo.png" width="720" height="184" alt="${esc(S.firm)}">
    <h2 id="dm-title">Disclaimer</h2>
    <p>${esc(S.disclaimerIntro)}</p>
    <ul>${S.disclaimerPoints.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>
    <button class="btn btn--gold" type="button" id="dm-agree">I agree, continue to website</button>
  </div>
</div>`;
}

/* ---------- repeated content blocks ---------- */
const blocks = {
  areaCards: () => S.areas.map((a, i) => `<a class="card" href="${areaUrl(a)}"><div class="card__media"><img src="${thumb(a.img)}" alt="" loading="lazy" width="800" height="533"><span class="card__num">${pad2(i + 1)}</span></div><div class="card__body"><span class="card__no" aria-hidden="true">${pad2(i + 1)}</span><span class="card__title">${esc(a.title)}</span><span class="card__text">${esc(a.short)}</span><span class="card__more">Read more →</span></div></a>`).join(''),
  principles: () => S.principles.map((p) => `<div class="strip__item"><span class="strip__num">${p.n}</span><div><div class="strip__title">${esc(p.t)}</div><p>${esc(p.d)}</p></div></div>`).join(''),
  sectors: () => S.sectors.map((s) => `<div class="sectors__item"><span class="diamond"></span>${esc(s)}</div>`).join(''),
  matters: () => S.matters.map((m) => `<div class="matters__item"><span class="diamond diamond--gold"></span>${esc(m)}</div>`).join(''),
  roles: () => S.roles.map((r) => `<div class="role"><div class="role__title">${esc(r.t)}</div><p>${esc(r.d)}</p></div>`).join(''),
  roleOptions: () => S.roles.map((r) => `<option value="${esc(r.t)}">${esc(r.t)}</option>`).join(''),
  advocates: () => S.advocates.map((d) => `<div class="advocate"><div class="advocate__body"><div class="advocate__name">${esc(d.name)}</div><div class="advocate__role">Advocate</div>${advLinks(d, 'advocate__links')}</div></div>`).join(''),
  advocateCards: () => S.advocates.map((d) => `<div class="info-card info-card--navy"><div class="info-card__label">Advocate</div><div class="info-card__name">${esc(d.name)}</div>${advLinks(d, 'info-card__links')}</div>`).join(''),
  locations: () => S.locations.map((l, i) => `<div class="location"><div class="location__info${i % 2 ? ' location__info--navy' : ''}"><div class="location__label">${esc(l.label)}</div><address>${esc(l.address)}</address><a class="location__link" href="${esc(l.directions)}" target="_blank" rel="noopener">Get directions →</a></div><div class="location__map"><iframe src="https://maps.google.com/maps?q=${encodeURIComponent(l.mapQuery)}&amp;z=16&amp;output=embed" title="${esc(l.label)} map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe></div></div>`).join(''),
  disclaimerIntro: () => esc(S.disclaimerIntro),
  disclaimerPoints: () => S.disclaimerPoints.map((d) => `<li>${esc(d)}</li>`).join(''),
  contactName: () => esc(S.contact.name),
  contactPhone: () => `<a href="${tel(S.contact.phone)}">${esc(S.contact.phone)}</a>`,
  contactEmail: () => `<a href="${mail(S.contact.email)}">${esc(S.contact.email)}</a>`,
  waIcon: () => waIcon(20),
  firm: () => esc(S.firm),
  hero: () => {
    const s0 = S.slides[0];
    const slides = S.slides.map((s, i) => `<div class="hero__slide${i === 0 ? ' is-active' : ''}"><img src="${img(s.img)}" alt=""${i === 0 ? ' fetchpriority="high"' : ' loading="lazy"'}></div>`).join('');
    const dots = S.slides.map((s, i) => `<button class="hero__dot${i === 0 ? ' is-active' : ''}" type="button" aria-label="Show slide ${i + 1}" data-i="${i}"></button>`).join('');
    return `<section id="hero" class="hero" aria-roledescription="carousel" aria-label="Featured services">${slides}
  <div class="container hero__inner"><div class="hero__copy">
    <div class="hero__eyebrow" data-h="eyebrow">${esc(s0.eyebrow)}</div>
    <h1 data-h="title">${esc(s0.title)}</h1>
    <p data-h="text">${esc(s0.text)}</p>
    <div class="hero__actions"><a class="btn btn--gold btn--gold-hero" data-h="cta" href="/practice-areas/">${esc(s0.cta)}</a><a class="btn btn--ghost" href="/contact/">Contact the firm</a></div>
  </div>
  <div class="hero__controls"><div class="hero__dots">${dots}</div><div class="hero__arrows"><button class="hero__arrow" type="button" aria-label="Previous slide" data-step="-1">←</button><button class="hero__arrow" type="button" aria-label="Next slide" data-step="1">→</button></div></div>
  </div></section>`;
  }
};

function advLinks(d, cls) {
  const links = (d.phone ? `<a href="${tel(d.phone)}">${esc(d.phone)}</a>` : '') + (d.email ? `<a class="gold" href="${mail(d.email)}">${esc(d.email)}</a>` : '');
  return links ? `<div class="${cls}">${links}</div>` : '';
}

function fill(template, extra) {
  return template.replace(/\{\{(\w+)\}\}/g, (m, k) => {
    if (extra && k in extra) return extra[k];
    if (blocks[k]) return blocks[k]();
    throw new Error('Unknown token {{' + k + '}}');
  });
}
const tpl = (name) => fs.readFileSync(path.join(SRC, 'pages', name + '.html'), 'utf8');

/* Large photos also get a 960px version in images/mobile/ so phones download the smaller file. */
const withMobileImages = (html) => html.replace(/<img src="\/images\/([^"/]+\.jpg)"/g, (m, f) =>
  fs.existsSync(path.join(SRC, 'static', 'images', 'mobile', f))
    ? `${m} srcset="/images/mobile/${f} 960w, /images/${f} 1920w" sizes="100vw"`
    : m);

/* ---------- page assembly ---------- */
const written = [];
function writePage(p) {
  const body = fill(p.body, p.tokens);
  const html = withMobileImages(head(p) + `
<body data-page="${p.key}">${header(p.key)}
<main id="main">${p.banner ? banner(p.banner) : ''}
${body}
</main>${p.cta === false ? '' : cta()}${footer()}${disclaimerModal()}
<script src="/js/data.js"></script>
<script src="/js/main.js"></script>
</body>
</html>
`);
  const file = p.url === '/404.html' ? path.join(OUT, '404.html') : path.join(OUT, p.url, 'index.html');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(p);
}

/* ---------- build ---------- */
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(path.join(SRC, 'static'), OUT, { recursive: true });

const loc0 = S.locations[0];
const legalServiceLd = {
  '@context': 'https://schema.org', '@type': 'LegalService', name: S.firm, url: SITE_URL + '/',
  image: SITE_URL + '/images/About_B.jpg', telephone: S.contact.phone, email: S.contact.email,
  address: { '@type': 'PostalAddress', streetAddress: loc0.street, addressLocality: loc0.locality, addressRegion: loc0.region, postalCode: loc0.postalCode, addressCountry: 'IN' },
  areaServed: 'India'
};

writePage({ key: 'home', url: '/', title: `${S.firm} | Advocates & Legal Consultants, Pune`, description: `${S.firm}, Pune: legal and consultancy services across corporate, civil, criminal, real estate, employment and commercial matters.`, body: tpl('home'), jsonld: legalServiceLd });

writePage({ key: 'about', url: '/about/', title: `About Us | ${S.firm}`, description: `${S.firm} handles civil, criminal and commercial litigation before courts, tribunals and quasi-judicial authorities in Pune and across India.`, banner: { img: 'About_B.jpg', crumbs: [{ label: 'About Us' }], title: 'About the firm.' }, body: tpl('about') });

writePage({ key: 'services', url: '/practice-areas/', title: `Practice Areas | ${S.firm}`, description: `Practice areas of ${S.firm}: ${S.areas.map((a) => a.title).join(', ')}.`, banner: { img: 'Civil_B.jpg', crumbs: [{ label: 'Practice Areas' }], title: 'Our practice areas.' }, body: tpl('practice-areas') });

S.areas.forEach((a, i) => {
  const next = S.areas[(i + 1) % S.areas.length];
  const list = S.areas.map((x) => `<a href="${areaUrl(x)}"${x.id === a.id ? ' class="is-active" aria-current="page"' : ''}><span>${esc(x.title)}</span><span aria-hidden="true">›</span></a>`).join('');
  const article = `<div class="services__media"><img src="${img(a.img)}" alt="" width="1920" height="1280"></div>
        <div class="eyebrow">Practice area ${pad2(i + 1)}</div>
        <h2>${esc(a.title)}</h2>
        ${a.paras.map((p) => `<div class="services__para">${p.h ? `<h3>${esc(p.h)}</h3>` : ''}<p>${esc(p.t)}</p></div>`).join('\n        ')}
        <div class="services__foot"><a class="btn btn--gold" href="/contact/">Contact the firm</a><a class="btn btn--link" href="${areaUrl(next)}">Next: ${esc(next.title)} →</a></div>`;
  writePage({ key: 'services', url: areaUrl(a), title: `${a.title} | ${S.firm}, Pune`, description: a.short, ogImage: a.img, banner: { img: a.img, crumbs: [{ label: 'Practice Areas', href: '/practice-areas/' }, { label: a.title }], title: a.title }, body: tpl('practice-area'), tokens: { areaList: list, areaArticle: article } });
});

writePage({ key: 'careers', url: '/careers/', title: `Careers | ${S.firm}`, description: `Build your legal career with ${S.firm}, Pune. Share your profile by email or WhatsApp.`, banner: { img: 'Reasarch_B.jpg', crumbs: [{ label: 'Careers' }], title: 'Join our team.' }, body: tpl('careers'), cta: false });

writePage({ key: 'contact', url: '/contact/', title: `Contact | ${S.firm}`, description: `Contact ${S.firm}: office at Sadashiv Peth and court chamber at Shivajinagar, Pune. Call ${S.contact.phone}.`, banner: { img: 'Contact_B.jpg', crumbs: [{ label: 'Contact' }], title: 'Contact us.' }, body: tpl('contact'), cta: false });

writePage({ key: 'disclaimer', url: '/disclaimer/', title: `Disclaimer | ${S.firm}`, description: `Disclaimer for the ${S.firm} website.`, banner: { img: 'About_B.jpg', crumbs: [{ label: 'Disclaimer' }], title: 'Disclaimer' }, body: tpl('disclaimer'), cta: false });

writePage({ key: 'privacy', url: '/privacy/', title: `Privacy Policy | ${S.firm}`, description: `How ${S.firm} handles personal data shared through this website.`, banner: { img: 'About_B.jpg', crumbs: [{ label: 'Privacy Policy' }], title: 'Privacy Policy' }, body: tpl('privacy'), cta: false });

writePage({ key: 'notfound', url: '/404.html', title: `Page not found | ${S.firm}`, description: 'This page could not be found.', noindex: true, body: tpl('404'), cta: false });

/* sitemap + robots */
const indexable = written.filter((p) => !p.noindex);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexable.map((p) => `  <url><loc>${SITE_URL}${p.url}</loc></url>`).join('\n')}
</urlset>
`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`Built ${written.length} pages into docs/`);
written.forEach((p) => console.log('  ' + p.url));

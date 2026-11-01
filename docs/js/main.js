/* Interactive behaviour only. Page content is generated into the HTML by build.js. */
(function () {
  'use strict';

  var S = window.SITE;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var waBase = 'https://wa.me/' + String(S.whatsappNumber).replace(/\D/g, '');
  var areaUrl = function (id) {
    var a = S.areas.filter(function (x) { return x.id === id; })[0];
    return a ? '/practice-areas/' + a.slug + '/' : '/practice-areas/';
  };
  var store = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Mobile menu ---------- */
  var toggle = $('.menu-toggle');
  var menu = $('#mobile-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var expand = $('.mobile-menu__expand');
  var sub = $('#mobile-areas');
  if (expand && sub) {
    expand.addEventListener('click', function () {
      sub.hidden = !sub.hidden;
      expand.setAttribute('aria-expanded', sub.hidden ? 'false' : 'true');
      expand.setAttribute('aria-label', sub.hidden ? 'Show practice areas' : 'Hide practice areas');
    });
  }

  /* ---------- Footer year ---------- */
  $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  /* ---------- Hero slider ---------- */
  var hero = $('#hero');
  if (hero) {
    var slides = S.slides;
    var current = 0;
    var timer = null;
    var paused = false;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var show = function (i) {
      current = (i + slides.length) % slides.length;
      var s = slides[current];
      $$('.hero__slide', hero).forEach(function (el, k) { el.classList.toggle('is-active', k === current); });
      $$('.hero__dot', hero).forEach(function (el, k) {
        el.classList.toggle('is-active', k === current);
        el.setAttribute('aria-current', k === current ? 'true' : 'false');
      });
      $('[data-h="eyebrow"]', hero).textContent = s.eyebrow;
      $('[data-h="title"]', hero).textContent = s.title;
      $('[data-h="text"]', hero).textContent = s.text;
      var cta = $('[data-h="cta"]', hero);
      cta.textContent = s.cta;
      cta.href = s.area ? areaUrl(s.area) : '/practice-areas/';
    };
    var start = function () {
      clearInterval(timer);
      if (!reduced && !paused) timer = setInterval(function () { show(current + 1); }, 6500);
    };
    hero.addEventListener('click', function (e) {
      var dot = e.target.closest('[data-i]');
      var arrow = e.target.closest('[data-step]');
      if (dot) { show(+dot.getAttribute('data-i')); start(); }
      if (arrow) { show(current + +arrow.getAttribute('data-step')); start(); }
    });
    /* Pause while the visitor is reading or using the slider. */
    hero.addEventListener('mouseenter', function () { paused = true; clearInterval(timer); });
    hero.addEventListener('mouseleave', function () { paused = false; start(); });
    hero.addEventListener('focusin', function () { paused = true; clearInterval(timer); });
    hero.addEventListener('focusout', function () { paused = false; start(); });
    start();
  }

  /* ---------- Email / WhatsApp message forms ---------- */
  var builders = {
    contact: function (v) {
      var lines = ['Hello ' + S.firm + ',', '', 'I would like to discuss a legal matter.', '', 'Name: ' + v('name')];
      if (v('company')) lines.push('Company: ' + v('company'));
      if (v('email')) lines.push('Email: ' + v('email'));
      if (v('phone')) lines.push('Contact: ' + v('phone'));
      if (v('message')) lines.push('', v('message'));
      return { subject: 'Enquiry' + (v('name') ? ' from ' + v('name') : ''), body: lines.join('\n') };
    },
    careers: function (v) {
      var lines = ['Hello ' + S.firm + ',', '', 'I would like to be considered for a role with the firm.', '', 'Name: ' + v('name')];
      if (v('phone')) lines.push('Contact: ' + v('phone'));
      lines.push('Interested in: ' + v('role'), 'Experience: ' + v('exp'));
      if (v('about')) lines.push('', 'About me: ' + v('about'));
      lines.push('', 'I will share my resume in this conversation.');
      return { subject: 'Career application' + (v('name') ? ' from ' + v('name') : '') + ': ' + v('role'), body: lines.join('\n') };
    }
  };
  $$('form[data-kind]').forEach(function (form) {
    var build = builders[form.getAttribute('data-kind')];
    var mailBtn = $('[data-role="mail"]', form);
    var waBtn = $('[data-role="wa"]', form);
    var missing = $('[data-role="missing"]', form);
    var v = function (n) { return form.elements[n] ? form.elements[n].value.trim() : ''; };
    var update = function () {
      var m = build(v);
      mailBtn.href = 'mailto:' + S.contact.email + '?subject=' + encodeURIComponent(m.subject) + '&body=' + encodeURIComponent(m.body);
      waBtn.href = waBase + '?text=' + encodeURIComponent(m.body);
      if (v('name')) missing.hidden = true;
    };
    var guard = function (e) {
      if (!v('name')) { e.preventDefault(); missing.hidden = false; form.elements.name.focus(); }
    };
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', function (e) { e.preventDefault(); });
    mailBtn.addEventListener('click', guard);
    waBtn.addEventListener('click', guard);
    update();
  });

  /* ---------- WhatsApp widget ---------- */
  (function () {
    var icon = function (size) {
      return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>';
    };
    var cats = S.areas.map(function (a) { return a.title; }).concat('General enquiry');
    var wrap = document.createElement('div');
    wrap.className = 'wa-widget';
    wrap.innerHTML =
      '<div class="wa-panel" role="dialog" aria-label="Chat on WhatsApp" hidden>' +
        '<div class="wa-panel__head"><div><div class="wa-panel__title">Chat with ' + esc(S.firm) + '</div>' +
        '<div class="wa-panel__sub" data-wa="sub">Select a subject to continue</div></div>' +
        '<button class="wa-panel__close" type="button" aria-label="Close" data-wa="toggle">×</button></div>' +
        '<div class="wa-step1" data-wa="step1">' +
          '<div class="wa-step-label">Step 1 of 2 · Select a subject</div>' +
          '<div class="wa-cats">' + cats.map(function (c, i) {
            return '<button type="button" data-cat="' + i + '">' + esc(c) + '<span aria-hidden="true">›</span></button>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="wa-step2" data-wa="step2" hidden>' +
          '<div class="wa-step2__top"><div class="wa-step-label">Step 2 of 2 · Review message</div>' +
          '<button class="wa-step2__back" type="button" data-wa="back">← Change</button></div>' +
          '<div class="wa-step2__cat"><span>Subject:</span> <strong data-wa="cat"></strong></div>' +
          '<label class="wa-field">Your name (optional)<input type="text" data-wa="name" autocomplete="name"></label>' +
          '<label class="wa-field">Message<textarea rows="5" data-wa="text"></textarea></label>' +
          '<a class="wa-send" data-wa="send" href="#" target="_blank" rel="noopener">' + icon(20) + 'Continue on WhatsApp</a>' +
          '<div class="wa-note">Opens WhatsApp with this message ready to send. Messages do not create an advocate-client relationship.</div>' +
        '</div>' +
      '</div>' +
      '<button class="wa-fab" type="button" aria-label="Chat on WhatsApp" data-wa="toggle">' + icon(30) + '</button>';
    document.body.appendChild(wrap);

    var q = function (k) { return $('[data-wa="' + k + '"]', wrap); };
    var panel = $('.wa-panel', wrap);
    var cat = null;
    var draft = function (category, name) {
      var who = name ? 'My name is ' + name + '. ' : '';
      return category === 'General enquiry'
        ? 'Hello ' + S.firm + ', ' + who + 'I have a general legal enquiry and would like to speak with an advocate. Please let me know a convenient time to connect.'
        : 'Hello ' + S.firm + ', ' + who + 'I would like to discuss a matter related to ' + category + '. Please let me know a convenient time to connect.';
    };
    var syncLink = function () { q('send').href = waBase + '?text=' + encodeURIComponent(q('text').value); };
    var step = function (n) {
      q('step1').hidden = n !== 1;
      q('step2').hidden = n !== 2;
      q('sub').textContent = n === 2 ? 'We usually reply during office hours' : 'Select a subject to continue';
    };
    wrap.addEventListener('click', function (e) {
      if (e.target.closest('[data-wa="toggle"]')) panel.hidden = !panel.hidden;
      if (e.target.closest('[data-wa="back"]')) step(1);
      var c = e.target.closest('[data-cat]');
      if (c) {
        cat = cats[+c.getAttribute('data-cat')];
        q('cat').textContent = cat;
        q('text').value = draft(cat, q('name').value.trim());
        syncLink();
        step(2);
      }
    });
    q('name').addEventListener('input', function () { q('text').value = draft(cat, this.value.trim()); syncLink(); });
    q('text').addEventListener('input', syncLink);
  })();

  /* ---------- Bar Council disclaimer pop-up (first visit only) ---------- */
  var modal = $('#disclaimer-modal');
  if (modal && store.get('ses_disclaimer_ok') !== '1' && document.body.getAttribute('data-page') !== 'disclaimer') {
    modal.hidden = false;
    document.documentElement.classList.add('modal-open');
    var agree = $('#dm-agree');
    /* Without preventScroll, small phones open the pop-up scrolled to the button, hiding its heading. */
    agree.focus({ preventScroll: true });
    agree.addEventListener('click', function () {
      store.set('ses_disclaimer_ok', '1');
      modal.hidden = true;
      document.documentElement.classList.remove('modal-open');
    });
  }
})();

(function () {
  'use strict';

  var VALID_LANGS = ['fr', 'en', 'es'];

  var DESCRIPTIONS = {
    fr: "Federico Calo — Architecte développeur web à Paris. Plus de 15 ans d'expérience en Drupal, Symfony, PHP et JavaScript. Conception, développement et maintenance de plateformes web complexes.",
    en: 'Federico Calo — Web Architect & Developer in Paris. 15+ years experience in Drupal, Symfony, PHP and JavaScript. Design, development and maintenance of complex web platforms.',
    es: 'Federico Calo — Arquitecto desarrollador web en París. Más de 15 años de experiencia en Drupal, Symfony, PHP y JavaScript. Diseño, desarrollo y mantenimiento de plataformas web complejas.'
  };
  var TITLES = {
    fr: 'Federico Calo - Architecte Développeur Web | Drupal, Symfony, PHP — Paris',
    en: 'Federico Calo - Web Architect & Developer | Drupal, Symfony, PHP — Paris',
    es: 'Federico Calo - Arquitecto Desarrollador Web | Drupal, Symfony, PHP — París'
  };
  var NAV_LABELS = {
    fr: 'Ouvrir le menu de navigation',
    en: 'Open navigation menu',
    es: 'Abrir el menú de navegación'
  };
  var NAV_ARIA = {
    fr: 'Navigation principale',
    en: 'Main navigation',
    es: 'Navegación principal'
  };
  var FOOTER_ARIA = {
    fr: 'Informations de contact',
    en: 'Contact information',
    es: 'Información de contacto'
  };
  var SKIP_LINK = {
    fr: 'Aller au contenu principal',
    en: 'Skip to main content',
    es: 'Ir al contenido principal'
  };
  var LANG_ANNOUNCEMENTS = {
    fr: 'Page affichée en français',
    en: 'Page switched to English',
    es: 'Página en español'
  };

  // Email obfuscation — assembled at runtime to prevent scraping
  function injectEmail() {
    var u = 'federico.calo';
    var d = 'pm.me';
    var addr = u + '@' + d;
    var mailto = 'mai' + 'lto:' + addr;

    var hero = document.getElementById('email-placeholder');
    if (hero) {
      var svg = hero.querySelector('svg');
      var a = document.createElement('a');
      a.href = mailto;
      a.textContent = addr;
      if (svg) {
        hero.insertBefore(document.createTextNode(' '), null);
      }
      hero.appendChild(a);
    }

    var footer = document.getElementById('footer-email-placeholder');
    if (footer) {
      var a2 = document.createElement('a');
      a2.href = mailto;
      a2.textContent = addr;
      footer.appendChild(a2);
    }
  }

  // Language switching — toggles body class
  function setLang(lang, announce) {
    // Toggle body class without wiping other classes
    document.body.classList.remove('lang-fr', 'lang-en', 'lang-es');
    document.body.classList.add('lang-' + lang);

    // Update lang buttons and aria-pressed
    var btns = document.querySelectorAll('.lang-btn');
    for (var j = 0; j < btns.length; j++) {
      var isActive = btns[j].getAttribute('data-set-lang') === lang;
      btns[j].classList.toggle('active', isActive);
      btns[j].setAttribute('aria-pressed', String(isActive));
    }

    // Update HTML lang attribute
    document.documentElement.lang = lang;

    // Update title and meta description
    document.title = TITLES[lang] || TITLES.fr;
    var meta = document.getElementById('meta-description');
    if (meta) {
      meta.setAttribute('content', DESCRIPTIONS[lang] || DESCRIPTIONS.fr);
    }

    // Update nav toggle label
    var toggle = document.querySelector('.nav-toggle');
    if (toggle) {
      toggle.setAttribute('aria-label', NAV_LABELS[lang] || NAV_LABELS.fr);
    }

    // Update nav aria-label
    var nav = document.getElementById('navbar');
    if (nav) {
      nav.setAttribute('aria-label', NAV_ARIA[lang] || NAV_ARIA.fr);
    }

    // Update footer aria-label
    var footer = document.getElementById('footer');
    if (footer) {
      footer.setAttribute('aria-label', FOOTER_ARIA[lang] || FOOTER_ARIA.fr);
    }

    // Update skip link text
    var skipLink = document.querySelector('.skip-link');
    if (skipLink) {
      skipLink.textContent = SKIP_LINK[lang] || SKIP_LINK.fr;
    }

    // Announce language change to screen readers
    if (announce) {
      var liveRegion = document.getElementById('lang-announce');
      if (liveRegion) {
        liveRegion.textContent = LANG_ANNOUNCEMENTS[lang] || '';
      }
    }

    // Save preference
    try { localStorage.setItem('lang', lang); } catch (e) {}
  }

  // Detect browser language, return matching valid lang or 'fr'
  function detectBrowserLang() {
    var browserLang = (navigator.language || navigator.userLanguage || 'fr').substring(0, 2).toLowerCase();
    return VALID_LANGS.indexOf(browserLang) !== -1 ? browserLang : 'fr';
  }

  // Mobile nav toggle
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close mobile nav on link click
    var anchors = links.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

  // Init
  function init() {
    injectEmail();
    initNav();

    // Language buttons
    var btns = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener('click', function () {
        setLang(this.getAttribute('data-set-lang'), true);
      });
    }

    // Load saved language, or detect from browser, or default to French
    var saved = null;
    try { saved = localStorage.getItem('lang'); } catch (e) {}
    setLang(saved || detectBrowserLang(), false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

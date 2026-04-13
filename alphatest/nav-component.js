// nav-component.js — Game Dev AI Guide · Shared Navigation
// Self-injecting: include this script and the nav appears automatically.
// Uses hub-nav CSS classes — no Tailwind required.
// Active state is auto-detected from window.location.pathname.
//
// Required load order in each tool's <head>:
//   <link rel="stylesheet" href="/hub-nav.css">
//   <script src="/nav-component.js"></script>
//
// To add a new tool: add one entry to navItems below, push once, done.

(function () {
  'use strict';

  // ── Active state detection ────────────────────────────────────────────────
  var path = window.location.pathname;

  function isActive(href) {
    if (href === '/') return path === '/' || path === '/index.html';
    return path.indexOf(href) === 0;
  }

  // ── Nav items — edit here to add/rename tools ─────────────────────────────
  // dot: hex color string, or null for no dot (Home)
  var navItems = [
    { href: '/',                label: 'Home',           dot: null },
    { href: '/ai-tools/',       label: 'AI Tools',       dot: '#d4943c' },
    { href: '/perspectives/',   label: 'Perspectives',   dot: '#d4943c' },
    { href: '/jobs/',           label: 'Job Search',     dot: '#d4943c' },
    { href: '/mcp/',            label: 'MCP Guide',      dot: '#d4943c' },
    { href: '/nvidia-toolkit/', label: 'NVIDIA Toolkit', dot: '#76b900' },
  ];

  // ── Build link HTML ───────────────────────────────────────────────────────
  function dotHTML(color) {
    if (!color) return '';
    return '<span class="hub-nav-dot" style="background:' + color + '"></span>';
  }

  function navLinkHTML(item) {
    var activeAttr = isActive(item.href) ? ' class="active"' : '';
    return '<li><a href="' + item.href + '"' + activeAttr + '>'
         + dotHTML(item.dot) + ' ' + item.label + '</a></li>';
  }

  var allLinks = navItems.map(navLinkHTML).join('');

  // ── Nav HTML ──────────────────────────────────────────────────────────────
  var navHTML = [
    '<nav class="hub-nav" role="navigation" aria-label="Main navigation" id="gdai-hub-nav">',
    '  <div class="hub-nav-inner">',
    '    <a href="/" class="hub-nav-logo" aria-label="Game Dev AI Guide home">',
    '      <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">',
    '        <rect x="2" y="2" width="28" height="28" rx="6" stroke="currentColor" stroke-width="2"/>',
    '        <path d="M10 22V10l6 5 6-5v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" opacity="0.85"/>',
    '        <circle cx="16" cy="16" r="2" fill="#d4943c"/>',
    '      </svg>',
    '      <span class="hub-nav-logo-text">Game Dev AI Guide</span>',
    '    </a>',
    '    <div class="hub-nav-right">',
    '      <ul class="hub-nav-links" id="gdaiNavLinks" role="list">',
    allLinks,
    '      </ul>',
    '      <button class="hub-nav-mobile-toggle" id="gdaiMobileToggle" aria-label="Toggle menu" aria-expanded="false">',
    '        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">',
    '          <line x1="3" y1="6" x2="21" y2="6"/>',
    '          <line x1="3" y1="12" x2="21" y2="12"/>',
    '          <line x1="3" y1="18" x2="21" y2="18"/>',
    '        </svg>',
    '      </button>',
    '    </div>',
    '  </div>',
    '</nav>',
  ].join('\n');

  // ── Inject at top of <body> ───────────────────────────────────────────────
  document.body.insertAdjacentHTML('afterbegin', navHTML);

  // ── Mobile toggle ─────────────────────────────────────────────────────────
  var toggle = document.getElementById('gdaiMobileToggle');
  var links  = document.getElementById('gdaiNavLinks');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    var anchors = links.querySelectorAll('a');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  }

})();

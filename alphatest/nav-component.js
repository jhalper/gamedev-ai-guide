// nav-component.js — Game Dev AI Guide · Shared Navigation
// Self-injecting: include this script and the nav appears automatically.
// Uses hub-nav CSS classes — no Tailwind required.
// Active state, logo gradient, and dot color all auto-detected from pathname.
//
// Required load order in each tool's <head>:
//   <link rel="stylesheet" href="/hub-nav.css">
//   <script src="/nav-component.js"></script>
//
// To add a new tool: add one entry to navItems below, push once, done.

(function () {
  'use strict';

  // ── Active state detection ────────────────────────────────────────────────
  // Uses indexOf so it works under any base folder (/alphatest/, /, etc.)
  var path = window.location.pathname;

  function isActive(href) {
    if (href === '/') {
      // Home is active only when no other tool path appears in the URL
      return !navItems.slice(1).some(function (item) {
        return path.indexOf(item.href) !== -1;
      });
    }
    return path.indexOf(href) !== -1;
  }

  // ── Nav items ─────────────────────────────────────────────────────────────
  // dot:      colored circle next to label (null = no dot)
  // color:    active link text + dot color
  // gradient: [stop1, stop2] for the logo icon when on this page
  var navItems = [
    { href: '/',                label: 'Home',           dot: null,      color: '#a4e6ff', gradient: ['#a4e6ff', '#6ec6f5'] },
    { href: '/ai-tools/',       label: 'AI Tools',       dot: '#d4943c', color: '#d4943c', gradient: ['#d4943c', '#e8a84e'] },
    { href: '/perspectives/',   label: 'Perspectives',   dot: '#a78bfa', color: '#a78bfa', gradient: ['#a78bfa', '#7c5cbf'] },
    { href: '/jobs/',           label: 'Job Search',     dot: '#e8695c', color: '#e8695c', gradient: ['#e8695c', '#c0392b'] },
    { href: '/mcp/',            label: 'MCP Guide',      dot: '#35ceae', color: '#35ceae', gradient: ['#38bdf8', '#35ceae'] },
    { href: '/nvidia-toolkit/', label: 'NVIDIA Toolkit', dot: '#76b900', color: '#76b900', gradient: ['#76b900', '#a3e635'] },
  ];

  // ── Helpers ───────────────────────────────────────────────────────────────
  function hexToRgba(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16);
    var g = parseInt(hex.slice(3, 5), 16);
    var b = parseInt(hex.slice(5, 7), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  // Find active item (default to Home)
  var activeItem = navItems[0];
  for (var i = 0; i < navItems.length; i++) {
    if (isActive(navItems[i].href)) { activeItem = navItems[i]; break; }
  }

  // ── Build link HTML ───────────────────────────────────────────────────────
  function dotHTML(color) {
    if (!color) return '';
    return '<span class="hub-nav-dot" style="background:' + color + '"></span>';
  }

  function navLinkHTML(item) {
    if (isActive(item.href)) {
      var bg = hexToRgba(item.color, 0.10);
      return '<li><a href="' + item.href + '" class="active" style="color:' + item.color + ';background:' + bg + '">'
           + dotHTML(item.dot) + ' ' + item.label + '</a></li>';
    }
    return '<li><a href="' + item.href + '">' + dotHTML(item.dot) + ' ' + item.label + '</a></li>';
  }

  var allLinks = navItems.map(navLinkHTML).join('');

  // ── Logo SVG — gradient matches active page ───────────────────────────────
  var g = activeItem.gradient;
  var logoSVG = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true">',
    '  <defs>',
    '    <linearGradient id="gdai-nav-g" x1="0%" y1="0%" x2="100%" y2="100%">',
    '      <stop offset="0%" stop-color="' + g[0] + '"/>',
    '      <stop offset="100%" stop-color="' + g[1] + '"/>',
    '    </linearGradient>',
    '  </defs>',
    '  <rect width="32" height="32" rx="7" fill="url(#gdai-nav-g)"/>',
    '  <text x="16" y="22" font-family="\'Exo 2\',Arial,sans-serif" font-weight="800" font-size="14" fill="white" text-anchor="middle" letter-spacing="-0.5">GD</text>',
    '</svg>',
  ].join('');

  // ── Nav HTML ──────────────────────────────────────────────────────────────
  var navHTML = [
    '<nav class="hub-nav" role="navigation" aria-label="Main navigation" id="gdai-hub-nav">',
    '  <div class="hub-nav-inner">',
    '    <a href="/" class="hub-nav-logo" aria-label="Game Dev AI Guide home">',
    '      ' + logoSVG,
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

  // ── Animation + interaction styles ───────────────────────────────────────
  var navStyles = [
    '<style id="gdai-nav-anim">',

    /* Nav entry — fade in + slide down */
    '@keyframes gdai-nav-enter {',
    '  from { opacity: 0; transform: translateY(-10px); }',
    '  to   { opacity: 1; transform: translateY(0); }',
    '}',
    '#gdai-hub-nav {',
    '  animation: gdai-nav-enter 0.45s cubic-bezier(0.16, 1, 0.3, 1) forwards;',
    '}',

    /* Logo — scale up on hover */
    '#gdai-hub-nav .hub-nav-logo svg {',
    '  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);',
    '}',
    '#gdai-hub-nav .hub-nav-logo:hover svg {',
    '  transform: scale(1.1);',
    '}',

    /* Active dot — gentle glow pulse */
    '@keyframes gdai-dot-pulse {',
    '  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 currentColor; }',
    '  50%       { opacity: 0.75; box-shadow: 0 0 5px 1px currentColor; }',
    '}',
    '#gdai-hub-nav .hub-nav-links a.active .hub-nav-dot {',
    '  animation: gdai-dot-pulse 2.8s ease-in-out infinite;',
    '}',

    /* Link hover underline grow */
    '#gdai-hub-nav .hub-nav-links a:not(.active) { position: relative; }',
    '#gdai-hub-nav .hub-nav-links a:not(.active)::after {',
    '  content: ""; position: absolute; bottom: 2px; left: 50%;',
    '  width: 0; height: 1px; background: currentColor; opacity: 0.4;',
    '  transition: width 0.22s ease, left 0.22s ease;',
    '}',
    '#gdai-hub-nav .hub-nav-links a:not(.active):hover::after {',
    '  width: calc(100% - 1.5rem); left: 0.75rem;',
    '}',

    /* Respect reduced motion */
    '@media (prefers-reduced-motion: reduce) {',
    '  #gdai-hub-nav { animation: none; }',
    '  #gdai-hub-nav .hub-nav-links a.active .hub-nav-dot { animation: none; }',
    '  #gdai-hub-nav .hub-nav-logo svg { transition: none; }',
    '}',

    '</style>',
  ].join('\n');

  // ── Inject + wire up — safe whether script is in <head> or <body> ─────────
  function init() {
    if (!document.body) return;

    // Inject nav
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    // Inject animation styles into <head>
    document.head.insertAdjacentHTML('beforeend', navStyles);

    // Scroll-aware backdrop — darkens + shadows as page scrolls
    var nav = document.getElementById('gdai-hub-nav');
    if (nav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 15) {
          nav.style.background = 'rgba(17,17,16,0.98)';
          nav.style.boxShadow = '0 2px 24px rgba(0,0,0,0.35)';
        } else {
          nav.style.background = '';
          nav.style.boxShadow = '';
        }
      }, { passive: true });
    }

    // Mobile toggle
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

#!/usr/bin/env python3
"""Build the Omniverse Solution Path Finder pitch presentation."""

# Read the base64 logo
with open('/home/user/workspace/logo_base64.txt', 'r') as f:
    logo_b64 = f.read().strip()

html = f'''<!DOCTYPE html>
<html lang="en">
<head>
<!--
   ______                            __
  / ____/___  ____ ___  ____  __  __/ /____  _____
 / /   / __ \\/ __ `__ \\/ __ \\/ / / / __/ _ \\/ ___/
/ /___/ /_/ / / / / / / /_/ / /_/ / /_/  __/ /
\\____/\\____/_/ /_/ /_/ .___/\\__,_/\\__/\\___/_/
                    /_/
        Created with Perplexity Computer
        https://www.perplexity.ai/computer
-->

<!-- Perplexity Computer Attribution — SEO Meta Tags -->
<meta name="generator" content="Perplexity Computer">
<meta name="author" content="Perplexity Computer">
<meta property="og:see_also" content="https://www.perplexity.ai/computer">
<link rel="author" href="https://www.perplexity.ai/computer">

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Omniverse Solution Path Finder — Pitch Presentation</title>
<meta name="description" content="A 2-minute guided path to answer: What can NVIDIA Omniverse do for me?">

<link href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" rel="stylesheet">

<style>
  *, *::before, *::after {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }}

  :root {{
    --green: #76B900;
    --green-dim: rgba(118, 185, 0, 0.15);
    --green-glow: rgba(118, 185, 0, 0.08);
    --black: #121110;
    --white: #FFFFFF;
    --gray: #999999;
    --gray-dark: #666666;
    --font-display: 'General Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-body: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  }}

  html {{
    scroll-behavior: smooth;
    background: var(--black);
  }}

  body {{
    font-family: var(--font-body);
    background: var(--black);
    color: var(--white);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }}

  /* Desktop scroll snap */
  @media (min-width: 769px) {{
    html {{
      scroll-snap-type: y mandatory;
    }}
  }}

  /* ——— SECTIONS ——— */
  section {{
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    overflow: hidden;
  }}

  @media (min-width: 769px) {{
    section {{
      min-height: 100vh;
      scroll-snap-align: start;
      padding: 60px 48px;
    }}
  }}

  /* Background glow orbs */
  section::before {{
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, var(--green-glow) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }}

  section:nth-child(odd)::before {{
    top: -200px;
    right: -200px;
  }}

  section:nth-child(even)::before {{
    bottom: -200px;
    left: -200px;
  }}

  .section-inner {{
    position: relative;
    z-index: 1;
    max-width: 1100px;
    width: 100%;
  }}

  /* ——— FADE-IN ANIMATION ——— */
  .fade-in {{
    opacity: 0;
    transform: translateY(24px);
    transition: opacity 0.7s var(--ease-out), transform 0.7s var(--ease-out);
  }}

  .fade-in.visible {{
    opacity: 1;
    transform: translateY(0);
  }}

  .fade-in.delay-1 {{ transition-delay: 0.1s; }}
  .fade-in.delay-2 {{ transition-delay: 0.2s; }}
  .fade-in.delay-3 {{ transition-delay: 0.3s; }}
  .fade-in.delay-4 {{ transition-delay: 0.4s; }}

  /* ——— TYPOGRAPHY ——— */
  h2 {{
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(1.75rem, 4vw, 2.75rem);
    line-height: 1.15;
    letter-spacing: -0.02em;
    margin-bottom: 40px;
    color: var(--white);
  }}

  h3 {{
    font-family: var(--font-display);
    font-weight: 600;
    font-size: clamp(1rem, 2vw, 1.25rem);
    line-height: 1.3;
    margin-bottom: 12px;
  }}

  p.body-text {{
    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
    line-height: 1.7;
    color: var(--gray);
    max-width: 640px;
  }}

  p.body-text + p.body-text {{
    margin-top: 20px;
  }}

  .green {{ color: var(--green); }}

  /* ——— TITLE SECTION ——— */
  .title-section {{
    text-align: center;
    gap: 24px;
  }}

  .title-section .section-inner {{
    display: flex;
    flex-direction: column;
    align-items: center;
  }}

  .logo-img {{
    width: 300px;
    max-width: 80%;
    height: auto;
    margin-bottom: 32px;
  }}

  @media (max-width: 768px) {{
    .logo-img {{
      width: 200px;
    }}
  }}

  .title-main {{
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(2rem, 5vw, 3.25rem);
    line-height: 1.1;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }}

  .title-sub {{
    font-family: var(--font-display);
    font-weight: 500;
    font-size: clamp(1rem, 2.5vw, 1.35rem);
    color: var(--green);
    line-height: 1.4;
    max-width: 520px;
  }}

  .scroll-indicator {{
    position: absolute;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0.5;
    animation: pulse-down 2s ease-in-out infinite;
  }}

  .scroll-indicator span {{
    font-size: 0.75rem;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gray-dark);
  }}

  .scroll-indicator svg {{
    width: 20px;
    height: 20px;
    stroke: var(--gray-dark);
  }}

  @keyframes pulse-down {{
    0%, 100% {{ transform: translateX(-50%) translateY(0); opacity: 0.5; }}
    50% {{ transform: translateX(-50%) translateY(6px); opacity: 0.8; }}
  }}

  @media (max-width: 768px) {{
    .scroll-indicator {{ display: none; }}
  }}

  /* ——— CARDS ——— */
  .cards {{
    display: grid;
    gap: 24px;
    width: 100%;
    margin-top: 8px;
  }}

  .cards-2 {{
    grid-template-columns: 1fr 1fr;
  }}

  .cards-3 {{
    grid-template-columns: repeat(3, 1fr);
  }}

  .cards-2x2 {{
    grid-template-columns: 1fr 1fr;
  }}

  .cards-4 {{
    grid-template-columns: repeat(4, 1fr);
  }}

  @media (max-width: 768px) {{
    .cards-2, .cards-3, .cards-2x2, .cards-4 {{
      grid-template-columns: 1fr;
    }}
  }}

  .card {{
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 16px;
    padding: 32px 28px;
    transition: border-color 0.3s var(--ease-out);
  }}

  .card:hover {{
    border-color: rgba(118, 185, 0, 0.2);
  }}

  .card h3.green {{
    color: var(--green);
  }}

  .card p {{
    color: var(--gray);
    font-size: 0.95rem;
    line-height: 1.65;
  }}

  .card ul {{
    list-style: none;
    padding: 0;
  }}

  .card ul li {{
    color: var(--gray);
    font-size: 0.95rem;
    line-height: 1.65;
    padding-left: 16px;
    position: relative;
  }}

  .card ul li::before {{
    content: '';
    position: absolute;
    left: 0;
    top: 0.6em;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: var(--green);
  }}

  /* ——— STATS ——— */
  .stats-grid {{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    width: 100%;
    margin-top: 8px;
  }}

  @media (max-width: 768px) {{
    .stats-grid {{
      grid-template-columns: 1fr 1fr;
    }}
  }}

  .stat {{
    text-align: center;
    padding: 36px 16px;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 16px;
  }}

  .stat-number {{
    font-family: var(--font-display);
    font-weight: 700;
    font-size: clamp(2.25rem, 5vw, 3.25rem);
    color: var(--green);
    line-height: 1;
    margin-bottom: 12px;
    letter-spacing: -0.02em;
  }}

  .stat-label {{
    color: var(--gray);
    font-size: 0.9rem;
    line-height: 1.4;
  }}

  .footnote {{
    margin-top: 32px;
    font-size: 0.85rem;
    color: var(--gray-dark);
    text-align: center;
    font-style: italic;
    max-width: 640px;
  }}

  /* ——— CTA ——— */
  .cta-btn {{
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 36px;
    padding: 16px 36px;
    background: var(--green);
    color: var(--black);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1.05rem;
    text-decoration: none;
    border-radius: 12px;
    transition: background 0.25s var(--ease-out), transform 0.25s var(--ease-out), box-shadow 0.25s var(--ease-out);
  }}

  .cta-btn:hover {{
    background: #85d100;
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(118, 185, 0, 0.25);
  }}

  .cta-btn:active {{
    transform: translateY(0);
  }}

  /* ——— CLOSING SECTION ——— */
  .closing-body {{
    font-size: clamp(0.95rem, 1.5vw, 1.1rem);
    line-height: 1.7;
    color: var(--gray);
    max-width: 560px;
    text-align: center;
    margin-top: 12px;
  }}

  /* ——— FOOTER ——— */
  footer {{
    padding: 24px;
    text-align: center;
  }}

  footer a {{
    color: var(--gray-dark);
    font-size: 0.75rem;
    text-decoration: none;
    transition: color 0.2s var(--ease-out);
  }}

  footer a:hover {{
    color: var(--gray);
  }}

  /* ——— REDUCED MOTION ——— */
  @media (prefers-reduced-motion: reduce) {{
    .fade-in {{
      opacity: 1;
      transform: none;
      transition: none;
    }}
    .scroll-indicator {{
      animation: none;
    }}
    html {{
      scroll-behavior: auto;
    }}
  }}
</style>
</head>
<body>

<!-- SECTION 1 — Title -->
<section class="title-section">
  <div class="section-inner">
    <img src="data:image/jpeg;base64,{logo_b64}" alt="NVIDIA Omniverse" class="logo-img fade-in">
    <h1 class="title-main fade-in delay-1">Omniverse Solution Path Finder</h1>
    <p class="title-sub fade-in delay-2">The always-ready answer to &ldquo;What can Omniverse do for me?&rdquo;</p>
  </div>
  <div class="scroll-indicator">
    <span>Scroll</span>
    <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
  </div>
</section>

<!-- SECTION 2 — The Problem -->
<section>
  <div class="section-inner">
    <h2 class="fade-in">The Omniverse Explanation Problem</h2>
    <p class="body-text fade-in delay-1">Omniverse is a broad platform that means different things to different industries.</p>
    <p class="body-text fade-in delay-2">The default explanation is too technical for most business conversations.</p>
    <p class="body-text fade-in delay-3">Every DevRel, sales, and partner conversation starts from scratch.</p>
  </div>
</section>

<!-- SECTION 3 — The Solution -->
<section>
  <div class="section-inner">
    <h2 class="fade-in">A 2-Minute Guided Path</h2>
    <div class="cards cards-2 fade-in delay-1">
      <div class="card">
        <h3 class="green">Visitor answers 4 questions</h3>
        <ul>
          <li>Industry</li>
          <li>Challenge</li>
          <li>Tools</li>
          <li>Desired outcome</li>
        </ul>
      </div>
      <div class="card">
        <h3>Tool delivers</h3>
        <ul>
          <li>Tailored solution track</li>
          <li>Business-value language</li>
          <li>90-day roadmap</li>
          <li>Component links to NVIDIA docs</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 4 — Event Mode -->
<section>
  <div class="section-inner">
    <h2 class="fade-in">Built for the Booth</h2>
    <div class="cards cards-3 fade-in delay-1">
      <div class="card">
        <h3 class="green">Industry Tiles</h3>
        <p>Tap an industry, get a tailored elevator pitch instantly.</p>
      </div>
      <div class="card">
        <h3 class="green">Persona Launch</h3>
        <p>Factory Ops Director, VFX Supervisor, BIM Coordinator — one tap to a live demo.</p>
      </div>
      <div class="card">
        <h3 class="green">Presenter Notes</h3>
        <p>Talking points on every result screen, visible only in Event Mode.</p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 5 — Proof Points -->
<section>
  <div class="section-inner">
    <h2 class="fade-in">Real Outcomes, Ready to Quote</h2>
    <div class="stats-grid fade-in delay-1">
      <div class="stat">
        <div class="stat-number">30%</div>
        <div class="stat-label">BMW planning efficiency</div>
      </div>
      <div class="stat">
        <div class="stat-number">&lt;$1</div>
        <div class="stat-label">Lowe&rsquo;s per 3D asset</div>
      </div>
      <div class="stat">
        <div class="stat-number">200+</div>
        <div class="stat-label">Amazon facilities on Isaac Sim</div>
      </div>
      <div class="stat">
        <div class="stat-number">$1.7B</div>
        <div class="stat-label">Siemens Energy annual savings</div>
      </div>
    </div>
    <p class="footnote fade-in delay-2">Each fact is built into the tool with a suggested talking point for the presenter.</p>
  </div>
</section>

<!-- SECTION 6 — Who Benefits -->
<section>
  <div class="section-inner">
    <h2 class="fade-in">Not Just DevRel</h2>
    <div class="cards cards-2x2 fade-in delay-1">
      <div class="card">
        <h3 class="green">Sales Engineers</h3>
        <p>Discovery calls with tailored component recommendations.</p>
      </div>
      <div class="card">
        <h3 class="green">Account Managers</h3>
        <p>Quick industry briefings for new verticals.</p>
      </div>
      <div class="card">
        <h3 class="green">Solutions Architects</h3>
        <p>Pilot scoping with ready-made 90-day roadmaps.</p>
      </div>
      <div class="card">
        <h3 class="green">Marketing</h3>
        <p>Industry-specific messaging and proof points on demand.</p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 7 — Lead Capture -->
<section>
  <div class="section-inner">
    <h2 class="fade-in">From Conversation to Pipeline</h2>
    <div class="cards cards-2 fade-in delay-1">
      <div class="card">
        <h3 class="green">Send This Plan</h3>
        <p>Optional form captures name, email, company, role, timeframe. Structured for CRM export.</p>
      </div>
      <div class="card">
        <h3 class="green">QR Code Self-Service</h3>
        <p>Visitor scans, completes on their phone. Same structured lead data.</p>
      </div>
    </div>
  </div>
</section>

<!-- SECTION 8 — Closing -->
<section class="title-section">
  <div class="section-inner">
    <img src="data:image/jpeg;base64,{logo_b64}" alt="NVIDIA Omniverse" class="logo-img fade-in">
    <h2 class="fade-in delay-1" style="margin-bottom: 16px;">Config-Driven. Easy to Extend.</h2>
    <p class="closing-body fade-in delay-2">Add industries, personas, facts, or solution tracks by editing a config file. No code changes needed.</p>
    <a href="https://www.perplexity.ai/computer/a/omniverse-solution-path-finder-nSh3gjW4RECCm3n5GNJieA" target="_blank" rel="noopener noreferrer" class="cta-btn fade-in delay-3">
      Try the live tool
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
    </a>
  </div>
</section>

<footer>
  <a href="https://www.perplexity.ai/computer" target="_blank" rel="noopener noreferrer">Created with Perplexity Computer</a>
</footer>

<script>
  // IntersectionObserver for fade-in animations
  const observer = new IntersectionObserver((entries) => {{
    entries.forEach(entry => {{
      if (entry.isIntersecting) {{
        entry.target.classList.add('visible');
      }}
    }});
  }}, {{
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  }});

  document.querySelectorAll('.fade-in').forEach(el => {{
    observer.observe(el);
  }});
</script>
</body>
</html>'''

with open('/home/user/workspace/omniverse-pitch-site/index.html', 'w') as f:
    f.write(html)

print(f"HTML written: {len(html)} chars")

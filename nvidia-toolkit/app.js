// ============================================================
// NVIDIA Game Dev Toolkit — Application Logic
// ============================================================

(function () {
  'use strict';

  // ---------- State ----------
  const state = {
    filters: {
      phase: [],
      engine: [],
      category: [],
      team: []
    },
    search: '',
    expanded: new Set()
  };

  // ---------- Constants ----------
  const PHASES = ['Concept', 'Prototype', 'Pre-production', 'Production', 'Polish', 'Launch', 'Post-launch', 'Marketing'];
  const ENGINES = ['Unreal Engine', 'Unity', 'Godot', 'Custom Engine'];
  const ENGINE_SHORT = { 'Unreal Engine': 'UE', 'Unity': 'UN', 'Godot': 'GO', 'Custom Engine': 'CE' };
  const CATEGORIES = NVIDIA_DATA.categories || [
    'Rendering & Graphics', 'AI & NPCs', 'Physics & Simulation', 'Audio',
    'Asset Creation', 'Testing & Profiling', 'Cloud & Distribution',
    'Developer Tools', 'Marketing & Content', 'Developer Programs'
  ];
  const TEAMS = ['Solo/Indie', 'Small Team (2-10)', 'Mid-size (10-50)', 'AAA (50+)'];

  const CATEGORY_COLORS = {
    'Rendering & Graphics': { bg: 'rgba(79,195,247,0.12)', text: '#4fc3f7' },
    'AI & NPCs': { bg: 'rgba(186,104,200,0.12)', text: '#ba68c8' },
    'Physics & Simulation': { bg: 'rgba(255,138,101,0.12)', text: '#ff8a65' },
    'Audio': { bg: 'rgba(240,98,146,0.12)', text: '#f06292' },
    'Asset Creation': { bg: 'rgba(174,213,129,0.12)', text: '#aed581' },
    'Testing & Profiling': { bg: 'rgba(255,213,79,0.12)', text: '#ffd54f' },
    'Cloud & Distribution': { bg: 'rgba(77,208,225,0.12)', text: '#4dd0e1' },
    'Developer Tools': { bg: 'rgba(144,164,174,0.12)', text: '#90a4ae' },
    'Marketing & Content': { bg: 'rgba(255,171,145,0.12)', text: '#ffab91' },
    'Developer Programs': { bg: 'rgba(128,203,196,0.12)', text: '#80cbc4' }
  };

  const WTS_ICONS = {
    rocket: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
    gauge: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m14.7 10.7-4 2.6"/><path d="M12 6v2"/></svg>`,
    brain: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v1a3 3 0 0 0-3 3 3 3 0 0 0 1 2.2A4 4 0 0 0 10 20h4a4 4 0 0 0 4-7.8 3 3 0 0 0 1-2.2 3 3 0 0 0-3-3V6a4 4 0 0 0-4-4z"/><path d="M12 2v20"/></svg>`,
    zap: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    cloud: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/></svg>`,
    film: `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>`
  };

  // ---------- DOM Elements ----------
  const dom = {
    searchInput: document.getElementById('searchInput'),
    toolsGrid: document.getElementById('toolsGrid'),
    noResults: document.getElementById('noResults'),
    resultCount: document.getElementById('resultCount'),
    clearFilters: document.getElementById('clearFilters'),
    activeFilters: document.getElementById('activeFilters'),
    wtsGrid: document.getElementById('wtsGrid'),
    matrixBody: document.getElementById('matrixBody'),
    themeToggle: document.getElementById('themeToggle'),
    statTools: document.getElementById('statTools')
  };

  // ---------- Initialize ----------
  function init() {
    loadStateFromHash();
    renderWhereToStart();
    renderEngineMatrix();
    buildFilterDropdowns();
    renderTools();
    bindEvents();
    updateStats();
  }

  // ---------- Theme Toggle ----------
  function initTheme() {
    // Default to dark
    const theme = 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }

  dom.themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
  });

  // ---------- Where to Start ----------
  function renderWhereToStart() {
    dom.wtsGrid.innerHTML = NVIDIA_DATA.whereToStart.map(guide => `
      <div class="wts-card" tabindex="0" role="button" aria-label="${guide.title}" data-wts="${guide.id}">
        <div class="wts-card-header">
          <div class="wts-icon">${WTS_ICONS[guide.icon] || ''}</div>
          <h3 class="wts-card-title">${guide.title}</h3>
        </div>
        <p class="wts-card-desc">${guide.description}</p>
        <div class="wts-tools">
          ${guide.tools.map(t => `<span class="wts-tool-pill">${shortenToolName(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');

    // Click handler for WTS cards
    dom.wtsGrid.querySelectorAll('.wts-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = card.dataset.wts;
        const guide = NVIDIA_DATA.whereToStart.find(g => g.id === id);
        if (guide) {
          // Search for these tool names
          const toolNames = guide.tools.join(' ');
          state.search = '';
          clearFiltersState();
          dom.searchInput.value = '';
          // Expand matching tools
          const matchingTools = NVIDIA_DATA.tools.filter(t =>
            guide.tools.some(gn => t.name.toLowerCase().includes(gn.toLowerCase().split(' ')[0]))
          );
          state.expanded = new Set(matchingTools.map(t => t.id));
          renderTools();
          document.getElementById('tools').scrollIntoView({ behavior: 'smooth' });
        }
      });
      card.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.click();
        }
      });
    });
  }

  function shortenToolName(name) {
    return name
      .replace(/^NVIDIA\s+/i, '')
      .replace(/\s*\([^)]*\)\s*/g, '')
      .replace(/\s+SDK$/i, '')
      .trim();
  }

  // ---------- Engine Matrix ----------
  function renderEngineMatrix() {
    dom.matrixBody.innerHTML = NVIDIA_DATA.engineMatrix.map(row => {
      function cell(val, type) {
        let cls, label;
        if (val >= 4) { cls = 'matrix-green'; label = val; }
        else if (val >= 2) { cls = 'matrix-yellow'; label = val; }
        else if (val >= 1) { cls = 'matrix-red'; label = val; }
        else { cls = 'matrix-gray'; label = '—'; }
        const typeStr = type !== 'N/A' ? `<span class="matrix-type">${type}</span>` : '';
        return `<td><span class="matrix-cell ${cls}">${label}</span>${typeStr}</td>`;
      }
      return `<tr>
        <td>${row.name}</td>
        ${cell(row.unreal, row.unrealType)}
        ${cell(row.unity, row.unityType)}
        ${cell(row.godot, row.godotType)}
        ${cell(row.custom, row.customType)}
      </tr>`;
    }).join('');
  }

  // ---------- Filter Dropdowns ----------
  function buildFilterDropdowns() {
    buildDropdown('filterPhase', 'phase', PHASES);
    buildDropdown('filterEngine', 'engine', ENGINES);
    buildDropdown('filterCategory', 'category', CATEGORIES);
    buildDropdown('filterTeam', 'team', TEAMS);
  }

  function buildDropdown(containerId, filterKey, options) {
    const container = document.getElementById(containerId);
    container.innerHTML = options.map(opt => `
      <label class="filter-option">
        <input type="checkbox" value="${opt}" data-filter-key="${filterKey}"
               ${state.filters[filterKey].includes(opt) ? 'checked' : ''}>
        <span>${opt}</span>
      </label>
    `).join('');

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        const key = cb.dataset.filterKey;
        const val = cb.value;
        if (cb.checked) {
          if (!state.filters[key].includes(val)) state.filters[key].push(val);
        } else {
          state.filters[key] = state.filters[key].filter(v => v !== val);
        }
        updateFilterToggles();
        renderTools();
        saveStateToHash();
      });
    });
  }

  function updateFilterToggles() {
    document.querySelectorAll('.filter-toggle').forEach(btn => {
      const key = btn.dataset.filter;
      btn.classList.toggle('has-active', state.filters[key] && state.filters[key].length > 0);
    });
    renderActiveFilters();
  }

  function renderActiveFilters() {
    const tags = [];
    for (const [key, values] of Object.entries(state.filters)) {
      for (const val of values) {
        tags.push(`<span class="active-filter-tag">${val}<button aria-label="Remove ${val} filter" data-key="${key}" data-val="${val}">&times;</button></span>`);
      }
    }
    dom.activeFilters.innerHTML = tags.join('');
    dom.activeFilters.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.key;
        const val = btn.dataset.val;
        state.filters[key] = state.filters[key].filter(v => v !== val);
        // Uncheck the corresponding checkbox
        const cb = document.querySelector(`input[data-filter-key="${key}"][value="${val}"]`);
        if (cb) cb.checked = false;
        updateFilterToggles();
        renderTools();
        saveStateToHash();
      });
    });
  }

  // ---------- Filter Logic ----------
  function filterTools() {
    return NVIDIA_DATA.tools.filter(tool => {
      // Search
      if (state.search) {
        const q = state.search.toLowerCase();
        const searchable = `${tool.name} ${tool.oneLiner} ${tool.description} ${tool.category}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      // Phase filter
      if (state.filters.phase.length > 0) {
        if (!state.filters.phase.some(p => tool.phases && tool.phases.includes(p))) return false;
      }

      // Engine filter
      if (state.filters.engine.length > 0) {
        if (!state.filters.engine.some(e => tool.engines && tool.engines.includes(e))) return false;
      }

      // Category filter
      if (state.filters.category.length > 0) {
        if (!state.filters.category.includes(tool.category)) return false;
      }

      // Team filter
      if (state.filters.team.length > 0) {
        if (!state.filters.team.some(t => tool.teamSizes && tool.teamSizes.includes(t))) return false;
      }

      return true;
    });
  }

  // ---------- Render Tools ----------
  function renderTools() {
    const filtered = filterTools();
    const count = filtered.length;
    const total = NVIDIA_DATA.tools.length;

    dom.resultCount.textContent = `${count} of ${total} tools`;
    dom.noResults.hidden = count > 0;
    dom.toolsGrid.style.display = count > 0 ? '' : 'none';

    dom.toolsGrid.innerHTML = filtered.map(tool => {
      const isExpanded = state.expanded.has(tool.id);
      const catColor = CATEGORY_COLORS[tool.category] || { bg: 'rgba(118,185,0,0.12)', text: '#76b900' };
      const pricingClass = (tool.pricing || 'free').toLowerCase().replace(/\s+/g, '-');
      const maturityClass = (tool.maturity || 'stable').toLowerCase().replace(/\s+/g, '-');

      return `
      <article class="tool-card${isExpanded ? ' expanded' : ''}" role="listitem" data-tool-id="${tool.id}">
        <div class="tool-header" tabindex="0" role="button" aria-expanded="${isExpanded}" aria-label="Expand ${tool.name} details">
          <div class="tool-header-left">
            <div class="tool-name-row">
              <a href="${tool.officialPage || tool.url}" class="tool-name-link" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" title="Open NVIDIA page">${tool.name}<svg class="link-out-icon" viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>
              ${tool.hiddenGem >= 4 ? '<span class="hidden-gem-star" title="Hidden Gem">★</span>' : ''}
            </div>
            <div class="tool-badges">
              <span class="badge badge-category" style="background:${catColor.bg};color:${catColor.text}">${tool.category}</span>
              <span class="badge badge-pricing ${pricingClass}">${tool.pricing}</span>
              <span class="badge badge-maturity ${maturityClass}">${tool.maturity}</span>
            </div>
            <p class="tool-desc-short">${tool.oneLiner || tool.description}</p>
            ${tool.whyGameDev ? `<p class="why-gamedev"><svg class="why-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>${tool.whyGameDev}</p>` : ''}
          </div>
          <div class="tool-header-right">
            <div class="engine-icons">
              ${ENGINES.map(eng => {
                const short = ENGINE_SHORT[eng];
                const supported = tool.engines && tool.engines.includes(eng);
                return `<span class="engine-icon${supported ? ' supported' : ''}" title="${eng}">${short}</span>`;
              }).join('')}
            </div>
            <div class="expand-arrow">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>
        <div class="tool-details">
          ${isExpanded ? renderToolDetails(tool) : ''}
        </div>
      </article>`;
    }).join('');

    // Bind expand/collapse
    dom.toolsGrid.querySelectorAll('.tool-header').forEach(header => {
      header.addEventListener('click', () => toggleTool(header));
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleTool(header);
        }
      });
    });
  }

  function toggleTool(header) {
    const card = header.closest('.tool-card');
    const id = parseInt(card.dataset.toolId);
    const isExpanded = state.expanded.has(id);

    if (isExpanded) {
      state.expanded.delete(id);
      card.classList.remove('expanded');
      header.setAttribute('aria-expanded', 'false');
      card.querySelector('.tool-details').innerHTML = '';
    } else {
      state.expanded.add(id);
      card.classList.add('expanded');
      header.setAttribute('aria-expanded', 'true');
      const tool = NVIDIA_DATA.tools.find(t => t.id === id);
      if (tool) {
        card.querySelector('.tool-details').innerHTML = renderToolDetails(tool);
        bindDetailTabs(card);
        bindEngineTabs(card);
      }
    }
  }

  function renderToolDetails(tool) {
    const hasIntegration = tool.engineIntegration && Object.keys(tool.engineIntegration).length > 0;

    // Build tab list
    const tabs = [
      { key: 'overview', label: 'Overview', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>' },
      { key: 'usecases', label: 'Use Cases', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>' }
    ];
    if (hasIntegration) {
      tabs.push({ key: 'engines', label: 'Engine Support', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>' });
    }
    tabs.push({ key: 'details', label: 'Details', icon: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>' });

    const tabBar = tabs.map((t, i) =>
      `<button class="detail-tab-btn${i === 0 ? ' active' : ''}" data-dtab="${t.key}">${t.icon}${t.label}</button>`
    ).join('');

    // Overview panel
    const overviewPanel = `
      <div class="detail-tab-panel active" data-dtab-panel="overview">
        ${tool.description ? `<div class="detail-text">${tool.description}</div>` : ''}
        ${tool.limitations ? `
        <div class="limitations-box">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>${tool.limitations}</span>
        </div>` : ''}
        <div class="tool-links">
          ${tool.url ? `<a href="${tool.url}" class="tool-link tool-link-primary" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
            Documentation
          </a>` : ''}
          ${tool.officialPage && tool.officialPage !== tool.url ? `<a href="${tool.officialPage}" class="tool-link tool-link-secondary" target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            NVIDIA Page
          </a>` : ''}
        </div>
      </div>`;

    // Use Cases panel
    const useCaseIcons = [
      '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
    ];
    const usecasesPanel = `
      <div class="detail-tab-panel" data-dtab-panel="usecases">
        ${tool.useCases && tool.useCases.length > 0 ? `
        <ul class="use-case-list">
          ${tool.useCases.map(uc => `<li><span class="uc-icon">${useCaseIcons[0]}</span><span>${uc}</span></li>`).join('')}
        </ul>` : '<p class="detail-empty">No specific use cases documented.</p>'}
      </div>`;

    // Engine Support panel
    const enginesPanel = hasIntegration ? `
      <div class="detail-tab-panel" data-dtab-panel="engines">
        ${renderEngineTabs(tool)}
      </div>` : '';

    // Details panel (phases, team, difficulty)
    const detailsPanel = `
      <div class="detail-tab-panel" data-dtab-panel="details">
        <div class="detail-meta-grid">
          <div class="detail-meta-item">
            <div class="detail-label">Dev Phase Relevance</div>
            <div class="phase-pills">
              ${PHASES.map(p => `<span class="phase-pill${tool.phases && tool.phases.includes(p) ? ' active' : ''}">${p}</span>`).join('')}
            </div>
          </div>
          <div class="detail-meta-item">
            <div class="detail-label">Team Size Fit</div>
            <div class="team-pills">
              ${(tool.teamSizes || []).map(t => `<span class="team-pill">${t}</span>`).join('')}
            </div>
          </div>
          <div class="detail-meta-item">
            <div class="detail-label">Integration Difficulty</div>
            ${renderDifficulty(tool.difficulty)}
          </div>
        </div>
      </div>`;

    return `
      <div class="detail-tabs-container">
        <div class="detail-tab-bar">${tabBar}</div>
        ${overviewPanel}
        ${usecasesPanel}
        ${enginesPanel}
        ${detailsPanel}
      </div>
    `;
  }

  function renderDifficulty(level) {
    const l = (level || 'moderate').toLowerCase();
    const barCount = l === 'easy' ? 1 : l === 'complex' ? 3 : 2;
    const bars = [1, 2, 3].map(i =>
      `<div class="difficulty-bar${i <= barCount ? ` filled ${l}` : ''}"></div>`
    ).join('');
    return `<div class="difficulty-meter">
      <div class="difficulty-bars">${bars}</div>
      <span class="difficulty-label ${l}">${level || 'Moderate'}</span>
    </div>`;
  }

  function renderEngineTabs(tool) {
    const ei = tool.engineIntegration || {};
    const engines = [];
    if (ei.unreal) engines.push({ key: 'unreal', label: 'Unreal Engine', data: ei.unreal });
    if (ei.unity) engines.push({ key: 'unity', label: 'Unity', data: ei.unity });
    if (ei.godot) engines.push({ key: 'godot', label: 'Godot', data: ei.godot });
    if (ei.custom) engines.push({ key: 'custom', label: 'Custom Engine', data: ei.custom });

    if (engines.length === 0) return '';

    const tabs = engines.map((e, i) =>
      `<button class="engine-tab-btn${i === 0 ? ' active' : ''}" data-tab="${e.key}">${e.label}</button>`
    ).join('');

    const panels = engines.map((e, i) => {
      let content = '';
      if (e.key === 'custom') {
        content = `
          ${row('API Type', e.data.apiType)}
          ${row('Setup Complexity', renderQualityDots(e.data.setupComplexity, 5, true))}
          ${row('Docs Quality', renderQualityDots(e.data.docsQuality, 5))}
          ${e.data.notes ? row('Notes', truncate(e.data.notes, 300)) : ''}
        `;
      } else {
        content = `
          ${row('Integration Type', e.data.type)}
          ${e.data.version ? row('Version Required', e.data.version) : ''}
          ${e.data.pipeline ? row('Render Pipeline', e.data.pipeline) : ''}
          ${row('Quality', renderQualityDots(e.data.quality, 5))}
          ${e.data.setup ? row('Setup', `<span style="font-size:12px;line-height:1.5">${truncate(e.data.setup, 250)}</span>`) : ''}
          ${e.data.issues ? row('Known Issues', `<span style="font-size:12px;line-height:1.5;color:var(--q-yellow)">${truncate(e.data.issues, 250)}</span>`) : ''}
        `;
      }

      return `<div class="engine-tab-content${i === 0 ? ' active' : ''}" data-tab-panel="${e.key}">${content}</div>`;
    }).join('');

    return `<div class="engine-tabs">
      <div class="engine-tab-bar">${tabs}</div>
      ${panels}
    </div>`;
  }

  function row(label, value) {
    if (!value) return '';
    return `<div class="integration-row"><span class="integration-key">${label}</span><span class="integration-value">${value}</span></div>`;
  }

  function renderQualityDots(val, max, invert) {
    const v = parseInt(val) || 0;
    let dots = '';
    for (let i = 1; i <= max; i++) {
      let cls = '';
      if (i <= v) {
        if (invert) {
          cls = v <= 2 ? 'filled' : v <= 3 ? 'filled-yellow' : 'filled-red';
        } else {
          cls = v >= 4 ? 'filled' : v >= 2 ? 'filled-yellow' : 'filled-red';
        }
      }
      dots += `<span class="quality-dot ${cls}"></span>`;
    }
    return `<span class="quality-dots">${dots}</span>`;
  }

  function truncate(str, len) {
    if (!str) return '';
    str = String(str);
    return str.length > len ? str.substring(0, len) + '…' : str;
  }

  function bindDetailTabs(card) {
    card.querySelectorAll('.detail-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const container = btn.closest('.detail-tabs-container');
        container.querySelectorAll('.detail-tab-btn').forEach(b => b.classList.remove('active'));
        container.querySelectorAll('.detail-tab-panel').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = container.querySelector(`[data-dtab-panel="${btn.dataset.dtab}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  function bindEngineTabs(card) {
    card.querySelectorAll('.engine-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabsContainer = btn.closest('.engine-tabs');
        tabsContainer.querySelectorAll('.engine-tab-btn').forEach(b => b.classList.remove('active'));
        tabsContainer.querySelectorAll('.engine-tab-content').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        const panel = tabsContainer.querySelector(`[data-tab-panel="${btn.dataset.tab}"]`);
        if (panel) panel.classList.add('active');
      });
    });
  }

  // ---------- Events ----------
  function bindEvents() {
    // Search
    let searchTimeout;
    dom.searchInput.addEventListener('input', () => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.search = dom.searchInput.value.trim();
        state.expanded = new Set();
        renderTools();
        saveStateToHash();
      }, 200);
    });

    // Clear All
    dom.clearFilters.addEventListener('click', clearAllFilters);

    // Filter toggle dropdowns
    document.querySelectorAll('.filter-toggle').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const dropdown = btn.nextElementSibling;
        const isOpen = dropdown.classList.contains('open');

        // Close all
        document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('open'));
        document.querySelectorAll('.filter-toggle').forEach(b => b.setAttribute('aria-expanded', 'false'));

        if (!isOpen) {
          dropdown.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });

    // Close dropdowns on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.filter-dropdown').forEach(d => d.classList.remove('open'));
      document.querySelectorAll('.filter-toggle').forEach(b => b.setAttribute('aria-expanded', 'false'));
    });

    // Prevent dropdown close when clicking inside
    document.querySelectorAll('.filter-dropdown').forEach(d => {
      d.addEventListener('click', e => e.stopPropagation());
    });

    // Hash change
    window.addEventListener('hashchange', () => {
      loadStateFromHash();
      syncCheckboxes();
      updateFilterToggles();
      renderTools();
    });
  }

  // ---------- Clear Filters ----------
  function clearAllFilters() {
    clearFiltersState();
    dom.searchInput.value = '';
    state.search = '';
    state.expanded = new Set();
    syncCheckboxes();
    updateFilterToggles();
    renderTools();
    saveStateToHash();
  }

  function clearFiltersState() {
    state.filters.phase = [];
    state.filters.engine = [];
    state.filters.category = [];
    state.filters.team = [];
  }

  function syncCheckboxes() {
    document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(cb => {
      const key = cb.dataset.filterKey;
      cb.checked = state.filters[key].includes(cb.value);
    });
  }

  // ---------- URL Hash State ----------
  function saveStateToHash() {
    const params = new URLSearchParams();
    for (const [key, values] of Object.entries(state.filters)) {
      if (values.length > 0) params.set(key, values.join(','));
    }
    if (state.search) params.set('q', state.search);
    const hash = params.toString();
    history.replaceState(null, '', hash ? '#' + hash : window.location.pathname);
  }

  function loadStateFromHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const params = new URLSearchParams(hash);

    for (const key of ['phase', 'engine', 'category', 'team']) {
      const val = params.get(key);
      state.filters[key] = val ? val.split(',') : [];
    }

    const q = params.get('q');
    if (q) {
      state.search = q;
      dom.searchInput.value = q;
    }
  }

  // ---------- Stats ----------
  function updateStats() {
    dom.statTools.textContent = NVIDIA_DATA.tools.length + '+';
  }

  // Make clearAllFilters available globally for the no-results button
  window.clearAllFilters = clearAllFilters;

  // ---------- New Features Banner ----------
  function initBanner() {
    const banner = document.getElementById('newFeaturesBanner');
    const closeBtn = document.getElementById('bannerClose');
    if (banner && closeBtn) {
      closeBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
      });
    }
  }

  // ---------- Go ----------
  initTheme();
  initBanner();
  init();
})();

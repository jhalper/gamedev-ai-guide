import type { ConceptInput, EvaluationResult, ScoreCategory, CompetitorNote, MilestoneItem, InferredAssumption, ThumbsVerdict, ResourceEstimate, KnowledgeLevel } from './types';

// Competitor database (heuristic — v1)
const competitorDatabase: Record<string, CompetitorNote[]> = {
  'horror': [
    { name: 'Iron Lung', relevance: 'Contained horror with minimal assets, strong atmosphere', threat: 'Set the bar for tiny-scope horror done right', differentiation: 'Compare your mechanic novelty against this benchmark' },
    { name: 'Phasmophobia', relevance: 'Multiplayer horror phenomenon', threat: 'Dominates the "spooky with friends" space', differentiation: 'Single-player horror has a different audience lane' },
    { name: 'Lethal Company', relevance: 'Co-op horror breakout', threat: 'Massive audience expectations for horror games now', differentiation: 'Solo atmospheric horror is a distinct market from co-op scream games' },
  ],
  'puzzle': [
    { name: 'The Witness', relevance: 'Puzzle game design benchmark', threat: 'High bar for puzzle design elegance', differentiation: 'Needs a mechanical hook that The Witness does not cover' },
    { name: 'Baba Is You', relevance: 'Innovative puzzle mechanic success', threat: 'Shows that mechanical novelty can carry a game', differentiation: 'Your puzzle system needs to be as immediately graspable' },
    { name: 'Portal', relevance: 'Gold standard for puzzle + narrative', threat: 'The comparison every puzzle game faces', differentiation: 'Do not try to be Portal — find your own identity' },
  ],
  'rpg': [
    { name: "Baldur's Gate 3", relevance: 'Redefined RPG expectations', threat: 'Players now expect BG3-level depth from RPGs', differentiation: 'A solo dev RPG must find a narrow lane BG3 cannot serve' },
    { name: 'Hades', relevance: 'Showed roguelike-RPG hybrid works for small teams', threat: 'High quality bar for indie RPG combat', differentiation: 'Story-driven RPG vs. combat-driven roguelike is a real distinction' },
  ],
  'narrative adventure': [
    { name: 'What Remains of Edith Finch', relevance: 'Narrative exploration benchmark', threat: 'Emotional storytelling through environment done masterfully', differentiation: 'Your mechanical hook needs to add beyond walking and looking' },
    { name: 'Outer Wilds', relevance: 'Exploration-driven discovery game', threat: 'Extremely high design bar for knowledge-gated exploration', differentiation: 'Environmental restructuring is a distinct hook from time loops' },
    { name: 'Journey', relevance: 'Emotional exploration distilled', threat: 'Proved the concept works at a small scale', differentiation: 'Your game needs its own emotional thesis beyond "beautiful and sad"' },
  ],
  'survival': [
    { name: 'Valheim', relevance: 'Survival + exploration by small team', threat: 'Set massive expectations for indie survival games', differentiation: 'Need a strong unique hook beyond "survive and build"' },
    { name: 'Subnautica', relevance: 'Solo survival with strong narrative', threat: 'Shows survival can have excellent story integration', differentiation: 'Compare your world design ambition to this' },
  ],
  'mmorpg': [
    { name: 'World of Warcraft', relevance: 'Defines the MMORPG genre', threat: 'Billions invested, decades of content, massive team', differentiation: 'You cannot compete with this. Period.' },
    { name: 'New World', relevance: 'Amazon-backed MMO struggled at launch', threat: 'Even with massive funding, MMOs are brutally hard', differentiation: 'If Amazon struggled with an MMO, a solo dev has zero chance' },
    { name: 'Final Fantasy XIV', relevance: 'Subscription MMO success story', threat: 'Required rebuilding an entire game to succeed', differentiation: 'MMOs require dedicated server teams and years of content' },
  ],
  'simulation': [
    { name: 'Stardew Valley', relevance: 'Solo-dev simulation masterwork', threat: 'Set expectations impossibly high for solo dev sims', differentiation: 'ConcernedApe spent 4+ years and is exceptionally talented' },
  ],
  'roguelike': [
    { name: 'Hades', relevance: 'Roguelike with narrative depth', threat: 'Extremely polished, hard to compete with on feel', differentiation: 'Your run structure and progression need a distinct identity' },
    { name: 'Slay the Spire', relevance: 'Card-based roguelike that created a genre', threat: 'Spawned hundreds of imitators', differentiation: 'The deckbuilder roguelike space is extremely crowded' },
  ],
  'sandbox': [
    { name: 'Minecraft', relevance: 'The sandbox game', threat: 'Defines the genre for most players', differentiation: 'You need a mechanical identity Minecraft cannot absorb' },
  ],
};

function getCompetitors(input: ConceptInput, assumptions: InferredAssumption[]): CompetitorNote[] {
  const allText = Object.values(input).join(' ').toLowerCase();
  const competitors: CompetitorNote[] = [];
  const seen = new Set<string>();

  if (input.similarGames) {
    const mentioned = input.similarGames.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    for (const game of mentioned) {
      if (!seen.has(game.toLowerCase())) {
        competitors.push({
          name: game,
          relevance: 'Cited by developer as inspiration/comparison',
          threat: 'Direct comparison point — players will judge against this',
          differentiation: 'Must clearly articulate what makes your concept different from this game',
        });
        seen.add(game.toLowerCase());
      }
    }
  }

  for (const [genre, comps] of Object.entries(competitorDatabase)) {
    if (allText.includes(genre)) {
      for (const comp of comps) {
        if (!seen.has(comp.name.toLowerCase())) {
          competitors.push(comp);
          seen.add(comp.name.toLowerCase());
        }
      }
    }
  }

  return competitors.slice(0, 6);
}

function scoreOriginality(input: ConceptInput): ScoreCategory {
  const allText = Object.values(input).join(' ').toLowerCase();
  let score = 5;
  let commentary = '';

  const genericSignals = ['open world rpg', 'mmorpg', 'battle royale', 'survival crafting', 'zombie', 'souls-like', 'metroidvania'];
  const distinctiveSignals = ['unique mechanic', 'never been done', 'new way', 'experimental', 'no combat', 'no hud', 'unconventional'];

  for (const s of genericSignals) { if (allText.includes(s)) { score -= 1; commentary += `"${s}" is an oversaturated space. `; } }
  for (const s of distinctiveSignals) { if (allText.includes(s)) { score += 1; commentary += `Distinctive approach detected. `; } }

  if (input.keyDifferentiators && input.keyDifferentiators.length > 100) score += 1;
  if (!input.keyDifferentiators || input.keyDifferentiators.length < 30) { score -= 1; commentary += 'Weak or missing differentiators. '; }

  score = Math.max(1, Math.min(10, score));
  if (!commentary) commentary = score >= 7 ? 'Concept has genuine distinguishing characteristics.' : score >= 4 ? 'Some differentiation present but could be sharper.' : 'This reads as a genre description, not a game concept.';

  return { key: 'originality', label: 'Originality / Differentiation', score, weight: 0.15, commentary };
}

function scoreMarketClarity(input: ConceptInput): ScoreCategory {
  let score = 5;
  let commentary = '';

  if (input.intendedAudience && input.intendedAudience.length > 30) score += 1;
  if (input.monetizationApproach && input.monetizationApproach.length > 10) score += 1;
  if (input.similarGames && input.similarGames.length > 10) score += 1;
  if (!input.intendedAudience && !input.oneSentencePitch) { score -= 2; commentary += 'No audience clarity. '; }

  const allText = Object.values(input).join(' ').toLowerCase();
  if (allText.includes('everyone') || allText.includes('all gamers')) { score -= 2; commentary += '"Everyone" is not a market. '; }
  if (allText.includes('niche') || allText.includes('specific audience')) { score += 1; commentary += 'Niche awareness is a strength for positioning. '; }

  score = Math.max(1, Math.min(10, score));
  if (!commentary) commentary = score >= 7 ? 'Clear sense of who this is for and why they would buy it.' : 'Market positioning needs work.';

  return { key: 'marketClarity', label: 'Market Clarity', score, weight: 0.12, commentary };
}

function scoreAudienceFit(input: ConceptInput): ScoreCategory {
  let score = 5;
  let commentary = '';

  const allText = Object.values(input).join(' ').toLowerCase();
  if (input.intendedAudience && input.corePlayerFantasy) {
    score += 1;
    commentary += 'Player fantasy and audience are both defined. ';
  }
  if (allText.includes('niche') && allText.includes('core')) { score += 1; }
  if ((allText.includes('mmo') || allText.includes('multiplayer')) && (allText.includes('solo dev') || allText.includes('1 solo'))) {
    score -= 3;
    commentary += 'Multiplayer audience expects polish and infrastructure a solo dev cannot provide. ';
  }

  score = Math.max(1, Math.min(10, score));
  if (!commentary) commentary = score >= 6 ? 'Reasonable audience-concept alignment.' : 'Audience fit is unclear or mismatched.';

  return { key: 'audienceFit', label: 'Audience Fit', score, weight: 0.1, commentary };
}

function scoreProductionFeasibility(input: ConceptInput): ScoreCategory {
  let score = 6;
  let commentary = '';
  const allText = Object.values(input).join(' ').toLowerCase();

  const hardSignals = ['mmo', 'multiplayer', 'cross-play', 'aaa', 'ray tracing', 'destructible terrain at scale', 'procedural world', 'open world', '100+ players'];
  const easySignals = ['contained', 'single room', 'focused', 'minimalist', 'simple', 'compact', 'short-form', 'low-fi'];

  const hardMatches: string[] = [];
  for (const s of hardSignals) { if (allText.includes(s)) { score -= 1; hardMatches.push(s); } }
  // Check photorealistic separately to avoid matching negations
  if (/(?<!not |not trying to be )photorealistic/.test(allText)) { score -= 1; hardMatches.push('photorealistic'); }
  for (const s of easySignals) { if (allText.includes(s)) { score += 1; } }
  if (hardMatches.length > 3) {
    commentary += `Multiple high-difficulty signals detected (${hardMatches.slice(0, 3).join(', ')}, and ${hardMatches.length - 3} more). This scope is far beyond solo or small-team capability. `;
  } else if (hardMatches.length > 0) {
    commentary += `Production complexity flags: ${hardMatches.join(', ')}. `;
  }

  const hours = parseInt(input.availableWeeklyHours) || 0;
  if (hours > 0 && hours < 15) { score -= 1; commentary += 'Very limited weekly hours. '; }
  if (hours >= 30) { score += 1; }

  const teamSize = input.teamSize?.toLowerCase() || '';
  if ((teamSize.includes('1') || teamSize.includes('solo')) && score < 5) {
    commentary += 'Solo developer with high production demands — this is a red flag. ';
  }

  score = Math.max(1, Math.min(10, score));
  if (!commentary) commentary = score >= 7 ? 'Production scope aligns with available resources.' : 'Scope-to-resource mismatch detected.';

  return { key: 'productionFeasibility', label: 'Production Feasibility', score, weight: 0.18, commentary };
}

function scoreContentBurden(input: ConceptInput): ScoreCategory {
  let score = 6;
  let commentary = '';
  const allText = Object.values(input).join(' ').toLowerCase();

  if (allText.includes('thousands of items') || allText.includes('hundreds of quests') || allText.includes('dozens of zones')) {
    score = 1;
    commentary = 'Content volume described requires a large team and years of production. ';
  } else if (allText.includes('live service') || allText.includes('content updates')) {
    score = 2;
    commentary = 'Live-service content demands are unsustainable for a small team. ';
  } else if (allText.includes('procedural') && !allText.includes('mmo')) {
    score += 1;
    commentary += 'Procedural content can reduce burden if designed well. ';
  }

  if (allText.includes('8-10') || allText.includes('contained') || allText.includes('short')) {
    score += 2;
    commentary += 'Contained content scope is realistic. ';
  }

  score = Math.max(1, Math.min(10, score));
  if (!commentary) commentary = 'Content production requirements seem moderate.';

  return { key: 'contentBurden', label: 'Content Burden', score, weight: 0.12, commentary };
}

function scoreTechnicalRisk(input: ConceptInput): ScoreCategory {
  let score = 6;
  let commentary = '';
  const allText = Object.values(input).join(' ').toLowerCase();

  const highRisk = ['networking', 'server infrastructure', 'cross-platform', 'anti-cheat', 'database scalability', 'destructible terrain at scale', 'massive multiplayer', 'procedural world restructuring'];
  const medRisk = ['procedural', 'dynamic', 'real-time', 'shader', 'physics', 'ai behavior'];
  const lowRisk = ['simple', 'static', 'minimal', 'contained'];

  const techMatches: string[] = [];
  for (const s of highRisk) { if (allText.includes(s)) { score -= 1.5; techMatches.push(s); } }
  for (const s of medRisk) { if (allText.includes(s)) { score -= 0.5; } }
  for (const s of lowRisk) { if (allText.includes(s)) { score += 0.5; } }
  if (techMatches.length > 3) {
    commentary += `Severe technical risk: ${techMatches.slice(0, 3).join(', ')}, and ${techMatches.length - 3} more high-risk systems. Each one is a project unto itself. `;
  } else if (techMatches.length > 0) {
    commentary += `Technical challenges: ${techMatches.join(', ')}. `;
  }

  score = Math.max(1, Math.min(10, Math.round(score)));
  if (!commentary) commentary = score >= 7 ? 'Technical risks are manageable.' : 'Notable technical challenges that need prototyping early.';

  return { key: 'technicalRisk', label: 'Technical Risk', score, weight: 0.12, commentary };
}

function scoreMVPClarity(input: ConceptInput): ScoreCategory {
  let score = 5;
  let commentary = '';

  if (input.nonNegotiableFeatures && input.nonNegotiableFeatures.length > 20) { score += 1; commentary += 'Non-negotiable features are defined. '; }
  if (input.featuresThatCanBeCut && input.featuresThatCanBeCut.length > 20) { score += 2; commentary += 'Cut list exists — this shows production maturity. '; }
  if (input.desiredTimeToPrototype) { score += 1; }
  if (input.desiredTimeToMVP) { score += 1; }

  const allText = Object.values(input).join(' ').toLowerCase();
  if (allText.includes('non-negotiable') && (allText.match(/,/g) || []).length > 6) {
    score -= 2;
    commentary += 'Too many non-negotiable features. If everything is non-negotiable, nothing is. ';
  }

  score = Math.max(1, Math.min(10, score));
  if (!commentary) commentary = score >= 7 ? 'Clear sense of what the MVP is.' : 'MVP definition needs tightening.';

  return { key: 'mvpClarity', label: 'MVP Clarity', score, weight: 0.09, commentary };
}

function scoreHumanCreativeDistinctiveness(input: ConceptInput): ScoreCategory {
  let score = 5;
  let commentary = '';

  if (input.humanCreativeEssence && input.humanCreativeEssence.length > 50) {
    score += 2;
    commentary += 'Clear articulation of what must remain human-led. ';
  }
  if (input.humanCreativeEssence && input.humanCreativeEssence.length > 100) {
    score += 1;
    commentary += 'Strong creative vision statement. ';
  }
  if (!input.humanCreativeEssence || input.humanCreativeEssence.length < 20) {
    score -= 2;
    commentary += 'No clear human creative thesis. What makes this YOUR game? ';
  }

  const allText = Object.values(input).join(' ').toLowerCase();
  if (allText.includes('personal') || allText.includes('artistic statement') || allText.includes('creative voice')) {
    score += 1;
    commentary += 'Personal creative investment is evident. ';
  }

  score = Math.max(1, Math.min(10, score));
  if (!commentary) commentary = 'Human creative distinctiveness is moderate.';

  return { key: 'humanCreative', label: 'Human Creative Distinctiveness', score, weight: 0.12, commentary };
}

function generateMVPList(input: ConceptInput): string[] {
  const mvp: string[] = [];

  if (input.nonNegotiableFeatures) {
    const features = input.nonNegotiableFeatures.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    mvp.push(...features.map(f => `Core: ${f}`));
  }

  mvp.push('Single platform only (cut cross-platform for MVP)');
  mvp.push('Minimal settings/options menu');
  mvp.push('One complete playthrough path before branching');

  if (input.coreGameplayLoop) {
    mvp.push(`Prototype the core loop: ${input.coreGameplayLoop.slice(0, 80)}...`);
  }

  return mvp.slice(0, 8);
}

function generateCutList(input: ConceptInput): string[] {
  const cuts: string[] = [];

  if (input.featuresThatCanBeCut) {
    const features = input.featuresThatCanBeCut.split(/[,;]/).map(s => s.trim()).filter(Boolean);
    cuts.push(...features);
  }

  const allText = Object.values(input).join(' ').toLowerCase();
  if (allText.includes('cross-play') || allText.includes('cross-platform')) cuts.push('Cross-platform play (ship on one platform first)');
  if (allText.includes('multiplayer') && allText.includes('single')) cuts.push('Multiplayer mode (validate single-player core first)');
  if (allText.includes('photo mode')) cuts.push('Photo mode (post-launch addition)');
  if (allText.includes('achievement')) cuts.push('Achievement system (add after core is validated)');
  if (allText.includes('weather')) cuts.push('Dynamic weather system (cosmetic, not gameplay-critical)');
  if (allText.includes('pvp') && allText.includes('pve')) cuts.push('PvP mode (focus on PvE loop first)');

  return Array.from(new Set(cuts)).slice(0, 8);
}

function generateMilestones(input: ConceptInput): MilestoneItem[] {
  const proto = input.desiredTimeToPrototype || '2-3 months';
  const mvp = input.desiredTimeToMVP || '6-12 months';

  return [
    {
      phase: 'Prototype',
      duration: proto,
      deliverables: [
        'Core mechanic playable',
        'One complete gameplay loop',
        'Basic visual direction established',
        'Internal playtest with 3-5 people',
      ],
    },
    {
      phase: 'Vertical Slice',
      duration: '1-2 months after prototype',
      deliverables: [
        'One polished segment at target quality',
        'Audio direction established',
        'Performance baseline on target hardware',
        'External playtest with 10-15 people',
      ],
    },
    {
      phase: 'MVP / Early Access',
      duration: mvp,
      deliverables: [
        'Minimum complete experience (start to finish)',
        'Core features functional',
        'Store page and marketing materials',
        'Bug-free critical path',
      ],
    },
    {
      phase: 'Polish & Launch',
      duration: '2-3 months after MVP',
      deliverables: [
        'All reported bugs fixed',
        'Performance optimization pass',
        'Accessibility features',
        'Launch marketing push',
      ],
    },
  ];
}

// ===== NEW: Resource estimation =====

function estimateResources(input: ConceptInput, scores: ScoreCategory[]): ResourceEstimate {
  const allText = Object.values(input).join(' ').toLowerCase();
  const feasScore = scores.find(s => s.key === 'productionFeasibility')?.score || 5;
  const contentScore = scores.find(s => s.key === 'contentBurden')?.score || 5;
  const techScore = scores.find(s => s.key === 'technicalRisk')?.score || 5;

  // Parse developer experience
  const devBg = input.developerBackground?.toLowerCase() || '';
  const hasYears = devBg.match(/(\d+)\s*years?/);
  const yearsExp = hasYears ? parseInt(hasYears[1]) : 0;
  const isHobbyist = devBg.includes('hobby') || devBg.includes('game jam') || devBg.includes('learning');
  const hasShipped = devBg.includes('shipped') || devBg.includes('released') || devBg.includes('published');

  // Knowledge level
  let knowledgeLevel: KnowledgeLevel;
  let knowledgeDescription: string;

  const isMMO = allText.includes('mmo') || allText.includes('massively multiplayer');
  const isMultiplayer = (allText.includes('multiplayer') || allText.includes('co-op') || allText.includes('pvp')) && !allText.includes('single-player');
  const isOpenWorld = allText.includes('open world') && !allText.includes('not open world');
  // Avoid matching negations like "not photorealistic"
  const isAAA = allText.includes('aaa') || (/(?<!not |not trying to be )photorealistic/.test(allText)) || allText.includes('ray tracing');

  if ((isMMO || (isAAA && isOpenWorld)) && (yearsExp < 5 || !hasShipped)) {
    knowledgeLevel = 'delusional';
    knowledgeDescription = 'This project requires deep expertise in systems you likely have never encountered professionally. We are talking about networking engineers, database architects, server infrastructure, anti-cheat systems, and live-ops teams. You are not ready for this. Nobody is ready for this solo.';
  } else if (isMultiplayer || isOpenWorld || isAAA) {
    knowledgeLevel = 'expert';
    knowledgeDescription = 'Requires 7+ years of professional game development experience across multiple shipped titles. Deep expertise in engine architecture, optimization, and the specific technical domain of your core systems.';
  } else if (feasScore <= 4 || techScore <= 4) {
    knowledgeLevel = 'advanced';
    knowledgeDescription = 'Requires 3-5 years of focused game development experience with at least one shipped title. Solid understanding of your target engine, asset pipeline, and the specific genre conventions.';
  } else if (feasScore >= 7 && contentScore >= 6) {
    knowledgeLevel = 'beginner-friendly';
    knowledgeDescription = 'Achievable by a motivated developer with 6-12 months of engine experience and a willingness to learn. Scope is tight enough that you can figure things out as you go.';
  } else {
    knowledgeLevel = 'intermediate';
    knowledgeDescription = 'Requires 1-3 years of game development experience, comfort with your target engine, and basic skills in the relevant domains (art, audio, programming). Having completed at least a few game jams helps.';
  }

  // Reuse scope flags computed above for budget/time/team estimates
  let budgetRange: string;
  let budgetDescription: string;

  if (isMMO) {
    budgetRange = '$5M - $50M+';
    budgetDescription = 'MMOs cost tens of millions of dollars to build and require ongoing server costs of $50K-$200K/month just to keep the lights on. Your $5K budget would cover approximately two weeks of a single server engineer.';
  } else if (isAAA && (isOpenWorld || isMultiplayer)) {
    budgetRange = '$1M - $10M+';
    budgetDescription = 'AAA-quality open worlds or multiplayer infrastructure require significant investment in talent, tools, and infrastructure. This is publisher-deal territory.';
  } else if (isMultiplayer) {
    budgetRange = '$100K - $500K';
    budgetDescription = 'Multiplayer games need server infrastructure, networking, and significantly more QA than single-player. Even "simple" multiplayer adds 3-5x complexity.';
  } else if (feasScore >= 7 && contentScore >= 6) {
    budgetRange = '$0 - $5K';
    budgetDescription = 'This can be built on sweat equity with minimal external costs. Budget mainly for asset store purchases, sound effects, and marketing materials.';
  } else if (feasScore >= 5) {
    budgetRange = '$5K - $25K';
    budgetDescription = 'Budget for freelance help in your weak areas (usually art or audio), marketing, and store listing fees. This is achievable with savings or a small grant.';
  } else {
    budgetRange = '$25K - $100K';
    budgetDescription = 'This scope needs either significant personal savings, a publisher advance, or grant funding. Consider whether the scope could be reduced to a more affordable range.';
  }

  // Time estimate
  let timeEstimate: string;
  let timeDescription: string;

  if (isMMO) {
    timeEstimate = '5 - 10+ years';
    timeDescription = 'Even well-funded studios take 5-7 years to build an MMO. Solo? You will be in a retirement home before this ships. And that is being generous.';
  } else if (isAAA && isOpenWorld) {
    timeEstimate = '3 - 7 years';
    timeDescription = 'Open-world AAA games take large teams years to complete. Scaling this down for a small team means either drastically cutting scope or accepting a very long development cycle.';
  } else if (feasScore <= 3) {
    timeEstimate = '3 - 5 years';
    timeDescription = 'The scope described, even with aggressive cuts, will take years of dedicated full-time work. Most projects of this scope are abandoned within the first year.';
  } else if (feasScore <= 5) {
    timeEstimate = '12 - 24 months';
    timeDescription = 'Realistic timeline with discipline and prioritization. Expect the first half to feel productive and the second half to feel like an endless slog of polish and bug fixing.';
  } else if (feasScore >= 7) {
    timeEstimate = '3 - 8 months';
    timeDescription = 'Tight scope means a realistic development cycle. The danger here is feature creep — every "small addition" adds weeks.';
  } else {
    timeEstimate = '8 - 18 months';
    timeDescription = 'A reasonable timeline if you maintain focus and resist the urge to expand scope. Build the core, ship it, then add features based on player feedback.';
  }

  // Team estimate
  let teamSize: string;
  let teamDescription: string;

  if (isMMO) {
    teamSize = '50 - 200+ people';
    teamDescription = 'MMOs require dedicated teams for networking, server infrastructure, content, QA, community management, and live-ops. One person building an MMO is like one person building a skyscraper with a hammer.';
  } else if (isAAA && (isOpenWorld || isMultiplayer)) {
    teamSize = '15 - 50 people';
    teamDescription = 'AAA scope requires specialized roles: engineers, artists, designers, QA, producers. Even "small" AAA teams are 15+ people working full-time.';
  } else if (isMultiplayer) {
    teamSize = '3 - 10 people';
    teamDescription = 'Multiplayer adds the need for dedicated networking/backend engineers and more QA. A solo dev multiplayer game is a recipe for burnout and broken netcode.';
  } else if (feasScore >= 7) {
    teamSize = '1 person';
    teamDescription = 'This is genuinely achievable solo. One focused developer with discipline can ship this. Just do not let scope creep turn it into a team-sized project.';
  } else if (feasScore >= 5) {
    teamSize = '1 - 3 people';
    teamDescription = 'Achievable solo but would benefit from help in specialized areas. A part-time artist or sound designer would significantly improve quality without adding management overhead.';
  } else {
    teamSize = '3 - 8 people';
    teamDescription = 'This scope really needs a small dedicated team or a very long solo development cycle. Consider finding collaborators or dramatically reducing scope.';
  }

  return {
    knowledgeLevel,
    knowledgeDescription,
    budgetRange,
    budgetDescription,
    timeEstimate,
    timeDescription,
    teamSize,
    teamDescription,
  };
}

// ===== NEW: Roast commentary =====

function generateRoast(input: ConceptInput, scores: ScoreCategory[], verdict: ThumbsVerdict, resources: ResourceEstimate): string {
  const allText = Object.values(input).join(' ').toLowerCase();
  const devBg = input.developerBackground?.toLowerCase() || '';
  const hasYears = devBg.match(/(\d+)\s*years?/);
  const yearsExp = hasYears ? parseInt(hasYears[1]) : 0;
  const isHobbyist = devBg.includes('hobby') || devBg.includes('game jam') || devBg.includes('learning');
  const hasShipped = devBg.includes('shipped') || devBg.includes('released') || devBg.includes('published');

  const isMMO = allText.includes('mmo') || allText.includes('massively multiplayer');
  const isOpenWorld = allText.includes('open world');
  const isSoloDevBigProject = (input.teamSize?.toLowerCase().includes('solo') || input.teamSize?.toLowerCase().includes('1')) && (isMMO || isOpenWorld);
  const hasAbsurdTimeline = isMMO && allText.includes('month');
  const hasTinyBudget = isMMO && (allText.includes('$5,000') || allText.includes('$5000') || allText.includes('$2,000'));
  const wantsEverything = (input.nonNegotiableFeatures?.split(',').length || 0) > 5;
  const totalScore = scores.reduce((sum, s) => sum + s.score * s.weight, 0) / scores.reduce((sum, s) => sum + s.weight, 0);

  const roasts: string[] = [];

  // Delusional scope roasts
  if (isMMO && !hasShipped) {
    roasts.push("You want to build an MMO. Solo. With game jam experience. I genuinely admire the confidence. It's the kind of confidence usually reserved for people who think they can wrestle a bear because they once won a pillow fight.");
  } else if (isMMO && yearsExp < 5) {
    roasts.push("Building an MMO is like running a small country — you need infrastructure, an economy, a military (anti-cheat), diplomats (community managers), and a constant supply chain of content. You have a laptop and a dream.");
  }

  if (isSoloDevBigProject && !isMMO) {
    roasts.push("One person. Open world. I am not going to sugarcoat this: you are describing a project that employs entire studios of 50+ people. But sure, you will do it in your spare time between dinner and bedtime.");
  }

  if (hasAbsurdTimeline) {
    roasts.push("You want an MMO prototype in 2 months? World of Warcraft took 4 years to develop with a team of 60+ seasoned professionals and millions in funding. But hey, maybe you are just built different.");
  }

  if (hasTinyBudget) {
    roasts.push(`Your budget of ${input.budgetRange} for an MMO is delightful. That would not cover the coffee budget for the networking team at most studios. You might be able to rent a single server for about three months, though. Progress!`);
  }

  // Inexperience roasts
  if (isHobbyist && (isMMO || isOpenWorld)) {
    roasts.push("\"Hobbyist experience\" building an open-world or MMO game is like saying you are a hobbyist architect and you would like to design a space station. The skills are not just different in degree — they are different in kind.");
  }

  if (yearsExp === 0 && !hasShipped) {
    if (totalScore < 5) {
      roasts.push("No shipped games, no listed experience, and a concept that would challenge a veteran studio. The good news is that you have identified what you want to build. The bad news is that you have about 3-5 years of skill development between here and being ready to attempt it.");
    } else {
      roasts.push("No shipped titles yet — which is fine, everyone starts somewhere. But your first game should not be your dream game. Ship something small and ugly first. Learn where all the hidden traps are. Then tackle this.");
    }
  }

  // Scope delusion roasts
  if (wantsEverything) {
    roasts.push("Your non-negotiable feature list reads like a studio pitch deck, not a solo dev plan. When everything is non-negotiable, you are not making a game — you are writing a wish list to Santa. And Santa does not ship games either.");
  }

  if (allText.includes('cross-play') && allText.includes('solo')) {
    roasts.push("Cross-play as a solo developer. Just to be clear, cross-play means building and maintaining separate platform SDKs, certification processes with Sony/Microsoft/Nintendo, and platform-specific networking layers. Each one is a full-time job. But go off.");
  }

  if (allText.includes('battle pass') && (isHobbyist || yearsExp < 3)) {
    roasts.push("A battle pass requires a live-service infrastructure, a content pipeline that ships updates on a regular schedule, and a player base large enough to justify the investment. You need to ship the game first. Then get players. Then retain players. Then maybe — maybe — consider monetization complexity.");
  }

  // Genre-specific roasts
  if (allText.includes('like minecraft') || allText.includes('like fortnite') || allText.includes('next minecraft')) {
    roasts.push("\"Like Minecraft/Fortnite\" — these games employ hundreds of developers, have billions in revenue, and years of iteration. Saying your game will be like them is like saying your lemonade stand will be like Coca-Cola.");
  }

  // Positive roasts (for good concepts)
  if (verdict === 'up' && totalScore >= 7) {
    roasts.push("Alright, I have to admit — this does not suck as much as most things I see. You have a scoped concept, relevant experience, and realistic expectations. Do not let that go to your head. Ship the prototype before you start planning the sequel.");
  } else if (verdict === 'up') {
    roasts.push("This is one of the less delusional concepts I have reviewed. Which, in this industry, is practically a compliment. The scope is realistic, the hook has potential. Now comes the hard part: actually making it.");
  }

  if (verdict === 'sideways') {
    roasts.push("This concept is in the \"interesting but problematic\" category. There is a kernel of something here — buried under scope creep, unclear positioning, and a timeline that assumes everything goes perfectly. It never goes perfectly.");
  }

  // Fallback
  if (roasts.length === 0) {
    if (verdict === 'down') {
      roasts.push("Look, not every idea is meant to be a game. Some ideas are meant to be lessons in humility. This one might be the latter. Take the feedback, learn from it, and come back with something scoped to reality.");
    } else {
      roasts.push("You have an idea and the desire to make it real. That puts you ahead of 90% of people who talk about making games. Whether you are ahead of the 10% who actually ship depends entirely on what you do next.");
    }
  }

  return roasts.join('\n\n');
}

// ===== NEW: Verdict system =====

function determineVerdict(scores: ScoreCategory[], allText: string): { verdict: ThumbsVerdict; reasoning: string } {
  const total = scores.reduce((sum, s) => sum + s.score * s.weight, 0) / scores.reduce((sum, s) => sum + s.weight, 0);

  const feasibility = scores.find(s => s.key === 'productionFeasibility')?.score || 5;
  const content = scores.find(s => s.key === 'contentBurden')?.score || 5;
  const tech = scores.find(s => s.key === 'technicalRisk')?.score || 5;
  const originality = scores.find(s => s.key === 'originality')?.score || 5;

  // Thumbs down — your game sucks
  if (feasibility <= 2 || content <= 2) {
    return {
      verdict: 'down',
      reasoning: 'Production requirements fundamentally exceed available resources. This concept cannot be built as described. Time to wake up, or at least drastically rescope.',
    };
  }

  if (total < 4) {
    return {
      verdict: 'down',
      reasoning: 'Not enough differentiation, market clarity, or production viability. This needs fundamental rethinking — not iteration, not polish, a complete restart.',
    };
  }

  // Thumbs up — your game might not suck
  if (total >= 6.5 && feasibility >= 5) {
    return {
      verdict: 'up',
      reasoning: 'This concept has real potential. The hook is clear, scope is realistic, and you might actually ship this. Build the prototype and prove it works.',
    };
  }

  // Pivot — interesting but broken
  if (originality >= 7 && feasibility <= 4) {
    return {
      verdict: 'pivot',
      reasoning: 'The creative core has genuine potential, but the scope is going to kill it. Find the smallest possible version of this idea that still captures the magic. Then build that.',
    };
  }

  // Sideways — meh
  return {
    verdict: 'sideways',
    reasoning: 'There are interesting elements here, but the concept needs significant work. Sharpen the hook, narrow the scope, and figure out what makes this worth a player\'s time and money.',
  };
}

export function evaluateConcept(input: ConceptInput, assumptions: InferredAssumption[]): EvaluationResult {
  const allText = Object.values(input).join(' ').toLowerCase();

  // Build scores
  const scores: ScoreCategory[] = [
    scoreOriginality(input),
    scoreMarketClarity(input),
    scoreAudienceFit(input),
    scoreProductionFeasibility(input),
    scoreContentBurden(input),
    scoreTechnicalRisk(input),
    scoreMVPClarity(input),
    scoreHumanCreativeDistinctiveness(input),
  ];

  const weightedTotal = scores.reduce((sum, s) => sum + s.score * s.weight, 0) / scores.reduce((sum, s) => sum + s.weight, 0);

  const competitors = getCompetitors(input, assumptions);
  const milestones = generateMilestones(input);
  const { verdict, reasoning } = determineVerdict(scores, allText);
  const resources = estimateResources(input, scores);
  const roastCommentary = generateRoast(input, scores, verdict, resources);

  // Generate written assessments
  const feasScore = scores.find(s => s.key === 'productionFeasibility')?.score || 5;
  const origScore = scores.find(s => s.key === 'originality')?.score || 5;
  const contentScore = scores.find(s => s.key === 'contentBurden')?.score || 5;
  const humanScore = scores.find(s => s.key === 'humanCreative')?.score || 5;

  let executiveVerdict: string;
  if (verdict === 'down') {
    executiveVerdict = `This concept, as currently described, is not viable for production. ${reasoning}`;
  } else if (verdict === 'up') {
    executiveVerdict = `This concept has enough signal to move forward with prototyping. ${input.workingTitle || 'This project'} shows genuine creative promise and the scope-to-resource ratio is manageable. The next step is building the core mechanic prototype and testing it with real players.`;
  } else if (verdict === 'pivot') {
    executiveVerdict = `There is something worth pursuing here, but the current shape is wrong. ${reasoning}`;
  } else {
    executiveVerdict = `This concept has interesting elements but needs significant rework before committing production time. ${reasoning}`;
  }

  const conceptSignal = origScore >= 7
    ? `Strong concept signal. ${input.workingTitle || 'This game'} has a hook that is not easily confused with existing games. The core idea is distinctive enough to warrant testing.`
    : origScore >= 4
    ? `Moderate concept signal. There is a game idea here, but the hook needs sharpening. What specifically makes this different from the games you listed as similar? That answer needs to be immediate and obvious.`
    : `Weak concept signal. This reads as a genre description more than a specific game concept. "A ${input.genre || 'game'}" is not a pitch — the pitch is what makes THIS one different from every other one.`;

  const humanCreativeEdge = humanScore >= 7
    ? `The human creative vision is clear and compelling. ${input.humanCreativeEssence ? 'The stated creative essence — ' + input.humanCreativeEssence.slice(0, 100) + ' — is the kind of thing that cannot be replicated by tools or templates.' : 'There is a distinct creative voice here.'}`
    : humanScore >= 4
    ? 'The human creative element is present but could be stronger. What part of this game could ONLY come from you? That answer should be at the center of every design decision.'
    : 'The creative thesis is thin. This concept does not yet articulate what makes it a personal creative statement rather than a genre exercise.';

  const marketPotential = (() => {
    const mScore = scores.find(s => s.key === 'marketClarity')?.score || 5;
    if (mScore >= 7) return `Market positioning is clear. The audience is defined, comparables exist, and the price-to-value proposition is reasonable.`;
    if (mScore >= 4) return `Market positioning needs work. "Who is this for?" has a vague answer. Narrow the audience to a specific group with proven purchasing behavior.`;
    return `Market positioning is unclear. The concept does not articulate who buys this, why, or how they find it. This is a creative project looking for an audience rather than a product built for one.`;
  })();

  const competitorPressure = competitors.length > 0
    ? `${competitors.length} relevant competitors or comparables identified. The space is ${competitors.length >= 5 ? 'crowded' : competitors.length >= 3 ? 'competitive' : 'navigable'}. Your differentiation must be obvious from the first screenshot and the first 30 seconds of gameplay.`
    : 'No direct competitors identified from the description — this could mean genuine novelty or poor market awareness. Research the space before assuming you are first.';

  const scopeRisk = feasScore >= 7
    ? 'Scope risk is low. The project appears achievable with stated resources and timeline.'
    : feasScore >= 4
    ? 'Scope risk is moderate. Some features will need to be cut to hit the timeline. Prioritize ruthlessly.'
    : 'Scope risk is critical. The described project significantly exceeds what the stated team, budget, and timeline can deliver. This needs radical scoping before any production work begins.';

  const teamSizeStr = input.teamSize?.toLowerCase() || '';
  const isSolo = teamSizeStr.includes('1') || teamSizeStr.includes('solo') || teamSizeStr === '';

  const soloViability = isSolo
    ? feasScore >= 6
      ? 'Solo viability: Possible. The scope is tight enough that one developer can ship this with discipline and prioritization. Key risk: burnout over a long production cycle.'
      : feasScore >= 4
      ? 'Solo viability: Difficult. This is achievable solo but will require significant cuts to the current vision. Be honest about what one person can actually build and polish.'
      : 'Solo viability: Not viable as described. This concept requires capabilities, content volume, or infrastructure that one person cannot provide. Either radically reduce scope or find collaborators.'
    : feasScore >= 5
    ? 'Solo viability: Not applicable (team project), but the scope seems reasonable for the described team.'
    : 'Solo viability: Even with the described team, this scope is concerning.';

  const smallTeamViability = feasScore >= 7
    ? 'Small-team viability: Strong. A team of 2-4 could ship this within the stated timeline with appropriate specialization.'
    : feasScore >= 4
    ? 'Small-team viability: Possible with cuts. A small team (2-5) could handle this if scope is reduced and roles are clear.'
    : 'Small-team viability: Challenging even for a small team. The described scope typically requires 10+ developers or a much longer timeline.';

  const recommendedMVP = generateMVPList(input);
  const immediateCuts = generateCutList(input);

  const unknownsToValidate: string[] = [];
  if (origScore < 7) unknownsToValidate.push('Validate the core hook with 10+ players who are NOT your friends');
  if (feasScore < 6) unknownsToValidate.push('Build the technically riskiest system first to confirm it is achievable');
  if (contentScore < 6) unknownsToValidate.push('Estimate actual content production time for one complete unit of content');
  unknownsToValidate.push('Test the core loop in isolation — does it feel good without any content wrapping?');
  unknownsToValidate.push('Research your top 3 competitors deeply — play their games, read their reviews, study their Steam pages');
  if (allText.includes('procedural') || allText.includes('dynamic')) unknownsToValidate.push('Prototype procedural systems early — they often feel worse than hand-crafted content');
  if (allText.includes('monetization') || allText.includes('free-to-play')) unknownsToValidate.push('Validate willingness-to-pay with your target audience before building monetization systems');

  return {
    executiveVerdict,
    conceptSignal,
    humanCreativeEdge,
    marketPotential,
    competitorPressure,
    scopeRisk,
    soloViability,
    smallTeamViability,
    recommendedMVP,
    immediateCuts,
    unknownsToValidate: unknownsToValidate.slice(0, 8),
    goRecommendation: verdict,
    goRecommendationReasoning: reasoning,
    roastCommentary,
    scores,
    weightedTotal,
    competitors,
    milestones,
    resources,
  };
}

import type { ConceptInput, InferredAssumption, ConfidenceLevel } from './types';

// Genre inference keywords
const genreSignals: Record<string, string[]> = {
  'horror': ['horror', 'scary', 'dread', 'fear', 'creepy', 'disturbing', 'unsettling', 'terrifying', 'dark', 'nightmare'],
  'puzzle': ['puzzle', 'solve', 'logic', 'mechanic', 'repair', 'fix', 'brain', 'riddle'],
  'rpg': ['rpg', 'level up', 'quest', 'loot', 'character build', 'stats', 'classes', 'dungeon', 'inventory'],
  'action': ['combat', 'fight', 'shoot', 'weapon', 'battle', 'attack', 'dodge', 'fast-paced'],
  'platformer': ['jump', 'platform', 'side-scrolling', '2d', 'run and jump', 'wall jump'],
  'simulation': ['simulate', 'manage', 'build', 'economy', 'tycoon', 'resource management'],
  'survival': ['survive', 'survival', 'craft', 'gather', 'hunger', 'thirst', 'base building'],
  'narrative adventure': ['story', 'narrative', 'explore', 'atmospheric', 'emotional', 'choice', 'walking sim'],
  'strategy': ['strategy', 'tactical', 'turn-based', 'real-time strategy', 'rts', 'army', 'command'],
  'roguelike': ['roguelike', 'procedural', 'permadeath', 'run-based', 'roguelite', 'each run', 'deckbuilder', 'deck builder', 'deck of'],
  'racing': ['race', 'racing', 'speed', 'cars', 'vehicles', 'track'],
  'fighting': ['fighting', 'versus', 'combo', 'arena', 'martial'],
  'sandbox': ['sandbox', 'open world', 'freedom', 'emergent', 'player-driven'],
  'mmorpg': ['mmo', 'massively multiplayer', 'persistent world', 'mmorpg', 'online world'],
};

const platformSignals: Record<string, string[]> = {
  'PC (Steam)': ['steam', 'pc', 'keyboard', 'mouse', 'desktop'],
  'Console': ['console', 'playstation', 'xbox', 'switch', 'nintendo', 'controller'],
  'Mobile': ['mobile', 'phone', 'tablet', 'ios', 'android', 'touch'],
  'VR': ['vr', 'virtual reality', 'headset', 'quest', 'oculus', 'immersive'],
  'Web': ['browser', 'web', 'html5', 'webgl'],
};

const audienceSignals: Record<string, string[]> = {
  'Core gamers 18-35': ['hardcore', 'core gamer', 'competitive', 'challenging', 'skill-based'],
  'Casual gamers': ['casual', 'relaxing', 'cozy', 'family-friendly', 'accessible', 'pick up and play'],
  'Horror enthusiasts 20-40': ['horror', 'creepy', 'disturbing', 'atmospheric dread', 'unsettling'],
  'Narrative/art game audience 25-45': ['emotional', 'atmospheric', 'art game', 'contemplative', 'narrative', 'story-driven'],
  'Indie game enthusiasts': ['indie', 'unique mechanic', 'experimental', 'niche'],
  'Competitive players': ['pvp', 'ranked', 'esports', 'competitive', 'multiplayer'],
  'Children/families': ['kids', 'children', 'family', 'educational', 'cartoon'],
};

function matchSignals(text: string, signals: Record<string, string[]>): { match: string; confidence: ConfidenceLevel; count: number }[] {
  const lower = text.toLowerCase();
  const results: { match: string; confidence: ConfidenceLevel; count: number }[] = [];

  for (const [category, keywords] of Object.entries(signals)) {
    let count = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) count++;
    }
    if (count > 0) {
      const confidence: ConfidenceLevel = count >= 3 ? 'high' : count >= 2 ? 'medium' : 'low';
      results.push({ match: category, confidence, count });
    }
  }

  return results.sort((a, b) => b.count - a.count);
}

function inferMonetization(input: ConceptInput): { value: string; confidence: ConfidenceLevel } {
  const allText = Object.values(input).join(' ').toLowerCase();

  if (allText.includes('free-to-play') || allText.includes('f2p') || allText.includes('battle pass') || allText.includes('cosmetic shop')) {
    return { value: 'Free-to-play with microtransactions', confidence: 'high' };
  }
  if (allText.includes('mmo') || allText.includes('live service') || allText.includes('subscription')) {
    return { value: 'Subscription or live-service model', confidence: 'medium' };
  }
  if (allText.includes('short') || allText.includes('small') || allText.includes('itch.io')) {
    return { value: 'Premium purchase, $5-15 range', confidence: 'medium' };
  }
  if (allText.includes('premium') || allText.includes('single-player') || allText.includes('narrative')) {
    return { value: 'Premium purchase, $15-30 range', confidence: 'medium' };
  }
  return { value: 'Premium purchase (price TBD based on scope)', confidence: 'low' };
}

function inferContentBurden(input: ConceptInput): { value: string; confidence: ConfidenceLevel } {
  const allText = Object.values(input).join(' ').toLowerCase();
  const highSignals = ['mmo', 'open world', 'hundreds', 'thousands', 'live service', 'content updates', 'dozens of zones'];
  const medSignals = ['branching', 'multiple endings', 'variants', 'procedural', 'crafting system'];
  const lowSignals = ['short', 'contained', 'single room', 'focused', 'minimalist', '8-10'];

  let score = 0;
  for (const s of highSignals) if (allText.includes(s)) score += 3;
  for (const s of medSignals) if (allText.includes(s)) score += 1;
  for (const s of lowSignals) if (allText.includes(s)) score -= 2;

  if (score >= 5) return { value: 'Extreme — requires massive content pipeline or live-service infrastructure', confidence: 'high' };
  if (score >= 2) return { value: 'Medium-high — significant asset and content creation needed', confidence: 'medium' };
  if (score <= -2) return { value: 'Low — contained scope, manageable content requirements', confidence: 'medium' };
  return { value: 'Medium — moderate content production needs', confidence: 'low' };
}

function inferScope(input: ConceptInput): { value: string; confidence: ConfidenceLevel } {
  const allText = Object.values(input).join(' ').toLowerCase();

  const massiveSignals = ['mmo', 'massively multiplayer', 'cross-play', 'open world', 'aaa', 'photorealistic', 'hundreds of quests', 'persistent world'];
  const largeSignals = ['multiplayer', 'large', 'ambitious', 'many systems', 'crafting', 'base building', 'pvp'];
  const smallSignals = ['short', 'contained', 'single room', 'focused', 'small', 'compact', 'tight scope'];

  let score = 0;
  for (const s of massiveSignals) if (allText.includes(s)) score += 4;
  for (const s of largeSignals) if (allText.includes(s)) score += 2;
  for (const s of smallSignals) if (allText.includes(s)) score -= 2;

  if (score >= 8) return { value: 'AAA/Studio-scale — far beyond solo or small-team capability', confidence: 'high' };
  if (score >= 4) return { value: 'Large — significant scope, requires careful scoping or team', confidence: 'medium' };
  if (score <= -2) return { value: 'Compact — well-suited for solo development', confidence: 'medium' };
  return { value: 'Medium — achievable with discipline and cuts', confidence: 'low' };
}

export function inferAssumptions(input: ConceptInput): InferredAssumption[] {
  const allText = [input.freePitch, input.oneSentencePitch, input.corePlayerFantasy, input.coreGameplayLoop, input.keyDifferentiators, input.genre].join(' ');
  const assumptions: InferredAssumption[] = [];

  // Genre
  if (!input.genre || input.genre.trim() === '') {
    const genreMatches = matchSignals(allText, genreSignals);
    if (genreMatches.length > 0) {
      const top = genreMatches[0];
      const secondary = genreMatches.length > 1 ? ` with ${genreMatches[1].match} elements` : '';
      assumptions.push({
        key: 'genre',
        label: 'Genre',
        value: top.match.charAt(0).toUpperCase() + top.match.slice(1) + secondary,
        confidence: top.confidence,
        status: 'pending',
        reasoning: `Detected ${top.count} genre signal(s) from your description.`,
      });
    } else {
      assumptions.push({
        key: 'genre',
        label: 'Genre',
        value: 'Could not determine — needs clarification',
        confidence: 'low',
        status: 'pending',
        reasoning: 'No clear genre signals found in your description.',
      });
    }
  }

  // Platform
  if (!input.platformTargets || input.platformTargets.trim() === '') {
    const platformMatches = matchSignals(allText, platformSignals);
    if (platformMatches.length > 0) {
      assumptions.push({
        key: 'platformTargets',
        label: 'Platform Targets',
        value: platformMatches.map(p => p.match).join(', '),
        confidence: platformMatches[0].confidence,
        status: 'pending',
        reasoning: `Platform signals detected in your description.`,
      });
    } else {
      assumptions.push({
        key: 'platformTargets',
        label: 'Platform Targets',
        value: 'PC (Steam) — default for indie games',
        confidence: 'low',
        status: 'pending',
        reasoning: 'No platform specified. PC/Steam is the safest default for indie projects.',
      });
    }
  }

  // Audience
  if (!input.intendedAudience || input.intendedAudience.trim() === '') {
    const audienceMatches = matchSignals(allText, audienceSignals);
    if (audienceMatches.length > 0) {
      assumptions.push({
        key: 'intendedAudience',
        label: 'Target Audience',
        value: audienceMatches[0].match,
        confidence: audienceMatches[0].confidence,
        status: 'pending',
        reasoning: `Audience signals inferred from concept tone and content.`,
      });
    } else {
      assumptions.push({
        key: 'intendedAudience',
        label: 'Target Audience',
        value: 'General indie game audience — needs narrowing',
        confidence: 'low',
        status: 'pending',
        reasoning: 'No clear audience signals. This needs to be defined before production.',
      });
    }
  }

  // Monetization
  if (!input.monetizationApproach || input.monetizationApproach.trim() === '') {
    const mon = inferMonetization(input);
    assumptions.push({
      key: 'monetizationApproach',
      label: 'Monetization',
      value: mon.value,
      confidence: mon.confidence,
      status: 'pending',
      reasoning: 'Inferred from scope, genre, and platform signals.',
    });
  }

  // Content burden
  if (!input.contentProductionBurden || input.contentProductionBurden.trim() === '') {
    const burden = inferContentBurden(input);
    assumptions.push({
      key: 'contentProductionBurden',
      label: 'Content Production Burden',
      value: burden.value,
      confidence: burden.confidence,
      status: 'pending',
      reasoning: 'Estimated from scope, genre, and feature descriptions.',
    });
  }

  // Scope
  const scope = inferScope(input);
  assumptions.push({
    key: 'productionScope',
    label: 'Production Scope',
    value: scope.value,
    confidence: scope.confidence,
    status: 'pending',
    reasoning: 'Estimated from all concept signals combined.',
  });

  // Camera / control style
  if (!input.cameraControlStyle || input.cameraControlStyle.trim() === '') {
    const lower = allText.toLowerCase();
    let cam = 'Third-person';
    let conf: ConfidenceLevel = 'low';
    if (lower.includes('first-person') || lower.includes('first person') || lower.includes('fps')) {
      cam = 'First-person'; conf = 'medium';
    } else if (lower.includes('top-down') || lower.includes('isometric')) {
      cam = 'Top-down / isometric'; conf = 'medium';
    } else if (lower.includes('side-scroll') || lower.includes('2d')) {
      cam = '2D side-scrolling'; conf = 'medium';
    } else if (lower.includes('third-person') || lower.includes('over-the-shoulder')) {
      cam = 'Third-person'; conf = 'medium';
    }
    assumptions.push({
      key: 'cameraControlStyle',
      label: 'Camera / Control Style',
      value: cam,
      confidence: conf,
      status: 'pending',
      reasoning: 'Inferred from gameplay description. Adjust if this does not match your vision.',
    });
  }

  return assumptions;
}

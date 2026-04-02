// Core data types for Your Game Sucks!

export type InputMode = 'pitch' | 'guided' | 'hybrid';

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type AssumptionStatus = 'accepted' | 'changed' | 'not-sure' | 'pending';

export interface InferredAssumption {
  key: string;
  label: string;
  value: string;
  confidence: ConfidenceLevel;
  status: AssumptionStatus;
  userOverride?: string;
  reasoning?: string;
}

export interface ConceptInput {
  workingTitle: string;
  oneSentencePitch: string;
  corePlayerFantasy: string;
  genre: string;
  platformTargets: string;
  cameraControlStyle: string;
  coreGameplayLoop: string;
  keyDifferentiators: string;
  similarGames: string;
  intendedAudience: string;
  monetizationApproach: string;
  visualStyleAmbition: string;
  narrativeComplexity: string;
  technicalRiskAreas: string;
  contentProductionBurden: string;
  humanCreativeEssence: string;
  aiToolsIntended: string;
  developerBackground: string;
  teamSize: string;
  availableWeeklyHours: string;
  budgetRange: string;
  desiredTimeToPrototype: string;
  desiredTimeToMVP: string;
  nonNegotiableFeatures: string;
  featuresThatCanBeCut: string;
  freePitch: string;
}

export const EMPTY_CONCEPT: ConceptInput = {
  workingTitle: '',
  oneSentencePitch: '',
  corePlayerFantasy: '',
  genre: '',
  platformTargets: '',
  cameraControlStyle: '',
  coreGameplayLoop: '',
  keyDifferentiators: '',
  similarGames: '',
  intendedAudience: '',
  monetizationApproach: '',
  visualStyleAmbition: '',
  narrativeComplexity: '',
  technicalRiskAreas: '',
  contentProductionBurden: '',
  humanCreativeEssence: '',
  aiToolsIntended: '',
  developerBackground: '',
  teamSize: '',
  availableWeeklyHours: '',
  budgetRange: '',
  desiredTimeToPrototype: '',
  desiredTimeToMVP: '',
  nonNegotiableFeatures: '',
  featuresThatCanBeCut: '',
  freePitch: '',
};

export interface ScoreCategory {
  key: string;
  label: string;
  score: number; // 1-10
  weight: number; // 0-1
  commentary: string;
}

export interface CompetitorNote {
  name: string;
  relevance: string;
  threat: string;
  differentiation: string;
}

export interface MilestoneItem {
  phase: string;
  duration: string;
  deliverables: string[];
}

// New verdict system: thumbs up, sideways, down + pivot
export type ThumbsVerdict = 'up' | 'sideways' | 'down' | 'pivot';

// Knowledge level needed
export type KnowledgeLevel = 'beginner-friendly' | 'intermediate' | 'advanced' | 'expert' | 'delusional';

// Resource estimates
export interface ResourceEstimate {
  knowledgeLevel: KnowledgeLevel;
  knowledgeDescription: string;
  budgetRange: string;
  budgetDescription: string;
  timeEstimate: string;
  timeDescription: string;
  teamSize: string;
  teamDescription: string;
}

export interface EvaluationResult {
  executiveVerdict: string;
  conceptSignal: string;
  humanCreativeEdge: string;
  marketPotential: string;
  competitorPressure: string;
  scopeRisk: string;
  soloViability: string;
  smallTeamViability: string;
  recommendedMVP: string[];
  immediateCuts: string[];
  unknownsToValidate: string[];
  goRecommendation: ThumbsVerdict;
  goRecommendationReasoning: string;
  roastCommentary: string;
  scores: ScoreCategory[];
  weightedTotal: number;
  competitors: CompetitorNote[];
  milestones: MilestoneItem[];
  resources: ResourceEstimate;
}

export type AppPhase = 'mode-select' | 'intake' | 'assumptions' | 'results';

export interface SampleConcept {
  id: string;
  label: string;
  description: string;
  tag: string;
  input: ConceptInput;
}

export interface GuidedStep {
  id: string;
  title: string;
  description: string;
  fields: (keyof ConceptInput)[];
}

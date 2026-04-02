import { useState } from 'react';
import type { EvaluationResult, ConceptInput, InferredAssumption, ScoreCategory, CompetitorNote, MilestoneItem, ThumbsVerdict, ResourceEstimate } from '@/lib/types';
import { ChevronDown, ChevronUp, RotateCcw, Target, Swords, Users, Wrench, Scale, Brain, Zap, Eye, AlertTriangle, CheckCircle2, XCircle, Clock, DollarSign, GraduationCap, UserCheck } from 'lucide-react';

interface ResultsDashboardProps {
  evaluation: EvaluationResult;
  conceptInput: ConceptInput;
  assumptions: InferredAssumption[];
  onStartOver: () => void;
}

// ===== Thumbs SVG Icons =====

function ThumbsUpIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M14 44H8C6.9 44 6 43.1 6 42V22C6 20.9 6.9 20 8 20H14M28 16V10C28 7.79 26.21 6 24 6L14 20V44H38.28C39.74 44 41 42.92 41.22 41.48L43.76 25.48C43.9 24.62 43.66 23.74 43.12 23.06C42.58 22.38 41.78 22 40.92 22H28Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ThumbsSidewaysIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M14 42H8C6.9 42 6 41.1 6 40V22C6 20.9 6.9 20 8 20H14M28 18V12C28 9.79 26.21 8 24 8L14 20V42H38.28C39.74 42 41 40.92 41.22 39.48L43.76 25.48C43.9 24.62 43.66 23.74 43.12 23.06C42.58 22.38 41.78 22 40.92 22H28Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" transform="rotate(-90 24 24)"/>
    </svg>
  );
}

function ThumbsDownIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M34 4H40C41.1 4 42 4.9 42 6V26C42 27.1 41.1 28 40 28H34M20 32V38C20 40.21 21.79 42 24 42L34 28V4H9.72C8.26 4 7 5.08 6.78 6.52L4.24 22.52C4.1 23.38 4.34 24.26 4.88 24.94C5.42 25.62 6.22 26 7.08 26H20Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

// ===== Verdict Banner =====

function VerdictBanner({ verdict, reasoning, score }: { verdict: ThumbsVerdict; reasoning: string; score: number }) {
  const config: Record<ThumbsVerdict, { label: string; sublabel: string; color: string; bgGlow: string; }> = {
    up: {
      label: 'Not Bad',
      sublabel: 'Your game might not suck',
      color: 'text-emerald-400',
      bgGlow: 'bg-emerald-500/5 border-emerald-500/25',
    },
    sideways: {
      label: 'Meh',
      sublabel: 'Needs serious work',
      color: 'text-amber-400',
      bgGlow: 'bg-amber-500/5 border-amber-500/25',
    },
    pivot: {
      label: 'Pivot',
      sublabel: 'Good idea, bad execution plan',
      color: 'text-orange-400',
      bgGlow: 'bg-orange-500/5 border-orange-500/25',
    },
    down: {
      label: 'Your Game Sucks',
      sublabel: 'Back to the drawing board',
      color: 'text-red-400',
      bgGlow: 'bg-red-500/5 border-red-500/25',
    },
  };

  const c = config[verdict];

  const ThumbIcon = verdict === 'up' ? ThumbsUpIcon
    : verdict === 'down' ? ThumbsDownIcon
    : ThumbsSidewaysIcon;

  return (
    <div className={`p-6 rounded-xl border ${c.bgGlow}`} data-testid="verdict-banner">
      <div className="flex items-center gap-5">
        <div className={`${c.color} flex-shrink-0`}>
          <ThumbIcon className="w-16 h-16" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-1">
            <span className={`text-lg font-bold tracking-tight ${c.color}`}>{c.label}</span>
            <span className="text-lg font-bold font-mono text-foreground">{score.toFixed(1)}<span className="text-sm text-muted-foreground">/10</span></span>
          </div>
          <span className="text-xs text-muted-foreground block mb-2">{c.sublabel}</span>
          <p className="text-sm text-foreground/80 leading-relaxed">{reasoning}</p>
        </div>
      </div>
    </div>
  );
}

// ===== Resource Cards =====

function ResourceCards({ resources }: { resources: ResourceEstimate }) {
  const knowledgeColors: Record<string, string> = {
    'beginner-friendly': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'intermediate': 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    'advanced': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'expert': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    'delusional': 'text-red-400 bg-red-500/10 border-red-500/20',
  };

  const knowledgeLabels: Record<string, string> = {
    'beginner-friendly': 'Beginner Friendly',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    'expert': 'Expert',
    'delusional': 'Delusional',
  };

  const cards = [
    {
      icon: GraduationCap,
      label: 'Knowledge Required',
      value: knowledgeLabels[resources.knowledgeLevel] || resources.knowledgeLevel,
      description: resources.knowledgeDescription,
      colorClass: knowledgeColors[resources.knowledgeLevel] || 'text-muted-foreground bg-muted border-border',
    },
    {
      icon: DollarSign,
      label: 'Budget Needed',
      value: resources.budgetRange,
      description: resources.budgetDescription,
      colorClass: 'text-foreground bg-muted/40 border-border/50',
    },
    {
      icon: Clock,
      label: 'Time to Ship',
      value: resources.timeEstimate,
      description: resources.timeDescription,
      colorClass: 'text-foreground bg-muted/40 border-border/50',
    },
    {
      icon: UserCheck,
      label: 'Team Required',
      value: resources.teamSize,
      description: resources.teamDescription,
      colorClass: 'text-foreground bg-muted/40 border-border/50',
    },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2" data-testid="resource-cards">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className={`p-4 rounded-lg border ${card.colorClass}`} data-testid={`card-resource-${card.label.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 flex-shrink-0 opacity-70" />
              <span className="text-[11px] font-medium uppercase tracking-wide opacity-70">{card.label}</span>
            </div>
            <div className="text-base font-bold font-mono mb-1.5">{card.value}</div>
            <p className="text-xs text-foreground/60 leading-relaxed">{card.description}</p>
          </div>
        );
      })}
    </div>
  );
}

// ===== Roast Section =====

function RoastSection({ roast }: { roast: string }) {
  if (!roast) return null;

  const paragraphs = roast.split('\n\n').filter(Boolean);

  return (
    <div className="p-4 rounded-lg border border-primary/20 bg-primary/5" data-testid="roast-section">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm">🔥</span>
        <span className="text-xs font-semibold text-primary uppercase tracking-wide">The Roast</span>
      </div>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-foreground/90 leading-relaxed italic">"{p}"</p>
        ))}
      </div>
    </div>
  );
}

// ===== Score Bar =====

function ScoreBar({ category }: { category: ScoreCategory }) {
  const width = (category.score / 10) * 100;
  const color = category.score >= 7 ? 'bg-emerald-500' : category.score >= 4 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="space-y-1" data-testid={`score-${category.key}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-foreground/80">{category.label}</span>
        <span className="text-xs font-mono font-medium text-foreground">{category.score}/10</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full score-bar-fill`} style={{ width: `${width}%` }} />
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">{category.commentary}</p>
    </div>
  );
}

// ===== Collapsible Section =====

function CollapsibleSection({ title, icon: Icon, children, defaultOpen = false }: {
  title: string;
  icon: typeof Target;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/20 transition-colors"
        data-testid={`button-section-${title.toLowerCase().replace(/\s+/g, '-')}`}
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-border/30 animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
}

function CompetitorCard({ comp }: { comp: CompetitorNote }) {
  return (
    <div className="p-3 bg-muted/30 rounded-md space-y-1.5" data-testid={`card-competitor-${comp.name}`}>
      <span className="text-xs font-medium text-foreground">{comp.name}</span>
      <div className="space-y-1">
        <p className="text-[11px] text-muted-foreground"><span className="text-foreground/70 font-medium">Relevance:</span> {comp.relevance}</p>
        <p className="text-[11px] text-muted-foreground"><span className="text-foreground/70 font-medium">Threat:</span> {comp.threat}</p>
        <p className="text-[11px] text-muted-foreground"><span className="text-foreground/70 font-medium">Your move:</span> {comp.differentiation}</p>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, index }: { milestone: MilestoneItem; index: number }) {
  return (
    <div className="flex gap-3" data-testid={`milestone-${index}`}>
      <div className="flex flex-col items-center">
        <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center text-[10px] font-bold text-primary flex-shrink-0">
          {index + 1}
        </div>
        {index < 3 && <div className="w-px flex-1 bg-border/40 mt-1" />}
      </div>
      <div className="pb-5 flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-foreground">{milestone.phase}</span>
          <span className="text-[10px] text-muted-foreground font-mono">{milestone.duration}</span>
        </div>
        <ul className="space-y-0.5">
          {milestone.deliverables.map((d, i) => (
            <li key={i} className="text-[11px] text-muted-foreground flex items-start gap-1.5">
              <span className="text-muted-foreground/50 mt-0.5">-</span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ===== Main Dashboard =====

export function ResultsDashboard({ evaluation, conceptInput, assumptions, onStartOver }: ResultsDashboardProps) {
  const e = evaluation;

  return (
    <div className="pt-8 max-w-3xl mx-auto space-y-4 stagger-children">
      {/* Title */}
      <div className="mb-2">
        <h2 className="text-lg font-semibold text-foreground tracking-tight">
          {conceptInput.workingTitle || 'Untitled Concept'} — The Verdict
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          {conceptInput.oneSentencePitch || conceptInput.freePitch?.slice(0, 100) || 'No pitch provided'}
        </p>
      </div>

      {/* Verdict banner with thumbs + score */}
      <VerdictBanner verdict={e.goRecommendation} reasoning={e.goRecommendationReasoning} score={e.weightedTotal} />

      {/* Resource estimates — the new primary section */}
      <ResourceCards resources={e.resources} />

      {/* The Roast */}
      <RoastSection roast={e.roastCommentary} />

      {/* Score breakdown */}
      <CollapsibleSection title="Score Breakdown" icon={Target} defaultOpen>
        <div className="space-y-3 mt-3">
          {e.scores.map((score) => (
            <ScoreBar key={score.key} category={score} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Concept Signal */}
      <CollapsibleSection title="Concept Signal" icon={Zap}>
        <p className="text-sm text-foreground/90 leading-relaxed mt-3">{e.conceptSignal}</p>
      </CollapsibleSection>

      {/* Competitor Pressure */}
      <CollapsibleSection title="Competitor Pressure" icon={Swords}>
        <div className="mt-3 space-y-2">
          <p className="text-sm text-foreground/90 leading-relaxed mb-3">{e.competitorPressure}</p>
          {e.competitors.length > 0 && (
            <div className="grid gap-2 sm:grid-cols-2">
              {e.competitors.map((comp, i) => (
                <CompetitorCard key={i} comp={comp} />
              ))}
            </div>
          )}
        </div>
      </CollapsibleSection>

      {/* Scope & Viability */}
      <CollapsibleSection title="Scope & Viability" icon={Scale}>
        <div className="mt-3 space-y-3">
          <p className="text-sm text-foreground/90 leading-relaxed">{e.scopeRisk}</p>
          <div className="p-3 bg-muted/30 rounded-md">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Solo Developer</span>
            <p className="text-sm text-foreground/90 leading-relaxed mt-1">{e.soloViability}</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-md">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Small Team (2-5)</span>
            <p className="text-sm text-foreground/90 leading-relaxed mt-1">{e.smallTeamViability}</p>
          </div>
        </div>
      </CollapsibleSection>

      {/* Recommended MVP */}
      <CollapsibleSection title="Recommended MVP" icon={Wrench}>
        <ul className="mt-3 space-y-1.5">
          {e.recommendedMVP.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500/70 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Kill List */}
      <CollapsibleSection title="Immediate Cuts" icon={XCircle}>
        <ul className="mt-3 space-y-1.5">
          {e.immediateCuts.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <XCircle className="w-3.5 h-3.5 text-red-500/70 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Milestones */}
      <CollapsibleSection title="Milestone Plan" icon={Clock}>
        <div className="mt-3">
          {e.milestones.map((m, i) => (
            <MilestoneCard key={i} milestone={m} index={i} />
          ))}
        </div>
      </CollapsibleSection>

      {/* Open Questions */}
      <CollapsibleSection title="Open Questions" icon={Eye}>
        <ul className="mt-3 space-y-1.5">
          {e.unknownsToValidate.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500/70 mt-0.5 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </CollapsibleSection>

      {/* Inferred Assumptions Panel */}
      {assumptions.length > 0 && (
        <CollapsibleSection title="Inferred Assumptions Used" icon={Brain}>
          <div className="mt-3 space-y-2">
            {assumptions.map((a) => (
              <div key={a.key} className="flex items-start justify-between gap-2 p-2 bg-muted/20 rounded text-xs">
                <div>
                  <span className="font-medium text-foreground/80">{a.label}:</span>{' '}
                  <span className="text-muted-foreground">
                    {a.status === 'changed' && a.userOverride ? a.userOverride : a.value}
                  </span>
                </div>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                  a.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-400' :
                  a.status === 'changed' ? 'bg-primary/10 text-primary' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </CollapsibleSection>
      )}

      {/* Start over */}
      <div className="pt-4 pb-8 flex justify-center">
        <button
          onClick={onStartOver}
          className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground border border-border/40 rounded-md hover:border-border transition-colors"
          data-testid="button-evaluate-another"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Judge Another Concept
        </button>
      </div>
    </div>
  );
}

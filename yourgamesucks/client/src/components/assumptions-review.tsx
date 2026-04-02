import { useState } from 'react';
import type { InferredAssumption, AssumptionStatus, ConfidenceLevel } from '@/lib/types';
import { ArrowLeft, ArrowRight, Check, Pencil, HelpCircle } from 'lucide-react';

interface AssumptionsReviewProps {
  assumptions: InferredAssumption[];
  onComplete: (finalAssumptions: InferredAssumption[]) => void;
  onBack: () => void;
}

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const colors = {
    high: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    low: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${colors[level]}`}>
      {level}
    </span>
  );
}

function StatusButton({ status, isActive, onClick, label, icon: Icon }: {
  status: AssumptionStatus;
  isActive: boolean;
  onClick: () => void;
  label: string;
  icon: typeof Check;
}) {
  const baseClass = 'flex items-center gap-1 px-2 py-1 text-[11px] font-medium rounded border transition-all';
  const activeClass = {
    accepted: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    changed: 'bg-primary/15 text-primary border-primary/30',
    'not-sure': 'bg-muted text-muted-foreground border-border',
    pending: 'bg-muted text-muted-foreground border-border',
  };
  const inactiveClass = 'bg-transparent text-muted-foreground/70 border-border/40 hover:border-border';

  return (
    <button
      onClick={onClick}
      className={`${baseClass} ${isActive ? activeClass[status] : inactiveClass}`}
      data-testid={`button-status-${status}`}
    >
      <Icon className="w-3 h-3" />
      {label}
    </button>
  );
}

export function AssumptionsReview({ assumptions, onComplete, onBack }: AssumptionsReviewProps) {
  const [items, setItems] = useState<InferredAssumption[]>(
    assumptions.map((a) => ({ ...a }))
  );

  const updateItem = (index: number, updates: Partial<InferredAssumption>) => {
    setItems((prev) => prev.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const allReviewed = items.every((item) => item.status !== 'pending');

  return (
    <div className="pt-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Review Inferred Assumptions</h2>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The tool inferred these from your input. Accept what is correct, change what is wrong,
          or mark items as "not sure" — the evaluation will account for uncertainty.
        </p>
      </div>

      {items.length === 0 && (
        <div className="text-center py-12 text-sm text-muted-foreground">
          All fields were provided — no assumptions needed. Proceeding to evaluation.
        </div>
      )}

      <div className="space-y-3 stagger-children">
        {items.map((item, index) => (
          <div
            key={item.key}
            className={`p-4 rounded-lg border transition-colors ${
              item.status === 'pending' ? 'border-border/60 bg-card' :
              item.status === 'accepted' ? 'border-emerald-500/20 bg-emerald-500/5' :
              item.status === 'changed' ? 'border-primary/20 bg-primary/5' :
              'border-border/40 bg-card/50'
            }`}
            data-testid={`card-assumption-${item.key}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <span className="text-xs font-medium text-foreground">{item.label}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <ConfidenceBadge level={item.confidence} />
                  {item.reasoning && (
                    <span className="text-[10px] text-muted-foreground">{item.reasoning}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-3">
              {item.status === 'changed' ? (
                <input
                  type="text"
                  value={item.userOverride ?? item.value}
                  onChange={(e) => updateItem(index, { userOverride: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm bg-background border border-primary/30 rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                  data-testid={`input-override-${item.key}`}
                  autoFocus
                />
              ) : (
                <p className="text-sm text-foreground/90">{item.value}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <StatusButton
                status="accepted"
                isActive={item.status === 'accepted'}
                onClick={() => updateItem(index, { status: 'accepted' })}
                label="Accept"
                icon={Check}
              />
              <StatusButton
                status="changed"
                isActive={item.status === 'changed'}
                onClick={() => updateItem(index, { status: 'changed', userOverride: item.userOverride ?? item.value })}
                label="Change"
                icon={Pencil}
              />
              <StatusButton
                status="not-sure"
                isActive={item.status === 'not-sure'}
                onClick={() => updateItem(index, { status: 'not-sure' })}
                label="Not Sure"
                icon={HelpCircle}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-back-to-intake"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Intake
        </button>

        <div className="flex items-center gap-3">
          {!allReviewed && items.length > 0 && (
            <span className="text-[11px] text-muted-foreground">
              {items.filter(i => i.status === 'pending').length} items to review
            </span>
          )}
          <button
            onClick={() => {
              // Auto-accept any still pending
              const final = items.map((item) => item.status === 'pending' ? { ...item, status: 'accepted' as AssumptionStatus } : item);
              onComplete(final);
            }}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            data-testid="button-run-evaluation"
          >
            {items.length === 0 ? 'Run Evaluation' : allReviewed ? 'Run Evaluation' : 'Accept Remaining & Evaluate'}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

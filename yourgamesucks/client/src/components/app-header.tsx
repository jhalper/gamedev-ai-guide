import type { AppPhase } from '@/lib/types';
import { RotateCcw } from 'lucide-react';

interface AppHeaderProps {
  phase: AppPhase;
  onStartOver: () => void;
}

const phaseLabels: Record<AppPhase, string> = {
  'mode-select': '',
  'intake': 'Concept Intake',
  'assumptions': 'Review Assumptions',
  'results': 'The Verdict',
};

export function AppHeader({ phase, onStartOver }: AppHeaderProps) {
  return (
    <header className="border-b border-border/60 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Thumbs-down icon as logo */}
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Your Game Sucks!" className="text-primary">
            <path d="M18 4H9.5C8.56 4 7.76 4.58 7.42 5.38L4.1 13.12C4.04 13.3 4 13.5 4 13.72V15.5C4 16.6 4.9 17.5 6 17.5H11.54L10.78 21.2L10.76 21.42C10.76 21.82 10.92 22.2 11.18 22.48L12.18 23.5L18.34 17.34C18.7 16.98 18.92 16.48 18.92 15.92V5.58C18.92 4.7 18.22 4 17.34 4H18ZM20.5 4V16H24V4H20.5Z" fill="currentColor" />
          </svg>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-foreground leading-none">
              Your Game Sucks!
            </h1>
            {phaseLabels[phase] && (
              <span className="text-xs text-muted-foreground">{phaseLabels[phase]}</span>
            )}
          </div>
        </div>

        {phase !== 'mode-select' && (
          <button
            onClick={onStartOver}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded"
            data-testid="button-start-over"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Start Over
          </button>
        )}
      </div>
    </header>
  );
}

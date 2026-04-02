import { useState } from 'react';
import type { InputMode, ConceptInput } from '@/lib/types';
import { EMPTY_CONCEPT } from '@/lib/types';
import { sampleConcepts } from '@/lib/samples';
import { FileText, ListChecks, Blend, ChevronRight, FlaskConical } from 'lucide-react';

interface ModeSelectorProps {
  onSelect: (mode: InputMode) => void;
  onLoadSample: (input: ConceptInput) => void;
  onStartEvaluation: (input: ConceptInput) => void;
}

const modes: { id: InputMode; title: string; description: string; icon: typeof FileText }[] = [
  {
    id: 'pitch',
    title: 'Pitch First',
    description: 'Describe your game idea in plain language. The tool will infer genre, audience, scope, and more from your pitch.',
    icon: FileText,
  },
  {
    id: 'guided',
    title: 'Guided Questionnaire',
    description: 'Step-by-step structured intake. Best if you already know your genre, platform, and audience.',
    icon: ListChecks,
  },
  {
    id: 'hybrid',
    title: 'Hybrid Mode',
    description: 'Start with your pitch, then answer targeted clarifying questions only where uncertainty matters.',
    icon: Blend,
  },
];

export function ModeSelector({ onSelect, onLoadSample, onStartEvaluation }: ModeSelectorProps) {
  const [showSamples, setShowSamples] = useState(false);

  return (
    <div className="pt-12 sm:pt-20 pb-8">
      <div className="text-center mb-10">
        <h2 className="text-xl font-semibold text-foreground tracking-tight mb-2" data-testid="text-main-title">
          Your Game Sucks!
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Find out if your game concept is brilliant, mediocre, or a complete dumpster fire.
          No hand-holding. No participation trophies. Just a brutally honest reality check.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3 mb-8">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <button
              key={mode.id}
              onClick={() => onSelect(mode.id)}
              className="group text-left p-4 rounded-lg border border-border/60 bg-card hover:border-primary/40 transition-all duration-200"
              data-testid={`button-mode-${mode.id}`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded bg-muted">
                  <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">{mode.title}</h3>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{mode.description}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="border-t border-border/40 pt-6">
        <button
          onClick={() => setShowSamples(!showSamples)}
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto"
          data-testid="button-toggle-samples"
        >
          <FlaskConical className="w-3.5 h-3.5" />
          {showSamples ? 'Hide' : 'Try'} sample concepts
        </button>

        {showSamples && (
          <div className="grid gap-3 sm:grid-cols-3 mt-4 animate-fade-in">
            {sampleConcepts.map((sample) => (
              <button
                key={sample.id}
                onClick={() => onStartEvaluation(sample.input)}
                className="text-left p-3 rounded-lg border border-border/40 bg-card/50 hover:border-primary/30 transition-all"
                data-testid={`button-sample-${sample.id}`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-medium text-foreground">{sample.label}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-medium">{sample.tag}</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{sample.description}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { useState, useCallback } from 'react';
import type { InputMode, ConceptInput, InferredAssumption, EvaluationResult, AppPhase } from '@/lib/types';
import { EMPTY_CONCEPT } from '@/lib/types';
import { inferAssumptions } from '@/lib/inference';
import { evaluateConcept } from '@/lib/evaluation';
import { ModeSelector } from '@/components/mode-selector';
import { IntakeForm } from '@/components/intake-form';
import { AssumptionsReview } from '@/components/assumptions-review';
import { ResultsDashboard } from '@/components/results-dashboard';
import { AppHeader } from '@/components/app-header';

export default function Home() {
  const [phase, setPhase] = useState<AppPhase>('mode-select');
  const [inputMode, setInputMode] = useState<InputMode>('pitch');
  const [conceptInput, setConceptInput] = useState<ConceptInput>({ ...EMPTY_CONCEPT });
  const [assumptions, setAssumptions] = useState<InferredAssumption[]>([]);
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);

  const handleModeSelect = useCallback((mode: InputMode) => {
    setInputMode(mode);
    setPhase('intake');
  }, []);

  const handleIntakeComplete = useCallback((input: ConceptInput) => {
    setConceptInput(input);
    const inferred = inferAssumptions(input);
    setAssumptions(inferred);
    setPhase('assumptions');
  }, []);

  const handleAssumptionsComplete = useCallback((finalAssumptions: InferredAssumption[]) => {
    setAssumptions(finalAssumptions);
    // Apply accepted/changed assumptions back to input
    const updatedInput = { ...conceptInput };
    for (const a of finalAssumptions) {
      if (a.status === 'changed' && a.userOverride) {
        const key = a.key as keyof ConceptInput;
        if (key in updatedInput) {
          (updatedInput as Record<string, string>)[key] = a.userOverride;
        }
      } else if (a.status === 'accepted') {
        const key = a.key as keyof ConceptInput;
        if (key in updatedInput && !(updatedInput as Record<string, string>)[key]) {
          (updatedInput as Record<string, string>)[key] = a.value;
        }
      }
    }
    setConceptInput(updatedInput);
    const result = evaluateConcept(updatedInput, finalAssumptions);
    setEvaluation(result);
    setPhase('results');
  }, [conceptInput]);

  const handleStartOver = useCallback(() => {
    setPhase('mode-select');
    setConceptInput({ ...EMPTY_CONCEPT });
    setAssumptions([]);
    setEvaluation(null);
  }, []);

  const handleLoadSample = useCallback((sample: ConceptInput) => {
    setConceptInput(sample);
  }, []);

  const handleBackToIntake = useCallback(() => {
    setPhase('intake');
  }, []);

  return (
    <div className="min-h-screen bg-background" data-testid="app-container">
      <AppHeader
        phase={phase}
        onStartOver={handleStartOver}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        {phase === 'mode-select' && (
          <ModeSelector
            onSelect={handleModeSelect}
            onLoadSample={handleLoadSample}
            onStartEvaluation={(input) => {
              setConceptInput(input);
              setInputMode('pitch');
              const inferred = inferAssumptions(input);
              setAssumptions(inferred);
              setPhase('assumptions');
            }}
          />
        )}

        {phase === 'intake' && (
          <IntakeForm
            mode={inputMode}
            initialInput={conceptInput}
            onComplete={handleIntakeComplete}
            onBack={() => setPhase('mode-select')}
          />
        )}

        {phase === 'assumptions' && (
          <AssumptionsReview
            assumptions={assumptions}
            onComplete={handleAssumptionsComplete}
            onBack={handleBackToIntake}
          />
        )}

        {phase === 'results' && evaluation && (
          <ResultsDashboard
            evaluation={evaluation}
            conceptInput={conceptInput}
            assumptions={assumptions}
            onStartOver={handleStartOver}
          />
        )}
      </main>
    </div>
  );
}

import { useState, useCallback } from 'react';
import type { InputMode, ConceptInput, GuidedStep } from '@/lib/types';
import { EMPTY_CONCEPT } from '@/lib/types';
import { ArrowLeft, ArrowRight, Send, ChevronDown, ChevronUp } from 'lucide-react';

interface IntakeFormProps {
  mode: InputMode;
  initialInput: ConceptInput;
  onComplete: (input: ConceptInput) => void;
  onBack: () => void;
}

const fieldLabels: Record<keyof ConceptInput, { label: string; placeholder: string; hint?: string }> = {
  freePitch: { label: 'Your Game Pitch', placeholder: 'Describe your game idea in your own words. What is it? What does the player do? What makes it interesting? Include anything you already know — genre, platform, audience, mechanics, inspirations, whatever is on your mind.', hint: 'Write naturally. The tool will infer what it can from your description.' },
  workingTitle: { label: 'Working Title', placeholder: 'What are you calling this project?', hint: 'Even a temporary name helps anchor the concept.' },
  oneSentencePitch: { label: 'One-Sentence Pitch', placeholder: 'Describe the game in a single sentence.', hint: 'If you cannot say it in one sentence, the concept may not be focused enough.' },
  corePlayerFantasy: { label: 'Core Player Fantasy', placeholder: 'What does the player get to feel or be? What experience are you selling?', hint: 'This is the emotional hook, not the mechanic.' },
  genre: { label: 'Genre', placeholder: 'e.g., Horror, RPG, Puzzle, Narrative Adventure, Roguelike...', hint: 'Leave blank if unsure — the tool will suggest one.' },
  platformTargets: { label: 'Platform Targets', placeholder: 'e.g., PC (Steam), Console, Mobile, VR, Web...', hint: 'Leave blank if undecided.' },
  cameraControlStyle: { label: 'Camera / Control Style', placeholder: 'e.g., First-person, Third-person, Top-down, Side-scrolling...', hint: 'Leave blank if not yet determined.' },
  coreGameplayLoop: { label: 'Core Gameplay Loop', placeholder: 'What does the player do repeatedly? What is the action → reward → escalation cycle?', hint: 'The loop is the game. Everything else is wrapping.' },
  keyDifferentiators: { label: 'Key Differentiators', placeholder: 'What makes this game different from similar games? What is the hook?', hint: 'Be specific. "It is unique" is not a differentiator.' },
  similarGames: { label: 'Similar Games / Inspirations', placeholder: 'e.g., Journey, Hades, Papers Please, Stardew Valley...', hint: 'Naming comparables shows market awareness.' },
  intendedAudience: { label: 'Intended Audience', placeholder: 'Who is this for? Age range, gaming preferences, buying behavior...', hint: '"Everyone" is not an audience. Be specific.' },
  monetizationApproach: { label: 'Monetization Approach', placeholder: 'e.g., Premium $15-20, F2P with cosmetics, Subscription...', hint: 'Leave blank if unsure.' },
  visualStyleAmbition: { label: 'Visual Style Ambition', placeholder: 'e.g., Low-fi pixel art, Painterly, Photorealistic, Stylized 3D...', hint: 'Visual ambition directly affects production time and cost.' },
  narrativeComplexity: { label: 'Narrative Complexity', placeholder: 'e.g., Minimal, Medium (linear story), High (branching narrative)...', hint: 'More narrative = more writing, testing, and QA.' },
  technicalRiskAreas: { label: 'Technical Risk Areas', placeholder: 'What is technically hard about this game? Networking? Procedural generation? AI? Custom shaders?', hint: 'Identifying risks early is a sign of experience.' },
  contentProductionBurden: { label: 'Content Production Burden', placeholder: 'How much content does this game need? Levels, characters, items, quests, dialogue...', hint: 'Content volume is the silent killer of indie projects.' },
  humanCreativeEssence: { label: 'What Must Feel Uniquely Human', placeholder: 'What part of this project must come from human creativity and cannot be templated or automated?', hint: 'This is where your game lives or dies as a creative work.' },
  aiToolsIntended: { label: 'AI Tools Intended (Optional)', placeholder: 'Any AI tools planned for research, ideation, production assistance, or pipeline acceleration?', hint: 'Optional. AI is a tool, not a feature. Be honest about intended use.' },
  developerBackground: { label: 'Developer Background', placeholder: 'Years of experience, shipped games, engine expertise, weak areas...', hint: 'Honest self-assessment improves the evaluation.' },
  teamSize: { label: 'Team Size', placeholder: 'e.g., 1 solo developer, 2 devs + 1 artist, 5 person team...', hint: 'Include part-time contributors.' },
  availableWeeklyHours: { label: 'Available Weekly Hours', placeholder: 'e.g., 20-25 hours, 40 hours full-time...', hint: 'Be realistic, not aspirational.' },
  budgetRange: { label: 'Budget Range', placeholder: 'e.g., $0 (sweat equity), $5,000, $50,000...', hint: 'Include all costs: assets, tools, marketing, audio.' },
  desiredTimeToPrototype: { label: 'Time to Prototype', placeholder: 'e.g., 6 weeks, 3 months...', hint: 'The prototype proves the core mechanic works.' },
  desiredTimeToMVP: { label: 'Time to MVP', placeholder: 'e.g., 6 months, 12 months...', hint: 'MVP = minimum complete experience, not the full vision.' },
  nonNegotiableFeatures: { label: 'Non-Negotiable Features', placeholder: 'Features that MUST ship. If you cannot cut it, list it here.', hint: 'Fewer is better. Every non-negotiable increases risk.' },
  featuresThatCanBeCut: { label: 'Features That Can Be Cut', placeholder: 'Features you would like to have but could ship without.', hint: 'A long cut list shows production maturity.' },
};

const guidedSteps: GuidedStep[] = [
  {
    id: 'concept',
    title: 'The Concept',
    description: 'What is this game?',
    fields: ['workingTitle', 'oneSentencePitch', 'corePlayerFantasy'],
  },
  {
    id: 'design',
    title: 'Design Foundations',
    description: 'How does the game play?',
    fields: ['genre', 'platformTargets', 'cameraControlStyle', 'coreGameplayLoop'],
  },
  {
    id: 'market',
    title: 'Market Position',
    description: 'Who is this for and what else is out there?',
    fields: ['keyDifferentiators', 'similarGames', 'intendedAudience', 'monetizationApproach'],
  },
  {
    id: 'production',
    title: 'Production Reality',
    description: 'What does it take to build this?',
    fields: ['visualStyleAmbition', 'narrativeComplexity', 'technicalRiskAreas', 'contentProductionBurden'],
  },
  {
    id: 'creative',
    title: 'Creative Identity',
    description: 'What makes this uniquely yours?',
    fields: ['humanCreativeEssence', 'aiToolsIntended'],
  },
  {
    id: 'resources',
    title: 'Resources & Timeline',
    description: 'What do you have to work with?',
    fields: ['developerBackground', 'teamSize', 'availableWeeklyHours', 'budgetRange', 'desiredTimeToPrototype', 'desiredTimeToMVP'],
  },
  {
    id: 'scope',
    title: 'Scope Control',
    description: 'What stays and what goes?',
    fields: ['nonNegotiableFeatures', 'featuresThatCanBeCut'],
  },
];

function FieldInput({ field, value, onChange }: { field: keyof ConceptInput; value: string; onChange: (v: string) => void }) {
  const meta = fieldLabels[field];
  const isLarge = field === 'freePitch' || field === 'corePlayerFantasy' || field === 'coreGameplayLoop' || field === 'keyDifferentiators' || field === 'humanCreativeEssence';

  return (
    <div className="space-y-1.5">
      <label htmlFor={`field-${field}`} className="block text-xs font-medium text-foreground">
        {meta.label}
      </label>
      {meta.hint && (
        <p className="text-[11px] text-muted-foreground leading-relaxed">{meta.hint}</p>
      )}
      {isLarge ? (
        <textarea
          id={`field-${field}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={meta.placeholder}
          rows={field === 'freePitch' ? 8 : 4}
          className="w-full px-3 py-2 text-sm bg-background border border-border/60 rounded-md text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 resize-y"
          data-testid={`input-${field}`}
        />
      ) : (
        <input
          id={`field-${field}`}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={meta.placeholder}
          className="w-full px-3 py-2 text-sm bg-background border border-border/60 rounded-md text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50"
          data-testid={`input-${field}`}
        />
      )}
    </div>
  );
}

export function IntakeForm({ mode, initialInput, onComplete, onBack }: IntakeFormProps) {
  const [input, setInput] = useState<ConceptInput>(initialInput);
  const [currentStep, setCurrentStep] = useState(0);
  const [expandedHybridSection, setExpandedHybridSection] = useState<string | null>(null);

  const updateField = useCallback((field: keyof ConceptInput, value: string) => {
    setInput((prev) => ({ ...prev, [field]: value }));
  }, []);

  const canSubmit = input.freePitch.trim().length > 20 || input.oneSentencePitch.trim().length > 10 || input.corePlayerFantasy.trim().length > 10;

  // PITCH MODE
  if (mode === 'pitch') {
    return (
      <div className="pt-8 max-w-2xl mx-auto">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-1">Describe Your Game</h2>
          <p className="text-xs text-muted-foreground">
            Write everything you know about the concept. Genre, mechanics, audience, inspirations, scope —
            whatever you have. The tool will infer the rest.
          </p>
        </div>

        <FieldInput field="freePitch" value={input.freePitch} onChange={(v) => updateField('freePitch', v)} />

        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back
          </button>
          <button
            onClick={() => onComplete(input)}
            disabled={!canSubmit}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            data-testid="button-evaluate"
          >
            Evaluate
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // GUIDED MODE
  if (mode === 'guided') {
    const step = guidedSteps[currentStep];
    const isLast = currentStep === guidedSteps.length - 1;

    return (
      <div className="pt-8 max-w-2xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-1 mb-6">
          {guidedSteps.map((s, i) => (
            <div
              key={s.id}
              className={`h-1 flex-1 rounded-full transition-colors ${i <= currentStep ? 'bg-primary' : 'bg-muted'}`}
            />
          ))}
        </div>

        <div className="mb-6">
          <p className="text-[11px] text-muted-foreground font-medium mb-1">Step {currentStep + 1} of {guidedSteps.length}</p>
          <h2 className="text-lg font-semibold text-foreground mb-1">{step.title}</h2>
          <p className="text-xs text-muted-foreground">{step.description}</p>
        </div>

        <div className="space-y-5">
          {step.fields.map((field) => (
            <FieldInput
              key={field}
              field={field}
              value={input[field]}
              onChange={(v) => updateField(field, v)}
            />
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <button
            onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onBack()}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-back-step"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {currentStep > 0 ? 'Previous' : 'Back'}
          </button>

          {isLast ? (
            <button
              onClick={() => onComplete(input)}
              disabled={!canSubmit}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              data-testid="button-evaluate"
            >
              Evaluate
              <Send className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
              data-testid="button-next-step"
            >
              Next
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    );
  }

  // HYBRID MODE
  return (
    <div className="pt-8 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-1">Start With Your Pitch</h2>
        <p className="text-xs text-muted-foreground">
          Write your pitch first. Then expand any sections below to add more detail where you have it.
        </p>
      </div>

      <FieldInput field="freePitch" value={input.freePitch} onChange={(v) => updateField('freePitch', v)} />

      <div className="mt-6 space-y-2">
        {guidedSteps.map((step) => (
          <div key={step.id} className="border border-border/40 rounded-md overflow-hidden">
            <button
              onClick={() => setExpandedHybridSection(expandedHybridSection === step.id ? null : step.id)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/30 transition-colors"
              data-testid={`button-expand-${step.id}`}
            >
              <div>
                <span className="text-xs font-medium text-foreground">{step.title}</span>
                <span className="text-[11px] text-muted-foreground ml-2">{step.description}</span>
              </div>
              {expandedHybridSection === step.id ? (
                <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </button>
            {expandedHybridSection === step.id && (
              <div className="px-3 pb-4 pt-2 space-y-4 border-t border-border/30 animate-fade-in">
                {step.fields.map((field) => (
                  <FieldInput
                    key={field}
                    field={field}
                    value={input[field]}
                    onChange={(v) => updateField(field, v)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          data-testid="button-back"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
        <button
          onClick={() => onComplete(input)}
          disabled={!canSubmit}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          data-testid="button-evaluate"
        >
          Evaluate
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

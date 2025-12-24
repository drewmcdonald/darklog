import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useSession, updateSession } from '../hooks';
import { Header, BackButton, Button, Input, Select, Card } from '../components';
import { formatSeconds, parseTimeInput } from '../utils/time';
import { SURFACES } from '../utils/defaults';
import type { SessionDefaults, ProcessingStep } from '../types';

function ChemistryStepEditor({
  step,
  index,
  onUpdate,
  onRemove,
}: {
  step: ProcessingStep;
  index: number;
  onUpdate: (step: ProcessingStep) => void;
  onRemove: () => void;
}) {
  return (
    <Card padding="compact" className="mb-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-text-secondary">Step {index + 1}</span>
        <button
          onClick={onRemove}
          className="bg-transparent border-none text-error cursor-pointer text-xl"
        >
          &times;
        </button>
      </div>
      <Input
        label="Chemical"
        value={step.chemical}
        onChange={(e) => onUpdate({ ...step, chemical: e.target.value })}
      />
      <div className="flex gap-4 mt-2">
        <Input
          label="Dilution"
          value={step.dilution}
          onChange={(e) => onUpdate({ ...step, dilution: e.target.value })}
          className="flex-1 min-w-0"
        />
        <Input
          label="Duration"
          value={formatSeconds(step.duration)}
          onChange={(e) => {
            const seconds = parseTimeInput(e.target.value);
            if (seconds !== null) onUpdate({ ...step, duration: seconds });
          }}
          className="flex-1 min-w-0"
        />
      </div>
      <div className="mt-2">
        <Input
          label="Agitation Interval (sec)"
          type="number"
          value={step.agitationInterval ?? ''}
          onChange={(e) => onUpdate({ ...step, agitationInterval: e.target.value ? parseInt(e.target.value) : null })}
          placeholder="e.g. 30 (empty = continuous)"
        />
      </div>
    </Card>
  );
}

export function SessionSetup() {
  const { state, goHome, goToPrintEditor, setSession } = useApp();
  const sessionId = state.screen.name === 'sessionSetup' ? state.screen.sessionId : undefined;
  const { session, loading } = useSession(sessionId);

  const [defaults, setDefaults] = useState<SessionDefaults | null>(null);
  const [chemistryExpanded, setChemistryExpanded] = useState(true);

  useEffect(() => {
    if (session) setDefaults(session.defaults);
  }, [session]);

  const handleSave = async () => {
    if (!session || !defaults) return;
    const updated = await updateSession(session.id, { defaults });
    if (updated) {
      setSession(updated);
      goToPrintEditor(session.id);
    }
  };

  const addStep = () => {
    if (!defaults) return;
    setDefaults({
      ...defaults,
      processing: {
        ...defaults.processing,
        steps: [...defaults.processing.steps, { chemical: '', dilution: 'stock', duration: 60, agitationInterval: 30 }],
      },
    });
  };

  const updateStep = (index: number, step: ProcessingStep) => {
    if (!defaults) return;
    const steps = [...defaults.processing.steps];
    steps[index] = step;
    setDefaults({ ...defaults, processing: { ...defaults.processing, steps } });
  };

  const removeStep = (index: number) => {
    if (!defaults) return;
    setDefaults({ ...defaults, processing: { ...defaults.processing, steps: defaults.processing.steps.filter((_, i) => i !== index) } });
  };

  if (loading || !defaults) {
    return (
      <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
        <Header title="SESSION SETUP" leftAction={<BackButton onClick={goHome} />} />
        <div className="flex-1 p-4 overflow-y-auto text-center text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
      <Header title="SESSION SETUP" leftAction={<BackButton onClick={goHome} />} />
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-4">
          <Input label="Lens" value={defaults.lens} onChange={(e) => setDefaults({ ...defaults, lens: e.target.value })} placeholder="e.g. 50mm El-Nikkor" />
        </div>

        <div className="text-sm text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
          Paper
        </div>
        <div className="mb-4">
          <Input label="Manufacturer" value={defaults.paper.manufacturer} onChange={(e) => setDefaults({ ...defaults, paper: { ...defaults.paper, manufacturer: e.target.value } })} />
        </div>
        <div className="mb-4">
          <Input label="Name" value={defaults.paper.name} onChange={(e) => setDefaults({ ...defaults, paper: { ...defaults.paper, name: e.target.value } })} />
        </div>
        <div className="mb-4">
          <Select label="Surface" value={defaults.paper.surface} onChange={(e) => setDefaults({ ...defaults, paper: { ...defaults.paper, surface: e.target.value } })} options={SURFACES.map((s) => ({ value: s, label: s }))} />
        </div>

        <button
          onClick={() => setChemistryExpanded(!chemistryExpanded)}
          className="w-full text-sm text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border bg-transparent border-none cursor-pointer hover:text-text-primary transition-colors"
        >
          <span className="text-lg leading-none">{chemistryExpanded ? '▼' : '▶'}</span>
          Chemistry Sequence
        </button>
        {chemistryExpanded && (
          <>
            {defaults.processing.steps.map((step, i) => (
              <ChemistryStepEditor key={i} step={step} index={i} onUpdate={(s) => updateStep(i, s)} onRemove={() => removeStep(i)} />
            ))}
            <Button variant="secondary" onClick={addStep}>+ Add Step</Button>
          </>
        )}

        <div className="mb-4 mt-4">
          <Input label="Temperature (°C)" type="number" value={defaults.processing.temperature ?? ''} onChange={(e) => setDefaults({ ...defaults, processing: { ...defaults.processing, temperature: e.target.value ? parseInt(e.target.value) : null } })} />
        </div>
      </div>
      <div className="p-4 border-t border-border">
        <Button onClick={handleSave}>START SESSION</Button>
      </div>
    </div>
  );
}

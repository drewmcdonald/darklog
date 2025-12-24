import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useSession, usePrint, createPrint, updatePrint, useStickyValues } from '../hooks';
import { Header, BackButton, Button, Input, Select, Card } from '../components';
import { PAPER_SIZES, APERTURES, CONTRAST_GRADES } from '../utils/defaults';
import type { PrintRecord, TestStrip, ContrastSetting } from '../types';
import { generateId, timestamp } from '../utils/id';

export function PrintEditor() {
  const { state, goHome, goToTimer, setPrint } = useApp();
  const screen = state.screen;
  const sessionId = screen.name === 'printEditor' ? screen.sessionId : '';
  const printId = screen.name === 'printEditor' ? screen.printId : undefined;

  const { session } = useSession(sessionId);
  const { print: existingPrint } = usePrint(printId);
  const { sticky, update: updateSticky } = useStickyValues();

  const [print, setPrintState] = useState<Partial<PrintRecord> | null>(null);
  const [showTestStripForm, setShowTestStripForm] = useState(false);
  const [testStripForm, setTestStripForm] = useState({ baseTime: 8, interval: 2, stripCount: 5 });

  useEffect(() => {
    if (existingPrint) {
      setPrintState(existingPrint);
    } else if (session && sticky) {
      setPrintState({
        sessionId,
        rollId: sticky.rollId,
        frameNumber: sticky.frameNumber,
        paper: {
          manufacturer: session.defaults.paper.manufacturer,
          name: session.defaults.paper.name,
          surface: session.defaults.paper.surface,
          size: sticky.paperSize,
          contrast: sticky.contrast,
        },
        exposure: {
          aperture: sticky.aperture,
          baseTime: sticky.baseTime,
          enlargerHeight: sticky.enlargerHeight,
          lens: session.defaults.lens,
        },
        processing: session.defaults.processing,
        testStrips: [],
        notes: '',
        rating: null,
      });
    }
  }, [existingPrint, session, sticky, sessionId]);

  const handleStartTimer = async () => {
    if (!print || !session) return;

    await updateSticky({
      rollId: print.rollId ?? '',
      frameNumber: print.frameNumber ?? '',
      paperSize: print.paper?.size ?? '8x10',
      contrast: print.paper?.contrast ?? { type: 'multigrade', filterValue: 2.5 },
      aperture: print.exposure?.aperture ?? 8,
      baseTime: print.exposure?.baseTime ?? 10,
      enlargerHeight: print.exposure?.enlargerHeight ?? null,
    });

    let savedPrint: PrintRecord | undefined;
    if (printId && existingPrint) {
      savedPrint = await updatePrint(printId, print as Partial<PrintRecord>);
    } else {
      savedPrint = await createPrint({
        sessionId,
        rollId: print.rollId,
        frameNumber: print.frameNumber,
        paper: print.paper,
        exposure: print.exposure,
        processing: print.processing,
      });
    }

    if (savedPrint) {
      setPrint(savedPrint);
      goToTimer(sessionId, savedPrint.id);
    }
  };

  const addTestStrip = () => {
    if (!print) return;
    const newStrip: TestStrip = {
      id: generateId(),
      createdAt: timestamp(),
      baseTime: testStripForm.baseTime,
      interval: testStripForm.interval,
      stripCount: testStripForm.stripCount,
      selectedStrip: null,
      notes: '',
    };
    setPrintState({ ...print, testStrips: [...(print.testStrips ?? []), newStrip] });
    setShowTestStripForm(false);
  };

  const selectStrip = (stripId: string, selected: number) => {
    if (!print) return;
    const strips = (print.testStrips ?? []).map((s) =>
      s.id === stripId ? { ...s, selectedStrip: s.selectedStrip === selected ? null : selected } : s
    );
    setPrintState({ ...print, testStrips: strips });
  };

  if (!session || !print) {
    return (
      <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
        <Header title="NEW PRINT" leftAction={<BackButton onClick={goHome} />} />
        <div className="flex-1 p-4 overflow-y-auto text-center text-text-muted">Loading...</div>
      </div>
    );
  }

  const contrastOptions = CONTRAST_GRADES.map((g) => ({ value: g.toString(), label: `MG ${g}` }));

  return (
    <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
      <Header title={printId ? 'EDIT PRINT' : 'NEW PRINT'} leftAction={<BackButton onClick={goHome} />} />
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex gap-4 mb-4">
          <Input label="Roll" value={print.rollId ?? ''} onChange={(e) => setPrintState({ ...print, rollId: e.target.value })} placeholder="e.g. HP5 R12" className="flex-1 min-w-0" />
          <Input label="Frame" value={print.frameNumber ?? ''} onChange={(e) => setPrintState({ ...print, frameNumber: e.target.value })} placeholder="e.g. 24" className="flex-1 min-w-0" />
        </div>

        <div className="text-sm text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
          Exposure
        </div>
        <div className="flex gap-4 mb-4">
          <Select
            label="Aperture"
            value={print.exposure?.aperture?.toString() ?? '8'}
            onChange={(e) => setPrintState({ ...print, exposure: { ...print.exposure!, aperture: parseFloat(e.target.value) } })}
            options={APERTURES.map((a) => ({ value: a.toString(), label: `f/${a}` }))}
            className="flex-1 min-w-0"
          />
          <Input
            label="Time (sec)"
            type="number"
            value={print.exposure?.baseTime ?? ''}
            onChange={(e) => setPrintState({ ...print, exposure: { ...print.exposure!, baseTime: parseInt(e.target.value) || 0 } })}
            className="flex-1 min-w-0"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <Input
            label="Height"
            value={print.exposure?.enlargerHeight ?? ''}
            onChange={(e) => setPrintState({ ...print, exposure: { ...print.exposure!, enlargerHeight: e.target.value ? parseInt(e.target.value) : null } })}
            placeholder="cm"
            className="flex-1 min-w-0"
          />
          <Select
            label="Contrast"
            value={print.paper?.contrast?.filterValue?.toString() ?? '2.5'}
            onChange={(e) => setPrintState({ ...print, paper: { ...print.paper!, contrast: { type: 'multigrade', filterValue: parseFloat(e.target.value) } as ContrastSetting } })}
            options={contrastOptions}
            className="flex-1 min-w-0"
          />
        </div>
        <div className="mb-4">
          <Select
            label="Paper Size"
            value={print.paper?.size ?? '8x10'}
            onChange={(e) => setPrintState({ ...print, paper: { ...print.paper!, size: e.target.value } })}
            options={PAPER_SIZES.map((s) => ({ value: s, label: s }))}
          />
        </div>

        <div className="text-sm text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
          Test Strips ({print.testStrips?.length ?? 0})
        </div>
        {(print.testStrips ?? []).map((strip) => (
          <Card key={strip.id} padding="compact" className="mb-4">
            <div className="text-text-secondary mb-2">
              {strip.baseTime}s base &middot; {strip.interval}s interval &middot; {strip.stripCount} strips
            </div>
            <div className="flex gap-1 flex-wrap">
              {Array.from({ length: strip.stripCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => selectStrip(strip.id, n)}
                  className={`w-9 h-9 rounded border cursor-pointer text-text-primary ${
                    strip.selectedStrip === n
                      ? 'border-2 border-success bg-success'
                      : 'border-border bg-bg-elevated'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            {strip.selectedStrip && (
              <div className="text-text-secondary mt-2">
                Selected: {strip.baseTime + (strip.selectedStrip - 1) * strip.interval}s
              </div>
            )}
          </Card>
        ))}

        {showTestStripForm ? (
          <Card padding="compact" className="mb-4">
            <div className="flex gap-4 mb-2">
              <Input label="Base (s)" type="number" value={testStripForm.baseTime} onChange={(e) => setTestStripForm({ ...testStripForm, baseTime: parseInt(e.target.value) || 0 })} className="flex-1 min-w-0" />
              <Input label="Interval (s)" type="number" value={testStripForm.interval} onChange={(e) => setTestStripForm({ ...testStripForm, interval: parseInt(e.target.value) || 0 })} className="flex-1 min-w-0" />
              <Input label="Strips" type="number" value={testStripForm.stripCount} onChange={(e) => setTestStripForm({ ...testStripForm, stripCount: parseInt(e.target.value) || 0 })} className="flex-1 min-w-0" />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => setShowTestStripForm(false)}>Cancel</Button>
              <Button onClick={addTestStrip}>Add</Button>
            </div>
          </Card>
        ) : (
          <Button variant="secondary" onClick={() => setShowTestStripForm(true)}>+ Add Test Strip</Button>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <Button onClick={handleStartTimer}>START TIMER</Button>
      </div>
    </div>
  );
}

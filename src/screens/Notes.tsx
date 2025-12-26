import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { usePrint, updatePrint } from '../hooks';
import { Header, Button, RatingPicker, Card, SessionContext } from '../components';

export function Notes() {
  const { state, goToPrintEditor, goHome } = useApp();
  const screen = state.screen;
  const sessionId = screen.name === 'notes' ? screen.sessionId : '';
  const printId = screen.name === 'notes' ? screen.printId : '';

  const { print, loading } = usePrint(printId);
  const [notes, setNotes] = useState('');
  const [rating, setRating] = useState<number | null>(null);

  useEffect(() => {
    if (print) {
      setNotes(print.notes);
      setRating(print.rating);
    }
  }, [print]);

  const handleSave = async () => {
    if (!print) return;
    await updatePrint(printId, { notes, rating });
  };

  const handleReprint = async () => {
    await handleSave();
    goToPrintEditor(sessionId, printId);
  };

  const handleNewFrame = async () => {
    await handleSave();
    goToPrintEditor(sessionId);
  };

  const handleFinish = async () => {
    await handleSave();
    goHome();
  };

  if (loading || !print) {
    return (
      <div className="flex-1 flex flex-col max-w-125 mx-auto w-full md:border-x md:border-border">
        <Header title="PRINT COMPLETE" />
        <div className="flex-1 p-4 overflow-y-auto text-center text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-125 mx-auto w-full md:border-x md:border-border">
      <Header title="PRINT COMPLETE" />
      <SessionContext sessionId={sessionId} />
      <div className="flex-1 p-4 overflow-y-auto">
        <Card className="mb-6">
          <div className="font-medium mb-1">
            {print.rollId} &middot; Frame {print.frameNumber}
          </div>
          <div className="text-text-secondary">
            f/{print.exposure.aperture} &middot; {print.exposure.baseTime}s &middot; MG {print.paper.contrast.filterValue}
          </div>
        </Card>

        <div className="mb-4">
          <label className="text-sm text-text-secondary font-medium block mb-1.5">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Dodging, burning, observations..."
            rows={5}
            className="w-full py-3.5 px-4 bg-bg-secondary border-2 border-border rounded-lg text-text-primary text-lg resize-y focus:outline-none focus:border-accent"
          />
        </div>

        <div className="mb-4">
          <RatingPicker value={rating} onChange={setRating} />
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex flex-col gap-3">
          <div>
            <Button onClick={handleReprint}>REPRINT</Button>
            <div className="text-xs text-text-muted text-center mt-1.5">
              Same frame, adjust settings
            </div>
          </div>
          <div>
            <Button variant="secondary" onClick={handleNewFrame}>NEW FRAME</Button>
            <div className="text-xs text-text-muted text-center mt-1.5">
              Next negative, keep settings
            </div>
          </div>
          <Button variant="secondary" onClick={handleFinish}>FINISH SESSION</Button>
        </div>
      </div>
    </div>
  );
}

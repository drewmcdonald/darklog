import { useApp } from '../context/AppContext';
import { useSession, usePrint } from '../hooks';
import { Header, BackButton, Button, SessionContext } from '../components';

export function ExposureReview() {
  const { state, goToPrintEditor, goToTimer } = useApp();
  const screen = state.screen;
  const sessionId = screen.name === 'exposureReview' ? screen.sessionId : '';
  const printId = screen.name === 'exposureReview' ? screen.printId : '';

  const { session } = useSession(sessionId);
  const { print } = usePrint(printId);

  if (!session || !print) {
    return (
      <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
        <Header
          title="EXPOSURE REVIEW"
          leftAction={<BackButton onClick={() => goToPrintEditor(sessionId, printId)} />}
        />
        <div className="flex-1 p-4 overflow-y-auto text-center text-text-muted">Loading...</div>
      </div>
    );
  }

  const contrastDisplay = print.paper.contrast.type === 'multigrade'
    ? `MG ${print.paper.contrast.filterValue}`
    : `Grade ${print.paper.contrast.grade}`;

  return (
    <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
      <Header
        title="EXPOSURE REVIEW"
        leftAction={<BackButton onClick={() => goToPrintEditor(sessionId, printId)} />}
      />
      <SessionContext sessionId={sessionId} />
      <div className="flex-1 flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-[400px]">
          <div className="text-center mb-6">
            <div className="text-sm text-text-muted uppercase tracking-wider">
              {print.rollId} • Frame {print.frameNumber}
            </div>
          </div>

          <div className="bg-bg-elevated border border-border rounded-lg p-4 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xs text-text-muted uppercase tracking-wide mb-1.5">
                  Aperture
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  f/{print.exposure.aperture}
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-text-muted uppercase tracking-wide mb-1.5">
                  Time
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  {print.exposure.baseTime}s
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-text-muted uppercase tracking-wide mb-1.5">
                  Contrast
                </div>
                <div className="text-3xl font-bold text-text-primary">
                  {contrastDisplay}
                </div>
              </div>
            </div>

            {print.exposure.enlargerHeight && (
              <div className="mt-4 pt-4 border-t border-border text-center">
                <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                  Enlarger Height
                </div>
                <div className="text-lg text-text-secondary">
                  {print.exposure.enlargerHeight} cm
                </div>
              </div>
            )}
          </div>

          <Button size="large" onClick={() => goToTimer(sessionId, printId)}>
            START DEVELOPMENT
          </Button>
        </div>
      </div>
    </div>
  );
}

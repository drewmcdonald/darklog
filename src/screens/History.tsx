import { useApp } from '../context/AppContext';
import { useSessions, useSessionPrints } from '../hooks';
import { Header, BackButton, Card } from '../components';
import { formatFullDate } from '../utils/time';
import type { Session } from '../types';

function SessionHistoryCard({ session }: { session: Session }) {
  const { prints } = useSessionPrints(session.id);

  return (
    <Card className="mb-4">
      <div className="font-medium mb-2">
        {formatFullDate(session.date)}
      </div>
      <div className="text-text-secondary mb-2">
        {session.defaults.paper.name} &middot; {session.defaults.lens}
      </div>
      <div className="text-text-muted">
        {prints.length} print{prints.length !== 1 ? 's' : ''}
      </div>
      {prints.length > 0 && (
        <div className="mt-3 pt-3 border-t border-border">
          {prints.slice(0, 5).map((p) => (
            <div key={p.id} className="text-text-secondary text-sm mb-1">
              {p.rollId} #{p.frameNumber} &middot; f/{p.exposure.aperture} &middot; {p.exposure.baseTime}s
              {p.rating && ` · ${'★'.repeat(p.rating)}`}
            </div>
          ))}
          {prints.length > 5 && (
            <div className="text-text-muted text-sm">
              +{prints.length - 5} more
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

export function History() {
  const { goHome } = useApp();
  const { sessions, loading } = useSessions();

  if (loading) {
    return (
      <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
        <Header title="HISTORY" leftAction={<BackButton onClick={goHome} />} />
        <div className="flex-1 p-4 overflow-y-auto text-center text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
      <Header title="HISTORY" leftAction={<BackButton onClick={goHome} />} />
      <div className="flex-1 p-4 overflow-y-auto">
        {sessions.length === 0 ? (
          <div className="text-center text-text-muted">No sessions yet</div>
        ) : (
          sessions.map((session) => (
            <SessionHistoryCard key={session.id} session={session} />
          ))
        )}
      </div>
    </div>
  );
}

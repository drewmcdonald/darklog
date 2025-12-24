import { useApp } from '../context/AppContext';
import { useSessions, useSessionPrints, deleteSession, deletePrint } from '../hooks';
import { Header, BackButton, Card } from '../components';
import { formatFullDate } from '../utils/time';
import type { Session, PrintRecord } from '../types';

function SessionHistoryCard({
  session,
  onDelete
}: {
  session: Session;
  onDelete: () => void;
}) {
  const { prints, refresh } = useSessionPrints(session.id);

  const handleDeleteSession = async () => {
    if (!confirm(`Delete this session and all ${prints.length} print${prints.length !== 1 ? 's' : ''}?`)) {
      return;
    }

    try {
      // Delete all prints in this session first
      await Promise.all(prints.map(print => deletePrint(print.id)));

      // Then delete the session
      await deleteSession(session.id);

      // Notify parent to refresh
      onDelete();
    } catch (error) {
      console.error('Error deleting session:', error);
      alert('Failed to delete session');
    }
  };

  const handleDeletePrint = async (print: PrintRecord) => {
    if (!confirm(`Delete print ${print.rollId} #${print.frameNumber}?`)) {
      return;
    }

    try {
      await deletePrint(print.id);
      await refresh();
    } catch (error) {
      console.error('Error deleting print:', error);
      alert('Failed to delete print');
    }
  };

  return (
    <Card className="mb-4">
      <div className="flex justify-between items-start mb-2">
        <div className="font-medium">
          {formatFullDate(session.date)}
        </div>
        <button
          onClick={handleDeleteSession}
          className="text-text-muted hover:text-text-primary transition-colors px-2 -mt-1"
          title="Delete session"
        >
          ✕
        </button>
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
            <div key={p.id} className="text-text-secondary text-sm mb-1 flex justify-between items-center group">
              <span>
                {p.rollId} #{p.frameNumber} &middot; f/{p.exposure.aperture} &middot; {p.exposure.baseTime}s
                {p.rating && ` · ${'★'.repeat(p.rating)}`}
              </span>
              <button
                onClick={() => handleDeletePrint(p)}
                className="text-text-muted hover:text-text-primary transition-colors px-2 opacity-0 group-hover:opacity-100"
                title="Delete print"
              >
                ✕
              </button>
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
  const { sessions, loading, refresh } = useSessions();

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
            <SessionHistoryCard key={session.id} session={session} onDelete={refresh} />
          ))
        )}
      </div>
    </div>
  );
}

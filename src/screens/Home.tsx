import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { useSessions, createSession, useSessionPrints } from '../hooks';
import { Header, IconButton, Button, Card } from '../components';
import { formatDate } from '../utils/time';
import { DEFAULT_SESSION_DEFAULTS } from '../utils/defaults';
import type { Session } from '../types';

function SessionCard({
  session,
  isToday,
  onContinue,
  onClick,
}: {
  session: Session;
  isToday: boolean;
  onContinue: () => void;
  onClick: () => void;
}) {
  const { prints } = useSessionPrints(session.id);

  return (
    <Card
      className="flex justify-between items-center cursor-pointer transition-colors duration-150 hover:bg-bg-elevated"
      onClick={onClick}
    >
      <div className="flex flex-col gap-1">
        <div className="text-lg font-medium">
          {isToday ? 'Today' : formatDate(session.createdAt)}, {formatDate(session.date)}
        </div>
        <div className="text-sm text-text-secondary">
          {prints.length} print{prints.length !== 1 ? 's' : ''}
          {session.defaults.paper.name && ` · ${session.defaults.paper.name}`}
        </div>
      </div>
      {isToday && (
        <Button variant="primary" fullWidth={false} onClick={(e) => {
          e.stopPropagation();
          onContinue();
        }}>
          Continue
        </Button>
      )}
    </Card>
  );
}

export function Home() {
  const { goToSettings, goToSessionSetup, goToPrintEditor, setSession } = useApp();
  const { sessions, loading } = useSessions();
  const [todaysSession, setTodaysSession] = useState<Session | null>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const found = sessions.find((s) => s.date === today);
    setTodaysSession(found ?? null);
  }, [sessions, today]);

  const handleNewSession = async () => {
    const session = await createSession(DEFAULT_SESSION_DEFAULTS);
    setSession(session);
    goToSessionSetup(session.id);
  };

  const handleContinueSession = (session: Session) => {
    setSession(session);
    goToPrintEditor(session.id);
  };

  const handleEditSession = (session: Session) => {
    setSession(session);
    goToSessionSetup(session.id);
  };

  const pastSessions = sessions.filter((s) => s.date !== today);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
        <Header
          title="DarkLog"
          rightAction={<IconButton icon="⚙" label="Settings" onClick={goToSettings} />}
        />
        <div className="flex-1 p-4 overflow-y-auto text-center text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
      <Header
        title="DarkLog"
        rightAction={<IconButton icon="⚙" label="Settings" onClick={goToSettings} />}
      />
      <div className="flex-1 p-4 overflow-y-auto">
        {todaysSession && (
          <div className="mb-6">
            <SessionCard
              session={todaysSession}
              isToday={true}
              onContinue={() => handleContinueSession(todaysSession)}
              onClick={() => handleEditSession(todaysSession)}
            />
          </div>
        )}

        <div className="mb-6">
          <Button onClick={handleNewSession}>+ NEW SESSION</Button>
        </div>

        {pastSessions.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
              Past Sessions
            </div>
            <div className="flex flex-col gap-2">
              {pastSessions.map((session) => (
                <SessionCard
                  key={session.id}
                  session={session}
                  isToday={false}
                  onContinue={() => handleContinueSession(session)}
                  onClick={() => handleEditSession(session)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

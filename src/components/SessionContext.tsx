import { useSession, useSessionPrints } from '../hooks';

interface SessionContextProps {
  sessionId: string;
}

export function SessionContext({ sessionId }: SessionContextProps) {
  const { session } = useSession(sessionId);
  const { prints } = useSessionPrints(sessionId);

  if (!session) return null;

  const printCount = prints.length;
  const paperName = session.defaults.paper.name || session.defaults.paper.manufacturer;

  return (
    <div className="bg-bg-secondary border-b border-border py-2 px-4">
      <div className="text-xs text-text-muted text-center">
        {new Date(session.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} •{' '}
        {paperName} • Print #{printCount + 1}
      </div>
    </div>
  );
}

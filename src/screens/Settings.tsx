import { useApp } from '../context/AppContext';
import { useAppSettings } from '../hooks';
import { Header, BackButton, Input, Card } from '../components';

export function Settings() {
  const { goHome } = useApp();
  const { settings, loading, update } = useAppSettings();

  const vibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  if (loading || !settings) {
    return (
      <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
        <Header title="SETTINGS" leftAction={<BackButton onClick={goHome} />} />
        <div className="flex-1 p-4 overflow-y-auto text-center text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-[500px] mx-auto w-full md:border-x md:border-border">
      <Header title="SETTINGS" leftAction={<BackButton onClick={goHome} />} />
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="text-sm text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
          Timer
        </div>

        <Card className="mb-4">
          <div className="mb-4">
            <Input
              label="Transfer Delay (seconds)"
              type="number"
              value={settings.transferDelay}
              onChange={(e) => update({ transferDelay: parseInt(e.target.value) || 2 })}
            />
          </div>
          <div>
            <Input
              label="Default Agitation Interval (seconds)"
              type="number"
              value={settings.defaultAgitationInterval}
              onChange={(e) => update({ defaultAgitationInterval: parseInt(e.target.value) || 30 })}
            />
          </div>
        </Card>

        <div className="text-sm text-text-muted uppercase tracking-wider mb-4 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
          Alerts
        </div>

        <Card>
          <div className="mb-4">
            <label className="flex items-center justify-between cursor-pointer min-h-[48px] -m-3 p-3 rounded active:bg-surface-elevated transition-colors">
              <span className="text-lg">Sound</span>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => update({ soundEnabled: e.target.checked })}
                className="w-6 h-6 accent-accent cursor-pointer"
              />
            </label>
          </div>
          <div>
            <label className={`flex items-center justify-between cursor-pointer min-h-[48px] -m-3 p-3 rounded active:bg-surface-elevated transition-colors ${!vibrationSupported ? 'opacity-50' : ''}`}>
              <div className="flex flex-col">
                <span className="text-lg">Vibration</span>
                {!vibrationSupported && (
                  <span className="text-xs text-text-muted mt-1">Not supported on this device</span>
                )}
              </div>
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) => update({ vibrationEnabled: e.target.checked })}
                disabled={!vibrationSupported}
                className="w-6 h-6 accent-accent cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </label>
          </div>
        </Card>

        <div className="text-sm text-text-muted uppercase tracking-wider mb-4 mt-6 px-2 flex items-center gap-2 before:content-[''] before:flex-1 before:h-px before:bg-border after:content-[''] after:flex-1 after:h-px after:bg-border">
          About
        </div>
        <Card>
          <div className="text-text-secondary">
            <p className="mb-2">DarkLog v1.0</p>
            <p>A darkroom printing assistant.</p>
            <p className="mt-2">All data stored locally on device.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

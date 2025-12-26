import { useApp } from './context/AppContext';
import {
  Home,
  SessionSetup,
  PrintEditor,
  ExposureReview,
  Timer,
  Notes,
  Settings,
  History,
} from './screens';

function AppContent() {
  const { state } = useApp();

  switch (state.screen.name) {
    case 'home':
      return <Home />;
    case 'sessionSetup':
      return <SessionSetup />;
    case 'printEditor':
      return <PrintEditor />;
    case 'exposureReview':
      return <ExposureReview />;
    case 'timer':
      return <Timer />;
    case 'notes':
      return <Notes />;
    case 'settings':
      return <Settings />;
    case 'history':
      return <History />;
    default:
      return <Home />;
  }
}

export default function App() {
  return <AppContent />;
}

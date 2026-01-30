import React, { Component, ReactNode } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { CrewManagement } from './pages/CrewManagement';
import { WatchConfiguration } from './pages/WatchConfiguration';
import { CrewDetail } from './pages/CrewDetail';
import { SettingsPage } from './pages/Settings';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

// Error Boundary Component
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-slate-900">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full border border-red-100">
            <h1 className="text-xl font-bold text-red-600 mb-2">Something went wrong</h1>
            <p className="text-sm text-gray-600 mb-4">The application encountered a critical error.</p>
            
            <div className="bg-gray-100 p-3 rounded text-xs font-mono text-gray-700 overflow-auto max-h-32 mb-4 border border-gray-200">
              {this.state.error?.message || "Unknown error"}
            </div>
            
            <div className="flex gap-3">
                <button 
                onClick={() => window.location.hash = '#/'}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                >
                Go Home
                </button>
                <button 
                onClick={() => { localStorage.clear(); window.location.reload(); }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                Reset Data
                </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const MainContent = () => {
  const { currentRoute } = useApp();

  if (currentRoute === '/') return <Dashboard />;
  if (currentRoute === '/crew') return <CrewManagement />;
  if (currentRoute.startsWith('/crew/')) return <CrewDetail />;
  if (currentRoute === '/config') return <WatchConfiguration />;
  if (currentRoute === '/settings') return <SettingsPage />;
  
  // Default fallback
  return <Dashboard />;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Layout>
          <MainContent />
        </Layout>
      </AppProvider>
    </ErrorBoundary>
  );
};

export default App;
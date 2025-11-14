import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { Navigation } from './components/layout/Navigation';
import { Home } from './components/modules/Home';
import { TestSelector } from './components/modules/TestSelector';
import { Glossary } from './components/modules/Glossary';

function App() {
  const { darkMode, currentView } = useAppStore();

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'test-selector':
        return <TestSelector />;
      case 'glossary':
        return <Glossary />;
      case 'learning':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Learning Modules</h2>
              <p className="text-muted-foreground">Coming soon: Interactive learning modules</p>
            </div>
          </div>
        );
      case 'assumption-checker':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Assumption Checker</h2>
              <p className="text-muted-foreground">Coming soon: Interactive assumption validation tool</p>
            </div>
          </div>
        );
      case 'regression-playground':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Regression Playground</h2>
              <p className="text-muted-foreground">Coming soon: Interactive regression model explorer</p>
            </div>
          </div>
        );
      case 'cases':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Interactive Cases</h2>
              <p className="text-muted-foreground">Coming soon: Clinical case scenarios</p>
            </div>
          </div>
        );
      case 'assessment':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Knowledge Assessment</h2>
              <p className="text-muted-foreground">Coming soon: Quiz and assessment module</p>
            </div>
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main>{renderView()}</main>
      <footer className="border-t mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            StatsMD - Educational tool for statistical method selection and interpretation
          </p>
          <p className="mt-2">
            For educational purposes only. Not for clinical decision-making.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

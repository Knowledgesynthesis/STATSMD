import { useEffect } from 'react';
import { useAppStore } from './stores/useAppStore';
import { Navigation } from './components/layout/Navigation';
import { Home } from './components/modules/Home';
import { TestSelector } from './components/modules/TestSelector';
import { Glossary } from './components/modules/Glossary';
import { AssumptionChecker } from './components/modules/AssumptionChecker';
import { RegressionPlayground } from './components/modules/RegressionPlayground';
import { CaseLibrary } from './components/modules/CaseLibrary';
import { Assessment } from './components/modules/Assessment';

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
      case 'assumption-checker':
        return <AssumptionChecker />;
      case 'regression-playground':
        return <RegressionPlayground />;
      case 'cases':
        return <CaseLibrary />;
      case 'assessment':
        return <Assessment />;
      case 'learning':
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Learning Modules</h2>
              <p className="text-muted-foreground">
                Explore the other sections for comprehensive learning materials
              </p>
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
